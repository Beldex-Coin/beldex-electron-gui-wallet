<template>
  <!-- Send form. Bindings, validators and
       handlers are unchanged; only markup and styles. -->
  <q-page class="send">
    <template v-if="view_only">
      <section class="send__view-only">
        <div class="send__view-only-icon">
          <img src="~assets/icons/view-only-eye.svg" alt="" />
        </div>
        <p class="send__view-only-title">{{ $t("strings.viewOnlyTitle") }}</p>
        <p class="send__view-only-text">
          {{ $t("strings.viewOnlyDescription") }}
        </p>
      </section>
    </template>
    <template v-else>
      <div v-if="!contact" class="send__form">
        <!-- Recipient -->
        <div class="send__field">
          <div class="send__label-row">
            <span class="beldex-label">{{
              $t("fieldLabels.recipientAddressBns")
            }}</span>
            <button type="button" class="send__aside-btn" @click="navigator">
              <img src="~assets/icons/send-contacts.svg" alt="" />
              {{ $t("buttons.contacts") }}
            </button>
          </div>
          <BeldexField :error="$v.newTx.address.$error">
            <q-input
              v-model="newTx.address"
              class="full-width"
              type="textarea"
              autogrow
              :placeholder="address_placeholder"
              :aria-label="$t('fieldLabels.recipientAddressBns')"
              dark
              borderless
              dense
              @blur="$v.newTx.address.$touch"
              @input="applyAlphanumericMask"
            />
            <button type="button" class="send__paste" @click="pasteAddress">
              {{ $t("buttons.paste") }}
            </button>
          </BeldexField>
          <button type="button" class="send__link" @click="addAddress">
            + {{ $t("buttons.addAddressBook") }}
          </button>
        </div>

        <div v-if="newTx.address_book.save" class="send__field">
          <BeldexField :label="$t('fieldLabels.name')" optional>
            <q-input
              v-model="newTx.address_book.name"
              :placeholder="$t('placeholders.addressBookName')"
              dark
              borderless
              dense
            />
          </BeldexField>
          <BeldexField :label="$t('fieldLabels.addressBookNotes')" optional>
            <q-input
              v-model="newTx.address_book.description"
              type="textarea"
              class="full-width"
              rows="2"
              :placeholder="$t('placeholders.additionalNotes')"
              dark
              borderless
              dense
            />
          </BeldexField>
        </div>

        <!-- Amount -->
        <div class="send__field">
          <div class="send__label-row">
            <span class="beldex-label">{{ $t("fieldLabels.amount") }}</span>
            <span class="send__available">
              {{ $t("strings.availableShort") }}:
              <FormatBeldex :amount="unlocked_balance" />
            </span>
          </div>
          <BeldexField class="send__amount" :error="$v.newTx.amount.$error">
            <q-input
              v-model="newTx.amount"
              type="number"
              min="0"
              :max="unlocked_balance / 1e9"
              placeholder="00.00"
              :aria-label="$t('fieldLabels.amount')"
              dark
              borderless
              dense
              @blur="$v.newTx.amount.$touch"
              @keydown="keyHandler"
            />
            <button
              type="button"
              class="send__max"
              @click="newTx.amount = unlocked_balance / 1e9"
            >
              {{ $t("buttons.max") }}
            </button>
            <span class="send__unit">BDX</span>
          </BeldexField>
        </div>

        <!-- Notes -->
        <div class="send__field">
          <BeldexField :label="$t('fieldLabels.notes')" optional>
            <q-input
              v-model="newTx.note"
              class="full-width"
              type="textarea"
              autogrow
              :placeholder="$t('placeholders.addNotesOptional')"
              dark
              borderless
              dense
            />
          </BeldexField>
        </div>

        <!-- Settlement row (priority select) -->
        <div class="send__settlement">
          <span class="send__settlement-label">
            <img src="~assets/icons/send-flash.svg" alt="" />
            {{ $t("fieldLabels.priority") }}
          </span>
          <q-select
            v-model="newTx.priority"
            class="send__priority"
            emit-value
            map-options
            :options="priorityOptions"
            :aria-label="$t('fieldLabels.priority')"
            dark
            borderless
            dense
            dropdown-icon="expand_more"
            popup-content-class="beldex-menu beldex-menu--compact"
          />
        </div>

        <div class="send__spacer" />

        <div class="send__actions">
          <q-btn
            class="beldex-btn beldex-btn--ghost send__clear"
            unelevated
            no-caps
            :disable="!is_able_to_send"
            @click="clearStateValues()"
          >
            <img src="~assets/icons/send-clear.svg" alt="" />
            {{ $t("buttons.clearForm") }}
          </q-btn>
          <q-btn
            class="beldex-btn send__submit"
            unelevated
            no-caps
            :disable="!is_able_to_send"
            @click="send()"
          >
            <img src="~assets/icons/send-authorize.svg" alt="" />
            {{ $t("buttons.authorizeTransfer") }}
          </q-btn>
        </div>
      </div>
      <section v-else>
        <Adressbook
          from="send"
          @setContactAddress="setContactAddress($event)"
        />
      </section>
      <ConfirmTransactionDialog
        :show="confirmTransaction"
        :amount="confirmFields.totalAmount"
        :isflash="confirmFields.isflash"
        :send-to="confirmFields.destination"
        :fee="confirmFields.totalFees"
        :on-confirm-transaction="onConfirmTransaction"
        :on-cancel-transaction="onCancelTransaction"
      />
      <q-inner-loading :showing="tx_status.sending">
        <beldex-spinner color="primary" size="30" />
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { required, decimal } from "vuelidate/lib/validators";
import { address, greater_than_zero } from "src/validators/common";
import BeldexField from "components/beldex_field";
import FormatBeldex from "components/format_beldex";
import WalletPassword from "src/mixins/wallet_password";
import ConfirmDialogMixin from "src/mixins/confirm_dialog_mixin";
import ConfirmTransactionDialog from "components/confirm_tx_dialog";
import Adressbook from "../../pages/wallet/addressbook.vue";
import objectAssignDeep from "object-assign-deep";
import { clipboard } from "src/shims/electron-renderer";

