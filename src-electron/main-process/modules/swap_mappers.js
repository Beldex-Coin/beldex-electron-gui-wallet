import { isWithin3Hours, toMsEpoch } from "../../utils.js";

const QUICKEX_EVENT_STATUS_MAP = {
  CREATION_END: "waiting",
  INCOMING_FUNDS_DETECTED: "confirming",
  DEPOSIT_REGISTERED: "exchanging",
  FUNDS_WITHDRAWAL_START: "sending",
  WITHDRAWAL_COMPLETED: "finished"
};

export function resolveQuickexTxStatus(tx) {
  if (tx.completed) return "finished";
  if (tx.failedToCreate) return "failed";
  if (tx.orderEvents?.length > 0) {
    const event = tx.orderEvents[0];
    if (!isWithin3Hours(event.createdAt)) return "overdue";
    return QUICKEX_EVENT_STATUS_MAP[event.kind] ?? "waiting";
  }
  if (tx.isPendingToCreate) return "waiting";
  return "waiting";
}

function _extractAddr(val, key) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val[key] || val.address || "";
  return "";
}

export function normalizeCurrencyList(rawList, exchange) {
  if (!Array.isArray(rawList)) return [];

  return rawList.map(c => {
    if (exchange === "quickex") {
      return {
        name: (c.currencyTitle || "").toUpperCase(),
        ticker: (c.currencyTitle || "").toLowerCase(),
        fullName:
          c.fullName || c.currencyFriendlyTitle || c.currencyTitle || "",
        enabled: true,
        enabledFrom: true,
        enabledTo: true,
        fixRateEnabled: true,
        payinConfirmations: 3,
        extraIdName: c.requiresMemo ? "memo" : null,
        image: c.currencyLogoLink || "",
        protocol: c.networkTitle || ""
      };
    }

    return {
      name: (c.ticker || c.name || "").toUpperCase(),
      ticker: (c.ticker || c.name || "").toLowerCase(),
      fullName: c.fullName || c.name || "",
      enabled: Boolean(c.enabled),
      enabledFrom: Boolean(c.enabledFrom),
      enabledTo: Boolean(c.enabledTo),
      fixRateEnabled: Boolean(c.fixRateEnabled),
      payinConfirmations: Number(c.payinConfirmations) || 0,
      extraIdName: c.extraIdName || null,
      image: c.image || "",
      protocol: c.protocol || c.contractAddress || ""
    };
  });
}

export function normalizeExchangeAmount(data, params) {
  const from = (params?.fromDetails?.value || params?.from || "").toUpperCase();
  const to = (params?.toDetails?.value || params?.to || "").toUpperCase();
  const amount = params.amountFrom || params.amount;
  return [
    {
      from,
      to,
      amountFrom: amount,
      amountTo: data.amountToGet,
      networkFee: data.finalNetworkFeeAmount || data.networkFee || 0,
      rate: data.price,
      result: data.amountToGet
    }
  ];
}

export function normalizePairsParams(data, params) {
  const from = (params?.fromDetails?.value || params?.from || "").toUpperCase();
  const to = (params?.toDetails?.value || params?.to || "").toUpperCase();
  if (
    (data?.generalMinAmount && data?.generalMaxAmount) ||
    (data?.minAmountFloat && data?.maxAmountFloat)
  ) {
    return [
      {
        from,
        to,
        minAmountFloat: data.generalMinAmount,
        maxAmountFloat: data.generalMaxAmount,
        minAmountFixed: data.generalMinAmount,
        maxAmountFixed: data.generalMaxAmount
      }
    ];
  }
  return [
    {
      from,
      to,
      minAmountFloat: 0,
      maxAmountFloat: 0,
      minAmountFixed: 0,
      maxAmountFixed: 0
    }
  ];
}

export function normalizeValidateAddress(data) {
  return {
    result: typeof data === "boolean" ? data : data?.result === true
  };
}

export function normalizeCreatedTransaction(data) {
  return {
    id: data.orderId,
    type: "float",
    networkFee: data.claimedNetworkFee,
    platformFee: data?.claimedPublicRate?.platformFee_Absolute || 0,
    apiExtraFee: data.claimedNetworkFee,
    payinAddress: _extractAddr(data.depositAddress, "depositAddress"),
    payinExtraId: _extractAddr(data.depositAddress, "depositAddressMemo"),
    payoutAddress: data.destinationAddress || "",
    payoutExtraId: data.destinationAddressMemo || null,
    refundAddress: data.refundAddress || "",
    refundExtraId: data.refundAddressMemo || null,
    amountExpectedFrom: data.claimedDepositAmount,
    amountExpectedTo: data.amountToGet,
    amountTo: data.amountToGet,
    status: data.completed ? "finished" : "waiting",
    currencyFrom: (data.instrumentFromCurrencyTitle || "").toLowerCase(),
    currencyTo: (data.instrumentToCurrencyTitle || "").toLowerCase(),
    payTill: new Date(Date.now() + 15 * 60000).toISOString(),
    createdAt: toMsEpoch(data.createdAt),
    created_at: toMsEpoch(data.createdAt),
    raw_response: data
  };
}

export function normalizeTransactionStatus(data) {
  const rawArray = Array.isArray(data) ? data : data ? [data] : [];
  return rawArray.map(tx => {
    const status = resolveQuickexTxStatus(tx);
    const amountExpectedFrom = tx.claimedDepositAmount;
    const amountExpectedTo = tx.amountToGet;
    let rate = tx.price;
    if (!rate && amountExpectedFrom && amountExpectedTo) {
      rate = Number(amountExpectedTo) / Number(amountExpectedFrom);
    }
    return {
      id: tx.orderId || tx.id,
      status,
      currencyFrom: (
        tx.instrumentFromCurrencyTitle ||
        tx.currencyFrom ||
        ""
      ).toLowerCase(),
      currencyTo: (
        tx.instrumentToCurrencyTitle ||
        tx.currencyTo ||
        ""
      ).toLowerCase(),
      payinAddress:
        _extractAddr(tx.depositAddress, "depositAddress") ||
        tx.payinAddress ||
        "",
      payinExtraId:
        _extractAddr(tx.depositAddress, "depositAddressMemo") ||
        tx.payinExtraId ||
        "",
      payoutAddress:
        _extractAddr(tx.destinationAddress, "destinationAddress") ||
        tx.payoutAddress ||
        "",
      refundAddress:
        _extractAddr(tx.refundAddress, "refundAddress") ||
        tx.refundAddress ||
        "",
      amountExpectedFrom,
      amountExpectedTo,
      rate: rate || 0,
      networkFee: tx.claimedNetworkFee || tx.networkFee || 0,
      moneyReceived:
        tx.moneyReceived ||
        tx.money_received ||
        toMsEpoch(tx.createdAt || tx.created_at),
      moneySent:
        tx.moneySent ||
        tx.money_sent ||
        toMsEpoch(tx.createdAt || tx.created_at),
      payinHash: tx.payinHash || tx.payin_hash || "",
      payoutHashLink: tx.payoutHashLink || tx.payout_hash_link || "",
      createdAt: toMsEpoch(tx.createdAt || tx.created_at),
      created_at: toMsEpoch(tx.createdAt || tx.created_at),
      raw_response: tx
    };
  });
}
