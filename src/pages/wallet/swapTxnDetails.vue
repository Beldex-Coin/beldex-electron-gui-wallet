<template>
  <div class="swapTxnDetails">
    <!-- <q-header>
    <q-toolbar top>-->
    <header class="flex row items-center q-mb-md justify-between">
      <div class="flex items-center back-arrow-btn" @click="backToHistory">
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
        <div class="ft-semibold q-ml-md header-txt">
          {{ this.$t("buttons.back") }}
        </div>
      </div>
    </header>

    <section class="q-mt-lg">
      <article class="flex row txn-id-wrapper q-px-md items-center">
        <span class="txn-id-txt ft-medium q-mr-sm"
          >{{ this.$t("titles.swap.transactionID") }} :</span
        >
        <span class="ft-semibold q-mr-sm">{{ txnDetails?.id }}</span>
        <q-btn
          style="height: 30px;width:30px;"
          flat
          icon="content_copy"
          color="primary"
          size="9px"
          class="copy-btn flex justify-center items-center"
          @click="copyAddress(txnDetails?.id)"
        />
        <!-- <q-icon name="content_copy" color="primary" /> -->
      </article>

      <article class="q-mt-md flex items-center">
        <!-- <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="Vector"
            d="M12.1834 0.0013618C8.71241 -0.0505772 5.57868 1.38673 3.35642 3.70698L1.02427 1.37486C0.79026 1.14085 0.409802 1.14085 0.17579 1.37486C0.0581843 1.49126 0 1.64549 0 1.79909V7.19931C0 7.51759 0.126435 7.82282 0.35149 8.04787C0.576545 8.27293 0.881786 8.39936 1.20006 8.39936H6.60034C6.75395 8.39936 6.90698 8.33998 7.02458 8.22357C7.2586 7.98956 7.2586 7.60911 7.02458 7.3751L5.06042 5.41096C7.23405 3.12056 10.5028 1.88197 14.0304 2.61006C17.7206 3.37209 20.6793 6.35911 21.4089 10.0565C22.621 16.1983 17.9301 21.5999 12.0006 21.5999C7.05757 21.5999 2.976 17.844 2.45638 13.0378C2.39157 12.4414 1.8751 11.9995 1.27507 11.9995C0.555029 11.9995 -0.00540028 12.6296 0.0750039 13.3449C0.745839 19.3307 5.8395 24 12.0006 24C19.3642 24 25.2004 17.3321 23.788 9.7166C22.8939 4.88881 18.9815 1.03136 14.1453 0.186526C13.4824 0.0708709 12.8272 0.0109951 12.1834 0.0013618ZM12.0006 4.79921C11.3382 4.79921 10.8006 5.33684 10.8006 5.99926V11.9995C10.8006 12.3175 10.9265 12.6236 11.1521 12.848L13.9038 15.5997C14.3719 16.0677 15.1328 16.0677 15.6008 15.5997C16.0688 15.1316 16.0688 14.3707 15.6008 13.9027L13.2007 11.5026V5.99926C13.2007 5.33684 12.6631 4.79921 12.0006 4.79921Z"
            fill="#AFAFBE"
          />
        </svg>-->
        <q-icon name="history" size="md" color="#fffe3" class="status-icon" />
        <span class="ft-semibold paid-status q-ml-sm">{{
          txnDetails?.status
        }}</span>
      </article>

      <article class="amount-details-wrapper flex row q-mt-md">
        <div class="col-md-5">
          <div class="amount-txt">{{ this.$t("titles.swap.amountFrom") }}</div>
          <div class="ft-semibold amount-val">
            {{ txnDetails?.amountExpectedFrom }}
            <span class="uppercase">{{ txnDetails?.currencyFrom }}</span>
          </div>
        </div>
        <div class="col-md-7">
          <div class="amount-txt">{{ this.$t("titles.swap.amountTo") }}</div>
          <div class="ft-semibold amount-val">
            {{ txnDetails?.amountExpectedTo }}
            <span class="uppercase">{{ txnDetails?.currencyTo }}</span>
          </div>
        </div>
      </article>
      <div class="hr-seperator q-my-md"></div>

      <article class="recipient-address-wrapper">
        <div class="label">{{ this.$t("fieldLabels.recipientAddress") }}</div>
        <div class="address ft-semibold">{{ txnDetails?.payoutAddress }}</div>
      </article>

      <article class="warning-wrapper q-mt-md">
        <q-icon name="o_info" size="14px" />
        <span class="q-ml-sm warn-txt">
          {{ this.$t("titles.swap.paymentNotReceived") }}
        </span>
      </article>
    </section>

    <div
      v-if="txnDetails?.status !== 'exchanging'"
      class="flex justify-center q-mt-xl"
    >
      <q-btn
        color="primary"
        label="Start Over"
        icon="refresh"
        class="start-over-btn"
        @click="() => this.$emit('backToSwap')"
      />
    </div>

    <!-- </q-toolbar>
    </q-header>-->
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

  data() {
    return {};
  },

  methods: {
    copyAddress(txnId) {
      clipboard.writeText(txnId);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: "Transaction ID is copied!"
      });
    },
    backToHistory() {
      this.$emit("goback");
    }
  }
};
</script>
