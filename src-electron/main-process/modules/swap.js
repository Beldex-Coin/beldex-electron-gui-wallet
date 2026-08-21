import { SwapTxnHistory } from "./swap_transaction_history.js";
import * as changellyAdapter from "./changelly_adapter.js";
import * as quickexAdapter from "./quickex_adapter.js";
import { swapExchangeList } from "../config/config.js";

export class Swap {
  constructor(backend) {
    this.backend = backend;
    this.swapTxnHistory = new SwapTxnHistory(this);
    this.wallet_state = { open: false };
    this.activeExchange = "changelly";
  }

  sendGateway(method, data) {
    if (!this.wallet_state.open && method === "set_wallet_data") return;
    this.backend.send(method, data);
  }

  async handle(data) {
    const params = data.data;
    switch (data.method) {
      case "currency_list":
        return this.getCurrencyList(params);
      case "exchange_amount":
        return this.getExchangeAmount(params);
      case "fixed_exchange_amount":
        return this.getFixedExchangeAmount(params);
      case "get_min_max":
        return this.getPairsMinMax(params);
      case "get_min":
        return this.getMinAmount(params.from, params.to);
      case "validate_address":
        return this.validateAddress(params);
      case "refundAddressValidation":
        return this.refundAddressValidation(params);
      case "create_transaction":
        return this._createOrder("createTransaction", params);
      case "create_fixed_transaction":
        return this._createOrder("createFixTransaction", params);
      case "transaction_history":
        return this.getTransactionHistory(params);
      case "transaction_status":
        return this.getTransactionStatus(params);
      default:
        break;
    }
  }

  async _selectExchange(params = {}) {
    const hasBdxPair = result =>
      Array.isArray(result) &&
      result.some(
        c =>
          (c.ticker?.toLowerCase() === "bdx" && c.enabled) ||
          (c.name?.toLowerCase() === "bdx" && c.enabled)
      );

    if (swapExchangeList.changelly) {
      const changellyResult = await changellyAdapter.getCurrenciesFull(params);
      if (changellyResult?.status && hasBdxPair(changellyResult.result)) {
        this.activeExchange = "changelly";
        this.sendGateway("set_activeExchange", "changelly");
        return { exchange: "changelly", currencyList: changellyResult };
      }
    }

    if (swapExchangeList.quickex) {
      const quickexResult = await quickexAdapter.getCurrenciesFull(params);
      if (quickexResult?.status && hasBdxPair(quickexResult.result)) {
        this.activeExchange = "quickex";
        this.sendGateway("set_activeExchange", "quickex");
        return { exchange: "quickex", currencyList: quickexResult };
      }
    }

    const fallbackExchange = swapExchangeList.quickex ? "quickex" : "changelly";
    this.activeExchange = fallbackExchange;
    console.warn(
      `[Swap] BDX pair not available on any exchange. Defaulting to ${fallbackExchange}.`
    );
    this.sendGateway("set_activeExchange", this.activeExchange);
    return {
      exchange: this.activeExchange,
      currencyList: { status: false, result: [] }
    };
  }

  _adapter(exchange) {
    return exchange === "quickex" ? quickexAdapter : changellyAdapter;
  }

  async _callAdapter(method, params, exchangeOverride) {
    const exchange =
      exchangeOverride ||
      params.exchange_type ||
      params.exchange ||
      this.activeExchange;
    const adapter = this._adapter(exchange);
    const fn = adapter[method];
    if (typeof fn !== "function") {
      console.error(
        `[Swap] Method "${method}" not found on adapter "${exchange}"`
      );
      return {
        status: false,
        method,
        error: { message: `${method} not available on ${exchange}` }
      };
    }
    const dbManager = this.swapTxnHistory?.dbManager;
    const result =
      method === "getTransactionStatus" || method === "getTransactions"
        ? await fn(params, dbManager)
        : await fn(params);
    if (result && !result.exchange_type) result.exchange_type = exchange;
    return result;
  }

