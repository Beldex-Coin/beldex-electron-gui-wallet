<template>
  <div class="bns-record-list">
    <div v-if="bns_record.length > 0 && is_ready">
      <div class="tab-desc">
        {{ $t("strings.bnsDescription") }}
      </div>
      <div class="decrypt row justify-between">
        <OxenField
          :label="$t('fieldLabels.decryptRecord')"
          :disable="decrypting"
          :error="$v.name.$error"
        >
          <q-input
            v-model.trim="name"
            :dark="theme == 'dark'"
            :suffix="'.bdx'"
            maxlength="67"
            borderless
            dense
            :placeholder="$t('placeholders.bnsDecryptName')"
            :disable="decrypting"
            @blur="$v.name.$touch"
          />
        </OxenField>

        <div class="btn-wrapper q-ml-md items-end">
          <q-btn
            color="primary"
            :label="$t('buttons.addRecord')"
            :loading="decrypting"
            @click="decrypt()"
          />
        </div>
      </div>

      <div v-if="decrypting" class="q-mb-md" style="color: #20d030">
        Fetching BNS record from the network...
      </div>

      <div class="records-group">
        <span class="record-type-title">BNS Records </span>
        <BNSRecordList
          :record-list="bns_record"
          :is-belnet="true"
          @onUpdate="onUpdate"
          @onRenew="onRenew"
        />
      </div>
    </div>
    <!-- empty bns history -->
    <div
      v-else-if="is_ready && bns_record.length === 0 && ourAddresses.length > 0"
      class="flex no-wrap column justify-center items-center emptybns"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 29 34"
        fill="#484860"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.4108 0C8.25738 0 2.88683 3.35992 0 8.33333H4.06901C5.56912 6.48004 7.52658 5.01302 9.80469 4.16992C9.28277 5.38303 8.86502 6.80013 8.54492 8.33333H11.9727C12.7707 5.03852 13.8889 3.33333 14.4108 3.33333C14.9327 3.33333 16.0509 5.03852 16.849 8.33333H20.2767C19.9566 6.80013 19.5367 5.38303 19.0169 4.16992C21.2934 5.01302 23.2525 6.48004 24.7526 8.33333H28.8216C25.9348 3.35992 20.5642 0 14.4108 0ZM0 25C2.88683 29.9734 8.25738 33.3333 14.4108 33.3333C20.5642 33.3333 25.9348 29.9734 28.8216 25H24.7526C23.2525 26.8533 21.295 28.3203 19.0169 29.1634C19.5367 27.9503 19.9533 26.5332 20.2734 25H16.8457C16.0476 28.2948 14.9295 30 14.4076 30C13.8856 30 12.7707 28.2948 11.9727 25H8.54492C8.86502 26.5332 9.28494 27.9503 9.80469 29.1634C7.52821 28.3203 5.56912 26.8533 4.06901 25H0Z"
        />
        <path
          d="M6.08153 18.5914C6.08153 17.7922 5.4231 17.3127 4.38188 17.3127H2.2688V19.8169H4.42781C5.46904 19.8169 6.08153 19.3773 6.08153 18.5914ZM5.82122 14.7153C5.82122 13.9694 5.23936 13.5431 4.22875 13.5431H2.2688V15.8741H4.22875C5.23936 15.8741 5.82122 15.4745 5.82122 14.7153ZM8.25585 18.8179C8.25585 20.2964 6.95432 21.3353 4.73406 21.3353H0.125093V12.038H4.535C6.77057 12.038 8.01086 13.0503 8.01086 14.4356C8.01086 15.5678 7.22994 16.2737 6.18871 16.5668C7.39837 16.7532 8.25585 17.7256 8.25585 18.8179Z"
        />
        <path
          d="M16.962 12.0246H19.1057V21.3353H16.962L12.1081 14.955V21.3353H9.96436V12.0246H12.1081L16.962 18.4182V12.0246Z"
        />
        <path
          d="M28.6965 18.6447C28.6965 20.1099 27.349 21.4286 24.9144 21.4286C22.6941 21.4286 20.9792 20.4163 20.9486 18.658H23.2454C23.3066 19.4039 23.8732 19.8968 24.8685 19.8968C25.8791 19.8968 26.4763 19.4306 26.4763 18.7646C26.4763 16.7532 20.9639 17.9654 20.9792 14.5954C20.9792 12.9171 22.541 11.9048 24.746 11.9048C26.9356 11.9048 28.4362 12.8771 28.574 14.5554H26.2159C26.17 13.9427 25.6035 13.4632 24.6847 13.4499C23.8426 13.4232 23.2148 13.7829 23.2148 14.5421C23.2148 16.4069 28.6965 15.368 28.6965 18.6447Z"
        />
      </svg>
      <div class="hintmsg">
        Here you can find all the BNS Names owned by this wallet. Decrypting a
        record you own will return the name and value of that BNS record
      </div>
    </div>

    <q-inner-loading v-else :showing="true" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
