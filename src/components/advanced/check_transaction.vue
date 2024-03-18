<template>
  <div class="check-transaction">
    <div class="q-pa-md">
      <div class="q-mb-lg tab-desc ft-medium">
        {{ $t("strings.checkTransaction.description") }}
      </div>
      <div>
        <OxenField
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
        </OxenField>
        <OxenField
          class="q-mt-md ft-medium"
          :label="$t('fieldLabels.recipientAddress')"
          :error="$v.address.$error"
          optional
        >
          <q-input
            v-model.trim="address"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.recipientWalletAddress')"
            borderless
            dense
            @blur="$v.address.$touch"
          />
        </OxenField>
        <OxenField
          class="q-mt-md ft-medium"
          :label="$t('fieldLabels.message')"
          optional
        >
          <q-input
            v-model.trim="message"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.proveOptionalMessage')"
            borderless
            dense
          />
        </OxenField>
        <OxenField
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
        </OxenField>
        <div class="submit-button flex row justify-center">
          <q-btn color="primary" :label="$t('buttons.check')" @click="check" />
          <q-btn
            v-if="canClear"
            color="accent"
            :label="$t('buttons.clear')"
            @click="clear"
          />
        </div>
      </div>
      <div v-if="status.state.txid" style="color:white">
        <div class="q-mb-sm flex row no-wrap ">
          <div class="title q-mr-sm">{{ $t("strings.transactionID") }}</div>
          <div style="word-break: break-all">{{ status.state.txid }}</div>
        </div>
        <div class="q-mb-sm flex row no-wrap">
          <div class="title q-mr-sm">
            {{ $t("strings.checkTransaction.infoTitles.validTransaction") }}
          </div>
          <div :class="status.state.good ? 'good' : 'bad'">
            {{ validTransaction }}
          </div>
        </div>
        <div
          v-if="status.state.received != null"
          class="q-mb-sm flex row no-wrap"
        >
          <div class="title q-mr-sm">
            {{ $t("strings.checkTransaction.infoTitles.received") }}
          </div>
          <div>
            <FormatOxen :amount="status.state.received" raw-value />
          </div>
        </div>
        <div
          v-if="status.state.in_pool != null"
          class="q-mb-sm flex row no-wrap"
        >
          <div class="title q-mr-sm">
            {{ $t("strings.checkTransaction.infoTitles.inPool") }}
          </div>
          <div>{{ status.state.in_pool }}</div>
        </div>
        <div
          v-if="status.state.confirmations != null"
          class="q-mb-sm flex row no-wrap"
        >
          <div class="title q-mr-sm">
            {{ $t("strings.checkTransaction.infoTitles.confirmations") }}
          </div>
          <div>{{ status.state.confirmations }}</div>
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
import OxenField from "components/oxen_field";
import FormatOxen from "components/format_oxen";

export default {
  name: "CheckTransaction",
  components: {
    OxenField,
    FormatOxen
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
.check-transaction {
  .description {
    white-space: pre-line;
  }
  .submit-button {
    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
    margin-bottom: 12px;
  }
}
</style>
