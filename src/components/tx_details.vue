<template>
  <!-- Transaction details, shown in the activity panel. Handlers unchanged. -->
  <div class="txn-details">
    <div class="txn-details__head">
      <div class="txn-details__title-group">
        <button
          type="button"
          class="beldex-icon-btn"
          :aria-label="$t('buttons.back')"
          @click="goback()"
        >
          ←
        </button>
        <h2 class="txn-details__title">
          {{ $t("titles.swap.transactionDetails") }}
        </h2>
        <span
          class="txn-details__type"
          :class="`txn-details__type--${tx.type}`"
          >{{
            $t(
              {
                in: "strings.transactions.types.incoming",
                out: "strings.transactions.types.outgoing",
                pool: "strings.transactions.types.pendingIncoming",
                pending: "strings.transactions.types.pendingOutgoing",
                failed: "strings.transactions.types.failed",
                miner: "strings.transactions.types.miner",
                mnode: "strings.transactions.types.masterNode",
                gov: "strings.transactions.types.governance",
                bns: "strings.transactions.types.bns",
                stake: "strings.transactions.types.stake"
              }[tx.type] || "strings.transactions.types.all"
            )
          }}</span
        >
      </div>
      <div class="txn-details__actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost txn-details__action"
          unelevated
          no-caps
          @click="copyAddress(tx.txid)"
        >
          <img src="~assets/icons/copy.svg" alt="" />
          {{ $t("menuItems.copyTransactionId") }}
        </q-btn>
        <q-btn
          v-if="can_open"
          class="beldex-btn beldex-btn--ghost txn-details__action"
          unelevated
          no-caps
          :label="$t('buttons.viewOnExplorer')"
          @click="openExplorer"
        />
        <q-btn
          class="beldex-btn beldex-btn--ghost txn-details__action"
          unelevated
          no-caps
          :label="$t('buttons.showTxDetails')"
          @click="showTxnDetails(true)"
        />
      </div>
    </div>

    <div class="txn-details__hero">
      <div>
        <span class="beldex-label">{{
          $t("strings.transactions.amount")
        }}</span>
        <div
          class="txn-details__amount"
          :class="{
            'txn-details__amount--in': ['in', 'miner', 'mnode', 'gov'].includes(
              tx.type
            ),
            'txn-details__amount--out': ['out', 'failed'].includes(tx.type),
            'txn-details__amount--pending': ['pending', 'pool'].includes(
              tx.type
            )
          }"
        >
          {{ "out" === tx.type ? "-" : "" }}
          <FormatBeldex :amount="tx.amount" raw-value />
        </div>
      </div>
      <div class="txn-details__status-block">
        <span class="beldex-label">{{ $t("footer.status") }}</span>
        <span
          class="beldex-net-chip"
          :class="{
            'txn-details__status--pending': ['pending', 'pool'].includes(
              tx.type
            )
          }"
        >
          <span class="beldex-net-chip__dot" />
          {{
            ["pending", "pool"].includes(tx.type)
              ? $t("strings.transactions.types.pending")
              : $t("strings.confirmed")
          }}
        </span>
      </div>
    </div>

    <dl class="txn-details__rows">
      <div class="txn-details__row">
        <dt>{{ $t("strings.transactions.date") }}</dt>
        <dd>{{ formatDate(tx.timestamp * 1000) }}</dd>
      </div>
      <div class="txn-details__row">
        <dt>
          {{ $t("strings.transactions.fee") }}
          <template v-if="tx.type == 'in' || tx.type == 'pool'">
            ({{ $t("strings.transactions.paidBySender") }})
          </template>
        </dt>
        <dd><FormatBeldex :amount="tx.fee" raw-value /></dd>
      </div>
      <div class="txn-details__row">
        <dt>{{ $t("strings.blockHeight") }}</dt>
        <dd>{{ tx.height }}</dd>
      </div>
      <div v-if="tx.payment_id != '0000000000000000'" class="txn-details__row">
        <dt>{{ $t("strings.paymentID") }}</dt>
        <dd>{{ tx.payment_id ? tx.payment_id : "N/A" }}</dd>
      </div>
    </dl>

    <div class="txn-details__block">
      <span class="beldex-label">{{ $t("strings.transactionID") }}</span>
      <div class="beldex-copy-row">
        <span class="beldex-copy-row__value">{{ tx.txid }}</span>
        <button
          type="button"
          class="beldex-copy-row__btn"
          :aria-label="$t('menuItems.copyTransactionId')"
          @click="copyAddress(tx.txid)"
        >
          <img src="~assets/icons/copy.svg" alt="" />
        </button>
      </div>
    </div>

    <div class="txn-details__block txn-details__destinations">
      <div
        v-if="tx.type == 'in' || tx.type == 'pool'"
        class="tx_details_wrapper ft-regular"
      >
        <q-list no-border>
          <q-item header class="q-px-none text">
            {{
              $t("strings.transactions.sentTo", {
                type: $t("strings.transactions.types.incoming")
              })
            }}:
          </q-item>
          <q-item class="q-px-none value ft-regular">
            <q-item-label>
              <q-item-label class="non-selectable">{{
                in_tx_address_used.address_index_text
              }}</q-item-label>
              <q-item-label class="ellipsis" style="color: #afafbe">{{
                in_tx_address_used.address
              }}</q-item-label>
            </q-item-label>
            <ContextMenu
              :menu-items="menuItems"
              @copyAddress="copyAddress(in_tx_address_used.address)"
            />
          </q-item>
        </q-list>
      </div>

      <div v-else-if="tx.type == 'out' || tx.type == 'pending'">
        <q-list no-border>
          <q-item header class="q-px-none">
            {{
              $t("strings.transactions.sentTo", {
                type: $t("strings.transactions.types.outgoing")
              })
            }}:
          </q-item>
          <template v-if="out_destinations">
            <q-item
              v-for="destination in out_destinations"
              :key="destination.address"
              class="q-px-none"
            >
              <q-item-label>
                <q-item-label>{{ destination.name }}</q-item-label>
                <q-item-label class="ellipsis">{{
                  destination.address
                }}</q-item-label>
                <q-item-label
                  ><FormatBeldex :amount="destination.amount"
                /></q-item-label>
              </q-item-label>
              <ContextMenu
                :menu-items="menuItems"
                @copyAddress="copyAddress(destination.address)"
              />
            </q-item>
          </template>
          <template v-else>
            <q-item class="q-px-none">
              <q-item-label>
                <q-item-label header>{{
                  $t("strings.destinationUnknown")
                }}</q-item-label>
              </q-item-label>
            </q-item>
          </template>
        </q-list>
      </div>
    </div>

    <div class="txn-details__block">
      <div class="txn-details__notes-head">
        <span class="beldex-label">{{
          $t("fieldLabels.transactionNotes")
        }}</span>
        <button
          v-if="!editNotes"
          type="button"
          class="txn-details__edit"
          @click="editNotes = true"
        >
          <q-icon name="edit_note" size="14px" />
          {{ $t("buttons.editNotes") }}
        </button>
      </div>
      <BeldexField v-if="editNotes">
        <q-input
          v-model="txNotes"
          type="textarea"
          rows="2"
          dark
          dense
          borderless
          :aria-label="$t('fieldLabels.transactionNotes')"
        />
      </BeldexField>
      <p v-else class="txn-details__notes">
        {{
          txNotes
            ? txNotes
            : `The notes are saved to remark the details about the transaction.
               You can change this by hitting edit note.`
        }}
      </p>
      <div v-if="editNotes" class="txn-details__notes-actions">
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :disable="!is_ready"
          :label="$t('buttons.saveTxNotes')"
          @click="saveTxNotes"
        />
      </div>
    </div>

    <!-- Transaction details. -->
    <q-dialog ref="txnDetails" minimized>
      <q-card class="beldex-dialog beldex-dialog--wide txn-raw-dialog">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <img src="~assets/icons/file-text-accent.svg" alt="" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("dialog.transactionDetails.title") }}
            </h2>
            <p class="beldex-dialog__subtitle">
              {{ $t("dialog.transactionDetails.subtitle") }}
            </p>
          </div>
        </div>
        <pre class="txn-raw-dialog__json">{{ txJson }}</pre>
        <div class="beldex-dialog__actions">
          <q-btn
            class="beldex-btn beldex-btn--ghost txn-raw-dialog__copy"
            unelevated
            no-caps
            @click="copyTxJson"
          >
            <img src="~assets/icons/copy-json.svg" alt="" />
            {{ $t("buttons.copyJson") }}
          </q-btn>
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :label="$t('buttons.close')"
            @click="showTxnDetails(false)"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import { date } from "quasar";