  async getCurrencyList(params = {}) {
    if (params?.walletAddress) {
      await this.swapTxnHistory.migrateSwapHistory(params.walletAddress);
    }
    const { exchange, currencyList } = await this._selectExchange(params);
    if (
      !currencyList ||
      !currencyList.status ||
      !Array.isArray(currencyList.result) ||
      currencyList.result.length === 0
    ) {
      console.warn(
        "[Swap] Currency list fetch failed or empty. Showing maintenance screen."
      );
      this.sendGateway("set_currencyList", {
        status: false,
        result: [],
        exchange_type: exchange,
        maintenance: true
      });
      return;
    }
    currencyList.exchange_type = exchange;
    this.sendGateway("set_currencyList", currencyList);
  }

  async getExchangeAmount(params) {
    const data = await this._callAdapter("getExchangeAmount", params);
    if (!data.status && data.minMaxHint) {
      this.sendGateway("set_pairsMinMax", {
        status: true,
        method: "getPairsParams",
        result: [data.minMaxHint],
        exchange_type: data.exchange_type || this.activeExchange
      });
    }
    this.sendGateway("set_exchangeAmount", data);
  }

  async getFixedExchangeAmount(params) {
    const data = await this._callAdapter("getFixRateForAmount", params);
    this.sendGateway("set_fixedExchangeRate", data);
  }

  async getPairsMinMax(params) {
    const data = await this._callAdapter("getPairsParams", params);
    if (!data.status && data.minMaxHint) {
      this.sendGateway("set_pairsMinMax", {
        status: true,
        method: "getPairsParams",
        result: [data.minMaxHint],
        exchange_type: data.exchange_type || this.activeExchange
      });
      return;
    }
    if (!data.status && !data.result) {
      const from = params?.fromDetails?.value || params?.from || "";
      const to = params?.toDetails?.value || params?.to || "";
      this.sendGateway("set_pairsMinMax", {
        status: true,
        method: "getPairsParams",
        result: [
          {
            from,
            to,
            minAmountFloat: 0,
            maxAmountFloat: 0,
            minAmountFixed: 0,
            maxAmountFixed: 0
          }
        ],
        exchange_type: data.exchange_type || this.activeExchange
      });
      return;
    }
    this.sendGateway("set_pairsMinMax", data);
  }

  async getMinAmount(from, to) {
    return this._callAdapter("getPairsParams", { from, to });
  }

  async validateAddress(params) {
    const data = await this._callAdapter("validateAddress", params);
    this.sendGateway("set_validateAddress", data);
  }

  async refundAddressValidation(params) {
    const data = await this._callAdapter("validateAddress", params);
    this.sendGateway("set_refundAddressValidation", data);
  }

  async _createOrder(rpcMethod, params) {
    const walletAddress = params.walletAddress;
    const isPrivacySwap = Boolean(params.privacySwap);
    const exchangeType =
      params.exchange_type || params.exchange || this.activeExchange;
    const adapterParams = { ...params };
    delete adapterParams.walletAddress;

    const data = await this._callAdapter(rpcMethod, {
      ...adapterParams,
      exchange_type: exchangeType
    });
    const transactionId = data?.result?.id;

    if (transactionId && walletAddress) {
      const now = Date.now();
      if (data.result) {
        data.result.created_at = now;
        data.result.createdAt = now;
        data.result.blockchainFrom = params.blockchainFrom;
        data.result.blockchainTo = params.blockchainTo;
        data.result.networkFrom = params.networkFrom || null;
        data.result.networkTo = params.networkTo || null;
      }
      this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress,
        isPrivacySwap,
        data.exchange_type || exchangeType,
        data.result
      );
    } else if (!transactionId) {
      console.warn(
        `[Swap] ${rpcMethod}: DB update skipped — no transactionId in response`,
        data?.error
      );
    }

    this.sendGateway("set_createdTxnDetails", data);
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

