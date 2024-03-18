<template>
  <q-page style="min-height: unset; height: calc( 100vh - 70px);">
    <section class="flex justify-center align-center">
      <div class="fields">
        <div class="createTitle">{{ this.$t("titles.importFromFile") }}</div>

        <div class="q-mx-md import-wallet">
          <OxenField
            :label="$t('fieldLabels.newWalletName')"
            :error="$v.wallet.name.$error"
          >
            <q-input
              v-model="wallet.name"
              :placeholder="$t('placeholders.walletName')"
              :dark="theme == 'dark'"
              borderless
              dense
              maxlength="26"
              @keyup.enter="import_wallet"
              @blur="$v.wallet.name.$touch"
            />
          </OxenField>

          <OxenField
            :label="$t('fieldLabels.walletFile')"
            disable-hover
            :error="$v.wallet.path.$error"
          >
            <q-input
              v-model="wallet.path"
              :placeholder="$t('placeholders.selectAFile')"
              disable
              :dark="theme == 'dark'"
              borderless
              dense
            />
            <input
              id="walletPath"
              ref="fileInput"
              type="file"
              hidden
              @change="setWalletPath"
            />
            <q-btn
              color="secondary"
              :label="$t('buttons.selectWalletFile')"
              :text-color="theme == 'dark' ? 'white' : 'dark'"
              @click="selectFile"
            >
              <span
                ><img src="../../assets/images/fileUpload.png" class="fileIcon"
              /></span>
            </q-btn>
          </OxenField>

          <OxenField :label="$t('fieldLabels.password')">
            <q-input
              v-model="wallet.password"
              :placeholder="$t('placeholders.walletPassword')"
              type="password"
              :dark="theme == 'dark'"
              borderless
              dense
              @keyup.enter="import_wallet"
            />
          </OxenField>

          <OxenField :label="$t('fieldLabels.confirmPassword')">
            <q-input
              v-model="wallet.password_confirm"
              :placeholder="$t('placeholders.reEnterWalletPassword')"
              type="password"
              :dark="theme == 'dark'"
              borderless
              dense
              @keyup.enter="import_wallet"
            />
          </OxenField>
          <div class="flex justify-center align-center submit">
            <q-btn
              class="submit-button "
              color="cancel"
              :label="$t('buttons.cancel')"
              @click="cancel()"
            />
            <span class="divider"></span>
            <q-btn
              class="submit-button "
              color="primary"
              :label="$tc('buttons.importWallet', 1)"
              @click="import_wallet"
            />
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
export default {
  components: {
    OxenField
  },
  data() {
    return {
      wallet: {
        name: "",
        path: "",
        password: "",
        password_confirm: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status
  }),
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, i18n } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created",
              query: {
                title: this.$t("titles.wallet.walletImported")
              }
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message: this.$t(i18n)
            });
            break;
        }
      },
      deep: true
    }
  },
  validations: {
    wallet: {
      name: { required },
      path: { required }
    }
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click();
    },
    setWalletPath(file) {
      this.wallet.path = file.target.files[0].path;
    },
    import_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }

      if (this.$v.wallet.path.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.selectWalletFile")
        });
        return;
      }

      if (this.wallet.password != this.wallet.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      this.$q.loading.show({
        delay: 0,
        spinnerColor: "positive"
      });

      this.$gateway.send("wallet", "import_wallet", this.wallet);
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.import-wallet {
  .q-if-disabled {
    cursor: default !important;
    .q-input-target {
      cursor: default !important;
    }
  }

  .oxen-field {
    margin-top: 16px;
  }
  .fileIcon {
    width: 14px;
    height: 14px;
    margin-top: 5px;
    margin-left: 3px;
  }
  .submit {
    .q-btn {
      width: 251px;
    }
  }
}
</style>
