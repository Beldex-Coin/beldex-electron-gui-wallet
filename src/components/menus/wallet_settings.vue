<template>
  <div class="wallet-settings">
    <q-btn flat :aria-label="$t('menuItems.walletMenuTitle')">
      <!-- Vertical-dots asset, shown rotated -->
      <img
        src="~assets/icons/header-menu.svg"
        alt=""
        class="wallet-settings__icon"
      />
      <q-menu
        anchor="bottom right"
        self="top right"
        :offset="[0, 6]"
        content-class="beldex-menu beldex-menu--wallet"
      >
        <!-- Wallet menu dropdown -->
        <q-list class="menu-list wallet-settings-wrapper">
          <q-item-label header class="beldex-menu__head">
            {{ $t("menuItems.walletMenuTitle") }}
          </q-item-label>
          <q-item
            v-close-popup
            clickable
            :disabled="!is_ready"
            @click.native="getPrivateKeys()"
          >
            <img src="~assets/icons/wmenu-keys.svg" alt="" />
            {{ $t("menuItems.showPrivateKeys") }}
          </q-item>
          <q-item
            v-close-popup
            clickable
            :disabled="!is_ready"
            @click.native="showModal('change_password')"
          >
            <img src="~assets/icons/wmenu-lock.svg" alt="" />
            {{ $t("menuItems.changePassword") }}
          </q-item>
          <q-item
            v-close-popup
            clickable
            :disabled="!is_ready"
            @click.native="showModal('key_image')"
          >
            <img src="~assets/icons/wmenu-keyimages.svg" alt="" />
            {{ $t("menuItems.manageKeyImages") }}
          </q-item>
          <q-separator class="beldex-menu__sep" />
          <q-item
            v-close-popup
            clickable
            class="wallet-settings__danger"
            :disabled="!is_ready"
            @click.native="deleteWallet()"
          >
            <img src="~assets/icons/wmenu-trash.svg" alt="" />
            {{ $t("menuItems.deleteWallet") }}
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!-- Modals -->
    <!-- PRIVATE KEY MODAL -->
    <q-dialog v-model="modals.private_keys.visible" @hide="closePrivateKeys()">
      <div class="beldex-dialog beldex-dialog--wide">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <img src="~assets/icons/dialog-key.svg" alt="" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">{{ $t("titles.privateKeys") }}</h2>
            <p v-if="info.address" class="beldex-dialog__subtitle">
              {{ $t("footer.wallet") }} · {{ info.name }}
            </p>
          </div>
        </div>

        <div class="beldex-dialog__body">
          <div v-if="secret.mnemonic" class="beldex-dialog__warn">
            <q-icon name="warning_amber" size="16px" />
            <span>{{ $t("strings.privateKeysWarning") }}</span>
          </div>

          <div v-if="secret.mnemonic">
            <span class="beldex-label">{{ $t("strings.seedWords") }}</span>
            <div
              class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm"
            >
              <div
                class="beldex-dialog__inset-text beldex-dialog__inset-text--words"
              >
                {{ secret.mnemonic }}
              </div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                no-caps
                :aria-label="$t('buttons.copy')"
                @click="copyPrivateKey('mnemonic', $event)"
              >
                <img src="~assets/icons/copy.svg" alt="" />
                {{ $t("buttons.copy") }}
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[5, 10]"
                  >{{ $t("menuItems.copySeedWords") }}</q-tooltip
                >
              </q-btn>
            </div>
          </div>

          <div v-if="info.address">
            <span class="beldex-label">{{
              $t("strings.primaryAddressLabel")
            }}</span>
            <div
              class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm"
            >
              <div class="beldex-dialog__inset-text">{{ info.address }}</div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                no-caps
                :aria-label="$t('buttons.copy')"
                @click="copyAddress(info.address)"
              >
                <img src="~assets/icons/copy.svg" alt="" />
                {{ $t("buttons.copy") }}
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[5, 10]"
                  >{{ $t("menuItems.copyAddress") }}</q-tooltip
                >
              </q-btn>
            </div>
          </div>

          <div v-if="secret.view_key != secret.spend_key">
            <span class="beldex-label">{{ $t("strings.viewKey") }}</span>
            <div
              class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm"
            >
              <div class="beldex-dialog__inset-text">{{ secret.view_key }}</div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                no-caps
                :aria-label="$t('buttons.copy')"
                @click="copyPrivateKey('view_key', $event)"
              >
                <img src="~assets/icons/copy.svg" alt="" />
                {{ $t("buttons.copy") }}
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[5, 10]"
                  >{{ $t("menuItems.copyViewKey") }}</q-tooltip
                >
              </q-btn>
            </div>
          </div>

          <div v-if="hasSpendKey">
            <span class="beldex-label">{{ $t("strings.spendKey") }}</span>
            <div
              class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm"
            >
              <div class="beldex-dialog__inset-text">
                {{ secret.spend_key }}
              </div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                no-caps
                :aria-label="$t('buttons.copy')"
                @click="copyPrivateKey('spend_key', $event)"
              >
                <img src="~assets/icons/copy.svg" alt="" />
                {{ $t("buttons.copy") }}
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[5, 10]"
                  >{{ $t("menuItems.copySpendKey") }}</q-tooltip
                >
              </q-btn>
            </div>
          </div>
        </div>

        <div class="beldex-dialog__actions">
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :label="$t('buttons.close')"
            @click="hideModal('private_keys')"
          />
        </div>
      </div>
    </q-dialog>

    <!-- RESCAN MODAL -->
    <!-- <q-dialog v-model="modals.rescan.visible" minimized>
      <div class="modal rescan-modal">
        <div class="a-ma-lg modal-header ft-bold">
          {{ $t("titles.rescanWallet") }}
        </div>
        <div class="q-ma-md ft-medium">
          <p class="rmDesc">{{ $t("strings.rescanModalDescription") }}</p>

          <div class="r-btn-wrapper">
            <div
              :class="[
                modals.rescan.type === 'full'
                  ? 'radio-btn-box'
                  : 'radio-btn-box-non-select',
                'q-mt-lg',
                'flex',
                'items-center',
                'ft-semibold',
                'q-pl-md'
              ]"
            >
              <q-radio
                v-model="modals.rescan.type"
                val="full"
                :label="$t('fieldLabels.rescanFullBlockchain')"
              />
            </div>
          </div>
          <div class="q-mt-lg radio-btn-box-non-select flex items-center ft-semibold q-pl-md "   >
          <div class="r-btn-wrapper">
            <div
              :class="[
                modals.rescan.type !== 'full'
                  ? 'radio-btn-box'
                  : 'radio-btn-box-non-select',
                'q-mt-lg',
                'flex',
                'items-center',
                'ft-semibold',
                'q-pl-md'
              ]"
            >
              <q-radio
                v-model="modals.rescan.type"
                val="spent"
                :label="$t('fieldLabels.rescanSpentOutputs')"
              />
            </div>
          </div>

          <div class="q-my-lg text-center">
            <q-btn
              class="q-mr-sm"
              color="accent"
              :label="$t('buttons.cancel')"
              @click="hideModal('rescan')"
            />
            <q-btn
              color="primary"
              :label="$t('buttons.rescan')"
              @click="rescanWallet()"
            />
          </div>
        </div>
      </div>
    </q-dialog> -->

    <!-- KEY IMAGE MODAL -->
    <q-dialog v-model="modals.key_image.visible" minimized>
      <div class="beldex-dialog">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <q-icon name="o_image" size="18px" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{
                $t("dialog.keyImages.title", {
                  type: $t(
                    `dialog.keyImages.${modals.key_image.type.toLowerCase()}`
                  )
                })
              }}
            </h2>
          </div>
        </div>

        <div class="beldex-dialog__body">
          <div class="beldex-dialog__options">
            <button
              v-if="!view_only"
              type="button"
              class="beldex-option"
              :class="{
                'beldex-option--active': modals.key_image.type === 'Export'
              }"
              @click="modals.key_image.type = 'Export'"
            >
              <span
                class="beldex-check"
                :class="{
                  'beldex-check--on': modals.key_image.type === 'Export'
                }"
              />
              {{ $t("dialog.keyImages.export") }}
            </button>
            <button
              type="button"
              class="beldex-option"
              :class="{
                'beldex-option--active': modals.key_image.type === 'Import'
              }"
              @click="modals.key_image.type = 'Import'"
            >
              <span
                class="beldex-check"
                :class="{
                  'beldex-check--on': modals.key_image.type === 'Import'
                }"
              />
              {{ $t("dialog.keyImages.import") }}
            </button>
          </div>

          <BeldexField
            v-if="modals.key_image.type == 'Export'"
            :label="$t('fieldLabels.keyImages.exportDirectory')"
            disable-hover
          >
            <q-input
              v-model="modals.key_image.export_path"
              disable
              borderless
            />
            <q-btn
              class="beldex-dialog__browse"
              flat
              no-caps
              @click="selectKeyImageExportPath"
            >
              {{ $t("buttons.browse") }}
            </q-btn>
          </BeldexField>
          <BeldexField
            v-if="modals.key_image.type == 'Import'"
            :label="$t('fieldLabels.keyImages.importFile')"
            disable-hover
          >
            <q-input
              v-model="modals.key_image.import_path"
              disable
              borderless
            />
            <q-btn
              class="beldex-dialog__browse"
              flat
              no-caps
              @click="selectKeyImageImportPath"
            >
              {{ $t("buttons.browse") }}
            </q-btn>
          </BeldexField>
        </div>

        <div class="beldex-dialog__actions">
          <q-btn
            class="beldex-btn beldex-btn--ghost"
            unelevated
            no-caps
            :label="$t('buttons.cancel')"
            @click="hideModal('key_image')"
          />
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :label="$t('buttons.' + modals.key_image.type.toLowerCase())"
            @click="doKeyImages()"
          />
        </div>
      </div>
    </q-dialog>

    <!-- CHANGE PASSWORD MODAL -->
    <q-dialog
      v-model="modals.change_password.visible"
      minimized
      @hide="clearChangePassword()"
    >
      <div class="beldex-dialog">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon">
            <q-icon name="o_lock" size="18px" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("titles.changePassword") }}
            </h2>
          </div>
        </div>

        <div class="beldex-dialog__body">
          <BeldexField :label="$t('fieldLabels.oldPassword')">
            <q-input
              v-model="modals.change_password.old_password"
              type="password"
              borderless
              :placeholder="$t('placeholders.enteroldPassword')"
            />
          </BeldexField>

          <BeldexField :label="$t('fieldLabels.newPassword')">
            <q-input
              v-model="modals.change_password.new_password"
              type="password"
              borderless
              :placeholder="$t('placeholders.enterNewPassword')"
            />
          </BeldexField>

          <BeldexField :label="$t('fieldLabels.confirmNewPassword')">
            <q-input
              v-model="modals.change_password.new_password_confirm"
              type="password"
              borderless
              :placeholder="$t('placeholders.reEnterPassword')"
            />
          </BeldexField>
        </div>

        <div class="beldex-dialog__actions">
          <q-btn
            class="beldex-btn beldex-btn--ghost"
            unelevated
            no-caps
            :label="$t('buttons.cancel')"
            @click="hideModal('change_password')"
          />
          <q-btn
            class="beldex-btn"
            unelevated
            no-caps
            :label="$t('buttons.change')"
            @click="doChangePassword()"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { clipboard, dialog } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import WalletPassword from "src/mixins/wallet_password";
