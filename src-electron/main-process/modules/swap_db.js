import Database from "better-sqlite3";
import path from "upath";
import os from "os";
import fs from "fs-extra";
import crypto from "crypto";
import { safeStorage } from "electron";
import { toMsEpoch } from "../../utils.js";

const DB_FILE_NAME = "beldex_wallet.db";

// Prefix marking a column value as safeStorage-encrypted (base64 ciphertext
// follows). Rows written before this fix - or written on a machine where
// OS-level encryption isn't available - have no prefix and are returned
// as-is, so older databases keep working without a migration step.
const ENCRYPTED_FIELD_PREFIX = "encv1:";

// Columns that can hold a third-party exchange's addresses/memos or its full
// raw response - the fields actually worth protecting at rest. wallet_address,
// exchange, txn_id and the rest stay plaintext: they're used in WHERE clauses
// and indexes, and aren't independently sensitive the way an address is.
const ENCRYPTED_FIELDS = [
  "payin_address",
  "payin_address_memo",
  "payout_address",
  "payout_address_memo",
  "refund_address",
  "refund_address_memo",
  "raw_response"
];

export class SwapDatabaseManager {
  constructor(dbDir = null) {
    this.dbDir = dbDir || this._getDefaultDbDir();
    this.db = null;
    this.statements = {};
  }

