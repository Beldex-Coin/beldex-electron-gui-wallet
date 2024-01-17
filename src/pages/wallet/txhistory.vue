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
          <article
            class="flex row items-center no-wrap  q-ml-lg"
            style="width:80%; "
          >
            <div class="col-1 filter-txt ft-semibold">
              {{ $t("fieldLabels.filter") }}
            </div>
            <OxenField class="col-11 q-px-sm q-pl-lg color=#77778B;">
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
      txnDetails: "",
      tx_type_options: [
        {
          label: this.$t("strings.transactions.types.all"),
          value: "all"
        },
        {
          label: this.$t("strings.transactions.types.incoming"),
          value: "in"
        },
        {
          label: this.$t("strings.transactions.types.outgoing"),
          value: "out"
        },
        {
          label: this.$t("strings.transactions.types.pending"),
          value: "all_pending"
        },
        {
          label: this.$t("strings.transactions.types.miner"),
          value: "miner"
        },
        {
          label: this.$t("strings.transactions.types.masterNode"),
          value: "mnode"
        },
        {
          label: this.$t("strings.transactions.types.governance"),
          value: "gov"
        },
        {
          label: this.$t("strings.transactions.types.stake"),
          value: "stake"
        },
        {
          label: this.$t("strings.transactions.types.failed"),
          value: "failed"
        }
      ]
    };
  },
  methods: {
    submitTxDetails(details) {
      // this.$ref.txDetails.tx = details;
      this.txnDetails = details;
    },
    goback(data) {
      this.txnDetails = data;
    }
  },

  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    tx_list: state => state.gateway.wallet.transactions.tx_list
  })
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
