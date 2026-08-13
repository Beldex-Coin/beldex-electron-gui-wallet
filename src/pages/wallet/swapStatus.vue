<template>
  <div class="swapStatus">
    <!-- <q-header>
          <q-toolbar top> -->
    <section class="flex row">
      <article class="col-md-7">
        <header class="flex row items-center q-mb-md justify-between">
          <div class="flex items-center back-arrow-btn">
            <!-- <svg
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
            </svg> -->
            <div class="ft-semibold header-txt">
              {{ this.$t("titles.swap.exchanging") }}
            </div>
          </div>
        </header>

        <div class="progressBar flex items-center">
          <div
            class="innerBar"
            :style="{
              width:
                statusDetails.status === 'confirming'
                  ? '25%'
                  : statusDetails.status === 'exchanging'
                  ? '50%'
                  : statusDetails.status === 'sending'
                  ? '75%'
                  : statusDetails.status === 'finished'
                  ? '100%'
                  : '10%'
            }"
          ></div>
        </div>
        <div class="flex row q-mt-md">
          <div class="col-1 q-pt-sm">
            <q-spinner
              v-if="statusDetails.status === 'confirming'"
              color="primary"
              size="2em"
            />

            <svg
              v-else
              width="22"
              height="22"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>
          </div>
          <div class="col-11">
            <div class="sub-title ft-semibold">
              {{ this.$t("titles.swap.confirmingProcess") }}
            </div>
            <div class="desc q-mb-md">
              {{ this.$t("titles.swap.Once") }}
              <span class="uppercase">{{ statusDetails.currencyFrom }}</span>
              {{ this.$t("titles.swap.confirmedInBlockchain") }}
              <span class="uppercase">{{ statusDetails.currencyTo }}</span>
            </div>
            <a
              class="explorer-link"
              @click="inputHash(statusDetails.payinHash)"
              >{{ this.$t("titles.swap.seenInputExplorer") }}</a
            >
          </div>
        </div>
        <div class="hr-seperator q-my-md"></div>
        <div class="flex row q-mt-md">
          <div class="col-1 q-pt-sm">
            <q-spinner
              v-if="statusDetails.status === 'exchanging'"
              color="primary"
              size="2em"
            />
            <svg
              v-else-if="statusDetails.status === 'sending'"
              width="22"
              height="22"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>
            <svg
              v-else
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Exchange">
                <path
                  id="Vector"
                  d="M6.17719 2.29166C5.99828 2.29428 5.82744 2.36653 5.70095 2.49308L1.11762 7.07641C1.05164 7.13976 0.998963 7.21564 0.962674 7.29961C0.926386 7.38357 0.907215 7.47393 0.906286 7.56539C0.905356 7.65686 0.922685 7.74759 0.957259 7.83227C0.991832 7.91696 1.04296 7.99389 1.10763 8.05857C1.17231 8.12325 1.24925 8.17437 1.33393 8.20894C1.41861 8.24352 1.50934 8.26085 1.60081 8.25992C1.69227 8.25899 1.78263 8.23982 1.8666 8.20353C1.95056 8.16724 2.02644 8.11456 2.08979 8.04858L5.49954 4.63883V14.4375C5.49825 14.5286 5.51508 14.6191 5.54905 14.7036C5.58302 14.7881 5.63346 14.8651 5.69743 14.93C5.76139 14.9948 5.83762 15.0464 5.92167 15.0815C6.00572 15.1167 6.09592 15.1348 6.18704 15.1348C6.27815 15.1348 6.36835 15.1167 6.4524 15.0815C6.53645 15.0464 6.61268 14.9948 6.67665 14.93C6.74061 14.8651 6.79105 14.7881 6.82502 14.7036C6.85899 14.6191 6.87582 14.5286 6.87454 14.4375V4.63883L10.2843 8.04858C10.3476 8.11456 10.4235 8.16724 10.5075 8.20353C10.5914 8.23982 10.6818 8.25899 10.7733 8.25992C10.8647 8.26085 10.9555 8.24352 11.0401 8.20894C11.1248 8.17437 11.2018 8.12325 11.2664 8.05857C11.3311 7.99389 11.3822 7.91695 11.4168 7.83227C11.4514 7.74759 11.4687 7.65686 11.4678 7.56539C11.4669 7.47393 11.4477 7.38357 11.4114 7.29961C11.3751 7.21564 11.3224 7.13976 11.2565 7.07641L6.67312 2.49308C6.60812 2.42805 6.53074 2.37673 6.44556 2.34213C6.36038 2.30753 6.26912 2.29037 6.17719 2.29166ZM15.812 2.29166C15.6297 2.29166 15.4548 2.3641 15.3259 2.49303C15.197 2.62196 15.1245 2.79683 15.1245 2.97916C15.1245 3.1615 15.197 3.33637 15.3259 3.4653C15.4548 3.59423 15.6297 3.66666 15.812 3.66666C15.9944 3.66666 16.1692 3.59423 16.2982 3.4653C16.4271 3.33637 16.4995 3.1615 16.4995 2.97916C16.4995 2.79683 16.4271 2.62196 16.2982 2.49303C16.1692 2.3641 15.9944 2.29166 15.812 2.29166ZM15.812 4.58333C15.6297 4.58333 15.4548 4.65576 15.3259 4.78469C15.197 4.91363 15.1245 5.08849 15.1245 5.27083C15.1245 5.45317 15.197 5.62804 15.3259 5.75697C15.4548 5.8859 15.6297 5.95833 15.812 5.95833C15.9944 5.95833 16.1692 5.8859 16.2982 5.75697C16.4271 5.62804 16.4995 5.45317 16.4995 5.27083C16.4995 5.08849 16.4271 4.91363 16.2982 4.78469C16.1692 4.65576 15.9944 4.58333 15.812 4.58333ZM15.8013 6.86515C15.6191 6.868 15.4455 6.94304 15.3186 7.07379C15.1917 7.20454 15.1219 7.38031 15.1245 7.5625V16.9028L11.7148 13.4931C11.6507 13.4271 11.574 13.3746 11.4893 13.3388C11.4046 13.303 11.3135 13.2845 11.2215 13.2845C11.0847 13.2845 10.951 13.3254 10.8375 13.4018C10.7241 13.4783 10.636 13.5868 10.5846 13.7136C10.5331 13.8404 10.5207 13.9797 10.5489 14.1136C10.577 14.2475 10.6445 14.3699 10.7426 14.4652L15.3259 19.0486C15.4549 19.1775 15.6297 19.2499 15.812 19.2499C15.9943 19.2499 16.1692 19.1775 16.2981 19.0486L20.8814 14.4652C20.9474 14.4019 21.0001 14.326 21.0364 14.2421C21.0727 14.1581 21.0919 14.0677 21.0928 13.9763C21.0937 13.8848 21.0764 13.7941 21.0418 13.7094C21.0072 13.6247 20.9561 13.5478 20.8914 13.4831C20.8268 13.4184 20.7498 13.3673 20.6651 13.3327C20.5805 13.2981 20.4897 13.2808 20.3983 13.2817C20.3068 13.2827 20.2164 13.3018 20.1325 13.3381C20.0485 13.3744 19.9726 13.4271 19.9093 13.4931L16.4995 16.9028V7.5625C16.5009 7.47048 16.4837 7.37913 16.4491 7.29387C16.4144 7.20861 16.363 7.13117 16.2979 7.06614C16.2328 7.00111 16.1553 6.94981 16.07 6.91529C15.9847 6.88076 15.8933 6.86371 15.8013 6.86515ZM6.18704 16.0417C6.0047 16.0417 5.82983 16.1141 5.7009 16.243C5.57197 16.372 5.49954 16.5468 5.49954 16.7292C5.49954 16.9115 5.57197 17.0864 5.7009 17.2153C5.82983 17.3442 6.0047 17.4167 6.18704 17.4167C6.36937 17.4167 6.54424 17.3442 6.67317 17.2153C6.8021 17.0864 6.87454 16.9115 6.87454 16.7292C6.87454 16.5468 6.8021 16.372 6.67317 16.243C6.54424 16.1141 6.36937 16.0417 6.18704 16.0417ZM6.18704 18.3333C6.0047 18.3333 5.82983 18.4058 5.7009 18.5347C5.57197 18.6636 5.49954 18.8385 5.49954 19.0208C5.49954 19.2032 5.57197 19.378 5.7009 19.507C5.82983 19.6359 6.0047 19.7083 6.18704 19.7083C6.36937 19.7083 6.54424 19.6359 6.67317 19.507C6.8021 19.378 6.87454 19.2032 6.87454 19.0208C6.87454 18.8385 6.8021 18.6636 6.67317 18.5347C6.54424 18.4058 6.36937 18.3333 6.18704 18.3333Z"
                  fill="#AFAFBE"
                />
              </g>
            </svg>
          </div>
          <div class="col-11">
            <div class="sub-title ft-semibold">
              {{ this.$t("titles.swap.exchanging") }}
              <span class="uppercase ">{{ statusDetails.currencyFrom }}</span>
              {{ this.$t("titles.swap.to") }}
              <span class="uppercase">{{ statusDetails.currencyTo }}</span>
              <!-- <div class="sub-title ft-semibold">Exchanging BDX to BNB</div> -->
            </div>
            <div class="desc">
              {{ this.$t("titles.swap.pleaseWait") }}
            </div>
          </div>
        </div>
        <div class="hr-seperator q-my-md"></div>
        <div class="flex row q-mt-md">
          <div class="col-1 q-pt-sm">
            <q-spinner
              v-if="statusDetails.status === 'sending'"
              color="primary"
              size="2em"
            />
            <svg
              v-else-if="statusDetails.status === 'finished'"
              width="22"
              height="22"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0007 2.33334C7.56765 2.33334 2.33398 7.56701 2.33398 14C2.33398 20.433 7.56765 25.6667 14.0007 25.6667C20.4337 25.6667 25.6673 20.433 25.6673 14C25.6673 12.6863 25.4386 11.4266 25.0361 10.2471L23.1471 12.1361C23.2696 12.7381 23.334 13.3618 23.334 14C23.334 19.1462 19.1468 23.3333 14.0007 23.3333C8.85448 23.3333 4.66732 19.1462 4.66732 14C4.66732 8.85384 8.85448 4.66668 14.0007 4.66668C15.9058 4.66668 17.6779 5.24288 19.1572 6.22755L20.8275 4.5573C18.9048 3.1643 16.5498 2.33334 14.0007 2.33334ZM24.8424 3.84181L12.834 15.8503L8.99219 12.0085L7.34245 13.6582L12.834 19.1498L26.4922 5.49155L24.8424 3.84181Z"
                fill="#159B24"
              />
            </svg>
            <svg
              v-else
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="wallet">
                <path
                  id="Vector"
                  d="M4.81253 2.75001C3.733 2.75001 2.84464 3.60133 2.76525 4.66212C2.75466 4.71154 2.74956 4.76197 2.75003 4.81251V6.18751V6.87501V17.1875C2.75003 18.3184 3.68159 19.25 4.81253 19.25H17.1875C18.3185 19.25 19.25 18.3184 19.25 17.1875V7.56251C19.25 6.43157 18.3185 5.50001 17.1875 5.50001H4.81253C4.42455 5.50001 4.12503 5.20049 4.12503 4.81251C4.12503 4.42453 4.42455 4.12501 4.81253 4.12501H16.2709C16.362 4.1263 16.4524 4.10947 16.537 4.07549C16.6215 4.04152 16.6984 3.99109 16.7633 3.92712C16.8282 3.86315 16.8797 3.78692 16.9149 3.70287C16.95 3.61882 16.9682 3.52862 16.9682 3.43751C16.9682 3.3464 16.95 3.25619 16.9149 3.17214C16.8797 3.08809 16.8282 3.01187 16.7633 2.9479C16.6984 2.88393 16.6215 2.83349 16.537 2.79952C16.4524 2.76555 16.362 2.74872 16.2709 2.75001H4.81253ZM4.12503 6.87501H4.81253H17.1875C17.5755 6.87501 17.875 7.17453 17.875 7.56251V17.1875C17.875 17.5755 17.5755 17.875 17.1875 17.875H4.81253C4.42455 17.875 4.12503 17.5755 4.12503 17.1875V6.87501ZM15.3542 11C15.0503 11 14.7589 11.1207 14.544 11.3356C14.3291 11.5505 14.2084 11.8419 14.2084 12.1458C14.2084 12.4497 14.3291 12.7412 14.544 12.9561C14.7589 13.171 15.0503 13.2917 15.3542 13.2917C15.6581 13.2917 15.9495 13.171 16.1644 12.9561C16.3793 12.7412 16.5 12.4497 16.5 12.1458C16.5 11.8419 16.3793 11.5505 16.1644 11.3356C15.9495 11.1207 15.6581 11 15.3542 11Z"
                  fill="#AFAFBE"
                />
              </g>
            </svg>
          </div>
          <div class="col-11">
            <div class="sub-title ft-semibold">
              {{ this.$t("titles.swap.sendFundsToWallet") }}
            </div>
            <div class="desc">
              {{ this.$t("titles.swap.pleaseWait") }}
            </div>
          </div>
        </div>
        <div class="q-pa-md nav-history-wrapper q-mt-lg">
          <div class="sub-title ft-semibold">
            {{ this.$t("titles.swap.waitHere") }}
          </div>
          <div class="desc q-mt-sm">
            {{ this.$t("titles.swap.newTransaction") }}<br />
            {{ this.$t("titles.swap.checkStatus") }}
            <a class="history-tag" @click="() => this.$emit('toHistory')">{{
              this.$t("titles.swap.history")
            }}</a>
            .
          </div>
        </div>
      </article>
      <article class="col-md-5 q-pa-sm">
        <header class="ft-semibold q-ml-md header-txt">
          {{ this.$t("titles.swap.transactionPreview") }}
        </header>
        <div class="txn-preview-wrapper q-py-md">
          <div class="q-px-md">
            <div class="ft-medium label q-mb-xs">
              {{ this.$t("titles.swap.transactionID") }}
            </div>
            <div class="ft-semibold content q-mb-sm">
              {{ statusDetails.id }}
            </div>
            <div class="ft-medium label q-mt-md q-mb-xs">
              {{ this.$t("titles.swap.changellyAddress") }}
              <span class="uppercase">{{ statusDetails.currencyFrom }}</span>
            </div>
            <div class="ft-semibold content q-mb-sm break-all">
              {{ statusDetails.payinAddress }}
            </div>
            <div class="ft-medium label q-mt-md q-mb-xs">
              {{ this.$t("fieldLabels.recipientAddress") }}
              <span class="uppercase">{{ statusDetails.currencyTo }}</span>
            </div>
            <div class="ft-semibold content q-mb-sm break-all">
              {{ statusDetails.payoutAddress }}
            </div>
            <div class="ft-medium label q-mt-md q-mb-xs">
              {{ statusDetails.payoutExtraIdName }}
            </div>
            <div class="ft-semibold content q-mb-sm break-all">
              {{ statusDetails.payoutExtraId }}
            </div>
            <div class="ft-medium label q-mt-md q-mb-xs">
              {{ this.$t("titles.swap.exchangeRate") }}
            </div>
            <div class="ft-semibold content q-mb-sm break-all uppercase">
              1 {{ statusDetails.currencyFrom }} =
              {{
                Number(statusDetails.rate).toFixed(8) +
                  " " +
                  statusDetails.currencyTo
              }}
            </div>
          </div>
          <div
            class="flex row items-center q-mt-md q-pt-md q-px-md total-wrapper"
          >
            <div class="ft-medium label q-mr-sm">
              {{ this.$t("titles.swap.youGet") }}
            </div>
            <div class="content uppercase">
              {{
                statusDetails.amountExpectedTo + " " + statusDetails.currencyTo
              }}
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SwapStatus",
  components: {},
  props: {
    // statusDetails: { type: String, require: true }
    toHistory: { type: Function, require: true }
  },

  computed: mapState({
    statusDetails: state => {
      let data = state.gateway.txnStatus;
      let result = {};
      if (data.hasOwnProperty("result")) {
        if (data.status) {
          result = data.result[0];
        }
      }
      return result;
    },

    Currencylist: state => state.gateway.currencyList.result
  }),
  data() {
    return {
      isVisible: true
    };
  },

  methods: {
    inputHash(hash) {
      let payInCurrency = this.Currencylist.find(
        item => item.ticker === this.statusDetails.currencyFrom
      );
      let url = payInCurrency.transactionUrl;
      url = url.slice(0, url.lastIndexOf("/") - (url.length - 1)) + hash;

      this.$gateway.send("core", "open_url", { url });

      // console.log("input hash", url);
    }
  }
};
</script>
