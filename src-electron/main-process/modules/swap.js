import axios from "axios";
const { SwapTxnHistory } = require("./swap_transaction_history");
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
    // if wallet is closed, do not send any wallet data to gateway
    // this is for the case that we close the wallet at the same
    // after another action has started, but before it has finished
    if (!this.wallet_state.open && method == "set_wallet_data") {
      return;
    }
    this.backend.send(method, data);
  }
  async handle(data) {
    let params = data.data;
    switch (data.method) {
      case "currency_list":
        this.getCurrencyList();
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

  async getCurrencyList() {
    this.swapTxnHistory.migrateSwapHistory();
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
    const transactionId = data?.result?.id;
    if (transactionId) {
      await this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress,
        isPrivacySwap,
        "changelly"
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
    const transactionId = data?.result?.id;

    if (transactionId) {
      await this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress,
        isPrivacySwap,
        "changelly"
      );
    }
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  async getTransactionHistory(params = {}) {
    const {
      walletAddress,
      page: requestedPage = 1,
      pageSize: requestedPageSize = 7,
      isCsvExport = false
    } = params;

    const page = Math.max(1, Number(requestedPage) || 1);
    const pageSize = Math.max(1, Number(requestedPageSize) || 7);

    const transactions =
      (await this.swapTxnHistory.getOrderHistory(walletAddress)) || [];

    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const sendMeta = () =>
      this.sendGateway("set_txnHistoryMeta", {
        totalCount,
        totalPages,
        page,
        pageSize
      });

    if (!totalCount) {
      this.sendGateway("set_txnHistory", []);
      sendMeta();
      return;
    }

    const pageTransactions = isCsvExport
      ? transactions
      : transactions.slice((page - 1) * pageSize, page * pageSize);

    if (!pageTransactions.length) {
      this.sendGateway("set_txnHistory", []);
      sendMeta();
      return;
    }

    const normalIds = [];
    const privacyIds = [];

    for (const { txn_id, swap_type } of pageTransactions) {
      if (swap_type === "privacy") {
        privacyIds.push(txn_id);
      } else {
        normalIds.push(txn_id);
      }
    }

    const transactionMap = new Map();

    const fetchHistory = async (ids, privacySwap) => {
      if (!ids.length) return;

      for (let i = 0; i < ids.length; i += 10) {
        const { result = [] } = await this.sendRPC("getTransactions", {
          id: ids.slice(i, i + 10),
          privacySwap
        });

        result.forEach(item =>
          transactionMap.set(item.id, {
            ...item,
            privacySwap
          })
        );
      }
    };

    await Promise.all([
      fetchHistory(normalIds, false),
      fetchHistory(privacyIds, true)
    ]);

    this.sendGateway("set_txnHistory", [...transactionMap.values()]);
    sendMeta();
  }

  async getTransactionStatus(params) {
    let data = await this.sendRPC("getTransactions", params);
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
