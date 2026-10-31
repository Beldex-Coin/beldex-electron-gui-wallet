<template>
  <q-layout view="hHh Lpr lFf" class="wallet-shell">
    <q-page-container>
      <q-page class="wallet-shell__page">
        <!-- Background coins (Figma "image 5" / "image 12") -->
        <div class="wallet-shell__decor" aria-hidden="true">
          <img
            class="wallet-shell__decor-coin wallet-shell__decor-coin--tilted"
            src="~assets/images/bg-coin-tilted.png"
            alt=""
          />
          <img
            class="wallet-shell__decor-coin wallet-shell__decor-coin--round"
            src="~assets/images/bg-coin-round.png"
            alt=""
          />
        </div>

        <!-- Nav rail -->
        <nav class="wallet-shell__rail">
          <div class="wallet-shell__logo">
            <img src="~assets/icons/rail-logo.png" alt="" />
          </div>
          <div class="wallet-shell__rail-items">
            <router-link
              v-for="item in [
                { to: '/wallet', icon: 'wallet', label: $t('titles.myWallet') },
                {
                  to: '/wallet/swap',
                  icon: 'swap',
                  label: $t('titles.swap.swap')
                },
                {
                  to: '/wallet/bns',
                  icon: 'bns',
                  label: $t('titles.bnsServices')
                },
                {
                  to: '/wallet/masternode',
                  icon: 'masternode',
                  label: $t('strings.transactions.types.masterNode')
                },
                {
                  to: '/wallet/advanced',
                  icon: 'advanced',
                  label: $t('buttons.advanced')
                }
              ]"
              :key="item.to"
              :to="item.to"
              :exact="item.to === '/wallet'"
              class="wallet-shell__rail-item"
              active-class="wallet-shell__rail-item--active"
              :aria-label="item.label"
              @click.native="item.icon === 'masternode' && doKeyImages()"
            >
              <span
                class="wallet-shell__rail-icon"
                :class="`wallet-shell__rail-icon--${item.icon}`"
                aria-hidden="true"
              />
              <q-tooltip anchor="center right" self="center left">
                {{ item.label }}
              </q-tooltip>
            </router-link>
          </div>
          <button
            type="button"
            class="wallet-shell__rail-item"
            :aria-label="$t('menuItems.exit')"
            @click="$refs.mainMenu.exit()"
          >
            <span
              class="wallet-shell__rail-icon wallet-shell__rail-icon--exit"
              aria-hidden="true"
            />
            <q-tooltip anchor="center right" self="center left">
              {{ $t("menuItems.exit") }}
            </q-tooltip>
          </button>
        </nav>

        <main class="wallet-shell__main">
          <header class="wallet-shell__topbar">
            <div class="wallet-shell__title-group">
              <h1 class="wallet-shell__title">
                {{
                  $route.path.indexOf("/wallet/swap") === 0
                    ? $t("titles.swap.swap")
                    : $route.path.indexOf("/wallet/bns") === 0
                    ? $t("titles.bnsNames")
                    : $route.path.indexOf("/wallet/masternode") === 0
                    ? $t("titles.masternode")
                    : $route.path.indexOf("/wallet/advanced") === 0
                    ? $t("buttons.advanced")
                    : $t("titles.myWallet")
                }}
              </h1>
              <span class="wallet-shell__alias">
                <img src="~assets/icons/chip-user.svg" alt="" />
                <span class="beldex-truncate">{{ info.name }}</span>
                <span class="beldex-net-chip__dot" />
              </span>
            </div>
            <div class="wallet-shell__utilities">
              <button
                type="button"
                class="wallet-shell__round-btn"
                :aria-label="$t('buttons.rescan')"
                :disabled="!$store.getters['gateway/isReady']"
                @click="$refs.walletDetails.showModal('rescan')"
              >
                <img src="~assets/icons/header-rescan.svg" alt="" />
                <q-tooltip>{{ $t("buttons.rescan") }}</q-tooltip>
              </button>
              <div class="wallet-shell__round-btn wallet-shell__wallet-menu">
                <WalletSettings />
              </div>
              <!-- The main menu stands in for the profile button, so it takes
                   the Account icon -->
              <div class="wallet-shell__round-btn wallet-shell__main-menu">
                <MainMenu ref="mainMenu" account-icon />
              </div>
            </div>
          </header>

          <div class="wallet-shell__telemetry">
            <StatusFooter />
            <span class="wallet-shell__sep">|</span>
            <span class="wallet-shell__version">
              {{ $t("strings.version") }} {{ version }}
            </span>
          </div>

          <div class="wallet-shell__content">
            <WalletDetails ref="walletDetails" />

            <div class="wallet-shell__columns">
              <!-- Send / Receive / Contacts: overview only.
                   v-show keeps the form state as before. -->
              <section
                v-show="['/wallet', '/wallet/'].includes($route.path)"
                class="wallet-shell__panel wallet-shell__panel--left"
              >
                <RightPane />
              </section>

              <section
                class="wallet-shell__panel wallet-shell__panel--main"
                :class="{
                  'wallet-shell__panel--bare':
                    $route.path.indexOf('/wallet/masternode') === 0 ||
                    $route.path.indexOf('/wallet/advanced') === 0 ||
                    $route.path.indexOf('/wallet/bns') === 0 ||
                    $route.path.indexOf('/wallet/swap') === 0
                }"
              >
                <keep-alive>
                  <router-view />
                </keep-alive>
              </section>
            </div>
          </div>
        </main>
      </q-page>
    </q-page-container>

    <q-dialog ref="aboutModal" minimized>
      <div class="about-modal">
        <p class="q-my-sm">
          There is a new version of Beldex Electron Wallet is available. Please
          update your wallet from Beldex Official Website.
        </p>

        <div class="q-mt-md q-mb-lg external-links">
          <p>
            <a
              href="#"
              style="text-decoration: none"
              @click="
                openExternal('https://beldex.io/index.html#beldex-wallets')
              "
              >https://beldex.io/index.html#beldex-wallets</a
            >
            <q-btn
              ref="copy"
              color="primary"
              padding="xs"
              size="sm"
              icon="content_copy"
              style="margin-left: 8px"
              @click="copyAddress"
            />
          </p>
        </div>
        <q-btn color="primary" label="Close" @click="showAbout(false)" />
      </div>
    </q-dialog>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import { mapState } from "vuex";
