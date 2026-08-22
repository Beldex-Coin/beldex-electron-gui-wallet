const crypto = require("crypto");
const {
  clipboard,
  contextBridge,
  ipcRenderer,
  nativeImage,
  shell
} = require("electron");

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

  return args
    .map(item => {
      if (typeof item !== "string") {
        try {
          return JSON.stringify(redactValue(item));
        } catch (error) {
          return item;
        }
      }

      return redactKeyPattern.test(item) ? "[REDACTED]" : item;
    })
    .join(" ");
}

function now() {
  return new Date().toJSON();
}

function installRendererLogging() {
  if (typeof window === "undefined") {
    return;
  }

  function logAtLevel(level, prefix, ...args) {
    const fn = `_${level}`;
    if (typeof console[fn] === "function") {
      console[fn](prefix, now(), ...args);
    }

    ipcRenderer.send(`log-${level}`, cleanArgsForIPC(args));
  }

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

  window.log = {
    fatal: (...args) => logAtLevel("fatal", "FATAL", ...args),
    error: (...args) => logAtLevel("error", "ERROR", ...args),
    warn: (...args) => logAtLevel("warn", "WARN ", ...args),
    info: (...args) => logAtLevel("info", "INFO ", ...args),
    debug: (...args) => logAtLevel("debug", "DEBUG", ...args),
    trace: (...args) => logAtLevel("trace", "TRACE", ...args)
  };

  window.onerror = (message, script, line, col, error) => {
    const errorInfo =
      error && error.stack ? error.stack : JSON.stringify(error);
    window.log.error(`Top-level unhandled error: ${errorInfo}`);
  };

  window.addEventListener("unhandledrejection", rejectionEvent => {
    const error = rejectionEvent.reason;
    const errorInfo = error && error.stack ? error.stack : error;
    window.log.error("Top-level unhandled promise rejection:", errorInfo);
  });
}

installRendererLogging();

class SCEE {
  constructor() {
    this.algorithmName = "aes-128-gcm";
    this.algorithmNonceSize = 12;
    this.algorithmTagSize = 16;
    this.algorithmKeySize = 16;
    this.pbkdf2Name = "sha256";
    this.pbkdf2SaltSize = 16;
    this.pbkdf2Iterations = 32767;
  }

  encryptString(plaintext, password) {
    const salt = crypto.randomBytes(this.pbkdf2SaltSize);
    const key = crypto.pbkdf2Sync(
      Buffer.from(password, "utf8"),
      salt,
      this.pbkdf2Iterations,
      this.algorithmKeySize,
      this.pbkdf2Name
    );
    const ciphertextAndNonceAndSalt = Buffer.concat([
      salt,
      this.encrypt(Buffer.from(plaintext, "utf8"), key)
    ]);

    return ciphertextAndNonceAndSalt.toString("base64");
  }

  decryptString(base64CiphertextAndNonceAndSalt, password) {
    const ciphertextAndNonceAndSalt = Buffer.from(
      base64CiphertextAndNonceAndSalt,
      "base64"
    );
    const salt = ciphertextAndNonceAndSalt.slice(0, this.pbkdf2SaltSize);
    const ciphertextAndNonce = ciphertextAndNonceAndSalt.slice(
      this.pbkdf2SaltSize
    );
    const key = crypto.pbkdf2Sync(
      Buffer.from(password, "utf8"),
      salt,
      this.pbkdf2Iterations,
      this.algorithmKeySize,
      this.pbkdf2Name
    );

    return this.decrypt(ciphertextAndNonce, key).toString("utf8");
  }

  encrypt(plaintext, key) {
    const nonce = crypto.randomBytes(this.algorithmNonceSize);
    const cipher = crypto.createCipheriv(this.algorithmName, key, nonce);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final()
    ]);

    return Buffer.concat([nonce, ciphertext, cipher.getAuthTag()]);
  }

  decrypt(ciphertextAndNonce, key) {
    const nonce = ciphertextAndNonce.slice(0, this.algorithmNonceSize);
    const ciphertext = ciphertextAndNonce.slice(
      this.algorithmNonceSize,
      ciphertextAndNonce.length - this.algorithmTagSize
    );
    const tag = ciphertextAndNonce.slice(
      ciphertext.length + this.algorithmNonceSize
    );
    const decipher = crypto.createDecipheriv(this.algorithmName, key, nonce);

    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }
}

const scee = new SCEE();

const electronAPI = {
  clipboard: {
    writeText: text => clipboard.writeText(text),
    writeImageFromDataUrl: dataUrl => {
      const image = nativeImage.createFromDataURL(dataUrl);
      clipboard.writeImage(image);
    }
  },
  ipc: {
    allowedSendChannels: new Set(["confirmClose"]),
    allowedReceiveChannels: new Set([
      "initialize",
      "confirmClose",
      "showQuitScreen",
      "appSuspend",
      "appResumed"
    ]),
    on: (channel, listener) => {
      if (!electronAPI.ipc.allowedReceiveChannels.has(channel)) {
        return () => {};
      }

      const wrappedListener = (_, data) => listener(data);
      ipcRenderer.on(channel, wrappedListener);
      return () => ipcRenderer.removeListener(channel, wrappedListener);
    },
    send: (channel, ...args) => {
      if (electronAPI.ipc.allowedSendChannels.has(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    }
  },
  secureCrypto: {
    encryptString: (plaintext, password) =>
      scee.encryptString(plaintext, password),
    decryptString: (ciphertext, password) =>
      scee.decryptString(ciphertext, password)
  },
  shell: {
    openExternal: url => shell.openExternal(url)
  },
  dialog: {
    selectWalletFile: () => ipcRenderer.invoke("dialog:selectWalletFile"),
    selectFile: options => ipcRenderer.invoke("dialog:selectFile", options),
    selectDirectory: options =>
      ipcRenderer.invoke("dialog:selectDirectory", options)
  }
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electronAPI", electronAPI);
} else if (typeof window !== "undefined") {
  window.electronAPI = electronAPI;
}
