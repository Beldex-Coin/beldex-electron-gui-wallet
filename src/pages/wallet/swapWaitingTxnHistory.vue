<template>
  <div class="txnSettlement waitingTxnHistory swapPayment">
    <!-- Payment – awaiting deposit -->
    <header class="swapPayment__head">
      <div class="swapPayment__title-wrap">
        <h2 class="swapPayment__title">
          {{ $t("titles.swap.sendFundDisc") }}
        </h2>
        <span
          class="swapPayment__timer"
          :class="{ 'is-expired': timeIsExpire }"
        >
          <q-icon name="timer" size="14px" />
          <beldex-spinner v-if="!clock" size="12px" color="warning" />
          <span v-else>{{ clock }}</span>
        </span>
      </div>
      <div class="beldex-segmented" role="tablist">
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item beldex-segmented__item--active"
          aria-selected="true"
          @click="$emit('backToSwap')"
        >
          <span class="beldex-segmented__dot" />
          {{ $t("titles.swap.exchange") }}
        </button>
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item"
          aria-selected="false"
          @click="$emit('goback')"
        >
          {{ $t("titles.swap.history") }}
        </button>
      </div>
    </header>

    <div v-if="timeIsExpire" class="swapPayment__expired">
      <span>{{ $t("titles.swap.guaranteedRateDisc") }}</span>
      <q-btn
        :label="$t('buttons.startOver')"
        icon="refresh"
        class="beldex-btn beldex-btn--ghost"
        unelevated
        no-caps
        @click="$emit('backToSwap')"
      />
    </div>

    <section class="swapPayment__body">
      <div class="swapPayment__qr">
        <QrcodeVue
          :value="txnDetails.payinAddress || ''"
          :size="118"
          level="M"
          background="#ffffff"
          foreground="#000000"
        />
      </div>

      <div class="swapPayment__info">
        <div class="swapPayment__facts">
          <div class="swapPayment__fact">
            <div class="swapPayment__label">
              {{ $t("fieldLabels.amount") }}
            </div>
            <div class="swapPayment__amount uppercase">
              {{ txnDetails.amountExpectedFrom }}
              {{ txnDetails.currencyFrom }}
            </div>
          </div>
          <div class="swapPayment__fact">
            <div class="swapPayment__label">
              {{ $t("titles.swap.transactionID") }}
            </div>
            <div class="swapPayment__id">
              <span>{{ txnDetails.id }}</span>
              <q-btn
                flat
                dense
                size="sm"
                icon="content_copy"
                class="swapPayment__id-copy"
                @click="
                  copyAddress({
                    val: txnDetails.id,
                    from: 'Transaction ID'
                  })
                "
              />
            </div>
          </div>
          <div v-if="txnDetails.privacySwap" class="swapPayment__fact">
            <div class="swapPayment__label">
              {{ $t("titles.swap.swapType") }}
            </div>
            <div class="swapPayment__value">
              {{ $t("strings.privacy") }}
            </div>
          </div>
          <div v-if="getConfirmationCount() !== null" class="swapPayment__fact">
            <div class="swapPayment__label">
              {{ $t("titles.swap.confirmations") }}
            </div>
            <div class="swapPayment__value">
              {{ getConfirmationCount() }} Blocks
            </div>
          </div>
        </div>

        <div class="swapPayment__label">
          {{ $t("titles.swap.depositAddress") }}
          <template v-if="networkLabel"> · {{ networkLabel }}</template>
        </div>
        <div class="swapPayment__address">
          {{ txnDetails.payinAddress }}
        </div>
        <q-btn
          :label="$t('buttons.copyAddress')"
          icon="content_copy"
          class="beldex-btn beldex-btn--ghost swapPayment__copy"
          unelevated
          no-caps
          @click="
            copyAddress({
              val: txnDetails.payinAddress,
              from: 'Recipient address'
            })
          "
        />
      </div>
    </section>

    <article class="warning-wrapper swapPayment__warning">
      <q-icon name="warning_amber" size="16px" />
      <span class="q-ml-sm warn-txt">
        {{ $t("titles.swap.sendFundsAboveAddress") }}
        {{ $t("titles.swap.once") }}.
      </span>
    </article>

    <div class="swapPayment__status">
      <span class="swapPayment__status-dot" />
      {{ $t("titles.swap.waitingDeposit") }}
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import QrcodeVue from "qrcode.vue";

