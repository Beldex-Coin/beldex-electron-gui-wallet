<template>
  <!-- Contacts. Also used as the contact picker inside Send
       (from="send"). -->
  <q-page class="address-book">
    <section v-show="isvisible" class="contacts">
      <div v-if="from === 'send'" class="contacts__head">
        <div class="contacts__title">
          <button
            type="button"
            class="beldex-icon-btn"
            :aria-label="$t('buttons.back')"
            @click="setAddress({ address: '' })"
          >
            <span class="beldex-icon-btn__glyph">←</span>
          </button>
          <span class="beldex-label">{{ $t("titles.contactBook") }}</span>
        </div>
      </div>
      <label class="contacts__search">
        <q-icon name="search" size="16px" />
        <input
          v-model="query"
          type="text"
          class="contacts__search-input"
          :placeholder="$t('placeholders.searchContacts')"
          :aria-label="$t('placeholders.searchContacts')"
          autocomplete="off"
        />
      </label>

      <template v-if="filtered_contacts.length">
        <div
          v-for="(entry, index) in filtered_contacts"
          :key="`${entry.address}-${entry.name}-${index}`"
          class="contacts__row"
        >
          <svg
            class="contacts__star"
            :class="{ 'contacts__star--on': entry.starred }"
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5.765 1.15C5.8097 1.0597 5.90174 1.00255 6.0025 1.00255C6.10326 1.00255 6.1953 1.0597 6.24 1.15L7.395 3.49C7.54973 3.8034 7.84902 4.02039 8.195 4.07L10.775 4.45C10.8745 4.46409 10.9575 4.53325 10.9893 4.62858C11.021 4.72392 10.9961 4.82903 10.925 4.9L9.055 6.72C8.80456 6.96387 8.69045 7.31554 8.75 7.66L9.19 10.23C9.20749 10.3297 9.16669 10.4306 9.08485 10.4901C9.00302 10.5496 8.89443 10.5573 8.805 10.51L6.495 9.295C6.1866 9.13319 5.8184 9.13319 5.51 9.295L3.2 10.505C3.11057 10.5523 3.00198 10.5446 2.92015 10.4851C2.83831 10.4256 2.79751 10.3247 2.815 10.225L3.255 7.655C3.31455 7.31054 3.20044 6.95887 2.95 6.715L1.08 4.9C1.00885 4.82903 0.98397 4.72392 1.01575 4.62858C1.04753 4.53325 1.1305 4.46409 1.23 4.45L3.81 4.07C4.15598 4.02039 4.45527 3.8034 4.61 3.49L5.765 1.15Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <button
            type="button"
            class="contacts__main"
            @click="from === 'send' ? setAddress(entry) : details(entry)"
          >
            <span class="contacts__name beldex-truncate">{{
              entry.name || entry.address
            }}</span>
            <span class="contacts__address beldex-truncate">{{
              entry.address
            }}</span>
          </button>
          <template v-if="from !== 'send'">
            <button
              type="button"
              class="beldex-square-btn contacts__copy"
              :aria-label="$t('menuItems.copyAddress')"
              @click="copyAddress(entry)"
            >
              <img src="~assets/icons/receive-copy.svg" alt="" />
              <q-tooltip anchor="bottom right" self="top right">
                {{ $t("menuItems.copyAddress") }}
              </q-tooltip>
            </button>
            <button
              type="button"
              class="beldex-square-btn contacts__copy"
              :aria-label="$t('menuItems.sendToThisAddress')"
              @click="sendToAddress(entry, $event)"
            >
              <img src="~assets/icons/send-muted.svg" alt="" />
              <q-tooltip anchor="bottom right" self="top right">
                {{ $t("menuItems.sendToThisAddress") }}
              </q-tooltip>
            </button>
            <ContextMenu
              :menu-items="menuItems"
              menu-class="beldex-menu--contact"
              @showDetails="details(entry)"
              @sendToAddress="sendToAddress(entry, $event)"
              @copyAddress="copyAddress(entry)"
              @deleteContact="deleteContact(entry)"
            />
          </template>
        </div>
      </template>
      <p v-else class="beldex-hint contacts__empty">
        {{ $t("strings.addressBookIsEmpty") }}
      </p>
    </section>
    <section>
      <AddressBookDetails
        ref="addressBookDetails"
        @isvisible="displayAddressList"
        @state="$emit('state', $event)"
      />
    </section>
  </q-page>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import AddressBookDetails from "components/address_book_details";