// the case for doing nothing on a tx_status update
const DO_NOTHING = 10;

export default {
  components: {
    BeldexField,
    FormatBeldex,
    ConfirmTransactionDialog,
    Adressbook
  },
  mixins: [WalletPassword, ConfirmDialogMixin],
  data() {
    let priorityOptions = [
      { label: this.$t("strings.priorityOptions.flash"), value: 5 }, // flash
      { label: this.$t("strings.priorityOptions.slow"), value: 1 } // Slow
    ];
    return {
      contact: false,
      newTx: {
        amount: 0,
        address: "",
        priority: priorityOptions[0].value,
        address_book: {
          save: false,
          name: "",
          description: ""
        }
      },
      // priorityOptions: priorityOptions,
      confirmFields: {
        isflash: false,
        totalAmount: -1,
        destination: "",
        totalFees: 0
      }
    };
  },
  computed: {
    ...mapState({
      theme: state => state.gateway.app.config.appearance.theme,
      view_only: state => state.gateway.wallet.info.view_only,
      unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
      tx_status: state => state.gateway.tx_status,
      address_book: state => state.gateway.wallet.address_list.address_book,
      address_book_starred: state =>
        state.gateway.wallet.address_list.address_book_starred,
      address_book_combined() {
        const starred = this.address_book_starred.map(a => ({
          ...a,
          starred: true
        }));
        return [...starred, ...this.address_book];
      },
      is_ready() {
        return this.$store.getters["gateway/isReady"];
      },
      is_able_to_send() {
        return this.$store.getters["gateway/isAbleToSend"];
      },
      // address_placeholder(state) {
      address_placeholder() {
        // const wallet = state.gateway.wallet.info;
        // const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
        // return `${prefix}..`;
        return this.$t("placeholders.beldexAddress");
      },
      confirmTransaction: state => state.gateway.tx_status.code === 1,
      senderAddress: state => state.gateway.sender_address
    }),
    priorityOptions() {
      return [
        { label: this.$t("strings.priorityOptions.flash"), value: 5 }, // flash
        { label: this.$t("strings.priorityOptions.slow"), value: 1 } // Slow
      ];
    }
  },
  validations: {
    newTx: {
      amount: {
        required,
        decimal,
        greater_than_zero
      },
      address: {
        required,
        isAddress(value) {
          if (value === "") return true;
          return new Promise(resolve => {
            if (
              (value.length > 106 || value.length < 95) &&
              !value.toLowerCase().endsWith(".bdx")
            ) {
              resolve(false);
            }
            address(value, this.$gateway)
              .then(() => resolve(true))
              .catch(() => resolve(false));
          });
        }
      }
    }
  },
  watch: {
    tx_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          // the "nothing", so we can update state without doing anything
          // in particular
          case DO_NOTHING:
            break;
          case 1:
            this.buildDialogFieldsSend(val);
            break;
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.newTx = {
              amount: 0,
              address: "",
              priority: this.priorityOptions[0].value,
              address_book: {
                save: false,
                name: "",
                description: ""
              },
              note: ""
            };
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    }
    // $route(to) {
    //   if (to.path == "/wallet/send" && to.query.hasOwnProperty("address")) {
    //     this.autoFill(to.query);
    //   }
    // }
  },
  mounted() {
    // if (
    //   this.$route.path == "/wallet/send" &&
    //   this.$route.query.hasOwnProperty("address")
    // ) {
    //   this.autoFill(this.$route.query);
    // }

    // if(this.senderAddress)
    // {
    this.autoFill(this.senderAddress);
    this.primePasswordConfirmation();
    // }
  },
  methods: {
    autoFill: function(info) {
      this.newTx.address = info;
    },
    buildDialogFieldsSend(txData) {
      // build using mixin method
      this.confirmFields = this.buildDialogFields(txData);
    },
    keyHandler(evt) {
      if (
        evt.key === "-" ||
        evt.key === "+" ||
        evt.key === "e" ||
        evt.key === "E"
      ) {
        evt.preventDefault();
      }
    },
    addAddress() {
      this.newTx.address_book.save = !this.newTx.address_book.save;
    },
    pasteAddress() {
      const text = (clipboard.readText() || "").trim();
      if (!text) return;
      this.newTx.address = text;
      this.$v.newTx.address.$touch();
    },
    applyAlphanumericMask() {
      // Remove non-alphanumeric characters using the regular expression
      // this.newTx.address = this.newTx.address.replace(/[\W_.]/g, "");
      // this.newTx.address = this.newTx.address.replace(/^[a-zA-Z0-9]*$/,"")
    },
    onConfirmTransaction() {
      // put the loading spinner up
      this.$store.commit("gateway/set_tx_status", {
        code: DO_NOTHING,
        message: "Getting transaction information",
        sending: true
      });
      const { name, description, save } = this.newTx.address_book;
      const addressSave = {
        address: this.newTx.address,
        address_book: {
          description,
          name,
          save
        }
      };

      const note = this.newTx.note;
      const isflash = this.confirmFields.isflash;

      const relayTxData = {
        isflash,
        addressSave,
        note,
        // you may be sending all (which calls sweep_all RPC), but this refers to
        // if the relay is coming from "sweep all" on the SN tab
        isSweepAll: false
      };

      // Commit the transaction
      this.$gateway.send("wallet", "relay_tx", relayTxData);
    },
    onCancelTransaction() {
      this.$store.commit("gateway/set_tx_status", {
        code: DO_NOTHING,
        message: "Cancel the transaction from confirm dialog",
        sending: false
      });
    },

    clearStateValues() {
      this.newTx = {
        amount: 0,
        address: "",
        priority: this.priorityOptions[0].value,
        address_book: {
          save: false,
          name: "",
          description: ""
        },
        note: ""
      };
    },
    navigator() {
      // this.$gateway.send("wallet", "set_router_path_rightpane", { data: "" });
      this.contact = true;
    },
    setContactAddress(address) {
      this.contact = false;
      this.autoFill(address.address);
    },
    async send() {
      this.$v.newTx.$touch();
      // console.log("address_book_combined", this.address_book_combined);
      if (this.newTx.amount < 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.negativeAmount")
        });
        return;
      } else if (this.newTx.amount == 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.zeroAmount")
        });
        return;
      } else if (this.newTx.amount > this.unlocked_balance / 1e9) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.notEnoughBalance")
        });
        return;
      } else if (this.$v.newTx.amount.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAmount")
        });
        return;
      }

      if (this.newTx.address_book.save) {
        let addressIsExist =
          this.address_book_combined.filter(
            // item =>  console.log('filter item',item.address)
            item => item.address === this.newTx.address
          ).length > 0;
        // console.log('address_book_combined filter ::',addressIsExist)
        if (addressIsExist) {
          this.$q.notify({
            type: "negative",
            timeout: 1000,
            message: "Address is already exist!"
          });
          return;
        }
      }

      if (this.$v.newTx.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      // must wait for the dialog to be returned
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.transfer.title"),
        noPasswordMessage: this.$t("dialog.transfer.message"),
        ok: {
          label: this.$t("dialog.transfer.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent"
        }
      });
      if (!passwordDialog || typeof passwordDialog.onOk !== "function") {
        return;
      }
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_tx_status", {
            code: DO_NOTHING,
            message: "Getting transaction information",
            sending: true
          });
          const newTx = objectAssignDeep.noMutate(this.newTx, {
            password
          });

          this.$gateway.send("wallet", "transfer", newTx);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
