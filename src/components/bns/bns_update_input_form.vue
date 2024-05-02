<template>
  <div class="bns-update-input-form q-pa-sm">
    <div
      class="owner-updation q-pa-md q-my-md"
      :class="[contentUpdate === 'Owner' ? 'radio-btn' : '']"
    >
      <div class="q-gutter-sm q-mb-md flex row">
        <q-radio v-model="contentUpdate" dense val="Owner" />
        <div class="radio-btn-label">{{ $t("fieldLabels.updateOwner") }}</div>
      </div>
      <div :class="[contentUpdate === 'Values' ? 'opacity' : '']">
        <!-- Owner -->
        <div class="col q-mt-sm">
          <OxenField
            class="q-mt-md"
            :label="$t('fieldLabels.OwnerWalletaddress')"
            :error="$v.ownerAddress.$error"
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
      </div>
    </div>

    <div
      class="idSelectorWrapper owner-updation q-pa-md q-my-md"
      :class="[
        idsValidation ? 'errorborder' : '',
        contentUpdate === 'Values' ? 'radio-btn' : ''
      ]"
    >
      <div class="q-gutter-sm q-mb-md flex row">
        <q-radio v-model="contentUpdate" dense val="Values" />
        <div class="radio-btn-label">{{ $t("fieldLabels.updateValues") }}</div>
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
    <div class="updatesNotes flex row q-px-md">
      <div>
        <span style="font-weight: 600">Note :</span> You can only update owner
        address or values at a time. If you want to update both, you can either
        update the value before ownership or after transferring ownership.
      </div>
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
          style="height: 24px; width: auto;margin-right: 5px;"
        />
        Update
      </q-btn>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { mapState } from "vuex";

import { address, bchat_id, belnet_address } from "src/validators/common";
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

        if (this.bchatId === this.record.value_bchat) {
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
        if (this.belnetId === this.record.value_belnet) {
          this.toastmsg("same Belnet id");
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
          value_wallet: this.address
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
    }
  }
};
</script>

<style lang="scss">
.bns-update-input-form {
  .owner-updation {
    border: 1.5px solid #484856;
    border-radius: 20px;
    .opacity {
      opacity: 0.3;
    }
  }

  .radio-btn {
    background-color: #32324a;
  }
  .radio-btn-label {
    color: white;
    font-size: 16px;
    font-weight: 600;
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
}
.updatesNotes {
  font-weight: 400;
  color: #afafbe;
}
</style>
