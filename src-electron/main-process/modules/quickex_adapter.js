import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  normalizeCurrencyList,
  normalizeExchangeAmount,
  normalizePairsParams,
  normalizeValidateAddress,
  normalizeCreatedTransaction,
  normalizeTransactionStatus
} from "./swap_mappers.js";

dotenv.config();

const QUICKEX_API_URL = "https://quickex.io/api";
const QUICKEX_PUBLIC_KEY = process.env.QUICKEX_SWAP_PUPLIC_KEY;
const QUICKEX_SECRET_KEY = process.env.QUICKEX_SWAP_SECRET_KEY;
const REFERRER_ID = process.env.QUICKEX_REFERRER_ID;

function _buildAuthHeaders(body, queryStr) {
  const timestamp = Date.now().toString();
  const bodyString = body ? JSON.stringify(body) : queryStr || "";
  const payload = `${timestamp}${bodyString}${QUICKEX_PUBLIC_KEY}`;
  const signature = crypto
    .createHmac("sha256", QUICKEX_SECRET_KEY)
    .update(payload)
    .digest("base64");
  return {
    "X-Api-Public-Key": QUICKEX_PUBLIC_KEY,
    "X-Api-Timestamp": timestamp,
    "X-Api-Signature": signature
  };
}

function _handleError(method, err, errorData, params) {
  const errMessage = errorData?.message || err.message || "Unknown error";
  console.error("[quickex_adapter] error:", method, errMessage);
  const targets = [
    errorData?.data?.details,
    errorData?.details,
    errorData?.data,
    errorData
  ];
  const expectedAmount =
    targets
      .map(t => t?.expectedGeneral ?? t?.expected)
      .find(val => val != null) ?? _parseExpectedFromMessage(errMessage);

  if (expectedAmount) {
    let minMaxHint = {};
    if (errMessage?.includes("Amount Too Small")) {
      minMaxHint = {
        from: params?.fromDetails?.value,
        to: params?.toDetails?.value,
        minAmountFloat: expectedAmount,
        maxAmountFloat: 0,
        minAmountFixed: expectedAmount
      };
    } else if (errMessage?.includes("Amount Too Big")) {
      minMaxHint = {
        from: params?.fromDetails?.value,
        to: params?.toDetails?.value,
        minAmountFloat: 0,
        maxAmountFloat: expectedAmount,
        minAmountFixed: 0
      };
    }

    return {
      status: false,
      method,
      error: { message: `${errMessage}. Expected: ${expectedAmount}` },
      minMaxHint
    };
  }
  return { status: false, method, error: { message: errMessage } };
}

function _parseExpectedFromMessage(msg) {
  if (!msg) return null;
  const match = msg.match(/expected[:\s]+(\d+\.?\d*)/i);
  return match ? Number(match[1]) : null;
}

const _baseHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/** Fetches the full list of instruments supported by QuickEx. */
export async function getCurrenciesFull() {
  const method = "getCurrenciesFull";
  try {
    const res = await axios.get(`${QUICKEX_API_URL}/v2/instruments/public`, {
      headers: _baseHeaders
    });
    const result = normalizeCurrencyList(res.data, "quickex");
    return { status: true, method, result };
  } catch (err) {
    return _handleError(method, err, err.response?.data || {}, {});
  }
}

/** Gets the floating exchange rate estimate for a pair. */
export async function getExchangeAmount(params) {
  const method = "getExchangeAmount";
  try {
    const from = params?.fromDetails?.value.toUpperCase();
    const fromNetwork = params?.fromDetails?.protocol.toUpperCase();
    const to = params?.toDetails?.value.toUpperCase();
    const toNetwork = params?.toDetails?.protocol.toUpperCase();
    const amount = params.amountFrom || params.amount;
    const url = `${QUICKEX_API_URL}/v2/rates/public/one?instrumentFromCurrencyTitle=${from}&instrumentFromNetworkTitle=${fromNetwork}&instrumentToCurrencyTitle=${to}&instrumentToNetworkTitle=${toNetwork}&claimedDepositAmountCurrency=${from}&claimedDepositAmount=${amount}&rateMode=FLOATING&exchangeType=crypto&referrerId=${REFERRER_ID}`;
    const res = await axios.get(url, { headers: _baseHeaders });
    const result = normalizeExchangeAmount(res.data, params);
    return { status: true, method, result };
  } catch (err) {
    const optimiszedparams = {
      fromDetails: {
        value: params?.fromDetails?.value,
        protocol: params?.fromDetails?.protocol,
        name: params?.fromDetails?.name
      },
      toDetails: {
        value: params?.toDetails?.value,
        protocol: params?.toDetails?.protocol,
        name: params?.toDetails?.name
      },
      amountFrom: params.amountFrom || params.amount,
      privacySwap: false,
      pairsMinMax: params.pairsMinMax || null
    };
    return _handleError(
      method,
      err,
      err.response?.data || {},
      optimiszedparams
    );
  }
}