import { clipboard } from "src/shims/electron-renderer";
import WalletDetails from "components/wallet_details";
import StatusFooter from "components/footer";
import MainMenu from "components/menus/mainmenu";
import WalletSettings from "components/menus/wallet_settings";
import RightPane from "app/src/layouts/wallet/rightPane.vue";
import { version } from "../../../package.json";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "LayoutDefault",
  components: {
    StatusFooter,
    MainMenu,
    WalletDetails,
    WalletSettings,
    RightPane
  },
  mixins: [WalletPassword],
  data() {
    return {
      version,
      step: 1,
      key_image: {
        visible: false,
        type: "Export"
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    status: state => state.gateway.wallet.status,
    update_required: state => state.gateway.update_required,
    stepperPosition: state => state.gateway.stepperPosition,
    is_able_to_send() {
      return this.$store.state.gateway.update_required;
    }
  }),
  watch: {
    // The wallet is shown before its first heartbeat completes (see
    // openWallet in wallet-rpc.js). If that heartbeat then fails, the backend
    // closes the wallet and reports -1, so go back to the wallet list.
    "status.code"(code) {
      if (code !== -1) return;
      this.$q.notify({
        type: "negative",
        timeout: 1000,
        message: this.status.message
      });
      this.$router.replace({ path: "/wallet-select" });
      this.$store.dispatch("gateway/resetWalletData");
    }
  },
  mounted() {
    this.update_required == true ? this.showAbout() : "";
  },

  methods: {
    openURL,
    openExternal(url) {
      this.$gateway.send("core", "open_url", { url });
    },
    showAbout(toggle = true) {
      if (toggle) this.$refs.aboutModal.show();
      else this.$refs.aboutModal.hide();
    },
    copyAddress() {
      clipboard.writeText("https://beldex.io/index.html#beldex-wallets");
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.linkCopied")
      });
    },
    async doKeyImages() {
      // const type = this.$t(
      //   `dialog.keyImages.${this.key_image.type.toLowerCase()}`
      // );
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.showMasterNode.title"),
        noPasswordMessage: this.$t("dialog.showMasterNode.message"),
        // this.$t("dialog.keyImages.message", {
        //   type: type.toLocaleLowerCase(this.locale)
        // })
        ok: {
          label: this.$t("dialog.showMasterNode.masterNode"),
          color: "primary"
        },
        cancel: {
          color: "accent"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark",
        noRouteDismiss: true
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$gateway.send("wallet", "deregister_images", {
            password: password
            // path: this.modals.key_image.export_path
          });
        })
        .onCancel(() => {
          this.$router.go(-1);
        })
        .onDismiss(() => {});
    }
  }
};
</script>

