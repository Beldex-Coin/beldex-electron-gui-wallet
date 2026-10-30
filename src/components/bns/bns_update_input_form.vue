<template>
  <!-- Update owner / values. Bindings,
       validators and handlers are unchanged. -->
  <div class="bns-update-input-form">
    <div class="bns-update-form__options">
      <button
        type="button"
        class="bns-update-form__opt"
        :class="{ 'bns-update-form__opt--on': contentUpdate === 'Owner' }"
        role="radio"
        :aria-checked="contentUpdate === 'Owner' ? 'true' : 'false'"
        @click="contentUpdate = 'Owner'"
      >
        <span class="bns-update-form__radio" />
        <span class="bns-update-form__opt-text">
          <span class="bns-update-form__opt-title">{{
            $t("fieldLabels.updateOwner")
          }}</span>
          <span class="bns-update-form__opt-hint">{{
            $t("strings.bns.updateOwnerHint")
          }}</span>
        </span>
      </button>

      <div v-if="contentUpdate === 'Owner'" class="bns-update-form__fields">
        <BeldexField
          :label="$t('fieldLabels.OwnerWalletaddress')"
          :error="$v.ownerAddress.$error"
        >
          <q-input
            v-model.trim="ownerAddress"
            :dark="theme == 'dark'"
            :placeholder="record.owner"
            borderless
            dense
            @blur="$v.ownerAddress.$touch"
          />
        </BeldexField>
      </div>

      <button
        type="button"
        class="bns-update-form__opt"
        :class="{
          'bns-update-form__opt--on': contentUpdate === 'Values',
          'bns-update-form__opt--error': idsValidation
        }"
        role="radio"
        :aria-checked="contentUpdate === 'Values' ? 'true' : 'false'"
        @click="contentUpdate = 'Values'"
      >
        <span class="bns-update-form__radio" />
        <span class="bns-update-form__opt-text">
          <span class="bns-update-form__opt-title">{{
            $t("fieldLabels.updateValues")
          }}</span>
          <span class="bns-update-form__opt-hint">{{
            $t("strings.bns.updateValuesHint")
          }}</span>
        </span>
      </button>

      <div v-if="contentUpdate === 'Values'" class="bns-update-form__fields">
        <div
          class="bns-update-form__value"
          :class="{ 'bns-update-form__value--on': bchatIdRef }"
        >
          <q-checkbox
            v-model="bchatIdRef"
            class="bns-update-form__check"
            dense
            label="BChat ID"
          />
          <BeldexField class="full-width" :error="$v.bchatId.$error">
            <q-input
              v-model="bchatId"
              :disable="!bchatIdRef"
              :dark="theme == 'dark'"
              :placeholder="record.value_bchat || 'Bchat ID'"
              borderless
              dense
              @blur="$v.bchatId.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-update-form__value"
          :class="{ 'bns-update-form__value--on': belnetIdRef }"
        >
          <q-checkbox
            v-model="belnetIdRef"
            class="bns-update-form__check"
            dense
            label="Belnet ID"
          />
          <BeldexField class="full-width" :error="$v.belnetId.$error">
            <q-input
              v-model="belnetId"
              :disable="!belnetIdRef"
              :dark="theme == 'dark'"
              :placeholder="record.value_belnet || 'Belnet ID'"
              borderless
              dense
              @blur="$v.belnetId.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-update-form__value"
          :class="{ 'bns-update-form__value--on': addressRef }"
        >
          <q-checkbox
            v-model="addressRef"
            class="bns-update-form__check"
            dense
            :label="$t('fieldLabels.address')"
          />
          <BeldexField class="full-width" :error="$v.address.$error">
            <q-input
              v-model="address"
              :disable="!addressRef"
              :dark="theme == 'dark'"
              :placeholder="record.value_wallet || 'wallet address'"
              borderless
              dense
              @blur="$v.address.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-update-form__value"
          :class="{ 'bns-update-form__value--on': ethAddressRef }"
        >
          <q-checkbox
            v-model="ethAddressRef"
            class="bns-update-form__check"
            dense
            label="ETH"
          />
          <BeldexField class="full-width" :error="$v.ethAddress.$error">
            <q-input
              v-model="ethAddress"
              :disable="!ethAddressRef"
              :dark="theme == 'dark'"
              :placeholder="record.value_eth_addr || 'ETH address'"
              borderless
              dense
              @blur="$v.ethAddress.$touch"
            />
          </BeldexField>
        </div>
      </div>
    </div>

    <div class="bns-update-form__note">
      <img src="~assets/icons/warning-amber.svg" alt="" />
      <p>{{ $t("strings.bnsUpdateDescription") }}</p>
    </div>
    <div class="bns-update-form__actions">
      <q-btn
        class="beldex-btn bns-update-form__submit"
        unelevated
        no-caps
        :disable="
          !(
            is_ready &&
            record.name &&
            (contentUpdate === 'Owner' ? ownerAddress : true) &&
            (contentUpdate === 'Values'
              ? address || bchatId || ethAddress || belnetId
              : true)
          )
        "
        @click="submit()"
      >
        <img src="~assets/icons/renew.svg" alt="" />
        {{ $t("buttons.update") }}
      </q-btn>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { mapState } from "vuex";

