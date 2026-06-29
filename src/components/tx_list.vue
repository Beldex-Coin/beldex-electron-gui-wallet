<template>
  <div class="tx-list">
    <template v-if="tx_list_paged.length === 0">
      <section
        class="flex column justify-center items-center"
        style="height: 39vh"
      >
        <div>
          <img src="../assets/images/No_transaction.svg" height="119px" />
        </div>
        <p class="q-pb-md q-pt-sm q-mb-none qtab-desc ft-semibold infoTxt">
          {{ $t("strings.noTransactionsFound") }}
        </p>

        <div class="hint-txt">After your first transaction,</div>
        <div class="hint-txt">you will be able to view it here.</div>
      </section>
    </template>

    <template v-else>
      <!-- <section v-if="true"> -->

      <q-infinite-scroll ref="scroller" @load="loadMore">
        <q-list
          link
          no-border
          :dark="theme == 'dark'"
          class="oxen-list tx-list"
        >
          <q-item
            v-for="(tx, i) in tx_list_paged"
            :key="`${tx.txid}-${tx.type}-${i}`"
            class="oxen-list-item transaction"
            :class="'tx-' + tx.type"
            @click.native="details(tx)"
          >
            <q-item-section class="type flex items-center">
              <div>
                <!-- <img
                  :src="txnTypeIndicate(tx.type)"
                  width="20px"
                  height="20px"
                />-->
                <TxTypeIcon :type="tx.type" :tooltip="false" />
              </div>
              <!-- <div>{{ tx.type | typeToString }}</div> -->
            </q-item-section>
            <q-item-label class="main">
              <q-item-label class="amount ft-semibold">
                {{ "out" === tx.type ? "-" : "" }}
                <FormatOxen :amount="tx.amount || 0" />
              </q-item-label>
              <q-item-label class="txn_id ft-Light" caption>{{
                tx.txid
              }}</q-item-label>
            </q-item-label>
            <q-item-section class="meta">
              <q-item-label class="ft-small">
                {{
                  `${
                    monthNames[new Date(tx.timestamp * 1000).getMonth()]
                  } ${new Date(tx.timestamp * 1000).getDate()},${new Date(
                    tx.timestamp * 1000
                  ).getFullYear()}`
                }}
                <!-- <timeago
                  :datetime="tx.timestamp * 1000"
                  :auto-update="60"
                  :locale="$i18n.locale"
                />-->
              </q-item-label>
              <q-item-label caption class="blk-height-txt ft-Light">{{
                formatHeight(tx)
              }}</q-item-label>
            </q-item-section>

            <div class="q-ml-lg q-mr-xs flex items-center">
              <svg
                width="9"
                height="13"
                viewBox="0 0 9 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.148438 1.87727V11.9944C0.148438 12.7651 0.855307 13.232 1.39581 12.8188L7.99948 7.76076C8.50103 7.37686 8.50103 6.49673 7.99948 6.11283L1.39581 1.05282C0.855307 0.638642 0.148438 1.10655 0.148438 1.87727Z"
                  fill="#8787A8"
                />
              </svg>
            </div>

            <ContextMenu
              :menu-items="menuItems"
              @copyTxId="copyTxId(tx.txid)"
              @showDetails="details(tx)"
              @openExplorer="openExplorer(tx.txid)"
            />
            <div class="hr-separator" />
          </q-item>

          <QSpinnerDots slot="message" :size="40"></QSpinnerDots>
        </q-list>
      </q-infinite-scroll>
      <!-- </section> -->
      <!-- <section v-else> -->
      <!-- <TxDetails ref="txDetails"/> -->
      <!-- </section> -->
    </template>

    <!-- <TxDetails  ref="txDetails"/> -->
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import { QSpinnerDots } from "quasar";
// import TxDetails from "components/tx_details";
import FormatOxen from "components/format_oxen";
import { i18n } from "boot/i18n";
import ContextMenu from "components/menus/contextmenu";
import TxTypeIcon from "components/tx_type_icon";
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
    QSpinnerDots,
    // TxDetails,
    FormatOxen,
    ContextMenu,
    TxTypeIcon
  },
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
        if (this.$refs.scroller) {
          this.$refs.scroller.stop();
          this.page = 0;
          this.$refs.scroller.reset();
          this.$refs.scroller.resume();
        }
        this.filterTxList();
        this.pageTxList();
      }
    },
    filter: {
      handler(val, old) {
        if (val == old) return;
        if (this.$refs.scroller) {
          this.$refs.scroller.stop();
          this.page = 0;
          this.$refs.scroller.reset();
          this.$refs.scroller.resume();
        }
        this.filterTxList();
        this.pageTxList();
      }
    }
  },
  created() {
    this.filterTxList();
    this.pageTxList();
  },
  methods: {
    filterTxList() {
      const all_in = ["in", "pool", "miner", "mnode", "gov", "bns"];
      const all_out = ["out", "pending", "stake"];
      const all_pending = ["pending", "pool"];
      this.tx_list_filtered = this.tx_list.filter(tx => {
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
.tx-list {
  .oxen-list-item {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 0;
  }
  .oxen-list-item:hover {
    background-color: #2c2c43;
  }

  .infoTxt {
    color: white;
  }
  // .q-item__label {
  //   line-height: 1.2em !important;
  //   max-width: 60%;
  // }
  .transaction {
    .main {
      margin: 0;
      padding: 8px 10px;
      width: 60%;
      .amount {
        color: #d1d1d3;
        span {
          color: #d1d1d3;
        }
      }
      .txn_id {
        font-size: 12 px;
        color: #d1d1d3;
      }
      div {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .blk-height-txt {
      color: #afafbe;
    }
    .type {
      min-width: 45px;
      max-width: 45px;
      div {
        margin-right: 8px;
      }
    }
  }
  .hint-txt {
    color: #82828d;
  }
}
</style>
