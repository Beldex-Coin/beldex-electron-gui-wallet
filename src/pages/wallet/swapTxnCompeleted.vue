<template>
  <div class="SwapTxnCompeleted q-pa-md">
    <div
      v-if="this.from === 'history'"
      class="flex row items-center q-mb-md"
      @click="() => this.$emit('goback')"
    >
      <svg
        style="cursor: pointer;"
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

      <div class="ft-semibold q-ml-md" style="font-size: 1.3rem;">
        {{ this.$t("buttons.back") }}
      </div>
    </div>
    <header class="flex row items-center q-mb-md q-mt-md">
      <div class="flex items-center header">
        <div class="flex items-center">
          <q-icon name="o_check_circle" size="md" color="primary" />
          <div class="ft-semibold q-ml-xs header-txt">
            {{ this.$t("titles.swap.completed") }}
          </div>
        </div>
        <div class="header-pair uppercase">
          <span class="from">{{ this.txnStatus.currencyFrom }}</span>
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
          <span class="to">{{ this.txnStatus.currencyTo }}</span>
        </div>
      </div>
    </header>
    <div class="flex row txn-id-wrapper q-px-md items-center">
      <div class="label q-mr-sm ft-medium">
        {{ this.$t("titles.swap.transactionID") }} :
      </div>
      <div class="q-mr-sm ft-semibold">{{ this.txnStatus.id }}</div>
      <q-btn
        flat
        icon="content_copy"
        color="primary"
        size="9px"
        class="copy-btn flex justify-center items-center"
        @click="copyAddress(txnStatus.id)"
      />
    </div>
    <section class="receipt-wrapper">
      <article class="flex row q-mt-md">
        <div class="col-6">
          <div class="q-mb-sm label">{{ this.$t("fieldLabels.amount") }}</div>
          <div class="ft-semibold content">
            {{ this.txnStatus.amountExpectedFrom }}
            <span class="uppercase q-ml-xs">
              {{ this.txnStatus.currencyFrom }}
            </span>
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm label">{{ this.$t("titles.swap.amountTo") }}</div>
          <div class="ft-semibold content">
            {{ this.txnStatus.amountExpectedTo }}
            <span class="uppercase q-ml-xs">
              {{ this.txnStatus.currencyTo }}
            </span>
          </div>
        </div>
      </article>
      <div class="hr-seperator q-my-md"></div>

      <article class="flex row">
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.$t("titles.swap.amountReceived") }}
          </div>
          <div class="ft-semibold content">
            {{
              this.momentdate(this.txnStatus.moneyReceived / 1000).format(
                "DD MMM YYYY-h:mm:ss"
              )
            }}
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.$t("titles.swap.amountSend") }}
          </div>
          <div class="ft-semibold content">
            {{
              this.momentdate(this.txnStatus.moneySent / 1000).format(
                "DD MMM YYYY-h:mm:ss"
              )
            }}
          </div>
        </div>
      </article>
      <div class="hr-seperator q-my-md"></div>

      <article class="flex row">
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.$t("titles.swap.exchangeRate") }}
          </div>
          <div class="ft-semibold content">
            1
            <span class="uppercase q-ml-xs">
              {{ this.txnStatus.currencyFrom }}
            </span>
            ~ {{ this.txnStatus.rate }}
            <span class="uppercase q-ml-xs">
              {{ this.txnStatus.currencyTo }}
            </span>
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.$t("titles.swap.networkFee") }}
          </div>
          <div class="ft-semibold content">
            {{ this.txnStatus.networkFee }}
            <span class="uppercase q-ml-xs">
              {{ this.txnStatus.currencyTo }}
            </span>
          </div>
        </div>
      </article>
      <div class="hr-seperator q-my-md"></div>

      <article class="flex row">
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.$t("fieldLabels.recipientAddress") }}
          </div>
          <div class="ft-medium content break-all" style="width: 85%">
            {{ this.txnStatus.payoutAddress }}
          </div>
        </div>
        <div class="col-6">
          <div class="q-mb-sm label">
            {{ this.txnStatus.payoutExtraIdName }}
          </div>
          <div class="ft-semibold content">
            {{ this.txnStatus.payoutExtraId }}
          </div>
        </div>
      </article>
      <div class="hr-seperator q-my-md"></div>

      <article>
        <div class="flex row justify-center">
          <q-btn
            outline
            class="hash-btn"
            @click="inputHash(txnStatus.payinHash)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="imput_hash">
                <path
                  id="Vector"
                  d="M11.0006 1.83334C7.0777 1.83334 3.72067 4.30339 2.41584 7.77914C2.38286 7.86392 2.36704 7.9544 2.36928 8.04535C2.37153 8.13629 2.3918 8.22588 2.42892 8.30893C2.46604 8.39199 2.51927 8.46685 2.58553 8.52918C2.65179 8.59151 2.72976 8.64007 2.81493 8.67205C2.90009 8.70403 2.99075 8.7188 3.08166 8.71549C3.17257 8.71218 3.26192 8.69086 3.34454 8.65277C3.42715 8.61468 3.50138 8.56057 3.56293 8.49359C3.62448 8.4266 3.67213 8.34807 3.70311 8.26253C4.81095 5.31153 7.6544 3.20834 11.0006 3.20834C15.3119 3.20834 18.7923 6.68879 18.7923 11C18.7923 15.3112 15.3119 18.7917 11.0006 18.7917C7.6544 18.7917 4.81095 16.6885 3.70311 13.7375C3.67213 13.6519 3.62448 13.5734 3.56293 13.5064C3.50138 13.4394 3.42715 13.3853 3.34454 13.3472C3.26192 13.3091 3.17257 13.2878 3.08166 13.2845C2.99075 13.2812 2.90009 13.296 2.81493 13.328C2.72976 13.3599 2.65179 13.4085 2.58553 13.4708C2.51927 13.5332 2.46604 13.608 2.42892 13.6911C2.3918 13.7741 2.37153 13.8637 2.36928 13.9547C2.36704 14.0456 2.38286 14.1361 2.41584 14.2209C3.72067 17.6966 7.0777 20.1667 11.0006 20.1667C16.055 20.1667 20.1673 16.0544 20.1673 11C20.1673 5.94564 16.055 1.83334 11.0006 1.83334ZM10.7643 7.55534C10.6275 7.55537 10.4938 7.59623 10.3803 7.67267C10.2668 7.74912 10.1788 7.85768 10.1273 7.98447C10.0759 8.11126 10.0635 8.25051 10.0916 8.38441C10.1198 8.5183 10.1872 8.64075 10.2854 8.73609L11.8609 10.3116L2.52236 10.3036C2.43127 10.3021 2.3408 10.3189 2.25622 10.3527C2.17164 10.3866 2.09463 10.4369 2.02968 10.5008C1.96472 10.5647 1.9131 10.6409 1.87783 10.7249C1.84256 10.8089 1.82434 10.899 1.82422 10.9901C1.8241 11.0813 1.84209 11.1715 1.87714 11.2556C1.91219 11.3397 1.96361 11.416 2.0284 11.48C2.09319 11.5441 2.17007 11.5946 2.25456 11.6287C2.33905 11.6628 2.42947 11.6797 2.52057 11.6786L11.8627 11.6866L10.2854 13.2639C10.2194 13.3273 10.1667 13.4031 10.1304 13.4871C10.0942 13.5711 10.075 13.6614 10.0741 13.7529C10.0731 13.8444 10.0905 13.9351 10.125 14.0198C10.1596 14.1045 10.2107 14.1814 10.2754 14.2461C10.3401 14.3108 10.417 14.3619 10.5017 14.3964C10.5864 14.431 10.6771 14.4483 10.7686 14.4474C10.86 14.4465 10.9504 14.4273 11.0344 14.391C11.1183 14.3547 11.1942 14.3021 11.2576 14.2361L14.0076 11.4861C14.1364 11.3572 14.2088 11.1823 14.2088 11C14.2088 10.8177 14.1364 10.6429 14.0076 10.5139L11.2576 7.76392C11.1935 7.69792 11.1168 7.64546 11.0321 7.60963C10.9473 7.57381 10.8563 7.55534 10.7643 7.55534Z"
                  fill="#AFAFBE"
                />
              </g>
            </svg>
            <span class="ft-medium q-ml-sm">{{
              this.$t("titles.swap.inputHash")
            }}</span>
          </q-btn>
          <q-btn
            outline
            class="hash-btn q-ml-md"
            @click="outputHash(txnStatus.payoutHashLink)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="output_hash">
                <path
                  id="Vector"
                  d="M20.1659 10.9901C20.1633 10.8112 20.0911 10.6403 19.9645 10.5139L17.2145 7.76385C17.1512 7.69787 17.0753 7.64519 16.9913 7.6089C16.9074 7.57262 16.817 7.55345 16.7256 7.55252C16.6341 7.55159 16.5434 7.56892 16.4587 7.60349C16.374 7.63806 16.2971 7.68919 16.2324 7.75386C16.1677 7.81854 16.1166 7.89548 16.082 7.98016C16.0474 8.06484 16.0301 8.15558 16.031 8.24704C16.032 8.3385 16.0511 8.42886 16.0874 8.51283C16.1237 8.59679 16.1764 8.67267 16.2424 8.73602L17.8179 10.3115L8.47934 10.3035C8.38825 10.3021 8.29778 10.3188 8.2132 10.3527C8.12862 10.3865 8.05161 10.4369 7.98665 10.5007C7.9217 10.5646 7.87008 10.6408 7.83481 10.7248C7.79954 10.8088 7.78132 10.899 7.7812 10.9901C7.78108 11.0812 7.79907 11.1714 7.83412 11.2555C7.86917 11.3396 7.92059 11.4159 7.98538 11.4799C8.05017 11.544 8.12705 11.5945 8.21154 11.6286C8.29603 11.6627 8.38645 11.6796 8.47755 11.6785L17.8197 11.6865L16.2424 13.2639C16.1764 13.3272 16.1237 13.4031 16.0874 13.487C16.0511 13.571 16.032 13.6614 16.031 13.7528C16.0301 13.8443 16.0474 13.935 16.082 14.0197C16.1166 14.1044 16.1677 14.1813 16.2324 14.246C16.2971 14.3107 16.374 14.3618 16.4587 14.3964C16.5434 14.431 16.6341 14.4483 16.7256 14.4474C16.817 14.4464 16.9074 14.4273 16.9913 14.391C17.0753 14.3547 17.1512 14.302 17.2145 14.236L19.9645 11.486C20.0296 11.421 20.0809 11.3436 20.1155 11.2585C20.1501 11.1733 20.1672 11.082 20.1659 10.9901ZM18.3389 5.74163C18.3367 5.58648 18.2821 5.43662 18.184 5.31642C16.5064 3.19768 13.9092 1.83327 10.9993 1.83327C5.94492 1.83327 1.83261 5.94557 1.83261 10.9999C1.83261 16.0543 5.94491 20.1666 10.9993 20.1666C13.9092 20.1666 16.5064 18.8022 18.184 16.6834C18.2405 16.6127 18.2825 16.5315 18.3075 16.4445C18.3325 16.3576 18.3402 16.2665 18.3299 16.1766C18.3197 16.0866 18.2918 15.9996 18.2478 15.9205C18.2039 15.8413 18.1447 15.7717 18.0738 15.7155C18.0028 15.6592 17.9215 15.6176 17.8344 15.5929C17.7473 15.5682 17.6562 15.5609 17.5663 15.5715C17.4764 15.5821 17.3895 15.6103 17.3105 15.6546C17.2316 15.6989 17.1622 15.7583 17.1062 15.8294C15.6781 17.6331 13.4803 18.7916 10.9993 18.7916C6.68806 18.7916 3.20761 15.3112 3.20761 10.9999C3.20761 6.68872 6.68807 3.20827 10.9993 3.20827C13.4803 3.20827 15.6781 4.36675 17.1062 6.17043C17.1942 6.28496 17.3161 6.36887 17.4545 6.41023C17.5929 6.45159 17.7408 6.44831 17.8773 6.40085C18.0137 6.35339 18.1317 6.26416 18.2146 6.14583C18.2975 6.0275 18.3409 5.88607 18.3389 5.74163Z"
                  fill="#AFAFBE"
                />
              </g>
            </svg>
            <span class="ft-medium q-ml-sm">{{
              this.$t("titles.swap.outputHash")
            }}</span>
          </q-btn>
        </div>
        <div v-if="this.from !== 'history'" class="flex justify-center q-mt-md">
          <q-btn
            :label="$t('titles.swap.openHistory')"
            color="accent"
            class="q-mr-md action-btn"
            @click="() => this.$emit('openHistory')"
          />
          <q-btn
            :label="$t('titles.swap.newTransactionBtn')"
            color="primary"
            icon="refresh"
            class="action-btn"
            @click="() => this.$emit('newTxn')"
          />
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "SwapTxnCompeleted",
  components: {},
  props: {
    openHistory: {
      type: Function,
      required: false
    },
    newTxn: {
      type: Function,
      required: false
    },
    txnStatus: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: false,
      default: undefined
    },
    goback: {
      type: Function,
      required: false
    }
  },

  data() {
    return {
      isVisible: true,
      momentdate: moment
    };
  },
  computed: mapState({
    Currencylist: state => state.gateway.currencyList.result
  }),

  methods: {
    copyAddress(txnId) {
      clipboard.writeText(txnId);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: "Transaction ID is copied!"
      });
    },
    inputHash(hash) {
      let payInCurrency = this.Currencylist.find(
        item => item.ticker === this.txnStatus.currencyFrom
      );
      let url = payInCurrency.transactionUrl;
      url = url.slice(0, url.lastIndexOf("/") - (url.length - 1)) + hash;

      this.$gateway.send("core", "open_url", { url });
    },
    outputHash(url) {
      this.$gateway.send("core", "open_url", { url });
    }
  }
};
</script>
