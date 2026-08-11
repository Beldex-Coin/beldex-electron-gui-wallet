import axios from "axios";
import dotenv from "dotenv";
import { signRequest } from "../../utils.js";
import { normalizeCurrencyList } from "./swap_mappers.js";

dotenv.config();

const CHANGELLY_API_URL = "https://api.changelly.com/v2";

async function _post(method, params, isPrivacySwap) {
  const requestParams = { ...params };
  delete requestParams.privacySwap;
  delete requestParams.exchange_type;
  delete requestParams.exchange;

  const body = {
    jsonrpc: "2.0",
    id: "beldex",
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
    if (Object.prototype.hasOwnProperty.call(response.data, "error")) {
      return { status: false, method, error: response.data };
    }
    return { status: true, method, result: response.data.result };
  } catch (err) {
    console.error(
      "[changelly_adapter] HTTP error:",
      method,
      err.message || err
    );
    return { status: false, method, error: { message: err.message } };
  }
}

export async function getCurrenciesFull(params = {}) {
  const res = await _post("getCurrenciesFull", {}, Boolean(params.privacySwap));
  if (res.status && Array.isArray(res.result)) {
    res.result = normalizeCurrencyList(res.result, "changelly");
  }
  return res;
}

export async function getExchangeAmount(params) {
  return _post("getExchangeAmount", params, Boolean(params.privacySwap));
}

export async function getFixRateForAmount(params) {
  return _post("getFixRateForAmount", params, Boolean(params.privacySwap));
}

export async function getPairsParams(params) {
  return _post("getPairsParams", params, Boolean(params.privacySwap));
}

export async function validateAddress(params) {
  return _post("validateAddress", params, Boolean(params.privacySwap));
}

export async function createTransaction(params) {
  return _post("createTransaction", params, Boolean(params.privacySwap));
}

export async function createFixTransaction(params) {
  return _post("createFixTransaction", params, Boolean(params.privacySwap));
}

export async function getTransactions(params) {
  const ids = Array.isArray(params.id) ? params.id : [params.id];
  return _post("getTransactions", { id: ids }, Boolean(params.privacySwap));
}
