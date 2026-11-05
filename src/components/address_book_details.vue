<template>
  <!-- Contact view / edit / new. -->
  <section v-if="isVisible" class="address-book-details">
    <div class="contact__head">
      <button
        v-if="mode !== 'edit'"
        type="button"
        class="beldex-icon-btn"
        :aria-label="$t('buttons.back')"
        @click="close()"
      >
        <span class="beldex-icon-btn__glyph">←</span>
      </button>
      <template v-if="mode == 'new'">
        <span class="beldex-label">{{ $t("strings.addContact") }}</span>
      </template>
      <template v-else>
        <div class="beldex-avatar">
          {{
            (mode == "edit" ? newEntry.name : (entry && entry.name) || "")
              .trim()
              .split(/\s+/)
              .map(word => word.charAt(0))
              .join("")
              .slice(0, 2)
          }}
        </div>
        <div class="contact__who">
          <span class="contact__name beldex-truncate">{{
            mode == "edit" ? newEntry.name : entry && entry.name
          }}</span>
          <span v-if="contactMeta" class="contact__meta">
            <img src="~assets/icons/contact-star.svg" alt="" />
            {{ contactMeta }}
          </span>
        </div>
      </template>

      <button
        v-if="mode == 'edit'"
        type="button"
        class="beldex-square-btn contact__action contact__action--danger"
        :aria-label="$t('buttons.delete')"
        @click="openDeletePopUp()"
      >
        <q-icon name="delete_outline" size="14px" />
        <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
          {{ $t("buttons.delete") }}
        </q-tooltip>
      </button>
    </div>

    <div v-if="mode == 'edit' || mode == 'new'" class="contact__form">
      <BeldexField
        :label="$t('fieldLabels.name')"
        :error="$v.newEntry.name.$error"
      >
        <q-input
          v-model.trim="newEntry.name"
          :placeholder="$t('placeholders.enterName')"
          borderless
          :maxlength="20"
          dense
        />
      </BeldexField>
      <BeldexField
        :label="$t('fieldLabels.address')"
        :error="$v.newEntry.address.$error"
        :starred="newEntry.starred"
        :update-starred="updateStarred"
        :enable-star="mode == 'edit'"
      >
        <template v-if="mode == 'new'" #label-action>
          <button type="button" class="contact__paste" @click="pasteAddress">
            {{ $t("buttons.paste") }}
          </button>
        </template>
        <q-input
          v-model.trim="newEntry.address"
          :placeholder="address_placeholder"
          borderless
          dense
          @input="applyAlphanumericMask"
          @blur="$v.newEntry.address.$touch"
        />
      </BeldexField>
      <BeldexField :label="$t('fieldLabels.notes')" optional>
        <q-input
          v-model="newEntry.description"
          :placeholder="$t('placeholders.additionalNotes')"
          type="textarea"
          class="full-width"
          borderless
          dense
        />
      </BeldexField>

      <div class="contact__note">
        <img src="~assets/icons/note-info.svg" alt="" />
        <p>{{ $t("strings.contactsStoredNote") }}</p>
      </div>

      <div class="contact__actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :label="$t('buttons.cancel')"
          @click="mode == 'edit' ? openCancelPopUp() : close()"
        />
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :disable="!is_ready"
          @click="save()"
        >
          <img
            :src="
              mode == 'new'
                ? require('assets/icons/plus-sm.svg')
                : require('assets/icons/btn-check.svg')
            "
            alt=""
          />
          {{ mode == "new" ? $t("buttons.saveContact") : $t("buttons.save") }}
        </q-btn>
      </div>
    </div>

    <div v-else-if="entry != null" class="contact__view">
      <div class="contact__section">
        <span class="beldex-label">{{ $t("fieldLabels.address") }}</span>
        <div class="contact__value-row">
          <p class="contact__value">{{ entry.address }}</p>
          <button
            type="button"
            class="contact__copy"
            :aria-label="$t('menuItems.copyAddress')"
            @click="copyAddress"
          >
            <img src="~assets/icons/copy.svg" alt="" />
            <q-tooltip anchor="bottom right" self="top right">
              {{ $t("menuItems.copyAddress") }}
            </q-tooltip>
          </button>
        </div>
      </div>
      <div v-if="entry.description" class="contact__section">
        <span class="beldex-label">{{ $t("strings.notes") }}</span>
        <p
          class="contact__value contact__value--notes"
          v-text="entry.description"
        />
      </div>

      <div class="contact__actions">
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :disabled="view_only"
          @click="sendToAddress"
        >
          <img src="~assets/icons/contact-send.svg" alt="" />
          {{ $t("menuItems.sendToThisAddress") }}
        </q-btn>
      </div>
    </div>
  </section>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
