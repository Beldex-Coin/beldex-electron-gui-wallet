<template>
  <!-- Update BNS. Handlers are unchanged. -->
  <q-page class="update-bns-page" style="min-height: unset">
    <div class="bns-update__head">
      <button
        type="button"
        class="beldex-square-btn bns-update__back"
        :aria-label="$t('buttons.back')"
        @click="onBackBtn()"
      >
        <img src="~assets/icons/arrow-left-muted.svg" alt="" />
      </button>
      <h3 class="bns-update__title">
        {{ $t("buttons.bnsUpdate") }}
        <span
          v-if="currentRecord && currentRecord.name"
          class="bns-update__name"
          >· {{ currentRecord.name }}.bdx</span
        >
      </h3>
    </div>
    <div class="bns-input">
      <BNSUpdateInputForm
        ref="form"
        :current-record="currentRecord"
        @onSubmit="onSubmit"
      />
      <q-dialog v-model="confirmModal.open">
        <q-card class="beldex-dialog">
          <div class="beldex-dialog__head">
            <div class="beldex-dialog__icon">
              <img src="~assets/icons/dialog-send.svg" alt="" />
            </div>
            <div>
              <h2 class="beldex-dialog__title">
                {{ $t("dialog.confirmUpdate.title") }}
              </h2>
            </div>
          </div>
          <div class="beldex-dialog__body">
            <div class="beldex-dialog__kv">
              <span class="beldex-dialog__kv-label">{{
                $t("fieldLabels.name")
              }}</span>
              <span
                class="bns-confirm__value beldex-dialog__kv-value--strong"
                >{{ confirmModal.record.name }}</span
              >
            </div>
            <div v-if="confirmModal.record.owner" class="beldex-dialog__kv">
              <span class="beldex-dialog__kv-label">{{
                $t("fieldLabels.owner")
              }}</span>
              <span class="bns-confirm__value">{{
                confirmModal.record.owner
              }}</span>
            </div>
            <div
              v-if="confirmModal.record.value_wallet"
              class="beldex-dialog__kv"
            >
              <span class="beldex-dialog__kv-label">{{
                $t("fieldLabels.address")
              }}</span>
              <span class="bns-confirm__value">{{
                confirmModal.record.value_wallet
              }}</span>
            </div>
            <div
              v-if="confirmModal.record.value_bchat"
              class="beldex-dialog__kv"
            >
              <span class="beldex-dialog__kv-label">BChat ID</span>
              <span class="bns-confirm__value">{{
                confirmModal.record.value_bchat
              }}</span>
            </div>
            <div
              v-if="confirmModal.record.value_belnet"
              class="beldex-dialog__kv"
            >
              <span class="beldex-dialog__kv-label">Belnet ID</span>
              <span class="bns-confirm__value">{{
                confirmModal.record.value_belnet
              }}</span>
            </div>
            <div
              v-if="confirmModal.record.value_eth_addr"
              class="beldex-dialog__kv"
            >
              <span class="beldex-dialog__kv-label">ETH</span>
              <span class="bns-confirm__value">{{
                confirmModal.record.value_eth_addr
              }}</span>
            </div>
          </div>
          <div class="beldex-dialog__actions">
            <q-btn
              v-close-popup
              class="beldex-btn beldex-btn--ghost"
              unelevated
              no-caps
              :label="$t('buttons.cancel')"
            />
            <q-btn
              v-close-popup
              class="beldex-btn"
              unelevated
              no-caps
              :label="$t('dialog.confirmUpdate.ok')"
              @click="update(confirmModal.record)"
            />
          </div>
        </q-card>
      </q-dialog>
      <q-inner-loading :showing="bns_status.sending" dark>
        <beldex-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import BNSUpdateInputForm from "./bns_update_input_form";
import WalletPassword from "src/mixins/wallet_password";
import objectAssignDeep from "object-assign-deep";

export default {
  name: "BNSUpdate",
  components: {
    BNSUpdateInputForm
  },
  mixins: [WalletPassword],
  props: {
    currentRecord: {
      // type: Object,
      required: false,
      default: false
    },
    onBack: {
      required: false
    }
  },

  data() {
    return {
      confirmModal: {
        open: false,
        record: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    bns_status: state => state.gateway.bns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance
  }),

  watch: {
    bns_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.onBackBtn();
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            // this.onBackBtn();
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    onSubmit(record) {
      this.confirmModal = {
        ...this.confirmModal,
        open: true,
        record: record
      };
    },
    onBackBtn() {
      this.$emit("onBack", "");
    },
    async update(record) {
      const updatedRecord = {
        ...record
      };
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.bnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.bnsUpdate.message"),
        ok: {
          label: this.$t("dialog.bnsUpdate.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.cancel")
        },
        color: "#010101"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_bns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const bns = objectAssignDeep.noMutate(updatedRecord, {
            password
          });
          this.$gateway.send("wallet", "update_bns_mapping", bns);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.beldex-app .update-bns-page {
  min-height: 0 !important; // beats q-page's inline min-height
  // app.styl / old rule: purple card
  background-color: transparent;
  border-radius: 0;

  .bns-input {
    position: relative;
    height: auto;
    overflow-y: visible;
  }
}

.beldex-app .bns-update {
  &__head {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    margin-bottom: var(--beldex-space-5);
  }

  &__back {
    width: 28px;
    height: 28px;
    border-color: var(--beldex-border);
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: -0.35px;
    color: var(--beldex-text);
  }

  &__name {
    color: var(--beldex-text-muted);
  }
}
</style>