// Legacy global: swapWaitingTxnHistory.vue's `.amount` relied on this while
// Send was loaded (it always is in the wallet layout).
.amount {
  padding-right: 10px;
}

// Send form.
.beldex-app .send {
  min-height: 0 !important; // beats q-page's inline min-height
  height: 100%;

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-5);
    min-height: 100%;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-2);
  }

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-3);

    .beldex-label {
      font-size: var(--beldex-text-sm);
    }
  }

  &__aside-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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

    img {
      width: 12px;
      height: 12px;
    }
  }

  &__available {
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);

    .coin-extensions {
      color: var(--beldex-text);
    }

    > span {
      color: var(--beldex-text);
    }
  }

  &__link {
    align-self: flex-start;
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-accent);
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  // Underline inputs without the tinted background (design "inp").
  .beldex-field .content {
    padding-left: 0;
    background: transparent;
    border-bottom-color: rgba(235, 235, 235, 0.1);
  }

  .beldex-field:not(.disable):not(.disable-hover) .content:hover {
    background: transparent;
  }

  .beldex-field .q-field__control {
    height: auto;
  }

  textarea {
    min-height: 24px;
    padding-top: 8px;
    resize: none;
  }

  // Large amount (display face, 26px).
  .send__amount .content {
    min-height: 52px;
    gap: var(--beldex-space-3);
  }

  .send__amount .q-field__native {
    font-family: var(--beldex-font-display);
    font-size: 26px;
    letter-spacing: 1px;
    color: var(--beldex-text);
  }

  &__max {
    flex: none;
    height: 28px;
    padding: 0 10px;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    color: var(--beldex-accent);
    background-color: var(--beldex-panel);
    border: 1px solid rgba(235, 235, 235, 0.1);
    cursor: pointer;
  }

  // Text action at the end of the recipient input.
  &__paste {
    flex: none;
    align-self: center;
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--beldex-accent);
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__unit {
    flex: none;
    font-size: var(--beldex-text-md);
    font-weight: 700;
    color: var(--beldex-text-muted);
  }

  &__settlement {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-4);
    min-height: 42px;
    padding: 0 var(--beldex-space-4);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  &__settlement-label {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);

    img {
      width: 12px;
      height: 12px;
    }
  }

  &__priority {
    min-width: 120px;
    margin: 0; // beats app.styl `.q-field { margin 20px 0 }`

    .q-field__control,
    .q-field__marginal {
      height: 32px;
      min-height: 32px;
    }

    .q-field__native {
      justify-content: flex-end;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      font-weight: 500;
      color: var(--beldex-text);
    }

    .q-field__append .q-icon {
      color: var(--beldex-accent);
    }
  }

  &__spacer {
    flex: 1 1 auto;
  }

  &__actions {
    display: flex;
    gap: var(--beldex-space-3);
  }

  &__clear {
    padding: 0 var(--beldex-space-5);
    text-transform: none;
    color: var(--beldex-text-muted);
    background: transparent;
    border-color: rgba(235, 235, 235, 0.1);
  }

  &__submit {
    flex: 1 1 auto;
    font-family: var(--beldex-font-sans-medium);
    text-transform: none;
    color: #000;
  }

  &__clear img,
  &__submit img {
    width: 14px;
    height: 14px;
  }

  // View-only state.
  &__view-only {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    height: 100%;
    min-height: 240px;
    text-align: center;
  }

  &__view-only-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid rgba(235, 235, 235, 0.1);

    img {
      width: 16px;
      height: 12px;
    }
  }

  &__view-only-title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-weight: 600;
    font-size: var(--beldex-text-base);
    line-height: 20px;
    color: var(--beldex-text);
  }

  &__view-only-text {
    max-width: 230px;
    margin: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: var(--beldex-text-muted);
  }
}
</style>
