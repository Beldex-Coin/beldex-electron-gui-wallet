<template>
  <q-page class="beldex-form-page restore-wallet">
    <!-- Step 1: seed / keys tabs. Step 2: restore point + password. -->
    <section class="beldex-panel beldex-form-page__card restore-wallet__card">
      <div class="restore-wallet__header">
        <div class="beldex-heading">
          <button
            type="button"
            class="beldex-icon-btn"
            :aria-label="$t('buttons.back')"
            @click="back()"
          >
            ←
          </button>
          <h1 class="beldex-heading__title">
            {{
              step === 2
                ? $t("buttons.restoreWallet")
                : $t("titles.wallet.useExistingWallet")
            }}
          </h1>
          <span v-if="step === 1 && isViewOnly" class="restore-wallet__badge">
            {{ $t("strings.viewOnlyBadge") }}
          </span>
        </div>
        <p class="beldex-heading__subtitle">
          {{
            step === 2
              ? $t("strings.restorePointSubtitle")
              : tab === "restoreFromKeys"
              ? $t("strings.restoreKeysSubtitle")
              : $t("strings.restoreWalletSubtitle")
          }}
        </p>
      </div>

      <div
        v-if="step === 1"
        class="restore-wallet__point restore-wallet__tabs"
        role="radiogroup"
      >
        <button
          v-for="option in tabOptions"
          :key="option.name"
          type="button"
          role="radio"
          class="restore-wallet__point-option"
          :class="{
            'restore-wallet__point-option--active': tab === option.name
          }"
          :aria-checked="tab === option.name ? 'true' : 'false'"
          @click="tab = option.name"
        >
          <span
            class="beldex-check"
            :class="{ 'beldex-check--on': tab === option.name }"
          />
          {{ option.label }}
        </button>
      </div>

      <q-tab-panels
        v-if="step === 1"
        v-model="tab"
        animated
        class="restore-wallet__panels"
      >
        <q-tab-panel name="restoreFromSeed">
          <div class="beldex-form-page__fields">
            <BeldexField
              class="restore-wallet__name"
              :label="$t('fieldLabels.walletName')"
              :error="$v.wallet.name.$error"
            >
              <q-input
                v-model="wallet.name"
                :placeholder="$t('placeholders.walletName')"
                dark
                borderless
                dense
                maxlength="26"
                @keyup.enter="next"
                @blur="$v.wallet.name.$touch"
              />
            </BeldexField>

            <BeldexField
              class="restore-wallet__seed"
              :label="$t('fieldLabels.mnemonicSeed')"
              :error="$v.wallet.seed.$error"
            >
              <q-input
                v-model="wallet.seed"
                class="full-width text-area-oxen"
                :placeholder="$t('placeholders.restoreSeed')"
                type="textarea"
                dark
                borderless
                dense
                @blur="$v.wallet.seed.$touch"
              />
            </BeldexField>
            <div class="restore-wallet__seed-helper">
              <span>{{ $t("strings.seedWordsHint") }}</span>
              <span>{{
                $t("strings.seedWordCount", { count: seedWordCount })
              }}</span>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="restoreFromKeys">
          <div class="beldex-form-page__fields">
            <BeldexField
              class="restore-wallet__name"
              :label="$t('fieldLabels.walletName')"
              :error="$v.walletKeys.name.$error"
            >
              <q-input
                v-model="walletKeys.name"
                :placeholder="$t('placeholders.walletName')"
                dark
                borderless
                dense
                maxlength="26"
                @keyup.enter="next"
                @blur="$v.walletKeys.name.$touch"
              />
            </BeldexField>

            <BeldexField
              class="restore-wallet__name"
              :label="$t('fieldLabels.walletAddress')"
              :error="$v.walletKeys.address.$error"
            >
              <q-input
                v-model="walletKeys.address"
                class="col"
                placeholder="bx…"
                dark
                borderless
                dense
                @keyup.enter="next"
                @blur="$v.walletKeys.address.$touch"
              />
              <button
                type="button"
                class="restore-wallet__paste"
                @click="paste('address')"
              >
                {{ $t("buttons.paste") }}
              </button>
            </BeldexField>

            <BeldexField
              class="restore-wallet__name"
              :label="$t('fieldLabels.privateViewkey')"
              :error="$v.walletKeys.viewkey.$error"
            >
              <q-input
                v-model="walletKeys.viewkey"
                class="col"
                :placeholder="$t('placeholders.hexKey')"
                dark
                borderless
                dense
                @keyup.enter="next"
                @blur="$v.walletKeys.viewkey.$touch"
              />
              <button
                type="button"
                class="restore-wallet__paste"
                @click="paste('viewkey')"
              >
                {{ $t("buttons.paste") }}
              </button>
            </BeldexField>

            <BeldexField
              class="restore-wallet__name"
              :label="$t('fieldLabels.privateSpendkey')"
              optional
            >
              <q-input
                v-model="walletKeys.spendkey"
                class="col"
                :placeholder="$t('placeholders.hexKey')"
                dark
                borderless
                dense
                @keyup.enter="next"
              />
              <button
                type="button"
                class="restore-wallet__paste"
                @click="paste('spendkey')"
              >
                {{ $t("buttons.paste") }}
              </button>
            </BeldexField>

            <div
              class="restore-wallet__note"
              :class="{ 'restore-wallet__note--warning': isViewOnly }"
            >
              <span class="restore-wallet__note-icon">
                <img
                  :src="
                    isViewOnly
                      ? require('assets/icons/warning-note.svg')
                      : require('assets/icons/info3.svg')
                  "
                  alt=""
                />
              </span>
              <p>
                {{
                  isViewOnly
                    ? $t("strings.noSpendKeyViewOnly")
                    : $t("strings.spendKeyHint")
                }}
              </p>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div v-if="step === 2" class="beldex-form-page__fields">
        <!-- Restore from date or blockheight. -->
        <div
          class="restore-wallet__point restore-wallet__tabs"
          role="radiogroup"
        >
          <button
            type="button"
            role="radio"
            class="restore-wallet__point-option"
            :class="{
              'restore-wallet__point-option--active':
                form.refresh_type == 'date'
            }"
            :aria-checked="form.refresh_type == 'date' ? 'true' : 'false'"
            @click="form.refresh_type = 'date'"
          >
            <span
              class="beldex-check"
              :class="{ 'beldex-check--on': form.refresh_type == 'date' }"
            />
            {{ $t("fieldLabels.restoreFromDate") }}
          </button>
          <button
            type="button"
            role="radio"
            class="restore-wallet__point-option"
            :class="{
              'restore-wallet__point-option--active':
                form.refresh_type == 'height'
            }"
            :aria-checked="form.refresh_type == 'height' ? 'true' : 'false'"
            @click="
              form.refresh_type != 'height' &&
                ((form.refresh_type = 'height'),
                (form.refresh_start_height = 0))
            "
          >
            <span
              class="beldex-check"
              :class="{
                'beldex-check--on': form.refresh_type == 'height'
              }"
            />
            {{ $t("fieldLabels.restoreFromBlockHeight") }}
          </button>
        </div>

        <BeldexField
          v-if="form.refresh_type == 'date'"
          class="restore-wallet__name restore-wallet__box"
          :label="$t('fieldLabels.restoreFromDate')"
        >
          <q-input
            v-model="form.refresh_start_date"
            mask="date"
            dark
            :aria-label="$t('fieldLabels.restoreFromDate')"
            borderless
            dense
          />
          <q-btn
            class="restore-wallet__icon-btn"
            flat
            dense
            :aria-label="$t('fieldLabels.restoreFromDate')"
          >
            <img src="~assets/icons/calendar.svg" alt="" />
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.refresh_start_date"
                class="beldex-date"
                :options="dateRangeOptions"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </BeldexField>
        <template v-else>
          <BeldexField
            class="restore-wallet__name restore-wallet__box"
            :label="$t('fieldLabels.restoreFromBlockHeight')"
            :error="$v[formKey].refresh_start_height.$error"
          >
            <q-input
              v-model="form.refresh_start_height"
              min="0"
              dark
              :aria-label="$t('fieldLabels.restoreFromBlockHeight')"
              borderless
              dense
              mask="################"
              unmasked-value
              @blur="$v[formKey].refresh_start_height.$touch"
            />
          </BeldexField>
          <div class="restore-wallet__helper restore-wallet__helper--height">
            <span>{{ approxHeightDate ? `≈ ${approxHeightDate}` : "" }}</span>
            <span v-if="currentHeight">
              {{
                $t("strings.currentHeight", {
                  height: currentHeight.toLocaleString("en-US")
                })
              }}
            </span>
          </div>
        </template>

        <div
          v-if="form.refresh_type == 'date'"
          class="restore-wallet__note restore-wallet__note--warning"
        >
          <span class="restore-wallet__note-icon">
            <img src="~assets/icons/warning-note.svg" alt="" />
          </span>
          <p>
            {{ $t("strings.restoreFirstBlockHint", { date: firstBlockDate }) }}
          </p>
        </div>

        <BeldexField
          class="restore-wallet__name restore-wallet__pw"
          :label="$t('fieldLabels.password')"
        >
          <q-input
            v-model="form.password"
            :placeholder="$t('placeholders.walletPassword')"
            :aria-label="$t('fieldLabels.password')"
            :type="showPassword ? 'text' : 'password'"
            dark
            borderless
            dense
            @keyup.enter="restore"
          />
          <button
            type="button"
            class="restore-wallet__reveal"
            :aria-label="
              showPassword
                ? $t('dialog.password.hidePassword')
                : $t('dialog.password.showPassword')
            "
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          >
            <img
              :src="
                showPassword
                  ? require('assets/icons/password-eye.svg')
                  : require('assets/icons/eye-off.svg')
              "
              alt=""
            />
          </button>
        </BeldexField>

        <div>
          <BeldexField
            class="restore-wallet__name restore-wallet__pw"
            :label="$t('fieldLabels.confirmPassword')"
          >
            <q-input
              v-model="form.password_confirm"
              :placeholder="$t('placeholders.reEnterWalletPassword')"
              :aria-label="$t('fieldLabels.confirmPassword')"
              :type="showPassword ? 'text' : 'password'"
              dark
              borderless
              dense
              @keyup.enter="restore"
            />
            <button
              type="button"
              class="restore-wallet__reveal"
              :aria-label="
                showPassword
                  ? $t('dialog.password.hidePassword')
                  : $t('dialog.password.showPassword')
              "
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <img
                :src="
                  showPassword
                    ? require('assets/icons/password-eye.svg')
                    : require('assets/icons/eye-off.svg')
                "
                alt=""
              />
            </button>
          </BeldexField>
          <div
            v-if="passwordsMatch"
            class="restore-wallet__helper restore-wallet__helper--match"
          >
            <span />
            <span>✓ {{ $t("strings.passwordsMatch") }}</span>
          </div>
        </div>
      </div>

      <div class="restore-wallet__actions">
        <q-btn
          v-if="step === 1"
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          @click="next"
        >
          {{ $t("buttons.next") }}
          <img src="~assets/icons/arrow-right.svg" alt="" />
        </q-btn>
        <q-btn
          v-else
          class="beldex-btn beldex-form-page__submit"
          unelevated
          no-caps
          @click="restore"
        >
          {{ $t("buttons.restoreWallet") }}
          <img src="~assets/icons/arrow-right.svg" alt="" />
        </q-btn>
      </div>
    </section>
  </q-page>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import BeldexField from "components/beldex_field";
