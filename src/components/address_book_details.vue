<template>
  <!-- <q-dialog v-model="isVisible" maximized class="address-book-details"> -->
  <section v-if="isVisible" class="address-book-details">
    <q-layout v-if="mode == 'edit' || mode == 'new'" style="min-height: unset">
      <q-header>
        <q-toolbar inverted>
          <!-- <q-btn
            v-if="mode !== 'edit'"
            flat
            round
            dense
            
          > -->
          <div
            v-if="mode !== 'edit'"
            class="flex items-center back-arrow-btn"
            @click="() => (mode == 'edit' ? cancelEdit() : close())"
          >
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
          <!-- </q-btn> -->
          <q-toolbar-title v-if="mode == 'new'" class="ft-semibold title">
            {{ $t("strings.addAddressBookEntry") }}
          </q-toolbar-title>
          <q-toolbar-title v-else-if="mode == 'edit'" class="ft-semibold">
            {{ $t("titles.addressBook") }}
          </q-toolbar-title>

          <button
            v-if="mode == 'edit'"
            class="q-ml-sm add-btn delete-btn"
            @click="openDeletePopUp()"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icons8-delete 2">
                <path
                  id="Vector"
                  d="M8.93213 1.375C7.8042 1.375 6.875 2.3042 6.875 3.43213V4.125H2.75V5.5H4.125V17.1875C4.125 18.3262 5.04883 19.25 6.1875 19.25H14.4375C15.5762 19.25 16.5 18.3262 16.5 17.1875V5.5H17.875V4.125H13.75V3.43213C13.75 2.3042 12.8208 1.375 11.6929 1.375H8.93213ZM8.93213 2.75H11.6929C12.0796 2.75 12.375 3.04541 12.375 3.43213V4.125H8.25V3.43213C8.25 3.04541 8.54541 2.75 8.93213 2.75ZM6.875 6.875H8.25V16.5H6.875V6.875ZM9.625 6.875H11V16.5H9.625V6.875ZM12.375 6.875H13.75V16.5H12.375V6.875Z"
                  fill="white"
                />
              </g>
            </svg>
            <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
              Delete Contact
            </q-tooltip>
          </button>
        </q-toolbar>
      </q-header>
      <q-page style="padding-top: 59px; min-height: unset">
        <div class="address-book-modal">
          <OxenField :label="$t('fieldLabels.name')">
            <q-input
              v-model.trim="newEntry.name"
              :placeholder="$t('placeholders.enterName')"
              borderless
              :maxlength="20"
              dense
            />
          </OxenField>
          <OxenField
            :label="$t('fieldLabels.address')"
            :error="$v.newEntry.address.$error"
            :starred="newEntry.starred"
            :update-starred="updateStarred"
            :enable-star="true"
          >
            <q-input
              v-model.trim="newEntry.address"
              :placeholder="address_placeholder"
              borderless
              dense
              @input="applyAlphanumericMask"
              @blur="$v.newEntry.address.$touch"
            />
            <!-- <q-btn
              v-model="newEntry.starred"
              flat
              round
              :icon="newEntry.starred ? 'star' : 'star_border'"
              @click="updateStarred"
            /> -->
          </OxenField>
          <OxenField :label="$t('fieldLabels.notes')" optional>
            <q-input
              v-model="newEntry.description"
              :placeholder="$t('placeholders.additionalNotes')"
              type="textarea"
              class="full-width text-area-oxen"
              borderless
              dense
            />
          </OxenField>
        </div>

        <div class="flex justify-center align-center q-mt-lg">
          <q-btn
            v-if="mode == 'edit'"
            color="accent"
            no-ripple
            :label="$t('buttons.cancel')"
            class="res_btn"
            @click="openCancelPopUp()"
          />
          <q-btn
            class="q-ml-sm add-btn res_btn"
            color="primary"
            :label="$t('buttons.save')"
            size="1.2em"
            @click="save()"
          />
          <!-- <div class="divider"></div> -->
        </div>
      </q-page>
    </q-layout>

    <q-layout v-else style="min-height: unset">
      <q-header>
        <q-toolbar inverted>
          <!-- <q-btn flat round dense @click="close()"> -->
          <div
            v-if="mode !== 'edit'"
            class="flex items-center back-arrow-btn"
            @click="close()"
          >
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
          <!-- <q-btn flat round dense icon="reply" @click="close()" /> -->
          <q-toolbar-title class="ft-semibold">
            {{ $t("titles.addressBook") }}
          </q-toolbar-title>
          <!-- <q-btn
            class="q-mr-sm"
            color="accent"
            no-ripple
            icon=""
            :disable="!is_ready"
            :label="$t('buttons.edit')"
            @click="edit()"
            size="lg"
          /> -->
          <!-- :label="$t('buttons.edit')" -->
          <q-btn
            class="q-mr-sm edit_btn"
            no-ripple
            icon="create"
            :disable="!is_ready"
            size="md"
            @click="edit()"
          >
            <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
              Edit Contact
            </q-tooltip>
          </q-btn>
          <!-- :label="$t('buttons.send')" -->
          <!-- 
          <q-btn
            color="primary send_btn"
            :disabled="view_only"
            label="Send"
            icon="north_east"
            size="md"
            @click="sendToAddress"
          /> -->
        </q-toolbar>
      </q-header>
      <!-- <q-page-container> -->
      <q-page style="min-height: unset">
        <!-- <div class="layout-padding"> -->
        <div class="layout">
          <template v-if="entry != null">
            <AddressHeader
              class="address-details"
              :address="entry.address"
              :title="entry.name"
              :extra="
                entry.description
                  ? $t('strings.notes') + ': ' + entry.description
                  : ''
              "
            />

            <!-- <div class="q-mt-lg">
              <div class="ft-semibold">
                <q-icon name="history" size="24px" />
                <span class="vertical-middle q-ml-xs" style="color: white">{{
                  $t("strings.recentTransactionsWithAddress")
                }}</span>
              </div>
              <TxList
                :key="entry.address"
                type="all_in"
                :limit="5"
                :to-outgoing-address="entry.address"
              />
            </div> -->
          </template>
        </div>

        <q-btn
          color="primary send_btn q-mt-lg"
          :disabled="view_only"
          label="Send"
          icon="north_east"
          @click="sendToAddress"
        />
      </q-page>
    </q-layout>
  </section>
  <!-- </q-dialog> -->