<style lang="scss">
// Wallet shell: overview and section layout.
.wallet-shell {
  height: 100vh;

  &__page {
    display: flex;
    height: 100vh;
    min-height: 0 !important; // beats q-page's inline min-height
  }

  // Decorative coins behind the rail and panels. z-index -1 inside the
  // q-layout's isolated stacking context: above its background and dot
  // grid, below all in-flow content. Positions are from the 1440px frames.
  &__decor {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  &__decor-coin {
    position: absolute;
    display: block;
  }

  &__decor-coin--tilted {
    top: 233px;
    left: 358px;
    width: 178px;
    height: 156px;
    opacity: 0.4;
    mix-blend-mode: screen;
    transform: rotate(6.1deg);
    transform-origin: top left;
  }

  &__decor-coin--round {
    right: -47px;
    bottom: 0;
    width: 296px;
    height: 295px;
    opacity: 0.55;
  }

  // Nav rail
  &__rail {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 80px;
    padding: var(--beldex-space-6) 0;
    background-color: #0a0a0a;
    border-right: 1px solid var(--beldex-hairline);
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: var(--beldex-accent-bg-strong);
    border: 1px solid var(--beldex-accent);

    img {
      width: 22px;
      height: 25px;
      object-fit: cover;
    }
  }

  &__rail-items {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-4);
  }

  &__rail-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    color: var(--beldex-text-muted);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;

    &:hover {
      color: var(--beldex-text);
    }

    &--active {
      color: var(--beldex-text);
      background-color: rgba(235, 235, 235, 0.1);
      border-color: rgba(235, 235, 235, 0.1);

      &::before {
        content: "";
        position: absolute;
        top: 16px;
        left: -23px;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: var(--beldex-accent);
        box-shadow: 0 0 6px var(--beldex-accent-glow);
      }
    }
  }

  // Icons as masks so they follow the item colour.
  &__rail-icon {
    width: 20px;
    height: 20px;
    background-color: currentColor;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;

    &--wallet {
      -webkit-mask-image: url("~assets/icons/rail-wallet.svg");
    }

    &--swap {
      -webkit-mask-image: url("~assets/icons/rail-swap.svg");
    }

    &--bns {
      -webkit-mask-image: url("~assets/icons/rail-bns.svg");
    }

    &--masternode {
      -webkit-mask-image: url("~assets/icons/rail-masternode.svg");
    }

    &--advanced {
      -webkit-mask-image: url("~assets/icons/rail-advanced.svg");
    }

    &--exit {
      -webkit-mask-image: url("~assets/icons/rail-exit.svg");
    }
  }

  // Main column
  &__main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    background-color: rgba(11, 11, 11, 0.2);
  }

  &__topbar {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-4);
    height: 64px;
    padding: 0 32px;
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__title-group {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-xl);
    line-height: 32px;
    letter-spacing: -0.2px;
    color: var(--beldex-text);
    white-space: nowrap;
  }

  &__alias {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 260px;
    height: 28px;
    padding: 0 10px;
    font-size: var(--beldex-text-md);
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--beldex-text);
    background-color: var(--beldex-accent-bg-strong);
    border: 1px solid var(--beldex-accent-border-soft);

    img {
      flex: none;
      width: 9px;
      height: 10px;
    }

    .beldex-net-chip__dot {
      flex: none;
      width: 6px;
      height: 6px;
      margin-left: 6px;
      background-color: var(--beldex-accent);
      box-shadow: 0 0 6px var(--beldex-accent-glow);
    }
  }

  &__utilities {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
  }

  &__round-btn {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background-color: var(--beldex-panel);
    border: 1px solid rgba(235, 235, 235, 0.2);
    border-radius: 18px;
    cursor: pointer;

    &:hover {
      border-color: rgba(235, 235, 235, 0.4);
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    > img {
      width: 16px;
      height: 16px;
    }

    // Existing WalletSettings / MainMenu q-btns sit inside the circle.
    .q-btn {
      min-width: 0 !important; // beats app.styl q-btn min-widths
      min-height: 0;
      width: 34px;
      height: 34px;
      padding: 0;
      border-radius: 17px;
      background: transparent !important;
      box-shadow: none;
    }

    // Quasar's wrapper keeps `padding: 4px 16px; min-height: 2.572em`,
    // which is taller than the 34px button and pushes the icon off-centre.
    .q-btn .q-btn__wrapper {
      min-height: 0;
      padding: 0;
    }

    .q-btn .q-icon {
      font-size: 16px !important;
      color: var(--beldex-text-subtle) !important;
    }

    // Icons at their native ~12.7px height; width follows
    // the asset (they use preserveAspectRatio="none", so don't force a box).
    .q-btn img {
      width: auto;
      height: 12.67px;
    }

    .wallet-settings__icon {
      transform: rotate(90deg);
    }
  }

  // Telemetry bar (StatusFooter + version)
  &__telemetry {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--beldex-space-3);
    height: 36px;
    padding: 0 32px;
    font-size: var(--beldex-text-sm);
    background-color: var(--beldex-bg);
    border-bottom: 1px solid #1a1a1a;
  }

  &__sep {
    color: #2c2c2c;
  }

  &__version {
    color: var(--beldex-text-faint);
    white-space: nowrap;
  }

  // Content
  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--beldex-space-5);
    min-height: 0;
    padding: var(--beldex-space-6);
  }

  &__columns {
    display: flex;
    flex: 1 1 auto;
    gap: var(--beldex-space-5);
    min-height: 0;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: var(--beldex-space-5);
    overflow-y: auto;
    background-color: rgba(11, 11, 11, 0.65);
    border: 1px solid rgba(235, 235, 235, 0.1);

    &--left {
      flex: 0 0 560px;
      max-width: 45%;
      background-color: rgba(11, 11, 11, 0.75);
    }

    &--main {
      flex: 1 1 auto;
    }

    // Pages that lay out their own panels (Masternode: list + summary).
    &--bare {
      padding: 0;
      background-color: transparent;
      border: 0;
    }
  }
}
</style>
