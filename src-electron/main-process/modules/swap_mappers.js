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

    if (exchange === "changelly") {
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
    }

    return {
      name: (c.name || c.ticker || "").toUpperCase(),
      ticker: (c.ticker || c.name || "").toLowerCase(),
      fullName: c.fullName || c.name || "",
      enabled: true,
      enabledFrom: true,
      enabledTo: true,
      fixRateEnabled: false,
      payinConfirmations: 0,
      extraIdName: null,
      image: c.image || "",
      protocol: c.protocol || ""
    };
  });
}