</template>

<script>
import { mapState } from "vuex";
import AddressHeader from "components/address_header";
// import TxList from "components/tx_list";
import OxenField from "components/oxen_field";
import { address } from "src/validators/common";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AddressBookDetails",
  components: {
    AddressHeader,
    // TxList,
    OxenField
  },

  data() {
    return {
      isVisible: false,
      entry: null,
      mode: "view",
      newEntry: {
        index: false,
        address: "",
        name: "",
        description: "",
        starred: false
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    view_only: state => state.gateway.wallet.info.view_only,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    address_placeholder() {
      // address_placeholder(state) {
      // const wallet = state.gateway.wallet.info;
      // const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
      // return `${prefix}..`;

      return this.$t("placeholders.enterAddress");
    },
    address_book: state => state.gateway.wallet.address_list.address_book,
    address_book_starred: state =>
      state.gateway.wallet.address_list.address_book_starred,
    address_book_combined() {
      const starred = this.address_book_starred.map(a => ({
        ...a,
        starred: true
      }));
      return [...starred, ...this.address_book];
    }
  }),
  validations: {
    newEntry: {
      address: {
        required,
        isAddress(value) {
          if (value === "") return true;

          return new Promise(resolve => {
            address(value, this.$gateway)
              .then(() => resolve(true))
              .catch(() => resolve(false));
          });
        }
      },
      name: {
        required
      }
    }
  },
  methods: {
    save() {
      this.$v.newEntry.$touch();

      if (this.$v.newEntry.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      if (this.$v.newEntry.name.$error) {
        return this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: "Please enter the name"
        });
      }
      if (this.mode === "new") {
        let addressIsExist =
          this.address_book_combined.filter(
            item => item.address === this.newEntry.address
          ).length > 0;
        if (addressIsExist) {
          this.$q.notify({
            type: "negative",
            timeout: 1000,
            message: "Address is already exist!"
          });
          return;
        }
      }

      this.$gateway.send("wallet", "add_address_book", this.newEntry);
      this.close();
    },
    deleteEntry() {
      this.$gateway.send("wallet", "delete_address_book", this.newEntry);
      this.close();
    },
    sendToAddress() {
      // this.close();

      this.$gateway.send("wallet", "set_sender_address", {
        data: this.entry.address
      });

      this.$gateway.send("wallet", "set_router_path_rightpane", {
        data: "send"
      });

      // set_router_path_rightpane
      // this.$router.replace({
      //   path: "/wallet/rightpane",
      //   query: {
      //     address: this.entry.address
      //   }
      // });
    },
    applyAlphanumericMask() {
      // Remove non-alphanumeric characters using the regular expression
      this.newEntry.address = this.newEntry.address.replace(/[\W_]/g, "");
    },
    edit() {
      this.mode = "edit";
      this.newEntry = this.entry;
    },
    cancelEdit() {
      this.mode = "view";
      this.$v.$reset();
      this.newEntry = {
        index: false,
        address: "",
        name: "",
        description: "",
        starred: false
      };
    },

    updateStarred() {
      this.newEntry.starred = !this.newEntry.starred;
      return;
    },
    close() {
      this.isVisible = false;
      this.$v.$reset();
      this.newEntry = {
        index: false,
        address: "",
        name: "",
        description: "",
        starred: false
      };
      this.$emit("isvisible");
    },
    openDeletePopUp() {
      this.$q
        .dialog({
          title: "Delete Address",
          message: "Are you sure you want to delete this address?",
          ok: {
            label: this.$t("buttons.delete"),
            color: "red"
          },
          cancel: {
            // flat: true,
            color: "accent",
            label: this.$t("dialog.buttons.cancel")
          }
        })
        .onOk(() => this.deleteEntry())
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    openCancelPopUp() {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Are you sure you want to Discard the editing?",
          ok: {
            label: "Continue",
            color: "primary"
          },
          cancel: {
            // flat: true,
            color: "accent",
            label: "Discard"
          }
        })
        .onOk(() => {})
        .onDismiss(() => {})
        .onCancel(() => this.cancelEdit());
    }
  }
};
</script>

