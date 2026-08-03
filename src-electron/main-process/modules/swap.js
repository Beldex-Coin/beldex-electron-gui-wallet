import axios from "axios";
import { SwapTxnHistory } from "./swap_transaction_history.js";
import { signRequest } from "../../utils";
import dotenv from "dotenv";

dotenv.config();

const CHANGELLY_API_URL = "https://api.changelly.com/v2";

export class Swap {
  constructor(backend) {
    this.backend = backend;
    this.swapTxnHistory = new SwapTxnHistory(this);
    this.wallet_state = {
      open: false
    };
  }

  sendGateway(method, data) {
    if (!this.wallet_state.open && method == "set_wallet_data") {
      return;
    }
    this.backend.send(method, data);
  }

  async handle(data) {
    let params = data.data;
    switch (data.method) {
      case "currency_list":
        this.getCurrencyList(params);
        break;

      case "exchange_amount":
        this.getExchangeAmount(params);
        break;

      case "fixed_exchange_amount":
        this.getFixedExchangeAmount(params);
        break;

      case "get_min_max":
        this.getPairsMinMax(params);
        break;

      case "get_min":
        this.getMinAmount(params.from, params.to);
        break;

      case "validate_address":
        this.validateAddress(params);
        break;

      case "refundAddressValidation":
        this.refundAddressValidation(params);
        break;

      case "create_transaction":
        this.createTransaction(params);
        break;

      case "create_fixed_transaction":
        this.createFixTransaction(params);
        break;

      case "transaction_history":
        this.getTransactionHistory(params);
        break;

      case "transaction_status":
        this.getTransactionStatus(params);
        break;

      default:
    }
  }

  async getCurrencyList(params = {}) {
    if (params && params.walletAddress) {
      await this.swapTxnHistory.migrateSwapHistory(params.walletAddress);
    }
    let currencyList = await this.sendRPC("getCurrenciesFull", {});
    this.sendGateway("set_currencyList", currencyList);
    return;
  }

  async getExchangeAmount(params) {
    let data = await this.sendRPC("getExchangeAmount", params);
    this.sendGateway("set_exchangeAmount", data);
    return;
  }

  async getFixedExchangeAmount(params) {
    let data = await this.sendRPC("getFixRateForAmount", params);
    this.sendGateway("set_fixedExchangeRate", data);
    return;
  }

  async getPairsMinMax(params) {
    let data = await this.sendRPC("getPairsParams", params);
    this.sendGateway("set_pairsMinMax", data);
    return;
  }

  getMinAmount(from, to) {
    let params = {
      from,
      to
    };
    return this.sendRPC("getMinAmount", params);
  }

  async validateAddress(params) {
    let data = await this.sendRPC("validateAddress", params);
    this.sendGateway("set_validateAddress", data);
    return;
  }

  async refundAddressValidation(params) {
    let data = await this.sendRPC("validateAddress", params);
    this.sendGateway("set_refundAddressValidation", data);
    return;
  }

  async createTransaction(params) {
    const walletAddress = params.walletAddress;
    const isPrivacySwap = Boolean(params.privacySwap);
    delete params["walletAddress"];
    let data = await this.sendRPC("createTransaction", params);
    const resultObj = data?.result;
    const transactionId = resultObj?.id;
    if (transactionId && walletAddress) {
      this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress,
        isPrivacySwap,
        "changelly",
        resultObj
      );
    }
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  async createFixTransaction(params) {
    const walletAddress = params.walletAddress;
    const isPrivacySwap = Boolean(params.privacySwap);
    delete params["walletAddress"];
    let data = await this.sendRPC("createFixTransaction", params);
    const resultObj = data?.result;
    const transactionId = resultObj?.id;

    if (transactionId && walletAddress) {
      this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress,
        isPrivacySwap,
        "changelly",
        resultObj
      );
    }
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  formatRowForUI(row) {
    if (!row) return null;
    let parsedRaw = {};
    try {
      if (row.raw_response) {
        parsedRaw =
          typeof row.raw_response === "string"
            ? JSON.parse(row.raw_response)
            : row.raw_response;
      }
    } catch (e) {
      console.error("formatRowForUI parse error:", e);
    }

    const amountFrom =
      row.amount_from != null
        ? String(row.amount_from)
        : parsedRaw.amountExpectedFrom || "";
    const amountTo =
      row.amount_to != null
        ? String(row.amount_to)
        : parsedRaw.amountExpectedTo || "";

    let rate = parsedRaw.rate;
    if (
      (!rate || isNaN(Number(rate))) &&
      Number(amountFrom) > 0 &&
      Number(amountTo) > 0
    ) {
      rate = (Number(amountTo) / Number(amountFrom)).toFixed(6);
    }

    return {
      ...parsedRaw,
      id: row.txn_id,
      txn_id: row.txn_id,
      uuid: row.uuid,
      status: row.txn_status,
      type: row.txn_type,
      privacySwap: row.swap_type === "privacy",
      currencyFrom: row.currency_from,
      currencyTo: row.currency_to,
      networkFrom: row.network_from,
      networkTo: row.network_to,
      payinAddress: row.payin_address,
      payoutAddress: row.payout_address,
      refundAddress: row.refund_address,
      amountExpectedFrom: amountFrom,
      amountExpectedTo: amountTo,
      networkFee: row.network_fee,
      rate: rate || "0",
      createdAt: row.created_at,
      created_at: row.created_at
    };
  }

