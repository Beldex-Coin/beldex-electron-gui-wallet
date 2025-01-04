<template>
  <q-page class="create-wallet beldex-wallet">
    <section class="flex justify-center align-center">
      <div class="fields">
        <q-tabs v-model="tab" dense class="tab" align="justify" no-caps>
          <q-tab
            name="restoreFromSeed"
            :label="$t('menuItems.restoreWalletSeed')"
          />
          <q-tab name="restoreFromKeys" label="Restore from Keys" />
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          style="background-color: transparent"
        >
          <q-tab-panel name="restoreFromSeed">
            <div class="q-mx-md">
              <OxenField
                class="q-mt-md"
                :label="$t('fieldLabels.walletName')"
                :error="$v.wallet.name.$error"
              >
                <q-input
                  v-model="wallet.name"
                  :placeholder="$t('placeholders.walletName')"
                  borderless
                  dense
                  maxlength="26"
                  @keyup.enter="restore_wallet"
                  @blur="$v.wallet.name.$touch"
                />
              </OxenField>

              <OxenField
                class="q-mt-md"
                :label="$t('fieldLabels.mnemonicSeed')"
                :error="$v.wallet.seed.$error"
              >
                <q-input
                  v-model="wallet.seed"
                  class="full-width text-area-oxen"
                  :placeholder="$t('placeholders.mnemonicSeed')"
                  type="textarea"
                  borderless
                  dense
                  @blur="$v.wallet.seed.$touch"
                />
              </OxenField>

              <div class="row items-end justify-between q-mt-md">
                <div class="col-md-6">
                  <OxenField
                    v-if="wallet.refresh_type == 'date'"
                    :label="$t('fieldLabels.restoreFromDate')"
                  >
                    <q-input
                      v-model="wallet.refresh_start_date"
                      mask="date"
                      borderless
                      dense
                    >
                      <template v-slot:append>
                        <q-icon
                          v-if="wallet.refresh_type == 'date'"
                          name="event"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="wallet.refresh_start_date"
                              :options="dateRangeOptions"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </OxenField>
                  <OxenField
                    v-else-if="wallet.refresh_type == 'height'"
                    :label="$t('fieldLabels.restoreFromBlockHeight')"
                    :error="$v.wallet.refresh_start_height.$error"
                  >
                    <q-input
                      v-model="wallet.refresh_start_height"
                      min="0"
                      :dark="theme == 'dark'"
                      borderless
                      dense
                      mask="################"
                      unmasked-value
                      @blur="$v.wallet.refresh_start_height.$touch"
                    />
                  </OxenField>
                </div>
                <!-- <div class=""> -->
                <template v-if="wallet.refresh_type == 'date'">
                  <q-btn
                    style="width: 45%"
                    color="secondary "
                    class="restore-from-button"
                    @click="
                      (wallet.refresh_type = 'height'),
                        (wallet.refresh_start_height = 0)
                    "
                  >
                    <div class="row justify-center items-center">
                      {{ this.$t("buttons.fromBlockheight") }}
                      <span class="divider"></span>

                      <q-icon name="arrow_forward" />
                    </div>
                  </q-btn>
                </template>
                <template v-else-if="wallet.refresh_type == 'height'">
                  <q-btn
                    style="width: 45%"
                    color="secondary"
                    class="restore-from-button"
                    @click="wallet.refresh_type = 'date'"
                  >
                    <div class="row justify-center items-center">
                      <q-icon name="today" class="q-mr-xs" />
                      {{ $t("strings.switchToDateSelect") }}
                    </div>
                  </q-btn>
                </template>
                <!-- </div> -->
              </div>

              <OxenField class="q-mt-md" :label="$t('fieldLabels.password')">
                <q-input
                  v-model="wallet.password"
                  :placeholder="$t('placeholders.walletPassword')"
                  type="password"
                  :dark="theme == 'dark'"
                  borderless
                  dense
                  @keyup.enter="restore_wallet"
                />
              </OxenField>

              <OxenField
                class="q-mt-md"
                :label="$t('fieldLabels.confirmPassword')"
              >
                <q-input
                  v-model="wallet.password_confirm"
                  :placeholder="$t('placeholders.reEnterWalletPassword')"
                  type="password"
                  :dark="theme == 'dark'"
                  borderless
                  dense
                  @keyup.enter="restore_wallet"
                />
              </OxenField>
              <div class="flex justify-center align-center submit">
                <q-btn
                  class="submit-button"
                  color="cancel"
                  :label="$t('buttons.cancel')"
                  @click="cancel()"
                />
                <span class="divider"></span>
                <q-btn
                  class="submit-button"
                  color="primary"
                  :label="$t('buttons.restoreWallet')"
                  @click="restore_wallet"
                />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="restoreFromKeys">
            <OxenField
              class="q-mt-md"
              :label="$t('fieldLabels.walletName')"
              :error="$v.walletKeys.name.$error"
            >
              <q-input
                v-model="walletKeys.name"
                :placeholder="$t('placeholders.walletName')"
                borderless
                dense
                maxlength="26"
                @keyup.enter="restore_wallet_with_keys"
                @blur="$v.walletKeys.name.$touch"
              />
            </OxenField>

            <OxenField
              class="q-mt-md"
              label="Wallet address"
              :error="$v.walletKeys.address.$error"
            >
              <q-input
                v-model="walletKeys.address"
                placeholder="Wallet address"
                borderless
                dense
                @keyup.enter="restore_wallet_with_keys"
                @blur="$v.walletKeys.address.$touch"
              />
            </OxenField>

            <OxenField
              class="q-mt-md"
              label="Private viewkey"
              :error="$v.walletKeys.viewkey.$error"
            >
              <q-input
                v-model="walletKeys.viewkey"
                placeholder="Private viewkey"
                borderless
                dense
                @keyup.enter="restore_wallet_with_keys"
                @blur="$v.walletKeys.viewkey.$touch"
              />
            </OxenField>

            <OxenField class="q-mt-md" label="Private spendkey" optional>
              <q-input
                v-model="walletKeys.spendkey"
                placeholder="Private spendkey"
                borderless
                dense
                @keyup.enter="restore_wallet_with_keys"
              />
            </OxenField>

            <div class="q-mt-sm q-mb-xs" style="color: #afafbe">
              Note : If the spend key is not provided, the wallet will be
              restored in view-only mode.
            </div>

            <div class="row items-end justify-between q-mt-md">
              <div class="col-md-6">
                <OxenField
                  v-if="walletKeys.refresh_type == 'date'"
                  :label="$t('fieldLabels.restoreFromDate')"
                >
                  <q-input
                    v-model="walletKeys.refresh_start_date"
                    mask="date"
                    borderless
                    dense
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="walletKeys.refresh_type == 'date'"
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="walletKeys.refresh_start_date"
                            :options="dateRangeOptions"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </OxenField>
                <OxenField
                  v-else-if="walletKeys.refresh_type == 'height'"
                  :label="$t('fieldLabels.restoreFromBlockHeight')"
                  :error="$v.walletKeys.refresh_start_height.$error"
                >
                  <q-input
                    v-model="walletKeys.refresh_start_height"
                    min="0"
                    :dark="theme == 'dark'"
                    borderless
                    dense
                    mask="################"
                    unmasked-value
                    @blur="$v.walletKeys.refresh_start_height.$touch"
                  />
                </OxenField>
              </div>
              <!-- <div class=""> -->
              <template v-if="walletKeys.refresh_type == 'date'">
                <q-btn
                  style="width: 45%"
                  color="secondary "
                  class="restore-from-button"
                  @click="
                    (walletKeys.refresh_type = 'height'),
                      (walletKeys.refresh_start_height = 0)
                  "
                >
                  <div class="row justify-center items-center">
                    {{ this.$t("buttons.fromBlockheight") }}
                    <span class="divider"></span>

                    <q-icon name="arrow_forward" />
                  </div>
                </q-btn>
              </template>
              <template v-else-if="walletKeys.refresh_type == 'height'">
                <q-btn
                  style="width: 45%"
                  color="secondary"
                  class="restore-from-button"
                  @click="walletKeys.refresh_type = 'date'"
                >
                  <div class="row justify-center items-center">
                    <q-icon name="today" class="q-mr-xs" />
                    {{ $t("strings.switchToDateSelect") }}
                  </div>
                </q-btn>
              </template>
              <!-- </div> -->
            </div>

            <OxenField class="q-mt-md" :label="$t('fieldLabels.password')">
              <q-input
                v-model="walletKeys.password"
                :placeholder="$t('placeholders.walletPassword')"
                type="password"
                :dark="theme == 'dark'"
                borderless
                dense
                @keyup.enter="restore_wallet_with_keys"
              />
            </OxenField>

            <OxenField
              class="q-mt-md"
              :label="$t('fieldLabels.confirmPassword')"
            >
              <q-input
                v-model="walletKeys.password_confirm"
                :placeholder="$t('placeholders.reEnterWalletPassword')"
                type="password"
                :dark="theme == 'dark'"
                borderless
                dense
                @keyup.enter="restore_wallet_with_keys"
              />
            </OxenField>

            <div class="q-mx-md">
              <div class="flex justify-center align-center submit">
                <q-btn
                  class="submit-button"
                  color="cancel"
                  :label="$t('buttons.cancel')"
                  @click="cancel()"
                />
                <span class="divider"></span>
                <q-btn
                  class="submit-button"
                  color="primary"
                  :label="$t('buttons.restoreWallet')"
                  @click="restore_wallet_with_keys"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </section>
  </q-page>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