// import TxList from "components/tx_list";
import BeldexField from "components/beldex_field";
import ConfirmDialog from "components/confirm_dialog";
import { address } from "src/validators/common";
import { required } from "vuelidate/lib/validators";
const ADDED_KEY = "beldex_contact_added";

export default {
  name: "AddressBookDetails",
  components: {
    // TxList,
    BeldexField
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
    state() {
      return this.isVisible ? this.mode : "";
    },
    contactMeta() {
      const current = (this.mode == "edit" ? this.newEntry : this.entry) || {};
      const parts = [];
      if (current.starred) {
        parts.push(this.$t("menuItems.favourite"));
      }
      const added = this.addedDate(current.address);
      if (added) {
        parts.push(this.$t("strings.contactAdded", { date: added }));
      }
      return parts.join(" · ");
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
  watch: {
    // "" while closed, otherwise the current mode; the panel header shows
    // the edit/delete buttons for "view".
    state: {
      immediate: true,
      handler(state) {
        this.$emit("state", state);
      }
    }
  },
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
        required,
        isSanitizedName(value) {
          return /^[a-zA-Z\s]*$/.test(value);
        }
      }
    }
  },
  methods: {
    pasteAddress() {
      const text = (clipboard.readText() || "").trim();
      if (!text) return;
      this.newEntry.address = text;
      this.$v.newEntry.address.$touch();
    },
    save() {
      // wallet-rpc answers nothing while it scans, so a save now would just
      // sit in its queue and the contact would not appear until sync ends
      if (!this.is_ready) {
        this.$q.notify({
          type: "negative",
          timeout: 2000,
          message: this.$t("notification.errors.contactsWaitForSync")
        });
        return;
      }
      this.$v.newEntry.$touch();
      if (this.$v.newEntry.name.$error) {
        if (this.newEntry.name.trim() === "") {
          return this.$q.notify({
            type: "negative",
            timeout: 1000,
            message: "Please enter the name"
          });
        } else {
          return this.$q.notify({
            type: "negative",
            timeout: 1000,
            message: "Please enter the name correctly."
          });
        }
      }
      if (this.$v.newEntry.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
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

      if (this.mode === "new") {
        this.rememberAdded(this.newEntry.address);
      }
      this.$gateway.send("wallet", "add_address_book", this.newEntry);
      this.close();
    },
    // wallet-rpc keeps no creation date for address book rows, so the date a
    // contact was added here is remembered per address in this browser only.
    rememberAdded(address) {
      try {
        const added = JSON.parse(localStorage.getItem(ADDED_KEY) || "{}");
        added[address] = Date.now();
        localStorage.setItem(ADDED_KEY, JSON.stringify(added));
      } catch (e) {
        // storage unavailable: the date is simply not shown
      }
    },
    addedDate(address) {
      try {
        const time = JSON.parse(localStorage.getItem(ADDED_KEY) || "{}")[
          address
        ];
        if (!time) return "";
        return new Date(time).toLocaleDateString(this.$i18n.locale, {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      } catch (e) {
        return "";
      }
    },
    copyAddress() {
      clipboard.writeText(this.entry.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
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
          component: ConfirmDialog,
          parent: this,
          title: this.$t("dialog.deleteAddress.heading"),
          message: this.$t("dialog.deleteAddress.question", {
            name:
              (this.entry && this.entry.name) || this.$t("fieldLabels.address")
          }),
          okLabel: this.$t("buttons.delete"),
          cancelLabel: this.$t("dialog.buttons.cancel"),
          icon: "trash",
          iconTone: "danger",
          okTone: "danger",
          okIcon: "trash"
        })
        .onOk(() => this.deleteEntry())
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    openCancelPopUp() {
      this.$q
        .dialog({
          component: ConfirmDialog,
          parent: this,
          title: this.$t("dialog.discardEdit.heading"),
          message: this.$t("dialog.discardEdit.question"),
          okLabel: this.$t("dialog.discardEdit.keepEditing"),
          cancelLabel: this.$t("dialog.discardEdit.cancel"),
          icon: "warning",
          iconTone: "neutral",
          okTone: "primary"
        })
        .onOk(() => {})
        .onDismiss(() => {})
        .onCancel(() => this.cancelEdit());
    }
  }
};
</script>

<style lang="scss">
.beldex-app .address-book-details {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--beldex-space-5);

  .contact__head {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
  }

  .contact__who {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  // 40px bordered avatar, 14px semibold name.
  .beldex-avatar {
    width: 40px;
    height: 40px;
    background-color: #111;
  }

  .contact__head {
    gap: 12px;

    .contact__who {
      margin-left: 4px;
    }
  }

  .contact__name {
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: -0.35px;
    color: var(--beldex-text);
  }

  .contact__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    line-height: 16px;
    color: var(--beldex-text-muted);

    img {
      width: 12px;
      height: 12px;
    }
  }

  .contact__action {
    margin-left: auto;

    &--danger {
      color: var(--beldex-danger);
      border-color: var(--beldex-danger-border);
    }
  }

  .contact__form,
  .contact__view {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--beldex-space-4);
  }

  .contact__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact__value-row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #222;
  }

  .contact__value {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: 12px 0;
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: var(--beldex-text);
    word-break: break-all;
    white-space: pre-wrap;

    &--notes {
      min-height: 72px;
      border-bottom: 1px solid var(--beldex-border);
    }
  }

  .contact__copy {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    background: transparent;
    border: 0;
    cursor: pointer;

    img {
      width: 14px;
      height: 14px;
    }
  }

  // BeldexField's favourite star is a q-btn color="accent" (Quasar blue);
  // beats .bg-accent / .text-accent from quasar.
  .beldex-field .label .q-btn {
    min-height: 0;
    padding: 0 var(--beldex-space-1);
    color: var(--beldex-accent) !important;
    background: transparent !important;
    box-shadow: none;

    .q-icon {
      color: inherit !important; // beats a global blue `.q-icon` rule
    }
  }

  .contact__paste {
    margin-left: auto;
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
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

  .contact__note {
    display: flex;
    align-items: flex-start;
    gap: var(--beldex-space-3);
    padding: 12px 14px;
    font-size: var(--beldex-text-sm);
    line-height: 17px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);

    img {
      flex: 0 0 auto;
      margin-top: 2px;
    }

    p {
      margin: 0;
    }
  }

  .contact__actions {
    display: flex;
    gap: var(--beldex-space-3);
    margin-top: auto;

    .beldex-btn {
      flex: 1 1 auto;
      min-height: 44px;
      font-family: var(--beldex-font-sans-medium);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: none;

      img {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }

    // Mono muted label on a transparent, hairline-bordered button.
    .beldex-btn--ghost {
      flex: 0 0 auto;
      min-width: 97px;
      font-family: var(--beldex-font-mono);
      font-weight: 500;
      color: var(--beldex-text-muted);
      background-color: transparent;
      border-color: rgba(235, 235, 235, 0.1);
    }
  }
}
</style>
