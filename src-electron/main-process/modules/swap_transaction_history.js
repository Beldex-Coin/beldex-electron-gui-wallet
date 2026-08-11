import fs from "fs/promises";
import path from "upath";
import crypto from "crypto";
import { SwapDatabaseManager } from "./swap_db.js";
import { toMsEpoch } from "../../utils.js";

export class SwapTxnHistory {
  constructor(swapInstance) {
    this.swapInstance = swapInstance;
    const dbDir = swapInstance?.backend?.wallet_dir || null;
    this.dbManager = new SwapDatabaseManager(dbDir);
    this.dbManager.init();
  }

  _getDbManager() {
    const currentDbDir = this.swapInstance?.backend?.wallet_dir || null;
    if (currentDbDir && this.dbManager.dbDir !== currentDbDir) {
      try {
        this.dbManager.close();
      } catch (e) {
        // ignore close error
      }
      this.dbManager = new SwapDatabaseManager(currentDbDir);
      this.dbManager.init();
    }
    return this.dbManager;
  }

  _getSwapHistoryPath() {
    return path.join(
      this._getDbManager().dbDir,
      "swap_transaction_history.json"
    );
  }

  getOrderHistory(address) {
    if (!address) {
      return [];
    }
    return this._getDbManager().getAllOrderHistory(address);
  }

  getPaginatedOrderHistory(address, page = 1, pageSize = 7) {
    if (!address) {
      return { transactions: [], totalCount: 0 };
    }
    const dbManager = this._getDbManager();
    const transactions = dbManager.getOrderHistory(address, page, pageSize);
    const totalCount = dbManager.getOrderHistoryCount(address);
    return { transactions, totalCount };
  }

  getTxnExchange(txnId, walletAddress) {
    if (!txnId) return null;
    const dbManager = this._getDbManager();
    if (walletAddress) {
      const orders = dbManager.getAllOrderHistory(walletAddress);
      const found = orders.find(t => String(t.txn_id) === String(txnId));
      if (found && found.exchange) return found.exchange;
    }
    const record = dbManager.getTxnById(txnId);
    return record ? record.exchange : null;
  }

  _mapDetailsToRecord(
    txn_id,
    address,
    isPrivacySwap = false,
    exchange_type = "changelly",
    details = {}
  ) {
    const swapType = isPrivacySwap ? "privacy" : "normal";
    const now = Date.now();
    let rawCreatedAt = details.createdAt ?? details.created_at ?? null;
    let createdAt = rawCreatedAt ? toMsEpoch(rawCreatedAt) : now;

    const extractAddr = val => {
      if (!val) return null;
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        return (
          val.depositAddress ||
          val.destinationAddress ||
          val.refundAddress ||
          val.address ||
          null
        );
      }
      return null;
    };

    const extractMemo = val => {
      if (!val) return null;
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        return (
          val.depositAddressMemo ||
          val.destinationAddressMemo ||
          val.refundAddressMemo ||
          val.memo ||
          null
        );
      }
      return null;
    };

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
      payin_address: extractAddr(
        details.payinAddress || details.depositAddress
      ),
      payin_address_memo: extractMemo(
        details.payinExtraId ||
          details.depositAddressMemo ||
          details.depositAddress
      ),
      payout_address: extractAddr(
        details.payoutAddress || details.destinationAddress
      ),
      payout_address_memo: extractMemo(
        details.payoutExtraId ||
          details.destinationAddressMemo ||
          details.destinationAddress
      ),
      refund_address: extractAddr(details.refundAddress),
      refund_status: details.refundStatus || "not_returned",
      refund_address_memo: extractMemo(
        details.refundExtraId ||
          details.refundAddressMemo ||
          details.refundAddress
      ),
      amount_from: details.amountExpectedFrom ?? details.amountFrom ?? null,
      amount_to: details.amountExpectedTo ?? details.amountTo ?? null,
      network_fee: details.networkFee ?? details.apiExtraFee ?? 0,
      platform_fee: details.platformFee ?? details.changellyFee ?? 0,
      raw_response: details.raw_response ?? details,
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
      console.error(
        "[SwapTxnHistory] Skipped update: missing txn_id or address",
        { txn_id, address }
      );
      return null;
    }
    const dbManager = this._getDbManager();
    const record = this._mapDetailsToRecord(
      txn_id,
      address,
      isPrivacySwap,
      exchange_type,
      details
    );

    try {
      dbManager.upsertTransaction(record);
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

    const dbManager = this._getDbManager();

    if (dbManager.isWalletMigrated(walletAddress)) {
      return;
    }

    const swapHistoryPath = this._getSwapHistoryPath();
    let swapHistory;
    try {
      const raw = await fs.readFile(swapHistoryPath, "utf8");
      swapHistory = JSON.parse(raw);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("Failed to read swap_transaction_history.json", err);
      }
      dbManager.markWalletMigrated(walletAddress);
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(swapHistory, walletAddress)) {
      dbManager.markWalletMigrated(walletAddress);
      return;
    }

    const rawTxnIds = swapHistory[walletAddress];
    if (!Array.isArray(rawTxnIds) || rawTxnIds.length === 0) {
      dbManager.markWalletMigrated(walletAddress);
      return;
    }

    const txnIds = [...new Set(rawTxnIds)];

    const fetchedRecordsMap = new Map();

    const fetchBatchFromApi = async (ids, isPrivacy) => {
      if (!ids || ids.length === 0) return true;
      const { getTransactions } = await import("./changelly_adapter.js");
      for (let i = 0; i < ids.length; i += 10) {
        const chunk = ids.slice(i, i + 10);
        try {
          const response = await getTransactions({
            id: chunk,
            privacySwap: isPrivacy
          });

          if (response && response.status) {
            if (Array.isArray(response.result)) {
              response.result.forEach(item => {
                if (item && item.id) {
                  fetchedRecordsMap.set(item.id, {
                    ...item,
                    privacySwap: isPrivacy
                  });
                }
              });
            }
          } else {
            console.error(
              `API Error fetching migration batch:`,
              response?.error || "Unknown"
            );
            return false;
          }
        } catch (apiErr) {
          console.error(
            `Error fetching migration batch for privacy=${isPrivacy}:`,
            apiErr.message
          );
          return false;
        }
      }
      return true;
    };

    const normalSuccess = await fetchBatchFromApi(txnIds, false);
    if (!normalSuccess) {
      console.error(`Migration aborted for ${walletAddress} due to API error.`);
      return;
    }

    const remainingIds = txnIds.filter(id => !fetchedRecordsMap.has(id));
    if (remainingIds.length > 0) {
      const privacySuccess = await fetchBatchFromApi(remainingIds, true);
      if (!privacySuccess) {
        console.error(
          `Migration aborted for ${walletAddress} due to API error on privacy fetch.`
        );
        return;
      }
    }

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

      const record = this._mapDetailsToRecord(
        txnId,
        walletAddress,
        isPrivacySwap,
        "changelly",
        recordDetails,
        true
      );

      recordsToInsert.push(record);
      count++;
    }

    try {
      dbManager.batchUpsertTransactions(recordsToInsert);
      dbManager.markWalletMigrated(walletAddress);
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