import { date } from "quasar";
import _ from "lodash";
import { ref } from "vue";
import { privkey } from "src/validators/common";

const timeStampFirstBlock = 1525305600000;
const qDateFormat = "YYYY/MM/DD";
let dateFirstBlock = date.formatDate(timeStampFirstBlock, qDateFormat);

export default {
  components: {
    OxenField
  },
  data() {
    return {
      tab: ref("restoreFromSeed"),
      wallet: {
        name: "",
        seed: "",
        refresh_type: "date",
        refresh_start_height: 0,
        refresh_start_date: dateFirstBlock, // timestamp of block 1
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
        refresh_start_date: dateFirstBlock, // timestamp of block 1
        password: "",
        password_confirm: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status
  }),
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
          console.log("walletKeys address:", value);
          // eslint-disable-next-line
          const addressLength = 95;
          console.log(
            "addressLength == value.length:",
            addressLength,
            value.length
          );
          return addressLength <= value.length ? true : false;
        }
      },
      viewkey: { required, privkey },
      refresh_start_height: { numeric }
    }
  },
  methods: {
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
      console.log("wallet_data:", wallet_data);
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
      console.log("wallet_data:", wallet_data);
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
      return dateSelected >= dateFirstBlock && dateSelected < formattedNow;
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.restore-from-button {
  // width: 100%;
  height: 55px;
  // transform: translate(10px, -20px);
  // border-radius: 10px;
  // background: #2879fb;
  // color: #fff;
}
.submit {
  .q-btn {
    width: 251px;
  }
}

.q-tab--active {
  // width: 100%;
  background-color: #32324a;
  // height: 60px;
}

.q-tab__indicator {
  color: #00ad07;
}

.tab {
  width: 100%;
  height: 60px;
}
</style>
