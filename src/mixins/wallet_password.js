import { mapState } from "vuex";

export default {
  data() {
    return {
      passwordPresenceCache: {
        walletName: null,
        value: null,
        pending: null
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    walletName: state => state.gateway.wallet.info.name
  }),
  methods: {
    hasPassword(forceRefresh = false) {
      const cache = this.passwordPresenceCache;
      const currentWalletName = this.walletName || "";

      if (
        !forceRefresh &&
        cache.walletName === currentWalletName &&
        typeof cache.value === "boolean"
      ) {
        return Promise.resolve(cache.value);
      }

      if (
        !forceRefresh &&
        cache.walletName === currentWalletName &&
        cache.pending
      ) {
        return cache.pending;
      }

      cache.walletName = currentWalletName;
      cache.pending = new Promise(resolve => {
        this.$gateway.once("has_password", data => {
          const hasPassword = !!data;
          cache.walletName = currentWalletName;
          cache.value = hasPassword;
          resolve(hasPassword);
        });
        this.$gateway.send("wallet", "has_password");
      }).finally(() => {
        if (cache.walletName === currentWalletName) {
          cache.pending = null;
        }
      });

      return cache.pending;
    },

    primePasswordConfirmation() {
      return this.hasPassword().catch(() => {});
    },

    async showPasswordConfirmation(options) {
      const { noPasswordMessage, ...other } = options;
      return this.hasPassword()
        .then(hasPassword => {
          const sharedOpts = {
            cancel: {
              flat: true,
              label: this.$t("dialog.buttons.cancel"),
              color: this.theme === "dark" ? "white" : "dark"
            },
            ...other
          };
          const hasPasswordOpts = {
            ...sharedOpts,
            message: this.$t("dialog.password.message"),
            prompt: {
              model: "",
              type: "password"
            }
          };
          const noPasswordOpts = {
            ...sharedOpts,
            message: noPasswordMessage
          };
          let usedOpts = hasPassword ? hasPasswordOpts : noPasswordOpts;
          return this.$q.dialog(usedOpts);
        })
        .catch(() => null);
    }
  }
};
