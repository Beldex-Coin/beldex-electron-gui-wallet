<template>
  <div class="wallet-settings">
    <q-btn icon-right="menu " size="17px" flat>
      <q-menu anchor="bottom right" self="top right">
        <q-list separator class="menu-list wallet-settings-wrapper">
          <q-item
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            :disabled="!is_ready"
            @click.native="getPrivateKeys()"
          >
            <q-item-label header class="sub_menu_txt ft-medium">
              <img src="../../assets/images/key.svg" class="menuIcon q-mr-md" />
              {{ $t("menuItems.showPrivateKeys") }}
            </q-item-label>
          </q-item>
          <q-item
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            :disabled="!is_ready"
            @click.native="showModal('change_password')"
          >
            <q-item-label header class="sub_menu_txt ft-medium">
              <img
                src="../../assets/images/lock.svg"
                class="menuIcon q-mr-md"
              />
              {{ $t("menuItems.changePassword") }}
            </q-item-label>
          </q-item>
          <!-- <q-item
            v-close-popup
            clickable
            :disabled="!is_ready"
            @click.native="showModal('rescan')"
          >
            <q-item-label header class="sub_menu_txt ft-medium">
              <img
                src="../../assets/images/reload.svg"
                class="menuIcon q-mr-md"
              />
              {{ $t("menuItems.rescanWallet") }}
            </q-item-label>
          </q-item> -->
          <q-item
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            :disabled="!is_ready"
            @click.native="showModal('key_image')"
          >
            <q-item-label header class="sub_menu_txt ft-medium">
              <img
                src="../../assets/images/manage_key.svg"
                class="menuIcon q-mr-md"
              />
              {{ $t("menuItems.manageKeyImages") }}
            </q-item-label>
          </q-item>
          <q-item
            v-close-popup
            clickable
            class="q-mx-md q-my-sm"
            :disabled="!is_ready"
            @click.native="deleteWallet()"
          >
            <q-item-label header class="sub_menu_txt ft-medium">
              <img
                src="../../assets/images/delete.svg"
                class="menuIcon q-mr-md"
              />
              {{ $t("menuItems.deleteWallet") }}
            </q-item-label>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!-- Modals -->
    <!-- PRIVATE KEY MODAL -->
    <q-dialog v-model="modals.private_keys.visible" @hide="closePrivateKeys()">
      <div class="modal private-key-modal">
        <div class="modal-header">{{ $t("titles.privateKeys") }}</div>
        <div class="pk-body">
          <div v-if="info.address" class="pk-section ">
            <div class="pk-label  q-mb-sm">
              {{ $t("footer.wallet") }} :
              <span class="ft-semibold">{{ info.name }}</span>
            </div>
            <div class="pk-box row items-center q-px-md q-py-md">
              <div class="col pk-text ">{{ info.address }}</div>
              <div class="col-auto">
                <q-btn
                  class="pk-copy-btn"
                  unelevated
                  icon-right="content_copy"
                  :label="this.$t('buttons.copy')"
                  @click="copyAddress(info.address)"
                >
                  <q-tooltip
                    anchor="center left"
                    self="center right"
                    :offset="[5, 10]"
                    >{{ $t("menuItems.copyAddress") }}</q-tooltip
                  >
                </q-btn>
              </div>
            </div>
          </div>

          <div v-if="secret.mnemonic" class="pk-section">
            <div class="row items-start no-wrap pk-plain-row q-pr-md q-mb-sm">
              <div class="pk-label ft-medium">
                {{ $t("strings.seedWords") }} -
              </div>
              <div class="pk-hint ft-regular">
                {{ $t("strings.saveSeedWarning") }}
              </div>
            </div>

            <div class="pk-box pk-box-tall row items-center q-px-md">
              <div class="col pk-text ">{{ secret.mnemonic }}</div>
              <div class="col-auto">
                <q-btn
                  class="pk-copy-btn"
                  unelevated
                  icon-right="content_copy"
                  :label="this.$t('buttons.copy')"
                  @click="copyPrivateKey('mnemonic', $event)"
                >
                  <q-tooltip
                    anchor="center left"
                    self="center right"
                    :offset="[5, 10]"
                    >{{ $t("menuItems.copySeedWords") }}</q-tooltip
                  >
                </q-btn>
              </div>
            </div>
          </div>

          <div
            v-if="secret.view_key != secret.spend_key"
            class="pk-section pk-section-plain"
          >
            <div class="row items-start no-wrap pk-plain-row q-pr-md">
              <div class="col">
                <div class="pk-label ft-medium">
                  {{ $t("strings.viewKey") }}
                </div>
                <div class=" pk-text " style="word-break: break-all">
                  {{ secret.view_key }}
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  class="pk-copy-btn"
                  unelevated
                  icon-right="content_copy"
                  :label="this.$t('buttons.copy')"
                  @click="copyPrivateKey('view_key', $event)"
                >
                  <q-tooltip
                    anchor="center left"
                    self="center right"
                    :offset="[5, 10]"
                    >{{ $t("menuItems.copyViewKey") }}</q-tooltip
                  >
                </q-btn>
              </div>
            </div>
          </div>

          <div v-if="!/^0*$/.test(secret.spend_key)" class="pk-divider"></div>

          <div
            v-if="!/^0*$/.test(secret.spend_key)"
            class="pk-section pk-section-plain"
          >
            <div class="row items-start no-wrap pk-plain-row q-pr-md">
              <div class="col">
                <div class="pk-label ft-medium">
                  {{ $t("strings.spendKey") }}
                </div>
                <div class="pk-text " style="word-break: break-all">
                  {{ secret.spend_key }}
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  class="pk-copy-btn"
                  unelevated
                  icon-right="content_copy"
                  :label="this.$t('buttons.copy')"
                  @click="copyPrivateKey('spend_key', $event)"
                >
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

          <div class="pk-actions flex justify-center">
            <q-btn
              class="pk-close-btn ft-semibold"
              unelevated
              :label="$t('buttons.close')"
              @click="hideModal('private_keys')"
            />
          </div>
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
    <q-dialog
      v-model="modals.key_image.visible"
      class="key-image-modal"
      minimized
    >
      <div class="modal key-image-modal">
        <div class="modal-header">
          <!-- Export/Import key images -->
          {{
            $t("dialog.keyImages.title", {
              type: $t(
                `dialog.keyImages.${modals.key_image.type.toLowerCase()}`
              )
            })
          }}
        </div>
        <div class="q-ma-md">
          <div class="q-mb-md">
            <!-- <div class="q-mr-xl"> -->
            <div v-if="!view_only" class="r-btn-wrapper">
              <div
                :class="[
                  modals.key_image.type === 'Export'
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
                  v-model="modals.key_image.type"
                  val="Export"
                  :label="$t('dialog.keyImages.export')"
                  class="ft-semibold"
                />
              </div>
            </div>
            <!-- <div> -->
            <div class="r-btn-wrapper">
              <div
                :class="[
                  modals.key_image.type !== 'Export'
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
                  v-model="modals.key_image.type"
                  val="Import"
                  :label="$t('dialog.keyImages.import')"
                />
              </div>
            </div>
          </div>

          <template v-if="modals.key_image.type == 'Export'">
            <OxenField
              class="q-mt-lg ex_oxen"
              :label="$t('fieldLabels.keyImages.exportDirectory')"
              disable-hover
            >
              <q-input
                v-model="modals.key_image.export_path"
                disable
                borderless
              />
              <q-btn color="secondary" @click="selectKeyImageExportPath">
                {{ $t("buttons.browse") }}
              </q-btn>
            </OxenField>
          </template>
          <template v-if="modals.key_image.type == 'Import'">
            <OxenField
              class="q-mt-lg ex_oxen"
              :label="$t('fieldLabels.keyImages.importFile')"
              disable-hover
            >
              <q-input
                v-model="modals.key_image.import_path"
                disable
                borderless
              />
              <q-btn color="secondary" @click="selectKeyImageImportPath">
                {{ $t("buttons.browse") }}
              </q-btn>
            </OxenField>
          </template>

          <div class="q-mt-lg text-center">
            <q-btn
              color="accent"
              class="q-mr-sm"
              :label="$t('buttons.cancel')"
              @click="hideModal('key_image')"
            />
            <q-btn
              color="primary"
              :label="$t('buttons.' + modals.key_image.type.toLowerCase())"
              @click="doKeyImages()"
            />
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- CHANGE PASSWORD MODAL -->
    <q-dialog
      v-model="modals.change_password.visible"
      minimized
      @hide="clearChangePassword()"
    >
      <div class="modal password-modal">
        <div class="modal-header ft-semibold text-center q-mt-sm">
          {{ $t("titles.changePassword") }}
        </div>
        <div class="q-ma-md">
          <OxenField :label="$t('fieldLabels.oldPassword')" class="ft-medium">
            <q-input
              v-model="modals.change_password.old_password"
              type="password"
              borderless
              :placeholder="$t('placeholders.enteroldPassword')"
            />
          </OxenField>

          <OxenField :label="$t('fieldLabels.newPassword')" class="ft-medium">
            <q-input
              v-model="modals.change_password.new_password"
              type="password"
              borderless
              :placeholder="$t('placeholders.enterNewPassword')"
            />
          </OxenField>

          <OxenField
            :label="$t('fieldLabels.confirmNewPassword')"
            class="ft-medium"
          >
            <q-input
              v-model="modals.change_password.new_password_confirm"
              type="password"
              borderless
              :placeholder="$t('placeholders.reEnterPassword')"
            />
          </OxenField>

          <div class="q-mt-xl text-center">
            <q-btn
              class="q-mr-sm"
              color="accent"
              :label="$t('buttons.cancel')"
              @click="hideModal('change_password')"
            />
            <q-btn
              color="primary"
              :label="$t('buttons.change')"
              @click="doChangePassword()"
            />
          </div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { clipboard, dialog } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import WalletPassword from "src/mixins/wallet_password";
