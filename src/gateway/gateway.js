import { Notify, Dialog, Loading, LocalStorage } from "quasar";
import { EventEmitter } from "events";
import { i18n, changeLanguage } from "src/boot/i18n";
import { appIpc } from "src/shims/electron-renderer";

const WS_RETRY_DELAY_MS = 1000;
const WS_CONNECT_WARN_AFTER_ATTEMPTS = 5;
export class Gateway extends EventEmitter {
  constructor(app, router) {
    super();
    this.app = app;
    this.router = router;
    this.token = null;
    this.secureCrypto = window.electronAPI.secureCrypto;
    this.ws = null;
    this.wsRetryTimer = null;
    this.wsRetryAttempts = 0;
    this.wsConfig = null;
    this.isSuspended = false;
    this.hasShownBackendRetryNotice = false;

    // Set the initial language
    let language = LocalStorage.has("language")
      ? LocalStorage.getItem("language")
      : "en-us";
    this.setLanguage(language);

    let theme = LocalStorage.has("theme")
      ? LocalStorage.getItem("theme")
      : "dark";
    this.app.store.commit("gateway/set_app_data", {
      config: {
        appearance: {
          theme
        }
      }
    });
    this.app.store.watch(
      state => state.gateway.app.config.appearance.theme,
      theme => {
        LocalStorage.set("theme", theme);
      }
    );

    this.closeDialog = false;

    this.app.store.commit("gateway/set_app_data", {
      status: {
        code: 1 // Connecting to backend
      }
    });

    const getIpcPayload = (eventOrData, maybeData) =>
      typeof maybeData === "undefined" ? eventOrData : maybeData;

    appIpc.on("initialize", (eventOrData, maybeData) => {
      const data = getIpcPayload(eventOrData, maybeData);
      this.token = data.token;
      this.isSuspended = false;
      this.connectToBackend(data);
    });

    appIpc.on("confirmClose", () => {
      this.confirmClose(i18n.t("dialog.exit.message"));
    });

    appIpc.on("showQuitScreen", () => {
      if (this.router) {
        this.router.replace({ path: "/quit" });
      }
    });

    appIpc.on("appSuspend", () => {
      this.isSuspended = true;
      this.clearWebSocketRetry();
      this.closeWebSocket();
    });

    appIpc.on("appResumed", (eventOrData, maybeData) => {
      const data = getIpcPayload(eventOrData, maybeData);
      this.token = data.token;
      this.isSuspended = false;
      this.connectToBackend(data, true);
    });
  }
  clearWebSocketRetry() {
    if (this.wsRetryTimer) {
      clearTimeout(this.wsRetryTimer);
      this.wsRetryTimer = null;
    }
  }

  closeWebSocket() {
    if (!this.ws) {
      return;
    }

    this.ws.onopen = null;
    this.ws.onmessage = null;
    this.ws.onerror = null;
    this.ws.onclose = null;

    if (
      this.ws.readyState === WebSocket.OPEN ||
      this.ws.readyState === WebSocket.CONNECTING
    ) {
      this.ws.close();
    }

    this.ws = null;
  }

  scheduleBackendReconnect(isResume = false) {
    if (this.isSuspended || !this.wsConfig || this.wsRetryTimer) {
      return;
    }

    this.wsRetryTimer = setTimeout(() => {
      this.wsRetryTimer = null;
      this.connectToBackend(this.wsConfig, isResume);
    }, WS_RETRY_DELAY_MS);
  }

  connectToBackend(config, isResume = false) {
    if (!config || !config.port) {
      return;
    }

    this.wsConfig = config;
    this.clearWebSocketRetry();
    this.closeWebSocket();

    const ws = new WebSocket(`ws://127.0.0.1:${config.port}`);
    this.ws = ws;

    ws.onopen = () => {
      this.wsRetryAttempts = 0;
      this.hasShownBackendRetryNotice = false;

      if (isResume) {
        console.log("WS reconnected");
        return;
      }

      this.open();
    };

    ws.onmessage = event => {
      this.receive(event.data);
    };

    ws.onerror = () => {
      if (this.ws === ws) {
        ws.close();
      }
    };

    ws.onclose = () => {
      if (this.ws === ws) {
        this.ws = null;
      }

      if (this.isSuspended) {
        return;
      }

      this.wsRetryAttempts += 1;
      if (
        !this.hasShownBackendRetryNotice &&
        this.wsRetryAttempts >= WS_CONNECT_WARN_AFTER_ATTEMPTS
      ) {
        this.hasShownBackendRetryNotice = true;
        Notify.create({
          type: "warning",
          timeout: 2000,
          message: "Retrying backend connection..."
        });
      }

      this.scheduleBackendReconnect(isResume);
    };
  }
  open() {
    this.app.store.commit("gateway/set_app_data", {
      status: {
        code: 2 // Loading config
      }
    });
    this.send("core", "init");
  }

