<template>
  <div class="check-transaction">
    <div class="q-pa-md">
      <div class="beldex-hint beldex-form-desc">
        {{ $t("strings.checkTransaction.description") }}
      </div>
      <div>
        <BeldexField
          :label="$t('fieldLabels.transactionId')"
          :error="$v.txid.$error"
          class="ft-medium"
        >
          <q-input
            v-model.trim="txid"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.pasteTransactionId')"
            borderless
            dense
            @blur="$v.txid.$touch"
          />
        </BeldexField>
        <BeldexField
          class="q-mt-md ft-medium"
          :label="$t('fieldLabels.recipientAddress')"
          :error="$v.address.$error"
          optional
          optional-right
        >
          <q-input
            v-model.trim="address"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.recipientWalletAddress')"
            borderless
            dense
            @blur="$v.address.$touch"
          />
        </BeldexField>
        <BeldexField
          class="q-mt-md ft-medium"
          :label="$t('fieldLabels.message')"
          optional
          optional-right
        >
          <q-input
            v-model.trim="message"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.proveOptionalMessage')"
            borderless
            dense
          />
        </BeldexField>
        <BeldexField
          class="q-mt-md ft-medium"
          :label="$t('fieldLabels.signature')"
          :error="$v.signature.$error"
        >
          <q-input
            v-model.trim="signature"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.pasteTransactionProof')"
            borderless
            dense
          />
        </BeldexField>
        <div class="beldex-form-actions">
          <q-btn
            v-if="canClear"
            class="beldex-btn beldex-btn--ghost"
            unelevated
            no-caps
            :label="$t('buttons.clear')"
            @click="clear"
          />
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :label="$t('buttons.check')"
            @click="check"
          />
        </div>
      </div>
      <div v-if="status.state.txid" class="beldex-result">
        <div class="beldex-result__row">
          <span class="beldex-label">{{ $t("strings.transactionID") }}</span>
          <span class="beldex-result__value">{{ status.state.txid }}</span>
        </div>
        <div class="beldex-result__row">
          <span class="beldex-label">{{
            $t("strings.checkTransaction.infoTitles.validTransaction")
          }}</span>
          <span
            class="beldex-result__value"
            :class="
              status.state.good
                ? 'beldex-result__value--good'
                : 'beldex-result__value--bad'
            "
            >{{ validTransaction }}</span
          >
        </div>
        <div v-if="status.state.received != null" class="beldex-result__row">
          <span class="beldex-label">{{
            $t("strings.checkTransaction.infoTitles.received")
          }}</span>
          <span class="beldex-result__value"
            ><FormatBeldex :amount="status.state.received" raw-value
          /></span>
        </div>
        <div v-if="status.state.in_pool != null" class="beldex-result__row">
          <span class="beldex-label">{{
            $t("strings.checkTransaction.infoTitles.inPool")
          }}</span>
          <span class="beldex-result__value">{{ status.state.in_pool }}</span>
        </div>
        <div
          v-if="status.state.confirmations != null"
          class="beldex-result__row"
        >
          <span class="beldex-label">{{
            $t("strings.checkTransaction.infoTitles.confirmations")
          }}</span>
          <span class="beldex-result__value">{{
            status.state.confirmations
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { address } from "src/validators/common";
import { i18n } from "boot/i18n";
import BeldexField from "components/beldex_field";
import FormatBeldex from "components/format_beldex";

export default {
  name: "CheckTransaction",
  components: {
    BeldexField,
    FormatBeldex
  },
  data() {
    return {
      txid: "",
      address: "",
      message: "",
      signature: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.check_transaction_status,
    canClear() {
      return (
        this.txid !== "" ||
        this.address !== "" ||
        this.message !== "" ||
        this.signature != ""
      );
    },
    validTransaction() {
      let key = this.status.state.good ? "yes" : "no";
      return i18n.t(`strings.checkTransaction.validTransaction.${key}`);
    }
  }),
  validations: {
    txid: { required },
    address: {
      isAddress(value) {
        if (value === "") return true;

        return new Promise(resolve => {
          address(value, this.$gateway)
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
      }
    },
    signature: { required }
  },
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    check() {
      this.$v.txid.$touch();
      this.$v.address.$touch();
      this.$v.signature.$touch();

      if (this.$v.txid.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterTransactionId")
        });
        return;
      }

      if (this.$v.signature.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterTransactionProof")
        });
        return;
      }

      if (this.$v.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      this.$gateway.send("wallet", "check_transaction", {
        txid: this.txid,
        signature: this.signature,
        address: this.address,
        message: this.message
      });
    },
    clear() {
      this.txid = "";
      this.address = "";
      this.message = "";
      this.signature = "";
      this.$v.$reset();
    }
  }
};
</script>

<style lang="scss">
.beldex-app .check-transaction {
  .description {
    white-space: pre-line;
  }
}
</style>
