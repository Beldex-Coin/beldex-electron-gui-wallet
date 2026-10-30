<template>
  <!-- Activity ledger rows -->
  <div class="tx-list">
    <template v-if="tx_list_paged.length === 0">
      <section class="tx-list__empty">
        <div class="tx-list__empty-icon">
          <img src="~assets/icons/tx-stake.svg" alt="" />
        </div>
        <p class="tx-list__empty-title">
          {{ $t("strings.noTransactionsFound") }}
        </p>
        <p class="tx-list__empty-hint">
          {{ $t("titles.swap.afterYourFirstTxn") }},
          {{ $t("titles.swap.youWillBeViewHere") }}.
        </p>
      </section>
    </template>

    <template v-else>
      <q-infinite-scroll ref="scroller" @load="loadMore">
        <q-list no-border dark class="tx-list__rows">
          <q-item
            v-for="(tx, i) in tx_list_paged"
            :key="`${tx.txid}-${tx.type}-${i}`"
            clickable
            class="tx-list__row"
            :class="'tx-' + tx.type"
            @click.native="details(tx)"
          >
            <TxTypeIcon :type="tx.type" :tooltip="false" />
            <div class="tx-list__main">
              <div class="tx-list__title">{{ tx.type | typeToString }}</div>
              <div class="tx-list__sub">
                <span class="beldex-truncate">{{
                  tx.txid.slice(0, 20) + "…"
                }}</span>
                <span>· {{ formatHeight(tx) }}</span>
              </div>
            </div>
            <div class="tx-list__meta">
              <div
                class="tx-list__amount"
                :class="{
                  'tx-list__amount--in': [
                    'in',
                    'miner',
                    'mnode',
                    'gov'
                  ].includes(tx.type),
                  'tx-list__amount--out': ['out', 'failed'].includes(tx.type),
                  'tx-list__amount--pending': ['pending', 'pool'].includes(
                    tx.type
                  )
                }"
              >
                {{ "out" === tx.type ? "-" : "" }}
                <FormatBeldex :amount="tx.amount || 0" />
              </div>
              <div class="tx-list__date">
                {{
                  `${
                    monthNames[new Date(tx.timestamp * 1000).getMonth()]
                  } ${new Date(tx.timestamp * 1000).getDate()}, ${new Date(
                    tx.timestamp * 1000
                  ).getFullYear()}`
                }}
              </div>
            </div>

            <ContextMenu
              :menu-items="menuItems"
              @copyTxId="copyTxId(tx.txid)"
              @showDetails="details(tx)"
              @openExplorer="openExplorer(tx.txid)"
            />
          </q-item>

          <beldex-spinner slot="message" :size="40" />
        </q-list>
      </q-infinite-scroll>
    </template>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