import { date } from "quasar";
import _ from "lodash";
import { ref } from "vue";
import { privkey } from "src/validators/common";
import { clipboard } from "src/shims/electron-renderer";

const timeStampFirstBlock = 1525305600000;
const qDateFormat = "YYYY/MM/DD";
let dateFirstBlock = date.formatDate(timeStampFirstBlock, qDateFormat);

export default {
  components: {
    BeldexField
  },
  data() {
    return {
      tab: ref("restoreFromSeed"),
      // UI-only: seed tab step, 1 = name + seed, 2 = restore point + password
      step: 1,
      showPassword: false,
      wallet: {
        name: "",
        seed: "",
        refresh_type: "date",
        refresh_start_height: 0,
        refresh_start_date: dateFirstBlock, // default to the first block - the date field is an opt-in to scan less
        password: "",
        password_confirm: ""
      },
      walletKeys: {
        name: "",
        address: "",
        viewkey: "",
        spendkey: "",
        refresh_type: "date",
        refresh_start_height: 0,
        refresh_start_date: dateFirstBlock, // default to the first block - the date field is an opt-in to scan less
        password: "",
        password_confirm: ""
      }
    };
  },
  computed: {
    ...mapState({
      theme: state => state.gateway.app.config.appearance.theme,
      status: state => state.gateway.wallet.status,
      daemon: state => state.gateway.daemon
    }),
    firstBlockDate() {
      return dateFirstBlock;
    },
    tabOptions() {
      return [
        {
          name: "restoreFromSeed",
          label: this.$t("strings.restoreFromSeedTab")
        },
        {
          name: "restoreFromKeys",
          label: this.$t("strings.restoreFromKeysTab")
        }
      ];
    },
    // Name, address and viewkey are in but no spend key: the wallet will be
    // restored view-only.
    isViewOnly() {
      const k = this.walletKeys;
      return (
        this.tab === "restoreFromKeys" &&
        !!k.name.trim() &&
        !!k.address.trim() &&
        !!k.viewkey.trim() &&
        !k.spendkey.trim()
      );
    },
    // Restore point + password (step 2) are shared by both tabs.
    formKey() {
      return this.tab === "restoreFromKeys" ? "walletKeys" : "wallet";
    },
    form() {
      return this[this.formKey];
    },
    currentHeight() {
      const { height, target_height } = this.daemon.info;
      return Math.max(height || 0, target_height || 0);
    },
    // Linear estimate between the first block and now; the design only shows
    // an approximate date.
    approxHeightDate() {
      const h = parseInt(this.form.refresh_start_height, 10);
      if (!h || !this.currentHeight || h > this.currentHeight) return "";
      const now = Date.now();
      const ts =
        timeStampFirstBlock +
        (h / this.currentHeight) * (now - timeStampFirstBlock);
      return date.formatDate(ts, qDateFormat);
    },
    passwordsMatch() {
      return (
        !!this.form.password &&
        this.form.password === this.form.password_confirm
      );
    },
    seedWordCount() {
      return this.wallet.seed.split(/\s+/).filter(Boolean).length;
    }
  },
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created",
              query: {
                title: this.$t("titles.wallet.walletRestored")
              }
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  validations: {
    wallet: {
      name: { required },
      seed: { required },
      refresh_start_height: { numeric }
    },
    walletKeys: {
      name: { required },
      address: {
        required,
        isAddress(value) {
          if (value === "") return true;
          // eslint-disable-next-line
          return 97 >= value.length && 95 <= value.length;
        }
      },
      viewkey: { required, privkey },
      refresh_start_height: { numeric }
    }
  },
  methods: {
    paste(field) {
      const text = (clipboard.readText() || "").trim();
      if (!text) return;
      this.walletKeys[field] = text;
      if (this.$v.walletKeys[field]) this.$v.walletKeys[field].$touch();
    },
    restore() {
      if (this.tab === "restoreFromKeys") this.restore_wallet_with_keys();
      else this.restore_wallet();
    },
    next() {
      if (this.tab === "restoreFromKeys") {
        this.nextKeys();
        return;
      }
      this.$v.wallet.name.$touch();
      this.$v.wallet.seed.$touch();
      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.$v.wallet.seed.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterSeedWords")
        });
        return;
      }
      this.step = 2;
    },
    nextKeys() {
      const v = this.$v.walletKeys;
      v.name.$touch();
      v.address.$touch();
      v.viewkey.$touch();
      const errors = [
        [v.name, "enterWalletName"],
        [v.address, "invalidPublicAddress"],
        [v.viewkey, "invalidPrivateViewKey"]
      ];
      const failed = errors.find(([field]) => field.$error);
      if (failed) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t(`notification.errors.${failed[1]}`)
        });
        return;
      }
      this.step = 2;
    },
    back() {
      if (this.step === 2) {
        this.step = 1;
        return;
      }
      this.cancel();
    },
    restore_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.$v.wallet.seed.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterSeedWords")
        });
        return;
      }
      /* eslint-disable no-constant-condition */
      let seed = this.wallet.seed
        .trim()
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\s{2,}/g, " ")
        .split(" ");
      /* eslint-enable no-constant-condition */
      if (
        seed.length !== 14 &&
        seed.length !== 24 &&
        seed.length !== 25 &&
        seed.length !== 26
      ) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidSeedLength")
        });
        return;
      }

      if (this.$v.wallet.refresh_start_height.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidRestoreHeight")
        });
        return;
      }

      if (
        this.wallet.refresh_start_height > this.daemon.info.target_height &&
        this.daemon.info.target_height !== 0
      ) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.greaterHeight")
        });
        return;
      }
      if (this.wallet.password != this.wallet.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      this.$q.loading.show({
        delay: 0,
        spinnerColor: "positive"
      });

      // we don't want the data in the form changing
      const wallet_data = _.cloneDeep(this.wallet);

      // we want the date in javascript ms format
      const dateSeconds = date
        .extractDate(this.wallet.refresh_start_date, "YYYY/MM/DD")
        .getTime();

      wallet_data["refresh_start_date"] = dateSeconds;
      this.$gateway.send("wallet", "restore_wallet", wallet_data);
    },
    restore_wallet_with_keys() {
      this.$v.walletKeys.$touch();

      if (this.$v.walletKeys.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.$v.walletKeys.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPublicAddress")
        });
        return;
      }
      if (this.$v.walletKeys.viewkey.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPrivateViewKey")
        });
        return;
      }

      if (this.$v.walletKeys.refresh_start_height.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidRestoreHeight")
        });
        return;
      }

      if (
        this.walletKeys.refresh_start_height > this.daemon.info.target_height &&
        this.daemon.info.target_height !== 0
      ) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.greaterHeight")
        });
        return;
      }

      if (this.walletKeys.password != this.walletKeys.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      this.$q.loading.show({
        delay: 0,
        spinnerColor: "positive"
      });

      const wallet_data = _.cloneDeep(this.walletKeys);
      // we want the date in javascript ms format
      const dateSeconds = date
        .extractDate(this.walletKeys.refresh_start_date, "YYYY/MM/DD")
        .getTime();

      wallet_data["refresh_start_date"] = dateSeconds;

      this.$gateway.send("wallet", "restore_wallet_with_keys", wallet_data);
    },
    // Ensures the date is valid
    dateRangeOptions(dateSelected) {
      const now = Date.now();
      const formattedNow = date.formatDate(now, qDateFormat);
      return dateSelected >= dateFirstBlock && dateSelected <= formattedNow;
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.restore-wallet {
  &__panels {
    background: transparent;

    .q-tab-panel {
      padding: 0;
    }
  }

  // Wider and tighter than the shared form card.
  // Beats app.styl's `.beldex-app .beldex-form-page .beldex-form-page__card`
  // (max-width 560px).
  .beldex-app &.beldex-form-page &__card {
    max-width: 646px;
    padding: var(--beldex-space-7) 33px 32px;
    gap: var(--beldex-space-7);
  }

  &__header .beldex-heading__subtitle {
    margin-top: var(--beldex-space-3);
    letter-spacing: 0;
  }

  // Seed / keys tabs: the restore-point radios, full width with an underline
  // on the inactive tab too. Pulled up so the form gap reads 20px.
  &__tabs {
    gap: 0;
    margin-bottom: -8px;

    .restore-wallet__point-option {
      height: 48px;
      gap: var(--beldex-space-3);
      padding: 0 18px;
      font-size: var(--beldex-text-base);
      line-height: 16px;
      color: var(--beldex-text-subtle);
      border-bottom-color: var(--beldex-border);
    }

    .restore-wallet__point-option--active {
      color: var(--beldex-text);
      border-bottom-color: var(--beldex-accent-border-strong);
    }
  }

  // `.beldex-field` doubled to beat app.styl's
  // `.beldex-app .beldex-field .q-field__control` (fixed 36px height).
  .beldex-field.restore-wallet__name,
  .beldex-field.restore-wallet__seed {
    .content {
      padding: 0 15px;
      background: var(--beldex-bg);
    }

    .q-field__native {
      font-size: var(--beldex-text-lg);
      font-weight: 300;
      line-height: 21px;
      letter-spacing: 0;
    }

    .q-field__native::placeholder {
      color: var(--beldex-text-muted);
    }
  }

  .beldex-field.restore-wallet__name {
    // Let the input shrink so long keys don't run under "Paste".
    .q-field {
      min-width: 0;
    }

    .content {
      min-height: 52px;
    }

    .q-field__control,
    .q-field__marginal {
      height: 51px;
    }
  }

  .beldex-field.restore-wallet__seed {
    .content {
      align-items: flex-start;
      min-height: 114px;
      padding-top: var(--beldex-space-3);
    }

    .q-field__control {
      height: auto;
    }

    textarea {
      min-height: 86px;
      padding-top: 0;
      resize: none;
    }
  }

  // Paste: accent text action at the end of the input.
  &__paste {
    flex: none;
    align-self: center;
    margin: 0 var(--beldex-space-3) 0 var(--beldex-space-3);
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    line-height: 16px;
    text-transform: uppercase;
    color: var(--beldex-accent);
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  // Note.
  &__note {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    padding: var(--beldex-space-3) 14px;
    background: rgba(26, 26, 26, 0.06);
    border: 1px solid rgba(68, 68, 68, 0.25);

    p {
      flex: 1;
      margin: 0;
      font-size: var(--beldex-text-md);
      line-height: 18px;
      color: var(--beldex-text-subtle);
    }
  }

  &__note--warning {
    background: var(--beldex-warning-wash);
    border-color: var(--beldex-warning-border);

    p {
      color: var(--beldex-warning);
    }
  }

  // Badge.
  &__badge {
    padding: 2px 8px;
    font-family: var(--beldex-font-micro);
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--beldex-warning);
    background: var(--beldex-warning-wash);
    border: 1px solid var(--beldex-warning-border);
  }

  &__note-icon {
    position: relative;
    flex: none;
    width: 14px;
    height: 14px;

    img {
      position: absolute;
      inset: 12.5% 12.5% 8.33% 8.34%;
      display: block;
    }
  }

  &__seed-helper {
    display: flex;
    justify-content: space-between;
    margin-top: -8px;
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: var(--beldex-text-faint);
  }

  &__point {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--beldex-space-4);
  }

  &__point-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px var(--beldex-space-4);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 600;
    text-align: left;
    color: var(--beldex-text);
    background: transparent;
    border: 0;
    border-bottom: 1px solid transparent;
    cursor: pointer;

    &--active {
      background-color: var(--beldex-accent-tint);
      border-bottom-color: var(--beldex-accent-border-strong);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  // Step 2 value fields: full 0.75px border, 13px value.
  .beldex-field.restore-wallet__box {
    .content {
      border: 0.75px solid var(--beldex-border-strong);
      gap: var(--beldex-space-3);
    }

    .q-field__native {
      font-size: var(--beldex-text-base);
      font-weight: 400;
      line-height: 18px;
      color: var(--beldex-text);
    }
  }

  &__icon-btn.q-btn {
    flex: none;
    width: 20px;
    min-width: 0;
    min-height: 0;
    height: 20px;
    padding: 0;

    img {
      display: block;
      width: 15px;
      height: 15.83px;
    }
  }

  // Reveal toggle at the end of the password fields.
  &__reveal {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: 0;
    cursor: pointer;

    &:focus-visible {
      outline: 1px solid var(--beldex-accent-border);
    }
  }

  // "≈ date / Current height" and "✓ Passwords match".
  &__helper {
    display: flex;
    justify-content: space-between;
    margin-top: calc(-1 * var(--beldex-space-2));
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: var(--beldex-text-faint);

    &--match {
      margin-top: var(--beldex-space-3);
      color: var(--beldex-accent);
    }
  }
}
</style>
