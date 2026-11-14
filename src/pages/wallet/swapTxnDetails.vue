<template>
  <div class="swapTxnDetails">
    <header class="swapDetails__head">
      <div class="swapDetails__title-wrap">
        <button
          type="button"
          class="beldex-icon-btn swapDetails__back"
          :aria-label="$t('buttons.back')"
          @click="backToHistory"
        >
          <span class="beldex-icon-btn__glyph">←</span>
        </button>
        <h2 class="swapDetails__title">
          {{ $t("titles.swap.swapStatus") }}
        </h2>
        <span class="swapDetails__id">
          <span class="swapDetails__id-label"
            >{{ $t("titles.swap.transactionID") }}:</span
          >
          <span class="swapDetails__id-value">{{ txnDetails?.id }}</span>
          <q-btn
            flat
            dense
            size="xs"
            icon="content_copy"
            class="swapDetails__id-copy"
            @click="copyAddress(txnDetails?.id)"
          />
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
          @click="backToHistory"
        >
          {{ $t("titles.swap.history") }}
        </button>
      </div>
    </header>

    <section class="swapDetails__body">
      <div class="swapDetails__status">
        <span class="swapDetails__status-icon">
          <img src="~assets/icons/swap-status-clock.svg" alt="" />
        </span>
        <div>
          <div class="swapDetails__status-title">{{ statusTitle }}</div>
          <div v-if="statusDesc" class="swapDetails__status-desc">
            {{ statusDesc }}
          </div>
        </div>
      </div>

      <div class="swapDetails__amounts">
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.amountFrom") }}
          </div>
          <div class="swapDetails__amount">
            {{ txnDetails?.amountExpectedFrom }}
            <span class="uppercase">{{ txnDetails?.currencyFrom }}</span>
          </div>
        </div>
        <div class="swapDetails__tile">
          <div class="swapDetails__label">
            {{ $t("titles.swap.amountTo") }}
          </div>
          <div class="swapDetails__amount">
            {{ txnDetails?.amountExpectedTo }}
            <span class="uppercase">{{ txnDetails?.currencyTo }}</span>
          </div>
        </div>
      </div>

      <div class="swapDetails__label">
        {{ $t("fieldLabels.recipientAddress") }}
      </div>
      <div class="swapDetails__address">
        <span>{{ txnDetails?.payoutAddress }}</span>
        <q-btn
          flat
          dense
          size="xs"
          icon="content_copy"
          class="swapDetails__id-copy"
          @click="
            copyAddress(
              txnDetails?.payoutAddress,
              'notification.positive.recipientAddressCopied'
            )
          "
        />
      </div>

      <article v-if="isExpired" class="warning-wrapper swapDetails__warning">
        <q-icon name="warning_amber" size="16px" />
        <span class="q-ml-sm warn-txt">
          {{ $t("titles.swap.paymentNotReceived") }}.
        </span>
      </article>
    </section>

    <div class="swapDetails__actions">
      <q-btn
        :label="$t('titles.swap.openHistory')"
        class="beldex-btn beldex-btn--ghost"
        unelevated
        no-caps
        @click="backToHistory"
      />
      <q-btn
        v-if="txnDetails?.status !== 'exchanging'"
        :label="$t('buttons.startOver')"
        icon="refresh"
        class="beldex-btn"
        unelevated
        no-caps
        @click="$emit('backToSwap')"
      />
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
export default {
  name: "SwapTxnDetails",

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

  inject: {
    setSwapPreview: { default: null }
  },

  computed: {
    isExpired() {
      return ["expired", "overdue"].includes(this.txnDetails?.status);
    },
    statusTitle() {
      return this.localizedStatus(this.txnDetails?.status);
    },
    statusDesc() {
      return this.isExpired ? this.$t("titles.swap.depositWindowExpired") : "";
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
  },

  methods: {
    // Fills the Transaction preview side panel from this order.
    publishPreview() {
      if (!this.setSwapPreview || !this.txnDetails) return;
      const t = this.txnDetails;
      const rate = Number(t.rate);
      this.setSwapPreview({
        compact: true,
        from: t.currencyFrom || "",
        to: t.currencyTo || "",
        amountFrom: t.amountExpectedFrom > 0 ? t.amountExpectedFrom : 0,
        rate: isNaN(rate) || !rate ? "--" : rate.toFixed(8),
        amountTo: t.amountExpectedTo,
        status: this.localizedStatus(t.status)
      });
    },
    // Same status buckets/labels as the swap history list.
    localizedStatus(status) {
      const keys = {
        finished: "statusCompleted",
        failed: "statusFailed",
        refunded: "statusRefund",
        overdue: "statusExpired",
        expired: "statusExpired",
        waiting: "statusWaiting"
      };
      return this.$t(`titles.swap.${keys[status] || "statusPending"}`);
    },
    copyAddress(
      value,
      messageKey = "notification.positive.transactionIdCopied"
    ) {
      clipboard.writeText(value);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t(messageKey)
      });
    },
    backToHistory() {
      this.$emit("goback");
    }
  }
};
</script>