<style lang="scss">
.address-details {
  color: #010101;
  padding-top: 70px;
}
.address-book-details {
  .address-book-modal {
    > .oxen-field {
      margin-top: 16px;
    }

    .star-entry {
      padding: 4px;
    }
  }
  .q-header {
    background-color: #242433;
  }
  .edit_btn {
    background-color: #40405e;
    height: 36px;
    padding-right: 8px;
    border-radius: 9px;
    color: #fff;
    width: 32px;
    .q-icon {
      font-size: 1.2em;
      color: #fff;
    }
    .on-left {
      margin-right: 2px;
    }
  }
  .send_btn {
    min-width: unset;
    height: 45px;
    border-radius: 9px;
    font-size: 19px;
    .q-icon {
      font-size: 1.2em;
    }
    .on-left {
      margin-right: 5px;
    }
  }
  .q-toolbar {
    padding: 0;
    background-color: #242433;
  }
  .q-layout,
  .app-content {
    background: unset;
  }
  // .layout {
  //   height: 67vh;
  //   overflow: auto;
  // }
  .title {
    font-size: 18px;
    background-color: unset !important;
  }
  .add-btn .q-icon {
    font-size: 1em;
    font-weight: bold;
  }
  .delete-btn {
    min-width: unset;
    width: 34px;
    height: 35px;
    border: none;
    border-radius: 6px;
    background-color: #32324a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    .on-left {
      margin-right: 1px;
    }
  }
  .delete-btn:hover {
    background-color: #484866 !important ;
  }
  .oxen-field .label {
    font-family: "Poppins-Regular";
    font-weight: 400;
    font-size: 16px;
  }
  .res_btn {
    min-width: unset;
    width: 9vw;
    border-radius: 9px;
    .on-left {
      margin-right: 1px;
    }
  }
  .on-right {
    margin-left: 1px;
  }

  .q-header .q-toolbar__title {
    background: unset !important;
  }
}
// @media only screen and (max-height: 780px) {
//   .address-book-details .delete-btn {
//     width: unset;
//   }
// }
</style>
