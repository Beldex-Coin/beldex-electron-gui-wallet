import axios from "axios";

export class Swap {
  async handle(data) {
    let params = data.data;

    switch (data.method) {
      case "has_password":
        this.hasPassword();
        break;

      case "create_wallet":
        this.createWallet(params.name, params.password, params.language);
        break;

      default:
    }
  }

  getCurrencyList() {
    return this.sendRPC("getCurrenciesFull", {});
  }

  getExchangeAmount() {
    let params = {
      from: "btc",
      to: "eth",
      address: "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7",
      amountFrom: "0.1"
    };
    return this.sendRPC("getExchangeAmount", params);
  }

  getFixedExchangeAmount() {
    let params = {
      from: "btc",
      to: "eth",
      amountFrom: "0.1"
    };
    return this.sendRPC("getFixRateForAmount", params);
  }

  getPairsMinMax() {
    let params = {
      from: "btc",
      to: "eth"
    };
    return this.sendRPC("getPairsParams", params);
  }

  getMinAmount() {
    let params = {
      from: "xrp",
      to: "eth"
    };
    return this.sendRPC("getMinAmount", params);
  }

  validateAddress() {
    let params = {
      currency: "eth",
      address: "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7"
    };
    return this.sendRPC("validateAddress", params);
  }

  createTransaction() {
    let params = {
      from: "btc",
      to: "eth",
      address: "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7",
      // "extraId": "<<valid xrp extraId>>",
      amountFrom: "0.1"
    };
    return this.sendRPC("createTransaction", params);
  }

  createFixTransaction() {
    let params = {
      from: "btc",
      to: "eth",
      address: "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7",
      amountFrom: "0.1",
      rateId: "xnsnh0&jcqJG4awmG8La0y5pLGIpIQ",
      refundAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    };
    return this.sendRPC("createFixTransaction", params);
  }

  getTransactionHistory() {
    let params = {
      currency: "eth",
      // "address": "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7",
      // "extraId": "<<payin extraId to search>>",
      limit: 10,
      offset: 10
    };
    return this.sendRPC("getTransactions", params);
  }

  getTransactionStatus() {
    let params = {
      id: "yam9z4aanpqnchy4" //create transaction id
    };
    return this.sendRPC("getStatus", params);
  }

  async sendRPC(method, params = {}) {
    let body = {
      jsonrpc: "2.0",
      id: "test",
      method,
      params
    };
    let headers = {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "<<YOUR_API_KEY>>",
        "X-Api-Signature": "<<YOUR_API_SIGNATURE_KEY>>"
      }
    };
    try {
      let response = await axios.post(
        "https://api.changelly.com/v2",
        body,
        headers
      );
      console.log("A:", response.data.result.length);
      return response.data.result.length;
    } catch (err) {
      return err;
    }
  }
}
