<template>
  <div class="sign-and-verify ">
    <div class="q-pa-md">
      <div class="beldex-hint beldex-form-desc">
        {{ $t("strings.signAndVerifyDescription") }}
      </div>
      <div v-if="is_view_only" class="beldex-hint">
        {{ $t("strings.cannotSign") }}
      </div>
      <div v-else class="beldex-box">
        <h3 class="beldex-box__title">{{ $t("titles.advanced.sign") }}</h3>
        <div class="beldex-box__row">
          <BeldexField>
            <q-input
              v-model.trim="toSign"
              borderless
              dense
              :aria-label="$t('fieldLabels.data')"
              :placeholder="$t('placeholders.dataToSign')"
            />
          </BeldexField>
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :loading="sign_status.sending"
            :disable="!toSign"
            @click="sign()"
          >
            <img src="~assets/icons/proof-sign.svg" alt="" />
            {{ $t("titles.advanced.sign") }}
          </q-btn>
        </div>
      </div>
      <div class="beldex-box">
        <h3 class="beldex-box__title">{{ $t("titles.advanced.verify") }}</h3>
        <BeldexField :label="$t('fieldLabels.signature')">
          <q-input
            v-model.trim="signatureToVerify"
            borderless
            dense
            :placeholder="$t('placeholders.pasteSignature')"
          />
        </BeldexField>
        <BeldexField :label="$t('fieldLabels.address')">
          <q-input
            v-model.trim="address"
            borderless
            dense
            :placeholder="$t('placeholders.signerAddress')"
          />
        </BeldexField>
        <BeldexField :label="$t('fieldLabels.data')">
          <q-input
            v-model.trim="unsignedData"
            borderless
            dense
            :placeholder="$t('placeholders.dataThatWasSigned')"
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
            :disable="!signatureToVerify || !unsignedData || !address"
            @click="verify()"
          >
            <img src="~assets/icons/proof-check.svg" alt="" />
            {{ $t("titles.advanced.verify") }}
          </q-btn>
        </div>
        <SignatureDialog
          :on-copy-signature="copySignature"
          :on-copy-unsigned-data="copyUnsignedData"
          :on-copy-address="copyAddress"
          :on-close="closeDialog"
          :signature="signature"
          :unsigned-data="toSign"
          :address="primary_address"
          :show="!!signature"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import BeldexField from "components/beldex_field";
import SignatureDialog from "./signature_dialog";
import { mapState } from "vuex";
export default {
  name: "SignAndVerify",
  components: {
    BeldexField,
    SignatureDialog
  },
  data() {
    return {
      toSign: "",
      // entered by the user to verify
      signatureToVerify: "",
      unsignedData: "",
      address: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    sign_status: state => state.gateway.sign_status,
    verify_status: state => state.gateway.verify_status,
    signature: state => state.gateway.sign_status.signature,
    primary_address: state => state.gateway.wallet.info.address,
    is_view_only: state => state.gateway.wallet.info.view_only,
    canClear() {
      const canClear =
        this.signatureToVerify !== "" ||
        this.address !== "" ||
        this.unsignedData !== "";
      return canClear;
    }
  }),
  watch: {
    sign_status: {
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
    },
    verify_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message, i18n } = val;
        switch (code) {
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message: i18n ? this.$t(i18n) : message
            });
            break;
          case 1:
            this.$q.notify({
              type: "positive",
              timeout: 3000,
              message: i18n ? this.$t(i18n) : message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    sign() {
      this.$gateway.send("wallet", "sign", { data: this.toSign });
    },
    verify() {
      this.$gateway.send("wallet", "verify", {
        address: this.address,
        data: this.unsignedData,
        signature: this.signatureToVerify
      });
    },
    copySignature() {
      clipboard.writeText(this.signature);
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message: this.$t("notification.positive.signatureCopied")
      });
    },
    // copy from the dialog
    copyUnsignedData() {
      clipboard.writeText(this.toSign);
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message: this.$t("notification.positive.copied", { item: "Data" })
      });
    },
    copyAddress() {
      clipboard.writeText(this.primary_address);
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message: this.$t("notification.positive.addressCopied")
      });
    },
    closeDialog() {
      this.$store.commit("gateway/set_sign_status", {
        signature: ""
      });
    },
    clear() {
      this.signatureToVerify = "";
      this.unsignedData = "";
      this.address = "";
    }
  }
};
</script>

<style lang="scss">
.beldex-app .sign-and-verify {
  .q-item {
    cursor: default;
  }

  .beldex-box__row .beldex-field {
    flex: 1;
  }
}
</style>
