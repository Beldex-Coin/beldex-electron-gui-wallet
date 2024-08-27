<template>
  <div class="bns-input">
    <BNSInputForm
      ref="form"
      :submit-label="submit_label"
      :disable-name="updating || renewing"
      :updating="updating"
      :renewing="renewing"
      :show-clear-button="updating || renewing"
      :disable-submit-button="disable_submit_button"
      @onSubmit="onSubmit"
      @onClear="onClear"
    />
    <q-dialog v-model="confirmModal.open">
      <q-card class="bnsConfirmmodal">
        <q-card-section>
          <div class="text-h6 text-center" style="font-weight: 600;">
            Confirm Purchase
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none ownerDetails q-mx-lg q-pa-md">
          <section>
            <div class="tablewrapper flex row">
              <div class="label">Name</div>
              <div class="content">{{ this.confirmModal.record.name }}</div>
            </div>

            <div class="tablewrapper flex row q-mt-md">
              <div class="label">year</div>
              <div class="yearscontent">
                {{ yearvalidate(this.confirmModal.record.years) }}
              </div>
            </div>

            <div
              v-if="this.confirmModal.record.owner"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">Owner</div>
              <div class="address">
                {{ this.confirmModal.record.owner }}
              </div>
            </div>
            <!-- <div
              v-if="this.confirmModal.backup_owner"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">Backup Owner</div>
              <div class="address">
                {{ this.confirmModal.record.backup_owner }}
              </div>
            </div> -->
          </section>
        </q-card-section>
        <q-card-section class="q-pt-none ownerDetails q-mx-lg q-my-md q-pa-md">
          <section>
            <div
              v-if="this.confirmModal.record.value_wallet"
              class="tablewrapper flex row"
            >
              <div class="label">Address</div>
              <div class="address">
                {{ this.confirmModal.record.value_wallet }}
              </div>
            </div>
            <div
              v-if="this.confirmModal.record.value_bchat"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">BChat ID</div>
              <div class="address">
                {{ this.confirmModal.record.value_bchat }}
              </div>
            </div>
            <div
              v-if="this.confirmModal.record.value_belnet"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">Belnet ID</div>
              <div class="address">
                {{ this.confirmModal.record.value_belnet }}
              </div>
            </div>
            <div
              v-if="this.confirmModal.record.value_eth_addr"
              class="tablewrapper flex row q-mt-md"
            >
              <div class="label">Ethereum Address</div>
              <div class="address">
                {{ this.confirmModal.record.value_eth_addr }}
              </div>
            </div>
          </section>
        </q-card-section>
        <div class="buttons flex justify-center q-mt-sm q-mb-md">
          <q-btn
            v-close-popup
            class="q-mr-md"
            color="accent"
            :label="$t('buttons.cancel')"
          />
          <q-btn v-close-popup color="primary" label="ok" @click="purchase()" />
        </div>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="bns_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BNSInputForm from "./bns_input_form";
import WalletPassword from "src/mixins/wallet_password";
const objectAssignDeep = require("object-assign-deep");

export default {
  name: "BNSInput",
  components: {
    BNSInputForm
  },
  mixins: [WalletPassword],
  data() {
    return {
      updating: false,
      renewing: false,
      confirmModal: {
        open: false,
        record: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    bns_status: state => state.gateway.bns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    disable_submit_button() {
      const minBalance = this.updating ? 0.05 : 21;
      return this.unlocked_balance < minBalance * 1e9;
    },
    submit_label() {
      let label = "buttons.purchase";
      if (this.updating) {
        label = "buttons.update";
      } else if (this.renewing) {
        label = "buttons.renew";
      }
      return this.$t(label);
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
            this.$refs.form.reset();
            this.renewing = false;
            this.updating = false;
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
    startUpdating(record) {
      this.$refs.form.setRecord(record);
      this.updating = true;
    },
    startRenewing(record) {
      this.renewing = true;
      // set the type such that we default to one year
      let renewRecord = {
        ...record,
        type: "belnet_1y"
      };
      this.$refs.form.setRecord(renewRecord);
    },
    yearvalidate(year) {
      let content = year && year.slice(0, year.indexOf("y"));
      return content && content > 1 ? content + " years" : content + " year";
    },
    onSubmit(record) {
      if (this.updating) {
        this.update(record);
      } else if (this.renewing) {
        this.renew(record);
      } else {
        this.confirmModal = {
          ...this.confirmModal,
          open: true,
          record: record
        };
      }
    },
    onClear() {
      this.$refs.form.reset();
      this.updating = false;
      this.renewing = false;
    },
    async update(record) {
      const updatedRecord = {
        ...record,
        value: record.value,
        owner: record.owner
        // backup_owner: record.backup_owner
      };

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.bnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.bnsUpdate.message"),
        ok: {
          label: this.$t("dialog.bnsUpdate.ok"),
          color: "primary"
        },
        color: "#010101"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_bns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const bns = objectAssignDeep.noMutate(updatedRecord, {
            password
          });
          this.$gateway.send("wallet", "update_bns_mapping", bns);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async purchase() {
      let record = this.confirmModal.record;
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.purchase.title"),
        noPasswordMessage: this.$t("dialog.purchase.message"),
        ok: {
          label: this.$t("dialog.purchase.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.cancel")
        }
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_bns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const bns = objectAssignDeep.noMutate(record, {
            password
          });
          this.$gateway.send("wallet", "purchase_bns", bns);
          this.confirmModal = { ...this.confirmModal, open: false, record: "" };
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async renew(record) {
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.renew.title"),
        noPasswordMessage: this.$t("dialog.renew.message"),
        ok: {
          label: this.$t("dialog.renew.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_bns_status", {
            code: 1,
            message: "Sending renew mapping transaction",
            sending: true
          });
          const params = {
            type: record.type,
            name: record.name,
            password
          };
          this.$gateway.send("wallet", "bns_renew_mapping", params);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.bnsConfirmmodal {
  width: unset !important;
  max-width: 80vw !important;
  background-color: #242433;
  border-radius: 15px !important;
  color: #fff;
  .buttons {
    .q-btn {
      height: 45px;
    }
  }
  .ownerDetails {
    background-color: #32324a;
    border-radius: 10px !important;

    .tablewrapper {
      padding-bottom: 5px;
      border-bottom: 1px solid #41415b;

      .label {
        width: 120px;
        font-weight: 600;
        font-size: 14px;
      }
      .content {
        font-weight: 700;
        color: #20d030;
        font-size: 16px;
      }
      .yearscontent {
        font-weight: 500;
        color: #fff;
        font-size: 16px;
      }
      .address {
        color: #afafbe;
        font-weight: 400;
      }
    }
  }
}
</style>
