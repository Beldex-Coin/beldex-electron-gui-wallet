<template>
  <q-dialog ref="dialog" persistent @hide="onDialogHide" @show="focusInput">
    <q-card class="beldex-dialog unlock-dialog">
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
          <img src="~assets/icons/dialog-lock.svg" alt="" />
        </div>
        <div>
          <h2 class="beldex-dialog__title">
            {{ $t("dialog.password.heading") }}
          </h2>
          <p class="beldex-dialog__subtitle unlock-dialog__subtitle">
            {{ $t("dialog.password.unlocking", { name: walletName }) }}
          </p>
        </div>
      </div>

      <div class="beldex-dialog__body">
        <div class="beldex-input unlock-dialog__input">
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
            <img v-if="revealed" src="~assets/icons/password-eye.svg" alt="" />
            <img v-else src="~assets/icons/eye-off.svg" alt="" />
          </button>
        </div>

        <div class="beldex-dialog__note">
          <img src="~assets/icons/note-info.svg" alt="" />
          <span>{{ $t("dialog.password.hint") }}</span>
        </div>
      </div>

      <div class="beldex-dialog__actions">
        <q-btn class="beldex-btn" unelevated no-caps @click="onOk">
          {{ $t("dialog.password.unlock") }}
          <img src="~assets/icons/unlock-arrow.svg" alt="" />
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
// Unlock wallet, with or without a password hint. Opened with
// `$q.dialog({ component: UnlockWalletDialog, parent: this, walletName })`; the
// password is handed back through the standard `ok` event, never stored here
// beyond the input's lifetime.
export default {
  name: "UnlockWalletDialog",
  props: {
    walletName: {
      type: String,
      required: true
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
      this.$emit("ok", this.password);
      this.hide();
    },
    onCancel() {
      this.$emit("cancel");
      this.hide();
    }
  }
};
</script>