    const history = rawRows.map(row => {
      const amountFrom = row.amount_from != null ? Number(row.amount_from) : 0;
      const amountTo = row.amount_to != null ? Number(row.amount_to) : 0;
      let rate = 0;
      if (amountFrom > 0 && amountTo > 0) rate = amountTo / amountFrom;

      let rawResp = null;
      if (row.raw_response) {
        try {
          rawResp =
            typeof row.raw_response === "string"
              ? JSON.parse(row.raw_response)
              : row.raw_response;
        } catch (e) {
          rawResp = row.raw_response;
        }
      }
      const isQuickex =
        row.exchange === "quickex" ||
        (rawResp && (rawResp.deposits || rawResp.withdrawals));

      let moneySent = null;
      let moneyReceived = null;
      let payinHash = row.payin_address_memo || "";
      let payoutHash = row.payout_address_memo || "";

      if (isQuickex && rawResp) {
        const deposit =
          Array.isArray(rawResp.deposits) && rawResp.deposits.length > 0
            ? rawResp.deposits[0]
            : null;
        const withdrawal =
          Array.isArray(rawResp.withdrawals) && rawResp.withdrawals.length > 0
            ? rawResp.withdrawals[0]
            : null;

        if (deposit?.createdAt) {
          moneySent = new Date(deposit.createdAt).getTime() * 1000;
        }
        if (withdrawal?.createdAt) {
          moneyReceived = new Date(withdrawal.createdAt).getTime() * 1000;
        }
        if (deposit?.txId) {
          payinHash = deposit.txId;
        }
        if (withdrawal?.txId) {
          payoutHash = withdrawal.txId;
        }
      }

      const baseTs = Number(row.created_at || Date.now());
      if (!moneySent) {
        const ms = rawResp?.moneySent ? Number(rawResp.moneySent) : baseTs;
        moneySent = ms < 1e15 ? ms * 1000 : ms;
      }
      if (!moneyReceived) {
        const ms = rawResp?.moneyReceived
          ? Number(rawResp.moneyReceived)
          : baseTs;
        moneyReceived = ms < 1e15 ? ms * 1000 : ms;
      }

      if (!payinHash) payinHash = rawResp?.payinHash || "";
      if (!payoutHash)
        payoutHash = rawResp?.payoutHash || rawResp?.payoutHashLink || "";

      return {
        id: row.txn_id,
        status: row.txn_status || "waiting",
        type: row.txn_type || "float",
        currencyFrom: row.currency_from ? row.currency_from.toLowerCase() : "",
        currencyTo: row.currency_to ? row.currency_to.toLowerCase() : "",
        payinAddress: row.payin_address || "",
        payinExtraId: row.payin_address_memo || "",
        payoutAddress: row.payout_address || "",
        payoutExtraId: row.payout_address_memo || "",
        refundAddress: row.refund_address || "",
        refundExtraId: row.refund_address_memo || "",
        amountExpectedFrom: amountFrom,
        amountExpectedTo: amountTo,
        networkFee: row.network_fee != null ? Number(row.network_fee) : 0,
        rate,
        createdAt: row.created_at,
        created_at: row.created_at,
        moneySent,
        moneyReceived,
        payinHash,
        payoutHash,
        payoutHashLink: payoutHash,
        privacySwap: row.swap_type === "privacy",
        exchange_type: row.exchange || "changelly",
        blockchainFrom: row.blockchain_from || null,
        blockchainTo: row.blockchain_to || null,
        networkFrom: row.network_from || null,
        networkTo: row.network_to || null,
        raw_response: rawResp
      };
    });

    const sortedHistory = history.sort(
      (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)
    );

    this.sendGateway("set_txnHistory", sortedHistory);
    sendMeta();
  }

  async getTransactionStatus(params) {
    let exchange = params.exchange_type || params.exchange;
    let walletAddress = params.walletAddress || params.address;
    if (!walletAddress && params.id && this.swapTxnHistory?.dbManager) {
      const record = this.swapTxnHistory.dbManager.getTxnById(params.id);
      if (record) {
        walletAddress = record.wallet_address;
        params.walletAddress = walletAddress;
      }
    }

    if (!exchange && params.id) {
      exchange = this.swapTxnHistory.getTxnExchange(params.id, walletAddress);
    }
    if (!exchange) exchange = this.activeExchange;

    const method =
      exchange === "quickex" ? "getTransactionStatus" : "getTransactions";
    const data = await this._callAdapter(method, params, exchange);
    if (data) data.exchange_type = exchange;

    // Persist updated status to DB
    if (data?.status && Array.isArray(data.result) && data.result.length > 0) {
      const details = data.result[0];
      const txnId = params.id || details.id;
      if (txnId && walletAddress) {
        this.swapTxnHistory.updateTransactionDetails(
          txnId,
          walletAddress,
          params.privacySwap || false,
          exchange,
          details
        );
      }
    }

    this.sendGateway("set_txnStatus", data);
  }
}
