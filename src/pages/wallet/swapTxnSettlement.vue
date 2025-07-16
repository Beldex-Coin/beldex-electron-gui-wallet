<template>
  <div class="txnSettlement">
    <!-- <header class="flex row items-center q-mb-md">
      <div class="flex items-center back-arrow-btn" @click="this.backTopayment">
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
            fill="white"
          />
        </svg>
      </div>

      <div class="ft-semibold q-ml-md header-txt">Back</div>
    </header> -->
    <header class="flex row items-center q-mb-md">
      <div
        class="flex items-center back-arrow-btn"
        @click="() => this.$emit('goback')"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
            fill="white"
          />
        </svg>
      </div>

      <div class="ft-semibold q-ml-md header-txt">
        {{ this.$t("buttons.back") }}
      </div>
    </header>
    <section class="q-mt-lg">
      <article class="fund-details-wrapper flex row">
        <div class="col-6">
          <div class="ft-semibold title">
            {{ this.$t("titles.swap.sendFundDisc") }}
          </div>
          <div class="label q-mt-lg">{{ this.$t("fieldLabels.amount") }}</div>
          <div class="amount ft-semibold uppercase">
            {{
              createdTxnDetails.amountExpectedFrom +
                " " +
                createdTxnDetails.currencyFrom
            }}
            <!-- <q-btn icon="edit" color="accent" class="edit-btn" /> -->
          </div>
        </div>
        <div class="col-6 timer-wrapper">
          <div class="pad-wrap">
            <div v-if="!this.timeIsExpire" class="label ">
              {{ this.$t("titles.swap.timeLeft") }}
              <span class="uppercase">
                {{
                  createdTxnDetails.amountExpectedFrom +
                    " " +
                    createdTxnDetails.currencyFrom
                }}
              </span>
            </div>

            <div class="flex items-center">
              <q-icon name="timer" class="time-icon" />
              <!-- <span id="timer" ref="timer" class="ft-semibold q-ml-xs"> </span> -->
              <span class="ft-semibold q-ml-xs">{{ this.clock }}</span>
            </div>
            <div v-if="this.timeIsExpire" class="label">
              {{ this.$t("titles.swap.guaranteedRateDisc") }}
            </div>
            <q-btn
              v-if="this.timeIsExpire"
              label="Start Over"
              color="primary"
              class="start-btn q-mt-sm"
              icon="refresh"
              @click="() => this.backToMainpage()"
            />
          </div>
          <div class="hr-seperator"></div>
          <div class="pad-wrap">
            <div class="label">{{ this.$t("titles.swap.transactionID") }}</div>
            <div>
              <span class="ft-semibold q-mr-xs">{{
                createdTxnDetails.id
              }}</span>
              <q-btn
                class="copy-btn"
                flat
                icon="content_copy"
                size="sm"
                color="primary"
                @click="
                  copyAddress({
                    val: createdTxnDetails.id,
                    from: 'Transaction ID'
                  })
                "
              />
            </div>
          </div>
        </div>
      </article>

      <article class="recipt-address-wrapper">
        <div class="label">{{ this.$t("fieldLabels.recipientAddress") }}</div>
        <div class="flex row justify-between q-mt-sm">
          <div>
            <span class="ft-medium" style="word-break: break-all">{{
              createdTxnDetails.payinAddress
            }}</span
            ><br />
            <span class="ft-semibold uppercase" style="color: #00ad07"
              >{{ this.$t("titles.swap.blockchain") }}:
              {{ receiveChainDetails.blockchain }}</span
            >
          </div>
          <div class="q-mt-sm">
            <q-btn
              :label="$t('buttons.copyAddress')"
              color="primary"
              class="copy-adress-btn q-mr-xs"
              @click="
                copyAddress({
                  val: createdTxnDetails.payinAddress,
                  from: 'Recipient address'
                })
              "
            />
            <q-btn
              icon="qr_code_scanner"
              color="accent"
              class="qr-btn"
              @click="showQR(createdTxnDetails.payinAddress)"
            />
          </div>
        </div>
      </article>
      <!-- <article
        v-if="createdTxnDetails.type == 'fixed'"
        class="recipt-address-wrapper"
      >
        <div class="label">{{ this.$t("titles.swap.refundAddress") }}</div>
        <div class="flex row justify-between q-mt-sm">
          <div>
            <span class="ft-medium" style="word-break: break-all">{{
              createdTxnDetails.refundAddress
            }}</span
            ><br />
            <span class="ft-semibold uppercase" style="color: #00ad07"
              >{{ this.$t("titles.swap.blockchain") }}:
              {{ sendChainDetails.blockchain }}</span
            >
          </div>
          <div>
            <q-btn
              label="Copy Address"
              color="primary"
              class="copy-adress-btn q-mr-xs"
              @click="
                copyAddress({
                  val: createdTxnDetails.refundAddress,
                  from: 'Recipient address'
                })
              "
            />
            <q-btn
              icon="qr_code_scanner"
              color="accent"
              class="qr-btn"
              @click="showQR(createdTxnDetails.refundAddress)"
            />
          </div>
        </div>
      </article> -->
      <article class="warning-wrapper q-mt-md">
        <q-icon name="o_info" size="14px" />
        <span class="q-ml-sm warn-txt"
          >{{ this.$t("titles.swap.sendFundsAboveAddress") }}.
        </span>
      </article>

      <article style="width: 48%">
        <div class="ft-semibold" style="margin-top: 14px; margin-bottom: 9px">
          {{ this.$t("titles.swap.transactionDetails") }}
        </div>
        <table style="width: 100%" class="txn-fee-details">
          <tr>
            <td>{{ this.$t("titles.swap.youSend") }}</td>
            <td>
              {{
                createdTxnDetails.amountExpectedFrom > 0
                  ? createdTxnDetails.amountExpectedFrom
                  : 0
              }}
              <span class="uppercase">{{
                createdTxnDetails.currencyFrom
              }}</span>
            </td>
          </tr>
          <tr v-if="createdTxnDetails.type == 'float'">
            <td>{{ this.$t("titles.swap.exchangeRate") }}</td>
            <td class="uppercase">
              1
              {{ floatingRate.from ? floatingRate.from : "" }}
              ~ {{ Number(floatingRate.rate).toFixed(8) }}
              {{ floatingRate.to ? floatingRate.to : "" }}
              <!-- {{ createdTxnDetails.currencyFrom  }}
              ~ {{ Number(floatingRate.rate).toFixed(8) }}
              {{ createdTxnDetails.currencyTo}} -->
            </td>
          </tr>
          <tr v-else>
            <td>{{ this.$t("titles.swap.fixedRate") }}</td>
            <td>
              <span class="uppercase"
                >1
                {{ fixedRate.from }}
                = {{ Number(fixedRate.result).toFixed(8) }}
                {{ fixedRate.to }}</span
              ><br />
              <span class="fixed-rate-hint">{{
                this.$t("titles.swap.fixedRateUpdateSec")
              }}</span>
            </td>
          </tr>
          <tr v-if="createdTxnDetails.type == 'float'">
            <td>{{ this.$t("titles.swap.serviceFee") }}</td>
            <td class="uppercase">
              {{ Number(floatingRate.fee).toFixed(8) }}
              {{ floatingRate.to ? floatingRate.to : "" }}
            </td>
          </tr>

          <tr v-else>
            <td>{{ this.$t("titles.swap.fees") }}</td>
            <td style="font-size: 12px">
              {{ this.$t("titles.swap.allTheFees") }}
            </td>
          </tr>
          <tr v-if="createdTxnDetails.type == 'float'">
            <td>{{ this.$t("titles.swap.networkFee") }}</td>
            <td class="uppercase">
              {{ Number(floatingRate.networkFee).toFixed(8) }}
              {{ floatingRate.to ? floatingRate.to : "" }}
            </td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.youGet") }}</td>
            <td v-if="createdTxnDetails.type == 'float'" class="uppercase">
              ~ {{ Number(floatingRate.amountTo).toFixed(8) }}
              {{ floatingRate.to ? floatingRate.to : "" }}
            </td>
            <td v-else class="uppercase">
              {{ Number(fixedRate.amountTo).toFixed(8) }}
              {{ fixedRate.to }}
            </td>
          </tr>
        </table>
      </article>
    </section>

    <template>
      <q-dialog v-model="QR.visible" :content-class="'qr-code-modal'">
        <q-card class="qr-code-card">
          <div
            class="text-center q-pa-md q-ma-lg"
            style="background-color: white; border-radius: 10px"
          >
            <QrcodeVue ref="qr" :value="QR.address" size="240"></QrcodeVue>
          </div>

          <q-card-actions class="q-mb-md" style="margin-right: 0">
            <q-btn
              color="primary"
              :label="$t('buttons.close')"
              @click="QR.visible = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
