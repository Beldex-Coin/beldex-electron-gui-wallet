<template>
  <q-page
    class="create-wallet beldex-wallet flex justify-center items-center"
    style="min-height: unset; height: calc(100vh - 70px)"
  >
    <section class="flex justify-center items-center">
      <div class="fields">
        <div class="createTitle">{{ this.$t("titles.wallet.createNew") }}</div>
        <OxenField
          :label="$t('fieldLabels.walletName')"
          :error="$v.wallet.name.$error"
        >
          <q-input
            v-model="wallet.name"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.walletName')"
            borderless
            dense
            maxlength="26"
            @keyup.enter="create"
            @blur="$v.wallet.name.$touch"
          />
        </OxenField>

        <OxenField :label="$t('fieldLabels.seedLanguage')" class="dropdown">
          <q-select
            v-model="wallet.language"
            :options="languageOptions"
            borderless
            dense
            emit-value
            map-options
            dropdown-icon="expand_more"
          />
        </OxenField>

        <OxenField :label="$t('fieldLabels.password')">
          <q-input
            v-model="wallet.password"
            type="password"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.walletPassword')"
            borderless
            dense
            @keyup.enter="create"
          />
        </OxenField>
        <!-- :placeholder="$t('placeholders.reEnterWalletPassword')" -->
        <OxenField :label="$t('fieldLabels.confirmPassword')">
          <q-input
            v-model="wallet.password_confirm"
            type="password"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.reEnterWalletPassword')"
            borderless
            dense
            @keyup.enter="create"
          />
        </OxenField>
        <div class="flex justify-center align-center submit">
          <q-btn
            class="submit-button"
            color="cancel"
            :label="$t('buttons.cancel')"
            @click="cancel()"
          />
          <span class="divider"></span>
          <q-btn
            class="submit-button"
            color="primary"
            :label="$t('buttons.createWallet')"
            @click="create"
          />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
export default {
  components: {
    OxenField
  },
  data() {
    const languageOptions = [
      { label: "English", value: "English" },
      { label: "Deutsch", value: "Deutsch" },
      { label: "Español", value: "Español" },
      { label: "Français", value: "Français" },
      { label: "Italiano", value: "Italiano" },
      { label: "Nederlands", value: "Nederlands" },
      { label: "Português", value: "Português" },
      { label: "Русский", value: "Русский" },
      { label: "日本語", value: "日本語" },
      { label: "简体中文 (中国)", value: "简体中文 (中国)" },
      { label: "Esperanto", value: "Esperanto" },
      { label: "Lojban", value: "Lojban" }
    ];
    return {
      wallet: {
        name: "",
        language: languageOptions[0].value,
        password: "",
        password_confirm: ""
      },
      languageOptions
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status
  }),
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created",
              query: {
                title: this.$t("titles.wallet.walletCreated")
              }
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$q.loading.hide();
  },
  validations: {
    wallet: {
      name: { required }
    }
  },
  methods: {
    createWallet() {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "positive"
      });
      this.$gateway.send("wallet", "create_wallet", this.wallet);
    },
    create() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.wallet.password != this.wallet.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      // Warn user if no password is set
      if (!this.wallet.password) {
        const passwordPromise = this.$q.dialog({
          title: this.$t("dialog.noPassword.title"),
          message: this.$t("dialog.noPassword.message"),
          ok: {
            label: this.$t("dialog.noPassword.ok"),
            color: "primary"
          },
          cancel: {
            // flat: true,
            label: this.$t("dialog.buttons.cancel"),
            // color: this.theme === "dark" ? "white" : "dark"
            color: "accent"
          },
          dark: this.theme == "dark"
          // color: "positive"
        });
        passwordPromise
          .onOk(() => {
            this.createWallet();
          })
          .onDismiss(() => {})
          .onCancel(() => {});
      } else {
        this.createWallet();
      }
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.create-wallet {
  .dropdown {
    .content:hover {
      background-color: #41415b !important;
      border-color: #41415b !important;
      // transition: none;
    }
  }
}
.submit {
  .q-btn {
    min-width: 251px;
  }
}
</style>