// import TxTypeIcon from "components/tx_type_icon";
import FormatBeldex from "components/format_beldex";
import BeldexField from "components/beldex_field";
import ContextMenu from "components/menus/contextmenu";
export default {
  name: "TxDetails",
  components: {
    // TxTypeIcon,
    FormatBeldex,
    BeldexField,
    ContextMenu
  },
  props: ["tx"],
  data() {
    const menuItems = [
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];
    return {
      isVisible: false,
      txNotes: "",
      editNotes: false,
      // tx: {
      //   address: "",
      //   amount: 0,
      //   double_spend_seen: false,
      //   fee: 0,
      //   height: 0,
      //   note: "",
      //   // deprecated, but leave for older txs
      //   payment_id: "",
      //   subaddr_index: { major: 0, minor: 0 },
      //   timestamp: 0,
      //   txid: "",
      //   type: "",
      //   unlock_time: 0
      // },
      menuItems,
      txnModalVisible: true
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    txJson() {
      return JSON.stringify(this.tx, null, 2);
    },
    can_open(state) {
      const { net_type } = state.gateway.app.config.app;
      return net_type !== "stagenet";
    },
    in_tx_address_used(state) {
      let i;
      let used_addresses = state.gateway.wallet.address_list.primary.concat(
        state.gateway.wallet.address_list.used
      );
      for (i = 0; i < used_addresses.length; i++) {
        if (used_addresses[i].address_index == this.tx.subaddr_index.minor) {
          let address_index_text = "";
          if (used_addresses[i].address_index === 0) {
            address_index_text = this.$t("strings.addresses.myPrimaryAddress");
          } else {
            address_index_text =
              this.$t("strings.addresses.subAddress") +
              " (" +
              this.$t("strings.addresses.subAddressIndex", {
                index: used_addresses[i].address_index
              }) +
              ")";
          }
          return {
            address: used_addresses[i].address,
            address_index: used_addresses[i].address_index,
            address_index_text: address_index_text
          };
        }
      }
      return false;
    },
    out_destinations(state) {
      if (!this.tx.destinations) return false;
      let i, j;
      let destinations = [];
      let address_book = state.gateway.wallet.address_list.address_book;
      for (i = 0; i < this.tx.destinations.length; i++) {
        let destination = this.tx.destinations[i];
        destination.name = "";
        for (j = 0; j < address_book.length; j++) {
          if (destination.address == address_book[j].address) {
            const { name, description } = address_book[j];
            const separator = description === "" ? "" : " - ";
            destination.name = `${name}${separator}${description}`;
            break;
          }
        }
        destinations.push(destination);
      }
      return destinations;
    },
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    }
  }),
  methods: {
    goback() {
      this.$emit("goback", "");
    },
    showTxnDetails(toggle) {
      if (toggle) this.$refs.txnDetails.show();
      else this.$refs.txnDetails.hide();
    },
    // showTxDetails() {
    //   this.$q
    //     .dialog({
    //       title: this.$t("dialog.transactionDetails.title"),
    //       message: JSON.stringify(this.tx, null, 2),
    //       ok: {
    //         label: this.$t("dialog.transactionDetails.ok"),
    //         color: "primary"
    //       },
    //       style: "min-width: 500px; overflow-wrap: break-word;",
    //       color: "#010101"
    //     })
    //     .onOk(() => {})
    //     .onCancel(() => {})
    //     .onDismiss(() => {});
    // },
    openExplorer() {
      this.$gateway.send("core", "open_explorer", {
        type: "tx",
        id: this.tx.txid
      });
    },
    saveTxNotes() {
      this.$q.notify({
        timeout: 1000,
        type: "positive",
        message: this.$t("notification.positive.transactionNotesSaved")
      });
      this.$gateway.send("wallet", "save_tx_notes", {
        txid: this.tx.txid,
        note: this.txNotes
      });
      this.editNotes = false;
    },
    formatDate(timestamp) {
      return date.formatDate(timestamp, "YYYY-MM-DD hh:mm a");
    },
    copyTxJson() {
      clipboard.writeText(this.txJson);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.copied", { item: "JSON" })
      });
    },
    copyAddress(address) {
      clipboard.writeText(address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.copied", {
          item: "Transaction Id"
        })
      });
    }
  }
};
</script>

