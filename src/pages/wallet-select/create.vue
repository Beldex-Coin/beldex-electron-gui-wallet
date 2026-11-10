<template>
  <q-page class="beldex-form-page">
    <!-- Step 1: name. Step 2: password. -->
    <section class="beldex-panel beldex-form-page__card">
      <div>
        <div class="beldex-heading">
          <button
            type="button"
            class="beldex-icon-btn beldex-icon-btn--arrow-lg"
            :aria-label="$t('buttons.back')"
            @click="back()"
          >
            <span class="beldex-icon-btn__glyph">←</span>
          </button>
          <h1 class="beldex-heading__title">
            {{
              step === 1
                ? $t("titles.wallet.createNew")
                : $t("fieldLabels.password")
            }}
          </h1>
        </div>
        <p v-if="step === 1" class="beldex-heading__subtitle">
          {{ $t("strings.createWalletSubtitle") }}
        </p>
      </div>

      <div v-show="step === 1" class="beldex-form-page__fields">
        <BeldexField
          class="beldex-field--hero beldex-field--center"
          :error="$v.wallet.name.$error"
        >
          <q-input
            v-model="wallet.name"
            dark
            :placeholder="$t('placeholders.walletName')"
            :aria-label="$t('fieldLabels.walletName')"
            borderless
            dense
            maxlength="26"
            @keyup.enter="next"
            @blur="$v.wallet.name.$touch"
          />
        </BeldexField>
      </div>

      <div
        v-show="step === 2"
        class="beldex-form-page__fields beldex-form-page__fields--tight"
      >
        <BeldexField class="beldex-field--hero">
          <PasswordInput
            v-model="wallet.password"
            dark
            :placeholder="$t('placeholders.createWalletPassword')"
            :aria-label="$t('fieldLabels.password')"
            borderless
            dense
            @keyup.enter="create"
          />
        </BeldexField>
        <BeldexField class="beldex-field--hero">
          <PasswordInput
            v-model="wallet.password_confirm"
            dark
            :placeholder="$t('placeholders.reEnterWalletPassword')"
            :aria-label="$t('fieldLabels.confirmPassword')"
            borderless
            dense
            @keyup.enter="create"
          />
        </BeldexField>
      </div>

      <div class="beldex-form-page__actions">
        <q-btn
          v-if="step === 1"
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          @click="next"
        >
          {{ $t("buttons.next") }}
          <span class="beldex-form-page__submit-arrow">→</span>
        </q-btn>
        <q-btn
          v-else
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          :label="$t('buttons.createWallet')"
          @click="create"
        />
      </div>
    </section>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import BeldexField from "components/beldex_field";
import PasswordInput from "components/password_input";
import ConfirmDialog from "components/confirm_dialog";
export default {
  components: {
    PasswordInput,
    BeldexField
  },
  data() {
    return {
      wallet: {
        name: "",
        // The design has no seed-language picker on this screen.
        language: "English",
        password: "",
        password_confirm: ""
      },
      // UI-only: 1 = name, 2 = password
      step: 1
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
    next() {
      this.$v.wallet.name.$touch();
      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      this.step = 2;
    },
    back() {
      if (this.step === 2) {
        this.step = 1;
        return;
      }
      this.cancel();
    },
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
        this.$q
          .dialog({
            component: ConfirmDialog,
            title: this.$t("dialog.noPassword.title"),
            message: this.$t("dialog.noPassword.message"),
            okLabel: this.$t("dialog.noPassword.ok"),
            cancelLabel: this.$t("dialog.buttons.cancel"),
            icon: "warning",
            iconTone: "accent"
          })
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
