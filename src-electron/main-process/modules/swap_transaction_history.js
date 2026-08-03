import fs from "fs/promises";
import path from "upath";
import crypto from "crypto";
import { SwapDatabaseManager } from "./swap_db.js";

export class SwapTxnHistory {
  constructor(swapInstance) {
    this.swapInstance = swapInstance;
    const dbDir = swapInstance?.backend?.wallet_dir || null;
    this.dbManager = new SwapDatabaseManager(dbDir);
    this.dbManager.init();
  }

  _getSwapHistoryPath() {
    return path.join(this.dbManager.dbDir, "swap_transaction_history.json");
  }

  getOrderHistory(address) {
    if (!address) {
      return [];
    }
    return this.dbManager.getAllOrderHistory(address);
  }

  getPaginatedOrderHistory(address, page = 1, pageSize = 7) {
    if (!address) {
      return { transactions: [], totalCount: 0 };
    }
    const transactions = this.dbManager.getOrderHistory(
      address,
      page,
      pageSize
    );
    const totalCount = this.dbManager.getOrderHistoryCount(address);
    return { transactions, totalCount };
  }

  _mapChangellyDetailsToRecord(
    txn_id,
    address,
    isPrivacySwap = false,
    exchange_type = "changelly",
    details = {}
  ) {
    const swapType = isPrivacySwap ? "privacy" : "normal";
    const now = Date.now();

    let createdAt = details.createdAt || details.created_at || now;
    if (typeof createdAt === "number" && createdAt < 10000000000) {
      createdAt = createdAt * 1000;
    } else if (typeof createdAt === "string" && !isNaN(Number(createdAt))) {
      createdAt = Number(createdAt);
      if (createdAt < 10000000000) {
        createdAt = createdAt * 1000;
      }
    } else if (typeof createdAt === "string") {
      const parsed = new Date(createdAt).getTime();
      if (!isNaN(parsed)) {
        createdAt = parsed;
      }
    }

    return {
      uuid: crypto.randomUUID(),
      wallet_address: address,
      exchange: exchange_type || "changelly",
      txn_id: txn_id,
      txn_status: details.status || "waiting",
      txn_type: details.type || "float",
      swap_type: swapType,
      currency_from: details.currencyFrom || "",
      network_from: details.networkFrom || null,
      currency_to: details.currencyTo || "",
      network_to: details.networkTo || null,
      payin_address: details.payinAddress || null,
      payin_address_memo: details.payinExtraId || null,
      payout_address: details.payoutAddress || null,
      payout_address_memo: details.payoutExtraId || null,
      refund_address: details.refundAddress || null,
      refund_status: details.refundStatus || "not_returned",
      refund_address_memo: details.refundExtraId || null,
      amount_from: details.amountExpectedFrom ?? details.amountFrom ?? null,
      amount_to: details.amountExpectedTo ?? details.amountTo ?? null,
      network_fee: details.networkFee || 0,
      platform_fee: details.platformFee || 0,
      raw_response: details,
      created_at: createdAt,
      updated_at: now
    };
  }

  updateTransactionDetails(
    txn_id,
    address,
    isPrivacySwap = false,
    exchange_type = "changelly",
    details = {}
  ) {
    if (!txn_id || !address) {
      return null;
    }

    const record = this._mapChangellyDetailsToRecord(
      txn_id,
      address,
      isPrivacySwap,
      exchange_type,
      details
    );

    try {
      this.dbManager.upsertTransaction(record);
      return record;
    } catch (err) {
      console.error(
        `updateTransactionDetails failed for txn_id ${txn_id}:`,
        err.message
      );
      return null;
    }
  }

  async migrateSwapHistory(walletAddress) {
    if (!walletAddress) {
      console.error("migrateSwapHistory requires a walletAddress.");
      return;
    }

    if (this.dbManager.isWalletMigrated(walletAddress)) {
      console.log(
        `Swap history already migrated to SQLite for wallet: ${walletAddress}`
      );
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
      this.dbManager.markWalletMigrated(walletAddress);
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(swapHistory, walletAddress)) {
      console.log(`No swap history found in JSON for wallet: ${walletAddress}`);
      this.dbManager.markWalletMigrated(walletAddress);
      return;
    }

    const rawTxnIds = swapHistory[walletAddress];
    if (!Array.isArray(rawTxnIds) || rawTxnIds.length === 0) {
      console.log(
        `Swap history for wallet ${walletAddress} is empty or invalid.`
      );
      this.dbManager.markWalletMigrated(walletAddress);
      return;
    }

    const txnIds = [...new Set(rawTxnIds)];
    console.log(
      `Starting migration for wallet ${walletAddress}: ${txnIds.length} transaction IDs to migrate...`
    );

    const fetchedRecordsMap = new Map();

    const fetchBatchFromApi = async (ids, isPrivacy) => {
      if (!ids || ids.length === 0) return;
      for (let i = 0; i < ids.length; i += 10) {
        const chunk = ids.slice(i, i + 10);
        try {
          if (!this.swapInstance || !this.swapInstance.sendRPC) break;
          const response = await this.swapInstance.sendRPC("getTransactions", {
            id: chunk,
            privacySwap: isPrivacy
          });

          if (response && response.status && Array.isArray(response.result)) {
            response.result.forEach(item => {
              if (item && item.id) {
                fetchedRecordsMap.set(item.id, {
                  ...item,
                  privacySwap: isPrivacy
                });
              }
            });
          }
        } catch (apiErr) {
          console.error(
            `Error fetching migration batch for privacy=${isPrivacy}:`,
            apiErr.message
          );
        }
      }
    };

    // 1. Try normal RPC fetch
    await fetchBatchFromApi(txnIds, false);

    // 2. Identify remaining IDs not found in normal fetch, and attempt privacy RPC fetch
    const remainingIds = txnIds.filter(id => !fetchedRecordsMap.has(id));
    if (remainingIds.length > 0) {
      await fetchBatchFromApi(remainingIds, true);
    }

    // 3. Upsert fetched records and fallbacks into SQLite
    let count = 0;
    const recordsToInsert = [];

    for (const txnId of txnIds) {
      const fetchedItem = fetchedRecordsMap.get(txnId);
      const isPrivacySwap = fetchedItem
        ? Boolean(fetchedItem.privacySwap)
        : false;

      const recordDetails = fetchedItem || {
        txn_id: txnId,
        status: "waiting",
        type: "float"
      };

      const record = this._mapChangellyDetailsToRecord(
        txnId,
        walletAddress,
        isPrivacySwap,
        "changelly",
        recordDetails
      );

      recordsToInsert.push(record);
      count++;
    }

    try {
      this.dbManager.batchUpsertTransactions(recordsToInsert);
      this.dbManager.markWalletMigrated(walletAddress);
      console.log(
        `Migration completed successfully for wallet ${walletAddress}. Migrated ${count} records into beldex_wallet.db SQLite database.`
      );
    } catch (dbErr) {
      console.error(
        `Failed to persist migration batch for wallet: ${walletAddress}`,
        dbErr.message
      );
    }
  }
}
