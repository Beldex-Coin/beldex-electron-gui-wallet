<template>
  <div class="confirmPayment">
    <!-- <q-header>
    <q-toolbar top>-->
    <header class="flex row items-center q-mb-md">
      <div
        class="flex items-center back-arrow-btn"
        @click="this.goToExchangepair"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
            fill="white"
          />
        </svg>
      </div>

      <div class="ft-semibold q-ml-md header-txt">
        {{ this.$t("titles.swap.checkout") }}
      </div>
    </header>
    <section class="q-mt-lg">
      <div
        v-if="
          minMaxWarningContent === 'min' ||
            minMaxWarningContent === 'max' ||
            (pairsMinMax?.from && !pairsMinMax?.minAmountFloat)
        "
        class="q-mt-sm validMinMaxAmount-wrapper"
      >
        <span
          v-if="
            pairsMinMax?.from && pairsMinMax?.to && !pairsMinMax?.minAmountFloat
          "
          >{{ this.$t("titles.swap.unsupportedpair") }}</span
        >
        <span v-if="minMaxWarningContent === 'min'">
          {{ this.$t("titles.swap.minimumAmtChanged") }}
          <span class="validMinMaxAmount" @click="this.sendAmounts">
            {{
              exchangeType === "float"
                ? pairsMinMax?.minAmountFloat
                : pairsMinMax?.minAmountFixed
            }}
            {{ pairsMinMax?.from }}
          </span>
        </span>
        <span
          v-if="this.minMaxWarningContent === 'max'"
          @click="this.sendAmounts"
        >
          {{ this.$t("titles.swap.maximumAmtChanged") }}
          <span class="validMinMaxAmount" @click="this.sendAmounts">
            {{
              exchangeType === "float"
                ? pairsMinMax?.maxAmountFloat
                : pairsMinMax?.maxAmountFixed
            }}
            {{ pairsMinMax?.from }}
          </span>
        </span>
      </div>
      <article class="flex row">
        <div class="col-6">
          <div class="q-mb-sm">{{ this.$t("titles.swap.youSend") }}</div>
          <div class="ft-semibold amount-txt uppercase">
            {{
              (this.floatingRate.amountFrom
                ? Number(this.floatingRate.amountFrom).toFixed(8) + " "
                : "-- ") + sendChainDetails.name
            }}
          </div>
          <div class="ft-semibold expand-txt">
            {{ this.$t("titles.swap.blockchain") }}:
            <span>{{ sendChainDetails.blockchain }}</span>
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm">{{ this.$t("titles.swap.youGet") }}</div>
          <div
            v-if="exchangeType === 'float'"
            class="ft-semibold amount-txt uppercase"
          >
            ~
            {{
              (this.floatingRate.amountTo
                ? Number(this.floatingRate.amountTo).toFixed(8) + " "
                : "-- ") + receiveChainDtails.name
            }}
          </div>
          <div v-else class="ft-semibold amount-txt uppercase">
            {{
              (this.floatingRate.amountTo
                ? Number(this.fixedRate.amountTo).toFixed(8) + " "
                : "-- ") + this.fixedRate.to
            }}
          </div>
          <div class="ft-semibold expand-txt">
            {{ this.$t("titles.swap.blockchain") }}:
            <span>{{ receiveChainDtails.blockchain }}</span>
          </div>
        </div>
      </article>
      <div class="hr-seperator"></div>

      <article v-if="!this.refundAddress" class="flex row">
        <div class="col-6">
          <div class="q-mb-sm">{{ this.$t("titles.swap.exchangefee") }}</div>
          <div class="ft-semibold amount-txt uppercase">
            {{
              (this.floatingRate.fee
                ? Number(this.floatingRate.fee).toFixed(8) + " "
                : "-- ") + receiveChainDtails.name
            }}
          </div>
          <div class="ft-regular hint-txt">
            {{ this.$t("titles.swap.exchangeFeeIncluded") }}
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm">{{ this.$t("titles.swap.networkFee") }}</div>
          <div class="ft-semibold amount-txt uppercase">
            {{
              (this.floatingRate.networkFee
                ? Number(this.floatingRate.networkFee).toFixed(8) + " "
                : "-- ") + receiveChainDtails.name
            }}
          </div>
          <div class="ft-regular hint-txt">
            {{ this.$t("titles.swap.networkFeeIncluded") }}
          </div>
        </div>
      </article>
      <div v-if="!this.refundAddress" class="hr-seperator"></div>

      <article class="flex row">
        <div :class="[this.refundAddress ? 'col-12' : 'col-6']">
          <div v-if="this.refundAddress" class="q-mb-sm">
            <div class>{{ this.$t("titles.swap.guaranteeFee") }}</div>
            <div class="ft-semibold amount-txt uppercase">
              1
              {{
                this.fixedRate.from +
                  " = " +
                  (this.fixedRate.result
                    ? Number(this.fixedRate.result).toFixed(8)
                    : "-- ") +
                  " " +
                  receiveChainDtails.name
              }}
            </div>
          </div>
          <div>{{ this.$t("fieldLabels.recipientAddress") }}</div>
          <div
            :class="[
              this.refundAddress
                ? 'ft-semibold amount-txt'
                : 'ft-medium recipt-address'
            ]"
          >
            {{ this.recipientAddress }}
          </div>
          <div v-if="this.refundAddress" class="q-mt-sm">
            {{ this.$t("titles.swap.refundAddress") }}
          </div>
          <div
            v-if="this.refundAddress"
            :class="[
              this.refundAddress
                ? 'ft-semibold amount-txt'
                : 'ft-medium recipt-address'
            ]"
          >
            {{ this.refundAddress }}
          </div>
        </div>
        <div v-if="!this.refundAddress" class="col-6">
          <div class="q-mb-sm">{{ this.$t("titles.swap.exchangeRate") }}</div>
          <div class="ft-semibold amount-txt uppercase">
            1
            {{
              sendChainDetails.name +
                " ~ " +
                (this.floatingRate.rate
                  ? Number(this.floatingRate.rate).toFixed(8)
                  : "-- ") +
                " " +
                receiveChainDtails.name
            }}
          </div>
        </div>
      </article>
    </section>

    <div
      class="flex justify-center"
      :class="[this.refundAddress ? 'q-mt-lg q-pt-xl' : 'q-mt-lg']"
    >
      <q-btn
        color="primary"
        :label="$t('titles.swap.paymentConfirm')"
        :disable="this.disableValidation()"
        @click="this.makePayment"
      />
    </div>

    <!-- </q-toolbar>
    </q-header>-->
  </div>
</template>

<script>
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
    makePayment() {
      this.$emit("submit");
    },
    sendAmounts() {
      this.$emit("sending", this.pairsMinMax?.minAmountFloat);
    },
    disableValidation() {
      let fixed_validation;
      if (this.exchangeType === "fixed") {
        fixed_validation = this.isValidRefundAddress.result;
      } else {
        fixed_validation = true;
      }

      let receiveFund = "";
      let refundAdd = "";
      if (this.exchangeType === "float") {
        receiveFund = this.floatingRate.amountTo;
        refundAdd = true;
      } else {
        refundAdd = this.refundAddress;
        receiveFund = this.fixedRate.amountTo;
      }
      return (
        this.minMaxWarningContent === "min" ||
        this.minMaxWarningContent === "max" ||
        (this.pairsMinMax?.from &&
          !this.pairsMinMax?.minAmountFloat &&
          receiveFund > 0 &&
          refundAdd &&
          this.recipientAddress &&
          this.refundAddress &&
          fixed_validation &&
          this.floatingRate.amountFrom)
      );
    }
  }
};
</script>
