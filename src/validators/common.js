/* eslint-disable prefer-promise-reject-errors */
export const greater_than_zero = input => {
  return input > 0;
};

export const privkey = input => {
  return (
    input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && input.length == 64)
  );
};

export const master_node_key = input => {
  return input.length === 64 && /^[0-9A-Za-z]+$/.test(input);
};

export const bchat_id = input => {
  return input.length === 66 && /^bd[0-9A-Za-z]+$/.test(input);
};

// shortened Belnet BNS name
export const belnet_name = (input, beldexExt = false) => {
  let inputSafe = input || "";
  let maxLength = 32;

  if (inputSafe.includes("-")) {
    maxLength = 63;
  }

  let dashRule = !(
    inputSafe.length > 4 &&
    inputSafe.slice(2, 4) === "--" &&
    !(inputSafe.slice(0, 2) === "xn")
  );

  let reservedNames = ["localhost", "beldex", "mnode"];
  let regexCheck;
  if (beldexExt) {
    regexCheck = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.bdx$/.test(inputSafe);
  } else {
    regexCheck = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(inputSafe);
  }
  return (
    inputSafe.length <= maxLength &&
    dashRule &&
    !reservedNames.includes(inputSafe) &&
    regexCheck
  );
};

export const bchat_name_or_belnet_name = input => {
  const lcInput = input.toLowerCase();
  return bchat_name(lcInput) || belnet_name(lcInput, true);
};

// Full belnet address
export const belnet_address = input => {
  return (
    input.length === 52 &&
    /^[ybndrfg8ejkmcpqxot1uwisza345h769]{51}[yo]$/.test(input)
  );
};

export const bchat_name = input => {
  return (
    input.length === 0 ||
    /^[a-z0-9_]([a-z0-9-_]*[a-z0-9_])?$/.test(input.toLowerCase())
  );
};
export const bns_name = input => {
  return (
    input.length === 0 ||
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(input.toLowerCase())
  );
};

export const eth_address = input => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(input);
};

export const address = (input, gateway) => {
  // Validate the address
  return new Promise((resolve, reject) => {
    if (input.toLowerCase().endsWith(".bdx")) {
      return resolve();
    }
    if (!/^[0-9A-Za-z]+$/.test(input)) return reject();
    gateway.once("validate_address", data => {
      if (data.address && data.address !== input) {
        reject();
      } else {
        if (data.valid) {
          resolve();
        } else {
          reject();
        }
      }
    });
    gateway.send("wallet", "validate_address", {
      address: input
    });
  });
};
