const crypto = require("crypto");
import dotenv from "dotenv";

dotenv.config();

export function signRequest(isPrivacySwap, body) {
  try {
    const private_key = isPrivacySwap
      ? process.env.CHANGELLY_PRIVACY_SWAP_PRIVATE_KEY
      : process.env.CHANGELLY_SWAP_PRIVATE_KEY;
    const privateKeybuffer = Buffer.from(private_key, "hex");
    const privateKey = crypto.createPrivateKey({
      key: privateKeybuffer,
      format: "der",
      type: "pkcs8",
      encoding: "hex"
    });

    const signature = crypto.sign("sha256", Buffer.from(JSON.stringify(body)), {
      key: privateKey,
      type: "pkcs8",
      format: "der"
    });
    const signatureBase64 = signature.toString("base64");
    return signatureBase64;
  } catch (error) {
    console.error("Error signing request:", error);
  }
}
