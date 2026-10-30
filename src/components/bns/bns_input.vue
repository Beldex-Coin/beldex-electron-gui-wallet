<template>
  <div class="bns-input">
    <BNSInputForm
      ref="form"
      :submit-label="submit_label"
      :disable-name="updating || renewing"
      :updating="updating"
      :renewing="renewing"
      :show-clear-button="updating || renewing"
      :disable-submit-button="disable_submit_button"
      @onSubmit="onSubmit"
      @onClear="onClear"
      @onSummary="$emit('onSummary', $event)"
    />
    <!-- Confirm purchase -->
    <q-dialog v-model="confirmModal.open">
      <q-card class="beldex-dialog">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <img src="~assets/icons/dialog-send.svg" alt="" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("dialog.confirmPurchase.title") }}
            </h2>
          </div>
        </div>
        <div class="beldex-dialog__body">
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.name")
            }}</span>
            <span class="bns-confirm__value beldex-dialog__kv-value--strong">{{
              confirmModal.record.name
            }}</span>
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.year")
            }}</span>
            <span class="bns-confirm__value">{{
              yearvalidate(confirmModal.record.years)
            }}</span>
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
          <div v-if="confirmModal.record.value_bchat" class="beldex-dialog__kv">
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
            :label="$t('dialog.confirmPurchase.ok')"
            @click="purchase()"
          />
        </div>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="bns_status.sending" dark>
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BNSInputForm from "./bns_input_form";
import WalletPassword from "src/mixins/wallet_password";
import objectAssignDeep from "object-assign-deep";

export default {
  name: "BNSInput",
  components: {
    BNSInputForm
  },
  mixins: [WalletPassword],
  data() {
    return {
      updating: false,
      renewing: false,
      confirmModal: {
        open: false,
        record: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    bns_status: state => state.gateway.bns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    disable_submit_button() {
      const minBalance = this.updating ? 0.05 : 21;
      return this.unlocked_balance < minBalance * 1e9;
    },
    submit_label() {
      let label = "buttons.purchase";
      if (this.updating) {
        label = "buttons.update";
      } else if (this.renewing) {
        label = "buttons.renew";
      }
      return this.$t(label);
    }
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
            this.$refs.form.reset();
            this.renewing = false;
            this.updating = false;
            break;
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
    startUpdating(record) {
      this.$refs.form.setRecord(record);
      this.updating = true;
    },
    startRenewing(record) {
      this.renewing = true;
      // set the type such that we default to one year
      let renewRecord = {
        ...record,
        type: "belnet_1y"
      };
      this.$refs.form.setRecord(renewRecord);
    },
    yearvalidate(year) {
      let content = year && year.slice(0, year.indexOf("y"));
      return content && content > 1
        ? content + " years"
        : content + " " + this.$t("fieldLabels.year");
    },
    onSubmit(record) {
      if (this.updating) {
        this.update(record);
      } else if (this.renewing) {
        this.renew(record);
      } else {
        this.confirmModal = {
          ...this.confirmModal,
          open: true,
          record: record
        };
      }
    },
    onClear() {
      this.$refs.form.reset();
      this.updating = false;
      this.renewing = false;
    },
    async update(record) {
      const updatedRecord = {
        ...record,
        value: record.value,
        owner: record.owner
        // backup_owner: record.backup_owner
      };

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.bnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.bnsUpdate.message"),
        ok: {
          label: this.$t("dialog.bnsUpdate.ok"),
          color: "primary"
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
    },
    async purchase() {
      let record = this.confirmModal.record;
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.purchase.title"),
        noPasswordMessage: this.$t("dialog.purchase.message"),
        ok: {
          label: this.$t("dialog.purchase.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.cancel")
        }
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
          const bns = objectAssignDeep.noMutate(record, {
            password
          });
          this.$gateway.send("wallet", "purchase_bns", bns);
          this.confirmModal = { ...this.confirmModal, open: false, record: "" };
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async renew(record) {
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.renew.title"),
        noPasswordMessage: this.$t("dialog.renew.message"),
        ok: {
          label: this.$t("dialog.renew.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_bns_status", {
            code: 1,
            message: "Sending renew mapping transaction",
            sending: true
          });
          const params = {
            type: record.type,
            name: record.name,
            password
          };
          this.$gateway.send("wallet", "bns_renew_mapping", params);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.beldex-app .bns-confirm__value {
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
}
</style>
