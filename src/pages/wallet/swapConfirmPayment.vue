<template>
  <div class="confirmPayment">
    <!-- Checkout -->
    <header class="confirmPayment__head">
      <div class="confirmPayment__title-wrap">
        <button
          type="button"
          class="beldex-square-btn"
          :aria-label="$t('buttons.back')"
          @click="goToExchangepair"
        >
          <q-icon name="arrow_back" size="16px" />
        </button>
        <h2 class="confirmPayment__title">
          {{ $t("titles.swap.checkout") }}
        </h2>
        <span class="confirmPayment__badge">{{
          $t("titles.swap.reviewBeforePaying")
        }}</span>
      </div>
      <div class="beldex-segmented" role="tablist">
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item beldex-segmented__item--active"
          aria-selected="true"
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

    <section class="confirmPayment__body">
      <div
        v-if="
          minMaxWarningContent === 'min' ||
            minMaxWarningContent === 'max' ||
            (pairsMinMax?.from && !pairsMinMax?.minAmountFloat)
        "
        class="validMinMaxAmount-wrapper"
      >
        <span
          v-if="
            pairsMinMax?.from && pairsMinMax?.to && !pairsMinMax?.minAmountFloat
          "
          >{{ $t("titles.swap.unsupportedpair") }}</span
        >
        <span v-if="minMaxWarningContent === 'min'">
          {{ $t("titles.swap.minimumAmtChanged") }}
          <span class="validMinMaxAmount" @click="sendAmounts">
            {{
              exchangeType === "float"
                ? pairsMinMax?.minAmountFloat
                : pairsMinMax?.minAmountFixed
            }}
            {{ pairsMinMax?.from }}
          </span>
        </span>
        <span v-if="minMaxWarningContent === 'max'" @click="sendAmounts">
          {{ $t("titles.swap.maximumAmtChanged") }}
          <span class="validMinMaxAmount" @click="sendAmounts">
            {{
              exchangeType === "float"
                ? pairsMinMax?.maxAmountFloat
                : pairsMinMax?.maxAmountFixed
            }}
            {{ pairsMinMax?.from }}
          </span>
        </span>
      </div>

      <div class="confirmPayment__grid">
        <div class="confirmPayment__card">
          <div class="confirmPayment__label">
            {{ $t("titles.swap.youSend") }}
          </div>
          <div class="confirmPayment__amount uppercase">
            {{
              (floatingRate.amountFrom
                ? Number(floatingRate.amountFrom).toFixed(8) + " "
                : "-- ") + sendChainDetails.name
            }}
          </div>
          <div class="confirmPayment__meta uppercase">
            {{ $t("titles.swap.network") }}:
            {{ sendChainDetails.protocol || "" }}
          </div>
          <div
            v-if="sendChainDetails.blockchain"
            class="confirmPayment__meta uppercase"
          >
            {{ $t("titles.swap.blockchain") }}:
            {{ sendChainDetails.blockchain.replaceAll("_", " ") }}
          </div>
        </div>
        <div class="confirmPayment__card">
          <div class="confirmPayment__label">
            {{ $t("titles.swap.youGet") }}
          </div>
          <div
            v-if="exchangeType === 'float'"
            class="confirmPayment__amount confirmPayment__amount--get uppercase"
          >
            ≈
            {{
              (floatingRate.amountTo
                ? Number(floatingRate.amountTo).toFixed(8) + " "
                : "-- ") + receiveChainDtails.name
            }}
          </div>
          <div
            v-else
            class="confirmPayment__amount confirmPayment__amount--get uppercase"
          >
            {{
              (floatingRate.amountTo
                ? Number(fixedRate.amountTo).toFixed(8) + " "
                : "-- ") + fixedRate.to
            }}
          </div>
          <div class="confirmPayment__meta uppercase">
            {{ $t("titles.swap.network") }}:
            {{ receiveChainDtails.protocol || "" }}
          </div>
          <div
            v-if="receiveChainDtails.blockchain"
            class="confirmPayment__meta uppercase"
          >
            {{ $t("titles.swap.blockchain") }}:
            {{ receiveChainDtails.blockchain.replaceAll("_", " ") }}
          </div>
        </div>

        <template v-if="floatingRate.fee || floatingRate.networkFee">
          <div class="confirmPayment__card">
            <div class="confirmPayment__label">
              {{ $t("titles.swap.exchangefee") }}
            </div>
            <div class="confirmPayment__value uppercase">
              {{
                (floatingRate.fee
                  ? Number(floatingRate.fee).toFixed(8) + " "
                  : "0 ") + receiveChainDtails.name
              }}
            </div>
            <div class="confirmPayment__meta">
              {{ $t("titles.swap.exchangeFeeIncluded") }}
            </div>
          </div>
          <div class="confirmPayment__card">
            <div class="confirmPayment__label">
              {{ $t("titles.swap.networkFee") }}
            </div>
            <div class="confirmPayment__value uppercase">
              {{
                (floatingRate.networkFee
                  ? Number(floatingRate.networkFee).toFixed(8) + " "
                  : "0 ") + receiveChainDtails.name
              }}
            </div>
            <div class="confirmPayment__meta">
              {{ $t("titles.swap.networkFeeIncluded") }}
            </div>
          </div>
        </template>
      </div>

      <div class="confirmPayment__field">
        <div class="confirmPayment__label">
          {{ $t("fieldLabels.recipientAddress") }}
        </div>
        <div class="confirmPayment__address">
          <span>{{ recipientAddress }}</span>
          <q-btn
            flat
            dense
            size="sm"
            icon="content_copy"
            class="confirmPayment__copy"
            @click="copyValue(recipientAddress, 'Recipient address')"
          />
        </div>
      </div>

      <div v-if="refundAddress" class="confirmPayment__field">
        <div class="confirmPayment__label">
          {{ $t("titles.swap.refundAddress") }}
        </div>
        <div class="confirmPayment__address">
          <span>{{ refundAddress }}</span>
          <q-btn
            flat
            dense
            size="sm"
            icon="content_copy"
            class="confirmPayment__copy"
            @click="copyValue(refundAddress, 'Refund address')"
          />
        </div>
      </div>

      <div
        v-if="refundAddress && floatingRate.exchange_type === 'changelly'"
        class="confirmPayment__row"
      >
        <span class="confirmPayment__label">{{
          $t("titles.swap.guaranteeFee")
        }}</span>
        <span class="confirmPayment__value uppercase">
          1
          {{
            fixedRate.from +
              " = " +
              (fixedRate.result ? Number(fixedRate.result).toFixed(8) : "--") +
              " " +
              receiveChainDtails.name
          }}
        </span>
      </div>
      <div v-if="!fixedRate.result" class="confirmPayment__row">
        <span class="confirmPayment__label">{{
          $t("titles.swap.exchangeRate")
        }}</span>
        <span class="confirmPayment__value uppercase">
          1
          {{
            sendChainDetails.name +
              " ≈ " +
              (floatingRate.rate
                ? Number(floatingRate.rate).toFixed(8)
                : "--") +
              " " +
              receiveChainDtails.name
          }}
        </span>
      </div>
    </section>

    <div class="confirmPayment__actions">
      <q-btn
        :label="$t('buttons.back')"
        icon="arrow_back"
        class="beldex-btn beldex-btn--ghost"
        unelevated
        no-caps
        @click="goToExchangepair"
      />
      <q-btn
        :label="$t('titles.swap.paymentConfirm')"
        icon="check"
        class="beldex-btn"
        unelevated
        no-caps
        :disable="!disableValidation()"
        @click="makePayment"
      />
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";