<style lang="scss">
// Transaction details in the activity panel.
.beldex-app .txn-details {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-3);
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__title-group,
  &__actions {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-base);
    line-height: 20px;
    color: var(--beldex-text);
  }

  &__type {
    padding: 2px 8px;
    font-size: var(--beldex-text-xs);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);
    border: 1px solid rgba(235, 235, 235, 0.1);

    &--in,
    &--miner,
    &--mnode,
    &--gov {
      color: var(--beldex-accent);
      border-color: var(--beldex-accent-border-soft);
    }

    &--out,
    &--failed {
      color: var(--beldex-danger);
      border-color: var(--beldex-danger-border);
    }

    &--pending,
    &--pool {
      color: var(--beldex-warning-strong);
      border-color: var(--beldex-warning-border);
    }
  }

  &__action {
    min-height: 30px;
    padding: 0 var(--beldex-space-3);
    font-size: var(--beldex-text-md);
    text-transform: none;
    color: var(--beldex-text-muted);

    img {
      width: 14px;
      height: 14px;
    }
  }

  &__hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--beldex-space-4);
  }

  &__amount {
    margin-top: var(--beldex-space-1);
    font-family: var(--beldex-font-display);
    font-size: 26px;
    line-height: 32px;
    letter-spacing: 1px;
    color: var(--beldex-text);

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

  &__status-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--beldex-space-2);
  }

  &__status--pending {
    color: var(--beldex-warning-strong);
    background-color: var(--beldex-warning-wash);
    border-color: var(--beldex-warning-border);

    .beldex-net-chip__dot {
      background-color: var(--beldex-warning-strong);
      box-shadow: none;
    }
  }

  &__rows {
    margin: 0;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-4);
    min-height: 34px;
    border-bottom: 1px solid var(--beldex-hairline);

    dt {
      font-size: var(--beldex-text-sm);
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--beldex-text-muted);
    }

    dd {
      margin: 0;
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      text-align: right;
      word-break: break-all;

      .coin-extensions {
        color: inherit;
      }
    }
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-2);

    .beldex-label {
      font-size: var(--beldex-text-sm);
    }

    .beldex-copy-row__btn {
      height: 38px;
    }
  }

  // Kept destination markup (q-list) in the new tones.
  &__destinations {
    .q-list,
    .q-item {
      padding-left: 0;
      color: var(--beldex-text);
      background: transparent;
    }

    .q-item__label--header,
    .q-item[header] {
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
    }
  }

  &__notes-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__edit {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-1);
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover {
      color: var(--beldex-text);
    }
  }

  &__notes {
    margin: 0;
    font-size: var(--beldex-text-md);
    line-height: 18px;
    color: var(--beldex-text-muted);
  }

  &__notes-actions {
    display: flex;
    justify-content: flex-end;
  }
}

.beldex-app .txn-raw-dialog {
  &__json {
    height: 408px;
    max-height: 55vh;
    margin: var(--beldex-space-5) 0 0;
    padding: 14px var(--beldex-space-4);
    overflow: auto;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    line-height: 18px;
    color: var(--beldex-text-muted);
    white-space: pre-wrap;
    word-break: break-all;
    user-select: text;
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid rgba(235, 235, 235, 0.1);
  }

  // Beats the Inter label .beldex-dialog__actions gives every dialog button.
  .beldex-dialog__actions .txn-raw-dialog__copy {
    font-family: var(--beldex-font-mono);
    font-weight: 700;
  }
}
</style>
