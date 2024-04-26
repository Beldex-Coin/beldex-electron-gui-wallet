<template>
  <div class="bns-renew-input-form">
    <div class="flex items-center back-btn-wrapper">
      <q-btn
        icon="arrow_circle_left"
        color="white"
        style="font-size: 24px; width: 50px; height: 50px"
        flat
        @click="onBackBtn()"
      />
      <div class="back-btn-label">{{ $t("buttons.bnsRenew") }}</div>
    </div>
    <div class="prices">
      <span class="pricelabel">
        <span class="bnsname ">BNS</span>
        {{ $t("strings.bns.prices") }}
      </span>
      <section class="flex row no-wrap q-mt-xs q-gutter-sm">
        <div
          v-for="item in typeOptions"
          :key="item.type"
          :class="[renewYear == item.value ? 'selected' : '']"
          class="flex row tag items-center justify-between no-wrap"
          @click="renewYear = item.value"
        >
          <div>{{ item.label }}</div>
          <div class="amount">{{ item.amount }}</div>
        </div>
      </section>
    </div>

    <!-- Name -->
    <div class="col q-mt-sm">
      <OxenField :label="$t('fieldLabels.name')" :disable="true">
        <q-input
          v-model.trim="currentRecord.name"
          :dark="theme == 'dark'"
          maxlength="67"
          :placeholder="$t('placeholders.bnsName')"
          :disable="true"
          borderless
          dense
          :suffix="'.bdx'"
        />
      </OxenField>
    </div>

    <div class="buttons-wrapper flex justify-center items-end q-mt-sm">
      <q-btn
        color="primary"
        class="q-mt-lg q-ml-sm updation-btn"
        :disable="!is_ready"
        @click="handlePopup(currentRecord)"
      >
        <img
          src="../../assets/images/renew.svg"
          alt="Update"
          style="height: 24px; width: auto ;margin-right:5px;"
        />
        {{ $t("buttons.renew") }}
      </q-btn>
    </div>

    <!--  ---------------------------------------confirm popup ------------------------------------------------->

    <q-dialog v-model="confirmModal.open">
      <q-card class="bnsConfirmmodal">
        <q-card-section>
          <div class="text-h6 text-center" style="font-weight: 600">
            Confirm Renew
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none ownerDetails q-mx-lg q-pa-md">
          <section>
            <div class="tablewrapper flex row">
              <div class="label">Name</div>
              <div class="content">{{ this.confirmModal.record.name }}.bdx</div>
            </div>
            <div class="tablewrapper flex row q-mt-md">
              <div class="label">year</div>
              <div class="address">
                {{ renewYear }}
              </div>
            </div>
            <div
              v-if="this.confirmModal.record.owner"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">Owner</div>
              <div class="address">
                {{ this.confirmModal.record.owner }}
              </div>
            </div>
          </section>
        </q-card-section>

        <div class="buttons flex justify-center q-mt-sm q-mb-md">
          <q-btn
            v-close-popup
            class="q-mr-md"
            color="accent"
            :label="$t('buttons.cancel')"
          />
          <q-btn v-close-popup color="primary" label="ok" @click="submit()" />
        </div>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="bns_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>
<script>
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSRenew",
  components: {
    OxenField
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
        label: "1 yr",
        value: "1y",
        amount: "650 bdx"
      },
      {
        label: "2 yrs",
        value: "2y",
        amount: "1000 bdx"
      },
      {
        label: "5 yrs",
        value: "5y",
        amount: "2000 bdx"
      },
      {
        label: "10 yrs",
        value: "10y",
        amount: "4000 bdx"
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
            message: "Sending renew mapping transaction",
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
.bns-renew-input-form {
  // .bns-input {
  height: calc(100vh - 430px);
  overflow-y: auto;

  .buttons-wrapper {
    height: calc(100vh - 752px);
  }
  .bnsname {
    color: #20d030;
  }
  // }
  .prices,
  .idSelectorWrapper {
    // oxen-navy
    margin-top: 20px;
    background-color: #32324a;
    padding: 15px;
    color: white;
    border-radius: 10px;

    .selected {
      border: 2px solid #00ad07;
      background: #474764;
    }
  }
  .pricelabel {
    font-weight: 600;
    font-size: 16px;
  }
  .tag {
    width: 23.7%;
    height: 50px;
    background-color: #40405d;
    border-radius: 10px;
    padding: 10px;
    font-weight: 500;
    border: 2px solid #32324a;
    font-size: 12px;
    cursor: pointer;
    .amount {
      background-color: #484866;
      color: #20d030;
      padding: 3px 5px;
      border-radius: 4px;
      font-weight: 600;
    }
  }

  .idSelectorWrapper {
    .selectionBox {
      background-color: #474766;
      border-radius: 10px;
      border: 2px solid #474766;
    }
  }
}
</style>
