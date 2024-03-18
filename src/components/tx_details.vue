<template>
  <!-- <q-dialog v-model="isVisible" maximized> -->
  <!-- <q-dialog v-model="isVisible" maximized> -->

  <q-layout class="txn-details" style="min-height: unset">
    <q-header>
      <q-toolbar>
        <!-- <q-btn flat round dense icon="" @click="isVisible = false" /> -->
        <!-- <q-btn flat round dense @click="goback()" > -->
        <div class="flex items-center back-arrow-btn q-ml-md" @click="goback()">
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
        <q-toolbar-title class="ft-semibold">
          {{ $t("titles.details") }}
        </q-toolbar-title>
        <div class="row items-center txnDirection">
          <!-- <div class="q-mr-sm">
            <TxTypeIcon :type="tx.type" :tooltip="false" />
          </div> -->

          <div v-if="tx.type == 'in'" :class="`tx-${tx.type} txn-type`">
            {{
              // $t("strings.transactions.description", {
              // type: $t("strings.transactions.types.incoming")
              // })
              $t("strings.transactions.types.incoming")
            }}
          </div>
          <div v-else-if="tx.type == 'out'" :class="`tx-${tx.type} txn-type`">
            {{
              // $t("strings.transactions.description", {
              //   type: $t("strings.transactions.types.outgoing")
              // })
              $t("strings.transactions.types.outgoing")
            }}
          </div>
          <div v-else-if="tx.type == 'pool'" :class="`tx-${tx.type} txn-type`">
            {{
              // $t("strings.transactions.description", {
              //   type: $t("strings.transactions.types.pendingIncoming")
              // })
              $t("strings.transactions.types.pendingIncoming")
            }}
          </div>
          <div
            v-else-if="tx.type == 'pending'"
            :class="`tx-${tx.type} txn-type`"
          >
            {{
              // $t("strings.transactions.description", {
              //   type: $t("strings.transactions.types.pendingOutgoing")
              // })
              $t("strings.transactions.types.pendingOutgoing")
            }}
          </div>
          <div
            v-else-if="tx.type == 'failed'"
            :class="`tx-${tx.type} txn-type`"
          >
            {{
              // $t("strings.transactions.description", {
              //   type: $t("strings.transactions.types.failed")
              // })
              $t("strings.transactions.types.failed")
            }}
          </div>
        </div>
        <q-btn
          class="q-mr-sm txnDetails"
          color="primary"
          :label="$t('buttons.showTxDetails')"
          @click="showTxnDetails(true)"
        />
        <q-btn
          v-if="can_open"
          color="accent"
          class="explorebtn"
          :label="$t('buttons.viewOnExplorer')"
          @click="openExplorer"
        />
      </q-toolbar>
    </q-header>
    <div style="height: 62px"></div>
    <q-page class="detail-page" style="min-height: unset">
      <div class="layout-padding" style="padding-top: 0 !important">
        <!-- <div class="row items-center non-selectable">
          <div class="q-mr-sm">
            <TxTypeIcon :type="tx.type" :tooltip="false" />
          </div>

          <div v-if="tx.type == 'in'" :class="'tx-' + tx.type">
            {{
              $t("strings.transactions.description", {
                type: $t("strings.transactions.types.incoming")
              })
            }}
          </div>
          <div v-else-if="tx.type == 'out'" :class="'tx-' + tx.type">
            {{
              $t("strings.transactions.description", {
                type: $t("strings.transactions.types.outgoing")
              })
            }}
          </div>
          <div v-else-if="tx.type == 'pool'" :class="'tx-' + tx.type">
            {{
              $t("strings.transactions.description", {
                type: $t("strings.transactions.types.pendingIncoming")
              })
            }}
          </div>
          <div v-else-if="tx.type == 'pending'" :class="'tx-' + tx.type">
            {{
              $t("strings.transactions.description", {
                type: $t("strings.transactions.types.pendingOutgoing")
              })
            }}
          </div>
          <div v-else-if="tx.type == 'failed'" :class="'tx-' + tx.type">
            {{
              $t("strings.transactions.description", {
                type: $t("strings.transactions.types.failed")
              })
            }}
          </div>
        </div> -->

        <div class="justify-between">
          <div class="infoBox tx_details_wrapper ft-regular">
            <div class="flex row justify-between">
              <div class="text">
                <span>{{ $t("strings.transactions.date") }}</span>
              </div>
              <div class="value">
                <span>{{ formatDate(tx.timestamp * 1000) }}</span>
              </div>
            </div>
          </div>
          <div class="hr-separator" />

          <div class="infoBox tx_details_wrapper ft-regular">
            <div class="flex row justify-between">
              <div class="text">
                <span>{{ $t("strings.transactions.amount") }}</span>
              </div>
              <div class="value">
                <span><FormatOxen :amount="tx.amount" raw-value/></span>
              </div>
            </div>
          </div>
          <div class="hr-separator" />

          <div class="infoBox">
            <div class="flex row justify-between tx_details_wrapper ft-regular">
              <div class="text">
                <span>
                  {{ $t("strings.transactions.fee") }}
                  <template v-if="tx.type == 'in' || tx.type == 'pool'">
                    ({{ $t("strings.transactions.paidBySender") }})
                  </template>
                </span>
              </div>
              <div class="value">
                <span><FormatOxen :amount="tx.fee" raw-value/></span>
              </div>
            </div>
          </div>

          <div class="hr-separator" />
          <div class="infoBox">
            <div class="flex row justify-between tx_details_wrapper ft-regular">
              <div class="text">
                <span>{{ $t("strings.blockHeight") }}</span>
              </div>
              <div class="value">
                <span>{{ tx.height }}</span>
              </div>
            </div>
          </div>
          <div class="hr-separator" />
        </div>

        <div class="infoBox">
          <div class="flex row justify-between tx_details_wrapper ft-regular">
            <div class="text txn-id">
              <span>{{ $t("strings.transactionID") }}</span>
              <!-- <span>{{ tx.txid }}</span> -->
              <div class="q-mt-xs value" style="color: #afafbe">
                {{ tx.txid }}
              </div>
            </div>
            <div class="value">
              <q-btn
                flat
                padding="sm"
                size="sm"
                icon="content_copy"
                class="q-mr-sm"
                color="green"
                @click="copyAddress(tx.txid)"
              >
                <q-tooltip
                  anchor="bottom right"
                  self="top right"
                  :offset="[0, 5]"
                >
                  Copy Transaction ID
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <div class="hr-separator" />

        <!-- <h6 class="q-mt-xs q-mb-none text-weight-light">
          {{ $t("strings.transactionID") }}
        </h6>
        <p class="monospace break-all">{{ tx.txid }}</p> -->

        <!-- Deprecated, but leave this for old transactions -->
        <!-- <h6 class="q-mt-xs q-mb-none text-weight-light">
          {{ $t("strings.paymentID") }}
        </h6>
        <p class="monospace break-all">
          {{ tx.payment_id ? tx.payment_id : "N/A" }}
        </p> -->
        <div v-if="tx.payment_id != '0000000000000000'" class="infoBox">
          <div class="flex row justify-between tx_details_wrapper ft-regular">
            <div class="text">
              <span>
                {{ $t("strings.paymentID") }}
              </span>
            </div>
            <div class="value">
              <span> {{ tx.payment_id ? tx.payment_id : "N/A" }}</span>
            </div>
          </div>
        </div>
        <div v-if="tx.payment_id != '0000000000000000'" class="hr-separator" />
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
                    ><FormatOxen :amount="destination.amount"
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

        <div class="hr-separator" />

        <div class="label-txnNotes ft-regular" style="font-size: 18px">
          {{ $t("fieldLabels.transactionNotes") }}
        </div>
        <div
          v-if="editNotes"
          class="txnoteInput-Wrapper q-mt-sm q-mb-xl q-px-md"
        >
          <q-input
            v-model="txNotes"
            type="textarea"
            rows="2"
            dense
            borderless
          />
        </div>

        <div v-else class="flex row justify-between q-mt-sm q-mb-xl">
          <div class="col-md-8 txn-notes">
            {{
              txNotes
                ? txNotes
                : `The notes are saved to remark the details about the transaction.
                 You can change this by hitting edit note.`
            }}
          </div>
          <div class="col-md-3 flex justify-end">
            <q-btn
              color="secondary"
              :label="this.$t('buttons.editNotes')"
              @click="() => (this.editNotes = true)"
            />
          </div>
        </div>

        <div class="flex row justify-center">
          <q-btn
            :disable="!is_ready"
            :text-color="theme == 'dark' ? 'white' : 'dark'"
            :label="$t('buttons.saveTxNotes')"
            color="primary"
            @click="saveTxNotes"
          />
        </div>
      </div>
    </q-page>

    <!-- <q-dialog v-model="txnModalVisible"> -->
    <!-- <q-dialog ref="txnDetails"  minimized>

      <section class="modal txn-details-modal">
        <div class="modal-header ft-bold">
          {{ this.$t("dialog.transactionDetails.title") }}
        </div>

        <article class="content-wrapper q-mt-lg">
          {{ JSON.stringify(this.tx, null, 2) }}
        </article>
        <div class="flex justify-center q-my-lg">
          <q-btn color="accent" label="close" />
        </div>
      </section>
    </q-dialog> -->

    <q-dialog ref="txnDetails" minimized>
      <div class="about-modal txn-details-modal">
        <div class="modal-header ft-semibold text-center text-h6">
          {{ this.$t("dialog.transactionDetails.title") }}
        </div>
        <article class="content-wrapper q-mt-md">
          {{ JSON.stringify(this.tx, null, 2) }}
        </article>
        <div class="flex justify-center q-my-lg">
          <q-btn
            color="accent"
            :label="$t('buttons.close')"
            @click="showTxnDetails(false)"
          />
        </div>
      </div>
    </q-dialog>
  </q-layout>
  <!-- </q-dialog> -->
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import { date } from "quasar";
// import TxTypeIcon from "components/tx_type_icon";
import FormatOxen from "components/format_oxen";
import ContextMenu from "components/menus/contextmenu";
export default {
  name: "TxDetails",
  components: {
    // TxTypeIcon,
    FormatOxen,
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
            address_index_text = this.$t("strings.addresses.primaryAddress");
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
      // console.log("destinations", destinations);
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
.txn-details {
  background-color: unset;
  .tx_details_wrapper {
    .text {
      font-size: 18px;
    }
    .value {
      font-size: 16px;
      word-break: break-all;
      .q-btn--flat {
        height: unset;
      }
    }
  }
  .txnDirection {
    font-size: 13px;
    color: #d1d1d3;
  }
  .txn-id {
    width: 80%;
  }
  .q-toolbar {
    background-color: unset;
    padding: unset;
  }
  .txnDetails {
    min-width: unset;
    // width: 130px;
    height: 43px;
    font-size: 1rem;
  }
  .txn-type {
    color: #d1d1d3;
    font-size: 22px;
    margin-right: 50px;
  }
  @media only screen and (max-height: 780px) {
    .txn-type {
      margin-right: 15px;
    }
  }
  .txn-notes {
    color: #afafbe;
  }
  .explorebtn {
    height: 43px;
    font-size: 1rem;
  }

  .q-header {
    background-color: transparent;
    border: none;
  }
  .q-header .q-toolbar__title {
    background: unset !important;
  }
  .txnoteInput-Wrapper {
    border: 1px solid #484856;
    border-radius: 10px;
  }

  .label-txnNotes {
    color: white;
  }
  .q-field {
    margin: 10px 0;

    border-radius: 10px;
  }
}
.txn-details-modal {
  width: 600px;
  padding: 25px 25px 10px 25px;
  background-color: #242433;
  color: #fff;
  border-radius: 10px !important;
  word-break: break-all;

  .content-wrapper {
    background-color: #32324a;
    padding: 25px;
    border-radius: 16px;
  }
}
</style>
