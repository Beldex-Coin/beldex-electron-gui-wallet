<template>
  <q-dialog
    ref="dialog"
    persistent
    :no-route-dismiss="noRouteDismiss"
    @hide="onDialogHide"
    @show="focusInput"
  >
    <q-card class="beldex-dialog unlock-dialog password-dialog">
      <button
        type="button"
        class="beldex-dialog__close"
        :aria-label="$t('dialog.buttons.cancel')"
        @click="onCancel"
      >
        <img src="~assets/icons/dialog-close.svg" alt="" />
      </button>

      <div class="beldex-dialog__head">
        <div class="beldex-dialog__icon">
          <img src="~assets/icons/dialog-key.svg" alt="" />
        </div>
        <div>
          <h2 class="beldex-dialog__title">{{ title }}</h2>
          <p class="beldex-dialog__subtitle unlock-dialog__subtitle">
            {{ hasPassword ? subtitle : "" }}
          </p>
        </div>
      </div>

      <div class="beldex-dialog__body">
        <template v-if="hasPassword">
          <div>
            <span class="beldex-label">{{ $t("fieldLabels.password") }}</span>
            <div class="beldex-input unlock-dialog__input q-mt-sm">
              <input
                ref="input"
                v-model="password"
                class="unlock-dialog__field"
                :type="revealed ? 'text' : 'password'"
                :placeholder="$t('dialog.password.placeholder')"
                :aria-label="$t('fieldLabels.password')"
                autocomplete="off"
                @keyup.enter="onOk"
              />
              <button
                type="button"
                class="unlock-dialog__reveal"
                :aria-label="
                  revealed
                    ? $t('dialog.password.hidePassword')
                    : $t('dialog.password.showPassword')
                "
                :aria-pressed="revealed"
                @click="revealed = !revealed"
              >
                <img
                  v-if="revealed"
                  src="~assets/icons/password-eye.svg"
                  alt=""
                />
                <img v-else src="~assets/icons/eye-off.svg" alt="" />
              </button>
            </div>
          </div>
        </template>
        <div v-else class="beldex-dialog__note">
          <img src="~assets/icons/note-info.svg" alt="" />
          <span>{{ noPasswordMessage }}</span>
        </div>
      </div>

      <div class="beldex-dialog__actions">
        <q-btn class="beldex-btn" unelevated no-caps @click="onOk">
          {{ okLabel }}
          <img src="~assets/icons/unlock-arrow.svg" alt="" />
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
// Password prompt (e.g. Show private keys). Opened by the
// `showPasswordConfirmation` mixin with `$q.dialog({ component, parent, ... })`
// so callers keep their `.onOk(password => ...)` chains unchanged. With no
// wallet password set the field is hidden and OK resolves with "".
export default {
  name: "PasswordConfirmDialog",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false,
      default: ""
    },
    okLabel: {
      type: String,
      required: true
    },
    hasPassword: {
      type: Boolean,
      required: true
    },
    noPasswordMessage: {
      type: String,
      required: false,
      default: ""
    },
    // Masternode opens this while navigating to its page; without it the
    // route change dismisses the dialog and its cancel handler routes back.
    noRouteDismiss: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      password: "",
      revealed: false
    };
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    focusInput() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
    onDialogHide() {
      this.password = "";
      this.$emit("hide");
    },
    onOk() {
      this.$emit("ok", this.hasPassword ? this.password : "");
      this.hide();
    },
    onCancel() {
      this.$emit("cancel");
      this.hide();
    }
  }
};
</script>
