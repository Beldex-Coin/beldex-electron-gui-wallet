<template>
  <q-page class="update-bns-page" style="min-height: unset">
    <div class="flex items-center back-btn-wrapper">
      <q-btn
        icon="arrow_circle_left"
        color="white"
        style="font-size: 24px; width: 50px; height: 50px"
        flat
        @click="onBackBtn()"
      />
      <div class="back-btn-label">{{ $t("buttons.bnsUpdate") }}</div>
    </div>
    <div class="bns-input">
      <BNSUpdateInputForm
        ref="form"
        :current-record="currentRecord"
        @onSubmit="onSubmit"
      />
      <q-dialog v-model="confirmModal.open">
        <q-card class="bnsConfirmmodal">
          <q-card-section>
            <div class="text-h6 text-center" style="font-weight: 600">
              Confirm Update
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none ownerDetails q-mx-lg q-pa-md">
            <section>
              <div class="tablewrapper flex row">
                <div class="label">Name</div>
                <div class="content">{{ this.confirmModal.record.name }}</div>
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
            </section>
          </q-card-section>
          <q-card-section
            v-if="
              this.confirmModal.record.value_wallet ||
                this.confirmModal.record.value_bchat ||
                this.confirmModal.record.value_belnet ||
                this.confirmModal.record.value_eth_addr
            "
            class="q-pt-none ownerDetails q-mx-lg q-my-md q-pa-md"
          >
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
                <div class="label">ETH</div>
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
            <q-btn
              v-close-popup
              color="primary"
              label="ok"
              @click="update(confirmModal.record)"
            />
          </div>
        </q-card>
      </q-dialog>
      <q-inner-loading :showing="bns_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import BNSUpdateInputForm from "./bns_update_input_form";
import WalletPassword from "src/mixins/wallet_password";
const objectAssignDeep = require("object-assign-deep");

export default {
  name: "BNSUpdate",
  components: {
    BNSUpdateInputForm
  },
  mixins: [WalletPassword],
  props: {
    currentRecord: {
      // type: Object,
      required: false,
      default: false
    },
    onBack: {
      required: false
    }
  },

  data() {
    return {
      confirmModal: {
        open: false,
        record: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    bns_status: state => state.gateway.bns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance
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
            this.onBackBtn();
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            // this.onBackBtn();
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    onSubmit(record) {
      this.confirmModal = {
        ...this.confirmModal,
        open: true,
        record: record
      };
    },
    onBackBtn() {
      this.$emit("onBack", "");
    },
    async update(record) {
      const updatedRecord = {
        ...record
      };
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.bnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.bnsUpdate.message"),
        ok: {
          label: this.$t("dialog.bnsUpdate.ok"),
          color: "primary"
        },
        cancel: {
          color: "accent",
          label: this.$t("buttons.cancel")
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
    }
  }
};
</script>

<style lang="scss">
.update-bns-page {
  background-color: #242433;
  //padding: 15px;
  border-radius: 20px;

  .bns-input {
    height: calc(100vh - 475px);
    overflow-y: auto;
  }
}

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
.back-btn-wrapper {
  .q-btn__wrapper {
    min-height: unset;
  }
  .back-btn-label {
    font-weight: 600;
    color: white;
    font-size: 16px;
  }
}
</style>
