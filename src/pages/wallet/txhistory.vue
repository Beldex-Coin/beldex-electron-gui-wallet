<template>
  <q-page class="transactionBox" style="min-height: unset">
    <template v-if="this.tx_list.length === 0">
      <div
        class="col-2 ft-semibold txn-title q-ml-sm q-mt-sm"
        style="color: white"
      >
        {{ $t("titles.transactions") }}
      </div>
      <section
        class="flex column justify-center no-wrap items-center empty-txn-wrapper"
      >
        <div>
          <img src="../../assets/images/No_transaction.svg" height="119px" />
        </div>
        <p class="q-pb-md q-pt-sm q-mb-none qtab-desc ft-semibold infoTxt">
          {{ $t("strings.noTransactionsFound") }}
        </p>

        <div class="hint-txt">
          {{ this.$t("titles.swap.afterYourFirstTxn") }},
        </div>
        <div class="hint-txt">
          {{ this.$t("titles.swap.youWillBeViewHere") }}.
        </div>
      </section>
    </template>
    <section v-else-if="this.tx_list.length !== 0 && !this.txnDetails">
      <div
        class="row  q-pt-sm q-ml-md q-mb-lg items-center flex color-white justify-between no-wrap"
      >
        <div class="ft-semibold txn-title">
          {{ $t("titles.transactions") }}
        </div>
        <!-- <section class="searchBox flex row col-8">
          <article class="flex row items-center col-10"> -->
        <section class="searchBox flex row no-wrap">
          <article class="flex row items-center no-wrap  q-ml-lg">
            <div class="col-1 filter-txt ft-semibold q-mr-xs">
              {{ $t("fieldLabels.filter") }}
            </div>
            <OxenField class="col-11 q-px-sm q-pl-md color=#77778B;">
              <q-input
                v-model="tx_filter"
                :placeholder="$t('placeholders.filterTx')"
                borderless
                dense
              />
            </OxenField>
          </article>

          <!-- <OxenField class="col-2"> -->
          <OxenField class="grp-filter">
            <q-select
              v-model="tx_type"
              :options="tx_type_options"
              borderless
              dense
              emit-value
              map-options
              class="ft-semibold q-pa-xs"
              popup-content-class="txn-option"
              dropdown-icon="tune"
              :menu-offset="[100, 10]"
            />
          </OxenField>

          <q-btn
            v-if="this.tx_list.length > 0"
            color="primary"
            class="downloadCsv-btn"
            @click="downloadCsv"
          >
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="csv" clip-path="url(#clip0_1350_3876)">
                <path
                  id="Vector"
                  d="M9.98544 0.487509C9.47996 0.495267 9.07623 0.911228 9.08309 1.41671V9.37048L6.98121 7.2686C6.80873 7.09105 6.57151 6.99109 6.32414 6.99109C5.95115 6.99109 5.61546 7.21727 5.47491 7.56281C5.33467 7.90835 5.41762 8.30462 5.68498 8.56482L9.35165 12.2315C9.70972 12.5893 10.2898 12.5893 10.6479 12.2315L14.3145 8.56482C14.5541 8.33476 14.6505 7.99339 14.5667 7.67232C14.4831 7.35095 14.2322 7.1 13.9108 7.01645C13.5897 6.9326 13.2484 7.02899 13.0183 7.2686L10.9164 9.37048V1.41671C10.9197 1.16904 10.8227 0.930325 10.6473 0.755168C10.4721 0.580309 10.2331 0.483629 9.98544 0.487509ZM1.73544 11.5708C1.22996 11.5786 0.826231 11.9946 0.833094 12.5V14.3334C0.833094 15.3354 1.66442 16.1667 2.66643 16.1667H17.3331C18.3351 16.1667 19.1664 15.3354 19.1664 14.3334V12.5C19.1712 12.1694 18.9975 11.8621 18.712 11.6953C18.4264 11.5288 18.0731 11.5288 17.7875 11.6953C17.502 11.8621 17.3283 12.1694 17.3331 12.5V14.3334H2.66643V12.5C2.66971 12.2524 2.57273 12.0137 2.39728 11.8385C2.22212 11.6636 1.9831 11.567 1.73544 11.5708Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1350_3876">
                  <rect width="18" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </q-btn>
        </section>
      </div>

      <TxList
        :type="tx_type"
        :filter="tx_filter"
        @submitTxDetails="submitTxDetails($event)"
      />
    </section>
    <section v-else>
      <!-- <section > -->

      <TxDetails :tx="this.txnDetails" @goback="goback($event)" />
    </section>
  </q-page>
</template>
<script>
import { mapState } from "vuex";
import TxList from "components/tx_list";
import OxenField from "components/oxen_field";
import TxDetails from "components/tx_details";
const moment = require("moment");