  _getDefaultDbDir() {
    if (os.platform() === "win32") {
      const appDataDir = `${os.homedir()}\\AppData\\Roaming`;
      return `${appDataDir}\\Beldex`;
    }
    if (os.platform() === "darwin") {
      return path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Beldex"
      );
    }
    // Linux and anything else: honour XDG_CONFIG_HOME when set, matching the
    // Windows/macOS moves above to an app-data location instead of a plain,
    // always-visible folder directly under the home directory.
    const xdgConfigHome =
      process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
    return path.join(xdgConfigHome, "Beldex");
  }

  // Pre-fix default on every platform was a plain "Beldex" folder directly
  // under the home directory (Windows additionally had a "Documents\Beldex"
  // variant even further back) - used to locate and move forward any
  // existing DB when a caller falls back to _getDefaultDbDir().
  _getLegacyDbDirs() {
    if (os.platform() === "win32") {
      return [`${os.homedir()}\\Documents\\Beldex`];
    }
    return [path.join(os.homedir(), "Beldex")];
  }

  _migrateLegacyDb(newDbPath) {
    try {
      for (const legacyDir of this._getLegacyDbDirs()) {
        const legacyDbPath = path.join(legacyDir, DB_FILE_NAME);
        if (legacyDbPath === newDbPath) {
          continue;
        }
        if (!fs.existsSync(legacyDbPath) || fs.existsSync(newDbPath)) {
          continue;
        }
        fs.mkdirpSync(path.dirname(newDbPath));
        // Move the main DB file plus its WAL-mode sidecar files together -
        // leaving -wal/-shm behind can strand committed-but-not-yet-
        // checkpointed rows in the old location.
        for (const suffix of ["", "-wal", "-shm"]) {
          const src = `${legacyDbPath}${suffix}`;
          const dest = `${newDbPath}${suffix}`;
          if (fs.existsSync(src)) {
            fs.moveSync(src, dest);
          }
        }
        console.log(
          `[SwapDatabaseManager] Migrated legacy DB from ${legacyDbPath} to ${newDbPath}`
        );
        return;
      }
    } catch (err) {
      console.error("[SwapDatabaseManager] Legacy DB migration error:", err);
    }
  }

  _restrictDirPermissions() {
    try {
      fs.chmodSync(this.dbDir, 0o700);
    } catch (err) {
      console.error(
        "[SwapDatabaseManager] Failed to restrict DB directory permissions:",
        err
      );
    }
  }

  _restrictFilePermissions(dbPath) {
    try {
      fs.chmodSync(dbPath, 0o600);
    } catch (err) {
      console.error(
        "[SwapDatabaseManager] Failed to restrict DB file permissions:",
        err
      );
    }
  }

  _isEncryptionAvailable() {
    return (
      safeStorage &&
      typeof safeStorage.isEncryptionAvailable === "function" &&
      safeStorage.isEncryptionAvailable()
    );
  }

  _encryptField(value) {
    if (value == null) return value;
    if (!this._isEncryptionAvailable()) return value;
    try {
      const encrypted = safeStorage.encryptString(String(value));
      return `${ENCRYPTED_FIELD_PREFIX}${encrypted.toString("base64")}`;
    } catch (err) {
      console.error("[SwapDatabaseManager] Failed to encrypt field:", err);
      return value;
    }
  }

  _decryptField(value) {
    if (
      typeof value !== "string" ||
      !value.startsWith(ENCRYPTED_FIELD_PREFIX)
    ) {
      return value;
    }
    if (!this._isEncryptionAvailable()) {
      // Can't decrypt on this machine right now (OS keychain locked/
      // unavailable) - surface as unavailable rather than returning ciphertext.
      return null;
    }
    try {
      return safeStorage.decryptString(
        Buffer.from(value.slice(ENCRYPTED_FIELD_PREFIX.length), "base64")
      );
    } catch (err) {
      console.error("[SwapDatabaseManager] Failed to decrypt field:", err);
      return null;
    }
  }

  _decryptRow(row) {
    if (!row) return row;
    const decrypted = { ...row };
    for (const field of ENCRYPTED_FIELDS) {
      decrypted[field] = this._decryptField(decrypted[field]);
    }
    return decrypted;
  }

  getDbPath() {
    return path.join(this.dbDir, DB_FILE_NAME);
  }

  init() {
    if (this.db) {
      return;
    }

    try {
      fs.mkdirpSync(this.dbDir);
      this._restrictDirPermissions();
      const dbPath = this.getDbPath();
      console.log(`[SwapDatabaseManager] Initializing database at: ${dbPath}`);
      this._migrateLegacyDb(dbPath);
      this.db = new Database(dbPath);
      this._restrictFilePermissions(dbPath);
      this.db.pragma("journal_mode = WAL");
      this.db.pragma("synchronous = NORMAL");

      this._createTables();
      this._prepareStatements();
      console.log(`[SwapDatabaseManager] Database initialized at: ${dbPath}`);
    } catch (err) {
      console.error("[SwapDatabaseManager] Database init error:", err);
      throw err;
    }
  }

  _createTables() {
    const createTxnTable = `
      CREATE TABLE IF NOT EXISTS swap_transactions_history (
        uuid TEXT PRIMARY KEY NOT NULL,
        wallet_address TEXT NOT NULL,
        exchange TEXT NOT NULL,
        txn_id TEXT NOT NULL,
        txn_status TEXT NOT NULL,
        txn_type TEXT NOT NULL,
        swap_type TEXT NOT NULL,
        currency_from TEXT NOT NULL,
        network_from TEXT,
        currency_to TEXT NOT NULL,
        network_to TEXT,
        payin_address TEXT,
        payin_address_memo TEXT,
        payout_address TEXT,
        payout_address_memo TEXT,
        refund_address TEXT,
        refund_status TEXT DEFAULT 'not_returned',
        refund_address_memo TEXT,
        amount_from REAL,
        amount_to REAL,
        network_fee REAL DEFAULT 0,
        platform_fee REAL DEFAULT 0,
        raw_response TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(exchange, txn_id)
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_swap_txn_wallet_created 
        ON swap_transactions_history (wallet_address, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_swap_txn_exchange_id 
        ON swap_transactions_history (exchange, txn_id);
    `;

    const createMetaTable = `
      CREATE TABLE IF NOT EXISTS swap_db_metadata (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `;

    this.db.exec(createTxnTable);
    this.db.exec(createIndexes);
    this.db.exec(createMetaTable);
  }

  _prepareStatements() {
    this.statements.upsertTxn = this.db.prepare(`
      INSERT INTO swap_transactions_history (
        uuid, wallet_address, exchange, txn_id, txn_status, txn_type, swap_type,
        currency_from, network_from, currency_to, network_to,
        payin_address, payin_address_memo, payout_address, payout_address_memo,
        refund_address, refund_status, refund_address_memo,
        amount_from, amount_to, network_fee, platform_fee,
        raw_response, created_at, updated_at
      ) VALUES (
        @uuid, @wallet_address, @exchange, @txn_id, @txn_status, @txn_type, @swap_type,
        @currency_from, @network_from, @currency_to, @network_to,
        @payin_address, @payin_address_memo, @payout_address, @payout_address_memo,
        @refund_address, @refund_status, @refund_address_memo,
        @amount_from, @amount_to, @network_fee, @platform_fee,
        @raw_response, @created_at, @updated_at
      )
      ON CONFLICT(exchange, txn_id) DO UPDATE SET
        wallet_address = COALESCE(NULLIF(excluded.wallet_address, ''), swap_transactions_history.wallet_address),
        txn_status = excluded.txn_status,
        txn_type = COALESCE(NULLIF(excluded.txn_type, ''), swap_transactions_history.txn_type),
        swap_type = COALESCE(NULLIF(excluded.swap_type, ''), swap_transactions_history.swap_type),
        currency_from = COALESCE(NULLIF(excluded.currency_from, ''), swap_transactions_history.currency_from),
        network_from = COALESCE(excluded.network_from, swap_transactions_history.network_from),
        currency_to = COALESCE(NULLIF(excluded.currency_to, ''), swap_transactions_history.currency_to),
        network_to = COALESCE(excluded.network_to, swap_transactions_history.network_to),
        payin_address = COALESCE(excluded.payin_address, swap_transactions_history.payin_address),
        payin_address_memo = COALESCE(excluded.payin_address_memo, swap_transactions_history.payin_address_memo),
        payout_address = COALESCE(excluded.payout_address, swap_transactions_history.payout_address),
        payout_address_memo = COALESCE(excluded.payout_address_memo, swap_transactions_history.payout_address_memo),
        refund_address = COALESCE(excluded.refund_address, swap_transactions_history.refund_address),
        refund_status = COALESCE(excluded.refund_status, swap_transactions_history.refund_status),
        refund_address_memo = COALESCE(excluded.refund_address_memo, swap_transactions_history.refund_address_memo),
        amount_from = COALESCE(excluded.amount_from, swap_transactions_history.amount_from),
        amount_to = COALESCE(excluded.amount_to, swap_transactions_history.amount_to),
        network_fee = COALESCE(excluded.network_fee, swap_transactions_history.network_fee),
        platform_fee = COALESCE(excluded.platform_fee, swap_transactions_history.platform_fee),
        raw_response = COALESCE(excluded.raw_response, swap_transactions_history.raw_response),
        created_at = swap_transactions_history.created_at,
        updated_at = excluded.updated_at;
    `);

    this.statements.getOrderHistory = this.db.prepare(`
      SELECT * FROM swap_transactions_history
      WHERE wallet_address = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?;
    `);

    this.statements.getOrderHistoryCount = this.db.prepare(`
      SELECT COUNT(*) as count FROM swap_transactions_history
      WHERE wallet_address = ?;
    `);

    this.statements.getAllOrderHistory = this.db.prepare(`
      SELECT * FROM swap_transactions_history
      WHERE wallet_address = ?
      ORDER BY created_at DESC;
    `);

    this.statements.getTxnByProviderId = this.db.prepare(`
      SELECT * FROM swap_transactions_history
      WHERE exchange = ? AND txn_id = ?;
    `);

    this.statements.getTxnById = this.db.prepare(`
      SELECT * FROM swap_transactions_history
      WHERE txn_id = ? LIMIT 1;
    `);

    this.statements.getExistingTxnIds = this.db.prepare(`
      SELECT txn_id FROM swap_transactions_history
      WHERE wallet_address = ?;
    `);

    this.statements.getMeta = this.db.prepare(`
      SELECT value FROM swap_db_metadata WHERE key = ?;
    `);

    this.statements.setMeta = this.db.prepare(`
      INSERT INTO swap_db_metadata (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `);
  }

  upsertTransaction(tx) {
    this.init();
    const now = Date.now();
    const rawVal = tx.created_at ?? tx.createdAt ?? now;
    const createdAt = toMsEpoch(rawVal);

    const payload = {
      uuid: crypto.randomUUID(),
      wallet_address: tx.wallet_address || "",
      exchange: tx.exchange || "changelly",
      txn_id: tx.txn_id,
      txn_status: tx.txn_status || "waiting",
      txn_type: tx.txn_type || "float",
      swap_type: tx.swap_type || "normal",
      currency_from: tx.currency_from || "",
      network_from: tx.network_from || null,
      currency_to: tx.currency_to || "",
      network_to: tx.network_to || null,
      payin_address: this._encryptField(tx.payin_address || null),
      payin_address_memo: this._encryptField(tx.payin_address_memo || null),
      payout_address: this._encryptField(tx.payout_address || null),
      payout_address_memo: this._encryptField(tx.payout_address_memo || null),
      refund_address: this._encryptField(tx.refund_address || null),
      refund_status: tx.refund_status || "not_returned",
      refund_address_memo: this._encryptField(tx.refund_address_memo || null),
      amount_from: tx.amount_from != null ? Number(tx.amount_from) : null,
      amount_to: tx.amount_to != null ? Number(tx.amount_to) : null,
      network_fee: tx.network_fee != null ? Number(tx.network_fee) : 0,
      platform_fee: tx.platform_fee != null ? Number(tx.platform_fee) : 0,
      raw_response: this._encryptField(
        typeof tx.raw_response === "object"
          ? JSON.stringify(tx.raw_response)
          : tx.raw_response || null
      ),
      created_at: createdAt,
      updated_at: tx.updated_at ? Number(tx.updated_at) : now
    };

    return this.statements.upsertTxn.run(payload);
  }

  batchUpsertTransactions(txArray) {
    this.init();
    const insertMany = this.db.transaction(txs => {
      for (const tx of txs) {
        this.upsertTransaction(tx);
      }
    });
    insertMany(txArray);
  }

  getOrderHistory(walletAddress, page = 1, pageSize = 7) {
    this.init();
    if (!walletAddress) return [];
    const limit = Math.max(1, Number(pageSize) || 7);
    const offset = Math.max(0, (Math.max(1, Number(page) || 1) - 1) * limit);
    return this.statements.getOrderHistory
      .all(walletAddress, limit, offset)
      .map(row => this._decryptRow(row));
  }

  getAllOrderHistory(walletAddress) {
    this.init();
    if (!walletAddress) return [];
    return this.statements.getAllOrderHistory
      .all(walletAddress)
      .map(row => this._decryptRow(row));
  }

  getOrderHistoryCount(walletAddress) {
    this.init();
    if (!walletAddress) return 0;
    const row = this.statements.getOrderHistoryCount.get(walletAddress);
    return row ? row.count : 0;
  }

  getTxnByProviderId(exchange, txnId) {
    this.init();
    if (!exchange || !txnId) return null;
    return this._decryptRow(
      this.statements.getTxnByProviderId.get(exchange, txnId) || null
    );
  }

  getTxnById(txnId) {
    this.init();
    if (!txnId) return null;
    return this._decryptRow(
      this.statements.getTxnById.get(String(txnId)) || null
    );
  }

  getExistingTxnIds(walletAddress) {
    this.init();
    if (!walletAddress) return new Set();
    const rows = this.statements.getExistingTxnIds.all(walletAddress);
    return new Set(rows.map(row => String(row.txn_id)));
  }

  isWalletMigrated(walletAddress) {
    this.init();
    if (!walletAddress) return false;
    const key = `migrated_wallet:${walletAddress}`;
    const row = this.statements.getMeta.get(key);
    return row ? row.value === "true" : false;
  }

  markWalletMigrated(walletAddress) {
    this.init();
    if (!walletAddress) return;
    const key = `migrated_wallet:${walletAddress}`;
    this.statements.setMeta.run(key, "true");
  }

  close() {
    if (this.db) {
      try {
        this.db.close();
        console.log("[SwapDatabaseManager] Database closed cleanly.");
      } catch (err) {
        console.error("[SwapDatabaseManager] Error closing DB:", err);
      }
      this.db = null;
    }
  }
}
