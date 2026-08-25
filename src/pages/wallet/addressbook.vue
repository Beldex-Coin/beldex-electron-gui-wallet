<template>
  <q-page class="address-book" style="min-height: unset">
    <section v-show="this.isvisible">
      <article class="flex row justify-between addbtn-box align-center q-my-sm">
        <div
          class="header row  q-pb-xs q-mx-md q-mb-none items-center non-selectable ft-semibold"
        >
          <div
            v-if="from === 'send'"
            flat
            round
            dense
            class="flex items-center back-arrow-btn q-mr-sm"
            @click="setAddress({ address: '' })"
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

          {{
            from === "send"
              ? $t("titles.contactBook")
              : $t("titles.addressBook")
          }}
        </div>
        <q-btn
          v-if="from !== 'send'"
          round
          color="primary"
          icon="add"
          @click="addEntry"
        />
      </article>
      <template v-if="address_book_combined.length">
        <q-list link no-border :dark="theme == 'dark'" class="oxen-list">
          <q-item
            v-for="(entry, index) in address_book_combined"
            :key="`${entry.address}-${entry.name}-${index}`"
            class="oxen-list-item"
          >
            <q-item-section side>
              <article class="flex row">
                <q-item-label class="flex justify-center star-icon">
                  <q-icon size="24px" :name="entry.starred ? 'star' : ''" />
                  <q-tooltip
                    v-if="entry.starred === 'star'"
                    anchor="bottom right"
                    self="top right"
                    :offset="[0, 5]"
                  >
                    {{ $t("menuItems.favourite") }}
                  </q-tooltip>
                  <!-- <q-btn
                color="primary"
                style="margin-left: 10px;"
                :label="$t('buttons.send')"
                :disabled="view_only"
                @click="sendToAddress(entry, $event)"
              /> -->
                </q-item-label>
              </article>
            </q-item-section>
            <q-item-section
              @click.native="
                from === 'send' ? setAddress(entry) : details(entry)
              "
            >
              <q-item-label class="ellipsis address-label">{{
                entry.address
              }}</q-item-label>
              <q-item-label class="non-selectable address-sub-label" caption>{{
                entry.name
              }}</q-item-label>
            </q-item-section>

            <div v-if="from !== 'send'" class="copy-icon q-ml-sm">
              <q-btn
                flat
                padding="sm"
                size="sm"
                icon="content_copy"
                class="q-mr-sm"
                color="green"
                @click="copyAddress(entry)"
              >
                <q-tooltip
                  anchor="bottom right"
                  self="top right"
                  :offset="[0, 5]"
                >
                  {{ $t("menuItems.copyAddress") }}
                </q-tooltip>
              </q-btn>
            </div>
            <ContextMenu
              v-if="from !== 'send'"
              :menu-items="menuItems"
              @showDetails="details(entry)"
              @sendToAddress="sendToAddress(entry, $event)"
              @copyAddress="copyAddress(entry)"
            />
          </q-item>
        </q-list>
      </template>
      <template v-else>
        <p class="q-ma-md tab-desc">{{ $t("strings.addressBookIsEmpty") }}</p>
      </template>
    </section>
    <!-- 
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="add" @click="addEntry" />
    </q-page-sticky> -->
    <section>
      <AddressBookDetails
        ref="addressBookDetails"
        @isvisible="displayAddressList"
      />
    </section>
  </q-page>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import AddressBookDetails from "components/address_book_details";
import ContextMenu from "components/menus/contextmenu";
export default {
  components: {
    AddressBookDetails,
    ContextMenu
  },
  props: {
    from: {
      type: String,
      required: false,
      default: undefined
    }
  },
  data() {
    const menuItems = [
      { action: "showDetails", i18n: "menuItems.showDetails" },
      { action: "sendToAddress", i18n: "menuItems.sendToThisAddress" },
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];

    return {
      menuItems,
      isvisible: true
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    view_only: state => state.gateway.wallet.info.view_only,
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
  methods: {
    details: function(entry) {
      this.$refs.addressBookDetails.entry = entry;
      this.$refs.addressBookDetails.mode = "view";
      this.$refs.addressBookDetails.isVisible = true;
      this.isvisible = false;
    },
    setAddress: function(entry) {
      this.$emit("setContactAddress", entry);
    },
    addEntry: function() {
      this.$refs.addressBookDetails.entry = null;
      this.$refs.addressBookDetails.mode = "new";
      this.$refs.addressBookDetails.isVisible = true;
      this.isvisible = false;
    },
    sendToAddress(address, event) {
      event.stopPropagation();
      // this.$router.replace({
      //   path: "send",
      //   query: {
      //     address: address.address
      //   }
      // });
      this.$gateway.send("wallet", "set_sender_address", {
        data: address.address
      });

      this.$gateway.send("wallet", "set_router_path_rightpane", {
        data: "send"
      });
    },
    displayAddressList() {
      this.isvisible = true;
    },
    copyAddress(entry) {
      clipboard.writeText(entry.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
</script>

<style lang="scss">
.address-book {
  .header {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }

  .oxen-list-item {
    cursor: pointer;
    padding: 12px 2px;
    background-color: unset;
    border: none;
    margin: 0;

    .q-item-sublabel {
      font-size: 14px;
    }
    .q-item__section--side {
      padding-right: 5px;
    }

    .q-item-label {
      font-weight: 400;
    }

    .q-item-section {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 12px;
    }
  }
  .addbtn-box {
    .q-btn {
      font-size: 11px;
    }
    .bg-primary {
      height: 31px;
      min-width: unset;
    }
  }
  .star-icon {
    width: 35px;
    // background-color: #1f1f28;
    height: 35px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    color: #2879fb;
    cursor: default;
  }

  .copy-icon {
    .q-btn {
      background-color: #1f1f28;
      height: 35px;
      width: 35px;
      border-radius: 10px;
    }
    .q-btn--flat:hover {
      border-radius: 10px !important;
    }
  }
  .address-label {
    color: #afafbe;
    font-size: 14px;
  }
  .address-sub-label {
    color: #afafbe;
    font-size: 10px;
  }
}
</style>
