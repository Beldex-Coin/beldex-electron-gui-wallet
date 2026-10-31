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
      @onSummary="onSummary"
    />
    <!-- Confirm purchase (frame 421:18657) -->
    <q-dialog v-model="confirmModal.open">
      <q-card class="beldex-dialog bns-confirm">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <img src="~assets/icons/dialog-tag.svg" alt="" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("dialog.confirmPurchase.title") }}
            </h2>
            <p class="beldex-dialog__subtitle">
              {{ $t("dialog.confirmPurchase.message") }}
            </p>
          </div>
        </div>
        <div class="bns-confirm__details">
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.name")
            }}</span>
            <span class="bns-confirm__value bns-confirm__value--accent">{{
              confirmModal.record.name
            }}</span>
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("strings.bns.duration")
            }}</span>
            <span class="bns-confirm__value">{{
              confirmModal.summary.duration
            }}</span>
          </div>
          <div
            v-for="row in confirmRows"
            :key="row.label"
            class="beldex-dialog__kv"
          >
            <span class="beldex-dialog__kv-label">{{ row.label }}</span>
            <span class="bns-confirm__value" :title="row.value">{{
              shorten(row.value)
            }}</span>
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("strings.total")
            }}</span>
            <span class="bns-confirm__value beldex-dialog__kv-value--strong"
              >{{ confirmModal.summary.price }} BDX</span
            >
          </div>
        </div>
        <div class="beldex-dialog__actions">
          <q-btn
            v-close-popup
            class="beldex-btn beldex-btn--ghost bns-confirm__cancel"
            unelevated
            no-caps
            :label="$t('buttons.cancel')"
          />
          <q-btn
            v-close-popup
            class="beldex-btn bns-confirm__pay"
            unelevated
            no-caps
            @click="purchase()"
          >
            <img src="~assets/icons/btn-check.svg" alt="" />
            {{ $t("dialog.confirmPurchase.ok") }}
          </q-btn>
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
      summary: {},
      confirmModal: {
        open: false,
        record: "",
        summary: {}
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
    },
    // Optional record fields, shown only when filled in.
    confirmRows() {
      const record = this.confirmModal.record || {};
      return [
        { label: this.$t("fieldLabels.owner"), value: record.owner },
        {
          label: this.$t("fieldLabels.backupOwner"),
          value: record.backup_owner
        },
        { label: this.$t("fieldLabels.address"), value: record.value_wallet },
        { label: "BChat ID", value: record.value_bchat },
        { label: "Belnet ID", value: record.value_belnet },
        { label: "ETH", value: record.value_eth_addr }
      ].filter(row => row.value);
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
    onSummary(summary) {
      this.summary = summary;
      this.$emit("onSummary", summary);
    },
    // Middle-ellipsis long keys/addresses; the full value is in the title.
    shorten(value) {
      return value.length > 28
        ? value.slice(0, 20) + "…" + value.slice(-7)
        : value;
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
          record: record,
          summary: this.summary
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
          this.confirmModal = {
            ...this.confirmModal,
            open: false,
            record: "",
            summary: {}
          };
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
// Frame 421:18657.
.beldex-app .beldex-dialog.bns-confirm {
  width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--beldex-space-7);

  .bns-confirm__details {
    margin-top: var(--beldex-space-5);
    line-height: 16px;
  }

  .bns-confirm__value {
    min-width: 0;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &--accent {
      color: var(--beldex-accent);
    }
  }

  .beldex-dialog__actions .bns-confirm__cancel {
    font-family: var(--beldex-font-mono);
    font-weight: 700;
  }

  .beldex-dialog__actions .bns-confirm__pay {
    letter-spacing: 0.3px;
    text-transform: uppercase;

    .q-btn__content {
      gap: var(--beldex-space-2);
    }

    img {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