// import TxDetails from "components/tx_details";
import FormatBeldex from "components/format_beldex";
import { i18n } from "boot/i18n";
import ContextMenu from "components/menus/contextmenu";
import TxTypeIcon from "components/tx_type_icon";
import DateRangeFilterMixin from "src/mixins/date_range_filter_mixin";
export default {
  name: "TxList",
  filters: {
    typeToString: function(value) {
      switch (value) {
        case "in":
          return i18n.t("strings.transactions.received");
        case "out":
          return i18n.t("strings.transactions.sent");
        case "failed":
          return i18n.t("strings.transactions.types.failed");
        case "pending":
        case "pool":
          return i18n.t("strings.transactions.types.pending");
        case "miner":
          return i18n.t("strings.transactions.types.miner");
        case "mnode":
          return i18n.t("strings.transactions.types.masterNode");
        case "gov":
          return i18n.t("strings.transactions.types.governance");
        case "bns":
          return i18n.t("strings.transactions.types.bns");
        case "stake":
          return i18n.t("strings.transactions.types.stake");
        default:
          return "-";
      }
    }
  },
  components: {
    // TxDetails,
    FormatBeldex,
    ContextMenu,
    TxTypeIcon
  },
  mixins: [DateRangeFilterMixin],
  props: {
    limit: {
      type: Number,
      required: false,
      default: -1
    },
    type: {
      type: String,
      required: false,
      default: "all"
    },
    filter: {
      type: String,
      required: false,
      default: ""
    },
    dateRange: {
      type: Object,
      required: false,
      default: () => ({ from: null, to: null })
    },
    toOutgoingAddress: {
      type: String,
      required: false,
      default: ""
    },
    toIncomingAddressIndex: {
      type: Number,
      required: false,
      default: -1
    }
  },
  data() {
    const menuItems = [
      { action: "showDetails", i18n: "menuItems.showDetails" },
      { action: "copyTxId", i18n: "menuItems.copyTransactionId" },
      { action: "openExplorer", i18n: "menuItems.viewOnExplorer" }
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return {
      page: 0,
      tx_list_filtered: [],
      tx_list_paged: [],
      menuItems,
      monthNames,
      isVisible: true
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    current_height: state => state.gateway.daemon.info.height,
    wallet_height: state => state.gateway.wallet.info.height,
    tx_list: state => state.gateway.wallet.transactions.tx_list,
    address_book: state => state.gateway.wallet.address_list.address_book
  }),
  watch: {
    wallet_height: {
      handler(val, old) {
        if (val == old) return;
        this.filterTxList();
        this.pageTxList();
      }
    },
    tx_list: {
      handler(val, old) {
        // Check if anything changed in the tx list
        if (val.length == old.length) {
          const changed = val.filter((v, i) => v.note !== old[i].note);
          if (changed.length === 0) return;
        }
        this.filterTxList();
        this.pageTxList();
      }
    },
    type: {
      handler(val, old) {
        if (val == old) return;
        this.resetPagingAndRefilter();
      }
    },
    filter: {
      handler(val, old) {
        if (val == old) return;
        this.resetPagingAndRefilter();
      }
    },
    dateRange: {
      handler(val, old) {
        if (val === old) return;
        this.resetPagingAndRefilter();
      }
    }
  },
  created() {
    this.filterTxList();
    this.pageTxList();
  },
  methods: {
    resetPagingAndRefilter() {
      if (this.$refs.scroller) {
        this.$refs.scroller.stop();
        this.page = 0;
        this.$refs.scroller.reset();
        this.$refs.scroller.resume();
      }
      this.filterTxList();
      this.pageTxList();
    },
    filterTxList() {
      const all_in = ["in", "pool", "miner", "mnode", "gov", "bns"];
      const all_out = ["out", "pending", "stake"];
      const all_pending = ["pending", "pool"];
      this.tx_list_filtered = this.tx_list.filter(tx => {
        if (!this.isTxInDateRange(tx, this.dateRange)) {
          return false;
        }

        let valid = true;
        if (this.type === "all_in" && !all_in.includes(tx.type)) {
          return false;
        }

        if (this.type === "all_out" && !all_out.includes(tx.type)) {
          return false;
        }

        if (this.type === "all_pending" && !all_pending.includes(tx.type)) {
          return false;
        }

        if (!this.type.startsWith("all") && this.type !== tx.type) {
          valid = false;
          return valid;
        }

        if (this.filter !== "") {
          valid = this.txContains(tx, this.filter);
          return valid;
        }

        if (this.toOutgoingAddress !== "") {
          if (tx.hasOwnProperty("destinations")) {
            valid = tx.destinations.filter(destination => {
              return destination.address === this.toOutgoingAddress;
            }).length;
          } else {
            valid = false;
          }
          return valid;
        }

        if (this.toIncomingAddressIndex !== -1) {
          valid =
            tx.hasOwnProperty("subaddr_index") &&
            tx.subaddr_index.minor == this.toIncomingAddressIndex;
          return valid;
        }

        return valid;
      });
    },
    // txnTypeIndicate(value) {
    //   switch (value) {
    //     case "in":
    //       return require("../assets/images/recieve_icon.svg");
    //     case "out":
    //       return require("../assets/images/send_icon.svg");
    //     case "failed":
    //       return i18n.t("strings.transactions.types.failed");
    //     case "pending":
    //     case "pool":
    //       return require("../assets/images/pending.svg");
    //     case "miner":
    //       return i18n.t("strings.transactions.types.miner");
    //     case "mnode":
    //       return i18n.t("strings.transactions.types.masterNode");
    //     case "gov":
    //       return i18n.t("strings.transactions.types.governance");
    //     case "stake":
    //       return i18n.t("strings.transactions.types.stake");
    //     default:
    //       return "-";
    //   }
    // },
    txContains(tx, value) {
      // The tx can be searchable using:
      // id, address, notes, amount, recipient name
      const fields = [tx.txid, tx.note];

      const formattedAmount = tx.amount / 1e9;
      fields.push(String(formattedAmount));

      // Get all addresses and names and add them on
      const destinations = (tx.destinations || []).map(d => d.address);
      const addresses = [tx.address, ...destinations];
      const contacts = addresses
        .map(this.getContact)
        .filter(c => !!c)
        .map(c => c.name);
      fields.push(...addresses, ...contacts);

      return !!fields.find(f => f.toLowerCase().includes(value.toLowerCase()));
    },
    getContact(address) {
      return this.address_book.find(book => book.address === address);
    },
    pageTxList() {
      this.tx_list_paged = this.tx_list_filtered.slice(
        0,
        this.limit !== -1 ? this.limit : this.page * 24 + 24
      );
    },
    loadMore: function(index, done) {
      this.page = index;
      if (
        this.limit !== -1 ||
        this.tx_list_filtered.length < this.page * 24 + 24
      ) {
        this.$refs.scroller.stop();
      }
      this.pageTxList();
      this.$nextTick(() => {
        done();
      });
    },
    details(tx) {
      this.$emit("submitTxDetails", tx);
    },
    formatHeight(tx) {
      let height = tx.height;
      if (height == 0) return this.$t("strings.transactions.types.pending");
      return (
        this.$t("strings.height") +
        `: ${height} (${this.$t("strings.transactionConfirmed")})`
      );
    },
    copyTxId(txid) {
      clipboard.writeText(txid);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.copied", {
          item: "Txid"
        })
      });
    },
    openExplorer(txid) {
      this.$gateway.send("core", "open_explorer", {
        type: "tx",
        id: txid
      });
    }
  }
};
</script>

