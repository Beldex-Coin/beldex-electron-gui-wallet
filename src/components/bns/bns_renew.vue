<template>
  <div class="bns-renew-input-form">
    <div class="bns-update__head">
      <button
        type="button"
        class="beldex-square-btn bns-update__back"
        :aria-label="$t('buttons.back')"
        @click="onBackBtn()"
      >
        <span class="beldex-icon-btn__glyph">←</span>
      </button>
      <h3 class="bns-update__title">
        {{ $t("buttons.renew") }}
        <span
          v-if="currentRecord && currentRecord.name"
          class="bns-update__name"
          >·
          {{
            currentRecord.name.endsWith(".bdx")
              ? currentRecord.name
              : currentRecord.name + ".bdx"
          }}</span
        >
      </h3>
      <span class="beldex-hint bns-update__hint">
        <img src="~assets/icons/at-sign.svg" alt="" />
        {{ $t("strings.bnsServiceHint") }}
      </span>
    </div>
    <div class="bns-form__block">
      <span class="beldex-label">{{ $t("strings.bns.duration") }}</span>
      <div class="bns-form__durations">
        <button
          v-for="item in typeOptions"
          :key="item.type"
          type="button"
          class="bns-form__duration"
          :class="{ 'bns-form__duration--on': renewYear == item.value }"
          @click="renewYear = item.value"
        >
          <span class="bns-form__duration-label">{{ item.label }}</span>
          <span class="bns-form__duration-amount">{{ item.amount }}</span>
        </button>
      </div>
    </div>

    <!-- Name -->
    <div class="bns-form__block">
      <BeldexField :label="$t('fieldLabels.name')" disable-hover>
        <q-input
          v-model.trim="currentRecord.name"
          dark
          maxlength="67"
          :placeholder="$t('placeholders.bnsName')"
          readonly
          borderless
          dense
          :suffix="'.bdx'"
        />
      </BeldexField>
    </div>

    <div class="bns-renew__note">
      <img src="~assets/icons/note-info.svg" alt="" />
      <p>{{ $t("strings.bnsRenewExtendNote") }}</p>
    </div>

    <div class="beldex-form-actions">
      <q-btn
        class="beldex-btn"
        unelevated
        no-caps
        :disable="!is_ready"
        @click="handlePopup(currentRecord)"
      >
        <img class="bns-renew__btn-icon" src="~assets/icons/renew.svg" alt="" />
        {{ $t("buttons.renew") }}
      </q-btn>
    </div>

    <!-- Confirm renew -->
    <q-dialog v-model="confirmModal.open">
      <q-card class="beldex-dialog bns-renew-confirm">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <img src="~assets/icons/dialog-send.svg" alt="" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("dialog.confirmRenew.title") }}
            </h2>
          </div>
        </div>
        <div class="beldex-dialog__body">
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.name")
            }}</span>
            <span class="bns-confirm__value beldex-dialog__kv-value--strong"
              >{{ confirmModal.record.name }}.bdx</span
            >
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.year")
            }}</span>
            <span class="bns-confirm__value">{{ renewYear }}</span>
          </div>
          <div v-if="confirmModal.record.owner" class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("fieldLabels.owner")
            }}</span>
            <span class="bns-confirm__value bns-confirm__value--address">{{
              confirmModal.record.owner
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
            @click="submit()"
          >
            <img
              class="bns-renew__btn-icon"
              src="~assets/icons/renew.svg"
              alt=""
            />
            {{ $t("dialog.confirmRenew.ok") }}
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
import BeldexField from "components/beldex_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSRenew",
  components: {
    BeldexField
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
    let belnetOptions = [
      {
        label: "1 Year",
        value: "1y",
        amount: "650 BDX"
      },
      {
        label: "2 Years",
        value: "2y",
        amount: "1000 BDX"
      },
      {
        label: "5 Years",
        value: "5y",
        amount: "2000 BDX"
      },
      {
        label: "10 Years",
        value: "10y",
        amount: "4000 BDX"
      }
    ];
    let typeOptions = [...belnetOptions];

    return {
      renewYear: "1y",
      typeOptions,
      belnetOptions,
      confirmModal: {
        open: false,
        record: ""
      },
      idsValidation: false
    };
  },

  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    our_address: state => state.gateway.wallet.info.address,
    info: state => state.gateway.wallet.info,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    bns_status: state => state.gateway.bns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,

    cleanRecord() {
      return {
        years: this.typeOptions[0].value
      };
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
            this.onBackBtn();
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
    handlePopup(record) {
      this.confirmModal = {
        ...this.confirmModal,
        open: true,
        record: record
      };
    },
    onBackBtn() {
      this.$emit("onBack", "");
    },
    submit() {
      // The validators validate on lowercase, need to submit as lowercase too
      const submitRecord = {
        name: this.currentRecord.name.toLowerCase() + ".bdx",
        years: this.renewYear
      };
      this.renew(submitRecord);
    },
    async renew(record) {
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.renew.title"),
        noPasswordMessage: this.$t("dialog.renew.message"),
        ok: {
          label: this.$t("dialog.renew.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.cancel")
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
            message: this.$t("strings.progress.sendingRenewMapping"),
            sending: true
          });
          const params = {
            ...record,
            password
          };
          this.$gateway.send("wallet", "bns_renew_mapping", params);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    clear() {
      this.$emit("onClear");
    }
  }
};
</script>

<style lang="scss">
.beldex-app .bns-renew-input-form {
  // Not positioned on purpose: the loading overlay should cover the whole
  // .bns-page__main card, not just this form.
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);
  height: auto;
  overflow-y: visible;

  .bns-renew__note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    font-size: var(--beldex-text-sm);
    line-height: 17px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);

    img {
      flex: 0 0 auto;
      margin-top: 2px;
    }

    p {
      margin: 0;
    }
  }
}

// Long owner addresses wrap instead of widening the dialog.
.beldex-app .beldex-dialog.bns-renew-confirm {
  overflow-x: hidden;

  .beldex-dialog__kv-label {
    flex-shrink: 0;
  }

  .bns-confirm__value {
    min-width: 0;
    text-align: left;
    overflow-wrap: anywhere;
    word-break: break-all;
  }

  // Cap the width so a 97-char address wraps onto three lines (~33 chars each).
  .bns-confirm__value--address {
    flex: 0 0 auto;
    width: 34ch;
    max-width: 100%;
  }
}

// Shared by the form button and the (portaled) confirm dialog button.
.beldex-app .bns-renew__btn-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}
</style>