export async function getFixRateForAmount() {
  return {
    status: false,
    method: "getFixRateForAmount",
    error: { message: "Fixed-rate lookup not yet implemented for QuickEx." }
  };
}

/** Gets min/max pair parameters. */
export async function getPairsParams(params) {
  const method = "getPairsParams";
  try {
    const from = params?.fromDetails?.value.toUpperCase();
    const fromNetwork = params?.fromDetails?.protocol.toUpperCase();
    const to = params?.toDetails?.value.toUpperCase();
    const toNetwork = params?.toDetails?.protocol.toUpperCase();
    const amount = params.amountFrom || params.amount;

    const url = `${QUICKEX_API_URL}/v2/rates/public/one?instrumentFromCurrencyTitle=${from}&instrumentFromNetworkTitle=${fromNetwork}&instrumentToCurrencyTitle=${to}&instrumentToNetworkTitle=${toNetwork}&claimedDepositAmountCurrency=${from}&claimedDepositAmount=${amount}&rateMode=FLOATING&exchangeType=crypto&referrerId=${REFERRER_ID}`;
    const res = await axios.get(url, { headers: _baseHeaders });
    const result = normalizePairsParams(res.data, params);
    return { status: true, method, result };
  } catch (err) {
    return _handleError(method, err, err.response?.data || {}, params);
  }
}

/** Validates a recipient address. */
export async function validateAddress(params) {
  const method = "validateAddress";
  try {
    const body = {
      currencyTitle: params.currency.toUpperCase(),
      networkTitle: params.currencyNetWork.toUpperCase(),
      address: params.address
    };
    if (params.extraId) body.memo = params.extraId;
    const res = await axios.post(
      `${QUICKEX_API_URL}/v1/instruments/public/validate-address`,
      body,
      { headers: _baseHeaders }
    );
    const result = normalizeValidateAddress(res.data);
    return { status: true, method, result };
  } catch (err) {
    return _handleError(method, err, err.response?.data || {}, params);
  }
}

/** Creates a QuickEx swap order (floating or fixed). */
export async function createTransaction(params) {
  const method = "createTransaction";
  try {
    const body = {
      instrumentFrom: {
        currencyTitle: (params.from || "").toUpperCase(),
        networkTitle: (params.networkFrom || "").toUpperCase()
      },
      instrumentTo: {
        currencyTitle: (params.to || "").toUpperCase(),
        networkTitle: (params.networkTo || "").toUpperCase()
      },
      destinationAddress: params.address,
      refundAddress: params.refundAddress || "",
      claimedDepositAmount: String(params.amountFrom || params.amount || ""),
      referrerId: REFERRER_ID
    };
    if (params.extraId) body.destinationAddressMemo = params.extraId;
    if (params.refundExtraId) body.refundAddressMemo = params.refundExtraId;
    const authHeaders = _buildAuthHeaders(body, "");
    const res = await axios.post(
      `${QUICKEX_API_URL}/v2/orders/public/create`,
      body,
      { headers: { ..._baseHeaders, ...authHeaders } }
    );
    if (res.status >= 400) return { status: false, method, error: res.data };

    const result = normalizeCreatedTransaction(res.data);
    return { status: true, method, result };
  } catch (err) {
    return _handleError(method, err, err.response?.data || {}, params);
  }
}

// QuickEx uses the same endpoint for fixed-rate orders
export { createTransaction as createFixTransaction };

export async function getTransactionStatus(params, dbManager) {
  const method = "get_transaction_status";
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!orderId) return { status: false, method };

  let destAddress = params.destinationAddress || params.destination_address;
  if (!destAddress && dbManager) {
    const record = dbManager.getTxnById(orderId);
    if (record) {
      destAddress = record?.payout_address;
    }
  }

  let queryString = `orderId=${orderId}`;
  if (destAddress)
    queryString += `&destinationAddress=${encodeURIComponent(destAddress)}`;

  const url = `${QUICKEX_API_URL}/v2/orders/public-info?${queryString}`;
  const authHeaders = _buildAuthHeaders(null, queryString);
  try {
    const res = await axios.get(url, {
      headers: { ..._baseHeaders, ...authHeaders }
    });
    if (res.status >= 400) return { status: false, method, error: res.data };

    const result = normalizeTransactionStatus(res.data);
    return { status: true, method, result };
  } catch (err) {
    return _handleError(method, err, err.response?.data || {}, params);
  }
}

export async function getTransactions(params, dbManager) {
  const method = "getTransactions";
  if (!params.id || !Array.isArray(params.id)) return { status: false, method };

  const fetchPromises = params.id.map(async orderId => {
    const res = await getTransactionStatus(
      {
        id: orderId,
        walletAddress: params.walletAddress,
        destinationAddress: params.destinationAddress,
        privacySwap: params.privacySwap
      },
      dbManager
    );
    if (res?.status && Array.isArray(res.result) && res.result.length > 0)
      return res.result[0];
    return null;
  });

  const results = (await Promise.all(fetchPromises)).filter(Boolean);
  return { status: true, method, result: results, exchange_type: "quickex" };
}
