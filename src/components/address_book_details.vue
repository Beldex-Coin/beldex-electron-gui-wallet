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
        ←
      </button>
      <template v-if="mode == 'new'">
        <span class="beldex-label">{{
          $t("strings.addAddressBookEntry")
        }}</span>
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
          <span
            v-if="(mode == 'edit' ? newEntry : entry || {}).starred"
            class="contact__meta"
          >
            <q-icon name="star" size="12px" />
            {{ $t("menuItems.favourite") }}
          </span>
        </div>
      </template>

      <button
        v-if="mode == 'view'"
        type="button"
        class="beldex-square-btn contact__action"
        :disabled="!is_ready"
        :aria-label="$t('buttons.edit')"
        @click="edit()"
      >
        <q-icon name="create" size="14px" />
        <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
          {{ $t("buttons.edit") }}
        </q-tooltip>
      </button>
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

      <div class="contact__actions">
        <q-btn
          v-if="mode == 'edit'"
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :label="$t('buttons.cancel')"
          @click="openCancelPopUp()"
        />
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :label="$t('buttons.save')"
          @click="save()"
        />
      </div>
    </div>

    <div v-else-if="entry != null" class="contact__view">
      <div class="contact__section">
        <span class="beldex-label">{{ $t("fieldLabels.address") }}</span>
        <p class="contact__value">{{ entry.address }}</p>
      </div>
      <div v-if="entry.description" class="contact__section">
        <span class="beldex-label">{{ $t("strings.notes") }}</span>
        <p class="contact__value">{{ entry.description }}</p>
      </div>

      <div class="contact__actions">
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :disabled="view_only"
          :label="$t('buttons.send')"
          icon="north_east"
          @click="sendToAddress"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
// import TxList from "components/tx_list";
import BeldexField from "components/beldex_field";
import ConfirmDialog from "components/confirm_dialog";
import { address } from "src/validators/common";
import { required } from "vuelidate/lib/validators";
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
        required,
        isSanitizedName(value) {
          return /^[a-zA-Z\s]*$/.test(value);
        }
      }
    }
  },
  methods: {
    save() {
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

  .contact__name {
    font-family: var(--beldex-font-sans);
    font-size: var(--beldex-text-base);
    color: var(--beldex-text);
  }

  .contact__meta {
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
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
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  .contact__value {
    margin: var(--beldex-space-3) 0 0;
    font-size: var(--beldex-text-md);
    line-height: 17px;
    color: var(--beldex-text);
    word-break: break-all;
    white-space: pre-wrap;
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

  .contact__actions {
    display: flex;
    gap: var(--beldex-space-3);
    margin-top: auto;

    .beldex-btn {
      flex: 1 1 auto;
    }

    .beldex-btn--ghost {
      flex: 0 0 auto;
    }
  }
}
</style>
