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
          <q-icon
            class="contacts__star"
            :class="{ 'contacts__star--on': entry.starred }"
            :name="entry.starred ? 'star' : 'star_border'"
            size="14px"
          />
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
        icon: "visibility"
      },
      {
        action: "sendToAddress",
        i18n: "menuItems.sendToThisAddress",
        icon: "send"
      },
      {
        action: "copyAddress",
        i18n: "menuItems.copyAddress",
        icon: "content_copy"
      },
      {
        action: "deleteContact",
        i18n: "menuItems.deleteContact",
        icon: "delete_outline",
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

    &__star {
      flex: none;
      color: var(--beldex-text-muted);

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