<style lang="scss">
.beldex-app .tx-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  &__empty {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--beldex-space-2);
    min-height: 260px;
    text-align: center;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-bottom: var(--beldex-space-3);
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid rgba(235, 235, 235, 0.1);

    img {
      width: 16px;
      height: 16px;
    }
  }

  &__empty-title {
    margin: 0;
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-base);
    color: var(--beldex-text);
  }

  &__empty-hint {
    max-width: 240px;
    margin: 0;
    font-size: var(--beldex-text-sm);
    line-height: 16px;
    color: var(--beldex-text-faint);
  }

  &__rows {
    padding: 0;
    background: transparent;
  }

  &__row {
    gap: var(--beldex-space-4);
    min-height: 59px;
    padding: var(--beldex-space-3) var(--beldex-space-2);
    border-bottom: 1px solid var(--beldex-hairline);

    &:hover {
      background-color: rgba(235, 235, 235, 0.03);
    }
  }

  &__main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: #acacac;
  }

  &__sub {
    display: flex;
    gap: var(--beldex-space-1);
    min-width: 0;
    font-size: var(--beldex-text-sm);
    line-height: 16px;
    color: var(--beldex-text-faint);
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    white-space: nowrap;
  }

  &__amount {
    font-size: var(--beldex-text-md);
    font-weight: 700;
    line-height: 16px;
    color: #acacac;

    .coin-extensions {
      color: inherit;
    }

    &--in {
      color: var(--beldex-accent);
    }

    &--out {
      color: var(--beldex-danger);
    }

    &--pending {
      color: var(--beldex-warning-strong);
    }
  }

  &__date {
    font-size: var(--beldex-text-xs);
    line-height: 15px;
    color: var(--beldex-text-faint);
  }
}
</style>
