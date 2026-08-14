<template>
  <div v-if="isVisible" class="swapTxnHistory">
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
          {{ $t("titles.swap.history") }}
        </div>
      </div>
      <div class="row items-center no-wrap q-mr-sm">
        <div v-if="totalPages > 1" class="custom-pagination  q-mr-sm">
          <q-btn
            flat
            no-caps
            label="Prev"
            class="page-btn nav-btn"
            :disable="isLoading || currentPage === 1"
            @click="changePage(currentPage - 1)"
          />

          <q-btn
            v-for="page in visiblePages"
            :key="page"
            :label="page === '...' ? '...' : String(page)"
            :disable="page === '...' || isLoading"
            unelevated
            no-caps
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="page !== '...' && changePage(page)"
          />

          <q-btn
            flat
            no-caps
            label="Next"
            class="page-btn nav-btn"
            :disable="isLoading || currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          />
        </div>

        <q-btn
          v-if="this.txnHistory.length > 0"
          color="primary"
          class="downloadCsv-btn"
          :loading="isCsvExporting"
          :disable="isCsvExporting"
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
          <span class="q-ml-xs">{{ $t("titles.swap.downloadCsv") }}</span>
        </q-btn>
      </div>
    </header>

    <div v-if="isLoading" class="q-mt-lg">
      <q-inner-loading :showing="true">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
    <div v-else-if="this.txnHistory.length === 0">
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
      <q-inner-loading :showing="isLoading">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
      <table style="width: 100%" class="txn-details-wrapper">
        <tr>
          <th>{{ $t("titles.swap.status") }}</th>
          <th>{{ $t("titles.swap.date") }}</th>
          <th>{{ $t("titles.swap.exchangeAmount") }}</th>
          <th>{{ $t("titles.swap.exchangeRate") }}</th>
          <th>{{ $t("titles.swap.receiver") }}</th>
          <th>{{ $t("titles.swap.amountReceived") }}</th>
          <th>Type</th>
        </tr>
        <tr
          v-for="(item, i) in paginatedHistory"
          :key="item.id || i"
          @click="setTxnDetails(item)"
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
            {{ formatTime(item.createdAt || item.created_at) }}
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
              item.payoutAddress
                ? item.payoutAddress.substr(0, 4) +
                  "..." +
                  item.payoutAddress.substr(
                    item.payoutAddress.length - 4,
                    item.payoutAddress.length
                  )
                : "N/A"
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
          <td
            class="ft-semibold cursor"
            style="font-size: 1rem;"
            :class="[!item.privacySwap ? 'swap_indicator_normal' : '']"
          >
            {{
              item.privacySwap ? $t("strings.privacy") : $t("strings.normal")
            }}
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
  </div>
  <SwapTxnCompeleted
    v-else-if="txnDetails?.status === 'finished'"
    :txn-status="txnDetails"
    from="history"
    @goback="backToHistoryList"
  />
  <swapWaitingTxnHistory
    v-else-if="txnDetails?.status === 'waiting'"
    :txn-details="txnDetails"
    @goback="backToHistoryList"
    @backToSwap="backToSwap"
  />
  <SwapTxnDetails
    v-else
    :txn-details="this.txnDetails"
    @goback="backToHistoryList"
    @backToSwap="backToSwap"
  />
</template>

