<template>
  <!-- Register tab. Bindings and handlers are unchanged. -->
  <div class="master-node-registration">
    <i18n
      path="strings.masterNodeRegistrationDescription"
      tag="p"
      class="beldex-form-desc"
    >
      <code place="registerCommand">register_master_node</code>
      <code place="prepareCommand">prepare_registration</code>
    </i18n>
    <BeldexField
      :label="$t('fieldLabels.masterNodeCommand')"
      :error="$v.registration_string.$error"
      :disabled="registration_status.sending"
    >
      <q-input
        v-model.trim="registration_string"
        type="textarea"
        class="full-width text-area-oxen"
        placeholder="register_master_node …"
        :disabled="registration_status.sending"
        dark
        borderless
        dense
        @blur="$v.registration_string.$touch"
        @paste="onPaste"
      />
    </BeldexField>
    <div class="beldex-hr" />
    <div class="master-node-registration__note">
      <img src="~assets/icons/warning-amber.svg" alt="" />
      <p>{{ $t("strings.masterNodeRegistrationNote") }}</p>
    </div>
    <div class="beldex-form-actions">
      <q-btn
        class="beldex-btn"
        unelevated
        no-caps
        :disabled="registration_status.sending"
        @click="register()"
      >
        <img src="~assets/icons/register-btn.svg" alt="" />
        {{ $t("buttons.registerMasterNode") }}
      </q-btn>
    </div>

    <q-inner-loading :showing="registration_status.sending" dark>
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import BeldexField from "components/beldex_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "MasterNodeRegistration",
  components: {
    BeldexField
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
              message: this.$t("strings.progress.registering"),
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
.beldex-app .master-node-registration {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);

  .beldex-form-desc {
    margin: 0;
    font-family: var(--beldex-font-mono);
    color: var(--beldex-text-muted);

    code {
      font-family: inherit;
      color: var(--beldex-accent-glow);
    }
  }

  .beldex-form-actions {
    margin-top: 0;
  }

  // Command box: the shared field rules pin the control to 36px.
  .beldex-field .content {
    align-items: stretch;
    min-height: 150px;
    padding: var(--beldex-space-3) var(--beldex-space-4);
  }

  .beldex-field .q-field,
  .beldex-field .q-field__control,
  .beldex-field .q-field__control-container,
  .beldex-field .q-field__native {
    height: 100%;
    min-height: 0;
  }

  .beldex-field .q-field__native {
    padding: 0;
    resize: none;
    font-family: var(--beldex-font-mono);
  }

  &__note {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
    padding: var(--beldex-space-3) 14px;
    background-color: var(--beldex-warning-wash);
    border: 1px solid var(--beldex-warning-border);

    img {
      flex: 0 0 auto;
    }

    p {
      margin: 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      line-height: 17px;
      color: var(--beldex-warning-strong);
    }
  }
}
</style>
