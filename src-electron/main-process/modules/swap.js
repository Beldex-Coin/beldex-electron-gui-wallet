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

function getBeldexSwapSignUrl() {
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
  parsed.searchParams.set("type", "swap");

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
    let walletAddress = params.walletAddress;
    delete params["walletAddress"];
    let data = await this.sendRPC("createTransaction", params);
    await this.swapTxnHistory.updateTransactionDetails(
      data.result.id,
      walletAddress
    );
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  async createFixTransaction(params) {
    let walletAddress = params.walletAddress;
    delete params["walletAddress"];
    let data = await this.sendRPC("createFixTransaction", params);
    await this.swapTxnHistory.updateTransactionDetails(
      data.result.id,
      walletAddress
    );
    this.sendGateway("set_createdTxnDetails", data);
    return;
  }

  async getTransactionHistory(params) {
    let actualTransactions = await this.swapTxnHistory.getOrderHistory(
      params.walletAddress
    );
    let orderHistory = [];
    let finalorderHistory = [];
    for (let i = 0; i < actualTransactions.length / 10; i++) {
      let ids = actualTransactions.slice(i * 10, (i + 1) * 10);
      let params = {
        id: ids
      };
      let response = await this.sendRPC("getTransactions", params);
      for (let j = 0; j < response.result.length; j++) {
        orderHistory.push(response.result[j]);
      }
    }
    for (let k = 0; k < orderHistory.length; k++) {
      const element = orderHistory.find(e => e.id == actualTransactions[k]);
      finalorderHistory.push(element);
    }
    this.sendGateway("set_txnHistory", orderHistory);
    return;
  }

  async getTransactionStatus(params) {
    let data = await this.sendRPC("getTransactions", params);
    this.sendGateway("set_txnStatus", data);
    return;
  }

  async sendRPC(method, params = {}) {
    try {
      const body = {
        jsonrpc: "2.0",
        id: "test",
        method,
        params
      };

      const pinnedHosts = getPinnedHosts();
      const beldexSwapSignUrl = getBeldexSwapSignUrl();

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
        "X-Api-Key": process.env.CHANGELLY_SWAP_API_KEY,
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