<script>
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
    },
    privacySwap: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isVisible: true,
      refreshTxnStatus: null,
      refreshTxnHistory: "",
      txnDetails: "",
      currentPage: 1,
      rowsPerPage: 7,
      csvExportPageSize: 100000,
      isLoading: false,
      isCsvExporting: false
    };
  },
  created() {
    this.get_transaction_History(this.privacySwap, 1);
  },
  beforeDestroy() {
    if (this.refreshTxnStatus) {
      clearInterval(this.refreshTxnStatus);
      this.refreshTxnStatus = null;
    }
  },
  computed: {
    ...mapState({
      txnHistory: state => {
        return [...(state.gateway.txnHistory || [])].sort((a, b) => {
          const ta = new Date(
            (a && (a.createdAt || a.created_at)) || 0
          ).getTime();
          const tb = new Date(
            (b && (b.createdAt || b.created_at)) || 0
          ).getTime();
          return tb - ta;
        });
      },
      txnHistoryMeta: state => {
        return (
          state.gateway.txnHistoryMeta || {
            totalCount: 0,
            totalPages: 0,
            page: 1,
            pageSize: 7
          }
        );
      },
      info: state => state.gateway.wallet.info,
      storeTxnStatus: state => state.gateway.txnStatus
    }),

    totalPages() {
      const totalCount = Number(this.txnHistoryMeta.totalCount || 0);
      if (!totalCount) {
        return 0;
      }
      return Math.ceil(totalCount / this.rowsPerPage);
    },

    paginatedHistory() {
      return this.txnHistory;
    },
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      if (current <= 2) {
        return [1, 2, 3, "...", total];
      }

      if (current === 3) {
        return [1, 2, 3, 4, "...", total];
      }

      if (current >= total - 2) {
        return [1, "...", total - 2, total - 1, total];
      }

      return [1, "...", current - 1, current, current + 1, "...", total];
    }
  },
  watch: {
    txnHistoryMeta: {
      deep: true,
      handler() {
        if (this.isLoading) {
          this.isLoading = false;
        }
      }
    },
    txnHistory: {
      deep: true,
      handler(newValue) {
        if (this.isCsvExporting) {
          this.exportCsvFromHistory(newValue);
        }
      }
    },
    storeTxnStatus(newStatus) {
      if (
        newStatus &&
        newStatus.hasOwnProperty("result") &&
        Array.isArray(newStatus.result) &&
        newStatus.result.length > 0
      ) {
        const details = newStatus.result[0];
        if (
          this.txnDetails &&
          (this.txnDetails.id === details.id ||
            this.txnDetails.id === newStatus.id)
        ) {
          const cleanDetails = Object.keys(details).reduce((acc, key) => {
            if (
              details[key] !== undefined &&
              details[key] !== null &&
              details[key] !== ""
            ) {
              acc[key] = details[key];
            }
            return acc;
          }, {});
          this.txnDetails = { ...this.txnDetails, ...cleanDetails };
          const terminalStatuses = [
            "finished",
            "failed",
            "refunded",
            "expired",
            "overdue"
          ];
          if (terminalStatuses.includes(details.status)) {
            if (this.refreshTxnStatus) {
              clearInterval(this.refreshTxnStatus);
              this.refreshTxnStatus = null;
            }
          }
        }
      }
    }
  },

  methods: {
    backToSwap() {
      if (this.refreshTxnStatus) {
        clearInterval(this.refreshTxnStatus);
        this.refreshTxnStatus = null;
      }
      this.$emit("goback");
    },
    backToHistoryList() {
      this.get_transaction_History(this.privacySwap, this.currentPage || 1);
      if (this.refreshTxnStatus) {
        clearInterval(this.refreshTxnStatus);
        this.refreshTxnStatus = null;
      }
      this.isVisible = true;
      this.txnDetails = "";
    },

    formatTime(value, { utc = false } = {}) {
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

      const getDay = utc ? date.getUTCDate() : date.getDate();
      const getMonthIdx = utc ? date.getUTCMonth() : date.getMonth();
      const getYear = utc ? date.getUTCFullYear() : date.getFullYear();
      const getHours = utc ? date.getUTCHours() : date.getHours();
      const getMinutes = utc ? date.getUTCMinutes() : date.getMinutes();
      const getSeconds = utc ? date.getUTCSeconds() : date.getSeconds();

      const day = getDay.toString().padStart(2, "0");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      const month = months[getMonthIdx];
      const hours = getHours.toString().padStart(2, "0");
      const minutes = getMinutes.toString().padStart(2, "0");
      const seconds = getSeconds.toString().padStart(2, "0");

      return `${day} ${month} ${getYear} ${hours}:${minutes}:${seconds}`;
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
    setTxnDetails(item) {
      if (this.refreshTxnStatus) {
        clearInterval(this.refreshTxnStatus);
        this.refreshTxnStatus = null;
      }
      this.txnDetails = item;
      this.isVisible = false;

      if (!item || !item.id) return;

      const data = {
        id: item.id,
        privacySwap: Boolean(item.privacySwap),
        exchange: item.exchange_type || item.exchange,
        walletAddress: this.info?.address
      };

      const terminalStatuses = [
        "finished",
        "failed",
        "refunded",
        "expired",
        "overdue"
      ];
      if (!terminalStatuses.includes(item.status)) {
        this.$gateway.send("swap", "transaction_status", data);
        this.refreshTxnStatus = setInterval(() => {
          this.$gateway.send("swap", "transaction_status", data);
        }, 30000);
      }
    },
    changePage(page) {
      if (this.isLoading || page < 1 || page > this.totalPages) {
        return;
      }
      this.currentPage = page;
      this.get_transaction_History(this.privacySwap, this.currentPage);
    },
    getTransactionTimestamp(item) {
      if (!item) return 0;
      const value = item.createdAt || item.created_at || 0;
      if (typeof value === "string" && isNaN(value)) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? 0 : date.getTime();
      }
      let num = Number(value);
      if (isNaN(num)) return 0;
      const digits = Math.floor(Math.abs(num)).toString().length;
      if (digits >= 16) return Math.floor(num / 1000);
      if (digits <= 10) return num * 1000;
      return num;
    },
    downloadCsv() {
      this.isCsvExporting = true;
      this.get_transaction_History(this.privacySwap, 1, { isCsvExport: true });
    },
    exportCsvFromHistory(history = this.txnHistory) {
      try {
        let customizeCsv = [];
        let csv = "";
        const historyToExport = [...(history || [])].sort((a, b) => {
          const ta = this.getTransactionTimestamp(a);
          const tb = this.getTransactionTimestamp(b);
          return tb - ta;
        });

        if (historyToExport.length === 0) {
          this.$q.notify({
            type: "negative",
            timeout: 2000,
            message: this.$t("notification.errors.errorSavingItem", {
              item: "CSV Report"
            })
          });
          return;
        }

        historyToExport.forEach(item => {
          if (!item) return;
          let csvObj = {};
          const ts = item.createdAt || item.created_at || null;
          csvObj.Date = ts ? this.formatTime(ts) : "N/A";
          csvObj.Status = item.status || "N/A";
          csvObj.Exchange_Currency =
            (item.currencyFrom || "").toUpperCase() +
            " -> " +
            (item.currencyTo || "").toUpperCase();
          csvObj.Exchange_Amount = item.amountExpectedFrom ?? "N/A";
          csvObj.Exchange_rate = item.rate ?? "N/A";
          csvObj.Received_Amount = item.amountExpectedTo ?? "N/A";
          csvObj.Swap_Type = item.privacySwap ? "Privacy" : "Normal";
          csvObj.Receiver_Address = item.payoutAddress || "N/A";
          customizeCsv.push(csvObj);
        });

        if (customizeCsv.length === 0) {
          this.$q.notify({
            type: "negative",
            timeout: 2000,
            message: this.$t("notification.errors.errorSavingItem", {
              item: "CSV Report"
            })
          });
          return;
        }

        const headers = Object.keys(customizeCsv[0]);
        const csvRows = [
          headers.join(","),
          ...customizeCsv.map(row =>
            headers
              .map(key => {
                const val = row[key] ?? "";
                const str = String(val).replace(/"/g, '""');
                return str.includes(",") ||
                  str.includes('"') ||
                  str.includes("\n")
                  ? `"${str}"`
                  : str;
              })
              .join(",")
          )
        ];
        csv = csvRows.join("\r\n");

        if (!csv || !csv.trim()) {
          this.$q.notify({
            type: "negative",
            timeout: 2000,
            message: this.$t("notification.errors.errorSavingItem", {
              item: "CSV Report"
            })
          });
          return;
        }

        this.$gateway.send("core", "save_csv", {
          defaultFilename: "Beldex_wallet_swap_transaction_report.csv",
          csv
        });
      } catch (err) {
        console.error("[SwapTxnHistory] exportCsvFromHistory error:", err);
        this.$q.notify({
          type: "negative",
          timeout: 2000,
          message: this.$t("notification.errors.errorSavingItem", {
            item: "CSV Report"
          })
        });
      } finally {
        this.isCsvExporting = false;
        this.get_transaction_History(this.privacySwap, this.currentPage);
      }
    },
    get_transaction_History(privacySwap, page = 1, options = {}) {
      const isCsvExport = Boolean(options.isCsvExport);
      if (this.isLoading && !isCsvExport) {
        return;
      }
      if (isCsvExport) {
        this.isCsvExporting = true;
      } else {
        this.isLoading = true;
      }
      if (!isCsvExport) {
        this.currentPage = page;
      }
      let data = {
        // id: this.createdTxnDetails.result.id
        // id:'eukaew8lktw5nlwn',
        walletAddress: this.info.address,
        privacySwap: privacySwap,
        page: isCsvExport ? 1 : this.currentPage,
        pageSize: isCsvExport ? this.csvExportPageSize : this.rowsPerPage,
        isCsvExport
      };
      this.$gateway.send("swap", "transaction_history", data);
    }
  }
};
</script>
