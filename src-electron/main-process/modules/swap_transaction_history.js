const fs = require("fs");
const path = require("upath");
const os = require("os");

const DB_NAME = "beldex_wallet";
const DB_TABLE = "transaction_history";
const DB_FILE = "beldex_wallet_indexeddb.json";

const EMPTY_DB = {
  database: DB_NAME,
  version: 1,
  migrationCompleted: false,
  [DB_TABLE]: [],
  nextId: 1
};

export class SwapTxnHistory {
  constructor(backend) {
    this.backend = backend;
  }

  _getDbDir() {
    if (os.platform() === "win32") {
      return `${os.homedir()}\\Documents\\Beldex`;
    }
    return path.join(os.homedir(), "Beldex");
  }

  _getDbPath() {
    return path.join(this._getDbDir(), DB_FILE);
  }

  _readDb() {
    const filePath = this._getDbPath();
    try {
      if (!fs.existsSync(filePath)) {
        return { ...EMPTY_DB };
      }
      const raw = fs.readFileSync(filePath, "utf8");
      if (!raw) {
        return { ...EMPTY_DB };
      }
      const parsed = JSON.parse(raw);
      return {
        database: DB_NAME,
        version: parsed.version || 1,
        migrationCompleted: parsed.migrationCompleted || false,
        [DB_TABLE]: Array.isArray(parsed[DB_TABLE]) ? parsed[DB_TABLE] : [],
        nextId: Number.isInteger(parsed.nextId) ? parsed.nextId : 1
      };
    } catch (err) {
      console.error("SwapTxnHistory _readDb error:", err.message);
      return { ...EMPTY_DB };
    }
  }

  _writeDb(db) {
    const filePath = this._getDbPath();
    const dir = this._getDbDir();
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
    } catch (err) {
      console.error("SwapTxnHistory _writeDb error:", err.message);
      throw err;
    }
  }

  async getOrderHistory(address) {
    if (!address) {
      return [];
    }

    const db = this._readDb();
    return db[DB_TABLE].filter(
      record => record.wallet_address === address
    ).sort((a, b) => b.created_at - a.created_at);
  }

  _getSwapHistoryPath() {
    return path.join(this._getDbDir(), "swap_transaction_history.json");
  }
  async updateTransactionDetails(
    txn_id,
    address,
    isPrivacySwap,
    exchange_type
  ) {
    if (!txn_id || !address) {
      return;
    }

    const db = this._readDb();
    const existing = db[DB_TABLE].find(
      record => record.txn_id === txn_id && record.wallet_address === address
    );

    if (existing) {
      return existing;
    }

    const swapType = isPrivacySwap ? "privacy" : "normal";
    const newRecord = {
      id: db.nextId,
      wallet_address: address,
      txn_id,
      swap_type: swapType,
      exchange_type: exchange_type,
      created_at: Date.now()
    };

    db[DB_TABLE].push(newRecord);
    db.nextId += 1;
    this._writeDb(db);
    return newRecord;
  }

  _verifyMigration(db, swapHistory) {
    const indexedTxnIds = new Set(db[DB_TABLE].map(item => item.txn_id));

    const uniqueTxnIds = new Set();

    for (const txnIds of Object.values(swapHistory)) {
      if (!Array.isArray(txnIds)) continue;

      txnIds.forEach(txnId => uniqueTxnIds.add(txnId));
    }

    for (const txnId of uniqueTxnIds) {
      if (!indexedTxnIds.has(txnId)) {
        console.error(`Missing txn_id: ${txnId}`);
        return false;
      }
    }

    return true;
  }
  async migrateSwapHistory() {
    const db = this._readDb();

    // Already migrated
    if (db.migrationCompleted) {
      console.log("Swap history migration already completed.");
      return;
    }

    const swapHistoryPath = this._getSwapHistoryPath();

    if (!fs.existsSync(swapHistoryPath)) {
      console.log("swap_history.json not found.");
      return;
    }

    let swapHistory;

    try {
      swapHistory = JSON.parse(fs.readFileSync(swapHistoryPath, "utf8"));
    } catch (err) {
      console.error("Failed to read swap_history.json", err);
      return;
    }

    // Existing txn_ids
    const existingTxnIds = new Set(db[DB_TABLE].map(item => item.txn_id));

    let inserted = 0;

    for (const [walletAddress, txnIds] of Object.entries(swapHistory)) {
      if (!Array.isArray(txnIds)) {
        continue;
      }

      for (const txnId of txnIds) {
        // Skip duplicate txn_id
        if (existingTxnIds.has(txnId)) {
          continue;
        }

        db[DB_TABLE].push({
          id: db.nextId++,
          wallet_address: walletAddress,
          txn_id: txnId,
          swap_type: "normal",
          exchange_type: "changelly",
          created_at: Date.now()
        });

        existingTxnIds.add(txnId);
        inserted++;
      }
    }

    if (inserted > 0) {
      this._writeDb(db);
    }

    // Re-read database after writing
    const updatedDb = this._readDb();

    const verified = this._verifyMigration(updatedDb, swapHistory);

    if (!verified) {
      console.error("Migration verification failed.");
      return;
    }

    updatedDb.migrationCompleted = true;

    this._writeDb(updatedDb);

    console.log(
      `Migration completed successfully. Inserted ${inserted} records.`
    );
  }
}
