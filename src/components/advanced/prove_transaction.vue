<template>
  <div class="prove-transaction">
    <div class="q-pa-md">
      <div class="beldex-hint beldex-form-desc">
        {{ $t("strings.proveTransactionDescription") }}
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
            v-if="status.state.signature"
            class="beldex-btn beldex-btn--ghost"
            unelevated
            no-caps
            :label="$t('buttons.copySignature')"
            @click="copy"
          />
          <q-btn class="beldex-btn" unelevated no-caps @click="generate">
            <img src="~assets/icons/advanced-generate.svg" alt="" />
            {{ $t("buttons.generateProof") }}
          </q-btn>
        </div>
      </div>
      <div v-if="status.state.signature" class="signature-wrapper">
        <div class="beldex-result__row">
          <span class="beldex-label">{{ $t("strings.transactionID") }}</span>
          <span class="beldex-result__value">{{ status.state.txid }}</span>
        </div>
        <p class="signature">
          {{ status.state.signature }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { address } from "src/validators/common";
import BeldexField from "components/beldex_field";
import { clipboard } from "src/shims/electron-renderer";

export default {
  name: "ProveTransaction",
  components: {
    BeldexField
  },
  data() {
    return {
      txid: "",
      address: "",
      message: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.prove_transaction_status,
    canClear() {
      return this.txid !== "" || this.address !== "" || this.message !== "";
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
    }
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
    generate() {
      this.$v.txid.$touch();
      this.$v.address.$touch();

      if (this.$v.txid.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterTransactionId")
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

      this.$gateway.send("wallet", "prove_transaction", {
        txid: this.txid.trim(),
        address: this.address.trim(),
        message: this.message.trim()
      });
    },
    clear() {
      this.txid = "";
      this.address = "";
      this.message = "";
      this.$v.$reset();
    },
    copy() {
      clipboard.writeText(this.status.state.signature);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.signatureCopied")
      });
    }
  }
};
</script>

<style lang="scss">
.beldex-app .prove-transaction {
  .description {
    white-space: pre-line;
  }

  .signature-wrapper {
    margin-top: var(--beldex-space-5);
  }

  .signature {
    margin: var(--beldex-space-3) 0 0;
    color: var(--beldex-text); // beats app.styl `.prove-transaction .signature`
    padding: var(--beldex-space-3) var(--beldex-space-4);
    line-height: 18px;
    background-color: rgba(8, 8, 8, 0.8); // beats app.styl `#1c1c26`
    border: 1px solid var(--beldex-hairline);
    border-radius: var(--beldex-radius-none);
    font-size: var(--beldex-text-md);
    word-break: break-all;
    word-wrap: break-word;
    -webkit-user-select: all;
    user-select: all;
  }
}
</style>
