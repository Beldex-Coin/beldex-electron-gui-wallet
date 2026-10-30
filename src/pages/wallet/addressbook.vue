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
            ←
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
            size="16px"
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
              class="beldex-square-btn"
              :aria-label="$t('menuItems.copyAddress')"
              @click="copyAddress(entry)"
            >
              <q-icon name="content_copy" size="14px" />
              <q-tooltip anchor="bottom right" self="top right">
                {{ $t("menuItems.copyAddress") }}
              </q-tooltip>
            </button>
            <button
              type="button"
              class="beldex-square-btn"
              :aria-label="$t('menuItems.sendToThisAddress')"
              :disabled="view_only"
              @click="sendToAddress(entry, $event)"
            >
              <q-icon name="north_east" size="14px" />
              <q-tooltip anchor="bottom right" self="top right">
                {{ $t("menuItems.sendToThisAddress") }}
              </q-tooltip>
            </button>
            <ContextMenu
              :menu-items="menuItems"
              @showDetails="details(entry)"
              @sendToAddress="sendToAddress(entry, $event)"
              @copyAddress="copyAddress(entry)"
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
      gap: var(--beldex-space-3);
      padding: var(--beldex-space-4) 0;
      color: var(--beldex-text-muted);
      border-bottom: 1px solid var(--beldex-hairline);
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
      gap: var(--beldex-space-3);
      min-height: 46px;
      padding: var(--beldex-space-1) 0;
      border-bottom: 1px solid var(--beldex-hairline);
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
      color: var(--beldex-text);
    }

    &__address {
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-faint);
    }

    &__empty {
      padding: var(--beldex-space-5) 0;
    }
  }
}
</style>
