<template>
  <!-- My BNS. Handlers are unchanged. -->
  <div class="bns-records">
    <div v-if="is_ready" class="bns-records__body">
      <p class="beldex-form-desc">{{ $t("strings.bnsDescription") }}</p>
      <div class="bns-records__decrypt">
        <BeldexField
          class="bns-records__field"
          :disable="decrypting"
          :error="$v.name.$error"
        >
          <q-input
            v-model.trim="name"
            dark
            maxlength="67"
            borderless
            dense
            :placeholder="$t('placeholders.bnsDecryptName')"
            :disable="decrypting"
            :aria-label="$t('fieldLabels.decryptRecord')"
            @blur="$v.name.$touch"
          />
          <span class="bns-records__suffix">.bdx</span>
        </BeldexField>
        <q-btn
          class="beldex-btn beldex-btn--ghost bns-records__decrypt-btn"
          unelevated
          no-caps
          :loading="decrypting"
          @click="decrypt()"
        >
          <img src="~assets/icons/lock-open.svg" alt="" />
          {{ $t("buttons.decrypt") }}
        </q-btn>
      </div>

      <p v-if="decrypting" class="bns-records__fetching">
        {{ $t("strings.bns.fetchNewRecord") }}
      </p>

      <template v-if="bns_record.length > 0">
        <div class="beldex-label bns-records__group">
          {{ $t("strings.bns.records") }}
        </div>
        <BNSRecordList
          :record-list="bns_record"
          :is-belnet="true"
          @onUpdate="onUpdate"
          @onRenew="onRenew"
        />
      </template>
      <!-- empty bns history -->
      <div v-else class="bns-records__empty">
        <span class="bns-records__empty-icon">
          <q-icon name="alternate_email" size="24px" />
        </span>
        <strong class="bns-records__empty-title">{{
          $t("strings.bns.noNamesYet")
        }}</strong>
        <p class="bns-records__empty-hint">
          {{ $t("strings.bns.noNamesHint") }}
        </p>
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :label="$t('strings.bns.buyAName')"
          @click="$emit('onBuy')"
        />
      </div>
    </div>
    <q-inner-loading v-else :showing="true" dark>
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BeldexField from "components/beldex_field";
import { bchat_name_or_belnet_name } from "src/validators/common";
import BNSRecordList from "./bns_record_list";

// Same rationale as HAS_PASSWORD_TIMEOUT_MS in wallet_password.js:
// gateway.send() can drop this message with no signal back to us (eg.
// mid appSuspend/appResumed), and decrypt_record_result is otherwise
// awaited with no timeout - without this, `decrypting` would stay
// true forever, leaving the field and button disabled with no way to
// retry.
const DECRYPT_RECORD_TIMEOUT_MS = 15000;

export default {
  name: "BNSRecords",
  components: {
    BeldexField,
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

      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;

        this.decrypting = false;
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.decryptBNSRecord", { name })
        });
      }, DECRYPT_RECORD_TIMEOUT_MS);

      this.$gateway.once("decrypt_record_result", data => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);

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
.beldex-app .bns-records {
  position: relative;
  min-height: 120px;

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-5);

    .beldex-form-desc {
      margin: 0;
      line-height: 16px;
      color: var(--beldex-text-muted);
    }
  }

  &__decrypt {
    display: flex;
    align-items: flex-start;
    gap: var(--beldex-space-3);
  }

  &__field {
    flex: 1 1 auto;

    // Beats app.styl `.bns-page .beldex-field .content` min-height 45px !important.
    .content {
      min-height: 40px !important;
      padding: 0;
      background: var(--beldex-bg);
    }

    &:not(.disable):not(.disable-hover) .content:hover {
      background: var(--beldex-bg);
    }

    .q-field {
      flex: 1 1 auto;
      padding-left: var(--beldex-space-3);
    }
  }

  // Trailing ".bdx" segment.
  &__suffix {
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 500;
    line-height: 16px;
    color: var(--beldex-text);
    background: var(--beldex-panel);
    border-left: 1px solid var(--beldex-border);
  }

  &__decrypt-btn {
    padding: 0 var(--beldex-space-5);
    font-weight: 700;
    text-transform: none;
  }

  &__fetching {
    margin: 0;
    font-size: var(--beldex-text-md);
    color: var(--beldex-accent);
  }

  &__group {
    // 23px row, 8px above the first record (body gap is 20).
    margin: 0 0 calc(var(--beldex-space-2) - var(--beldex-space-5));
    padding: var(--beldex-space-1) 0;
    font-size: 10px;
    line-height: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--beldex-text-faint);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--beldex-space-3);
    padding: var(--beldex-space-9) 0;
    text-align: center;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    color: var(--beldex-text-muted);
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid rgba(235, 235, 235, 0.1);
  }

  &__empty-title {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-base);
    line-height: 20px;
    color: var(--beldex-text);
  }

  &__empty-hint {
    max-width: 320px;
    margin: 0;
    font-size: var(--beldex-text-md);
    line-height: 18px;
    color: var(--beldex-text-muted);
  }
}
</style>
