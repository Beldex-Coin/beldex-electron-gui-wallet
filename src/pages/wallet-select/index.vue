<template>
  <q-page
    style="min-height: unset; height: calc(100vh - 70px)"
    class="registration-View"
  >
    <q-list
      class="wallet-list beldex-theme d-flex-center column"
      style="height: 100%"
      no-border
      :dark="theme == 'dark'"
    >
      <div v-if="backbtn" class="flex items-center back-btn-box">
        <div class="flex items-center">
          <qbtn flat class="back-btn" @click="backbtn = false">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
                fill="white"
              />
            </svg>
          </qbtn>
          <span style="padding-top: 10px;">{{ this.$t("buttons.back") }}</span>
        </div>
      </div>
      <div
        class="justify-center items-center registrationBox"
        :style="!wallets.list.length || backbtn ? '' : 'width:85%;height:80%'"
      >
        <section v-if="!wallets.list.length || backbtn">
          <div class="p-absolute">
            <div class="coin-position-left">
              <img src="../../assets/images/coin.svg" width="100px" />
            </div>
            <div class="coin-position-right">
              <img src="../../assets/images/blue_coin.svg" width="100px" />
            </div>
          </div>
          <img src="../../assets/images/Home_screen_asset.svg" class="img" />
        </section>

        <template v-if="wallets.list.length && !backbtn">
          <div class="header flex justify-center items-center">
            <div class="header-title ft-bold">
              {{ $t("titles.yourWallets") }}
            </div>
          </div>
          <!-- <div class="hr-separator" /> -->
          <section
            class="content-box"
            :style="!wallets.list.length || backbtn ? '' : 'height:75%'"
          >
            <q-item
              v-for="wallet in wallets.list"
              :key="`${wallet.address}-${wallet.name}`"
              @click.native="openWallet(wallet)"
            >
              <!-- <q-item-section avatar> -->
              <!-- <q-icon class="wallet-icon">
                <svg
                  width="48"
                  viewBox="0 0 17 16"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="si-glyph si-glyph-wallet"
                >
                  <defs class="si-glyph-fill"></defs>
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g transform="translate(1.000000, 0.000000)" fill="#434343">
                      <path
                        d="M7.988,10.635 L7.988,8.327 C7.988,7.578 8.561,6.969 9.267,6.969 L13.964,6.969 L13.964,5.531 C13.964,4.849 13.56,4.279 13.007,4.093 L13.007,4.094 L11.356,4.08 L11.336,4.022 L3.925,4.022 L3.784,4.07 L1.17,4.068 L1.165,4.047 C0.529,4.167 0.017,4.743 0.017,5.484 L0.017,13.437 C0.017,14.269 0.665,14.992 1.408,14.992 L12.622,14.992 C13.365,14.992 13.965,14.316 13.965,13.484 L13.965,12.031 L9.268,12.031 C8.562,12.031 7.988,11.384 7.988,10.635 L7.988,10.635 Z"
                        class="si-glyph-fill"
                      ></path>
                      <path
                        d="M14.996,8.061 L14.947,8.061 L9.989,8.061 C9.46,8.061 9.031,8.529 9.031,9.106 L9.031,9.922 C9.031,10.498 9.46,10.966 9.989,10.966 L14.947,10.966 L14.996,10.966 C15.525,10.966 15.955,10.498 15.955,9.922 L15.955,9.106 C15.955,8.528 15.525,8.061 14.996,8.061 L14.996,8.061 Z M12.031,10.016 L9.969,10.016 L9.969,9 L12.031,9 L12.031,10.016 L12.031,10.016 Z"
                        class="si-glyph-fill"
                      ></path>
                      <path
                        d="M3.926,4.022 L10.557,1.753 L11.337,4.022 L12.622,4.022 C12.757,4.022 12.885,4.051 13.008,4.092 L11.619,0.051 L1.049,3.572 L1.166,4.048 C1.245,4.033 1.326,4.023 1.408,4.023 L3.926,4.023 L3.926,4.022 Z"
                        class="si-glyph-fill"
                      ></path>
                    </g>
                  </g>
                </svg>
              </q-icon>-->
              <!-- </q-item-section> -->
              <!-- <q-item-section class="flex column">
              <q-item-label class="wallet-name ft-bold" caption>{{
                wallet.name
              }}</q-item-label>
              <q-item-label class="monospace ellipsis" caption>{{
                wallet.address
              }}</q-item-label>
              </q-item-section>-->
              <article>
                <div class="wallet-name ft-bold">{{ wallet.name }}</div>
                <div class="address-txt ellipsis ft-regular q-mb-xs">
                  {{ wallet.address }}
                </div>
              </article>

              <ContextMenu
                :menu-items="menuItems"
                @openWallet="openWallet(wallet)"
                @copyAddress="copyAddress(wallet.address)"
              />
            </q-item>
          </section>
          <!-- <q-separator /> -->
          <!-- <q-btn
              v-if="wallets.list.length"
              class="add"
              icon="add"
              size="md"
              color="primary"
            >
              <q-menu class="header-popover" :content-class="'header-popover'">
                <q-list separator>
                  <q-item
                    v-for="action in actions"
                    :key="action.name"
                    clickable
                    @click.native="action.handler"
                  >
                    <q-item-section>
                      {{ action.name }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
          </q-btn>-->
          <div
            v-if="wallets.list.length && !backbtn"
            class="flex justify-center"
          >
            <q-btn
              class="add"
              icon-right="add"
              :label="this.$t('buttons.addWallet')"
              size="md"
              color="primary"
              @click="backbtn = true"
            />
          </div>
        </template>
        <template v-else>
          <div class="btn-spliter">
            <button class="btn login-btn" @click="this.restoreWallet">
              {{ this.$t("titles.wallet.useExistingWallet") }}
            </button>
            <button class="btn create-btn" @click="this.createNewWallet">
              {{ this.$t("titles.wallet.createNew") }}
            </button>
          </div>
          <div class="import-btn-box">
            <button class="btn import-btn" @click="this.importWallet">
              {{ this.$t("titles.wallet.importFromFile") }}
            </button>
          </div>
          <!-- <q-item
          v-for="action in actions"
          :key="action.name"
          @click.native="action.handler"
        >
        
          <q-item-section>
           
            {{ action.name }}
          </q-item-section>
          </q-item>-->
        </template>
      </div>
    </q-list>
  </q-page>
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import ContextMenu from "components/menus/contextmenu";

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
    this.$gateway.send("wallet", "list_wallets");
  },
  methods: {
    openWallet(wallet) {
      if (wallet.password_protected !== false) {
        this.$q
          .dialog({
            title: this.$t("dialog.password.title"),
            // title: "Enter your Wallet Password",
            message: this.$t("dialog.password.message"),
            // message: `Just click “Enter” if you haven’t set any password :)`,
            prompt: {
              model: "",
              type: "password"
            },

            ok: {
              label: this.$t("buttons.enter"),
              color: "primary"
            },
            cancel: {
              // flat: true,
              label: this.$t("dialog.buttons.cancel")
            },
            color: "accent",
            persistent: true,
            style: "min-width: 500px; padding:30px;"
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
.registration-View {
  .back-btn-box {
    width: 832px;
    .back-btn {
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    // .back-btn:hover {
    //   background: rgba(119, 119, 151, 0.3) !important;
    //   border-radius: 20px;
    // }
    span {
      font-family: "Poppins-Bold";
      font-size: 26px;
      padding-bottom: 5px;
      margin-left: 10px;
    }
  }
}

.wallet-list {
  .wallet-icon {
    font-size: 3rem;
  }

  .add {
    // width: 38px;
    padding: 0;
    margin-top: 10px;

    .on-right {
      margin-left: 3px;
    }
    .q-icon,
    .q-btn .q-spinner {
      font-size: 1.4em;
    }
  }
  .header {
    margin: 0 16px;
    padding: 6px;
    min-height: 36px;

    .header-title {
      font-size: 33px;
    }
  }
  .wallet-name {
    font-size: 1.313rem;
    color: white;
  }
  .q-item {
    margin: 10px 0px;
    margin-bottom: 0px;
    padding: 14px;
    border-radius: 3px;
    width: 93%;
    margin: 0 auto;
    height: unset;
    cursor: pointer;
  }
  .address-txt {
    width: 715px;
    color: #afafbe;
    font-size: 1.125 rem;
  }
  .content-box {
    height: 419px;
    overflow: auto;
  }
}
</style>