import OxenField from "components/oxen_field";

export default {
  name: "WalletSettings",
  components: {
    OxenField
  },
  mixins: [WalletPassword],
  data() {
    return {
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
    }
  }),
  watch: {
    secret: {
      handler(val, old) {
        if (val.view_key == old.view_key) return;
        switch (this.secret.view_key) {
          case "":
            break;
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
      // Only seed defaults on first open; don't clobber a path the user already browsed to.
      if (
        this.modals.key_image.export_path ||
        this.modals.key_image.import_path
      ) {
        return;
      }
      const joinPath = (...parts) => parts.filter(Boolean).join("/");
      this.modals.key_image.export_path = joinPath(
        this.wallet_data_dir,
        "images",
        this.info.name
      );
      this.modals.key_image.import_path = joinPath(
        this.wallet_data_dir,
        "images",
        this.info.name,
        "key_image_export"
      );
    },
    async showModal(which) {
      if (!this.is_ready) return;
      if (which === "key_image") {
        this.setDefaultKeyImagePaths();
        if (this.view_only) {
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
      if (!this.is_ready) return;
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.showPrivateKeys.title"),
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
          this.$gateway.send("wallet", "get_private_keys", {
            password
          });
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    copyAddress(address) {
      clipboard.writeText(address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
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
          title: this.$t("dialog.deleteWallet.title"),
          message: this.$t("dialog.deleteWallet.message"),
          // message: "Are you sure you want to delete the current wallet?",
          ok: {
            label: this.$t("dialog.deleteWallet.ok"),
            color: "red"
          },
          cancel: {
            color: "accent",
            label: this.$t("dialog.buttons.cancel")
            // color: this.theme == "dark" ? "white" : "dark"
          },
          color: "#010101"
        })
        .onOk(async () => {
          const hasPassword = await this.hasPassword();
          if (hasPassword) {
            this.$q
              .dialog({
                title: this.$t("dialog.deleteWallet.title"),
                message: this.$t("dialog.password.message"),

                prompt: {
                  model: "",
                  placeholder: "nowfil",
                  type: "password"
                },
                ok: {
                  label: this.$t("dialog.deleteWallet.ok"),
                  color: "negative"
                },
                cancel: {
                  label: this.$t("dialog.buttons.cancel"),
                  color: "accent"
                },
                dark: this.theme == "dark",
                color: this.theme == "dark" ? "white" : "dark"
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

.password-modal {
  background: #242433;
  color: #fff;
  border-radius: 10px !important;
  width: 540px;

  > * {
    color: #fff;
  }
}

.q-field__label {
  color: #fff !important;
}

.rescan-modal {
  color: #fff;
  border-radius: 10px !important;
}

.key-image-modal {
  // background: #2f2f40;
  color: #fff;
  border-radius: 10px !important;

  label * {
    color: #fff !important;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 275px !important;
  }

  input {
    overflow: ellipsis;
  }
}

.q-radio__inner:before {
  background: transparent !important;
}

.modal.private-key-modal {
  background-color: #242433;
  color: #fff;
  border-radius: 20px !important;
  max-width: 70%;

  .modal-header {
    font-size: 28px;
    font-weight: 700;
  }

  .pk-body {
    padding: 8px 32px 28px;
  }

  .pk-section {
    margin-top: 22px;

    &:first-child {
      margin-top: 4px;
    }
  }

  .pk-label {
    font-size: 18px;
    color: #fff;
    font-weight: 700;
    // margin-bottom: 10px;
  }

  .pk-hint {
    color: #00e509;
    font-size: 16px;
    font-weight: 400;
    margin-left: 5px;
  }

  .pk-box {
    border: 1px solid #484856;
    border-radius: 10px;
    min-height: 58px;
  }

  .pk-box-tall {
    min-height: 110px;
    align-items: center;
  }

  .pk-text {
    font-size: 15px;
    color: #fff;
    word-break: break-all;
  }

  .pk-divider {
    height: 1px;
    background-color: #484856;
    margin: 22px 0;
  }

  .pk-copy-btn {
    margin-left: 12px;
    background-color: #2879fb;
    color: #fff;
    border-radius: 10px;
    padding: 4px 10px;
    font-size: 14px;
    margin-top: 3px;

    &:hover {
      background-color: #478eff;
    }

    .q-icon {
      font-size: 15px;
      margin-left: 6px;
    }
  }

  .pk-actions {
    margin-top: 30px;
  }

  .pk-close-btn {
    background-color: #00ad07;
    color: #fff;
    border-radius: 12px;
    font-size: 17px;
    padding: 4px 40px;

    &:hover {
      background-color: #00d409;
    }
  }
}

.sub_menu_txt {
  color: white;
  font-size: 18px;
}

.key-image-modal {
  min-width: 400px;
  width: 45vw;

  .oxen-field {
    flex: 1;
  }
}
</style>
