// This allows for logging (to a file) from the frontend by creating global logging functions
// That send ipc calls (from renderer) to the electron main process
// create global logging functions for the frontend. It sends messages to the main
// process which then log to file

const electron = require("electron");

const _ = require("lodash");

const ipc = electron.ipcRenderer;

function log(...args) {
  logAtLevel("info", "INFO ", ...args);
}

if (window.console) {
  console._log = console.log;
  console.log = log;
  console._trace = console.trace;
  console._debug = console.debug;
  console._info = console.info;
  console._warn = console.warn;
  console._error = console.error;
  console._fatal = console.error;
}

// To avoid [Object object] in our log since console.log handles non-strings
// smoothly
function cleanArgsForIPC(args) {
  const redactKeyPattern = /(password|seed|mnemonic|secret|spend[_-]?key|view[_-]?key|private[_-]?key|auth|token)/i;
  const redactValue = item => {
    if (Array.isArray(item)) {
      return item.map(redactValue);
    }

    if (item && typeof item === "object") {
      return Object.keys(item).reduce((result, key) => {
        result[key] = redactKeyPattern.test(key)
          ? "[REDACTED]"
          : redactValue(item[key]);
        return result;
      }, {});
    }

    return item;
  };

  const str = args.map(item => {
    if (typeof item !== "string") {
      try {
        return JSON.stringify(redactValue(item));
      } catch (error) {
        return item;
      }
    }

    return redactKeyPattern.test(item) ? "[REDACTED]" : item;
  });

  return str.join(" ");
}

// Backwards-compatible logging, simple strings and no level (defaulted to INFO)
function now() {
  const date = new Date();
  return date.toJSON();
}

// The Bunyan API: https://github.com/trentm/node-bunyan#log-method-api
function logAtLevel(level, prefix, ...args) {
  const fn = `_${level}`;
  console[fn](prefix, now(), ...args);

  const logText = cleanArgsForIPC(args);
  ipc.send(`log-${level}`, logText);
}

window.log = {
  fatal: _.partial(logAtLevel, "fatal", "FATAL"),
  error: _.partial(logAtLevel, "error", "ERROR"),
  warn: _.partial(logAtLevel, "warn", "WARN "),
  info: _.partial(logAtLevel, "info", "INFO "),
  debug: _.partial(logAtLevel, "debug", "DEBUG"),
  trace: _.partial(logAtLevel, "trace", "TRACE")
};

window.onerror = (message, script, line, col, error) => {
  const errorInfo = error && error.stack ? error.stack : JSON.stringify(error);
  window.log.error(`Top-level unhandled error: ${errorInfo}`);
};

window.addEventListener("unhandledrejection", rejectionEvent => {
  const error = rejectionEvent.reason;
  const errorInfo = error && error.stack ? error.stack : error;
  window.log.error("Top-level unhandled promise rejection:", errorInfo);
});
