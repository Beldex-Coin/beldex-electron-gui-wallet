<template>
  <q-page class="beldex-form-page import-wallet">
    <!-- File field label uses "Wallet File". -->
    <section class="beldex-panel beldex-form-page__card">
      <div class="beldex-heading">
        <button
          type="button"
          class="beldex-icon-btn"
          :aria-label="$t('buttons.back')"
          @click="cancel()"
        >
          ←
        </button>
        <h1 class="beldex-heading__title">
          {{ $t("titles.importFromFile") }}
        </h1>
      </div>

      <div class="beldex-form-page__fields">
        <BeldexField :error="$v.wallet.name.$error">
          <q-input
            v-model="wallet.name"
            :placeholder="$t('placeholders.walletName')"
            :aria-label="$t('fieldLabels.newWalletName')"
            dark
            borderless
            dense
            maxlength="26"
            @keyup.enter="import_wallet"
            @blur="$v.wallet.name.$touch"
          />
        </BeldexField>

        <BeldexField
          class="beldex-field--with-action"
          :label="$t('fieldLabels.walletFile')"
          disable-hover
          :error="$v.wallet.path.$error"
        >
          <q-input
            v-model="wallet.path"
            :placeholder="$t('placeholders.selectAFile')"
            disable
            dark
            borderless
            dense
          />
          <q-btn
            flat
            no-caps
            :label="$t('buttons.selectWalletFile')"
            @click="selectFile"
          />
        </BeldexField>

        <BeldexField>
          <q-input
            v-model="wallet.password"
            :placeholder="$t('placeholders.walletPassword')"
            :aria-label="$t('fieldLabels.password')"
            type="password"
            dark
            borderless
            dense
            @keyup.enter="import_wallet"
          />
        </BeldexField>

        <BeldexField>
          <q-input
            v-model="wallet.password_confirm"
            :placeholder="$t('placeholders.reEnterWalletPassword')"
            :aria-label="$t('fieldLabels.confirmPassword')"
            type="password"
            dark
            borderless
            dense
            @keyup.enter="import_wallet"
          />
        </BeldexField>
      </div>

      <div class="import-wallet__actions">
        <q-btn
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          @click="import_wallet"
        >
          {{ $tc("buttons.importWallet", 1) }}
          <img src="~assets/icons/arrow-right.svg" alt="" />
        </q-btn>
      </div>
    </section>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import BeldexField from "components/beldex_field";
import { dialog } from "src/shims/electron-renderer";
export default {
  components: {
    BeldexField
  },
  data() {
    return {
      wallet: {
        name: "",
        path: "",
        password: "",
        password_confirm: ""
      }
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
        const { code, i18n } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created",
              query: {
                title: this.$t("titles.wallet.walletImported")
              }
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message: this.$t(i18n)
            });
            break;
        }
      },
      deep: true
    }
  },
  validations: {
    wallet: {
      name: { required },
      path: { required }
    }
  },
  methods: {
    async selectFile() {
      const path = await dialog.selectWalletFile();
      if (path) {
        this.wallet.path = path;
        this.$v.wallet.path.$touch();
      }
    },
    import_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }

      if (this.$v.wallet.path.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.selectWalletFile")
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

      this.$q.loading.show({
        delay: 0,
        spinnerColor: "positive"
      });

      this.$gateway.send("wallet", "import_wallet", this.wallet);
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.import-wallet {
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
