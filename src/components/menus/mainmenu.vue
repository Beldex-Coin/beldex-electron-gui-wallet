<template>
  <div>
    <q-btn
      class="menu setting-btn"
      :icon="accountIcon ? undefined : 'settings'"
      size="14px"
      text-color="#A9A9CD"
      :aria-label="$t('menuItems.settings')"
      flat
    >
      <!-- In-wallet top bar: account icon -->
      <img
        v-if="accountIcon"
        src="~assets/icons/header-account.svg"
        alt=""
        class="setting-btn__account"
      />
      <!-- Same flat style as the wallet menu dropdown everywhere
           (wallet-select, settings shell, in-wallet). -->
      <q-menu
        class="settings-sub-menu-wrapper"
        content-class="beldex-menu beldex-menu--wallet"
      >
        <q-list separator class="menu-list settings-sub-menu">
          <q-item
            v-if="!disableSwitchWallet"
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            @click.native="switchWallet"
          >
            <q-item-label header class="flex items-center  flex-nowrap no-wrap">
              <img
                src="~assets/icons/menu-switch-wallet.svg"
                alt=""
                class="icon"
              />
              {{ $t("menuItems.switchWallet") }}</q-item-label
            >
          </q-item>
          <q-item
            v-if="!disableSettings"
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            @click.native="openSettings"
          >
            <q-item-label header class="flex items-center">
              <img src="~assets/icons/menu-settings.svg" class="icon" alt="" />
              {{ $t("menuItems.settings") }}</q-item-label
            >
          </q-item>

          <q-item
            v-close-popup
            class="q-mx-md q-my-sm"
            clickable
            @click.native="showAbout"
          >
            <q-item-label header class="flex items-center">
              <img src="~assets/icons/menu-about.svg" class="icon" alt="" />
              {{ $t("menuItems.about") }}</q-item-label
            >
          </q-item>
          <q-item
            v-close-popup
            class="q-mx-md q-my-sm"
            clickable
            @click.native="exit"
          >
            <q-item-label header class="flex items-center flex-nowrap no-wrap">
              <img src="~assets/icons/rail-exit.svg" class="icon" alt="" />
              {{ $t("menuItems.exit") }}
            </q-item-label>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <SettingsModal ref="settingsModal" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import SettingsModal from "components/settings";
export default {
  name: "MainMenu",
  components: {
    SettingsModal
  },
  props: {
    disableSwitchWallet: {
      type: Boolean,
      required: false,
      default: false
    },
    disableSettings: {
      type: Boolean,
      required: false,
      default: false
    },
    accountIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    isRPCSyncing: state => state.gateway.wallet.isRPCSyncing,
    daemon: state => state.gateway.daemon
  }),
  methods: {
    showAbout() {
      // About is a Settings tab; inside Settings just switch to it.
      if (this.disableSettings) {
        this.$emit("about");
        return;
      }
      this.$refs.settingsModal.page = "about";
      this.$refs.settingsModal.isVisible = true;
    },
    openSettings() {
      this.$refs.settingsModal.isVisible = true;
    },
    switchWallet() {
      // If the rpc is syncing then we want to tell the user to restart
      if (this.isRPCSyncing) {
        this.$gateway.confirmClose(
          this.$t("dialog.switchWallet.restartMessage"),
          true
        );
        return;
      }

      // TODO: Remove this in hardfork 16
      // This is a temporary work around for the issue where wallet rpc hangs after closing a wallet due to long polling still being active
      this.$gateway.confirmClose(
        this.$t("dialog.switchWallet.restartWalletMessage"),
        true
      );

      // Allow switching normally because rpc won't be blocked
      // NB: If this is added back, must use the quasar v1 APIs
      /*
      this.$q
        .dialog({
          title: this.$t("dialog.switchWallet.title"),
          message: this.$t("dialog.switchWallet.closeMessage"),
          ok: {
            label: this.$t("dialog.buttons.ok")
          },
          cancel: {
            flat: true,
            label: this.$t("dialog.buttons.cancel"),
            color: this.theme == "dark" ? "white" : "dark"
          }
        })
        .then(() => {
          this.$router.replace({ path: "/wallet-select" });
          this.$gateway.send("wallet", "close_wallet");
          setTimeout(() => {
            // short delay to prevent wallet data reaching the
            // websocket moments after we close and reset data
            this.$store.dispatch("gateway/resetWalletData");
          }, 250);
        })
        .catch(() => {});
       */
    },
    exit() {
      this.$gateway.confirmClose(this.$t("dialog.exit.question"));
    }
  }
};
</script>