const { clipboard } = require("electron");
import QrcodeVue from "qrcode.vue";

export default {
  name: "SwapTxnSettlement",
  components: {
    QrcodeVue
  },
  props: {
    goback: {
      type: Function,
      require: true
    },
    createdTxnDetails: {
      type: Object,
      require: true
    },
    floatingRate: {
      type: Object,
      required: true
    },
    fixedRate: {
      type: Object,
      required: true
    },
    receiveChainDetails: {
      type: Object,
      require: true
    },
    sendChainDetails: {
      type: Object,
      require: true
    },
    clearAllintervals: {
      type: Function,
      require: true
    }
  },

  data() {
    return {
      QR: {
        visible: false
      },
      timer: "",
      clock: "",
      timeIsExpire: false
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.startAndStopTimer();
  },

  methods: {
    backToMainpage() {
      this.$emit("goback");
      this.$emit("clearAllintervals");

      clearInterval(this.timer);
      //  this.startAndStopTimer()
      // console.log("exchangeData ::", exchangeData);
    },
    startAndStopTimer() {
      clearInterval(this.timer);
      var today;
      let addTime;

      if (this.createdTxnDetails.type == "float") {
        today = new Date();
        addTime = today.setHours(today.getHours() + 3);
      } else {
        today = new Date(this.createdTxnDetails.payTill);
        addTime = today.setHours(today.getHours());
      }
      var countDownDate = new Date(addTime).getTime();
      // Update the count down every 1 second
      this.timer = setInterval(() => {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Output the result in an element with id="timer"
        // document.getElementById("timer").innerHTML =
        //   hours + "h " + minutes + "m " + seconds + "s ";
        this.clock = hours + "h " + minutes + "m " + seconds + "s ";

        // If the count down is over, write some text
        if (distance < 0) {
          // document.getElementById("timer").innerHTML = "00:00:00";
          this.clock = "00:00:00";
          this.timeIsExpire = true;
          this.clearintervals();
        }
      }, 1000);
    },
    clearintervals() {
      clearInterval(this.timer);
    },
    showQR(address) {
      // event.stopPropagation();
      this.QR.visible = true;
      this.QR.address = address;

      // this.QR.address='bcbf9e4b0703d65223af71f3318711d1bc5462588c901c09bda751447b69a0a1'
      // clearInterval(this.timer);
    },

    copyAddress(content) {
      clipboard.writeText(content.val);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: `${content.from} copied`
      });
    }
  }
};
</script>