import { bchat_name_or_belnet_name } from "src/validators/common";
import BNSRecordList from "./bns_record_list";

export default {
  name: "BNSRecords",
  components: {
    OxenField,
    BNSRecordList
  },
  data() {
    return {
      name: "",
      decrypting: false,
      isLoading: true
    };
  },
  mounted() {
    this.$gateway.send("wallet", "bns_known_names");
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    ourAddresses(state) {
      const { address_list } = state.gateway.wallet;
      const { used, unused, primary } = address_list;
      const all = [...used, ...unused, ...primary];
      return all.map(a => a.address).filter(a => !!a);
    },

    bns_record(state) {
      return this.records_of_type(state);
    },
    bns_status: state => state.gateway.bns_status,
    needsDecryption() {
      const records = [...this.bns_record];
      return records.find(r => this.isLocked(r));
    },
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    }
  }),
  watch: {
    bns_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });

            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });

            break;
        }
      },
      deep: true
    }
  },
  methods: {
    records_of_type(state) {
      // receives the type and returns the records of that type
      const ourAddresses = this.ourAddresses;
      const records = state.gateway.wallet.bnsRecords;
      const ourRecords = (records || []).filter(record => {
        return (
          ourAddresses.includes(record.owner) ||
          ourAddresses.includes(record.backup_owner)
        );
      });
      // Sort the records by decrypted ones first, followed by non-decrypted
      return ourRecords.sort((a, b) => {
        if (a.name && !b.name) {
          return -1;
        } else if (b.name && !a.name) {
          return 1;
        } else if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return b.update_height - a.update_height;
      });
    },
    isLocked(record) {
      return !record.name || !record.value;
    },
    onUpdate(record) {
      this.$emit("onUpdate", record);
    },
    onRenew(record) {
      this.$emit("onRenew", record);
    },
    decrypt() {
      this.$v.name.$touch();

      if (!this.name || this.name.trim().length === 0) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.enterName")
        });
        return;
      }

      if (this.$v.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidNameFormat")
        });
        return;
      }
      let validateName = this.name
        .trim()
        .toLowerCase()
        .endsWith(".bdx")
        ? this.name.trim().toLowerCase()
        : this.name.trim().toLowerCase() + ".bdx";
      // const name = this.name.trim().toLowerCase();
      const name = validateName;

      this.$gateway.once("decrypt_record_result", data => {
        if (data.decrypted) {
          this.$q.notify({
            type: "positive",
            timeout: 2000,
            message: this.$t("notification.positive.decryptedBNSRecord", {
              name
            })
          });
          this.name = "";
        } else {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: this.$t("notification.errors.decryptBNSRecord", { name })
          });
        }
        this.decrypting = false;
      });

      let type = "bchat";
      this.$gateway.send("wallet", "decrypt_record", {
        name,
        type
      });
      this.decrypting = true;
    }
  },

  validations: {
    name: {
      bchat_name_or_belnet_name
    }
  }
};
</script>

<style lang="scss">
.bns-record-list {
  .height {
    font-size: 0.9em;
  }
  .q-item {
    cursor: cursor;
  }

  .oxen-field {
    flex: 1;
  }
  .emptybns {
    //height: 100%;
    height: calc(100vh - 631px);
    margin-top: 30px;
    .hintmsg {
      width: 72%;
      margin-top: 15px;
      color: #afafbe;
      font-weight: 400;
      font-size: 12px;
      text-align: justify;
    }
  }

  .decrypt {
    height: 100px;
    // margin-bottom: 20px;

    .btn-wrapper {
      height: 50px;
      margin-top: 60px;
    }
  }
}
</style>
