<template>
  <q-page class="send" style="min-height: unset">
    <template v-if="view_only">
      <div class="flex" style="height: 550px;">
        <section
          class="flex column justify-center no-wrap items-center empty-txn-wrapper"
          style="width: 100%;"
        >
          <div class="view-only-header">
            <div class="view-only">
              <img src="../../assets/images/viewOnlyMode.svg" height="40px" />
            </div>
          </div>
          <div class="hint-txt" style="margin-top: 10px;">
            <!-- {{ this.$t("titles.swap.afterYourFirstTxn") }}, -->
            Your wallet is currently in
          </div>
          <div class="hint-txt">
            <span style="font-family:Poppins-Bold;">view-only mode.</span>
            Please load the full
          </div>

          <div class="hint-txt">wallet to enable sending coins.</div>
        </section>
      </div>
    </template>
    <template v-else>
      <div v-if="!contact" style="padding: 0px 2px 15px">
        <div class="row gutter-md q-mt-lg">
          <!-- Amount -->
          <div class="col-8 amount">
            <OxenField
              :label="$t('fieldLabels.amount')"
              :error="$v.newTx.amount.$error"
              class="ft-medium"
            >
              <q-input
                v-model="newTx.amount"
                type="number"
                min="0"
                :max="unlocked_balance / 1e9"
                placeholder="00.00"
                borderless
                dense
                @blur="$v.newTx.amount.$touch"
                @keydown="keyHandler"
              />
              <q-btn
                color="secondary"
                @click="newTx.amount = unlocked_balance / 1e9"
                >{{ $t("buttons.max") }}</q-btn
              >
            </OxenField>
          </div>

          <!-- Priority -->
          <div class="col-4 priority">
            <OxenField :label="$t('fieldLabels.priority')" class="ft-medium">
              <q-select
                v-model="newTx.priority"
                emit-value
                map-options
                :options="priorityOptions"
                borderless
                dense
                dropdown-icon="expand_more"
              />
            </OxenField>
          </div>
        </div>

        <!-- Address -->
        <div class="col q-mt-lg address">
          <article class="flex justify-between align-center labelBox">
            <div
              class="label-txt ft-medium"
              style="display: flex; align-items: center"
            >
              {{ $t("fieldLabels.to") }}
              <q-icon
                style="margin-left: 4px"
                name="o_info"
                size="12px"
                color="#A9A9CD"
              />
            </div>
            <q-btn flat dense class="contact-btn" @click="navigator">
              <svg
                width="18"
                height="18"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.98128 0.440674C3.30463 0.440674 1.92754 1.80477 1.92754 3.4656V3.7406H1.0947C0.98434 3.73905 0.874769 3.75925 0.772356 3.80001C0.669944 3.84078 0.576731 3.9013 0.498137 3.97806C0.419542 4.05482 0.357132 4.14629 0.314534 4.24715C0.271936 4.34801 0.25 4.45625 0.25 4.56558C0.25 4.67491 0.271936 4.78315 0.314534 4.88401C0.357132 4.98487 0.419542 5.07634 0.498137 5.1531C0.576731 5.22986 0.669944 5.29038 0.772356 5.33114C0.874769 5.37191 0.98434 5.39211 1.0947 5.39056H4.42606C4.53642 5.39211 4.64599 5.37191 4.7484 5.33114C4.85081 5.29038 4.94403 5.22986 5.02262 5.1531C5.10122 5.07634 5.16363 4.98487 5.20622 4.88401C5.24882 4.78315 5.27076 4.67491 5.27076 4.56558C5.27076 4.45625 5.24882 4.34801 5.20622 4.24715C5.16363 4.14629 5.10122 4.05482 5.02262 3.97806C4.94403 3.9013 4.85081 3.84078 4.7484 3.80001C4.64599 3.75925 4.53642 3.73905 4.42606 3.7406H3.59322V3.4656C3.59322 2.6966 4.20495 2.09064 4.98128 2.09064H17.1963C17.9726 2.09064 18.5843 2.6966 18.5843 3.4656V17.7653C18.5843 18.5343 17.9726 19.1402 17.1963 19.1402H4.98128C4.20495 19.1402 3.59322 18.5343 3.59322 17.7653V16.9403H4.42606C4.53642 16.9418 4.64599 16.9216 4.7484 16.8809C4.85081 16.8401 4.94403 16.7796 5.02262 16.7028C5.10122 16.6261 5.16363 16.5346 5.20622 16.4337C5.24882 16.3329 5.27076 16.2246 5.27076 16.1153C5.27076 16.006 5.24882 15.8977 5.20622 15.7969C5.16363 15.696 5.10122 15.6046 5.02262 15.5278C4.94403 15.451 4.85081 15.3905 4.7484 15.3497C4.64599 15.309 4.53642 15.2888 4.42606 15.2903H3.59322V14.1904H1.92754V15.2903H1.0947C0.98434 15.2888 0.874769 15.309 0.772356 15.3497C0.669944 15.3905 0.576731 15.451 0.498137 15.5278C0.419542 15.6046 0.357132 15.696 0.314534 15.7969C0.271936 15.8977 0.25 16.006 0.25 16.1153C0.25 16.2246 0.271936 16.3329 0.314534 16.4337C0.357132 16.5346 0.419542 16.6261 0.498137 16.7028C0.576731 16.7796 0.669944 16.8401 0.772356 16.8809C0.874769 16.9216 0.98434 16.9418 1.0947 16.9403H1.92754V17.7653C1.92754 19.4261 3.30463 20.7902 4.98128 20.7902H17.1963C18.8729 20.7902 20.25 19.4261 20.25 17.7653V3.4656C20.25 1.80477 18.8729 0.440674 17.1963 0.440674H4.98128ZM7.75741 3.7406C7.53654 3.74062 7.32472 3.82754 7.16853 3.98225C7.01235 4.13696 6.9246 4.34679 6.92457 4.56558V8.41549C6.9246 8.63428 7.01235 8.8441 7.16853 8.99881C7.32472 9.15352 7.53654 9.24045 7.75741 9.24047H14.9754C15.1962 9.24045 15.4081 9.15352 15.5642 8.99881C15.7204 8.8441 15.8082 8.63428 15.8082 8.41549V4.56558C15.8082 4.34679 15.7204 4.13696 15.5642 3.98225C15.4081 3.82754 15.1962 3.74062 14.9754 3.7406H7.75741ZM8.59025 5.39056H14.1425V7.59051H8.59025V5.39056ZM1.92754 6.49053V7.59051H1.0947C0.98434 7.58896 0.874769 7.60916 0.772356 7.64992C0.669944 7.69069 0.576731 7.75121 0.498137 7.82797C0.419542 7.90473 0.357132 7.9962 0.314534 8.09706C0.271936 8.19792 0.25 8.30616 0.25 8.41549C0.25 8.52482 0.271936 8.63306 0.314534 8.73392C0.357132 8.83478 0.419542 8.92625 0.498137 9.00301C0.576731 9.07977 0.669944 9.14029 0.772356 9.18105C0.874769 9.22182 0.98434 9.24202 1.0947 9.24047H4.42606C4.53642 9.24202 4.64599 9.22182 4.7484 9.18105C4.85081 9.14029 4.94403 9.07977 5.02262 9.00301C5.10122 8.92625 5.16363 8.83478 5.20622 8.73392C5.24882 8.63306 5.27076 8.52482 5.27076 8.41549C5.27076 8.30616 5.24882 8.19792 5.20622 8.09706C5.16363 7.9962 5.10122 7.90473 5.02262 7.82797C4.94403 7.75121 4.85081 7.69069 4.7484 7.64992C4.64599 7.60916 4.53642 7.58896 4.42606 7.59051H3.59322V6.49053H1.92754ZM1.92754 10.3404V11.4404H1.0947C0.98434 11.4389 0.874769 11.4591 0.772356 11.4998C0.669944 11.5406 0.576731 11.6011 0.498137 11.6779C0.419542 11.7546 0.357132 11.8461 0.314534 11.947C0.271936 12.0478 0.25 12.1561 0.25 12.2654C0.25 12.3747 0.271936 12.483 0.314534 12.5838C0.357132 12.6847 0.419542 12.7762 0.498137 12.8529C0.576731 12.9297 0.669944 12.9902 0.772356 13.031C0.874769 13.0717 0.98434 13.0919 1.0947 13.0904H4.42606C4.53642 13.0919 4.64599 13.0717 4.7484 13.031C4.85081 12.9902 4.94403 12.9297 5.02262 12.8529C5.10122 12.7762 5.16363 12.6847 5.20622 12.5838C5.24882 12.483 5.27076 12.3747 5.27076 12.2654C5.27076 12.1561 5.24882 12.0478 5.20622 11.947C5.16363 11.8461 5.10122 11.7546 5.02262 11.6779C4.94403 11.6011 4.85081 11.5406 4.7484 11.4998C4.64599 11.4591 4.53642 11.4389 4.42606 11.4404H3.59322V10.3404H1.92754ZM7.75741 11.4404C7.64705 11.4389 7.53748 11.4591 7.43507 11.4998C7.33266 11.5406 7.23944 11.6011 7.16085 11.6779C7.08225 11.7546 7.01985 11.8461 6.97725 11.947C6.93465 12.0478 6.91271 12.1561 6.91271 12.2654C6.91271 12.3747 6.93465 12.483 6.97725 12.5838C7.01985 12.6847 7.08225 12.7762 7.16085 12.8529C7.23944 12.9297 7.33266 12.9902 7.43507 13.031C7.53748 13.0717 7.64705 13.0919 7.75741 13.0904H14.9754C15.0857 13.0919 15.1953 13.0717 15.2977 13.031C15.4001 12.9902 15.4933 12.9297 15.5719 12.8529C15.6505 12.7762 15.7129 12.6847 15.7555 12.5838C15.7981 12.483 15.8201 12.3747 15.8201 12.2654C15.8201 12.1561 15.7981 12.0478 15.7555 11.947C15.7129 11.8461 15.6505 11.7546 15.5719 11.6779C15.4933 11.6011 15.4001 11.5406 15.2977 11.4998C15.1953 11.4591 15.0857 11.4389 14.9754 11.4404H7.75741ZM7.75741 15.2903C7.64705 15.2888 7.53748 15.309 7.43507 15.3497C7.33266 15.3905 7.23944 15.451 7.16085 15.5278C7.08225 15.6046 7.01985 15.696 6.97725 15.7969C6.93465 15.8977 6.91271 16.006 6.91271 16.1153C6.91271 16.2246 6.93465 16.3329 6.97725 16.4337C7.01985 16.5346 7.08225 16.6261 7.16085 16.7028C7.23944 16.7796 7.33266 16.8401 7.43507 16.8809C7.53748 16.9216 7.64705 16.9418 7.75741 16.9403H14.9754C15.0857 16.9418 15.1953 16.9216 15.2977 16.8809C15.4001 16.8401 15.4933 16.7796 15.5719 16.7028C15.6505 16.6261 15.7129 16.5346 15.7555 16.4337C15.7981 16.3329 15.8201 16.2246 15.8201 16.1153C15.8201 16.006 15.7981 15.8977 15.7555 15.7969C15.7129 15.696 15.6505 15.6046 15.5719 15.5278C15.4933 15.451 15.4001 15.3905 15.2977 15.3497C15.1953 15.309 15.0857 15.2888 14.9754 15.2903H7.75741Z"
                  fill="white"
                />
              </svg>
            </q-btn>
          </article>
          <OxenField :error="$v.newTx.address.$error">
            <q-input
              v-model="newTx.address"
              :placeholder="address_placeholder"
              borderless
              dense
              @input="applyAlphanumericMask"
              @blur="$v.newTx.address.$touch"
            />
            <!-- <q-btn color="secondary"  to="addressbook">
              {{ $t("buttons.contacts") }}
            </q-btn>-->
          </OxenField>
        </div>

        <!-- <q-checkbox
          v-model="newTx.address_book.save"
          :label="$t('strings.saveToAddressBook')"
        />-->
        <div class="addAddress q-pt-sm" @click="addAddress">
          + {{ this.$t("buttons.addAddressBook") }}
        </div>
        <!-- Notes -->
        <!-- placeholder="$t('placeholders.transactionNotes')" -->

        <div class="col q-mt-lg">
          <OxenField
            :label="$t('fieldLabels.notes')"
            optional
            class="ft-medium"
          >
            <q-input
              v-model="newTx.note"
              class="full-width text-area-oxen"
              type="textarea"
              :placeholder="this.$t('placeholders.addNotesOptional')"
              borderless
              dense
            />
          </OxenField>
        </div>

        <div v-if="newTx.address_book.save" class="q-mt-lg">
          <OxenField :label="$t('fieldLabels.name')" optional>
            <q-input
              v-model="newTx.address_book.name"
              :placeholder="$t('placeholders.addressBookName')"
              borderless
              dense
            />
          </OxenField>
          <OxenField
            class="q-mt-lg"
            :label="$t('fieldLabels.addressBookNotes')"
            optional
          >
            <q-input
              v-model="newTx.address_book.description"
              type="textarea"
              class="full-width text-area-oxen"
              rows="2"
              :placeholder="$t('placeholders.additionalNotes')"
              borderless
              dense
            />
          </OxenField>
        </div>
        <!-- div required so the button falls below the checkbox -->
        <div class="flex row justify-evenly btn-view q-mt-lg">
          <!-- :label="$t('buttons.clear')" -->

          <q-btn
            class="send-btn"
            :disable="!is_able_to_send"
            icon="replay"
            label="clear"
            @click="clearStateValues()"
          />
          <!-- :label="$t('buttons.send')" -->

          <q-btn
            class="send-btn"
            :disable="!is_able_to_send"
            color="primary"
            icon="north_east"
            label="Send"
            @click="send()"
          />
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
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { required, decimal } from "vuelidate/lib/validators";
import { address, greater_than_zero } from "src/validators/common";
import OxenField from "components/oxen_field";
import WalletPassword from "src/mixins/wallet_password";
import ConfirmDialogMixin from "src/mixins/confirm_dialog_mixin";
import ConfirmTransactionDialog from "components/confirm_tx_dialog";
import Adressbook from "../../pages/wallet/addressbook.vue";
const objectAssignDeep = require("object-assign-deep");

