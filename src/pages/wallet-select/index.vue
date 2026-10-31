<template>
  <q-page class="wallet-select">
    <!-- 01 Select wallet -->
    <section
      v-if="wallets.list.length && !backbtn"
      class="beldex-panel wallet-select__card"
    >
      <div>
        <div class="beldex-heading">
          <h1 class="beldex-heading__title">{{ $t("titles.yourWallets") }}</h1>
          <span class="beldex-chip">
            {{ $tc("strings.walletCount", wallets.list.length) }}
          </span>
        </div>
        <p class="beldex-heading__subtitle">
          {{ $t("strings.selectWalletToUnlock") }}
        </p>
      </div>

      <div class="wallet-select__list">
        <button
          v-for="wallet in wallets.list"
          :key="`${wallet.address}-${wallet.name}`"
          type="button"
          class="beldex-row"
          @click="openWallet(wallet)"
        >
          <span class="beldex-avatar" aria-hidden="true">
            {{
              wallet.name
                .split(" ")
                .map(word => word.charAt(0))
                .join("")
                .slice(0, 2)
            }}
          </span>
          <span class="wallet-select__meta">
            <span class="wallet-select__name beldex-truncate">
              {{ wallet.name }}
            </span>
            <span class="wallet-select__address beldex-truncate">
              {{ wallet.address }}
            </span>
          </span>
          <img
            src="~assets/icons/chevron-right-muted.svg"
            class="wallet-select__chevron"
            alt=""
          />
          <ContextMenu
            :menu-items="menuItems"
            @openWallet="openWallet(wallet)"
            @copyAddress="copyAddress(wallet.address)"
          />
        </button>
      </div>

      <hr class="beldex-hr" />

      <div class="wallet-select__actions">
        <p class="beldex-hint wallet-select__path">
          <img src="~assets/icons/info.svg" alt="" />
          <span class="beldex-truncate">
            {{
              $t("strings.walletsStoredIn", {
                path: ($store.state.gateway.app.config.app || {})
                  .wallet_data_dir
              })
            }}
          </span>
        </p>
        <q-btn class="beldex-btn" unelevated no-caps @click="backbtn = true">
          <img src="~assets/icons/plus.svg" alt="" />
          {{ $t("buttons.addWallet") }}
        </q-btn>
      </div>
    </section>

    <!-- Select wallet mode -->
    <section
      v-else
      class="beldex-panel wallet-select__card wallet-select__mode"
    >
      <div>
        <div class="beldex-heading">
          <button
            v-if="backbtn"
            type="button"
            class="beldex-icon-btn"
            :aria-label="$t('buttons.back')"
            @click="backbtn = false"
          >
            ←
          </button>
          <h1 class="beldex-heading__title">
            {{ $t("titles.selectWalletMode") }}
          </h1>
        </div>
        <p class="beldex-heading__subtitle">
          {{ $t("strings.walletModeSubtitle") }}
        </p>
      </div>

      <div class="wallet-select__hero">
        <img src="~assets/icons/mode-secure.svg" alt="" />
      </div>

      <div class="wallet-select__modes">
        <button
          type="button"
          class="wallet-select__mode-card wallet-select__mode-card--primary"
          @click="createNewWallet()"
        >
          <img src="~assets/icons/mode-create.svg" alt="" />
          <span class="wallet-select__mode-title">
            {{ $t("titles.wallet.createNew") }}
          </span>
          <span class="wallet-select__mode-hint">
            {{ $t("strings.createWalletHint") }}
          </span>
        </button>
        <button
          type="button"
          class="wallet-select__mode-card"
          @click="restoreWallet()"
        >
          <img src="~assets/icons/mode-restore.svg" alt="" />
          <span class="wallet-select__mode-title">
            {{ $t("titles.wallet.useExistingWallet") }}
          </span>
          <span class="wallet-select__mode-hint">
            {{ $t("strings.restoreWalletHint") }}
          </span>
        </button>
        <button
          type="button"
          class="wallet-select__mode-card wallet-select__mode-card--wide"
          @click="importWallet()"
        >
          <img src="~assets/icons/mode-import.svg" alt="" />
          <span class="wallet-select__mode-text">
            <span class="wallet-select__mode-title">
              {{ $t("titles.wallet.importFromFile") }}
            </span>
            <span class="wallet-select__mode-hint">
              {{ $t("strings.importWalletHint") }}
            </span>
          </span>
        </button>
      </div>
    </section>
  </q-page>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import ContextMenu from "components/menus/contextmenu";
import UnlockWalletDialog from "components/unlock_wallet_dialog";

