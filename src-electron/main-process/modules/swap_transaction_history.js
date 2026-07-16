const fs = require("fs/promises");
const path = require("upath");
const os = require("os");

const DB_NAME = "beldex_wallet";
const DB_TABLE = "transaction_history";
const DB_FILE = "beldex_wallet_indexeddb.json";

const EMPTY_DB = {
  database: DB_NAME,
  version: 1,
  migratedWallets: [], // tracks which wallet addresses have completed migration
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
  _getSwapHistoryPath() {
    return path.join(this._getDbDir(), "swap_transaction_history.json");
  }
  async _readDb() {
    const filePath = this._getDbPath();
    try {
      const raw = await fs.readFile(filePath, "utf8");
      if (!raw) {
        return { ...EMPTY_DB };
      }
      const parsed = JSON.parse(raw);
      return {
        database: DB_NAME,
        version: parsed.version || 1,
        migratedWallets: Array.isArray(parsed.migratedWallets)
          ? parsed.migratedWallets
          : [],
        [DB_TABLE]: Array.isArray(parsed[DB_TABLE]) ? parsed[DB_TABLE] : [],
        nextId: Number.isInteger(parsed.nextId) ? parsed.nextId : 1
      };
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("SwapTxnHistory _readDb error:", err.message);
      }
      return { ...EMPTY_DB };
    }
  }
  async _writeDb(db) {
    const filePath = this._getDbPath();
    const dir = this._getDbDir();
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8");
    } catch (err) {
      console.error("SwapTxnHistory _writeDb error:", err.message);
      throw err;
    }
  }
  async getOrderHistory(address) {
    if (!address) {
      return [];
    }
    const db = await this._readDb();
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
    const db = await this._readDb();
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
    try {
      await this._writeDb(db);
    } catch (err) {
      // _writeDb already logged the details; here we just stop this call
      // from becoming an unhandled promise rejection for the caller.
      console.error(
        `updateTransactionDetails failed to persist txn_id ${txn_id}`
      );
      return;
    }
    return newRecord;
  }

  // Pure check: given a set of "wallet::txn_id" keys, confirm every
  // txnId for walletAddress is present. No I/O, no Set construction —
  // callers pass in a Set they've already built. Kept as its own method
  // so it stays independently unit-testable.
  _verifyMigration(existingKeys, walletAddress, txnIds) {
    if (!Array.isArray(txnIds)) return true;
    for (const txnId of txnIds) {
      if (!existingKeys.has(`${walletAddress}::${txnId}`)) {
        console.error(`Missing txn_id: ${txnId} for wallet: ${walletAddress}`);
        return false;
      }
    }
    return true;
  }

  // walletAddress is required — always called one wallet at a time.
  async migrateSwapHistory(walletAddress) {
    if (!walletAddress) {
      console.error("migrateSwapHistory requires a walletAddress.");
      return;
    }
    const db = await this._readDb();
    if (db.migratedWallets.includes(walletAddress)) {
      console.log(`Swap history already migrated for wallet: ${walletAddress}`);
      return;
    }
    const swapHistoryPath = this._getSwapHistoryPath();
    let swapHistory;
    try {
      const raw = await fs.readFile(swapHistoryPath, "utf8");
      swapHistory = JSON.parse(raw);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("swap_transaction_history.json not found.");
      } else {
        console.error("Failed to read swap_transaction_history.json", err);
      }
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(swapHistory, walletAddress)) {
      console.log(`No swap history found for wallet: ${walletAddress}`);
      return;
    }
    const rawTxnIds = swapHistory[walletAddress];
    if (!Array.isArray(rawTxnIds)) {
      console.log(
        `Swap history for wallet ${walletAddress} is not a valid list.`
      );
      return;
    }

    // Dedup the source list itself in case the file has repeats for this wallet.
    const txnIds = [...new Set(rawTxnIds)];

    // Built once, reused for both the insert-dedup pass and verification below
    // — avoids rebuilding the same Set twice off the full table.
    const existingKeys = new Set(
      db[DB_TABLE].map(item => `${item.wallet_address}::${item.txn_id}`)
    );
    let inserted = 0;
    for (const txnId of txnIds) {
      const key = `${walletAddress}::${txnId}`;
      if (existingKeys.has(key)) continue;
      db[DB_TABLE].push({
        id: db.nextId++,
        wallet_address: walletAddress,
        txn_id: txnId,
        swap_type: "normal",
        exchange_type: "changelly",
        created_at: Date.now()
      });
      existingKeys.add(key);
      inserted++;
    }
    if (!this._verifyMigration(existingKeys, walletAddress, txnIds)) {
      console.error("Migration verification failed.");
      return;
    }
    db.migratedWallets.push(walletAddress);

    // Single write covers both the inserted records and the migratedWallets
    // flag — no intermediate write + re-read round trip.
    try {
      await this._writeDb(db);
    } catch (err) {
      // _writeDb already logged the details. Note: db.migratedWallets was
      // mutated in memory above but never persisted, so on the next call
      // db.migratedWallets.includes(walletAddress) will correctly be false
      // and this wallet will be retried from scratch — no partial state.
      console.error(
        `migrateSwapHistory failed to persist migration for wallet: ${walletAddress}`
      );
      return;
    }
    console.log(
      `Migration completed successfully for wallet ${walletAddress}. Inserted ${inserted} records.`
    );
  }
}
