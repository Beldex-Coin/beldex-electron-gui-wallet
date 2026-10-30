<template>
  <q-page class="beldex-form-page created">
    <section class="beldex-panel beldex-form-page__card created__card">
      <div class="beldex-heading">
        <h1 class="beldex-heading__title">{{ $route.query.title }}</h1>
      </div>

      <div class="created__rows">
        <div>
          <span class="beldex-label created__label">
            {{ $t("footer.wallet") }}: {{ walletName }}
          </span>
          <div class="beldex-copy-row">
            <span class="beldex-copy-row__value">{{ info.address }}</span>
            <button
              type="button"
              class="beldex-copy-row__btn"
              @click="copyAddress"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip anchor="center left" self="center right">
                {{ $t("menuItems.copyAddress") }}
              </q-tooltip>
            </button>
          </div>
        </div>

        <div v-if="secret.mnemonic.length > 0">
          <span class="beldex-label created__label">
            {{ $t("strings.seedWords") }} -
            <span class="created__warning">{{
              $t("strings.saveSeedWarning")
            }}</span>
          </span>
          <div class="beldex-copy-row beldex-copy-row--multiline">
            <span class="beldex-copy-row__value">{{ secret.mnemonic }}</span>
            <button
              type="button"
              class="beldex-copy-row__btn"
              @click="copyPrivateKey('mnemonic', $event)"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip anchor="center left" self="center right">
                {{ $t("menuItems.copySeed") }}
              </q-tooltip>
            </button>
          </div>
        </div>

        <div v-if="pendingSecretsTitle">
          <span class="beldex-label created__label">
            {{ pendingSecretsTitle }}
          </span>
          <p class="beldex-hint">{{ $t("strings.keysAvailableAfterSync") }}</p>
        </div>

        <div v-if="showViewKey">
          <span class="beldex-label created__label">
            {{ $t("strings.viewKey") }}
          </span>
          <div class="beldex-copy-row">
            <span class="beldex-copy-row__value">{{ secret.view_key }}</span>
            <button
              type="button"
              class="beldex-copy-row__btn"
              @click="copyPrivateKey('view_key', $event)"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip anchor="center left" self="center right">
                {{ $t("menuItems.copyViewKey") }}
              </q-tooltip>
            </button>
          </div>
        </div>

        <div v-if="showSpendKey">
          <span class="beldex-label created__label">
            {{ $t("strings.spendKey") }}
          </span>
          <div class="beldex-copy-row">
            <span class="beldex-copy-row__value">{{ secret.spend_key }}</span>
            <button
              type="button"
              class="beldex-copy-row__btn"
              @click="copyPrivateKey('spend_key', $event)"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip anchor="center left" self="center right">
                {{ $t("menuItems.copySpendKey") }}
              </q-tooltip>
            </button>
          </div>
        </div>
      </div>

      <div class="created__actions">
        <q-btn
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          @click="open"
        >
          {{ $t("buttons.openWallet") }}
          <img src="~assets/icons/arrow-right.svg" alt="" />
        </q-btn>
      </div>
    </section>
  </q-page>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
export default {
  computed: mapState({
    info: state => state.gateway.wallet.info,
    secret: state =>
      state.gateway.wallet.secret || {
        mnemonic: "",
        spend_key: "",
        view_key: ""
      },
    theme: state => state.gateway.app.config.appearance.theme,
    walletName() {
      return `${this.info.name}`;
    },
    // After a restore or import wallet-rpc answers query_key only once its
    // scan is done, so the keys can arrive later than the address. The seed
    // is not listed: wallets restored from keys never have one.
    viewKeyPending() {
      return !this.secret.view_key && !this.$store.getters["gateway/isReady"];
    },
    spendKeyPending() {
      return (
        !this.secret.spend_key &&
        !this.info.view_only &&
        !this.$store.getters["gateway/isReady"]
      );
    },
    pendingSecretsTitle() {
      return [
        this.viewKeyPending && this.$t("strings.viewKey"),
        this.spendKeyPending && this.$t("strings.spendKey")
      ]
        .filter(Boolean)
        .join(" / ");
    },
    showViewKey() {
      return (
        !!this.secret.view_key && this.secret.view_key != this.secret.spend_key
      );
    },
    showSpendKey() {
      return !!this.secret.spend_key && !/^0*$/.test(this.secret.spend_key);
    }
  }),
  beforeDestroy() {
    // Stops the post-scan update from re-sending the secrets once this page
    // is gone (see finalizeNewWallet).
    this.$gateway.send("wallet", "forget_new_wallet_secrets");
  },
  methods: {
    open() {
      setTimeout(() => {
        this.$store.commit("gateway/set_wallet_data", {
          secret: {
            mnemonic: "",
            spend_key: "",
            view_key: ""
          }
        });
      }, 500);
      this.$router.replace({ path: "/wallet" });
    },
    copyPrivateKey(type, event) {
      event.stopPropagation();
      const button =
        (event.path && event.path.find(el => el.tagName === "BUTTON")) ||
        (event.composedPath &&
          event.composedPath().find(el => el.tagName === "BUTTON")) ||
        (event.target &&
          event.target.closest &&
          event.target.closest("button"));
      if (button) {
        button.blur();
      }

      const secret = this.secret || {};
      const value = secret[type];
      if (value == null || value === "") {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.copyingPrivateKeys")
        });
        return;
      }

      clipboard.writeText(this.secret[type]);
      let type_key = "seedWords";
      if (type === "spend_key") {
        type_key = "spendKey";
      } else if (type === "view_key") {
        type_key = "viewKey";
      }
      const type_title = this.$t("dialog.copyPrivateKeys." + type_key);

      this.$q
        .dialog({
          title: this.$t("dialog.copyPrivateKeys.title", {
            type: type_title
          }),
          message: this.$t("dialog.copyPrivateKeys.message"),
          ok: {
            label: this.$t("dialog.buttons.ok"),
            color: "primary"
          }
        })
        .onDismiss(() => null)
        .onCancel(() => null)
        .onOk(() => {
          this.$q.notify({
            type: "positive",
            timeout: 1000,
            message: this.$t("notification.positive.copied", {
              item: this.$t("strings." + type_key)
            })
          });
        });
    },
    copyAddress() {
      clipboard.writeText(this.info.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied"),
        dark: this.theme == "dark"
      });
    }
  }
};
</script>

<style lang="scss">
.created {
  .created__card.beldex-form-page__card {
    max-width: 838px;
    gap: 31px;
    padding: var(--beldex-space-7) 33px 32px;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 21px;
  }

  &__label {
    margin-bottom: var(--beldex-space-2);
  }

  &__warning {
    color: var(--beldex-accent);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
  }
}
</style>