export default {
  name: "SwapConfirmPayment",
  props: {
    goback: {
      type: Function,
      required: false
    },
    submit: {
      type: Function,
      required: false
    },
    exchangeType: {
      type: String,
      required: true
    },
    floatingRate: {
      type: Object,
      required: true
    },
    fixedRate: {
      type: Object,
      required: true
    },
    recipientAddress: {
      type: String,
      required: true
    },
    refundAddress: {
      type: String,
      required: false,
      default: undefined
    },
    sendChainDetails: {
      type: Object,
      required: true
    },
    receiveChainDtails: {
      type: Object,
      required: true
    },
    pairsMinMax: {
      type: Object,
      required: true
    },
    minMaxWarningContent: {
      type: String,
      required: true
    },
    sending: {
      type: Function,
      required: false
    }
  },
  data() {
    return {};
  },
  methods: {
    goToExchangepair() {
      this.$emit("goback");
    },
    copyValue(val, from) {
      clipboard.writeText(val);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: `${from} copied`
      });
    },
    makePayment() {
      this.$emit("submit");
    },
    sendAmounts() {
      this.$emit("sending", this.pairsMinMax?.minAmountFloat);
    },
    disableValidation() {
      let receiveFund = "";
      let refundAdd = true;
      if (this.exchangeType === "float") {
        receiveFund = this.floatingRate.amountTo;
      } else {
        refundAdd = this.refundAddress;
        receiveFund = this.fixedRate.amountTo;
      }

      const amountFrom =
        this.floatingRate.amountFrom ||
        this.fixedRate.amountFrom ||
        this.floatingRate.amountExpectedFrom;

      return (
        !(
          this.minMaxWarningContent === "min" ||
          this.minMaxWarningContent === "max"
        ) &&
        receiveFund > 0 &&
        refundAdd &&
        (amountFrom > 0 || Number(receiveFund) > 0)
      );
    }
  }
};
</script>
