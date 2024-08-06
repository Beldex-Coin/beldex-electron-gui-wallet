import axios from "axios";
const { SwapTxnHistory } = require("./swap_transaction_history");

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
      const https = require("https");
      const body = {
        jsonrpc: "2.0",
        id: "test",
        method,
        params
      };
      const agent = new https.Agent({
        requestCert: true,
        rejectUnauthorized: false,
        ca: `your pem key`
      });
      let signature = await axios.post(
        "https://api.beldex.dev/api/v1/swap",
        body,
        { httpsAgent: agent }
      );
      let headers = {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "+kLt3F2TMo8W2LbQSjs6IDaBG4O/VLZsRH+qnNX5FyU=",
          "X-Api-Signature": signature.data.signature
        }
      };
      // const request = require('request');
      // let options = {
      //   'method': 'POST',
      //   'url': 'https://api.changelly.com/v2',
      //   'headers': {
      //     'Content-Type': 'application/json',
      //     'X-Api-Key': '<<ENTER YOUR API KEY >>',
      //     'X-Api-Signature': '<<ENTER YOUR PRIVATE KEY >>'
      //   },
      //   body: JSON.stringify(bo)
      // };
      // request(options, function (error, data) {
      // try {
      //   let response = JSON.parse(data.body);
      //   if (response.hasOwnProperty("error")) {
      //     return {
      //       status:400,
      //       method: method,
      //       params: params,
      //       error: response.error
      //     };
      //   }
      //   return {
      //     status:200,
      //     method: method,
      //     params: params,
      //     result: response.result
      //   };
      // } catch (err) {
      //   return {
      //     status:400,
      //     method: method,
      //     params: params,
      //     error: response.error
      //   };
      // }
      // });
      try {
        let response = await axios.post(
          "https://api.changelly.com/v2",
          body,
          headers
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
      return err;
    }
  }
}
