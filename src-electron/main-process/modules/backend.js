import { Daemon } from "./daemon";
import { WalletRPC } from "./wallet-rpc";
const { Swap } = require("./swap");
import { SCEE } from "./SCEE-Node";
import { dialog } from "electron";
import semver from "semver";
import axios from "axios";
import { version } from "../../../package.json";
const bunyan = require("bunyan");

const WebSocket = require("ws");
const electron = require("electron");
const os = require("os");
const fs = require("fs-extra");
const path = require("upath");
import objectAssignDeep from "object-assign-deep";

const { ipcMain: ipc, safeStorage } = electron;

const LOG_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace"];
const CONFIG_ENVELOPE_VERSION = 1;
const CONFIG_ENCRYPTION_SCHEME = "electron-safe-storage";
const REMOTE_NODE_RETRY_ATTEMPTS = 3;
const REMOTE_NODE_RETRY_DELAY_MS = 2000;
const REDACTED_LOG_VALUE = "[REDACTED]";
const REDACT_LOG_KEY_PATTERN = /(password|seed|mnemonic|secret|spend[_-]?key|view[_-]?key|private[_-]?key|auth|token)/i;
const REDACT_LOG_STRING_PATTERNS = [
  /(["']?(?:password|seed|mnemonic|secret|spend[_-]?key|view[_-]?key|private[_-]?key|auth|token)["']?\s*:\s*["'])([^"']*)(["'])/gi,
  /((?:password|seed|mnemonic|secret|spend[_-]?key|view[_-]?key|private[_-]?key|auth|token)\s*[=:]\s*)(\S+)/gi
];

function redactLogString(value) {
  return REDACT_LOG_STRING_PATTERNS.reduce(
    (result, pattern) =>
      result.replace(pattern, (match, prefix, secret, suffix = "") => {
        return `${prefix}${REDACTED_LOG_VALUE}${suffix}`;
      }),
    value
  );
}

function redactLogValue(value, parentKey = "", seen = new WeakSet()) {
  if (REDACT_LOG_KEY_PATTERN.test(parentKey)) {
    return REDACTED_LOG_VALUE;
  }

  if (typeof value === "string") {
    return redactLogString(value);
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactLogString(value.message || ""),
      stack: redactLogString(value.stack || "")
    };
  }

  if (Array.isArray(value)) {
    return value.map(item => redactLogValue(item, "", seen));
  }

  if (value && typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);
    return Object.keys(value).reduce((result, key) => {
      result[key] = redactLogValue(value[key], key, seen);
      return result;
    }, {});
  }

  return value;
}

function redactLogArgs(args) {
  return args.map(arg => redactLogValue(arg));
}