export default {
  name: "SwapWaitingTxnHistory",
  components: {
    QrcodeVue
  },

  props: {
    goback: {
      type: Function,
      require: true
    },
    txnDetails: {
      type: Object,
      require: true
    },
    backToSwap: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      timer: "",
      timeIsExpire: false,
      clock: ""
    };
  },

  inject: {
    setSwapPreview: { default: null }
  },
  computed: {
    networkLabel() {
      const t = this.txnDetails || {};
      const label = t.blockchainFrom || t.networkFrom || "";
      return String(label)
        .replaceAll("_", " ")
        .toUpperCase();
    }
  },
  watch: {
    txnDetails: {
      immediate: true,
      handler() {
        this.publishPreview();
      }
    }
  },
  beforeDestroy() {
    if (this.setSwapPreview) this.setSwapPreview(null);
    clearInterval(this.timer);
  },
  mounted() {
    this.startAndStopTimer();
  },

  methods: {
    publishPreview() {
      if (!this.setSwapPreview || !this.txnDetails) return;
      const t = this.txnDetails;
      const fmt = v =>
        v === undefined || v === null || isNaN(Number(v))
          ? "--"
          : Number(v).toFixed(8);
      this.setSwapPreview({
        type: t.type,
        from: t.currencyFrom || "",
        to: t.currencyTo || "",
        amountFrom: t.amountExpectedFrom > 0 ? t.amountExpectedFrom : 0,
        rate: fmt(t.rate),
        fee: fmt(t.platformFee || 0),
        networkFee: fmt(t.networkFee),
        amountTo: t.amountExpectedTo
      });
    },
    backTopayment() {
      this.$emit("goback");
      clearInterval(this.timer);
    },
    startAndStopTimer() {
      clearInterval(this.timer);
      var today;
      let addTime;

      const rawTs = this.txnDetails?.createdAt || this.txnDetails?.created_at;
      let ms = Number(rawTs);
      if (isNaN(ms) || !ms) {
        ms = Date.now();
      } else if (String(Math.floor(ms)).length <= 10) {
        ms = ms * 1000;
      }

      if (this.txnDetails.type == "float") {
        today = new Date(ms);
        addTime = today.setHours(today.getHours() + 3);
      } else {
        today = new Date(ms);
        addTime = today.setMinutes(today.getMinutes() + 20);
      }
      var countDownDate = new Date(addTime).getTime();

      // Update the count down every 1 second
      this.timer = setInterval(() => {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const pad = n => String(Math.max(n, 0)).padStart(2, "0");
        this.clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        if (distance < 0) {
          this.clock = "00:00:00";
          this.timeIsExpire = true;
          this.clearintervals();
        }
      }, 1000);
    },
    clearintervals() {
      clearInterval(this.timer);
    },
    getConfirmationCount() {
      if (!this.txnDetails) return null;
      const count =
        this.txnDetails.minConfirmationsToTrade ??
        this.txnDetails.payinConfirmations ??
        (this.txnDetails.raw_response &&
        typeof this.txnDetails.raw_response === "object"
          ? this.txnDetails.raw_response.minConfirmationsToTrade ??
            this.txnDetails.raw_response.payinConfirmations
          : null);
      return count != null && count !== "" && !isNaN(Number(count))
        ? Number(count)
        : null;
    },

    copyAddress(content) {
      clipboard.writeText(content.val);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: `${content.from} copied`
      });
    }
  }
};
</script>
