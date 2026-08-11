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

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
export function isWithin3Hours(timestamp) {
  return Math.abs(Date.now() - new Date(timestamp).getTime()) <= THREE_HOURS_MS;
}

export function toMsEpoch(value) {
  if (value === null || value === undefined || value === "") {
    return Date.now();
  }
  if (typeof value === "string" && isNaN(value)) {
    const ms = new Date(value).getTime();
    return isNaN(ms) ? Date.now() : ms;
  }
  let num = Number(value);
  if (isNaN(num)) return Date.now();
  const digits = Math.floor(Math.abs(num)).toString().length;
  if (digits >= 16) {
    return Math.floor(num / 1000);
  } else if (digits <= 10) {
    return num * 1000;
  }
  return num;
}

export function formatTime(value, { padSeconds = false, utc = false } = {}) {
  const ms = toMsEpoch(value);
  const date = new Date(ms);
  if (isNaN(date.getTime())) return "";

  const getDay = utc ? date.getUTCDate() : date.getDate();
  const getMonthIdx = utc ? date.getUTCMonth() : date.getMonth();
  const getYear = utc ? date.getUTCFullYear() : date.getFullYear();
  const getHours = utc ? date.getUTCHours() : date.getHours();
  const getMinutes = utc ? date.getUTCMinutes() : date.getMinutes();
  const getSeconds = utc ? date.getUTCSeconds() : date.getSeconds();

  const day = getDay.toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const month = months[getMonthIdx];
  const hours = getHours.toString().padStart(2, "0");
  const minutes = getMinutes.toString().padStart(2, "0");
  const seconds = padSeconds
    ? getSeconds.toString().padStart(2, "0")
    : getSeconds;

  return `${day} ${month} ${getYear} ${hours}.${minutes}.${seconds}`;
}
