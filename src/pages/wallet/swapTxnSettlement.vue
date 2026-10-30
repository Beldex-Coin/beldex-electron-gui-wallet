<template>
  <div class="txnSettlement swapPayment">
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
          @click="backToMainpage"
        >
          <span class="beldex-segmented__dot" />
          {{ $t("titles.swap.exchange") }}
        </button>
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item"
          aria-selected="false"
          @click="$emit('toHistory')"
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
        @click="backToMainpage"
      />
    </div>

    <section class="swapPayment__body">
      <div class="swapPayment__qr">
        <QrcodeVue
          :value="createdTxnDetails.payinAddress || ''"
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
              {{ createdTxnDetails.amountExpectedFrom }}
              {{ createdTxnDetails.currencyFrom }}
            </div>
          </div>
          <div class="swapPayment__fact">
            <div class="swapPayment__label">
              {{ $t("titles.swap.transactionID") }}
            </div>
            <div class="swapPayment__id">
              <span>{{ createdTxnDetails.id }}</span>
              <q-btn
                flat
                dense
                size="sm"
                icon="content_copy"
                class="swapPayment__id-copy"
                @click="
                  copyAddress({
                    val: createdTxnDetails.id,
                    from: 'Transaction ID'
                  })
                "
              />
            </div>
          </div>
          <div v-if="isPrivacySwap" class="swapPayment__fact">
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
          {{ createdTxnDetails.payinAddress }}
        </div>
        <q-btn
          :label="$t('buttons.copyAddress')"
          icon="content_copy"
          class="beldex-btn beldex-btn--ghost swapPayment__copy"
          unelevated
          no-caps
          @click="
            copyAddress({
              val: createdTxnDetails.payinAddress,
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
  name: "SwapTxnSettlement",
  components: {
    QrcodeVue
  },
  props: {
    goback: {
      type: Function,
      require: true
    },
    createdTxnDetails: {
      type: Object,
      require: true
    },
    floatingRate: {
      type: Object,
      required: true
    },
    fixedRate: {
      type: Object,
      required: true
    },
    receiveChainDetails: {
      type: Object,
      require: true
    },
    sendChainDetails: {
      type: Object,
      require: true
    },
    clearAllintervals: {
      type: Function,
      require: true
    },
    isPrivacySwap: {
      type: Boolean,
      require: true
    }
  },

  data() {
    return {
      timer: "",
      clock: "",
      timeIsExpire: false
    };
  },
  computed: {
    networkLabel() {
      const chain = this.sendChainDetails || {};
      const label = chain.blockchain || chain.protocol || "";
      return String(label)
        .replaceAll("_", " ")
        .toUpperCase();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.startAndStopTimer();
  },

  methods: {
    backToMainpage() {
      this.$emit("goback");
      this.$emit("clearAllintervals");

      clearInterval(this.timer);
      //  this.startAndStopTimer()
    },
    startAndStopTimer() {
      clearInterval(this.timer);
      var today;
      let addTime;

      if (this.createdTxnDetails.type == "float") {
        today = new Date();
        addTime = today.setHours(today.getHours() + 3);
      } else {
        today = new Date(this.createdTxnDetails.payTill);
        addTime = today.setHours(today.getHours());
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
        // Output the result in an element with id="timer"
        // document.getElementById("timer").innerHTML =
        //   hours + "h " + minutes + "m " + seconds + "s ";
        const pad = n => String(Math.max(n, 0)).padStart(2, "0");
        this.clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        // If the count down is over, write some text
        if (distance < 0) {
          // document.getElementById("timer").innerHTML = "00:00:00";
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
      if (!this.createdTxnDetails) return null;
      const count =
        this.createdTxnDetails.minConfirmationsToTrade ??
        this.createdTxnDetails.payinConfirmations ??
        (this.createdTxnDetails.raw_response &&
        typeof this.createdTxnDetails.raw_response === "object"
          ? this.createdTxnDetails.raw_response.minConfirmationsToTrade ??
            this.createdTxnDetails.raw_response.payinConfirmations
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
