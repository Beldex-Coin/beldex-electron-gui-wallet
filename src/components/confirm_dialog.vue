<template>
  <q-dialog ref="dialog" persistent @hide="onDialogHide">
    <q-card class="beldex-dialog confirm-dialog">
      <div class="beldex-dialog__head">
        <div
          class="beldex-dialog__icon"
          :class="`confirm-dialog__icon--${iconTone}`"
        >
          <q-icon v-if="icon === 'warning'" name="warning_amber" size="18px" />
          <span v-else class="confirm-dialog__ico" :style="maskStyle(icon)" />
        </div>
        <div>
          <h2 class="beldex-dialog__title">{{ title }}</h2>
          <p v-if="message" class="beldex-dialog__subtitle">{{ message }}</p>
        </div>
      </div>

      <div v-if="warning" class="beldex-dialog__warn confirm-dialog__warn">
        <q-icon name="warning_amber" size="16px" />
        <span>{{ warning }}</span>
      </div>

      <div class="beldex-dialog__actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :label="cancelLabel"
          @click="onCancel"
        />
        <q-btn
          class="beldex-btn"
          :class="{ 'confirm-dialog__ok--danger': okTone === 'danger' }"
          unelevated
          no-caps
          @click="onOk"
        >
          <span
            v-if="okIcon"
            class="confirm-dialog__ico confirm-dialog__ico--btn"
            :style="maskStyle(okIcon)"
          />
          {{ okLabel }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
// Delete wallet, Restart, Exit, Delete contact and Discard changes
// confirmations. Takes translated strings as
// props (no `$t`), so the gateway can open it outside a component tree. Emits
// the standard Quasar dialog events: `ok`, `cancel`, `hide`.
const ICONS = {
  trash: require("assets/icons/wmenu-trash.svg"),
  exit: require("assets/icons/rail-exit.svg"),
  restart: require("assets/icons/wmenu-rescan.svg")
};

export default {
  name: "ConfirmDialog",
  props: {
    title: { type: String, required: true },
    message: { type: String, required: false, default: "" },
    warning: { type: String, required: false, default: "" },
    okLabel: { type: String, required: true },
    cancelLabel: { type: String, required: true },
    // trash | exit | restart | warning
    icon: { type: String, required: false, default: "warning" },
    // danger | accent | neutral: colours the icon box
    iconTone: { type: String, required: false, default: "neutral" },
    // danger | primary
    okTone: { type: String, required: false, default: "primary" },
    okIcon: { type: String, required: false, default: "" }
  },
  methods: {
    maskStyle(name) {
      return { "--ico": `url(${ICONS[name]})` };
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit("hide");
    },
    onOk() {
      this.$emit("ok");
      this.hide();
    },
    onCancel() {
      this.$emit("cancel");
      this.hide();
    }
  }
};
</script>