  confirmClose(msg, restart = false) {
    if (this.closeDialog) {
      return;
    }
    this.closeDialog = true;
    Loading.hide();
    const key = restart ? "restart" : "exit";

    // if (restart) {
    //   Dialog.create({
    //     title: i18n.t(`dialog.${key}.title`),
    //     message: msg,
    //     ok: {
    //       label: i18n.t(`dialog.${key}.ok`),
    //       color: key !== "exit" ? "primary" : "red"
    //     },
    //     persistent: true
    //   })
    //     .onOk(() => {
    //       this.closeDialog = false;
    //       Loading.hide();
    //       this.router.replace({ path: "/quit" });
    //       appIpc.send("confirmClose", restart);
    //     })
    //     .onCancel(() => {
    //       // this.closeDialog = false;
    //     });
    //   return 0;
    // }

    setTimeout(() => {
      Dialog.create({
        title: i18n.t(`dialog.${key}.title`),
        message: msg,
        class: "exit-confirm-dialog",
        ok: {
          label: i18n.t(`dialog.${key}.ok`),
          color: key !== "exit" ? "primary" : "red"
        },
        cancel: {
          label: i18n.t("dialog.buttons.cancel"),
          color: "accent"
        }
      })
        .onOk(() => {
          this.closeDialog = false;
          Loading.hide();
          this.router.replace({ path: "/quit" });
          appIpc.send("confirmClose", restart);
        })
        .onCancel(() => {
          this.closeDialog = false;
        });
    }, 0);
  }