export default {
  components: {
    ContextMenu
  },
  data() {
    const menuItems = [
      { action: "openWallet", i18n: "menuItems.openWallet" },
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];
    return {
      menuItems,
      backbtn: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    wallets: state => state.gateway.wallets,
    status: state => state.gateway.wallet.status,
    actions() {
      // TODO: Add this in once BELDEX has the functionality
      // <q-item @click.native="restoreViewWallet()">
      //     <q-item-label label="Restore view-only wallet" />
      // </q-item>
      const actions = [
        {
          name: this.$t("titles.wallet.createNew"),
          handler: this.createNewWallet
        },
        {
          name: this.$t("titles.wallet.restoreFromSeed"),
          handler: this.restoreWallet
        },
        {
          name: this.$t("titles.wallet.importFromFile"),
          handler: this.importWallet
        }
      ];

      if (this.wallets.directories.length > 0) {
        actions.push({
          name: this.$t("titles.wallet.importFromOldGUI"),
          handler: this.importOldGuiWallets
        });
      }

      return actions;
    }
  }),
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0: // Wallet loaded
            this.$q.loading.hide();
            this.$router.replace({ path: "/wallet" });
            break;
          case -1: // Error
          case -22:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message
            });
            this.$store.commit("gateway/set_wallet_data", {
              status: {
                code: 1 // Reset to 1 (ready for action)
              }
            });
            break;
        }
      },
      deep: true
    }
  },
  created() {
    this.$q.loading.hide();
    this.$gateway.send("wallet", "list_wallets");
  },
  methods: {
    openWallet(wallet) {
      if (wallet.password_protected !== false) {
        this.$q
          .dialog({
            component: UnlockWalletDialog,
            parent: this,
            walletName: wallet.name
          })
          .onOk(password => {
            this.$q.loading.show({
              delay: 0,
              spinnerColor: "positive"
            });
            this.$gateway.send("wallet", "open_wallet", {
              name: wallet.name,
              password: password
            });
          })
          .onCancel(() => {})
          .onDismiss(() => {});
      } else {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: "positive"
        });
        this.$gateway.send("wallet", "open_wallet", {
          name: wallet.name,
          password: ""
        });
      }
    },
    createNewWallet() {
      this.$router.replace({ path: "wallet-select/create" });
    },
    restoreWallet() {
      this.$gateway.send("daemon", "get_info");
      this.$router.replace({ path: "wallet-select/restore" });
    },
    restoreViewWallet() {
      this.$router.replace({ path: "wallet-select/import-view-only" });
    },
    importWallet() {
      this.$router.replace({ path: "wallet-select/import" });
    },
    importOldGuiWallets() {
      this.$router.replace({ path: "wallet-select/import-old-gui" });
    },
    importLegacyWallet() {
      this.$router.replace({ path: "wallet-select/import-legacy" });
    },
    copyAddress(address) {
      clipboard.writeText(address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
</script>

<style lang="scss">
// Select wallet and Select wallet mode.
.wallet-select {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--beldex-space-9);

  &__card {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-5);
    width: 100%;
    max-width: 600px;
    padding: 22px var(--beldex-space-7);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-2);
    max-height: calc(100vh - 360px);
    min-height: 66px;
    overflow-y: auto;
    padding-right: var(--beldex-space-2);
  }

  &__meta {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-family: var(--beldex-font-sans-medium);
    font-size: 16px;
    line-height: 22px;
    color: var(--beldex-text);
  }

  &__address {
    font-size: var(--beldex-text-md);
    line-height: 18px;
    color: var(--beldex-text-faint);
  }

  &__chevron {
    flex: none;
    width: 6px;
    height: 10px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-4);
  }

  &__path {
    min-width: 0;
    margin: 0;

    img {
      flex: none;
      width: 11px;
      height: 11px;
    }
  }

  &__actions .beldex-btn {
    flex: none;
    padding: 0 var(--beldex-space-5);
    font-family: var(--beldex-font-sans);
    text-transform: none;
    color: #000;

    img {
      width: 14px;
      height: 14px;
    }
  }

  // Mode screen
  &__mode {
    max-width: 624px;
    gap: 30px;
    padding: var(--beldex-space-8);
  }

  &__hero {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 136px;
    background-color: var(--beldex-bg);
    background-image: radial-gradient(
      circle,
      var(--beldex-border-strong) 1px,
      transparent 1px
    );
    background-size: 8px 8px;

    img {
      width: 50px;
      height: 50px;
    }
  }

  &__modes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 9px;
  }

  &__mode-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 9px;
    min-width: 0;
    padding: 14px var(--beldex-space-4);
    text-align: left;
    color: var(--beldex-text);
    background-color: var(--beldex-panel);
    border: 1px solid var(--beldex-border);
    cursor: pointer;
    transition: border-color var(--beldex-transition);

    &:hover {
      border-color: var(--beldex-accent-border);
    }

    &--primary {
      background-color: var(--beldex-bg);
      border-color: var(--beldex-accent-border-soft);
    }

    &--wide {
      grid-column: 1 / span 2;
      flex-direction: row;
      align-items: center;
      gap: 18px;
      padding: var(--beldex-space-5) var(--beldex-space-4);
      color: var(--beldex-text-muted);
    }

    img {
      flex: none;
      width: 18px;
      height: 18px;
    }
  }

  &__mode-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__mode-title {
    font-family: var(--beldex-font-display);
    font-size: var(--beldex-text-base);
    text-transform: uppercase;
  }

  &__mode-hint {
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);
  }
}
</style>
