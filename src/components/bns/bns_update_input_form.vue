<template>
  <div class="bns-update-input-form q-pa-sm">
    <div
      class="owner-updation q-pa-lg q-my-md"
      :class="[contentUpdate === 'Owner' ? 'radio-btn' : '']"
    >
      <div class="q-gutter-sm q-mb-md">
        <q-radio
          v-model="contentUpdate"
          class="owner-label"
          dense
          val="Owner"
          :label="$t('fieldLabels.updateOwner')"
        />
      </div>
      <div :class="[contentUpdate === 'Values' ? 'opacity' : '']">
        <!-- Owner -->
        <div class="col q-mt-sm">
          <OxenField
            class="q-mt-md"
            :label="$t('fieldLabels.OwnerWalletaddress')"
            :error="$v.ownerAddress.$error"
            optional
          >
            <q-input
              v-model.trim="ownerAddress"
              :dark="theme == 'dark'"
              :placeholder="record.owner"
              borderless
              dense
              :disable="contentUpdate === 'Values'"
              @blur="$v.ownerAddress.$touch"
            />
          </OxenField>
        </div>
        <!-- Backup owner -->
        <!-- <div class="col q-mt-sm">
          <OxenField
            class="q-mt-md"
            :label="$t('fieldLabels.backupOwnerWalletAddress')"
            optional
          >
            <q-input
              v-model.trim="record.backup_owner"
              :dark="theme == 'dark'"
              placeholder="owner"
              :disable="contentUpdate === 'Values'"
              borderless
              dense
              @blur="$v.record.backup_owner.$touch"
            />
          </OxenField>
        </div> -->
      </div>
    </div>

    <div
      class="idSelectorWrapper owner-updation q-pa-lg q-my-md"
      :class="[
        idsValidation ? 'errorborder' : '',
        contentUpdate === 'Values' ? 'radio-btn' : ''
      ]"
    >
      <div class="q-gutter-sm q-mb-md">
        <q-radio
          v-model="contentUpdate"
          class="owner-label"
          dense
          val="Values"
          :label="$t('fieldLabels.updateValues')"
        />
      </div>
      <section :class="[contentUpdate === 'Owner' ? 'opacity' : '']">
        <div
          class="flex row items-center no-wrap q-pa-sm q-mb-sm selectionBox"
          :class="[addressRef ? 'selected' : '']"
        >
          <q-checkbox
            v-model="addressRef"
            size="sm"
            color="green"
            :disable="contentUpdate === 'Owner'"
          />
          <div style="width: 100px; color: white">Address</div>
          <OxenField class="full-width" optional :error="$v.address.$error">
            <q-input
              v-model="address"
              :disable="!addressRef || contentUpdate === 'Owner'"
              :dark="theme == 'dark'"
              :placeholder="this.record.value_wallet || 'wallet address'"
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
          <q-checkbox
            v-model="bchatIdRef"
            size="sm"
            color="green"
            :disable="contentUpdate === 'Owner'"
          />
          <div style="width: 100px; color: white">BChat ID</div>
          <OxenField class="full-width" optional :error="$v.bchatId.$error">
            <q-input
              v-model="bchatId"
              :disable="!bchatIdRef || contentUpdate === 'Owner'"
              :dark="theme == 'dark'"
              :placeholder="this.record.value_bchat || 'Bchat ID'"
              borderless
              dense
              @blur="$v.bchatId.$touch"
            />
          </OxenField>
        </div>
        <div
          class="flex row items-center no-wrap q-pa-sm selectionBox"
          :class="[belnetIdRef ? 'selected' : '']"
        >
          <q-checkbox
            v-model="belnetIdRef"
            size="sm"
            color="green"
            :disable="contentUpdate === 'Owner'"
          />
          <div style="width: 100px; color: white">Belnet ID</div>
          <OxenField class="full-width" optional :error="$v.belnetId.$error">
            <q-input
              v-model="belnetId"
              :disable="!belnetIdRef || contentUpdate === 'Owner'"
              :dark="theme == 'dark'"
              :placeholder="this.record.value_belnet || 'Belnet ID'"
              borderless
              dense
              @blur="$v.belnetId.$touch"
            />
          </OxenField>
        </div>
      </section>
    </div>

    <div class="buttons flex justify-center q-mt-sm">
      <q-btn
        color="primary"
        class="q-mt-lg updation-btn"
        :disable="
          !(
            is_ready &&
            record.name &&
            (contentUpdate === 'Owner' ? ownerAddress : true) &&
            (contentUpdate === 'Values' ? address || bchatId || belnetId : true)
          )
        "
        @click="submit()"
      >
        <img
          src="../../assets/images/update.svg"
          alt="Update"
          style="height: 24px; width: auto"
        />
        Update
      </q-btn>
      <!-- <q-btn
        color="primary"
        :disable="
          !(is_ready && record.name && (address || bchatId || belnetId))
        "
        :label="submitLabel"
        @click="submit()"
      /> -->
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
  bns_name
} from "src/validators/common";
import OxenField from "components/oxen_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "BNSUpdateInputForm",
  components: {
    OxenField
  },
  setup() {
    return {
      bchatIdRef: ref(false),
      belnetIdRef: ref(false),
      addressRef: ref(false)
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
    // console.log('currentRecord ::',this.currentRecord)
    const initialRecord = this.currentRecord;

    return {
      record: { ...initialRecord },
      ownerAddress: "",
      bchatId: "",
      belnetId: "",
      address: "",
      idsValidation: false,
      contentUpdate: "Values"
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
      (this.bchatId = ""), (this.belnetId = ""), (this.address = "");
      (this.bchatIdRef = false),
        (this.belnetIdRef = false),
        (this.addressRef = false);
      this.$v.$reset();
    },
    submit() {
      this.$v.record.$touch();
      // console.log('this.record .....::',this.record)

      // if (this.$v.record.backup_owner.$error) {
      //   this.$q.notify({
      //     type: "negative",
      //     timeout: 3000,
      //     message: this.$t("notification.errors.invalidBackupOwner")
      //   });
      //   return;
      // }

      if (this.contentUpdate === "Owner" && this.$v.ownerAddress.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidOwner")
        });
        return;
      }
      if (
        this.contentUpdate === "Owner" &&
        this.ownerAddress === this.record.owner
      ) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: "same owner address"
        });
        return;
      }
      if (this.contentUpdate === "Value" && this.addressRef) {
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
      if (this.contentUpdate === "Value" && this.bchatIdRef) {
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
      if (this.contentUpdate === "Value" && this.belnetIdRef) {
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

      // The validators validate on lowercase, need to submit as lowercase too
      // const submitRecord = {
      //   ...this.record,
      //   value_bchat: this.bchatId,
      //   value_belnet: this.belnetId,
      //   value_wallet: this.address
      // };
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
          value_wallet: this.address
        };
      }
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
    }
  }
};
</script>

<style lang="scss">
.bns-update-input-form {
  .owner-updation {
    border: 1.5px solid #484856;

    border-radius: 20px;
    .owner-label {
      font-size: 16px;
      font-weight: 600;
    }
    .opacity {
      opacity: 0.3;
    }
  }

  .radio-btn {
    background-color: #32324a;
  }
  .buttons {
    margin-top: 20px;

    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
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