export class Backend {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.daemon = null;
    this.walletd = null;
    this.swap = null;
    this.wss = null;
    this.token = null;
    this.config_dir = null;
    this.wallet_dir = null;
    this.config_file = null;
    this.config_data = {};
    this.scee = new SCEE();
    this.log = null;
  }

  isConfigEncryptionAvailable() {
    return (
      safeStorage &&
      typeof safeStorage.isEncryptionAvailable === "function" &&
      safeStorage.isEncryptionAvailable()
    );
  }

  serializeConfig(configData) {
    const plaintext = JSON.stringify(configData, null, 4);
    if (!this.isConfigEncryptionAvailable()) {
      return plaintext;
    }

    const encrypted = safeStorage.encryptString(plaintext);
    return JSON.stringify(
      {
        version: CONFIG_ENVELOPE_VERSION,
        encryption: CONFIG_ENCRYPTION_SCHEME,
        payload: encrypted.toString("base64")
      },
      null,
      2
    );
  }

  deserializeConfig(rawConfig) {
    const parsed = JSON.parse(rawConfig);
    if (
      parsed &&
      parsed.version === CONFIG_ENVELOPE_VERSION &&
      parsed.encryption === CONFIG_ENCRYPTION_SCHEME &&
      typeof parsed.payload === "string"
    ) {
      if (!this.isConfigEncryptionAvailable()) {
        throw new Error("Encrypted config cannot be decrypted on this system");
      }

      const decrypted = safeStorage.decryptString(
        Buffer.from(parsed.payload, "base64")
      );
      return JSON.parse(decrypted);
    }

    return parsed;
  }

  writeConfig(callback = () => {}) {
    let serialized;
    try {
      serialized = this.serializeConfig(this.config_data);
    } catch (error) {
      callback(error);
      return;
    }

    fs.writeFile(this.config_file, serialized, "utf8", callback);
  }
  wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  async checkRemoteWithRetry(daemonConfig) {
    let lastResult = {};

    for (let attempt = 1; attempt <= REMOTE_NODE_RETRY_ATTEMPTS; attempt += 1) {
      lastResult = await this.daemon.checkRemote(daemonConfig);
      if (!lastResult.error) {
        return lastResult;
      }

      if (
        daemonConfig?.type === "local" ||
        attempt === REMOTE_NODE_RETRY_ATTEMPTS
      ) {
        return lastResult;
      }

      await this.wait(REMOTE_NODE_RETRY_DELAY_MS);
    }

    return lastResult;
  }

  init(config) {
    let configDir;
    let legacyBeldexConfigDir;
    if (os.platform() === "win32") {
      configDir = "C:\\ProgramData\\beldex";
      legacyBeldexConfigDir = "C:\\ProgramData\\beldex\\";
      this.wallet_dir = `${os.homedir()}\\Documents\\Beldex`;
    } else {
      configDir = path.join(os.homedir(), ".beldex");
      legacyBeldexConfigDir = path.join(os.homedir(), ".beldex/");
      this.wallet_dir = path.join(os.homedir(), "Beldex");
    }

    // if the user has used beldex before, just keep the same stuff
    if (fs.existsSync(legacyBeldexConfigDir)) {
      this.config_dir = legacyBeldexConfigDir;
    } else {
      // create the new, Beldex location
      this.config_dir = configDir;
      if (!fs.existsSync(configDir)) {
        fs.mkdirpSync(configDir);
      }
    }

    if (!fs.existsSync(path.join(this.config_dir, "gui"))) {
      fs.mkdirpSync(path.join(this.config_dir, "gui"));
    }

    this.config_file = path.join(this.config_dir, "gui", "config.json");

    const daemon = {
      type: "remote",
      p2p_bind_ip: "0.0.0.0",
      p2p_bind_port: 19090,
      rpc_bind_ip: "127.0.0.1",
      rpc_bind_port: 19091,
      zmq_rpc_bind_ip: "127.0.0.1",
      out_peers: -1,
      in_peers: -1,
      limit_rate_up: -1,
      limit_rate_down: -1,
      log_level: 0
    };

    const daemons = {
      mainnet: {
        ...daemon,
        remote_host: "mainnet.beldex.io",
        remote_port: 29095
      },
      stagenet: {
        ...daemon,
        type: "local",
        p2p_bind_port: 29090,
        rpc_bind_port: 29091
      },
      testnet: {
        ...daemon,
        type: "local",
        p2p_bind_port: 39090,
        rpc_bind_port: 39091
      }
    };

    // Default values
    this.defaults = {
      daemons: objectAssignDeep({}, daemons),
      app: {
        data_dir: this.config_dir,
        wallet_data_dir: this.wallet_dir,
        ws_bind_port: 12313,
        net_type: "mainnet"
      },
      wallet: {
        rpc_bind_port: 29095,
        log_level: 0
      }
    };

    this.config_data = {
      // Copy all the properties of defaults
      ...objectAssignDeep({}, this.defaults),
      appearance: {
        theme: "dark"
      }
    };

    this.remotes = [
      {
        host: "mainnet.beldex.io",
        port: "29095"
      },
      {
        host: "publicnode1.rpcnode.stream",
        port: "29095"
      },
      {
        host: "publicnode2.rpcnode.stream",
        port: "29095"
      },
      {
        host: "publicnode3.rpcnode.stream",
        port: "29095"
      },
      {
        host: "publicnode4.rpcnode.stream",
        port: "29095"
      },
      {
        host: "publicnode5.rpcnode.stream",
        port: "29095"
      }
    ];

    this.token = config.token;

    this.wss = new WebSocket.Server({
      port: config.port,
      maxPayload: Number.POSITIVE_INFINITY
    });

    this.wss.on("connection", ws => {
      ws.on("message", data => this.receive(data));
    });
  }

  send(event, data = {}) {
    let message = {
      event,
      data
    };
    let encrypted_data = this.scee.encryptString(
      JSON.stringify(message),
      this.token
    );
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(encrypted_data);
      }
    });
  }

  receive(data) {
    let decrypted_data = JSON.parse(this.scee.decryptString(data, this.token));
    // route incoming request to either the daemon, wallet, or here
    switch (decrypted_data.module) {
      case "core":
        this.handle(decrypted_data);
        break;
      case "daemon":
        if (this.daemon) {
          this.daemon.handle(decrypted_data);
        }
        break;
      case "wallet":
        if (this.walletd) {
          this.walletd.handle(decrypted_data);
        }
        break;
      case "swap":
        if (this.swap) {
          this.swap.handle(decrypted_data);
        }
        break;
    }
  }

  handle(data) {
    let params = data.data;

    // check if config has changed
    let config_changed = false;

    switch (data.method) {
      case "set_language":
        this.send("set_language", { lang: params.lang });
        break;
      case "quick_save_config":
        // save only partial config settings
        Object.keys(params).map(key => {
          this.config_data[key] = Object.assign(
            this.config_data[key],
            params[key]
          );
        });
        this.writeConfig(() => {
          this.send("set_app_data", {
            config: params,
            pending_config: params
          });
        });
        break;
      case "save_config_init":
      case "save_config": {
        if (data.method === "save_config") {
          Object.keys(this.config_data).map(i => {
            if (i == "appearance") return;
            Object.keys(this.config_data[i]).map(j => {
              if (this.config_data[i][j] !== params[i][j]) {
                config_changed = true;
              }
            });
          });
        }

        Object.keys(params).map(key => {
          this.config_data[key] = Object.assign(
            this.config_data[key],
            params[key]
          );
        });

        const validated = Object.keys(this.defaults)
          .filter(k => k in this.config_data)
          .map(k => [
            k,
            this.validate_values(this.config_data[k], this.defaults[k])
          ])
          .reduce((map, obj) => {
            map[obj[0]] = obj[1];
            return map;
          }, {});

        // Validate daemon data
        this.config_data = {
          ...this.config_data,
          ...validated
        };

        this.writeConfig(() => {
          if (data.method == "save_config_init") {
            this.startup();
          } else {
            this.send("set_app_data", {
              config: this.config_data,
              pending_config: this.config_data
            });
            if (config_changed) {
              this.send("settings_changed_reboot");
            }
          }
        });
        break;
      }
      case "init":
        this.startup();
        break;

      case "open_explorer": {
        const { net_type } = this.config_data.app;

        let path = null;
        if (params.type === "tx") {
          path = "tx";
        } else if (params.type === "master_node") {
          path = "master_node";
        }

        if (path) {
          const baseUrl =
            net_type === "testnet"
              ? "https://testnet.beldex.dev"
              : "https://explorer.beldex.io";
          const url = `${baseUrl}/${path}/`;
          require("electron").shell.openExternal(url + params.id);
        }
        break;
      }

      case "open_url":
        if (this.isSafeExternalUrl(params.url)) {
          require("electron").shell.openExternal(params.url);
        }
        break;

      case "save_csv": {
        if (!params || typeof params.csv !== "string" || !params.csv.trim()) {
          console.error("save_csv error: missing or invalid CSV data");
          this.send("show_notification", {
            type: "negative",
            i18n: [
              "notification.errors.errorSavingItem",
              { item: "CSV Report" }
            ],
            timeout: 2000
          });
          break;
        }
        const defaultFilename = path.basename(
          params.defaultFilename || "beldex_wallet_report.csv"
        );
        dialog
          .showSaveDialog(this.mainWindow, {
            title: "Save CSV Report",
            defaultPath: path.join(os.homedir(), defaultFilename),
            filters: [{ name: "CSV (Comma delimited)", extensions: ["csv"] }]
          })
          .then(result => {
            if (!result.canceled && result.filePath) {
              fs.writeFile(result.filePath, params.csv, "utf8", err => {
                if (err) {
                  this.send("show_notification", {
                    type: "negative",
                    i18n: [
                      "notification.errors.errorSavingItem",
                      { item: "CSV Report" }
                    ],
                    timeout: 2000
                  });
                } else {
                  this.send("show_notification", {
                    i18n: [
                      "notification.positive.itemSaved",
                      { item: "CSV Report", filename: result.filePath }
                    ],
                    timeout: 2000
                  });
                }
              });
            }
          })
          .catch(err => {
            console.error("save_csv error:", err);

            this.send("show_notification", {
              type: "negative",
              i18n: ["notification.errors.errorSavingItem", { item: err }],
              timeout: 2000
            });
          });
        break;
      }

      case "save_png": {
        dialog
          .showSaveDialog(this.mainWindow, {
            title: "Save " + params.type,
            filters: [{ name: "PNG", extensions: ["png"] }],
            defaultPath: os.homedir()
          })
          .then(result => {
            if (!result.canceled && result.filePath) {
              const filename = result.filePath;
              let base64Data = params.img.replace(
                /^data:image\/png;base64,/,
                ""
              );
              let binaryData = Buffer.from(base64Data, "base64").toString(
                "binary"
              );
              fs.writeFile(filename, binaryData, "binary", err => {
                if (err) {
                  this.send("show_notification", {
                    type: "negative",
                    i18n: [
                      "notification.errors.errorSavingItem",
                      { item: params.type }
                    ],
                    timeout: 2000
                  });
                } else {
                  this.send("show_notification", {
                    i18n: [
                      "notification.positive.itemSaved",
                      { item: params.type, filename }
                    ],
                    timeout: 2000
                  });
                }
              });
            }
          })
          .catch(err => {
            console.error("save_png error:", err);
          });
        break;
      }

      default:
        break;
    }
  }
  // if the version is a whole minor version out of date (hardfork out of date)
  // set update required to true
  async checkVersion() {
    try {
      const { data } = await axios.get(
        "https://api.github.com/repos/Beldex-Coin/beldex-electron-gui-wallet/releases/latest"
      );
      // remove the 'v' from front of the version
      const latestVersion = data.tag_name.substring(1);
      // can return "major", "minor", "patch"
      const vSizeDiff = semver.diff(version, latestVersion);
      const updateAvailable = semver.ltr(version, latestVersion);
      const majorOrMinor = vSizeDiff === "major" || vSizeDiff == "minor";
      const updateRequired = updateAvailable && majorOrMinor;
      this.send("set_update_required", updateRequired);
    } catch (e) {
      this.send("set_updated_required", false);
    }
  }

  initLogger(logPath) {
    let log = bunyan.createLogger({
      name: "log",
      streams: [
        {
          type: "rotating-file",
          path: path.join(logPath, "electron.log"),
          period: "1d", // daily rotation
          count: 4 // keep 4 days of logs
        }
      ]
    });

    LOG_LEVELS.forEach(level => {
      ipc.on(`log-${level}`, (first, ...rest) => {
        log[level](...redactLogArgs(rest));
      });
    });

    this.log = log;

    process.on("uncaughtException", error => {
      log.error(...redactLogArgs(["Unhandled Error", error]));
    });

    process.on("unhandledRejection", error => {
      log.error(...redactLogArgs(["Unhandled Promise Rejection", error]));
    });
  }

  startup() {
    this.send("set_app_data", {
      remotes: this.remotes,
      defaults: this.defaults
    });

    this.checkVersion();

    fs.readFile(this.config_file, "utf8", (err, data) => {
      if (err) {
        this.send("set_app_data", {
          status: {
            code: -1 // Config not found
          },
          config: this.config_data,
          pending_config: this.config_data
        });
        return;
      }

      let disk_config_data;
      try {
        disk_config_data = this.deserializeConfig(data);
      } catch (error) {
        this.log?.error("Failed to load config", error);
        this.send("set_app_data", {
          status: {
            code: -1
          },
          config: this.config_data,
          pending_config: this.config_data
        });
        return;
      }

      // semi-shallow object merge
      Object.keys(disk_config_data).map(key => {
        if (!this.config_data.hasOwnProperty(key)) {
          this.config_data[key] = {};
        }
        this.config_data[key] = Object.assign(
          this.config_data[key],
          disk_config_data[key]
        );
      });

      // here we may want to check if config data is valid, if not also send code -1
      // i.e. check ports are integers and > 1024, check that data dir path exists, etc
      const validated = Object.keys(this.defaults)
        .filter(k => k in this.config_data)
        .map(k => [
          k,
          this.validate_values(this.config_data[k], this.defaults[k])
        ])
        .reduce((map, obj) => {
          map[obj[0]] = obj[1];
          return map;
        }, {});

      // Make sure the daemon data is valid
      this.config_data = {
        ...this.config_data,
        ...validated
      };

      // save config file back to file, so updated options are stored on disk
      this.writeConfig(() => {});

      this.send("set_app_data", {
        config: this.config_data,
        pending_config: this.config_data
      });

      // Make the wallet dir
      const { wallet_data_dir, data_dir } = this.config_data.app;
      if (!fs.existsSync(wallet_data_dir)) {
        fs.mkdirpSync(wallet_data_dir);
      }

      // Check to see if data and wallet directories exist
      const dirs_to_check = [
        {
          path: data_dir,
          error: "notification.errors.dataPathNotFound"
        },
        {
          path: wallet_data_dir,
          error: "notification.errors.walletPathNotFound"
        }
      ];

      for (const dir of dirs_to_check) {
        // Check to see if dir exists
        if (!fs.existsSync(dir.path)) {
          this.send("show_notification", {
            type: "negative",
            i18n: dir.error,
            timeout: 2000
          });

          // Go back to config
          this.send("set_app_data", {
            status: {
              code: -1 // Return to config screen
            }
          });
          return;
        }
      }

      const { net_type } = this.config_data.app;

      const dirs = {
        mainnet: this.config_data.app.data_dir,
        stagenet: path.join(this.config_data.app.data_dir, "stagenet"),
        testnet: path.join(this.config_data.app.data_dir, "testnet")
      };

      // Make sure we have the directories we need
      const net_dir = dirs[net_type];
      if (!fs.existsSync(net_dir)) {
        fs.mkdirpSync(net_dir);
      }

      const log_dir = path.join(net_dir, "logs");
      if (!fs.existsSync(log_dir)) {
        fs.mkdirpSync(log_dir);
      }

      this.initLogger(log_dir);

      this.daemon = new Daemon(this);
      this.walletd = new WalletRPC(this);
      this.swap = new Swap(this);

      this.send("set_app_data", {
        status: {
          code: 3 // Starting daemon
        }
      });

      // Make sure the remote node provided is accessible
      const config_daemon = this.config_data.daemons[net_type];
      this.checkRemoteWithRetry(config_daemon).then(data => {
        if (data.error) {
          // If we can default to local then we do so, otherwise we tell the user  to re-set the node
          if (config_daemon.type === "local_remote") {
            this.config_data.daemons[net_type].type = "local";
            this.send("set_app_data", {
              config: this.config_data,
              pending_config: this.config_data
            });
            this.send("show_notification", {
              type: "warning",
              textColor: "black",
              i18n: "notification.warnings.usingLocalNode",
              timeout: 2000
            });
          } else {
            this.send("show_notification", {
              type: "negative",
              i18n: "notification.errors.cannotAccessRemoteNode",
              timeout: 2000
            });

            // Go back to config
            this.send("set_app_data", {
              status: {
                code: -1 // Return to config screen
              }
            });
            return;
          }
        }

        // If we got a net type back then check if ours match
        if (data.net_type && data.net_type !== net_type) {
          this.send("show_notification", {
            type: "negative",
            i18n: "notification.errors.differentNetType",
            timeout: 2000
          });

          // Go back to config
          this.send("set_app_data", {
            status: {
              code: -1 // Return to config screen
            }
          });
          return;
        }

        this.daemon
          .checkVersion()
          .then(version => {
            if (version) {
              this.send("set_app_data", {
                status: {
                  code: 4,
                  message: version
                }
              });
            } else {
              // daemon not found, probably removed by AV, set to remote node
              this.config_data.daemons[net_type].type = "remote";
              this.send("set_app_data", {
                status: {
                  code: 5
                },
                config: this.config_data,
                pending_config: this.config_data
              });
            }

            this.daemon
              .start(this.config_data)
              .then(() => {
                this.send("set_app_data", {
                  status: {
                    code: 6 // Starting wallet
                  }
                });

                this.walletd
                  .start(this.config_data)
                  .then(() => {
                    this.send("set_app_data", {
                      status: {
                        code: 7 // Reading wallet list
                      }
                    });

                    this.walletd.listWallets(true);

                    this.send("set_app_data", {
                      status: {
                        code: 0 // Ready
                      }
                    });
                    // eslint-disable-next-line
                  })
                  .catch(error => {
                    this.daemon.killProcess();
                    this.send("show_notification", {
                      type: "negative",
                      message: error.message,
                      timeout: 3000
                    });
                    this.send("set_app_data", {
                      status: {
                        code: -1 // Return to config screen
                      }
                    });
                  });
                // eslint-disable-next-line
              })
              .catch(error => {
                if (
                  this.config_data.daemons[net_type].type === "local_remote"
                ) {
                  this.daemon.killProcess();
                  this.config_data.daemons[net_type].type = "remote";
                  this.send("set_app_data", {
                    config: this.config_data,
                    pending_config: this.config_data
                  });
                  this.send("show_notification", {
                    type: "warning",
                    textColor: "black",
                    i18n: "notification.warnings.usingRemoteNode",
                    timeout: 3000
                  });

                  this.daemon
                    .start(this.config_data)
                    .then(() => {
                      this.send("set_app_data", {
                        status: {
                          code: 6 // Starting wallet
                        }
                      });

                      return this.walletd.start(this.config_data);
                    })
                    .then(() => {
                      this.send("set_app_data", {
                        status: {
                          code: 7 // Reading wallet list
                        }
                      });

                      this.walletd.listWallets(true);

                      this.send("set_app_data", {
                        status: {
                          code: 0 // Ready
                        }
                      });
                    })
                    .catch(fallbackError => {
                      this.send("show_notification", {
                        type: "negative",
                        message: fallbackError.message,
                        timeout: 3000
                      });
                      this.send("set_app_data", {
                        status: {
                          code: -1 // Return to config screen
                        }
                      });
                    });
                  return;
                }
                if (this.config_data.daemons[net_type].type == "remote") {
                  this.send("show_notification", {
                    type: "negative",
                    i18n: "notification.errors.remoteCannotBeReached",
                    timeout: 3000
                  });
                } else {
                  this.send("show_notification", {
                    type: "negative",
                    message: error.message,
                    timeout: 3000
                  });
                }
                this.send("set_app_data", {
                  status: {
                    code: -1 // Return to config screen
                  }
                });
              });
            // eslint-disable-next-line
          })
          .catch(() => {
            this.send("set_app_data", {
              status: {
                code: -1 // Return to config screen
              }
            });
          });
      });
    });
  }

  quit() {
    return new Promise(resolve => {
      let process = [];
      if (this.daemon) {
        process.push(this.daemon.quit());
      }
      if (this.walletd) {
        process.push(this.walletd.quit());
      }
      if (this.wss) {
        this.wss.close();
      }
      if (
        this.swap &&
        this.swap.swapTxnHistory &&
        this.swap.swapTxnHistory.dbManager
      ) {
        this.swap.swapTxnHistory.dbManager.close();
      }

      Promise.all(process).then(() => {
        resolve();
      });
    });
  }

  // Replace any invalid value with default values
  validate_values(values, defaults) {
    const isDictionary = v =>
      typeof v === "object" &&
      v !== null &&
      !(v instanceof Array) &&
      !(v instanceof Date);
    const modified = { ...values };

    // Make sure we have valid defaults
    if (!isDictionary(defaults)) return modified;

    for (const key in modified) {
      // Only modify if we have a default
      if (!(key in defaults)) continue;

      const defaultValue = defaults[key];
      const invalidDefault =
        defaultValue === null ||
        defaultValue === undefined ||
        Number.isNaN(defaultValue);
      if (invalidDefault) continue;

      const value = modified[key];

      // If we have a object then recurse through it
      if (isDictionary(value)) {
        modified[key] = this.validate_values(value, defaultValue);
      } else {
        // Check if we need to replace the value
        const isValidValue = !(
          value === undefined ||
          value === null ||
          value === "" ||
          Number.isNaN(value)
        );
        if (isValidValue) continue;

        // Otherwise set the default value
        modified[key] = defaultValue;
      }
    }
    return modified;
  }

  isSafeExternalUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
    } catch (error) {
      return false;
    }
  }
}