// the case for doing nothing on a tx_status update
const DO_NOTHING = 10;

export default {
  components: {
    OxenField,
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
      priorityOptions: priorityOptions,
      confirmFields: {
        isflash: false,
        totalAmount: -1,
        destination: "",
        totalFees: 0
      }
    };
  },
  computed: mapState({
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
.send {
  .send-btn {
    margin-top: 6px;
    width: 9vw;
    min-width: unset;
  }
  .contact-btn {
    width: 31px;
    height: 31px;
  }
}

.amount {
  padding-right: 10px;
  .bg-primary {
    width: unset;
    color: red($color: #000000);
  }
}
.label-txt {
  color: #fff;
  font-family: "Poppins-SemiBold";
}
.priority {
  padding-left: 10px;
}
.d-down {
  background-color: #000000;
}
.address {
  .labelBox {
    height: 32px;
    align-items: baseline;
  }
  .q-btn__wrapper {
    min-height: unset;
  }
  .oxen-field .content {
    min-height: 90px;
  }
}
.addAddress {
  cursor: pointer;
  color: #289afb;
  &:hover {
    text-decoration: underline;
    text-decoration-color: #289afb;
  }
}

.btn-view {
  .q-btn .q-icon {
    font-size: 1.1em;
    color: #fff;
  }
  .on-left {
    margin-right: 5px;
  }
}
@media only screen and (max-height: 780px) {
  .priority {
    padding-left: unset;
  }
}
.view-only-header {
  background-color: #1c1c26;
  border-radius: 10px;
  padding: 8px;
}

.view-only {
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #242433;
  border-radius: 10px;
  border: 1px solid #484856;
}
</style>
