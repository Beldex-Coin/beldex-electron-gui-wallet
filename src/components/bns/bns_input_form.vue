<template>
  <!-- Buy BNS. Bindings, validators and handlers
       are unchanged. -->
  <div class="bns-input-form">
    <div class="bns-form__block">
      <span class="beldex-label">{{ $t("strings.bns.duration") }}</span>
      <div class="bns-form__durations">
        <button
          v-for="item in typeOptions"
          :key="item.type"
          type="button"
          class="bns-form__duration"
          :class="{ 'bns-form__duration--on': record.years == item.value }"
          @click="record.years = item.value"
        >
          <span class="bns-form__duration-label">{{ item.label }}</span>
          <span class="bns-form__duration-amount">{{ item.amount }}</span>
          <q-icon
            v-if="record.years == item.value"
            class="bns-form__duration-check"
            name="check_circle_outline"
          />
        </button>
      </div>
    </div>

    <!-- Name -->
    <div class="bns-form__block">
      <BeldexField
        :label="$t('fieldLabels.name')"
        :disable="disableName"
        :error="$v.record.name.$error"
      >
        <q-input
          v-model.trim="record.name"
          dark
          maxlength="67"
          :placeholder="$t('placeholders.bnsName')"
          :disable="disableName"
          borderless
          dense
          :suffix="'.bdx'"
          @blur="$v.record.name.$touch"
        />
      </BeldexField>
    </div>

    <!-- Owner / Backup owner -->
    <div class="bns-form__owners">
      <BeldexField
        :label="$t('fieldLabels.owner')"
        :error="$v.record.owner.$error"
        optional
        bracket-optional
      >
        <q-input
          v-model.trim="record.owner"
          dark
          :placeholder="$t('placeholders.bnsOwnerShort')"
          borderless
          dense
          :disable="renewing"
          @blur="$v.record.owner.$touch"
        />
      </BeldexField>
      <BeldexField
        :label="$t('fieldLabels.backupOwner')"
        :error="$v.record.backup_owner.$error"
        optional
        bracket-optional
      >
        <q-input
          v-model.trim="record.backup_owner"
          dark
          :placeholder="$t('placeholders.bnsBackupOwnerShort')"
          borderless
          dense
          :disable="renewing"
          @blur="$v.record.backup_owner.$touch"
        />
      </BeldexField>
    </div>

    <!-- Values -->
    <div class="bns-form__block" :class="{ errorborder: idsValidation }">
      <span class="beldex-label">{{ $t("fieldLabels.values") }}</span>
      <div class="bns-form__values">
        <div
          class="bns-form__value"
          :class="{ 'bns-form__value--on': bchatIdRef }"
        >
          <q-checkbox v-model="bchatIdRef" dense size="xs" />
          <span class="bns-form__value-label">{{
            $t("strings.bns.bchatID")
          }}</span>
          <BeldexField
            class="bns-form__value-field"
            optional
            :error="$v.bchatId.$error"
          >
            <q-input
              v-model="bchatId"
              :disable="!bchatIdRef"
              dark
              :placeholder="$t('placeholders.bnsValueBchat')"
              borderless
              dense
              @blur="$v.bchatId.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-form__value"
          :class="{ 'bns-form__value--on': belnetIdRef }"
        >
          <q-checkbox v-model="belnetIdRef" dense size="xs" />
          <span class="bns-form__value-label">{{
            $t("fieldLabels.belnetId")
          }}</span>
          <BeldexField
            class="bns-form__value-field"
            optional
            :error="$v.belnetId.$error"
          >
            <q-input
              v-model="belnetId"
              :disable="!belnetIdRef"
              dark
              :placeholder="$t('placeholders.bnsValueBelnet')"
              borderless
              dense
              @blur="$v.belnetId.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-form__value"
          :class="{ 'bns-form__value--on': addressRef }"
        >
          <q-checkbox v-model="addressRef" dense size="xs" />
          <span class="bns-form__value-label">{{
            $t("fieldLabels.address")
          }}</span>
          <BeldexField
            class="bns-form__value-field"
            optional
            :error="$v.address.$error"
          >
            <q-input
              v-model="address"
              :disable="!addressRef"
              dark
              :placeholder="$t('placeholders.bnsValueAddress')"
              borderless
              dense
              @blur="$v.address.$touch"
            />
          </BeldexField>
        </div>
        <div
          class="bns-form__value"
          :class="{ 'bns-form__value--on': ethAddressRef }"
        >
          <q-checkbox v-model="ethAddressRef" dense size="xs" />
          <span class="bns-form__value-label">{{ $t("fieldLabels.eth") }}</span>
          <BeldexField
            class="bns-form__value-field"
            optional
            :error="$v.ethAddress.$error"
          >
            <q-input
              v-model="ethAddress"
              :disable="!ethAddressRef"
              dark
              :placeholder="$t('placeholders.bnsValueEth')"
              borderless
              dense
              @blur="$v.ethAddress.$touch"
            />
          </BeldexField>
        </div>
      </div>
      <div class="bns-form__info">
        <img src="~assets/icons/note-info.svg" alt="" />
        <p>{{ $t("strings.bns.ethNotes") }}</p>
      </div>
    </div>

    <div class="beldex-form-actions">
      <q-btn
        v-if="showClearButton"
        class="beldex-btn beldex-btn--ghost"
        unelevated
        no-caps
        :label="$t('buttons.clear')"
        @click="clear()"
      />
      <q-btn
        class="beldex-btn"
        unelevated
        no-caps
        :disable="
          !(
            is_ready &&
            record.name &&
            (address || bchatId || belnetId || ethAddress)
          )
        "
        @click="submit()"
      >
        <img
          v-if="!updating && !renewing"
          class="bns-form__purchase-icon"
          src="~assets/icons/tag.svg"
          alt=""
        />
        {{ submitLabel }}
      </q-btn>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import {
  address,
  bchat_id,
  belnet_address,
  eth_address,
  bns_name
} from "src/validators/common";
import BeldexField from "components/beldex_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSInputForm",
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
    submitLabel: {
      type: String,
      required: true
    },
    updating: {
      type: Boolean,
      required: true
    },
    renewing: {
      type: Boolean,
      required: false,
      default: false
    },
    disableType: {
      type: Boolean,
      required: false,
      default: false
    },
    disableName: {
      type: Boolean,
      required: false,
      default: false
    },
    showClearButton: {
      type: Boolean,
      required: false,
      default: false
    },
    disableSubmitButton: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    let belnetOptions = [
      {
        label: "1 Year",
        value: "1y",
        amount: "650 BDX",
        price: 650
      },
      {
        label: "2 Years",
        value: "2y",
        amount: "1000 BDX",
        price: 1000
      },
      {
        label: "5 Years",
        value: "5y",
        amount: "2000 BDX",
        price: 2000
      },
      {
        label: "10 Years",
        value: "10y",
        amount: "4000 BDX",
        price: 4000
      }
    ];
    let typeOptions = [...belnetOptions];

    const initialRecord = {
      // bns 1 year is valid on renew or purchase
      years: typeOptions[0].value,
      type: "",
      name: "",
      value: "",
      owner: "",
      backup_owner: ""
    };

    return {
      record: { ...initialRecord },
      typeOptions,
      belnetOptions,

      bchatId: "",
      belnetId: "",
      address: "",
      ethAddress: "",
      idsValidation: false
    };
  },
  watch: {
    // Feeds the page's "Purchase summary" panel.
    summary: {
      handler(val) {
        this.$emit("onSummary", val);
      },
      immediate: true
    },
    addressRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.address = "";
        }
      }
    },
    bchatIdRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.bchatId = "";
        }
      }
    },
    belnetIdRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.belnetId = "";
        }
      }
    },
    ethAddressRef: {
      handler(val, old) {
        if (val === old) return;
        if (!val) {
          this.ethAddress = "";
        }
      }
    }
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    our_address: state => state.gateway.wallet.info.address,
    info: state => state.gateway.wallet.info,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    summary() {
      const option =
        this.typeOptions.find(item => item.value === this.record.years) ||
        this.typeOptions[0];
      const name = (this.record.name || "").toLowerCase();
      return {
        name: name ? (name.includes(".bdx") ? name : name + ".bdx") : "",
        duration: option.label,
        price: option.price
      };
    },
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    value_field_label() {
      if (this.record.type === "bchat") {
        return this.$t("fieldLabels.bchatId");
      } else {
        return this.$t("fieldLabels.belnetFullAddress");
      }
    },
    can_update() {
      // if we are on update screen and there have been no changes, then not allowed
      // to click "update"

      if (this.updating === true) {
        const isOwnerDifferent =
          this.record.owner !== "" &&
          this.record.owner !== this.initialRecord.owner;
        // const isBackupOwnerDifferent =
        //   this.record.backup_owner !== "" &&
        //   this.record.backup_owner !== this.initialRecord.backup_owner;
        const isValueDifferent = this.record.value !== this.initialRecord.value;
        const different = isOwnerDifferent || isValueDifferent;
        // isBackupOwnerDifferent ||

        return different;
      }
      return true;
    },
    value_placeholder() {
      if (this.record.type === "bchat") {
        return this.$t("placeholders.bchatId");
      } else {
        return this.$t("placeholders.belnetFullAddress");
      }
    },
    owner_placeholder() {
      const { owner } = this.initialRecord || {};
      if (!owner || owner.trim() === "") {
        return this.our_address;
      }

      return owner;
    },
    cleanRecord() {
      return {
        years: this.typeOptions[0].value,
        type: "bchat",
        name: "",
        value: "",
        owner: "",
        backup_owner: ""
      };
    }
  }),
  methods: {
    setRecord(record) {
      this.initialRecord = {
        ...this.cleanRecord,
        ...(record || {})
      };
      this.record = { ...this.initialRecord };
    },
    isAddress: function(value) {
      if (value === "") return true;

      return new Promise(resolve => {
        address(value, this.$gateway)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    },
    reset() {
      this.initialRecord = { ...this.cleanRecord };
      this.record = { ...this.cleanRecord };
      (this.bchatId = ""),
        (this.belnetId = ""),
        (this.address = ""),
        (this.ethAddress = "");
      (this.bchatIdRef = false),
        (this.belnetIdRef = false),
        (this.addressRef = false),
        (this.ethAddressRef = false);
      this.$v.$reset();
    },
    submit() {
      this.$v.record.$touch();

      const nameValidator = this.$v.record.name;
      if (nameValidator.$error) {
        let message;
        if (!nameValidator.required) {
          message = "notification.errors.enterName";
        } else if (!nameValidator.maxLength) {
          message = "notification.errors.invalidNameLength";
        } else if (!nameValidator.hyphen) {
          message = "notification.errors.invalidNameHypenNotAllowed";
        } else {
          message = "notification.errors.invalidNameFormat";
        }
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t(message)
        });
        return;
      }

      if (this.$v.record.backup_owner.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidBackupOwner")
        });
        return;
      }

      if (this.$v.record.owner.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidOwner")
        });
        return;
      }
      if (this.addressRef) {
        this.$v.address.$touch();
        if (this.$v.address.$error) {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: "Invalid Address"
          });
          return;
        }
      }
      if (this.bchatIdRef) {
        this.$v.bchatId.$touch();
        if (this.$v.bchatId.$error) {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: "Invalid Bchat Id"
          });
          return;
        }
      }
      if (this.belnetIdRef) {
        this.$v.belnetId.$touch();
        if (this.$v.belnetId.$error) {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: "Invalid Belnet Id"
          });
          return;
        }
      }
      if (this.ethAddressRef) {
        this.$v.ethAddress.$touch();
        if (this.$v.ethAddress.$error) {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: "Invalid Etherum address"
          });
          return;
        }
      }

      // The validators validate on lowercase, need to submit as lowercase too
      const submitRecord = {
        ...this.record,
        name: this.record.name.includes(".bdx")
          ? this.record.name.toLowerCase()
          : this.record.name.toLowerCase() + ".bdx",
        value: this.record.value.toLowerCase(),
        value_bchat: this.bchatId,
        value_belnet: this.belnetId,
        value_wallet: this.address,
        value_eth_addr: this.ethAddress
      };
      // Send up the submission with the record
      this.$emit("onSubmit", submitRecord);
    },
    clear() {
      this.$emit("onClear");
    }
  },
  validations: {
    record: {
      name: {
        required,
        maxLength: function(value) {
          let hypens = value.includes("-");
          if (hypens) {
            return value.length < 64;
          } else {
            return value.length < 33;
          }
        },
        hyphen: function(value) {
          let str = value || "";

          return !(str.startsWith("-") || str.endsWith("-"));
        },
        validate: function(value) {
          const _value = value.toLowerCase();
          return bns_name(_value);
        }
      },
      owner: {
        validate: function(value) {
          return this.isAddress(value);
        }
      },
      backup_owner: {
        validate: function(value) {
          return this.isAddress(value);
        }
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
.beldex-app .bns-input-form,
.beldex-app .bns-renew-input-form {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);

  .bns-form__block {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-2);
  }

  .notes {
    margin: 0;
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
  }

  .errorborder {
    padding: var(--beldex-space-3);
    border: 1px solid var(--beldex-danger);
  }

  .bns-form__durations {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--beldex-space-2);
  }

  .bns-form__duration {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--beldex-space-3) var(--beldex-space-4);
    text-align: left;
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
    border-bottom: 2px solid transparent;
    cursor: pointer;
    position: relative;

    &--on {
      background-color: var(--beldex-accent-bg);
      border-color: var(--beldex-accent-border-soft);
      border-bottom-color: var(--beldex-accent);
    }
  }

  .bns-form__duration-check {
    position: absolute;
    top: 50%;
    right: var(--beldex-space-4);
    font-size: 16px;
    color: var(--beldex-accent);
    transform: translateY(-50%);
  }

  .bns-form__owners {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--beldex-space-5);
  }

  .bns-form__duration-label {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 500;
    color: var(--beldex-text);
  }

  .bns-form__duration-amount {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
    text-transform: uppercase;
  }

  .bns-form__values {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
  }

  .bns-form__value {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
  }

  .bns-form__purchase-icon {
    width: 14px;
    height: 14px;
  }

  // Square box; checked state is a green inner square (no tick).
  .bns-form__value .q-checkbox {
    .q-checkbox__bg {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 1px solid var(--beldex-text);
      border-radius: 1px;
      background: transparent;
    }
    .q-checkbox__svg {
      display: none;
    }
    .q-checkbox__inner--truthy .q-checkbox__bg {
      border-color: var(--beldex-accent);
      background: transparent;
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
  }

  .bns-form__value-label {
    flex: 0 0 110px;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);
  }

  .bns-form__value--on .bns-form__value-label {
    color: var(--beldex-text);
  }

  .bns-form__value-field {
    flex: 1 1 auto;
    margin: 0;
  }

  .bns-form__info {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    padding: var(--beldex-space-3) var(--beldex-space-4);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-secondary);
    background-color: var(--beldex-accent-bg);

    img {
      flex: 0 0 auto;
    }

    p {
      margin: 0;
    }
  }
}
</style>
