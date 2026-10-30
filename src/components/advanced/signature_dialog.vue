<template>
  <!-- Signature result -->
  <q-dialog v-model="show" persistent>
    <div class="beldex-dialog beldex-dialog--wide">
      <div class="beldex-dialog__head">
        <div class="beldex-dialog__icon">
          <q-icon name="edit_note" size="20px" />
        </div>
        <div>
          <h2 class="beldex-dialog__title">
            {{ $t("dialog.signature.title") }}
          </h2>
          <p class="beldex-dialog__subtitle">
            {{ $t("dialog.signature.message") }}
          </p>
        </div>
      </div>

      <div class="beldex-dialog__body">
        <div>
          <span class="beldex-label">{{ $t("fieldLabels.data") }}</span>
          <div class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm">
            <div class="beldex-dialog__inset-text">{{ unsignedData }}</div>
            <q-btn
              class="beldex-dialog__copy"
              flat
              no-caps
              :aria-label="$t('buttons.copyData')"
              @click="onCopyUnsignedData"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[5, 10]"
                >{{ $t("buttons.copyData") }}</q-tooltip
              >
            </q-btn>
          </div>
        </div>
        <div>
          <span class="beldex-label">{{ $t("fieldLabels.signature") }}</span>
          <div class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm">
            <div class="beldex-dialog__inset-text">{{ signature }}</div>
            <q-btn
              class="beldex-dialog__copy"
              flat
              no-caps
              :aria-label="$t('buttons.copySignature')"
              @click="onCopySignature"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[5, 10]"
                >{{ $t("buttons.copySignature") }}</q-tooltip
              >
            </q-btn>
          </div>
        </div>
        <div>
          <span class="beldex-label">{{ $t("fieldLabels.address") }}</span>
          <div class="beldex-dialog__inset beldex-dialog__inset--copy q-mt-sm">
            <div class="beldex-dialog__inset-text">{{ address }}</div>
            <q-btn
              class="beldex-dialog__copy"
              flat
              no-caps
              :aria-label="$t('buttons.copyAddress')"
              @click="onCopyAddress"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("buttons.copy") }}
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[5, 10]"
                >{{ $t("buttons.copyAddress") }}</q-tooltip
              >
            </q-btn>
          </div>
        </div>
      </div>

      <div class="beldex-dialog__actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :label="$t('buttons.close')"
          @click="onClose"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: "SignatureDialog",
  props: {
    onCopySignature: {
      type: Function,
      required: true
    },
    onCopyAddress: {
      type: Function,
      required: true
    },
    onCopyUnsignedData: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: false,
      default: true
    },
    address: {
      type: String,
      required: true
    },
    unsignedData: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.info {
  flex: 1;
  word-break: break-all;
  word-wrap: break-word;

  .labels {
    font-weight: bold;
    margin-bottom: 4px;
  }
}
</style>
