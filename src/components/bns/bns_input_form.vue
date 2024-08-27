<template>
  <div class="bns-input-form">
    <div class="prices">
      <span class="pricelabel">
        <span class="bnsname q-mr-sm">BNS</span>
        {{ $t("strings.bns.prices") }}
      </span>
      <section class="flex row no-wrap q-mt-xs q-gutter-sm">
        <div
          v-for="item in typeOptions"
          :key="item.type"
          :class="[record.years == item.value ? 'selected' : '']"
          class="flex row tag items-center justify-between no-wrap"
          @click="record.years = item.value"
        >
          <div>{{ item.label }}</div>
          <div class="amount">{{ item.amount }}</div>
        </div>
      </section>
    </div>

    <!-- Name -->
    <div class="col q-mt-sm">
      <OxenField
        :label="$t('fieldLabels.name')"
        :disable="disableName"
        :error="$v.record.name.$error"
      >
        <q-input
          v-model.trim="record.name"
          :dark="theme == 'dark'"
          maxlength="67"
          :placeholder="$t('placeholders.bnsName')"
          :disable="disableName"
          borderless
          dense
          :suffix="'.bdx'"
          @blur="$v.record.name.$touch"
        />
      </OxenField>
    </div>
    <div class="notes q-mt-xs">Note: BNS Name for registration</div>

    <!-- Owner -->
    <div class="col q-mt-sm">
      <OxenField
        class="q-mt-md"
        :label="$t('fieldLabels.owner')"
        :error="$v.record.owner.$error"
        optional
      >
        <q-input
          v-model.trim="record.owner"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.bnsOwner')"
          borderless
          dense
          :disable="renewing"
          @blur="$v.record.owner.$touch"
        />
      </OxenField>
    </div>
    <div class="notes q-mt-xs">
      Note: Use current address (leave blank if same wallet) or specify the
      address if it is a different wallet
    </div>

    <!-- Backup owner -->
    <!-- <div class="col q-mt-sm">
      <OxenField
        class="q-mt-md"
        :label="$t('fieldLabels.backupOwner')"
        :error="$v.record.backup_owner.$error"
        optional
      >
        <q-input
          v-model.trim="record.backup_owner"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.bnsBackupOwner')"
          :disable="renewing"
          borderless
          dense
          @blur="$v.record.backup_owner.$touch"
        />
      </OxenField>
    </div>-->
    <div
      class="idSelectorWrapper"
      :class="[idsValidation ? 'errorborder' : '']"
    >
      <section>
        <div
          class="flex row items-center no-wrap q-pa-sm q-mb-sm selectionBox"
          :class="[addressRef ? 'selected' : '']"
        >
          <q-checkbox v-model="addressRef" size="sm" color="green" />
          <div style="width: 100px">Address</div>
          <OxenField class="full-width" optional :error="$v.address.$error">
            <q-input
              v-model="address"
              :disable="!addressRef"
              :dark="theme == 'dark'"
              placeholder="Address"
              borderless
              dense
              @blur="$v.address.$touch"
            />
          </OxenField>
        </div>
        <div
          class="flex row items-center no-wrap q-pa-sm q-mb-sm selectionBox"
          :class="[bchatIdRef ? 'selected' : '']"
        >
          <q-checkbox v-model="bchatIdRef" size="sm" color="green" />
          <div style="width: 100px">BChat ID</div>
          <OxenField class="full-width" optional :error="$v.bchatId.$error">
            <q-input
              v-model="bchatId"
              :disable="!bchatIdRef"
              :dark="theme == 'dark'"
              placeholder="BChat ID"
              borderless
              dense
              @blur="$v.bchatId.$touch"
            />
          </OxenField>
        </div>
        <div
          class="flex row items-center no-wrap q-pa-sm q-mb-sm selectionBox"
          :class="[belnetIdRef ? 'selected' : '']"
        >
          <q-checkbox v-model="belnetIdRef" size="sm" color="green" />
          <div style="width: 100px">Belnet ID</div>
          <OxenField class="full-width" optional :error="$v.belnetId.$error">
            <q-input
              v-model="belnetId"
              :disable="!belnetIdRef"
              :dark="theme == 'dark'"
              placeholder="Belnet ID"
              borderless
              dense
              @blur="$v.belnetId.$touch"
            />
          </OxenField>
        </div>

        <div
          class="flex row items-center no-wrap q-pa-sm selectionBox"
          :class="[ethAddressRef ? 'selected' : '']"
        >
          <q-checkbox v-model="ethAddressRef" size="sm" color="green" />
          <div style="width: 100px">Ethereum Address</div>
          <OxenField class="full-width" optional :error="$v.ethAddress.$error">
            <q-input
              v-model="ethAddress"
              :disable="!ethAddressRef"
              :dark="theme == 'dark'"
              placeholder="Ethereum Address"
              borderless
              dense
              @blur="$v.ethAddress.$touch"
            />
          </OxenField>
        </div>
      </section>
    </div>

    <div class="buttons flex justify-center q-mt-sm">
      <q-btn
        color="primary"
        :disable="
          !(
            is_ready &&
            record.name &&
            (address || bchatId || belnetId || ethAddress)
          )
        "
        :label="submitLabel"
        @click="submit()"
      />
      <q-btn
        v-if="showClearButton"
        color="accent"
        :label="$t('buttons.clear')"
        @click="clear()"
      />
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
import OxenField from "components/oxen_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSInputForm",
  components: {
    OxenField
  },
  setup() {
    return {
      bchatIdRef: ref(false),
      belnetIdRef: ref(false),
      addressRef: ref(true),
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
        label: "1 yr",
        value: "1y",
        amount: "650 bdx"
      },
      {
        label: "2 yrs",
        value: "2y",
        amount: "1000 bdx"
      },
      {
        label: "5 yrs",
        value: "5y",
        amount: "2000 bdx"
      },
      {
        label: "10 yrs",
        value: "10y",
        amount: "4000 bdx"
      }
    ];
    let typeOptions = [...belnetOptions];

    const initialRecord = {
      // bns 1 year is valid on renew or purchase
      years: typeOptions[0].value,
      type: "",
      name: "",
      value: "",
      owner: ""
      // backup_owner: ""
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
        owner: ""
        // backup_owner: ""
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

      // if (this.$v.record.backup_owner.$error) {
      //   this.$q.notify({
      //     type: "negative",
      //     timeout: 3000,
      //     message: this.$t("notification.errors.invalidBackupOwner")
      //   });
      //   return;
      // }

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
      }
      // backup_owner: {
      //   validate: function(value) {
      //     return this.isAddress(value);
      //   }
      // }
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
.bns-input-form {
  .buttons {
    margin-top: 20px;

    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
  }
  .notes {
    color: #20d030;
    font-size: 12px;
  }
  .errorborder {
    border: 1px solid red;
  }
}

.idSelectorWrapper {
  .selectionBox {
    background-color: #474766;
    border-radius: 10px;
    border: 2px solid #474766;
  }
  .selected {
    border: 2px solid #00ad07;
  }
}
</style>