  send(module, method, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.token) {
      return;
    }
    let message = {
      module,
      method,
      data
    };
    let encrypted_data = this.secureCrypto.encryptString(
      JSON.stringify(message),
      this.token
    );
    this.ws.send(encrypted_data);
  }

  geti18n(key) {
    return Array.isArray(key) ? i18n.t(...key) : i18n.t(key);
  }

  receive(message) {
    // should wrap this in a try catch, and if fail redirect to error screen
    // shouldn't happen outside of dev environment
    let decrypted_data = JSON.parse(
      this.secureCrypto.decryptString(message, this.token)
    );

    if (
      typeof decrypted_data !== "object" ||
      !decrypted_data.hasOwnProperty("event") ||
      !decrypted_data.hasOwnProperty("data")
    ) {
      return;
    }

    switch (decrypted_data.event) {
      case "set_language": {
        const { lang } = decrypted_data.data;
        this.setLanguage(lang);
        break;
      }
      case "set_has_password":
        this.emit("has_password", decrypted_data.data);
        break;
      case "set_valid_address":
        this.emit("validate_address", decrypted_data.data);
        break;
      case "set_decrypt_record_result":
        this.emit("decrypt_record_result", decrypted_data.data);
        break;
      case "set_app_data":
        this.app.store.commit("gateway/set_app_data", decrypted_data.data);
        break;

      case "set_daemon_data":
        this.app.store.commit("gateway/set_daemon_data", decrypted_data.data);
        break;

      case "set_wallet_data":
      case "set_wallet_error":
        this.app.store.commit("gateway/set_wallet_data", decrypted_data.data);
        break;

      case "reset_wallet_error":
        this.app.store.dispatch("gateway/resetWalletStatus");
        break;

      case "set_tx_status": {
        const data = { ...decrypted_data.data };
        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }
        this.app.store.commit("gateway/set_tx_status", data);
        break;
      }

      case "set_sweep_all_status": {
        const data = { ...decrypted_data.data };
        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }
        this.app.store.commit("gateway/set_sweep_all_status", data);
        break;
      }

      case "set_bns_status": {
        const data = { ...decrypted_data.data };
        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_bns_status", data);
        break;
      }

      case "set_mnode_status": {
        const data = { ...decrypted_data.data };

        // We have multiple nested objects in master_node_status
        for (const key in data) {
          if (data[key].i18n) {
            data[key].message = this.geti18n(data[key].i18n);
          }
        }

        this.app.store.commit("gateway/set_mnode_status", data);
        break;
      }
      case "set_prove_transaction_status": {
        const data = { ...decrypted_data.data };

        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_prove_transaction_status", data);
        break;
      }
      case "set_check_transaction_status": {
        const data = { ...decrypted_data.data };

        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_check_transaction_status", data);
        break;
      }
      case "set_sign_status": {
        this.app.store.commit("gateway/set_sign_status", decrypted_data.data);
        break;
      }
      case "set_verify_status": {
        this.app.store.commit("gateway/set_verify_status", decrypted_data.data);
        break;
      }
      case "set_old_gui_import_status":
        this.app.store.commit(
          "gateway/set_old_gui_import_status",
          decrypted_data.data
        );
        break;

      case "wallet_list":
        this.app.store.commit("gateway/set_wallet_list", decrypted_data.data);
        break;

      case "settings_changed_reboot":
        this.confirmClose(i18n.t("dialog.restart.message"), true);
        break;

      case "show_notification": {
        let notification = {
          type: "positive",
          timeout: 1000,
          message: ""
        };
        const { data } = decrypted_data;
        if (data.i18n) {
          notification.message = this.geti18n(data.i18n);
        }
        Notify.create(Object.assign(notification, data));
        break;
      }

      case "show_loading":
        Loading.show({ ...(decrypted_data.data || {}) });
        break;

      case "hide_loading":
        Loading.hide();
        break;

      case "return_to_wallet_select":
        this.router.replace({ path: "/wallet-select" });
        setTimeout(() => {
          // short delay to prevent wallet data reaching the
          // websocket moments after we close and reset data
          this.app.store.dispatch("gateway/resetWalletData");
        }, 250);
        break;

      case "set_update_required":
        this.app.store.commit(
          "gateway/set_update_required",
          decrypted_data.data
        );
        break;

      case "set_router_path_rightpane":
        this.app.store.commit(
          "gateway/set_router_path_rightpane",
          decrypted_data.data
        );
        break;

      case "set_sender_address":
        this.app.store.commit(
          "gateway/set_sender_address",
          decrypted_data.data
        );
        break;
      case "set_stepperPosition":
        this.app.store.commit(
          "gateway/set_stepperPosition",
          decrypted_data.data
        );

        break;

      case "set_currencyList":
        // console.log("gateway 1");
        this.app.store.commit("gateway/set_currencyList", decrypted_data.data);

        break;
      case "set_exchangeAmount":
        // console.log("gateway 1");
        this.app.store.commit(
          "gateway/set_exchangeAmount",
          decrypted_data.data
        );

        break;
      case "set_createdTxnDetails":
        // console.log("gateway 1");
        this.app.store.commit(
          "gateway/set_createdTxnDetails",
          decrypted_data.data
        );
        break;
      case "set_validateAddress":
        this.app.store.commit(
          "gateway/set_validateAddress",
          decrypted_data.data
        );
        break;
      case "set_pairsMinMax":
        this.app.store.commit("gateway/set_pairsMinMax", decrypted_data.data);
        break;
      case "set_txnStatus":
        this.app.store.commit("gateway/set_txnStatus", decrypted_data.data);
        break;
      case "set_txnHistory":
        this.app.store.commit("gateway/set_txnHistory", decrypted_data.data);
        break;

      case "set_txnHistoryMeta":
        this.app.store.commit(
          "gateway/set_txnHistoryMeta",
          decrypted_data.data
        );
        break;

      case "set_fixedExchangeRate":
        this.app.store.commit(
          "gateway/set_fixedExchangeRate",
          decrypted_data.data
        );
        break;

      case "set_refundAddressValidation":
        this.app.store.commit(
          "gateway/set_refundAddressValidation",
          decrypted_data.data
        );
        break;
    }
  }

  setLanguage(lang) {
    changeLanguage(lang)
      .then(() => {
        LocalStorage.set("language", lang);
      })
      .catch(() => {
        Notify.create({
          type: "negative",
          timeout: 2000,
          message: i18n.t("notification.errors.failedToSetLanguage", {
            lang
          })
        });
      });
  }
}
