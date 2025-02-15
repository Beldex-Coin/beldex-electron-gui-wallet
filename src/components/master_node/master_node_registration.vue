<template>
  <div class="master-node-registration">
    <div class="q-pa-md">
      <i18n
        path="strings.masterNodeRegistrationDescription"
        tag="div"
        class="tab-desc q-mb-lg ft-semibold"
      >
        <b place="registerCommand">register_master_node</b>
        <b place="prepareCommand">prepare_registration</b>
      </i18n>
      <OxenField
        :label="$t('fieldLabels.masterNodeCommand')"
        :error="$v.registration_string.$error"
        :disabled="registration_status.sending"
      >
        <q-input
          v-model.trim="registration_string"
          type="textarea"
          class="full-width text-area-oxen"
          placeholder="register_master_node ..."
          :disabled="registration_status.sending"
          borderless
          dense
          @blur="$v.registration_string.$touch"
          @paste="onPaste"
        />
      </OxenField>
      <div class="flex justify-center q-mt-md">
        <q-btn
          class="register-button"
          color="primary"
          :label="$t('buttons.registerMasterNode')"
          :disabled="registration_status.sending"
          @click="register()"
        />
      </div>
    </div>

    <q-inner-loading :showing="registration_status.sending">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import OxenField from "components/oxen_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "MasterNodeRegistration",
  components: {
    OxenField
  },
  mixins: [WalletPassword],
  data() {
    return {
      registration_string: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    registration_status: state => state.gateway.master_node_status.registration
  }),
  validations: {
    registration_string: { required }
  },
  watch: {
    registration_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.registration_string = "";
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    async register() {
      this.$v.registration_string.$touch();

      if (this.$v.registration_string.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidMasterNodeCommand")
        });
        return;
      }

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.registerMasterNode.title"),
        noPasswordMessage: this.$t("dialog.registerMasterNode.message"),
        ok: {
          label: this.$t("dialog.registerMasterNode.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.clear")
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // in case of no password
          password = password || "";
          this.$store.commit("gateway/set_mnode_status", {
            registration: {
              code: 1,
              message: "Registering...",
              sending: true
            }
          });
          this.$gateway.send("wallet", "register_master_node", {
            password,
            string: this.registration_string.trim()
          });
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    onPaste() {
      this.$nextTick(() => {
        this.registration_string = this.registration_string.trim();
      });
    }
  }
};
</script>

<style lang="scss">
.master-node-registration {
  border: none;
  .register-button {
    margin-top: 6px;
  }
  .tab-desc {
    color: #afafbe;
  }
}
</style>
