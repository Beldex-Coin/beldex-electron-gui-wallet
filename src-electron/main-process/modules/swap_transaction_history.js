const fs = require("fs");
const path = require("upath");
const os = require("os");

const DB_NAME = "swap";
const DB_TABLE = "transaction_history";
const DB_FILE = "swap_indexeddb.json";

const EMPTY_DB = {
  database: DB_NAME,
  version: 1,
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
}