import {
  address,
  bchat_id,
  belnet_address,
  eth_address
} from "src/validators/common";
import BeldexField from "components/beldex_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSUpdateInputForm",
  components: {
    BeldexField
  },
  setup() {
    return {
      bchatIdRef: ref(false),
      belnetIdRef: ref(false),
      addressRef: ref(false),
      ethAddressRef: ref(false)
    };
  },
  mixins: [WalletPassword],
  props: {
    currentRecord: {
      // type: Object,
      required: false,
      default: false
    }
  },
  data() {
    const initialRecord = this.currentRecord;

    return {
      record: { ...initialRecord },
      ownerAddress: "",
      bchatId: "",
      belnetId: "",
      address: "",
      ethAddress: "",
      idsValidation: false,
      contentUpdate: "Values"
    };
  },
  watch: {
    contentUpdate: {
      handler(val, old) {
        if (val === old) return;
        this.updateInputFieldChanger();
      }
    },
    addressRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.$v.address.$reset();
          this.address = "";
        }
      }
    },
    bchatIdRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.$v.bchatId.$reset();
          this.bchatId = "";
        }
      }
    },
    belnetIdRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.$v.belnetId.$reset();
          this.belnetId = "";
        }
      }
    },
    ethAddressRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.$v.ethAddress.$reset();
          this.ethAddress = "";
        }
      }
    }
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    }
  }),
  methods: {
    isAddress: function(value) {
      if (value === "") return true;

      return new Promise(resolve => {
        address(value, this.$gateway)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    },
    toastmsg(msg) {
      this.$q.notify({
        type: "negative",
        timeout: 3000,
        message: msg
      });
    },
    updateInputFieldChanger() {
      this.$v.$reset();
    },
    submit() {
      this.$v.ownerAddress.$touch();
      if (this.contentUpdate === "Owner" && this.$v.ownerAddress.$error) {
        this.toastmsg(this.$t("notification.errors.invalidOwner"));
        return;
      }
      if (
        this.contentUpdate === "Owner" &&
        this.ownerAddress === this.record.owner
      ) {
        this.toastmsg("same owner address");
        return;
      }
      if (this.contentUpdate === "Values" && this.addressRef) {
        this.$v.address.$touch();
        if (this.$v.address.$error) {
          this.toastmsg("Invalid Address");
          return;
        }
        if (this.address === this.record.value_wallet) {
          this.toastmsg("same wallet address");
          return;
        }
      }

      if (this.contentUpdate === "Values" && this.bchatIdRef) {
        this.$v.bchatId.$touch();
        if (this.$v.bchatId.$error) {
          this.toastmsg("Invalid Bchat Id");
          return;
        }

        if (
          this.bchatId.toLowerCase() === this.record.value_bchat.toLowerCase()
        ) {
          this.toastmsg("same Bchat id");
          return;
        }
      }

      if (this.contentUpdate === "Values" && this.belnetIdRef) {
        this.$v.belnetId.$touch();
        if (this.$v.belnetId.$error) {
          this.toastmsg("Invalid Belnet Id");
          return;
        }
        if (
          this.belnetId.toLowerCase() === this.record.value_belnet.toLowerCase()
        ) {
          this.toastmsg("same Belnet id");
          return;
        }
      }

      if (this.contentUpdate === "Values" && this.ethAddressRef) {
        this.$v.ethAddress.$touch();
        if (this.$v.ethAddress.$error) {
          this.toastmsg("Invalid ETH Address");
          return;
        }
        if (
          this.ethAddress.toLowerCase() ===
          this.record.value_eth_addr.toLowerCase()
        ) {
          this.toastmsg("same ETH Address");
          return;
        }
      }

      let submitRecord;
      if (this.contentUpdate === "Owner") {
        submitRecord = {
          name: this.record.name,
          owner: this.ownerAddress,
          backup_owner: this.record.backup_owner
        };
      } else {
        submitRecord = {
          name: this.record.name,
          value_bchat: this.bchatId,
          value_belnet: this.belnetId,
          value_wallet: this.address,
          value_eth_addr: this.ethAddress
        };
      }
      // Send up the submission with the record
      this.$emit("onSubmit", submitRecord);
    }
  },
  validations: {
    ownerAddress: {
      validate: function(value) {
        return this.isAddress(value);
      }
    },
    address: {
      validate: function(value) {
        if (!value) return false;
        return this.isAddress(value);
      }
    },
    bchatId: {
      validate: function(value) {
        const _value = value.toLowerCase();
        return bchat_id(_value);
      }
    },

    belnetId: {
      validate: function(value) {
        const _value = value.toLowerCase();
        return belnet_address(_value.replace(".bdx", ""));
      }
    },

    ethAddress: {
      validate: function(value) {
        return eth_address(value);
      }
    }
  }
};
</script>

<style lang="scss">
.beldex-app .bns-update-input-form {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);
}

