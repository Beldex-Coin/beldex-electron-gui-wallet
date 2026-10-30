<template>
  <div v-if="isVisible" class="swapTxnHistory">
    <!-- Swap history -->
    <header class="swapHistory__head">
      <div class="swapHistory__title-wrap">
        <button
          type="button"
          class="beldex-square-btn"
          :aria-label="$t('buttons.back')"
          @click="backToSwap"
        >
          <q-icon name="arrow_back" size="16px" />
        </button>
        <h2 class="swapHistory__title">{{ $t("titles.swap.swapHistory") }}</h2>
        <span class="swapHistory__count">
          {{ txnHistory.length }} {{ $t("titles.swap.swaps") }}
        </span>
      </div>
      <div class="swapHistory__actions">
        <q-btn
          v-if="txnHistory.length > 0"
          icon="file_download"
          :label="$t('titles.swap.downloadCsv')"
          class="beldex-btn beldex-btn--ghost swapHistory__csv"
          unelevated
          no-caps
          :loading="isCsvExporting"
          :disable="isCsvExporting"
          @click="downloadCsv"
        />
        <div class="beldex-segmented" role="tablist">
          <button
            type="button"
            role="tab"
            class="beldex-segmented__item"
            aria-selected="false"
            @click="backToSwap"
          >
            {{ $t("titles.swap.exchange") }}
          </button>
          <button
            type="button"
            role="tab"
            class="beldex-segmented__item beldex-segmented__item--active"
            aria-selected="true"
          >
            <span class="beldex-segmented__dot" />
            {{ $t("titles.swap.history") }}
          </button>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="q-mt-lg">
      <q-inner-loading :showing="true">
        <beldex-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
    <!-- Empty state -->
    <section v-else-if="txnHistory.length === 0" class="swapHistory__empty">
      <div ref="emptyArt" class="swapHistory__empty-art" aria-hidden="true" />
      <p class="swapHistory__empty-title">{{ $t("titles.swap.noSwapsYet") }}</p>
      <p class="swapHistory__empty-hint">
        {{ $t("titles.swap.noSwapsYetDisc") }}
      </p>
      <button type="button" class="swapHistory__empty-btn" @click="backToSwap">
        <img src="~assets/icons/swap-nav.svg" alt="" />
        {{ $t("titles.swap.newExchange") }}
      </button>
    </section>
    <section v-else class="swapHistory__table-wrap">
      <q-inner-loading :showing="isLoading">
        <beldex-spinner color="primary" size="30" />
      </q-inner-loading>
      <table style="width: 100%" class="txn-details-wrapper">
        <tr>
          <th>{{ $t("titles.swap.status") }}</th>
          <th>{{ $t("titles.swap.date") }}</th>
          <th>{{ $t("titles.swap.exchangeAmount") }}</th>
          <th>{{ $t("titles.swap.exchangeRate") }}</th>
          <th>{{ $t("titles.swap.receiver") }}</th>
          <th>{{ $t("titles.swap.amountReceived") }}</th>
          <th>{{ $t("titles.swap.swapType") }}</th>
          <th></th>
        </tr>
        <tr
          v-for="(item, i) in paginatedHistory"
          :key="item.id || i"
          @click="setTxnDetails(item)"
        >
          <td v-if="item" class="cursor">
            <span
              class="swapHistory__status"
              :class="`swapHistory__status--${statusMeta(item.status).tone}`"
              >{{ $t(statusMeta(item.status).label) }}</span
            >
          </td>
          <td v-if="item" class="cursor swapHistory__muted">
            {{ formatTime(item.createdAt || item.created_at) }}
          </td>
          <td v-if="item" class="cursor swapHistory__strong uppercase">
            {{ item.amountExpectedFrom }} {{ item.currencyFrom }}
          </td>
          <td v-if="item" class="cursor swapHistory__muted uppercase">
            1 {{ item.currencyFrom }} ≈ {{ Number(item.rate).toFixed(4) }}
            {{ item.currencyTo }}
          </td>
          <td v-if="item" class="cursor">
            {{
              item.payoutAddress
                ? item.payoutAddress.substr(0, 4) +
                  "…" +
                  item.payoutAddress.substr(
                    item.payoutAddress.length - 4,
                    item.payoutAddress.length
                  )
                : "N/A"
            }}
          </td>
          <td
            v-if="item"
            class="cursor swapHistory__strong uppercase"
            :class="{ 'swapHistory__strong--done': item.status == 'finished' }"
          >
            {{ hasKnownAmount(item.status) ? amountReceived(item) : "---" }}
          </td>
          <td
            class="cursor swapHistory__muted"
            :class="{ 'swapHistory__muted--accent': item.privacySwap }"
          >
            {{
              item.privacySwap ? $t("strings.privacy") : $t("strings.normal")
            }}
          </td>
          <td class="cursor swapHistory__chevron">
            <q-icon name="chevron_right" size="16px" />
          </td>
        </tr>
      </table>

      <div v-if="totalPages > 1" class="swapHistory__pager custom-pagination">
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
    </section>
  </div>
  <SwapTxnCompeleted
    v-else-if="txnDetails?.status === 'finished'"
    :txn-status="txnDetails"
    from="history"
    @goback="backToHistoryList"
    @backToSwap="backToSwap"
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
// The light build has no expression engine, so it never needs eval, which
// the production CSP blocks.
import lottie from "lottie-web/build/player/lottie_light";
import emptyAnimation from "assets/animations/beldex-swap-empty.json";

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
  mounted() {
    this.syncEmptyAnimation();
  },
  updated() {
    this.syncEmptyAnimation();
  },
  beforeDestroy() {
    this.destroyEmptyAnimation();
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
    // The empty state is a v-else-if branch, so its container comes and goes.
    syncEmptyAnimation() {
      const el = this.$refs.emptyArt;
      if (el && this.emptyPlayerEl !== el) {
        this.destroyEmptyAnimation();
        this.emptyPlayer = lottie.loadAnimation({
          container: el,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: emptyAnimation
        });
        this.emptyPlayerEl = el;
      } else if (!el) {
        this.destroyEmptyAnimation();
      }
    },
    destroyEmptyAnimation() {
      if (this.emptyPlayer) {
        this.emptyPlayer.destroy();
        this.emptyPlayer = null;
        this.emptyPlayerEl = null;
      }
    },
    statusMeta(status) {
      switch (status) {
        case "finished":
          return { tone: "done", label: "titles.swap.statusCompleted" };
        case "failed":
          return { tone: "danger", label: "titles.swap.statusFailed" };
        case "refunded":
          return { tone: "danger", label: "titles.swap.statusRefund" };
        case "overdue":
        case "expired":
          return { tone: "danger", label: "titles.swap.statusExpired" };
        case "waiting":
          return { tone: "muted", label: "titles.swap.statusWaiting" };
        default:
          return { tone: "warn", label: "titles.swap.statusPending" };
      }
    },
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

    // finished, sending, confirming and exchanging all have a real
    // currencyTo/amountExpectedTo to show (as an estimate until finished).
    // Excludes refunded: a refund returns the original currencyFrom
    // amount, which amountReceived() doesn't compute, so it stays "---"
    // rather than showing the wrong currency.
    hasKnownAmount(status) {
      return ["finished", "sending", "confirming", "exchanging"].includes(
        status
      );
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
