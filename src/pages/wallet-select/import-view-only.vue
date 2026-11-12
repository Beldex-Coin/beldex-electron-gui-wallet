<template>
  <q-page>
    <div class="q-mx-md">
      <q-field class="q-mt-none">
        <q-input
          v-model="wallet.name"
          :float-label="$t('fieldLabels.walletName')"
          :error="$v.wallet.name.$error"
          :dark="theme == 'dark'"
          @blur="$v.wallet.name.$touch"
        />
      </q-field>

      <q-field>
        <q-input
          v-model="wallet.address"
          :float-label="$t('fieldLabels.walletAddress')"
          :error="$v.wallet.address.$error"
          :dark="theme == 'dark'"
          @blur="$v.wallet.address.$touch"
        />
      </q-field>

      <q-field>
        <q-input
          v-model="wallet.viewkey"
          :float-label="$t('fieldLabels.privateViewkey')"
          :error="$v.wallet.viewkey.$error"
          :dark="theme == 'dark'"
          @blur="$v.wallet.viewkey.$touch"
        />
      </q-field>

      <q-field>
        <div class="row items-center gutter-sm">
          <div class="col">
            <template v-if="wallet.refresh_type == 'date'">
              <q-input
                v-model="wallet.refresh_start_date"
                mask="date"
                :float-label="$t('fieldLabels.restoreFromDate')"
                :dark="theme == 'dark'"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="wallet.refresh_start_date"
                        class="beldex-date"
                        :options="dateRangeOptions"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('buttons.close')"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </template>
            <template v-else-if="wallet.refresh_type == 'height'">
              <q-input
                v-model="wallet.refresh_start_height"
                type="number"
                min="0"
                :float-label="$t('fieldLabels.restoreFromBlockHeight')"
                :error="$v.wallet.refresh_start_height.$error"
                :dark="theme == 'dark'"
                @blur="$v.wallet.refresh_start_height.$touch"
              />
            </template>
          </div>
          <div class="col-auto">
            <template v-if="wallet.refresh_type == 'date'">
              <q-btn
                class="float-right"
                :text-color="theme == 'dark' ? 'white' : 'dark'"
                flat
                @click="wallet.refresh_type = 'height'"
              >
                <div style="width: 80px;" class="text-center">
                  <q-icon class="block" name="clear_all" />
                  <div style="font-size:10px">
                    {{ $t("strings.switchToHeightSelect") }}
                  </div>
                </div>
              </q-btn>
            </template>
            <template v-else-if="wallet.refresh_type == 'height'">
              <q-btn
                class="float-right"
                :text-color="theme == 'dark' ? 'white' : 'dark'"
                flat
                @click="wallet.refresh_type = 'date'"
              >
                <div style="width: 80px;" class="text-center">
                  <q-icon class="block" name="today" />
                  <div style="font-size:10px">
                    {{ $t("strings.switchToDateSelect") }}
                  </div>
                </div>
              </q-btn>
            </template>
          </div>
        </div>
      </q-field>

      <article v-if="wallet.refresh_type == 'date'" class="restore-date-hint">
        <q-icon name="o_info" size="16px" class="hint-icon" />
        <span class="q-ml-sm hint-txt">
          {{ $t("strings.restoreFirstBlockHint", { date: firstBlockDate }) }}
        </span>
      </article>

      <q-field>
        <PasswordInput
          v-model="wallet.password"
          :float-label="$t('fieldLabels.passwordLabel')"
          :dark="theme == 'dark'"
        />
      </q-field>

      <q-field>
        <PasswordInput
          v-model="wallet.password_confirm"
          :float-label="$t('fieldLabels.confirmPasswordLabel')"
          :dark="theme == 'dark'"
        />
      </q-field>

      <q-field>
        <q-btn
          color="primary"
          :label="$t('buttons.restoreViewOnlyWallet')"
          @click="restore_view_wallet"
        />
      </q-field>
    </div>
  </q-page>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { privkey, address } from "src/validators/common";
import { mapState } from "vuex";
import PasswordInput from "components/password_input";
import { date } from "quasar";

// Same first-block timestamp/format used on the seed-restore screen
// (restore.vue) - kept in sync so both restore flows default to
// scanning full history instead of "today".
const timeStampFirstBlock = 1525305600000;
const qDateFormat = "YYYY/MM/DD";
let dateFirstBlock = date.formatDate(timeStampFirstBlock, qDateFormat);

export default {
  components: { PasswordInput },
  data() {
    return {
      wallet: {
        name: "",
        address: "",
        viewkey: "",
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
      status: state => state.gateway.wallet.status
    }),
    firstBlockDate() {
      return dateFirstBlock;
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
              path: "/wallet-select/created"
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
      address: {
        required,
        isAddress(value) {
          if (value === "") return true;

          return new Promise(resolve => {
            address(value, this.$gateway)
              .then(() => resolve(true))
              .catch(() => resolve(false));
          });
        }
      },
      viewkey: { required, privkey },
      refresh_start_height: { numeric }
    }
  },
  methods: {
    restore_view_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.$v.wallet.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPublicAddress")
        });
        return;
      }

      if (this.$v.wallet.viewkey.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPrivateViewKey")
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

      // we want the date in javascript ms format, and don't want to
      // mutate the form's own value while doing so
      const wallet_data = { ...this.wallet };
      const dateSeconds = date
        .extractDate(this.wallet.refresh_start_date, "YYYY/MM/DD")
        .getTime();
      wallet_data["refresh_start_date"] = dateSeconds;

      this.$gateway.send("wallet", "restore_view_wallet", wallet_data);
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

<style></style>
