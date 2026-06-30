import axios from "axios";
const { SwapTxnHistory } = require("./swap_transaction_history");
const https = require("https");
const crypto = require("crypto");
const tls = require("tls");
import dotenv from "dotenv";

dotenv.config();

const CHANGELLY_API_URL = "https://api.changelly.com/v2";

function parsePins(pinList = "") {
  return pinList
    .split(",")
    .map(pin => pin.trim())
    .filter(Boolean)
    .map(pin => pin.replace(/^sha256\//i, ""));
}

function getBeldexSwapSignUrl(isPrivacySwap) {
  const configuredUrl = process.env.BELDEX_SWAP_SIGN_URL;
  const parsed = assertHttpsUrl(configuredUrl);

  if (
    parsed.pathname.endsWith("/swap") &&
    parsed.searchParams.get("type") === "swap"
  ) {
    return parsed.toString();
  }

  const normalizedPath = parsed.pathname.replace(/\/$/, "");
  parsed.pathname = `${normalizedPath}/swap`;
  if (isPrivacySwap) {
    parsed.searchParams.set("type", "privacy");
  } else {
    parsed.searchParams.set("type", "swap");
  }

  return parsed.toString();
}

function getPinnedHosts() {
  const beldexHost = new URL(getBeldexSwapSignUrl()).hostname;
  return {
    [beldexHost]: parsePins(process.env.BELDEX_PUBLIC_KEY_PIN || "")
  };
}

function assertHttpsUrl(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new Error(`Insecure endpoint blocked: ${url}`);
  }
  return parsed;
}

function getCertificateSpkiPin(cert) {
  if (cert && cert.raw) {
    const x509 = new crypto.X509Certificate(cert.raw);
    const spkiDer = x509.publicKey.export({
      type: "spki",
      format: "der"
    });
    return crypto
      .createHash("sha256")
      .update(spkiDer)
      .digest("base64");
  }

  if (cert && cert.pubkey) {
    return crypto
      .createHash("sha256")
      .update(cert.pubkey)
      .digest("base64");
  }

  throw new Error("Unable to extract certificate public key for pinning");
}

function createPinnedHttpsAgent(url, pinnedHosts) {
  const parsed = assertHttpsUrl(url);
  const host = parsed.hostname;
  const allowedPins = pinnedHosts[host] || [];
  if (allowedPins.length === 0) {
    return null;
  }

  return new https.Agent({
    checkServerIdentity(servername, cert) {
      const tlsError = tls.checkServerIdentity(servername, cert);
      if (tlsError) {
        return tlsError;
      }

      const pin = getCertificateSpkiPin(cert);
      if (!allowedPins.includes(pin)) {
        return new Error(`Public key pinning failed for host: ${host}`);
      }

      return undefined;
    }
  });
}

async function pinnedPost(url, body, headers, pinnedHosts) {
  const httpsAgent = createPinnedHttpsAgent(url, pinnedHosts);
  const requestConfig = {
    headers,
    maxRedirects: 0,
    timeout: 20000
  };

  if (httpsAgent) {
    requestConfig.httpsAgent = httpsAgent;
  }

  return axios.post(url, body, requestConfig);
}

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
    const id = data?.result?.id;
    const transactionId = id && isPrivacySwap ? `p_${id}` : id;
    if (transactionId) {
      await this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress
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
    const id = data?.result?.id;
    const transactionId = id && isPrivacySwap ? `p_${id}` : id;

    if (transactionId) {
      await this.swapTxnHistory.updateTransactionDetails(
        transactionId,
        walletAddress
      );
    }
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  async getTransactionHistory(params) {
    const walletAddress = params && params.walletAddress;
    let actualTransactions = await this.swapTxnHistory.getOrderHistory(
      walletAddress
    );
    let orderHistory = [];
    let finalorderHistory = [];
    if (!Array.isArray(actualTransactions) || actualTransactions.length === 0) {
      this.sendGateway("set_txnHistory", []);
      return;
    }

    const normalIds = actualTransactions.filter(
      id => id && typeof id === "string" && !id.startsWith("p_")
    );
    const privacyIds = actualTransactions
      .filter(id => id && typeof id === "string" && id.startsWith("p_"))
      .map(id => id.substring(2));

    const fetchHistory = async (ids, privacySwap) => {
      for (let i = 0; i < Math.ceil(ids.length / 10); i++) {
        let chunkIds = ids.slice(i * 10, (i + 1) * 10);
        let rpcParams = {
          id: chunkIds,
          privacySwap: privacySwap
        };
        let response = await this.sendRPC("getTransactions", rpcParams);
        if (response && response.result && Array.isArray(response.result)) {
          for (let j = 0; j < response.result.length; j++) {
            response.result[j].privacySwap = privacySwap;
            orderHistory.push(response.result[j]);
          }
        }
      }
    };

    if (normalIds.length > 0) {
      await fetchHistory(normalIds, false);
    }
    if (privacyIds.length > 0) {
      await fetchHistory(privacyIds, true);
    }

    for (let k = 0; k < actualTransactions.length; k++) {
      const txnItem = actualTransactions[k];
      if (!txnItem || typeof txnItem !== "string") continue;
      const currentId = txnItem.startsWith("p_")
        ? txnItem.substring(2)
        : txnItem;
      const element = orderHistory.find(e => e && e.id == currentId);
      if (element) {
        finalorderHistory.push(element);
      }
    }
    finalorderHistory = finalorderHistory.filter(Boolean);
    finalorderHistory.sort((a, b) => {
      const ta = new Date(a && (a.createdAt || a.created_at));
      const tb = new Date(b && (b.createdAt || b.created_at));
      return tb - ta;
    });
    this.sendGateway("set_txnHistory", finalorderHistory);
    return;
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

      const pinnedHosts = getPinnedHosts();
      const beldexSwapSignUrl = getBeldexSwapSignUrl(isPrivacySwap);
      let signature = await pinnedPost(
        beldexSwapSignUrl,
        body,
        {
          "x-api-key": process.env.BELDEX_API_KEY,
          "Content-Type": "application/json"
        },
        pinnedHosts
      );

      let headers = {
        "Content-Type": "application/json",
        "X-Api-Key": isPrivacySwap
          ? process.env.CHANGELLY_PRIVACY_SWAP_API_KEY
          : process.env.CHANGELLY_SWAP_API_KEY,
        "X-Api-Signature": signature.data.signature
      };

      try {
        let response = await pinnedPost(
          CHANGELLY_API_URL,
          body,
          headers,
          pinnedHosts
        );
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
