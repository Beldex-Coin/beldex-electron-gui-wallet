<template>
  <div v-if="isVisible" class="swapTxnHistory">
    <!-- <q-inner-loading :showing="this.txnHistory.length > 0 ? false : true">
      <q-spinner color="primary" size="30" />
    </q-inner-loading> -->
    <!-- <q-header>
    <q-toolbar top>-->
    <header class="flex row items-center q-mb-md justify-between">
      <div class="flex items-center back-arrow-btn" @click="backToSwap">
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
          {{ this.$t("titles.swap.history") }}
        </div>
      </div>

      <q-btn
        v-if="this.txnHistory.length > 0"
        color="primary"
        class="downloadCsv-btn"
        @click="downloadCsv"
      >
        <svg
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="csv" clip-path="url(#clip0_1350_3876)">
            <path
              id="Vector"
              d="M5.00022 1C4.08629 1 3.33355 1.75274 3.33355 2.66667V7.66667H4.44466V2.66667C4.44466 2.35392 4.68747 2.11111 5.00022 2.11111H10.0002V5.44444H13.3335V7.66667H14.4447V4.65885L10.7858 1H5.00022ZM11.1113 2.8967L12.548 4.33333H11.1113V2.8967ZM1.66471 8.77778C0.75079 8.77778 -0.00195312 9.53052 -0.00195312 10.4444V11.5556V12.6667C-0.00195312 13.5806 0.75079 14.3333 1.66471 14.3333C2.57864 14.3333 3.33138 13.5806 3.33138 12.6667H2.22027C2.22027 12.9794 1.97746 13.2222 1.66471 13.2222C1.35197 13.2222 1.10916 12.9794 1.10916 12.6667V11.5556V10.4444C1.10916 10.1317 1.35197 9.88889 1.66471 9.88889C1.97746 9.88889 2.22027 10.1317 2.22027 10.4444H3.33138C3.33138 9.53052 2.57864 8.77778 1.66471 8.77778ZM6.10916 8.77778C5.4536 8.77778 5.07016 9.04273 4.8635 9.26606C4.40683 9.75828 4.44133 10.4133 4.44466 10.4444C4.44466 11.3422 5.26076 11.7472 5.85742 12.0438C6.33075 12.2783 6.66471 12.4598 6.66471 12.6753C6.66471 12.6776 6.65402 12.9464 6.50846 13.0942C6.47735 13.1264 6.38249 13.2222 6.10916 13.2222H4.54666C4.61332 13.4344 4.7177 13.6699 4.91992 13.8754C5.12437 14.0843 5.49805 14.3333 6.10916 14.3333C6.72027 14.3333 7.0939 14.0833 7.30056 13.8733C7.7739 13.3922 7.77694 12.7311 7.77582 12.6667C7.77582 11.7556 6.95115 11.3466 6.35004 11.0477C5.88449 10.8166 5.55471 10.6375 5.5536 10.4097C5.5536 10.4075 5.54614 10.158 5.67947 10.0191C5.76169 9.93354 5.90582 9.88889 6.10916 9.88889H7.68034C7.49367 9.33 7.01582 8.77778 6.10916 8.77778ZM8.88694 8.77778L9.99805 14.3333H11.1092L12.2203 8.77778H11.1092L10.5536 11.9722L9.99805 8.77778H8.88694ZM14.4447 9.88889V10.4444V13.2222H12.2224L14.4447 15.4444L15.0002 16L15.5558 15.4444L17.778 13.2222H15.5558V10.4444V9.88889H14.4447Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_1350_3876">
              <rect width="18" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span class="q-ml-xs">{{ this.$t("titles.swap.downloadCsv") }}</span>
      </q-btn>
    </header>

    <div v-if="this.txnHistory.length === 0">
      <template>
        <section
          class="flex column justify-center items-center"
          style="height: 39vh"
        >
          <div>
            <img src="../../assets/images/No_transaction.svg" height="119px" />
          </div>
          <p class="q-pb-md q-pt-sm q-mb-none qtab-desc ft-semibold infoTxt">
            {{ $t("strings.noTransactionsFound") }}
          </p>

          <div class="hint-txt">After your first transaction,</div>
          <div class="hint-txt">you will be able to view it here.</div>
        </section>
      </template>
    </div>
    <section v-else class="q-mt-lg">
      <table style="width: 100%" class="txn-details-wrapper">
        <tr>
          <th>{{ this.$t("titles.swap.status") }}</th>
          <th>{{ this.$t("titles.swap.date") }}</th>
          <th>{{ this.$t("titles.swap.exchangeAmount") }}</th>
          <th>{{ this.$t("titles.swap.exchangeRate") }}</th>
          <th>{{ this.$t("titles.swap.receiver") }}</th>
          <th>{{ this.$t("titles.swap.amountReceived") }}</th>
        </tr>
        <tr
          v-for="(item, i) in this.txnHistory"
          :key="i"
          @click="setTxnDetails(i)"
        >
          <td v-if="item" class="cursor">
            <svg
              v-if="item.status === 'finished'"
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>

            <svg
              v-if="item.status === 'overdue' || item.status === 'expired'"
              class="relaod-timer"
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
            </svg>

            <svg
              v-if="
                item.status === 'waiting' ||
                  item.status === 'confirming' ||
                  item.status === 'exchanging' ||
                  item.status === 'sending'
              "
              class="waiting"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icons8-sand_watch 1">
                <path
                  id="Vector"
                  d="M4.5 1.5V3H6V6C6 8.27344 7.28906 10.2305 9.1582 11.25C7.28906 12.2695 6 14.2266 6 16.5V19.5H4.5V21H19.5V19.5H18V16.5C18 14.2266 16.7109 12.2695 14.8418 11.25C16.7109 10.2305 18 8.27344 18 6V3H19.5V1.5L4.5 1.5ZM7.5 3L16.5 3V6C16.5 8.49609 14.4961 10.5 12 10.5C9.50391 10.5 7.5 8.49609 7.5 6V3ZM9 4.5V6C9 7.65234 10.3477 9 12 9C13.6523 9 15 7.65234 15 6V4.5H9ZM12 12C14.4961 12 16.5 14.0039 16.5 16.5V19.5H7.5V16.5C7.5 14.0039 9.50391 12 12 12Z"
                  fill="#AFAFBE"
                />
              </g>
            </svg>
          </td>
          <td v-if="item" class="ft-medium cursor">
            {{ convertHumanReadableFormat(item.createdAt) }}
          </td>

          <td v-if="item" class="ft-semibold cursor">
            {{ item.amountExpectedFrom }}
          </td>
          <td v-if="item" class="ft-medium cursor uppercase">
            1 {{ item.currencyFrom }} ≈ {{ Number(item.rate).toFixed(4) }}
            {{ item.currencyTo }}
          </td>
          <td v-if="item" class="ft-medium cursor">
            {{
              item.payoutAddress.substr(0, 3) +
                ".." +
                item.payoutAddress.substr(
                  item.payoutAddress.length - 3,
                  item.payoutAddress.length
                )
            }}
          </td>
          <td
            v-if="item"
            class="ft-semibold cursor uppercase"
            :style="{ color: item.status == 'finished' && '#20D030' }"
          >
            {{ amountReceived(item) }}
            <!-- ≈ {{ Number(item.amountExpectedTo).toFixed(4) + " " + item.currencyTo }} -->
          </td>
        </tr>

        <!-- <tr>
          <td>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>
          </td>
          <td class="ft-medium">28 Apr 2023, 20:14:15</td>

          <td class="ft-semibold">774BDX</td>
          <td class="ft-medium">1 BDX = 0.00000116BTC</td>
          <td class="ft-medium">142...hzy</td>
          <td class="ft-semibold">0.00063271 BTC</td>
        </tr>-->

        <!-- <tr>
          <td>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>
          </td>
          <td class="ft-medium">28 Apr 2023, 20:14:15</td>
          <td class="ft-semibold">774BDX</td>
          <td class="ft-medium">1 BDX = 0.00000116BTC</td>
          <td class="ft-medium">142...hzy</td>
          <td class="ft-semibold">0.00063271 BTC</td>
        </tr>-->
      </table>
    </section>

    <!-- <div class="flex justify-center q-mt-sm">
        <q-btn c color="primary" label="Confirm & Make payment" />
      </div>
    -->
    <!-- </q-toolbar>
    </q-header>-->
  </div>
  <SwapTxnCompeleted
    v-else-if="this.txnDetails.status === 'finished'"
    :txn-status="this.txnDetails"
    from="history"
    @goback="
      () => {
        (isVisible = true), (txnDetails = '');
      }
    "
  />
  <!-- :floating-rate="this.exchange_amount"
    :fixed-rate="this.fixedExchangeRate"
    :receive-chain-details="this.receiveAmountType"
    :send-chain-details="this.sendAmounType"
  @clearAllintervals="clearAllintervals"-->
  <swapWaitingTxnHistory
    v-else-if="this.txnDetails.status === 'waiting'"
    :txn-details="this.txnDetails"
    @goback="
      () => {
        (isVisible = true), (txnDetails = '');
      }
    "
    @backToSwap="backToSwap"
  />
  <SwapTxnDetails
    v-else
    :txn-details="this.txnDetails"
    @goback="isVisible = true"
    @backToSwap="backToSwap"
  />