<style lang="scss">
body.desktop .q-hoverable:hover > .q-focus-helper {
  background: unset;
}
.setting-btn {
  .q-icon {
    color: #a9a9cd !important;
  }
}
.q-menu {
  max-width: unset !important;
}
.settings-sub-menu-wrapper {
  border: unset !important;
  color: white;
}

.settings-sub-menu {
  width: 241px;
  border-radius: 10px;
  .q-hoverable:hover > .q-focus-helper {
    background-color: #40405e !important;
    border-radius: 10px;
  }
  // Only drop Quasar's divider; keep the left hover bar.
  .q-item-type + .q-item-type {
    border-top: unset !important;
  }
  .q-item {
    padding: 0;
  }
  .icon {
    color: #a9a9cd !important;
    margin-right: 10px;
    width: 16px;
    height: 16px;
  }
}
// Wallet-select only: gear in the top bar and its dropdown.
.beldex-app .setting-btn {
  min-height: 0;
  padding: 4px;

  .q-btn__wrapper {
    min-height: 0;
    padding: 0;
  }

  .q-icon {
    font-size: 16px;
    color: var(--beldex-text-subtle) !important; // beats .setting-btn .q-icon
  }

  &:hover .q-icon {
    color: var(--beldex-text) !important;
  }
}

.beldex-app .beldex-menu {
  .settings-sub-menu {
    width: 240px;
    border-radius: 0;
    padding: var(--beldex-space-2) 0;
  }

  .q-item {
    margin: 0 !important; // beats .q-mx-md / .q-my-sm on the items
    min-height: 48px;
    border-radius: 0;
  }

  .q-hoverable:hover > .q-focus-helper {
    background-color: transparent !important;
  }

  .q-item__label--header {
    padding: 0;
    gap: 17px;
    font-family: var(--beldex-font-sans);
    font-size: 16px;
    color: var(--beldex-text);
  }

  .icon {
    width: 18px;
    height: 18px;
    margin-right: 0;
  }
}

// Gear menu: same flat look as the wallet (hamburger) menu.
.beldex-app .beldex-menu.beldex-menu--wallet {
  .settings-sub-menu {
    width: 100%;
    padding: 6px 0;
  }

  .q-item {
    min-height: 36px;
    padding: 0 20px;
  }

  .q-item__label--header {
    gap: 10px;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    letter-spacing: 0.3px;
    // beats app.styl `.menu-list .q-item * { color white !important }`
    color: var(--beldex-text-muted) !important;
  }

  .q-item:hover .q-item__label--header {
    font-weight: 500;
    color: var(--beldex-text-strong) !important;
  }

  .icon {
    width: 14px;
    height: 14px;
  }
}

.about-modal {
  font-family: Poppins-Medium;

  a {
    margin-right: 10px;
    text-decoration: none;
  }
  img {
    margin-right: 5px;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-family: Poppins-Bold;
    color: #00ad07;
    font-size: 20px;
  }

  padding: 25px;
  background-color: #32324a;
  color: #fff;
  border-radius: 10px !important;

  .external-links {
    a {
      color: #ffffff;
      text-decoration: none;

      &:hover,
      &:active,
      &:visited {
        text-decoration: underline;
      }
    }
  }
}
</style>