import ContextMenu from "components/menus/contextmenu";
import ConfirmDialog from "components/confirm_dialog";
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
      {
        action: "showDetails",
        i18n: "menuItems.showDetails",
        icon: "o_visibility"
      },
      {
        action: "sendToAddress",
        i18n: "menuItems.sendToThisAddress",
        icon: "app_send"
      },
      {
        action: "copyAddress",
        i18n: "menuItems.copyAddress",
        icon: "app_copy"
      },
      {
        action: "deleteContact",
        i18n: "menuItems.deleteContact",
        icon: "o_delete",
        danger: true
      }
    ];

    return {
      menuItems,
      isvisible: true,
      query: ""
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
    },
    filtered_contacts() {
      const query = this.query.trim().toLowerCase();
      if (!query) return this.address_book_combined;
      return this.address_book_combined.filter(
        entry =>
          (entry.name || "").toLowerCase().includes(query) ||
          (entry.address || "").toLowerCase().includes(query)
      );
    }
  }),
  methods: {
    details: function(entry) {
      this.$refs.addressBookDetails.entry = entry;
      this.$refs.addressBookDetails.mode = "view";
      this.$refs.addressBookDetails.isVisible = true;
      this.isvisible = false;
    },
    // Panel header buttons (layouts/wallet/rightPane.vue) act on the contact
    // that is open in the details view.
    editCurrent() {
      this.$refs.addressBookDetails.edit();
    },
    deleteCurrent() {
      this.deleteContact(this.$refs.addressBookDetails.entry);
    },
    deleteContact(entry) {
      this.$q
        .dialog({
          component: ConfirmDialog,
          parent: this,
          title: this.$t("dialog.deleteAddress.heading"),
          message: this.$t("dialog.deleteAddress.question", {
            name: entry.name || this.$t("fieldLabels.address")
          }),
          okLabel: this.$t("buttons.delete"),
          cancelLabel: this.$t("dialog.buttons.cancel"),
          icon: "trash",
          iconTone: "danger",
          okTone: "danger",
          okIcon: "trash"
        })
        .onOk(() => {
          this.$gateway.send("wallet", "delete_address_book", {
            index: entry.index
          });
          this.$refs.addressBookDetails.close();
        })
        .onDismiss(() => {})
        .onCancel(() => {});
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
// Contacts.
.beldex-app .address-book {
  min-height: 0 !important; // beats q-page's inline min-height
  display: flex;
  flex-direction: column;

  // lets the details view pin its Send button to the panel bottom
  > section:last-child {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .contacts {
    display: flex;
    flex-direction: column;

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-3);
      padding-bottom: var(--beldex-space-3);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    &__title {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    &__search {
      display: flex;
      align-items: center;
      gap: 12px;
      box-sizing: border-box;
      height: 40px;
      margin-bottom: 8px;
      padding: 0 12px;
      color: var(--beldex-text-muted);
      background-color: var(--beldex-panel-sunken);
      border: 1px solid #222;
    }

    &__search-input {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      letter-spacing: 0.3px;
      color: var(--beldex-text-strong);
      background: transparent;
      border: 0;
      outline: none;

      &::placeholder {
        color: var(--beldex-text-faint);
      }
    }

    &__row {
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 55px;
      padding: 10px 4px;
      border-bottom: 1px solid var(--beldex-hairline);
    }

    // 28px chip, 14px #737373 copy glyph.
    &__copy {
      width: 28px;
      height: 28px;
      background-color: #111;

      img {
        width: 14px;
        height: 14px;
      }
    }

    // Outlined star: grey when unstarred, green when starred.
    &__star {
      flex: none;
      color: #737373;

      &--on {
        color: var(--beldex-accent);
      }
    }

    &__main {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding: 0;
      text-align: left;
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    &__name {
      font-family: var(--beldex-font-sans);
      font-size: var(--beldex-text-md);
      font-weight: 500;
      color: var(--beldex-text);
    }

    &__address {
      font-size: 11px;
      color: #555;
    }

    &__empty {
      padding: var(--beldex-space-5) 0;
    }
  }
}
</style>