</template>

<script>
const moment = require("moment");
import swapWaitingTxnHistory from "./swapWaitingTxnHistory.vue";
import { mapState } from "vuex";
import SwapTxnDetails from "./swapTxnDetails.vue";
import SwapTxnCompeleted from "./swapTxnCompeleted.vue";

export default {
  name: "SwapTxnHistory",
  components: {
    SwapTxnDetails,
    SwapTxnCompeleted,
    swapWaitingTxnHistory
  },
  props: {
    goback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      isVisible: true,
      refreshTxnHistory: "",
      txnDetails: ""
    };
  },
  created() {
    this.get_transaction_History();
  },
  computed: mapState({
    txnHistory: state => {
      // console.log("txnHistory ::", state.gateway.txnHistory);
      let sortedHistory = state.gateway.txnHistory.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.createdAt / 1000) - new Date(a.createdAt / 1000);
      });
      return sortedHistory;
    },
    info: state => state.gateway.wallet.info
  }),

  methods: {
    backToSwap() {
      this.$emit("goback");
    },
    convertHumanReadableFormat(date) {
      return moment(date / 1000).format("DD MMM YYYY, h:mm:ss");
    },
    amountReceived(item) {
      if (item.status == "finished") {
        return `${Number(item.amountExpectedTo).toFixed(4) +
          " " +
          item.currencyTo}`;
      }
      return `≈ ${Number(item.amountExpectedTo).toFixed(4) +
        " " +
        item.currencyTo}`;
    },
    setTxnDetails(index) {
      this.txnDetails = this.txnHistory[index];
      this.isVisible = false;
    },
    downloadCsv() {
      let customizeCsv = [];
      let csv = "";
      this.txnHistory.length > 0 &&
        this.txnHistory.map(item => {
          let csvObj = {};
          csvObj.Status = item.status;
          csvObj.Date = moment(item.createdAt / 1000).format(
            "DD MMM YYYY-h:mm:ss"
          );
          csvObj.Exchange_Amount = item.amountExpectedFrom;
          csvObj.Exchange_rate = item.rate;
          csvObj.Receiver = item.payoutAddress;
          csvObj.Amount_Received = item.amountExpectedTo;
          customizeCsv.push(csvObj);
        });
      // Loop the array of objects
      for (let row = 0; row < customizeCsv.length; row++) {
        let keysAmount = Object.keys(customizeCsv[row]).length;
        let keysCounter = 0;
        // If this is the first row, generate the headings
        if (row === 0) {
          // Loop each property of the object
          for (let key in customizeCsv[row]) {
            // This is to not add a comma at the last cell
            // The '\r\n' adds a new line
            csv += key + (keysCounter + 1 < keysAmount ? "," : "\r\n");
            keysCounter++;
          }
        } else {
          for (let key in customizeCsv[row]) {
            csv +=
              customizeCsv[row][key] +
              (keysCounter + 1 < keysAmount ? "," : "\r\n");
            keysCounter++;
          }
        }

        keysCounter = 0;
      }

      const anchor = document.createElement("a");
      anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      anchor.target = "_blank";
      anchor.download = "Transaction_report.csv";
      anchor.click();
    },
    get_transaction_History() {
      let data = {
        // id: this.createdTxnDetails.result.id
        // id:'eukaew8lktw5nlwn',
        walletAddress: this.info.address
      };
      // console.log("get_transaction_history data", data);
      // let count = 1;
      // this.refreshTxnHistory = setInterval(() => {
      //   console.log("get status ::", count++);

      // this.$gateway.send("swap", "transaction_history", data);

      // this.$gateway.send("swap", "transaction_status", data);
      this.$gateway.send("swap", "transaction_history", data);
      //   if (this.txnStatus.hasOwnProperty("result")) {
      //     console.log("txnStatustxnStatus ", this.txnStatus);
      //     if (this.txnStatus.result[0].status !== "waiting") {
      //       console.log(
      //         "txnStatustxnStatus 2",
      //         this.txnStatus.result[0].status
      //       );
      //       this.navigation("swapStatus", 4);
      //     }
      //   }
      // }, 30000);
    }
  }
};
</script>
