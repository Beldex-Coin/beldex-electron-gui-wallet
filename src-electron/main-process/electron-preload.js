const path = require("path");
const crypto = require("crypto");
const {
  clipboard,
  contextBridge,
  ipcRenderer,
  nativeImage,
  shell
} = require("electron");

require(path.resolve(__dirname, "logging.js"));

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
  }
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electronAPI", electronAPI);
} else {
  window.electronAPI = electronAPI;
}