.beldex-app .bns-update-form {
  &__options {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
  }

  // Option card.
  &__opt {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px var(--beldex-space-4);
    text-align: left;
    background-color: var(--beldex-panel);
    border: 1px solid var(--beldex-border-strong);
    border-radius: 0;
    cursor: pointer;

    &--on {
      padding: 14px var(--beldex-space-5);
      background-color: rgba(0, 191, 10, 0.02);
      border-color: var(--beldex-accent-border-soft);
      box-shadow: inset 2px 0 0 #00cf0a;
    }

    &--error {
      border-color: var(--beldex-danger);
    }
  }

  &__radio {
    display: flex;
    flex: 0 0 14px;
    align-items: center;
    justify-content: center;
    height: 14px;
    background-color: #000;
    border: 1px solid var(--beldex-text-muted);
  }

  &__opt--on .bns-update-form__radio {
    border-color: var(--beldex-accent);

    &::after {
      content: "";
      width: 6px;
      height: 6px;
      background-color: var(--beldex-accent);
    }
  }

  &__opt-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    line-height: 16px;
  }

  &__opt-title {
    font-family: var(--beldex-font-sans);
    font-size: var(--beldex-text-md);
    font-weight: 600;
    color: var(--beldex-text);
  }

  &__opt-hint {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
  }

  // Fields under the selected option, indented 30px.
  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
    padding: 0 0 var(--beldex-space-1) 30px;

    .beldex-field .label {
      margin-bottom: var(--beldex-space-2);
      font-size: var(--beldex-text-sm);
    }

    // Beats app.styl `.bns-page .beldex-field .content` min-height 45px !important.
    .beldex-field .content {
      min-height: 40px !important;
      padding: 0 var(--beldex-space-3);
      background: var(--beldex-bg);
    }

    .beldex-field:not(.disable):not(.disable-hover) .content:hover {
      background: var(--beldex-bg);
    }
  }

  // Value row: checkbox + label in a 120px column, then the input.
  &__value {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);

    .beldex-field .content {
      padding-left: 0;
      background: transparent;
      border-color: rgba(235, 235, 235, 0.1);
      opacity: 0.5;
    }

    .beldex-field:not(.disable):not(.disable-hover) .content:hover {
      background: transparent;
    }
  }

  &__value--on .beldex-field .content {
    padding-left: var(--beldex-space-3);
    background: var(--beldex-bg);
    border-color: var(--beldex-border);
    opacity: 1;
  }

  &__value--on .beldex-field:not(.disable):not(.disable-hover) .content:hover {
    background: var(--beldex-bg);
  }

  // Square 12px box; checked shows a 6px green fill (no tick).
  &__check.q-checkbox {
    flex: 0 0 120px;
    gap: var(--beldex-space-2);

    .q-checkbox__inner {
      width: 12px;
      min-width: 12px;
      height: 12px;
      font-size: 12px;
    }

    .q-checkbox__bg {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border: 1px solid var(--beldex-text-muted);
      border-radius: 0;
    }

    .q-checkbox__svg {
      display: none;
    }

    .q-checkbox__inner--truthy .q-checkbox__bg {
      background: transparent;
      border-color: var(--beldex-accent);

      &::after {
        content: "";
        position: absolute;
        top: 2px;
        right: 2px;
        bottom: 2px;
        left: 2px;
        background-color: var(--beldex-accent);
      }
    }

    .q-checkbox__label {
      padding-left: 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      line-height: 16px;
      color: var(--beldex-text-muted);
    }

    &[aria-checked="true"] .q-checkbox__label {
      color: var(--beldex-text);
    }
  }

  // Amber note.
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

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__submit {
    padding: 0 var(--beldex-space-5);
    font-family: var(--beldex-font-sans);
    font-weight: 600;
    line-height: 16px;
  }
}
</style>