export default {
  components: {
    TxList,
    OxenField,
    TxDetails
  },
  data() {
    return {
      tx_type: "all",
      tx_filter: "",
      txnDetails: ""
    };
  },
  methods: {
    submitTxDetails(details) {
      // this.$ref.txDetails.tx = details;
      this.txnDetails = details;
    },
    filterTxList(type) {
      const all_in = ["in", "pool", "miner", "mnode", "gov", "bns"];
      const all_out = ["out", "pending", "stake"];
      const all_pending = ["pending", "pool"];
      this.tx_list_filtered = this.tx_list.filter(tx => {
        let valid = true;
        if (type === "all_in" && !all_in.includes(tx.type)) {
          return false;
        }

        if (type === "all_out" && !all_out.includes(tx.type)) {
          return false;
        }

        if (type === "all_pending" && !all_pending.includes(tx.type)) {
          return false;
        }

        if (!type.startsWith("all") && type !== tx.type) {
          valid = false;
          return valid;
        }
        return valid;
      });
      return this.tx_list_filtered;
    },
    goback(data) {
      this.txnDetails = data;
    },
    downloadCsv() {
      let tx_list_filtered = this.filterTxList(this.tx_type);
      let customizeCsv = [];
      let csv = "";
      tx_list_filtered.length > 0 &&
        tx_list_filtered.map(item => {
          let csvObj = {};
          csvObj.Date = moment(item.timestamp * 1000).format(
            "DD MMM YYYY-h:mm:ss"
          );
          csvObj.Transaction_type = item.type;
          csvObj.Amount = item.amount / 1e9;
          csvObj.Fee = item.fee / 1e9;
          csvObj.Blockheight = item.height;
          csvObj.Transaction_id = item.txid;
          csvObj.payment_id =
            item.payment_id != "0000000000000000" ? item.payment_id : "N/A";
          customizeCsv.push(csvObj);
        });
      let header = true;
      for (let row = 0; row < customizeCsv.length; row++) {
        let keysAmount = Object.keys(customizeCsv[row]).length;
        let keysCounter = 0;
        // If this is the first row, generate the headings
        if (header) {
          // Loop each property of the object
          for (let key in customizeCsv[row]) {
            // This is to not add a comma at the last cell
            // The '\r\n' adds a new line
            csv += key + (keysCounter + 1 < keysAmount ? "," : "\r\n");
            header = false;
          }
          csv += "\r\n";
        }
        for (let key in customizeCsv[row]) {
          csv +=
            customizeCsv[row][key] +
            (keysCounter + 1 < keysAmount ? "," : "\r\n");
          keysCounter++;
        }
        keysCounter = 0;
      }
      const anchor = document.createElement("a");
      anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      anchor.target = "_blank";
      anchor.download = "beldex_wallet_transaction_history.csv";
      anchor.click();
    }
  },

  computed: {
    ...mapState({
      theme: state => state.gateway.app.config.appearance.theme,
      tx_list: state => state.gateway.wallet.transactions.tx_list
    }),

    tx_type_options() {
      return [
        { label: this.$t("strings.transactions.types.all"), value: "all" },
        { label: this.$t("strings.transactions.types.incoming"), value: "in" },
        { label: this.$t("strings.transactions.types.outgoing"), value: "out" },
        {
          label: this.$t("strings.transactions.types.pending"),
          value: "all_pending"
        },
        { label: this.$t("strings.transactions.types.miner"), value: "miner" },
        {
          label: this.$t("strings.transactions.types.masterNode"),
          value: "mnode"
        },
        {
          label: this.$t("strings.transactions.types.governance"),
          value: "gov"
        },
        { label: this.$t("strings.transactions.types.bns"), value: "bns" },
        { label: this.$t("strings.transactions.types.stake"), value: "stake" },
        { label: this.$t("strings.transactions.types.failed"), value: "failed" }
      ];
    }
  }
};
</script>

<style lang="scss">
.transactionBox {
  .q-select__dropdown-icon {
    font-size: 20px;
  }
  .grp-filter {
    &:not(.disable):not(.disable-hover) {
      .content:hover {
        // background: #1c1c26;
        background: #484866 !important;
        // border: unset;
      }
    }
  }
  .empty-txn-wrapper {
    // height: 39vh;
    height: calc(100vh - 464px);
  }
  @media only screen and (max-height: 780px) {
    .empty-txn-wrapper {
      // height: 32vh;
      height: calc(100vh - 468px);
    }
  }
}
.color-white {
  color: white;
}
.txn-title {
  font-size: 18px;
}
.filter-txt {
  font-size: 16px;
}
.searchBox .oxen-field .content {
  min-height: 58px !important;
  height: 58px !important;
  background-color: #32324a;
  margin-bottom: unset !important;
}
.infoTxt {
  color: white;
}
.hint-txt {
  color: #82828d;
}
.txn-option {
  width: 155px;
  font-family: "Poppins-Regular";
}
</style>
