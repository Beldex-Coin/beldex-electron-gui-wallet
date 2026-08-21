import Database from "better-sqlite3";
import path from "upath";
import os from "os";
import fs from "fs-extra";
import crypto from "crypto";
import { toMsEpoch } from "../../utils.js";

const DB_FILE_NAME = "beldex_wallet.db";

export class SwapDatabaseManager {
  constructor(dbDir = null) {
    this.dbDir = dbDir || this._getDefaultDbDir();
    this.db = null;
    this.statements = {};
  }

  _getDefaultDbDir() {
    if (os.platform() === "win32") {
      return `${os.homedir()}\\Documents\\Beldex`;
    }
    return path.join(os.homedir(), "Beldex");
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
      const dbPath = this.getDbPath();
      this.db = new Database(dbPath);
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
        blockchain_from TEXT,
        currency_to TEXT NOT NULL,
        network_to TEXT,
        blockchain_to TEXT,
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
    this._runMigrations();
  }

  _runMigrations() {
    const addCol = col => {
      try {
        this.db.exec(
          `ALTER TABLE swap_transactions_history ADD COLUMN ${col} TEXT;`
        );
      } catch (e) {
        // Column already exists — safe to ignore
      }
    };
    addCol("blockchain_from");
    addCol("blockchain_to");
  }

  _prepareStatements() {
    this.statements.upsertTxn = this.db.prepare(`
      INSERT INTO swap_transactions_history (
        uuid, wallet_address, exchange, txn_id, txn_status, txn_type, swap_type,
        currency_from, network_from, blockchain_from, currency_to, network_to, blockchain_to,
        payin_address, payin_address_memo, payout_address, payout_address_memo,
        refund_address, refund_status, refund_address_memo,
        amount_from, amount_to, network_fee, platform_fee,
        raw_response, created_at, updated_at
      ) VALUES (
        @uuid, @wallet_address, @exchange, @txn_id, @txn_status, @txn_type, @swap_type,
        @currency_from, @network_from, @blockchain_from, @currency_to, @network_to, @blockchain_to,
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
        blockchain_from = COALESCE(excluded.blockchain_from, swap_transactions_history.blockchain_from),
        currency_to = COALESCE(NULLIF(excluded.currency_to, ''), swap_transactions_history.currency_to),
        network_to = COALESCE(excluded.network_to, swap_transactions_history.network_to),
        blockchain_to = COALESCE(excluded.blockchain_to, swap_transactions_history.blockchain_to),
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
      blockchain_from: tx.blockchain_from || null,
      currency_to: tx.currency_to || "",
      network_to: tx.network_to || null,
      blockchain_to: tx.blockchain_to || null,
      payin_address: tx.payin_address || null,
      payin_address_memo: tx.payin_address_memo || null,
      payout_address: tx.payout_address || null,
      payout_address_memo: tx.payout_address_memo || null,
      refund_address: tx.refund_address || null,
      refund_status: tx.refund_status || "not_returned",
      refund_address_memo: tx.refund_address_memo || null,
      amount_from: tx.amount_from != null ? Number(tx.amount_from) : null,
      amount_to: tx.amount_to != null ? Number(tx.amount_to) : null,
      network_fee: tx.network_fee != null ? Number(tx.network_fee) : 0,
      platform_fee: tx.platform_fee != null ? Number(tx.platform_fee) : 0,
      raw_response:
        typeof tx.raw_response === "object"
          ? JSON.stringify(tx.raw_response)
          : tx.raw_response || null,
      created_at: createdAt,
      updated_at: tx.updated_at ? Number(tx.updated_at) : now
    };

    const result = this.statements.upsertTxn.run(payload);
    console.log(
      `[SwapDB] upsert txn_id=${payload.txn_id} | network_from=${payload.network_from} | network_to=${payload.network_to} tx.created_at=${tx.created_at}, tx.createdAt=${tx.createdAt}, now=${now}`
    );
    return result;
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
    return this.statements.getOrderHistory.all(walletAddress, limit, offset);
  }

  getAllOrderHistory(walletAddress) {
    this.init();
    if (!walletAddress) return [];
    return this.statements.getAllOrderHistory.all(walletAddress);
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
    return this.statements.getTxnByProviderId.get(exchange, txnId) || null;
  }

  getTxnById(txnId) {
    this.init();
    if (!txnId) return null;
    return this.statements.getTxnById.get(String(txnId)) || null;
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