  async getTransactionHistory(params = {}) {
    const {
      walletAddress,
      page: requestedPage = 1,
      pageSize: requestedPageSize = 7,
      isCsvExport = false
    } = params;

    if (!walletAddress) {
      this.sendGateway("set_txnHistory", []);
      this.sendGateway("set_txnHistoryMeta", {
        totalCount: 0,
        totalPages: 0,
        page: 1,
        pageSize: 7
      });
      return;
    }

    // Ensure legacy JSON migration has run for this wallet
    await this.swapTxnHistory.migrateSwapHistory(walletAddress);

    const page = Math.max(1, Number(requestedPage) || 1);
    const pageSize = Math.max(1, Number(requestedPageSize) || 7);

    let rawRows = [];
    let totalCount = 0;

    if (isCsvExport) {
      rawRows = this.swapTxnHistory.getOrderHistory(walletAddress);
      totalCount = rawRows.length;
    } else {
      const paginatedResult = this.swapTxnHistory.getPaginatedOrderHistory(
        walletAddress,
        page,
        pageSize
      );
      rawRows = paginatedResult.transactions;
      totalCount = paginatedResult.totalCount;
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    const sendMeta = () =>
      this.sendGateway("set_txnHistoryMeta", {
        totalCount,
        totalPages,
        page,
        pageSize
      });

    if (!rawRows.length) {
      this.sendGateway("set_txnHistory", []);
      sendMeta();
      return;
    }

    // Format local SQLite rows immediately for fast UI display
    const formattedList = rawRows.map(row => this.formatRowForUI(row));
    this.sendGateway("set_txnHistory", formattedList);
    sendMeta();

    // In background, sync latest status from Changelly API for current page rows
    const normalIds = [];
    const privacyIds = [];
    for (const item of formattedList) {
      if (item.privacySwap) {
        privacyIds.push(item.id);
      } else {
        normalIds.push(item.id);
      }
    }

    const syncApiStatus = async (ids, isPrivacy) => {
      if (!ids.length) return;
      for (let i = 0; i < ids.length; i += 10) {
        try {
          const chunk = ids.slice(i, i + 10);
          const response = await this.sendRPC("getTransactions", {
            id: chunk,
            privacySwap: isPrivacy
          });

          if (response && response.status && Array.isArray(response.result)) {
            response.result.forEach(rpcItem => {
              if (rpcItem && rpcItem.id) {
                this.swapTxnHistory.updateTransactionDetails(
                  rpcItem.id,
                  walletAddress,
                  isPrivacy,
                  "changelly",
                  rpcItem
                );
              }
            });
          }
        } catch (syncErr) {
          console.error("Background transaction sync error:", syncErr);
        }
      }
    };

    // Track active request timestamp to prevent out-of-order page updates during fast pagination
    const currentRequestId = Date.now();
    this.lastHistoryRequestId = currentRequestId;

    Promise.all([
      syncApiStatus(normalIds, false),
      syncApiStatus(privacyIds, true)
    ]).then(() => {
      // Only re-emit gateway if this is still the active pagination request
      if (this.lastHistoryRequestId !== currentRequestId) {
        return;
      }

      const updatedRows = isCsvExport
        ? this.swapTxnHistory.getOrderHistory(walletAddress)
        : this.swapTxnHistory.getPaginatedOrderHistory(
            walletAddress,
            page,
            pageSize
          ).transactions;

      const updatedFormattedList = updatedRows.map(row =>
        this.formatRowForUI(row)
      );
      this.sendGateway("set_txnHistory", updatedFormattedList);
    });
  }

  async getTransactionStatus(params) {
    let data = await this.sendRPC("getTransactions", params);
    if (data && data.status && Array.isArray(data.result)) {
      const walletAddress = params.walletAddress;
      const isPrivacy = Boolean(params.privacySwap);
      if (walletAddress) {
        data.result.forEach(rpcItem => {
          if (rpcItem && rpcItem.id) {
            this.swapTxnHistory.updateTransactionDetails(
              rpcItem.id,
              walletAddress,
              isPrivacy,
              "changelly",
              rpcItem
            );
          }
        });
      }
    }
    this.sendGateway("set_txnStatus", data);
    return;
  }

  async sendRPC(method, params = {}) {
    try {
      const isPrivacySwap = params.privacySwap;
      const requestParams = { ...params };
      delete requestParams.privacySwap;
      const body = {
        jsonrpc: "2.0",
        id: "test",
        method,
        params: requestParams
      };
      const signature = signRequest(isPrivacySwap, body);
      const API_KEY = isPrivacySwap
        ? process.env.CHANGELLY_PRIVACY_SWAP_API_KEY
        : process.env.CHANGELLY_SWAP_API_KEY;

      const headers = {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
        "X-Api-Signature": signature
      };

      try {
        const response = await axios.post(CHANGELLY_API_URL, body, { headers });
        if (response.data.hasOwnProperty("error")) {
          return {
            status: false,
            method: method,
            error: response.data
          };
        }
        return {
          status: true,
          method: method,
          result: response.data.result
        };
      } catch (err) {
        return {
          status: false,
          method: method
        };
      }
    } catch (err) {
      console.log("swap sendRPC error:", err);
      return err;
    }
  }
}
