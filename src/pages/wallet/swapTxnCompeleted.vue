<template>
  <div class="SwapTxnCompeleted">
    <header class="swapDetails__head">
      <div class="swapDetails__title-wrap">
        <q-btn
          v-if="from === 'history'"
          flat
          dense
          icon="arrow_back"
          class="swapDetails__back"
          :aria-label="$t('buttons.back')"
          @click="$emit('goback')"
        />
        <span class="swapDetails__status-icon swapDetails__status-icon--ok">
          <q-icon name="check" size="16px" />
        </span>
        <h2 class="swapDetails__title">
          {{ $t("titles.swap.completed") }}
        </h2>
        <span class="swapDetails__id">
          <span class="swapDetails__id-label"
            >{{ $t("titles.swap.transactionID") }}:</span
          >
          <span class="swapDetails__id-value">{{ txnStatus.id }}</span>
          <q-btn
            flat
            dense
            size="xs"
            icon="content_copy"
            class="swapDetails__id-copy"
            @click="copyAddress(txnStatus.id)"
          />
        </span>
      </div>
      <div class="beldex-segmented" role="tablist">
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item beldex-segmented__item--active"
          aria-selected="true"
          @click="$emit(from === 'history' ? 'backToSwap' : 'newTxn')"
        >
          <span class="beldex-segmented__dot" />
          {{ $t("titles.swap.exchange") }}
        </button>
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item"
          aria-selected="false"
          @click="$emit(from === 'history' ? 'goback' : 'openHistory')"
        >
          {{ $t("titles.swap.history") }}
        </button>
      </div>
    </header>

    <section class="swapDetails__body">
      <div class="swapDetails__amounts">
        <div class="swapDetails__tile">
          <div class="swapDetails__label">{{ $t("fieldLabels.amount") }}</div>
          <div class="swapDetails__amount">
            {{ txnStatus.amountExpectedFrom }}
            <span class="uppercase">{{ txnStatus.currencyFrom }}</span>
          </div>
        </div>
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.amountTo") }}
          </div>
          <div class="swapDetails__amount swapDetails__amount--accent">
            {{ txnStatus.amountExpectedTo }}
            <span class="uppercase">{{ txnStatus.currencyTo }}</span>
          </div>
        </div>
      </div>

      <div class="swapDetails__amounts">
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.amountReceived") }}
          </div>
          <div class="swapDetails__value">
            {{
              formatTxnDate(
                txnStatus.moneyReceived ||
                  txnStatus.createdAt ||
                  txnStatus.created_at
              )
            }}
          </div>
        </div>
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.amountSend") }}
          </div>
          <div class="swapDetails__value">
            {{
              formatTxnDate(
                txnStatus.moneySent ||
                  txnStatus.createdAt ||
                  txnStatus.created_at
              )
            }}
          </div>
        </div>
      </div>

      <div class="swapDetails__amounts">
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.exchangeRate") }}
          </div>
          <div class="swapDetails__value">
            1
            <span class="uppercase">{{ txnStatus.currencyFrom }}</span>
            ≈ {{ txnStatus.rate }}
            <span class="uppercase">{{ txnStatus.currencyTo }}</span>
          </div>
        </div>
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.networkFee") }}
          </div>
          <div class="swapDetails__value">
            {{ txnStatus.networkFee }}
            <span class="uppercase">{{ txnStatus.currencyTo }}</span>
          </div>
        </div>
      </div>

      <div class="swapDetails__row">
        <div>
          <div class="swapDetails__label">
            {{ $t("fieldLabels.recipientAddress") }}
          </div>
          <div class="swapDetails__address">
            <span>{{ txnStatus.payoutAddress }}</span>
          </div>
        </div>
        <div v-if="txnStatus.payoutExtraId">
          <div class="swapDetails__label">
            {{ txnStatus.payoutExtraIdName || "Memo" }}
          </div>
          <div class="swapDetails__address">
            <span>{{ txnStatus.payoutExtraId }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="swapDetails__actions swapDetails__actions--split">
      <div class="swapDetails__hashes">
        <q-btn
          icon="open_in_new"
          :label="$t('titles.swap.inputHash')"
          class="beldex-btn beldex-btn--ghost swapDetails__hash"
          unelevated
          no-caps
          @click="inputHash(txnStatus.payinHash)"
        />
        <q-btn
          icon="open_in_new"
          :label="$t('titles.swap.outputHash')"
          class="beldex-btn beldex-btn--ghost swapDetails__hash"
          unelevated
          no-caps
          @click="outputHash(txnStatus.payoutHashLink)"
        />
      </div>
      <div class="swapDetails__hashes">
        <q-btn
          :label="$t('titles.swap.openHistory')"
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          @click="$emit(from === 'history' ? 'goback' : 'openHistory')"
        />
        <q-btn
          icon="add"
          :label="$t('titles.swap.newTransactionBtn')"
          class="beldex-btn"
          unelevated
          no-caps
          @click="$emit(from === 'history' ? 'backToSwap' : 'newTxn')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "SwapTxnCompeleted",
  components: {},
  props: {
    openHistory: {
      type: Function,
      required: false
    },
    newTxn: {
      type: Function,
      required: false
    },
    txnStatus: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: false,
      default: undefined
    },
    goback: {
      type: Function,
      required: false
    }
  },

  data() {
    return {
      isVisible: true,
      momentdate: moment
    };
  },
  inject: {
    setSwapPreview: { default: null }
  },
  computed: mapState({
    Currencylist: state => state.gateway.currencyList.result
  }),

  watch: {
    txnStatus: {
      immediate: true,
      handler() {
        this.publishPreview();
      }
    }
  },

  beforeDestroy() {
    if (this.setSwapPreview) this.setSwapPreview(null);
  },

  methods: {
    // Fills the Transaction preview side panel from this order.
    publishPreview() {
      if (!this.setSwapPreview || !this.txnStatus) return;
      const t = this.txnStatus;
      const rate = Number(t.rate);
      const fee = Number(t.networkFee);
      this.setSwapPreview({
        compact: true,
        from: t.currencyFrom || "",
        to: t.currencyTo || "",
        amountFrom: t.amountExpectedFrom > 0 ? t.amountExpectedFrom : 0,
        rate: isNaN(rate) || !rate ? "--" : rate.toFixed(8),
        networkFee: isNaN(fee) || t.networkFee == null ? "" : fee.toFixed(8),
        amountTo: t.amountExpectedTo,
        status: this.$t("titles.swap.statusCompleted")
      });
    },
    formatTxnDate(value) {
      if (!value) {
        value = this.txnStatus?.createdAt || this.txnStatus?.created_at;
      }
      if (!value) return "N/A";
      let date;
      if (typeof value === "string" && isNaN(value)) {
        date = new Date(value);
      } else {
        let num = Number(value);
        if (isNaN(num)) return "N/A";
        const digits = Math.floor(Math.abs(num)).toString().length;
        let ms;
        if (digits >= 16) {
          ms = Math.floor(num / 1000);
        } else if (digits <= 10) {
          ms = num * 1000;
        } else {
          ms = num;
        }
        date = new Date(ms);
      }
      if (isNaN(date.getTime())) return "N/A";
      return moment(date).format("DD MMM YYYY, HH:mm:ss");
    },
    copyAddress(txnId, message = "Transaction ID is copied!") {
      clipboard.writeText(txnId);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: message
      });
    },
    inputHash(hash) {
      //let payInCurrency = this.Currencylist.find(
      //  item => item.ticker === this.txnStatus.currencyFrom
      //);
      //let url = this.txnStatus.payoutHashLink;
      //url = url.slice(0, url.lastIndexOf("/") - (url.length - 1)) + hash;

      //this.$gateway.send("core", "open_url", { url });
      let payinhash = hash;
      if (!hash) {
        payinhash = this.txnStatus?.raw_response?.deposits[0]?.txId || "";
      }
      this.copyAddress(payinhash, "Input Hash is copied!");
    },
    outputHash(url) {
      let payoutHash = url;
      if (!payoutHash) {
        payoutHash = this.txnStatus?.raw_response?.withdrawals[0]?.txId || "";
      }
      this.copyAddress(payoutHash, "Output Hash is copied!");
      // this.$gateway.send("core", "open_url", { url });
    }
  }
};
</script>