import ClipboardCopyMixin from "src/mixins/clipboard_copy_mixin";
import BeldexField from "components/beldex_field";
import ConfirmDialog from "components/confirm_dialog";
import PasswordConfirmDialog from "components/password_confirm_dialog";

export default {
  name: "WalletSettings",
  components: {
    BeldexField
  },
  mixins: [WalletPassword, ClipboardCopyMixin],
  data() {
    return {
      // Only show keys that this menu asked for, not secrets that reach the
      // store some other way (e.g. a late update after creating a wallet).
      awaitingPrivateKeys: false,
      modals: {
        private_keys: {
          visible: false
        },
        // rescan: {
        //   visible: false,
        //   type: "full"
        // },
        key_image: {
          visible: false,
          type: "Export",
          export_path: "",
          import_path: ""
        },
        change_password: {
          visible: false,
          old_password: "",
          new_password: "",
          new_password_confirm: ""
        }
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    secret: state => state.gateway.wallet.secret,
    view_only: state => state.gateway.wallet.info.view_only,
    wallet_data_dir: state => state.gateway.app.config.app.wallet_data_dir,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    locale() {
      return this.$q.lang.getLocale();
    },
    hasSpendKey() {
      return !!this.secret.spend_key && !/^0*$/.test(this.secret.spend_key);
    }
  }),
  watch: {
    secret: {
      handler(val, old) {
        if (val.view_key == old.view_key) return;
        if (this.secret.view_key === "" || !this.awaitingPrivateKeys) return;
        this.awaitingPrivateKeys = false;
        switch (this.secret.view_key) {
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message: this.$t(this.secret.mnemonic)
            });
            this.$store.commit("gateway/set_wallet_data", {
              secret: {
                mnemonic: "",
                spend_key: "",
                view_key: ""
              }
            });
            break;
          default:
            this.showModal("private_keys");
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    setDefaultKeyImagePaths() {
      // Only seed a default for whichever path hasn't been set yet; don't
      // clobber a path the user already browsed to. Checked independently
      // so browsing for one path (which happens as soon as the user picks
      // it) doesn't block the other one from ever getting its default.
      const joinPath = (...parts) => parts.filter(Boolean).join("/");
      if (!this.modals.key_image.export_path) {
        this.modals.key_image.export_path = joinPath(
          this.wallet_data_dir,
          "images",
          this.info.name
        );
      }
      if (!this.modals.key_image.import_path) {
        this.modals.key_image.import_path = joinPath(
          this.wallet_data_dir,
          "images",
          this.info.name,
          "key_image_export"
        );
      }
    },
    async showModal(which) {
      if (!this.is_ready) return;
      if (which === "key_image") {
        this.setDefaultKeyImagePaths();
        // View-only wallets can only import key images. Guard on the
        // current type rather than force-resetting it unconditionally on
        // every open, so this doesn't silently clobber a mode the user
        // picked if a future mode besides Export is ever added that's also
        // valid for view-only wallets.
        const viewOnlyAllowedTypes = ["Import"];
        if (
          this.view_only &&
          !viewOnlyAllowedTypes.includes(this.modals.key_image.type)
        ) {
          this.modals.key_image.type = "Import";
        }
      }
      this.modals[which].visible = true;
      // const hasPassword =  await this.hasPassword();
      // console.log('hasPasswordhasPassword ::',hasPassword)
    },
    hideModal(which) {
      this.modals[which].visible = false;
    },
    copyPrivateKey(type, event) {
      event.stopPropagation();

      const path =
        event.path || (event.composedPath && event.composedPath()) || [];
      if (path && path.length) {
        for (let i = 0; i < path.length; i++) {
          if (path[i] && path[i].tagName === "BUTTON") {
            path[i].blur();
            break;
          }
        }
      } else if (event.target && event.target.closest) {
        const button = event.target.closest("button");
        if (button) {
          button.blur();
        }
      }

      if (this.secret[type] == null) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.copyingPrivateKeys")
        });
        return;
      }

      clipboard.writeText(this.secret[type]);

      let type_key = "seedWords";
      if (type === "spend_key") {
        type_key = "spendKey";
      } else if (type === "view_key") {
        type_key = "viewKey";
      }
      const type_title = this.$t("dialog.copyPrivateKeys." + type_key);

      this.$q
        .dialog({
          title: this.$t("dialog.copyPrivateKeys.title", {
            type: type_title
          }),
          message: this.$t("dialog.copyPrivateKeys.message"),
          ok: {
            label: this.$t("dialog.buttons.ok"),
            color: "primary"
          }
        })
        .onDismiss(() => null)
        .onCancel(() => null)
        .onOk(() => {
          this.$q.notify({
            type: "positive",
            timeout: 1000,
            message: this.$t("notification.positive.copied", {
              item: this.$t("strings." + type_key)
            })
          });
        });
    },
    async getPrivateKeys() {
      if (!this.is_ready) {
        this.$q.notify({
          type: "warning",
          timeout: 3000,
          message: this.$t("notification.warnings.privateKeysAfterSync")
        });
        return;
      }
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.showPrivateKeys.title"),
        subtitle: this.$t("dialog.showPrivateKeys.subtitle"),
        noPasswordMessage: this.$t("dialog.showPrivateKeys.message"),
        ok: {
          label: this.$t("dialog.showPrivateKeys.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent"
        },
        color: "white"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.awaitingPrivateKeys = true;
          this.$gateway.send("wallet", "get_private_keys", {
            password
          });
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    copyAddress(address) {
      this.copyToClipboardAndNotify(
        address,
        this.$t("notification.positive.addressCopied"),
        1000
      );
    },
    closePrivateKeys() {
      this.hideModal("private_keys");
      setTimeout(() => {
        this.$store.commit("gateway/set_wallet_data", {
          secret: {
            mnemonic: "",
            spend_key: "",
            view_key: ""
          }
        });
      }, 500);
    },
    // rescanWallet() {
    //   this.hideModal("rescan");
    //   if (this.modals.rescan.type == "full") {
    //     this.$q
    //       .dialog({
    //         title: this.$t("dialog.rescan.title"),
    //         message: this.$t("dialog.rescan.message"),
    //         ok: {
    //           label: this.$t("buttons.rescan"),
    //           color: "primary"
    //         },
    //         cancel: {
    //           color: "accent",
    //           label: this.$t("dialog.buttons.cancel")
    //         }
    //       })
    //       .onOk(() => {
    //         this.$gateway.send("wallet", "rescan_blockchain");
    //       })
    //       .onDismiss(() => {})
    //       .onCancel(() => {});
    //   } else {
    //     this.$gateway.send("wallet", "rescan_spent");
    //   }
    // },
    async selectKeyImageExportPath() {
      const path = await dialog.selectDirectory({
        title: this.$t("fieldLabels.keyImages.exportDirectory")
      });
      if (path) {
        this.modals.key_image.export_path = path;
      }
    },
    async selectKeyImageImportPath() {
      const path = await dialog.selectFile({
        title: this.$t("fieldLabels.keyImages.importFile")
      });
      if (path) {
        this.modals.key_image.import_path = path;
      }
    },
    async doKeyImages() {
      this.hideModal("key_image");

      const type = this.$t(
        `dialog.keyImages.${this.modals.key_image.type.toLowerCase()}`
      );

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.keyImages.title", { type }),
        noPasswordMessage: this.$t("dialog.keyImages.message", {
          type: type.toLocaleLowerCase(this.locale)
        }),
        ok: {
          label: type.toLocaleLowerCase(this.locale),
          color: "primary"
        },
        cancel: {
          color: "accent"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          if (this.modals.key_image.type == "Export")
            this.$gateway.send("wallet", "export_key_images", {
              password: password,
              path: this.modals.key_image.export_path
            });
          else if (this.modals.key_image.type == "Import")
            this.$gateway.send("wallet", "import_key_images", {
              password: password,
              path: this.modals.key_image.import_path
            });
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    doChangePassword() {
      let old_password = this.modals.change_password.old_password;
      let new_password = this.modals.change_password.new_password;
      let new_password_confirm = this.modals.change_password
        .new_password_confirm;

      if (!new_password || !new_password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordFieldEmpty")
        });
        return;
      }
      // if (!old_password) {
      //   this.$q.notify({
      //     type: "negative",
      //     timeout: 1000,
      //     message: "Please enter old password"
      //   });
      //   return;
      // }
      // if (!new_password) {
      //   this.$q.notify({
      //     type: "negative",
      //     timeout: 1000,
      //     message: "Please enter new password"
      //   });
      //   return;
      // }
      // if (!new_password_confirm) {
      //   this.$q.notify({
      //     type: "negative",
      //     timeout: 1000,
      //     message: "Please enter confirm password"
      //   });
      //   return;
      // }
      if (new_password == old_password) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.newPasswordSame")
        });
      } else if (new_password != new_password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.newPasswordNoMatch")
        });
      } else {
        this.hideModal("change_password");
        this.$gateway.send("wallet", "change_wallet_password", {
          old_password,
          new_password
        });
      }
    },
    clearChangePassword() {
      this.modals.change_password.old_password = "";
      this.modals.change_password.new_password = "";
      this.modals.change_password.new_password_confirm = "";
    },
    deleteWallet() {
      if (!this.is_ready) return;
      this.$q
        .dialog({
          component: ConfirmDialog,
          parent: this,
          title: this.$t("dialog.deleteWallet.heading"),
          message: this.$t("dialog.deleteWallet.message"),
          warning: this.$t("dialog.deleteWallet.warning"),
          okLabel: this.$t("dialog.deleteWallet.confirm"),
          cancelLabel: this.$t("dialog.buttons.cancel"),
          icon: "trash",
          iconTone: "danger",
          okTone: "danger",
          okIcon: "trash"
        })
        .onOk(async () => {
          const hasPassword = await this.hasPassword();
          if (hasPassword) {
            this.$q
              .dialog({
                component: PasswordConfirmDialog,
                parent: this,
                title: this.$t("dialog.deleteWallet.heading"),
                subtitle: this.$t("dialog.password.subtitle"),
                okLabel: this.$t("dialog.deleteWallet.confirm"),
                hasPassword: true
              })
              .onOk(password => {
                password = password || "";
                this.$gateway.send("wallet", "delete_wallet", { password });
              })
              .onDismiss(() => {})
              .onCancel(() => {});
          } else {
            // no password
            let password = "";
            // if there's no password (password is empty string)
            this.$gateway.send("wallet", "delete_wallet", { password });
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>

<style lang="scss">
.wallet-settings-wrapper {
  .q-item-type + .q-item-type {
    border: unset !important;
  }

  .q-item {
    padding: 0;
  }

  .q-hoverable:hover > .q-focus-helper {
    background-color: #40405e !important;
    border-radius: 10px;
  }
}

.q-placeholder {
  color: #fff;
}

.q-field__label {
  color: #fff !important;
}

.q-radio__inner:before {
  background: transparent !important;
}

// Used by the rescan dialog in wallet_details.vue.
.rescan-modal {
  color: #fff;
  border-radius: 10px !important;
}

.sub_menu_txt {
  color: white;
  font-size: 18px;
}

// Wallet menu: small mono labels, Delete in the danger colour.
// `!important` on colour beats the base `.menu-list .q-item * { color white !important }`.
.beldex-app .beldex-menu .wallet-settings-wrapper {
  .sub_menu_txt {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted) !important;
  }

  .q-item:hover .sub_menu_txt {
    color: var(--beldex-text) !important;
  }

  .wallet-settings__danger .sub_menu_txt {
    color: var(--beldex-danger) !important;
  }
}
</style>
