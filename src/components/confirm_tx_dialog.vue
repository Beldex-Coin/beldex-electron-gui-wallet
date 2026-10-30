<template>
  <q-dialog v-model="show" persistent>
    <q-card class="beldex-dialog">
      <div class="beldex-dialog__head">
        <div class="beldex-dialog__icon">
          <img src="~assets/icons/dialog-send.svg" alt="" />
        </div>
        <div>
          <h2 class="beldex-dialog__title">
            {{ $t("dialog.confirmTransaction.title") }}
          </h2>
        </div>
      </div>

      <div class="beldex-dialog__body">
        <div>
          <span class="beldex-label">{{
            $t("dialog.confirmTransaction.sendTo")
          }}</span>
          <div class="beldex-dialog__inset q-mt-sm">{{ sendTo }}</div>
        </div>

        <div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("strings.transactions.amount")
            }}</span>
            <span class="beldex-dialog__kv-value--strong"
              >{{ amount }} BDX</span
            >
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("strings.transactions.fee")
            }}</span>
            <span>{{ fee }} BDX</span>
          </div>
          <div class="beldex-dialog__kv">
            <span class="beldex-dialog__kv-label">{{
              $t("dialog.confirmTransaction.priority")
            }}</span>
            <span>{{ isflashToTranslatedLabel(isflash) }}</span>
          </div>
        </div>
      </div>

      <div class="beldex-dialog__actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :label="$t('dialog.buttons.cancel')"
          @click="onCancelTransaction"
        />
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          @click="onConfirmTransaction"
        >
          <img src="~assets/icons/send-authorize.svg" alt="" />
          {{ $t("buttons.send") }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ConfirmTransactionDialog",
  props: {
    sendTo: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    isflash: {
      type: Boolean,
      required: true
    },
    onConfirmTransaction: {
      type: Function,
      required: true
    },
    onCancelTransaction: {
      type: Function,
      required: true
    },
    show: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    isflashToTranslatedLabel(isflash) {
      const flashOrSlow = isflash
        ? "strings.priorityOptions.flash"
        : "strings.priorityOptions.slow";
      return this.$t(flashOrSlow);
    }
  }
};
</script>

<style></style>
