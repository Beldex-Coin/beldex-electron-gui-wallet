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
          <div class="header-pair uppercase">
            <span class="from">{{
              floatingRate.from || createdTxnDetails.currencyFrom
            }}</span>
            <svg
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.26028 0C7.0382 0 6.83961 0.126033 6.75419 0.318084C6.67091 0.512136 6.72003 0.732194 6.88018 0.878233L8.13366 2.05255H0.16008V3.07682H8.13366L6.88018 4.25113C6.73711 4.37916 6.67945 4.57122 6.7307 4.74926C6.77982 4.92931 6.9293 5.06935 7.12148 5.11536C7.31153 5.16337 7.51653 5.10936 7.6532 4.97532L9.83985 2.92678C10.0534 2.72672 10.0534 2.40264 9.83985 2.20259L7.6532 0.154041C7.5507 0.054014 7.40976 0 7.26028 0ZM2.72263 5.11536C2.57956 5.11936 2.44503 5.17538 2.3468 5.2714L0.160155 7.31995C-0.053385 7.52 -0.053385 7.84408 0.160155 8.04414L2.3468 10.0927C2.48347 10.2267 2.68847 10.2807 2.87852 10.2327C3.0707 10.1867 3.22018 10.0467 3.2693 9.86662C3.32055 9.68858 3.26289 9.49652 3.11982 9.36849L1.86634 8.19418H9.83992V7.16991H1.86634L3.11982 5.99559C3.28211 5.84755 3.32909 5.62349 3.24154 5.42944C3.15398 5.23339 2.94899 5.10936 2.72263 5.11536Z"
                fill="#20D030"
              />
            </svg>
            <span class="to">
              {{ floatingRate.to || createdTxnDetails.currencyTo }}</span
            >
          </div>
          <div class="amount-wrapper row q-mt-lg">
            <div class="label amountLabel q-mr-sm">
              {{ this.$t("fieldLabels.amount") }}
            </div>
            <div class="amount ft-semibold uppercase ">
              {{
                createdTxnDetails.amountExpectedFrom +
                  " " +
                  createdTxnDetails.currencyFrom
              }}
              <!-- <q-btn icon="edit" color="accent" class="edit-btn" /> -->
            </div>
          </div>
          <div
            v-if="this.isPrivacySwap"
            class="amount-wrapper row q-mt-lg q-mb-sm q-mb-md"
          >
            <div class="label q-mr-sm">
              {{ this.$t("titles.swap.swapType") }}
            </div>
            <div class="row">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="30" rx="8" fill="#303047" />
                <path
                  d="M15.013 6.99965C14.8783 6.99705 14.7451 7.0309 14.6279 7.09796C14.6279 7.09796 12.1488 8.49965 9 8.49965C8.58594 8.49965 8.25 8.83559 8.25 9.24965V14.8629C8.25 17.3623 9.97005 19.1533 11.5677 20.2812C13.1657 21.4095 14.7539 21.9586 14.7539 21.9586C14.9134 22.014 15.0866 22.014 15.2461 21.9586C15.2461 21.9586 16.8343 21.4095 18.4323 20.2812C20.0299 19.1533 21.75 17.3623 21.75 14.8629V9.24965C21.75 8.83559 21.4141 8.49965 21 8.49965C17.8512 8.49965 15.3721 7.09796 15.3721 7.09796C15.2627 7.03546 15.139 7.0016 15.013 6.99965ZM15 8.5628C15.4466 8.80239 17.3975 9.74282 20.25 9.92478V14.8629C20.25 16.6647 18.9701 18.0667 17.5677 19.0569C16.2884 19.9603 15.2155 20.3314 15 20.4101C14.7845 20.3314 13.7116 19.9603 12.4323 19.0569C11.0299 18.0667 9.75 16.6647 9.75 14.8629V9.92478C12.6025 9.74282 14.5534 8.80239 15 8.5628Z"
                  fill="white"
                />
              </svg>
              <span class="privacy-tag q-ml-xs">{{
                this.$t("strings.privacy")
              }}</span>
              <!-- <q-btn icon="edit" color="accent" class="edit-btn" /> -->
            </div>
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
              <q-spinner
                v-if="!this.clock"
                size="20px"
                color="primary"
                class="q-ml-md"
              />
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
              >{{ this.$t("titles.swap.network") }} :
              {{
                receiveChainDetails.blockchain
                  ? receiveChainDetails.blockchain.replaceAll("_", " ")
                  : receiveChainDetails.protocol ||
                    receiveChainDetails.name ||
                    ""
              }}</span
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
              {{ floatingRate.from || createdTxnDetails.currencyFrom || "" }}
              ~ {{ Number(floatingRate.rate || 0).toFixed(8) }}
              {{ floatingRate.to || createdTxnDetails.currencyTo || "" }}
            </td>
          </tr>
          <tr v-else>
            <td>{{ this.$t("titles.swap.fixedRate") }}</td>
            <td>
              <span class="uppercase"
                >1
                {{ fixedRate.from || createdTxnDetails.currencyFrom }}
                = {{ Number(fixedRate.result || 0).toFixed(8) }}
                {{ fixedRate.to || createdTxnDetails.currencyTo }}</span
              ><br />
              <span class="fixed-rate-hint">{{
                this.$t("titles.swap.fixedRateUpdateSec")
              }}</span>
            </td>
          </tr>
          <tr v-if="createdTxnDetails.type == 'float'">
            <td>{{ this.$t("titles.swap.serviceFee") }}</td>
            <td class="uppercase">
              {{ Number(floatingRate.fee || 0).toFixed(8) }}
              {{ floatingRate.to || createdTxnDetails.currencyTo || "" }}
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
              {{ Number(floatingRate.networkFee || 0).toFixed(8) }}
              {{ floatingRate.to || createdTxnDetails.currencyTo || "" }}
            </td>
          </tr>
          <tr v-if="getConfirmationCount() !== null">
            <td>{{ $t("titles.swap.confirmations") }}</td>
            <td class="uppercase">{{ getConfirmationCount() }} Blocks</td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.youGet") }}</td>
            <td v-if="createdTxnDetails.type == 'float'" class="uppercase">
              ~
              {{
                Number(
                  floatingRate.amountTo ||
                    createdTxnDetails.amountExpectedTo ||
                    0
                ).toFixed(8)
              }}
              {{ floatingRate.to || createdTxnDetails.currencyTo || "" }}
            </td>
            <td v-else class="uppercase">
              {{
                Number(
                  fixedRate.amountTo || createdTxnDetails.amountExpectedTo || 0
                ).toFixed(8)
              }}
              {{ fixedRate.to || createdTxnDetails.currencyTo || "" }}
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
import { clipboard } from "src/shims/electron-renderer";
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
    },
    isPrivacySwap: {
      type: Boolean,
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
    getConfirmationCount() {
      if (!this.createdTxnDetails) return null;
      const count =
        this.createdTxnDetails.minConfirmationsToTrade ??
        this.createdTxnDetails.payinConfirmations ??
        (this.createdTxnDetails.raw_response &&
        typeof this.createdTxnDetails.raw_response === "object"
          ? this.createdTxnDetails.raw_response.minConfirmationsToTrade ??
            this.createdTxnDetails.raw_response.payinConfirmations
          : null);
      return count != null && count !== "" && !isNaN(Number(count))
        ? Number(count)
        : null;
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
