<template>
  <q-page
    class="swap"
    :class="{ 'swap--fill': routes === 'maintenance' }"
    style="min-height: unset"
  >
    <q-inner-loading :showing="swaploading">
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
    <div class="swap__layout">
      <div class="swap__main">
        <!-- Swap steps. Position comes from the existing
             `stepperPosition` store value. -->
        <div
          v-if="routes !== 'txnHistory' && routes !== 'maintenance'"
          class="swap__stepper"
        >
          <template
            v-for="(step, index) in [
              $t('titles.swap.exchangePair'),
              $t('titles.swap.walletAddress'),
              $t('titles.swap.payment'),
              $t('titles.swap.exchange')
            ]"
          >
            <span
              :key="`step-${index}`"
              class="swap__step"
              :class="{
                'swap__step--active':
                  $store.state.gateway.stepperPosition === index + 1,
                'swap__step--done':
                  $store.state.gateway.stepperPosition > index + 1
              }"
            >
              <span class="swap__step-marker">
                <q-icon
                  v-if="$store.state.gateway.stepperPosition > index + 1"
                  name="check"
                  size="14px"
                />
                <template v-else>0{{ index + 1 }}</template>
              </span>
              {{ step }}
            </span>
            <span
              v-if="index < 3"
              :key="`line-${index}`"
              class="swap__step-line"
            />
          </template>
        </div>
        <div v-if="this.routes === 'mainPage'">
          <div class="flex row justify-between">
            <div class="flex row privacy-swap-container">
              <header class="text-h6 ft-bold q-mr-md">
                {{ this.$t("titles.swap.exchange") }}
              </header>
              <q-btn
                v-if="this.currentExchange !== 'quickex'"
                flat
                round
                dense
                padding="0"
                style="cursor:pointer;height:17px;width:17px;"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1C6.38702 1 1 6.38702 1 13C1 19.613 6.38702 25 13 25C19.613 25 25 19.613 25 13C25 6.38702 19.613 1 13 1ZM13 2.84615C18.6178 2.84615 23.1538 7.38221 23.1538 13C23.1538 18.6178 18.6178 23.1538 13 23.1538C7.38221 23.1538 2.84615 18.6178 2.84615 13C2.84615 7.38221 7.38221 2.84615 13 2.84615ZM12.0769 6.53846V8.38462H13.9231V6.53846H12.0769ZM12.0769 10.2308V19.4615H13.9231V10.2308H12.0769Z"
                    fill="#8787A8"
                    stroke="#8787A8"
                  />
                </svg>
                <q-menu
                  v-model="showPrivacyPopup"
                  :offset="[0, 5]"
                  content-class="privacy-popup-menu"
                >
                  <div class="privacy-popup">
                    <div class="popup-content">
                      {{ this.$t("titles.swap.privacySwapDescription") }}
                    </div>

                    <q-btn
                      flat
                      round
                      dense
                      padding="0"
                      class="close-btn"
                      @click="showPrivacyPopup = false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_119_4983)">
                          <path
                            d="M19.0711 4.92849C15.1721 1.0295 8.82792 1.0295 4.92893 4.92849C1.02995 8.82748 1.02995 15.1716 4.92893 19.0706C8.82792 22.9696 15.1721 22.9696 19.0711 19.0706C22.9701 15.1716 22.9701 8.82748 19.0711 4.92849ZM14.4749 15.5351L12 13.0602L9.52513 15.5351C9.23203 15.8282 8.75756 15.8282 8.46447 15.5351C8.17137 15.242 8.17137 14.7675 8.46447 14.4744L10.9393 11.9996L8.46447 9.52468C8.17137 9.23159 8.17137 8.75712 8.46447 8.46402C8.75756 8.17093 9.23203 8.17093 9.52513 8.46402L12 10.9389L14.4749 8.46402C14.768 8.17093 15.2424 8.17093 15.5355 8.46402C15.8286 8.75712 15.8286 9.23159 15.5355 9.52468L13.0607 11.9996L15.5355 14.4744C15.8286 14.7675 15.8286 15.242 15.5355 15.5351C15.2424 15.8282 14.768 15.8282 14.4749 15.5351Z"
                            fill="#77778B"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_119_4983">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </q-btn>
                  </div>
                </q-menu>
              </q-btn>
              <q-toggle
                v-if="this.currentExchange !== 'quickex'"
                v-model="privacySwap"
                :label="$t('titles.swap.privacySwap')"
                left-label
                class="privacySwap q-ml-xs"
              />
            </div>
            <span v-if="exechangeRateType === 'float'" class="swap__refresh">
              <q-icon name="schedule" size="14px" />
              {{ $t("titles.swap.ratesRefresh") }}
            </span>
            <div class="beldex-segmented" role="tablist">
              <button
                type="button"
                role="tab"
                class="beldex-segmented__item beldex-segmented__item--active"
                aria-selected="true"
              >
                <span class="beldex-segmented__dot" />
                {{ $t("titles.swap.exchange") }}
              </button>
              <button
                type="button"
                role="tab"
                class="beldex-segmented__item"
                aria-selected="false"
                @click="navigateToHistory"
              >
                {{ $t("titles.swap.history") }}
              </button>
            </div>
          </div>

          <section class="swap__pair">
            <article>
              <BeldexField
                class="q-mt-md ft-regular swap-amount"
                :label="$t('titles.swap.youSend')"
                :error="$v.sendAmount.$error"
              >
                <q-input
                  v-model="sendAmount"
                  borderless
                  dense
                  type="number"
                  min="0.1"
                  max="100000"
                  :placeholder="0"
                  @keydown="keyHandler"
                  @blur="$v.sendAmount.$touch"
                />
                <Dropdown
                  :filter-currecy-list="
                    this.filtercurrency.filter(
                      item => item.enabledFrom && item.enabled
                    )
                  "
                  :privacy-currency="
                    this.privacyCurrency.filter(item => item.enabledFrom)
                  "
                  :send-amoun-type-value="this.sendAmounType"
                  @sendAmounType="value => (sendAmounType = value)"
                  @sendAmountValidator="sendAmountValidator"
                  @searchCurrency="val => searchCurrency(val)"
                />
              </BeldexField>

              <div
                class="flex"
                :style="
                  this.minMaxWarningContent === 'min' ||
                  this.minMaxWarningContent === 'max' ||
                  (this.pairsMinMax?.from &&
                    !this.pairsMinMax?.minAmountFloat &&
                    !this.pairsMinMax?.maxAmountFloat)
                    ? 'justify-content: space-between;'
                    : 'justify-content: flex-end;'
                "
              >
                <div
                  v-if="
                    this.minMaxWarningContent === 'min' ||
                      this.minMaxWarningContent === 'max' ||
                      (this.pairsMinMax?.from &&
                        !this.pairsMinMax?.minAmountFloat &&
                        !this.pairsMinMax?.maxAmountFloat)
                  "
                  class="q-mt-sm validMinMaxAmount-wrapper"
                >
                  <span
                    v-if="
                      this.pairsMinMax?.from &&
                        this.pairsMinMax?.to &&
                        !this.pairsMinMax?.minAmountFloat &&
                        !this.pairsMinMax?.maxAmountFloat
                    "
                    >{{ this.$t("titles.swap.unsupportedpair") }}</span
                  >
                  <span v-if="this.minMaxWarningContent === 'min'">
                    {{ this.$t("titles.swap.minimumAmt") }}
                    <span
                      class="validMinMaxAmount"
                      @click="
                        sendAmount =
                          exechangeRateType === 'float'
                            ? pairsMinMax?.minAmountFloat
                            : pairsMinMax?.minAmountFixed
                      "
                    >
                      {{
                        this.exechangeRateType === "float"
                          ? this.pairsMinMax?.minAmountFloat
                          : this.pairsMinMax?.minAmountFixed
                      }}
                      {{ this.pairsMinMax?.from }}
                    </span>
                  </span>
                  <span
                    v-if="this.minMaxWarningContent === 'max'"
                    @click="
                      sendAmount =
                        exechangeRateType === 'float'
                          ? pairsMinMax?.maxAmountFloat
                          : pairsMinMax?.maxAmountFixed
                    "
                  >
                    {{ this.$t("titles.swap.maximumAmt") }}
                    <span class="validMinMaxAmount">
                      {{
                        this.exechangeRateType === "float"
                          ? this.pairsMinMax?.maxAmountFloat
                          : this.pairsMinMax?.maxAmountFixed
                      }}
                      {{ this.pairsMinMax?.from }}
                    </span>
                  </span>
                </div>
                <div class="flex justify-center full-width">
                  <q-btn
                    color="accent"
                    class="swap-btn q-mt-sm"
                    :disable="
                      !sendAmounType.enabledTo || !receiveAmountType.enabledFrom
                    "
                    @click="swapCurrencyType"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 15.5V2.5M2 5.5l3-3 3 3" />
                      <path d="M13 2.5v13M10 12.5l3 3 3-3" />
                    </svg>
                  </q-btn>
                </div>
              </div>

              <BeldexField
                class="ft-regular swap-amount"
                :label="$t('titles.swap.youGet')"
              >
                <q-input
                  v-if="this.exechangeRateType === 'float'"
                  v-model="this.exchange_amount.amountTo"
                  borderless
                  dense
                  :placeholder="0"
                  :prefix="this.exchange_amount.amountTo ? '≈' : ''"
                  disable
                />
                <q-input
                  v-else
                  v-model="this.fixedExchangeRate.amountTo"
                  borderless
                  dense
                  :placeholder="0"
                  disable
                />
                <Dropdown
                  :filter-currecy-list="
                    this.filtercurrency.filter(
                      item => item.enabledTo && item.enabled
                    )
                  "
                  :privacy-currency="
                    this.privacyCurrency.filter(item => item.enabledTo)
                  "
                  :send-amoun-type-value="this.receiveAmountType"
                  @sendAmounType="value => (receiveAmountType = value)"
                  @sendAmountValidator="getAmountValidator"
                  @searchCurrency="val => searchCurrency(val)"
                />
              </BeldexField>
            </article>
          </section>

          <div class="flex row info-wrapper q-mt-md">
            <div
              style="width: 4%; padding-top: 5px"
              class="flex justify-center"
            >
              <q-icon name="o_info" size="14px" />
            </div>
            <div v-if="this.exechangeRateType === 'float'" style="width: 95%">
              {{ this.$t("titles.swap.floatingRateDisc") }}
            </div>
            <div v-else style="width: 95%">
              {{ this.$t("titles.swap.fixedRateExactAmtDisc") }}
            </div>
          </div>

          <header class="ft-bold q-mt-md">
            {{ this.$t("titles.swap.walletAddress") }}
          </header>

          <BeldexField
            class="q-mt-md ft-regular address-wrapper"
            :label="$t('fieldLabels.recipientAddress')"
            :error="this.recipientAddress.error"
            error-label="Invalid Address"
          >
            <div v-if="showProtocol(this.receiveAmountType)" class="q-pr-sm">
              <span class="proto ft-semibold">{{
                this.receiveAmountType.protocol
              }}</span>
            </div>
            <q-input
              :value="recipientAddress.val"
              borderless
              dense
              :placeholder="
                this.$t('placeholders.enterRecipientAddress', {
                  coin: this.receiveAmountType.name
                })
              "
              @input="val => this.recipientAddressValidator(val)"
            />
            <beldex-spinner
              v-if="this.recipientLoader"
              color="primary"
              size="2em"
            />
          </BeldexField>
          <div class="flex row info-wrapper q-mt-md">
            <div
              style="width: 4%; padding-top: 5px"
              class="flex justify-center"
            >
              <q-icon name="o_info" size="14px" />
            </div>
            <div style="width: 95%">
              {{ this.$t("titles.swap.giveCorrectAddress") }}
            </div>
          </div>
          <div
            v-if="this.receiveAmountType?.extraIdName"
            class="destination-tag-wrapper q-mt-md"
          >
            <span class="ft-Light hint">
              Please specify the {{ this.receiveAmountType.extraIdName }} for
              your
              <span class="uppercase">{{ this.receiveAmountType.value }}</span>
              receiving address if your wallet provides it. Your transaction
              will not go through if you omit it. If your wallet doesn’t require
              a
              {{ this.receiveAmountType.extraIdName }}, remove the tick.
            </span>
            <br />
            <q-checkbox
              v-model="destinationTag"
              color="secondary"
              true-value="yes"
              false-value="no"
              size="xs"
            ></q-checkbox>
            <span>
              {{ this.$t("titles.swap.myWalletRequire") }}
              {{ this.receiveAmountType.extraIdName }}
            </span>
          </div>

          <q-input
            v-if="destinationTag === 'yes'"
            v-model="destinationTagValue"
            class="box-input"
            :placeholder="`Enter ${this.receiveAmountType.extraIdName}`"
            borderless
            dense
          />
          <article
            v-if="
              this.exechangeRateType === 'fixed' ||
                this.currentExchange === 'quickex'
            "
          >
            <BeldexField
              class="q-mt-md ft-regular address-wrapper"
              label="Refund wallet Address"
              :error="this.refundAddress.error"
              error-label="Please enter valid address"
            >
              <div v-if="showProtocol(this.sendAmounType)" class="q-pr-sm">
                <span class="proto ft-semibold">
                  {{ this.sendAmounType.protocol }}
                </span>
              </div>
              <q-input
                :value="refundAddress.val"
                borderless
                dense
                :placeholder="
                  this.$t('placeholders.enterRecipientAddress', {
                    type: this.sendAmounType.name
                  })
                "
                @input="val => this.refundAddressValidator(val)"
              />
              <beldex-spinner
                v-if="this.refundLoader"
                color="primary"
                size="2em"
              />
            </BeldexField>
          </article>

          <div
            v-if="
              (this.exechangeRateType === 'fixed' ||
                (this.currentExchange === 'quickex' &&
                  refundDestinationTag === 'yes')) &&
                this.sendAmounType.hasOwnProperty('extraIdName')
            "
            class="destination-tag-wrapper q-mt-md"
          >
            <span class="ft-Light hint">
              Please specify the {{ this.sendAmounType.extraIdName }} for your
              <span class="uppercase">{{ this.sendAmounType.value }}</span>
              receiving address if your wallet provides it. Your transaction
              will not go through if you omit it. If your wallet doesn’t require
              a
              {{ this.sendAmounType.extraIdName }}, remove the tick.
            </span>
            <br />
            <q-checkbox
              v-model="destinationTag"
              color="secondary"
              true-value="yes"
              false-value="no"
              size="xs"
            ></q-checkbox>
            <span>
              {{ this.$t("titles.swap.myWalletRequire") }}
              {{ this.sendAmounType.extraIdName }}
            </span>
          </div>

          <q-input
            v-if="refundDestinationTag === 'yes'"
            v-model="refundDestinationTagValue"
            :placeholder="`Enter ${this.sendAmounType.extraIdName}`"
            class="box-input"
            borderless
            dense
          />
          <div class="terms-condition q-mt-md">
            <q-checkbox
              v-model="agree"
              color="secondary"
              true-value="yes"
              false-value="no"
              size="sm"
            ></q-checkbox>
            <span>
              {{ this.$t("titles.swap.agreeWith") }}
              <a @click="openExternalLink(exchangeLinks.termsLink)">
                {{ this.$t("titles.swap.termOfUse") }}
              </a>
              {{ this.$t("titles.swap.and") }}
              <a @click="openExternalLink(exchangeLinks.privacyPolicyLink)">{{
                this.$t("titles.swap.privacyPolicy")
              }}</a>
            </span>
          </div>

          <div class="beldex-form-actions q-mt-md">
            <q-btn
              class="beldex-btn"
              unelevated
              no-caps
              :disable="!this.disableValidation()"
              @click="this.next"
            >
              {{ $t("buttons.next") }}
              <img src="~assets/icons/arrow-right.svg" alt="" />
            </q-btn>
          </div>
        </div>
        <SwapConfirmPayment
          v-if="this.routes === 'makePayment'"
          :exchange-type="this.exechangeRateType"
          :floating-rate="this.exchange_amount"
          :fixed-rate="this.fixedExchangeRate"
          :recipient-address="this.recipientAddress.val"
          :refund-address="this.refundAddress.val"
          :send-chain-details="this.sendAmounType"
          :receive-chain-dtails="this.receiveAmountType"
          :pairs-min-max="this.pairsMinMax"
          :min-max-warning-content="this.minMaxWarningContent"
          @sending="sendAmounts($event)"
          @goback="navigation('mainPage', 1)"
          @toHistory="navigateToHistory"
          @submit="confirmPayment"
        />
        <SwapTxnHistory
          v-if="this.routes === 'txnHistory'"
          :privacy-swap="this.privacySwap"
          @goback="leaveHistory"
        />
        <SwapTxnSettlement
          v-if="this.routes === 'settlement' && createdTxnDetails.status"
          :created-txn-details="createdTxnDetails.result"
          :floating-rate="this.exchange_amount"
          :fixed-rate="this.fixedExchangeRate"
          :receive-chain-details="this.receiveAmountType"
          :send-chain-details="this.sendAmounType"
          :is-privacy-swap="this.privacySwap"
          @clearAllintervals="clearAllintervals"
          @toHistory="navigateToHistory"
          @goback="
            () => {
              navigation('mainPage', 1);
              clearState();
            }
          "
        />

        <swapStatus
          v-if="this.routes === 'swapStatus'"
          @toHistory="navigation('txnHistory', 1)"
          @newTxn="
            () => {
              navigation('mainPage', 1);
              clearState();
            }
          "
        />
        <SwapTxnCompeleted
          v-if="this.routes === 'txnCompleted'"
          :txn-status="this.txnStatus.result[0]"
          @openHistory="navigation('txnHistory', 1)"
          @newTxn="
            () => {
              navigation('mainPage', 1);
              clearState();
            }
          "
        />

        <SwapUnderMaintenance
          v-if="this.routes === 'maintenance'"
          @openHistory="navigateToHistory"
        />
      </div>
      <!-- Transaction preview. The privacy swap toggle and the Floating /
           Fixed rate-type choice have no behaviour hook yet, so they stay as
           they are. -->
      <aside
        v-if="
          this.routes === 'mainPage' ||
            this.routes === 'makePayment' ||
            this.routes === 'settlement' ||
            this.routes === 'swapStatus' ||
            ((this.routes === 'txnHistory' || this.routes === 'txnCompleted') &&
              this.historyPreview)
        "
        class="swap__side"
      >
        <div class="swap__side-head">
          <h2 class="swap__side-title">
            {{ this.$t("titles.swap.transactionPreview") }}
          </h2>
          <span v-if="this.routes !== 'swapStatus'" class="swap__side-badge">{{
            this.$t("titles.swap.estimate")
          }}</span>
        </div>
        <dl v-if="this.routes === 'swapStatus'" class="swap__order">
          <div class="swap__order-row">
            <dt>{{ this.$t("titles.swap.transactionID") }}</dt>
            <dd>{{ orderStatus.id }}</dd>
          </div>
          <div class="swap__order-row">
            <dt>{{ this.$t("titles.swap.youSent") }}</dt>
            <dd class="uppercase">
              {{ orderStatus.amountExpectedFrom }}
              {{ orderStatus.currencyFrom }}
            </dd>
          </div>
          <div v-if="orderStatus.payoutExtraId" class="swap__order-row">
            <dt>{{ orderStatus.payoutExtraIdName || "Memo" }}</dt>
            <dd>{{ orderStatus.payoutExtraId }}</dd>
          </div>
          <div class="swap__order-row">
            <dt>{{ this.$t("titles.swap.exchangeRate") }}</dt>
            <dd class="uppercase">
              1 {{ orderStatus.currencyFrom }} ≈
              {{ Number(orderStatus.rate).toFixed(8) }}
              {{ orderStatus.currencyTo }}
            </dd>
          </div>
          <div class="swap__order-row swap__order-row--stack">
            <dt class="uppercase">
              {{ this.$t("titles.swap.changellyAddress") }}
              ({{ orderStatus.currencyFrom }})
            </dt>
            <dd class="break-all">{{ orderStatus.payinAddress }}</dd>
          </div>
          <div class="swap__order-row swap__order-row--stack">
            <dt class="uppercase">
              {{ this.$t("fieldLabels.recipientAddress") }}
              ({{ orderStatus.currencyTo }})
            </dt>
            <dd class="break-all">{{ orderStatus.payoutAddress }}</dd>
          </div>
          <div class="swap__order-row swap__order-row--total">
            <dt>{{ this.$t("titles.swap.youGet") }}</dt>
            <dd class="uppercase">
              ≈ {{ orderStatus.amountExpectedTo }} {{ orderStatus.currencyTo }}
            </dd>
          </div>
        </dl>
        <table
          v-else-if="historyPreview && historyPreview.compact"
          style="width: 100%"
          class="txn-fee-details"
        >
          <tr>
            <td>{{ this.$t("titles.swap.youSend") }}</td>
            <td class="uppercase">
              {{ historyPreview.amountFrom }} {{ historyPreview.from }}
            </td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.exchangeRate") }}</td>
            <td class="uppercase">
              1 {{ historyPreview.from }} ≈ {{ historyPreview.rate }}
              {{ historyPreview.to }}
            </td>
          </tr>
          <tr v-if="historyPreview.networkFee">
            <td>{{ this.$t("titles.swap.networkFee") }}</td>
            <td class="uppercase">
              {{ historyPreview.networkFee }} {{ historyPreview.to }}
            </td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.status") }}</td>
            <td>{{ historyPreview.status }}</td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.youGet") }}</td>
            <td class="uppercase">
              {{ historyPreview.amountTo }} {{ historyPreview.to }}
            </td>
          </tr>
        </table>

        <table
          v-else-if="this.routes === 'txnHistory'"
          style="width: 100%"
          class="txn-fee-details"
        >
          <tr>
            <td>{{ this.$t("titles.swap.youSend") }}</td>
            <td class="uppercase">
              {{ historyPreview.amountFrom }} {{ historyPreview.from }}
            </td>
          </tr>
          <tr v-if="historyPreview.type === 'float'">
            <td>{{ this.$t("titles.swap.exchangeRate") }}</td>
            <td class="uppercase">
              1 {{ historyPreview.from }} ≈ {{ historyPreview.rate }}
              {{ historyPreview.to }}
            </td>
          </tr>
          <tr v-else>
            <td>{{ this.$t("titles.swap.fixedRate") }}</td>
            <td class="uppercase">
              1 {{ historyPreview.from }} = {{ historyPreview.amountTo }}
              {{ historyPreview.to }}
            </td>
          </tr>
          <tr v-if="historyPreview.type === 'float'">
            <td>{{ this.$t("titles.swap.exchangefee") }}</td>
            <td class="uppercase">
              {{ historyPreview.fee }} {{ historyPreview.to }}
            </td>
          </tr>
          <tr v-else>
            <td>{{ this.$t("titles.swap.fees") }}</td>
            <td style="font-size: 12px">
              {{ this.$t("titles.swap.allTheFees") }}
            </td>
          </tr>
          <tr v-if="historyPreview.type === 'float'">
            <td>{{ this.$t("titles.swap.networkFee") }}</td>
            <td class="uppercase">
              {{ historyPreview.networkFee }} {{ historyPreview.to }}
            </td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.youGet") }}</td>
            <td class="uppercase">
              {{ historyPreview.type === "float" ? "≈" : "" }}
              {{ historyPreview.amountTo }} {{ historyPreview.to }}
            </td>
          </tr>
        </table>

        <table v-else style="width: 100%" class="txn-fee-details">
          <tr>
            <td>{{ this.$t("titles.swap.youSend") }}</td>
            <td>
              {{ this.sendAmount > 0 ? this.sendAmount : 0 }}
              {{ this.sendAmounType.name }}
            </td>
          </tr>
          <tr v-if="this.exechangeRateType === 'float'">
            <td>{{ this.$t("titles.swap.exchangeRate") }}</td>
            <td class="uppercase">
              1
              {{ this.sendAmounType.name }}
              ≈
              {{
                exchange_amount.rate
                  ? Number(exchange_amount.rate).toFixed(8)
                  : "--"
              }}
              {{ this.receiveAmountType.name }}
            </td>
          </tr>
          <tr v-else>
            <td>{{ this.$t("titles.swap.fixedRate") }}</td>
            <td class="uppercase">
              <span>
                1
                {{ this.sendAmounType.name }}
                =
                {{
                  fixedExchangeRate.result
                    ? Number(fixedExchangeRate.result).toFixed(8)
                    : "--"
                }}
                {{ this.receiveAmountType.name }}
              </span>
              <br />
              <span class="fixed-rate-hint">
                {{ this.$t("titles.swap.fixedRateUpdateSec") }}
              </span>
            </td>
          </tr>
          <tr v-if="this.exechangeRateType == 'float'">
            <td>{{ this.$t("titles.swap.exchangefee") }}</td>
            <td class="uppercase">
              {{ getFeeAmount() }} {{ receiveAmountType.name }}
            </td>
          </tr>

          <tr v-else>
            <td>{{ this.$t("titles.swap.fees") }}</td>
            <td style="font-size: 12px">
              {{ this.$t("titles.swap.allTheFees") }}
            </td>
          </tr>
          <tr v-if="this.exechangeRateType == 'float'">
            <td>{{ this.$t("titles.swap.networkFee") }}</td>
            <td class="uppercase">
              {{
                exchange_amount.networkFee
                  ? Number(exchange_amount.networkFee).toFixed(8)
                  : "--"
              }}
              {{ this.receiveAmountType.name }}
            </td>
          </tr>
          <tr>
            <td>{{ this.$t("titles.swap.youGet") }}</td>
            <td v-if="this.exechangeRateType === 'float'" class="uppercase">
              ≈
              {{
                exchange_amount.amountTo
                  ? Number(exchange_amount.amountTo).toFixed(8)
                  : "--"
              }}
              {{ this.receiveAmountType.name }}
            </td>
            <td v-else class="uppercase">
              {{
                fixedExchangeRate.amountTo
                  ? Number(fixedExchangeRate.amountTo).toFixed(8)
                  : "--"
              }}
              {{ this.receiveAmountType.name }}
            </td>
          </tr>
        </table>
      </aside>
    </div>
  </q-page>
</template>

<script>
import moment from "moment";

import { required, decimal } from "vuelidate/lib/validators";
import BeldexField from "components/beldex_field";
import SwapConfirmPayment from "./swapConfirmPayment.vue";
import SwapTxnHistory from "./swapTxnHistory.vue";
import SwapTxnSettlement from "./swapTxnSettlement.vue";
import swapStatus from "./swapStatus.vue";
import SwapTxnCompeleted from "./swapTxnCompeleted.vue";
import SwapUnderMaintenance from "./swapUnderMaintenance.vue";
import { mapState } from "vuex";
import Dropdown from "./currencyDropDown.vue";

const EXCHANGE_LINKS = {
  quickex: {
    termsLink: "https://quickex.io/docs/terms-of-use",
    privacyPolicyLink: "https://quickex.io/docs/privacy-policy"
  },
  changelly: {
    termsLink: "https://changelly.com/terms-of-use",
    privacyPolicyLink: "https://changelly.com/privacy-policy"
  }
};

export default {
  components: {
    BeldexField,
    SwapConfirmPayment,
    SwapTxnHistory,
    SwapTxnSettlement,
    swapStatus,
    SwapTxnCompeleted,
    SwapUnderMaintenance,
    Dropdown
  },
  watch: {
    isValidRecipientAddress(newisValidRecipientAddress) {
      if (!this.recipientAddress.val) {
        this.recipientLoader = false;
        this.recipientAddress.error = false;
        return 0;
      }
      if (newisValidRecipientAddress) {
        if (newisValidRecipientAddress.result) {
          this.recipientLoader = false;
          this.recipientAddress.error = false;
        } else {
          this.recipientAddress.error = true;
          this.recipientLoader = false;
        }
      }
    },
    isValidRefundAddress(isValidRefundAddress) {
      if (!this.refundAddress.val) {
        this.refundLoader = false;
        this.refundAddress.error = false;
        return 0;
      }
      if (isValidRefundAddress) {
        if (isValidRefundAddress.result) {
          this.refundLoader = false;
          this.refundAddress.error = false;
        } else {
          this.refundLoader = false;
          this.refundAddress.error = true;
        }
      }
    },
    sendAmount(newvalue) {
      this.clearAllintervals();
      this.minMaxAmoutValidator(newvalue);
      this.getExchangeRate();
      this.validateFixedIsEnabled();
    },
    pairsMinMax(newVal) {
      this.checkExchangeFallback(newVal);
      this.minMaxAmoutValidator(this.sendAmount);
    },
    exchange_amount(newVal) {
      this.checkExchangeFallback(newVal);
    },
    fixedExchangeRate(newVal) {
      this.checkExchangeFallback(newVal);
    },
    currencyList(newValue) {
      // Check if backend flagged maintenance (API failure)
      const rawCurrencyList = this.$store.state.gateway.currencyList;
      if (rawCurrencyList?.maintenance) {
        this.swaploading = false;
        this.underMaintenance = true;
        this.navigation("maintenance", 1);
        return;
      }
      if (newValue && newValue.length > 0) {
        this.swaploading = false;
        newValue.sort(function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        this.filtercurrency = newValue;
        let fromCoin;
        let toCoin;
        let btcCoin = newValue.find(
          item =>
            item.name.toLowerCase() === "btc" &&
            item.protocol.toLowerCase() === "btc"
        );
        let bdxCoin = newValue.find(
          item =>
            item.name.toLowerCase() === "bdx" &&
            item.protocol.toLowerCase() === "bdx"
        );
        if (bdxCoin.enabledTo) {
          fromCoin = btcCoin;
          toCoin = bdxCoin;
        } else {
          fromCoin = bdxCoin;
          toCoin = btcCoin;
        }
        this.sendAmounType = fromCoin;
        this.btcCoinDetails = fromCoin;
        let filterCoin = newValue.filter(
          item =>
            item.enabled &&
            (item.name === "XMR" ||
              item.name === "ZEC" ||
              item.name === "DASH" ||
              item.name === "ROSE" ||
              item.name === "DCR" ||
              item.name === "ZEN" ||
              item.name === "NYM" ||
              item.name === "XVG" ||
              item.name === "ARRR" ||
              item.name === "DUSK" ||
              item.name === "FIRO" ||
              item.name === "VTC")
        );

        filterCoin.unshift(toCoin);
        this.privacyCurrency = filterCoin;
        if (toCoin.enabled && fromCoin.enabled) {
          this.bdxCoinDetails = toCoin;
          this.receiveAmountType = toCoin;
          this.restartAllIntervals();
        } else {
          this.underMaintenance = true;
          this.navigation("maintenance", 1);
        }
      }
    },

    createdTxnDetails(newTxn) {
      if (newTxn.result) {
        this.swaploading = false;
        this.get_transaction_status();
      }
    },
    txnStatus(newStatus) {
      if (
        newStatus.hasOwnProperty("result") &&
        Array.isArray(newStatus.result) &&
        newStatus.result.length > 0
      ) {
        const status = newStatus.result[0].status;
        const terminalStatuses = [
          "finished",
          "failed",
          "refunded",
          "expired",
          "overdue"
        ];
        if (terminalStatuses.includes(status)) {
          if (this.refreshTxnStatus) {
            clearInterval(this.refreshTxnStatus);
            this.refreshTxnStatus = null;
          }
          if (status === "finished") {
            this.navigation("txnCompleted", 5);
          }
        } else if (
          status === "confirming" ||
          status === "exchanging" ||
          status === "sending"
        ) {
          this.navigation("swapStatus", 4);
          if (!this.refreshTxnStatus) {
            this.get_transaction_status();
          }
        }
      }
    },
    privacySwap() {
      this.clearState();
    }
  },

  computed: mapState({
    orderStatus: state => state.gateway.txnStatus?.result?.[0] || {},
    currencyList: state => {
      let data = state.gateway.currencyList.result;
      let pushedData = [];
      if (data) {
        Object.keys(data).length > 0 &&
          data.map(item => {
            item.value = item.ticker;
            pushedData.push(item);
          });
      }
      return pushedData;
    },

    exchange_amount: state => {
      let data = state.gateway.exchangeAmount;
      let result = {};
      if (data.hasOwnProperty("result")) {
        if (
          state.gateway.exchangeAmount.status &&
          state.gateway.exchangeAmount.result
        ) {
          result = { ...state.gateway.exchangeAmount.result[0] };
          if (data.exchange_type) result.exchange_type = data.exchange_type;
        }
      } else {
        result = { ...data };
      }
      return result;
    },
    fixedExchangeRate: state => {
      let data = state.gateway.fixedExchangeRate;
      let result = {};
      if (
        data.hasOwnProperty("result") &&
        state.gateway.fixedExchangeRate.result
      ) {
        result = { ...state.gateway.fixedExchangeRate.result[0] };
        if (data.exchange_type) result.exchange_type = data.exchange_type;
      }
      return result;
    },

    createdTxnDetails: state => state.gateway.createdTxnDetails,
    txnStatus: state => state.gateway.txnStatus,

    isValidRecipientAddress: state =>
      state.gateway.RecipientAddressValidation.result,
    isValidRefundAddress: state => state.gateway.refundAddressValidation.result,
    pairsMinMax: state => {
      let data = state.gateway.pairsMinMax;
      let result = {};
      if (data.hasOwnProperty("result") && state.gateway.pairsMinMax.result) {
        result = { ...state.gateway.pairsMinMax.result[0] };
        if (data.exchange_type) result.exchange_type = data.exchange_type;
      }
      return result;
    },
    info: state => state.gateway.wallet.info,
    exchangeLinks() {
      return EXCHANGE_LINKS[this.currentExchange] ?? EXCHANGE_LINKS.changelly;
    }
  }),

  validations: {
    sendAmount: {
      required,
      decimal
    },
    getAmount: {
      required
    }
  },
  provide() {
    return {
      // Lets the history detail view (swapWaitingTxnHistory) fill the
      // Transaction preview panel from its own order.
      setSwapPreview: preview => {
        this.historyPreview = preview;
      }
    };
  },
  data() {
    return {
      historyPreview: null,
      filtercurrency: [],
      sendAmount: 0.01,
      getAmount: "",
      agree: "no",
      destinationTag: "no",

      destinationTagValue: "",
      refundDestinationTag: "no",
      refundDestinationTagValue: "",
      refundAddress: { error: false, val: "" },
      routes: "mainPage",

      exechangeRateType: "float",
      recipientAddress: { error: false, val: "" },
      refreshFixedExchangeRate: "",
      refreshFloatExchangeRate: "",
      refreshTxnStatus: "",
      refreshMinMax: "",
      minMaxWarningContent: "",
      bdxCoinDetails: {},
      btcCoinDetails: {},
      sendAmounType: {
        name: "BTC",
        fullName: "Bitcoin",
        value: "btc"
      },
      receiveAmountType: {
        label: "",
        value: ""
      },
      sendAmounTypeOption: "",
      swaploading: true,
      searchTxt: "",
      recipientLoader: false,
      refundLoader: false,
      privacyCurrency: [],
      privacySwap: false,
      showPrivacyPopup: false,
      currentExchange: "changelly",
      underMaintenance: false
    };
  },
  created() {
    this.$gateway.send("swap", "currency_list", {
      walletAddress: this.info.address
    });
  },

  beforeDestroy() {
    clearInterval(this.refreshFixedExchangeRate);
    clearInterval(this.refreshFloatExchangeRate);
    clearInterval(this.refreshTxnStatus);
    clearInterval(this.refreshMinMax);
  },
  methods: {
    navigation(page, step) {
      this.$gateway.send("wallet", "set_stepperPosition", {
        data: step
      });
      this.routes = page;
    },
    navigateToHistory() {
      this.clearAllintervals();
      this.navigation("txnHistory", 1);
    },
    // Back from history: return to the maintenance notice when swap is
    // unavailable, since the exchange form has no currency data to show.
    leaveHistory() {
      if (this.underMaintenance) {
        this.navigation("maintenance", 1);
        return;
      }
      this.navigation("mainPage", 1);
      this.clearState();
    },
    sendAmounts(newvalue) {
      this.sendAmount = newvalue;
      this.clearAllintervals();
      this.minMaxAmoutValidator(newvalue);
      this.getExchangeRate();
      this.validateFixedIsEnabled();
      this.getFixedExchangeAmount();
    },
    minMaxPair() {
      clearInterval(this.refreshMinMax);
      let data = {
        fromDetails: this.sendAmounType,
        toDetails: this.receiveAmountType,
        privacySwap: this.privacySwap,
        amountFrom: this.sendAmount
      };
      this.$gateway.send("swap", "get_min_max", data);
      this.refreshMinMax = setInterval(() => {
        this.$gateway.send("swap", "get_min_max", data);
      }, 30000);
    },
    searchCurrency(txt) {
      this.searchTxt = txt;
      if (this.searchTxt) {
        const query = String(this.searchTxt)
          .trim()
          .toLowerCase();
        this.filtercurrency = this.currencyList.filter(item =>
          [item.value, item.name, item.fullName].some(field =>
            String(field || "")
              .toLowerCase()
              .includes(query)
          )
        );
      } else {
        this.filtercurrency = this.currencyList;
      }
    },
    keyHandler(evt) {
      if (
        evt.key === "-" ||
        evt.key === "+" ||
        evt.key === "e" ||
        evt.key === "E"
      ) {
        evt.preventDefault();
      }
    },
    restartAllIntervals() {
      this.clearAllintervals();
      clearInterval(this.refreshMinMax);
      this.minMaxPair();
      this.getExchangeRate();
      this.validateFixedIsEnabled();
    },
    checkExchangeFallback(newVal) {
      const exchangeType =
        newVal?.exchange_type ||
        this.$store.state.gateway.exchangeAmount?.exchange_type ||
        this.$store.state.gateway.pairsMinMax?.exchange_type ||
        this.$store.state.gateway.fixedExchangeRate?.exchange_type;

      if (exchangeType) {
        if (this.currentExchange !== exchangeType) {
          this.currentExchange = exchangeType;
          // Consent was given for the other provider's terms.
          this.agree = "no";
          if (this.routes === "mainPage") {
            this.restartAllIntervals();
          }
        }
      }
    },
    // The network chip only adds information for token networks (e.g. ERC20);
    // a coin whose protocol is just its own symbol shows no chip.
    showProtocol(currency) {
      const protocol = currency && currency.protocol;
      if (!protocol) return false;
      const own = [currency.name, currency.value, currency.ticker]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());
      return !own.includes(String(protocol).toLowerCase());
    },
    sendAmountValidator() {
      this.refundAddress = { val: "", error: false };
      this.refundDestinationTag = "no";
      this.refundDestinationTagValue = "";
      if (
        this.sendAmounType.value === "bdx" &&
        this.receiveAmountType.value === "btc"
      ) {
        this.receiveAmountType = this.btcCoinDetails;
      } else if (this.sendAmounType.value === this.receiveAmountType.value) {
        this.receiveAmountType = this.bdxCoinDetails;
      }
      this.restartAllIntervals();
      if (
        !this.sendAmounType.fixRateEnabled ||
        !this.receiveAmountType.fixRateEnabled
      ) {
        this.exechangeRateType = "float";
      }
    },
    getAmountValidator() {
      this.recipientAddress = { val: "", error: false };
      this.refundAddress = { val: "", error: false };
      this.destinationTag = "no";
      this.destinationTagValue = "";

      if (
        this.sendAmounType.value === "bdx" &&
        this.receiveAmountType.value === "bdx"
      ) {
        this.sendAmounType = this.btcCoinDetails;
      } else if (this.sendAmounType.value === this.receiveAmountType.value) {
        this.sendAmounType = this.bdxCoinDetails;
      }
      this.restartAllIntervals();
      if (
        !this.sendAmounType.fixRateEnabled ||
        !this.receiveAmountType.fixRateEnabled
      ) {
        this.exechangeRateType = "float";
      }
    },
    swapCurrencyType() {
      [this.sendAmounType, this.receiveAmountType] = [
        this.receiveAmountType,
        this.sendAmounType
      ];
      this.swaploading = true;
      this.destinationTagValue = "";
      this.refundDestinationTagValue = "";
      this.recipientAddress = { val: "", error: false };
      this.refundAddress = { val: "", error: false };

      this.$store.commit("gateway/set_pairsMinMax", {
        result: [{ from: "", to: "", minAmountFloat: 0, maxAmountFloat: 0 }]
      });
      this.restartAllIntervals();
      if (
        !this.sendAmounType.fixRateEnabled ||
        !this.receiveAmountType.fixRateEnabled
      ) {
        this.exechangeRateType = "float";
      }
    },
    minMaxAmoutValidator(amount) {
      if (this.exchange_amount.hasOwnProperty("error")) {
        this.minMaxWarningContent = "min";
        this.swaploading = false;
      }
      if (this.exechangeRateType === "float") {
        if (
          this.pairsMinMax.minAmountFloat &&
          Number(amount) < Number(this.pairsMinMax.minAmountFloat)
        ) {
          this.minMaxWarningContent = "min";
          this.swaploading = false;
        } else if (
          this.pairsMinMax.maxAmountFloat &&
          Number(amount) > Number(this.pairsMinMax.maxAmountFloat)
        ) {
          this.minMaxWarningContent = "max";
          this.swaploading = false;
        } else {
          this.minMaxWarningContent = "";
        }
      } else {
        if (
          this.pairsMinMax.minAmountFixed &&
          Number(amount) < Number(this.pairsMinMax.minAmountFixed)
        ) {
          this.minMaxWarningContent = "min";
          this.swaploading = false;
        } else if (
          this.pairsMinMax.maxAmountFixed &&
          Number(amount) > Number(this.pairsMinMax.maxAmountFixed)
        ) {
          this.minMaxWarningContent = "max";
          this.swaploading = false;
        } else {
          this.minMaxWarningContent = "";
        }
      }
      this.swaploading = false;
    },
    clearState() {
      this.recipientAddress = { val: "", error: false };
      this.refundAddress.val = "";
      this.agree = "no";
      this.sendAmount = 0.01;
      this.destinationTag = "no";
      this.destinationTagValue = "";
      this.refundDestinationTag = "no";
      this.refundDestinationTagValue = "";
      this.$store.commit("gateway/set_createdTxnDetails", {});
      clearInterval(this.refreshTxnStatus);
      this.minMaxPair();
      this.clearAllintervals();
      this.getExchangeRate();
      this.validateFixedIsEnabled();
    },
    fixedCreateTxnValidation() {
      let previousTxnCreatedTime = localStorage.getItem("createdFixedTxnTime");
      if (!previousTxnCreatedTime) {
        return false;
      }
      let pdate = new Date(previousTxnCreatedTime);

      if (moment(pdate).format("L") === moment().format("L")) {
        pdate = pdate.setMinutes(pdate.getMinutes() + 15);
        const currentTime = new Date();
        const sub = pdate > currentTime;

        return sub;
      } else {
        return false;
      }
    },
    disableValidation() {
      let fixed_validation;
      if (
        this.exechangeRateType === "fixed" ||
        this.currentExchange === "quickex"
      ) {
        fixed_validation = this.isValidRefundAddress.result;
      } else {
        fixed_validation = true;
      }

      let receiveFund = "";
      let refundAdd = "";
      if (
        this.exechangeRateType === "float" &&
        this.currentExchange !== "quickex"
      ) {
        receiveFund = this.exchange_amount.amountTo;
        refundAdd = true;
      } else {
        refundAdd = this.refundAddress.val;
        receiveFund =
          this.exechangeRateType === "float"
            ? this.exchange_amount.amountTo
            : this.fixedExchangeRate.amountTo;
      }
      let destiniTag;
      if (this.destinationTag === "yes") {
        destiniTag = this.destinationTagValue;
      } else {
        destiniTag = true;
      }
      let refundDestiniTag;
      if (this.refundDestinationTag === "yes") {
        refundDestiniTag = this.refundDestinationTagValue;
      } else {
        refundDestiniTag = true;
      }

      return (
        this.sendAmount > 0 &&
        this.agree === "yes" &&
        receiveFund > 0 &&
        refundAdd &&
        this.recipientAddress.val &&
        this.isValidRecipientAddress.result &&
        fixed_validation &&
        destiniTag &&
        refundDestiniTag
      );
    },
    openExternalLink(url) {
      this.$gateway.send("core", "open_url", { url });
    },
    getExchangeRate() {
      clearInterval(this.refreshFloatExchangeRate);
      this.$store.commit("gateway/set_exchangeAmount", { result: [] });

      let data = {
        fromDetails: this.sendAmounType,
        toDetails: this.receiveAmountType,
        amountFrom: this.sendAmount,
        privacySwap: this.privacySwap
      };
      this.$gateway.send("swap", "exchange_amount", data);
      this.refreshFloatExchangeRate = setInterval(() => {
        this.$gateway.send("swap", "exchange_amount", data);
      }, 30000);
    },
    clearAllintervals() {
      clearInterval(this.refreshFixedExchangeRate);
      clearInterval(this.refreshFloatExchangeRate);
      if (this.routes !== "swapStatus" && this.routes !== "settlement") {
        clearInterval(this.refreshTxnStatus);
        this.refreshTxnStatus = null;
      }
      clearInterval(this.refreshMinMax);
    },

    getFixedExchangeAmount() {
      clearInterval(this.refreshFixedExchangeRate);

      this.$store.commit("gateway/set_fixedExchangeRate", { result: [] });
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        amountFrom: this.sendAmount,
        privacySwap: this.privacySwap
      };

      this.$gateway.send("swap", "fixed_exchange_amount", data);
      this.refreshFixedExchangeRate = setInterval(() => {
        this.$gateway.send("swap", "fixed_exchange_amount", data);
      }, 30000);
    },
    validateFixedIsEnabled() {
      if (
        this.sendAmounType.fixRateEnabled &&
        this.receiveAmountType.fixRateEnabled
      ) {
        this.getFixedExchangeAmount();
      }
    },
    exchangeData() {
      let result;
      if (this.exechangeRateType === "float") {
        result = this.exchange_amount;
      } else {
        result = this.fixedExchangeRate;
      }
      return result;
    },

    recipientAddressValidator(val) {
      this.recipientAddress.val = val;
      this.recipientLoader = true;

      this.$store.commit("gateway/set_validateAddress", {
        result: false
      });
      let params = {
        address: this.recipientAddress.val,
        currency: this.receiveAmountType.value,
        currencyNetWork: this.receiveAmountType.protocol,
        privacySwap: this.privacySwap
      };
      if (this.recipientAddress.val) {
        this.$gateway.send("swap", "validate_address", params);
      }
    },
    refundAddressValidator(val) {
      this.refundAddress.val = val;
      this.refundLoader = true;
      this.$store.commit("gateway/set_refundAddressValidation", {
        result: false
      });
      let params = {
        address: this.refundAddress.val,
        currency: this.sendAmounType.value,
        privacySwap: this.privacySwap,
        currencyNetWork: this.sendAmounType.protocol
      };
      if (this.refundAddress.val) {
        this.$gateway.send("swap", "refundAddressValidation", params);
      }
    },
    next() {
      let refundAdderss =
        this.exechangeRateType === "fixed" || this.currentExchange === "quickex"
          ? this.isValidRefundAddress.result
          : true;
      if (
        this.sendAmount > 0 &&
        this.agree === "yes" &&
        this.isValidRecipientAddress.result &&
        refundAdderss
      ) {
        this.routes = "makePayment";
        this.$gateway.send("wallet", "set_stepperPosition", {
          data: 3
        });
      } else {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: "please fill the inputs"
        });
      }
    },
    confirmPayment() {
      this.clearAllintervals();
      clearInterval(this.refreshMinMax);
      if (this.exechangeRateType === "float") {
        this.createtxn();
      } else {
        this.create_fixed_transaction();
      }
    },
    createtxn() {
      let data = {
        from: this.sendAmounType.value,
        networkFrom: this.sendAmounType.protocol,
        to: this.receiveAmountType.value,
        networkTo: this.receiveAmountType.protocol,
        address: this.recipientAddress.val,
        amountFrom: this.sendAmount,
        walletAddress: this.info.address,
        privacySwap: this.privacySwap,
        blockchainFrom: this.sendAmounType.blockchain || null,
        blockchainTo: this.receiveAmountType.blockchain || null
      };
      if (this.refundAddress && this.refundAddress.val) {
        data.refundAddress = this.refundAddress.val;
      }
      if (this.destinationTag === "yes") {
        data.extraId = this.destinationTagValue;
      }
      if (this.refundDestinationTag === "yes") {
        data.refundExtraId = this.refundDestinationTagValue;
      }
      this.$gateway.send("swap", "create_transaction", data);
      this.swaploading = true;
      this.navigation("settlement", 3);
    },
    create_fixed_transaction() {
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        address: this.recipientAddress.val,
        amountFrom: this.sendAmount,
        rateId: this.fixedExchangeRate.id,
        id: this.createdTxnDetails?.result?.id,
        privacySwap: this.privacySwap || false,
        walletAddress: this.info.address
      };
      if (this.destinationTag === "yes") {
        data.extraId = this.destinationTagValue;
      }
      if (this.refundDestinationTag === "yes") {
        data.refundExtraId = this.refundDestinationTagValue;
      }
      this.$gateway.send("swap", "create_fixed_transaction", data);
      this.swaploading = true;
      this.navigation("settlement", 3);
      localStorage.setItem("createdFixedTxnTime", new Date());
    },
    get_transaction_status(params) {
      const txnId =
        this.createdTxnDetails?.result?.id ||
        params?.id ||
        this.txnStatus?.result?.[0]?.id;
      if (!txnId) return;
      let data = {
        id: txnId,
        privacySwap: this.privacySwap || params?.privacySwap || false,
        walletAddress: this.info?.address
      };
      if (params?.exchange_type || params?.exchange) {
        data.exchange = params.exchange_type || params.exchange;
      }
      if (this.refreshTxnStatus) {
        clearInterval(this.refreshTxnStatus);
      }
      this.$gateway.send("swap", "transaction_status", data);
      this.refreshTxnStatus = setInterval(() => {
        this.$gateway.send("swap", "transaction_status", data);
      }, 30000);
    },
    getFeeAmount() {
      if (this.exchange_amount?.fee) {
        return Number(this.exchange_amount.fee).toFixed(8);
      }

      if (this.exchange_amount?.networkFee) {
        return "0";
      }

      return "--";
    }
  }
};
</script>

<style lang="scss">
// Swap. Legacy rules beaten here live in
// app.styl: `.swap`, `.txn-fee-details`, `.info-wrapper`, `.terms-condition`,
// `.destination-tag-wrapper`, `.box-input`, `.validMinMaxAmount-wrapper`,
// `.dropdown-send-type`, `.swap-btn`.
.beldex-app .swap {
  position: relative;
  // app.styl `.swap { height calc(100vh - 405px); overflow-y auto; card }`
  height: auto;
  min-height: 0 !important; // beats q-page's inline min-height
  padding: 0;
  overflow: visible;
  color: var(--beldex-text);
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  &__layout {
    display: flex;
    align-items: stretch;
    gap: var(--beldex-space-5);
  }

  // Maintenance: the panel fills the content area.
  &--fill {
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;

    .swap__layout {
      flex: 1 1 auto;
    }

    .swap__main {
      display: flex;
      flex-direction: column;
    }
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
    padding: var(--beldex-space-5);
    background-color: var(--beldex-panel-glass);
    border: 1px solid var(--beldex-border);
  }

  &__side {
    position: sticky;
    top: 0;
    flex: 0 0 clamp(320px, 28%, 400px);
    padding: var(--beldex-space-5);
    background-color: var(--beldex-panel-glass);
    border: 1px solid var(--beldex-border);
  }

  &__side-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    margin-bottom: var(--beldex-space-3);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__side-badge {
    padding: 4px var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-xs);
    letter-spacing: 0.5px;
    color: var(--beldex-text-muted);
    text-transform: uppercase;
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid var(--beldex-border);
  }

  &__side-title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    color: var(--beldex-text-strong);
  }

  &__refresh {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
    margin: 0 var(--beldex-space-4) 0 auto;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
  }

  &__pair {
    display: block;
  }

  &__stepper {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
    padding: var(--beldex-space-3) var(--beldex-space-4);
    margin-bottom: var(--beldex-space-5);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  &__step {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    letter-spacing: 0.5px;
    color: var(--beldex-text-muted);
    text-transform: uppercase;
    white-space: nowrap;

    &--active {
      color: var(--beldex-text);
    }
  }

  &__step-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 3px;
    font-size: 9px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border-strong);
  }

  // Spelled out: `&__a &__b` would repeat the `.beldex-app` prefix.
  .swap__step--active .swap__step-marker {
    font-weight: 700;
    color: #000;
    background-color: var(--beldex-accent);
    border-color: var(--beldex-accent);
  }

  .swap__step--done .swap__step-marker {
    color: var(--beldex-accent);
    background-color: var(--beldex-accent-bg);
    border-color: var(--beldex-accent-border);
  }

  &__step-line {
    flex: 1 1 auto;
    height: 1px;
    background-color: var(--beldex-divider);
  }

  header,
  .text-h6 {
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    color: var(--beldex-text-strong);
  }

  // Preview list: label left, value right, hairline rows.
  .txn-fee-details {
    width: 100%;
    border: 0;
    border-radius: 0;

    td {
      padding: var(--beldex-space-3) 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    td:nth-child(1) {
      width: auto;
      color: var(--beldex-text-muted);
      text-transform: uppercase;
      border-right: 0;
    }

    // Keep amounts whole ("11064.03 BDX"); a long translated label wraps
    // instead of pushing the value onto a second line mid-word.
    td:nth-child(2) {
      text-align: right;
      white-space: nowrap;
    }

    tr:nth-child(1) td {
      padding-top: var(--beldex-space-3);
    }

    tr:last-child td {
      padding-top: var(--beldex-space-5);
      color: var(--beldex-accent);
      font-weight: 700;
      border-top: 0;
      border-bottom: 0;
    }

    tr:last-child td:nth-child(1) {
      color: var(--beldex-text);
      font-weight: 400;
    }

    tr:last-child td:nth-child(2) {
      font-size: var(--beldex-text-lg);
    }

    .fixed-rate-hint {
      color: var(--beldex-text-faint);
    }
  }

  // "Minimum / Maximum amount" warning → red notice.
  .validMinMaxAmount-wrapper {
    width: 100%;
    padding: var(--beldex-space-3) var(--beldex-space-4);
    margin-top: var(--beldex-space-3);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-danger);
    background-color: var(--beldex-danger-wash);
    border: 1px solid var(--beldex-danger-border);
    border-radius: 0;
  }

  .swap-btn.q-btn {
    width: 36px;
    height: 36px;
    min-height: 36px;
    padding: 0;
    color: var(--beldex-text) !important;
    background-color: var(--beldex-panel) !important; // beats .bg-accent
    border: 1px solid var(--beldex-border-strong);
    border-radius: 0 !important;
  }

  .currency-btn {
    font-size: var(--beldex-text-md);
  }

  // Notes and hints.
  .info-wrapper,
  .destination-tag-wrapper {
    padding: var(--beldex-space-3) var(--beldex-space-4);
    font-size: var(--beldex-text-sm);
    line-height: 17px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);
    border-radius: 0;

    .hint {
      color: var(--beldex-text-muted);
    }
  }

  // Icon + text on one line with a small gap. The template still carries
  // percentage widths for the two cells; `!important` beats those inline
  // styles so the gap no longer grows with the box width.
  .info-wrapper {
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: var(--beldex-space-3);

    > div:first-child {
      flex: none;
      width: auto !important;
      padding-top: 2px !important;
    }

    > div:last-child {
      flex: 1;
      width: auto !important;
    }
  }

  .terms-condition {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    text-align: left;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text);

    a {
      color: var(--beldex-text);
      text-decoration: none;
      cursor: pointer;
    }
  }

  // Checkboxes: dark square with a hairline border; selected = green border
  // and a small green square (same mark as .beldex-check--on and the
  // Rate type options), instead of Quasar's filled tick.
  .q-checkbox {
    .q-checkbox__bg {
      background-color: #000;
      border: 1px solid var(--beldex-text-muted);
      border-radius: 0;
    }

    .q-checkbox__svg {
      display: none;
    }

    // Quasar's round hover/focus halo has no place in the square design.
    .q-checkbox__inner::before,
    .q-focus-helper {
      display: none;
    }

    .q-checkbox__inner--truthy .q-checkbox__bg,
    .q-checkbox__inner--indeterminate .q-checkbox__bg {
      background-color: #000 !important; // beats Quasar's filled `currentColor`
      border-color: var(--beldex-accent);

      &::after {
        content: "";
        position: absolute;
        top: 3px;
        right: 3px;
        bottom: 3px;
        left: 3px;
        background-color: var(--beldex-accent);
      }
    }
  }

  // Exchange amounts (You send / You get): large display figures.
  // Uses Conthrax via --beldex-font-display.
  .swap-amount {
    .q-field__control {
      height: 56px;
      min-height: 56px;
    }

    .q-field__native,
    .q-field__prefix {
      font-family: var(--beldex-font-display);
      font-size: 24px;
      line-height: 1;
      color: var(--beldex-text-strong);
    }

    .q-field__prefix {
      padding-right: var(--beldex-space-2);
    }

    // The "You get" input is disabled; Quasar dims `.q-field__control > div`
    // to 0.6 with !important, so restore full strength for the figure.
    .q-field--disabled .q-field__control > div {
      opacity: 1 !important;
    }

    .q-field--disabled .q-field__native,
    .q-field--disabled .q-field__prefix {
      opacity: 1;
      color: var(--beldex-text-strong);
    }
  }

  .box-input {
    padding: 0 var(--beldex-space-3);
    background-color: var(--beldex-input-bg);
    border: 0;
    border-bottom: 1px solid var(--beldex-border);
    border-radius: 0;
  }

  .address-wrapper .proto {
    padding: 2px var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    color: var(--beldex-text);
    background-color: var(--beldex-panel-raised);
    border-radius: 0;
  }

  // Currency picker trigger and list.
  .swap-amount .dropdown {
    display: flex;
    align-self: stretch;
  }

  .dropdown-send-type {
    gap: var(--beldex-space-3);
    height: 100%;
    min-height: 56px;
    padding: 0 var(--beldex-space-4);
    background-color: transparent;
    border-left: 1px solid var(--beldex-border);
    border-radius: 0;
    color: var(--beldex-text);

    .current-name {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    .currency-name {
      color: var(--beldex-text-muted) !important; // beats app.styl rule
    }

    .currency-coin {
      flex: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    // Monogram disc; background colour is set per coin by the component.
    .currency-coin--letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--beldex-font-mono);
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }
  }

  .optionView .innerWrapper {
    background-color: var(--beldex-panel-raised);
    border: 1px solid var(--beldex-border);
    border-radius: 0;
  }

  .search-input {
    background-color: transparent;
  }

  .q-btn.privacy-btn,
  .privacySwap {
    color: var(--beldex-text-muted);
  }

  // ---- Buttons in all swap pages: primary = white, secondary/accent = ghost.
  // Beats Quasar's `.bg-primary` / `.bg-accent` / `.bg-secondary` colours.
  .q-btn.bg-primary {
    color: var(--beldex-btn-primary-text) !important;
    background-color: var(--beldex-btn-primary-bg) !important;
    border-radius: 0 !important;
    box-shadow: none;
  }

  .q-btn.bg-accent,
  .q-btn.bg-secondary {
    color: var(--beldex-text) !important;
    background-color: var(--beldex-panel) !important;
    border: 1px solid var(--beldex-border);
    border-radius: 0 !important;
  }

  .q-btn:before {
    box-shadow: none !important;
  }

  // app.styl `.q-btn__content .block { color white !important }`
  .q-btn__content .block {
    color: inherit !important;
  }

  .q-btn__content {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    text-transform: none;
  }

  // ---- Checkout
  .confirmPayment {
    padding: 0;

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-4);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    &__title-wrap {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    &__title {
      margin: 0;
      font-family: var(--beldex-font-sans);
      font-size: var(--beldex-text-base);
      font-weight: 500;
      color: var(--beldex-text-strong);
    }

    &__badge {
      padding: 4px var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      color: var(--beldex-warning);
      text-transform: uppercase;
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
    }

    &__body {
      padding-top: var(--beldex-space-5);
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--beldex-space-4);
      margin-bottom: var(--beldex-space-5);
    }

    &__card,
    &__address,
    &__row {
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    &__card {
      padding: var(--beldex-space-4);
    }

    &__label {
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      color: var(--beldex-text-muted);
      text-transform: uppercase;
    }

    &__amount {
      margin: var(--beldex-space-2) 0;
      font-family: var(--beldex-font-display);
      font-size: 28px;
      line-height: 1.1;
      color: var(--beldex-text-strong);
      word-break: break-all;

      &--get {
        color: var(--beldex-accent);
      }
    }

    &__value {
      margin: var(--beldex-space-2) 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      font-weight: 700;
      color: var(--beldex-text-strong);
    }

    &__meta {
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
    }

    &__field {
      margin-bottom: var(--beldex-space-4);
    }

    &__address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-3);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      word-break: break-all;
    }

    &__copy.q-btn {
      flex: none;
      color: var(--beldex-accent);

      .q-icon {
        font-size: 14px;
      }
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-bottom: var(--beldex-space-4);

      .confirmPayment__value {
        margin: 0;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--beldex-space-3);
      margin-top: var(--beldex-space-8);
    }
  }

  // ---- Checkout: settlement + waiting-history (send funds to address)
  // app.styl `.txnSettlement .txn-fee-details` paints a navy block and
  // `.header-pair` / `.timer-wrapper` / `.warning-wrapper` use the old palette.
  .txnSettlement {
    padding: 0;
    color: var(--beldex-text);

    .header-txt {
      font-size: 14px;
      color: var(--beldex-text-strong);
    }

    .header-pair {
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
      border-radius: 0;
    }

    .fund-details-wrapper {
      .amount-wrapper {
        border-left-color: var(--beldex-hairline);
      }

      .label,
      .title {
        color: var(--beldex-text-muted);
      }

      .timer-wrapper {
        background-color: rgba(8, 8, 8, 0.8);
        border: 1px solid var(--beldex-hairline);
        border-radius: 0;

        .time-icon {
          color: var(--beldex-text-muted);
        }

        .hr-seperator {
          display: block;
          background-color: var(--beldex-hairline);
        }
      }
    }

    .recipt-address-wrapper .label {
      color: var(--beldex-text-muted);
    }

    .warning-wrapper {
      color: var(--beldex-warning);
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
      border-radius: 0;
    }

    .txn-fee-details {
      background-color: transparent;
      border: 1px solid var(--beldex-hairline);

      td {
        padding: var(--beldex-space-3) var(--beldex-space-4);
      }

      tr:nth-child(1) td {
        padding-top: var(--beldex-space-3);
      }

      tr:last-child td {
        border-bottom: 0;
      }
    }
  }

  // ---- Payment – awaiting deposit
  .swapPayment {
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-4);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    &__title-wrap {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    &__title {
      margin: 0;
      font-family: var(--beldex-font-sans);
      font-size: var(--beldex-text-base);
      font-weight: 600;
      color: var(--beldex-text-strong);
    }

    &__timer {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px var(--beldex-space-3);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      font-weight: 600;
      color: var(--beldex-warning);
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);

      &.is-expired {
        color: var(--beldex-danger);
        background-color: var(--beldex-danger-wash);
        border-color: var(--beldex-danger-border);
      }
    }

    &__expired {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-4);
      font-size: var(--beldex-text-md);
      color: var(--beldex-danger);
      background-color: var(--beldex-danger-wash);
      border: 1px solid var(--beldex-danger-border);
    }

    &__body {
      display: flex;
      align-items: flex-start;
      gap: var(--beldex-space-6);
      padding: var(--beldex-space-8) 0 var(--beldex-space-6);
    }

    // QR stays dark-on-light so it scans (plan §8.3).
    &__qr {
      flex: none;
      padding: var(--beldex-space-2); // quiet zone, QR needs a light margin
      line-height: 0;
      background-color: #fff;
    }

    &__info {
      flex: 1 1 auto;
      min-width: 0;
    }

    &__facts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--beldex-space-3) var(--beldex-space-8);
      margin-bottom: var(--beldex-space-4);
    }

    &__label {
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      color: var(--beldex-text-muted);
      text-transform: uppercase;
    }

    &__amount {
      margin-top: var(--beldex-space-1);
      font-family: var(--beldex-font-display);
      font-size: 28px;
      line-height: 1.1;
      color: var(--beldex-text-strong);
    }

    &__id,
    &__value {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-2);
      margin-top: var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      font-weight: 500;
      color: var(--beldex-text-strong);
      word-break: break-all;
    }

    &__id-copy.q-btn {
      color: var(--beldex-accent);

      .q-icon {
        font-size: 14px;
      }
    }

    &__address {
      margin: var(--beldex-space-2) 0 var(--beldex-space-4);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      word-break: break-all;
    }

    &__copy.q-btn {
      padding: 0 var(--beldex-space-4);
      min-height: 36px;

      .q-icon {
        font-size: 14px;
      }
    }

    &__warning {
      display: flex;
      align-items: center;
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-3);
    }

    &__status {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-2);
      padding: var(--beldex-space-4);
      margin-top: var(--beldex-space-6);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    &__status-dot {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: var(--beldex-warning);
    }
  }

  // ---- History
  // app.styl `.swapTxnHistory` sets th/td fonts, per-column widths and padding.
  .swapTxnHistory {
    .swapHistory__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-4);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    .swapHistory__title-wrap,
    .swapHistory__actions {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    .swapHistory__title {
      margin: 0;
      font-family: var(--beldex-font-sans);
      font-size: var(--beldex-text-base);
      font-weight: 500;
      color: var(--beldex-text-strong);
    }

    .swapHistory__count {
      padding: 3px var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      color: var(--beldex-text-muted);
      text-transform: uppercase;
      border: 1px solid var(--beldex-border);
    }

    .swapHistory__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 420px;
      text-align: center;
    }

    .swapHistory__empty-art {
      width: 200px;
      height: 140px;
      margin-bottom: var(--beldex-space-5);
    }

    .swapHistory__empty-title {
      margin: 0 0 10px;
      font-family: var(--beldex-font-sans);
      font-size: var(--beldex-text-base);
      font-weight: 600;
      line-height: 20px;
      color: var(--beldex-text);
    }

    .swapHistory__empty-hint {
      max-width: 380px;
      margin: 0 0 22px;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      line-height: 18px;
      color: var(--beldex-text-muted);
    }

    .swapHistory__empty-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--beldex-space-2);
      height: 32px;
      padding: 0 var(--beldex-space-3);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      font-weight: 700;
      line-height: 16px;
      color: var(--beldex-text);
      background-color: var(--beldex-panel);
      border: 1px solid var(--beldex-border);
      cursor: pointer;

      &:hover {
        border-color: var(--beldex-border-strong);
      }

      img {
        width: 14px;
        height: 14px;
      }
    }

    .swapHistory__csv.q-btn {
      min-height: 42px;
      padding: 0 var(--beldex-space-4);

      .q-icon {
        font-size: 16px;
      }
    }

    .txn-details-wrapper {
      border-collapse: collapse;

      th {
        padding: var(--beldex-space-4) var(--beldex-space-3);
        font-family: var(--beldex-font-mono) !important; // beats app.styl
        font-size: var(--beldex-text-xs);
        font-weight: 400;
        letter-spacing: 0.5px;
        color: var(--beldex-text-muted);
        text-transform: uppercase;
        border-bottom: 1px solid var(--beldex-divider);
      }

      td,
      td:nth-child(n) {
        width: auto;
        padding: 0 var(--beldex-space-3);
        height: 54px;
        font-family: var(--beldex-font-mono);
        font-size: var(--beldex-text-md);
        color: var(--beldex-text);
        border-bottom: 1px solid var(--beldex-hairline);
      }

      tr:hover td {
        background-color: var(--beldex-accent-bg);
      }
    }

    .swapHistory__muted {
      color: var(--beldex-text-muted);
    }

    .swapHistory__muted--accent {
      color: var(--beldex-accent);
    }

    td.swapHistory__strong,
    td.swapHistory__muted {
      font-weight: 400;
    }

    td.swapHistory__strong {
      font-weight: 700;
      color: var(--beldex-text-strong);
    }

    td.swapHistory__strong--done {
      color: var(--beldex-accent);
    }

    td.swapHistory__chevron {
      width: 32px;
      color: var(--beldex-text-muted);
      text-align: right;
    }

    .swapHistory__status {
      display: inline-block;
      padding: 3px var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid;

      &--done {
        color: var(--beldex-accent);
        background-color: var(--beldex-accent-bg);
        border-color: var(--beldex-accent-border-soft);
      }

      &--warn {
        color: var(--beldex-warning);
        background-color: var(--beldex-warning-wash);
        border-color: var(--beldex-warning-border);
      }

      &--danger {
        color: var(--beldex-danger);
        background-color: var(--beldex-danger-wash);
        border-color: var(--beldex-danger-border);
      }

      &--muted {
        color: var(--beldex-text-muted);
        background-color: rgba(235, 235, 235, 0.05);
        border-color: var(--beldex-border);
      }
    }

    .swapHistory__pager {
      justify-content: flex-end;
      margin-top: var(--beldex-space-5);
    }

    .page-btn {
      width: 36px;
      min-width: 36px;
      height: 36px;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      background: var(--beldex-panel);
      border: 1px solid var(--beldex-border);
      border-radius: 0;

      &.nav-btn {
        width: 56px;
        min-width: 56px;
      }

      &.active {
        color: #000 !important;
        background: var(--beldex-accent) !important;
        border-color: var(--beldex-accent);
      }

      &.q-btn--disabled {
        background: var(--beldex-panel);
      }
    }
  }

  // ---- Status and details
  .swapStatus,
  .swapTxnDetails {
    color: var(--beldex-text);

    .header-txt,
    .paid-status {
      font-size: 14px;
      color: var(--beldex-text-strong);
    }

    .txn-id-wrapper,
    .warning-wrapper {
      border-radius: 0;
    }

    .txn-id-wrapper {
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    .warning-wrapper {
      color: var(--beldex-warning);
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
    }

    .hr-seperator {
      background-color: var(--beldex-hairline);
    }
  }

  .swapDetails {
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-4);
      margin-bottom: var(--beldex-space-5);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    &__title-wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--beldex-space-3);
      min-width: 0;
    }

    &__back.q-btn {
      color: var(--beldex-text-strong);
    }

    &__title {
      margin: 0;
      font-size: var(--beldex-text-base);
      font-weight: 600;
      color: var(--beldex-text-strong);
    }

    &__id {
      display: inline-flex;
      align-items: center;
      gap: var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
    }

    &__id-value {
      color: var(--beldex-text-strong);
      font-weight: 600;
    }

    &__id-copy.q-btn {
      color: var(--beldex-accent);
    }

    &__status {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-bottom: var(--beldex-space-5);
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    &__status-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: var(--beldex-danger, #ff5a5a);
      background-color: rgba(255, 90, 90, 0.1);
      border: 1px solid rgba(255, 90, 90, 0.35);
    }

    &__status-title {
      font-size: var(--beldex-text-base);
      font-weight: 600;
      color: var(--beldex-text-strong);
    }

    &__status-desc {
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
    }

    &__amounts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--beldex-space-4);
      margin-bottom: var(--beldex-space-5);
    }

    &__tile {
      padding: var(--beldex-space-4);
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    &__label {
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      letter-spacing: 0.5px;
      color: var(--beldex-text-muted);
      text-transform: uppercase;
    }

    &__amount {
      margin-top: var(--beldex-space-1);
      font-family: var(--beldex-font-display);
      font-size: 24px;
      line-height: 1.2;
      color: var(--beldex-text-strong);
      word-break: break-all;

      &--accent {
        color: var(--beldex-accent);
      }
    }

    &__value {
      margin-top: var(--beldex-space-1);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      word-break: break-all;
    }

    &__row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--beldex-space-4);
    }

    &__hashes {
      display: flex;
      gap: var(--beldex-space-3);
    }

    &__hash.q-btn {
      color: var(--beldex-text-muted);
      border-color: var(--beldex-hairline);

      .q-icon {
        font-size: 16px;
      }
    }

    &__status-icon--ok {
      color: var(--beldex-accent);
      background-color: var(--beldex-accent-bg);
      border-color: var(--beldex-accent-border-soft);
    }

    &__address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-3);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-md);
      color: var(--beldex-text);
      word-break: break-all;
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
    }

    &__warning {
      display: flex;
      align-items: center;
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-4);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--beldex-space-3);
      margin-top: var(--beldex-space-6);

      &--split {
        justify-content: space-between;
      }
    }
  }

  .swapStatus {
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-4);
      margin-bottom: var(--beldex-space-5);
      border-bottom: 1px solid var(--beldex-hairline);
    }

    &__title-wrap {
      display: flex;
      align-items: center;
      gap: var(--beldex-space-3);
    }

    &__title {
      margin: 0;
      font-size: var(--beldex-text-base);
      font-weight: 600;
      color: var(--beldex-text-strong);
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: var(--beldex-space-2);
      padding: 2px var(--beldex-space-2);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-xs);
      text-transform: uppercase;
      color: var(--beldex-warning);
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
    }

    &__badge-dot {
      width: 6px;
      height: 6px;
      background-color: var(--beldex-warning);
    }

    &__steps {
      position: relative;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__step {
      position: relative;
      display: flex;
      gap: var(--beldex-space-4);
      padding-bottom: var(--beldex-space-5);

      // Connector to the next stage.
      &:not(:last-child)::before {
        content: "";
        position: absolute;
        top: 32px;
        bottom: 4px;
        left: 13px;
        width: 1px;
        background-color: var(--beldex-border-strong);
      }

      &--done:not(:last-child)::before {
        background-color: var(--beldex-accent-border);
      }
    }

    &__marker {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: var(--beldex-text-muted);
      background-color: var(--beldex-bg-tile);
      border: 1px solid var(--beldex-border);
    }

    .swapStatus__step--done .swapStatus__marker {
      color: var(--beldex-accent);
      background-color: var(--beldex-accent-bg-strong);
      border-color: var(--beldex-accent-border-soft);
    }

    .swapStatus__step--active .swapStatus__marker {
      color: var(--beldex-accent);
      background-color: var(--beldex-accent-bg);
      border-color: var(--beldex-accent);
    }

    &__step-title {
      font-size: var(--beldex-text-base);
      font-weight: 600;
      color: var(--beldex-text-strong);
    }

    .swapStatus__step--pending .swapStatus__step-title {
      color: var(--beldex-text-secondary);
    }

    &__step-desc {
      margin-top: 2px;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-muted);
    }

    &__link {
      display: inline-flex;
      align-items: center;
      gap: var(--beldex-space-1);
      margin-top: var(--beldex-space-3);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-secondary);
      cursor: pointer;

      &:hover {
        color: var(--beldex-text-strong);
      }
    }

    &__note {
      display: flex;
      align-items: flex-start;
      gap: var(--beldex-space-3);
      padding: var(--beldex-space-3) var(--beldex-space-4);
      margin-top: var(--beldex-space-4);
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      color: var(--beldex-text-secondary);
      background-color: var(--beldex-accent-bg);
      border: 1px solid var(--beldex-accent-border-soft);

      strong {
        color: var(--beldex-text-strong);
      }

      .q-icon {
        flex: none;
        margin-top: 1px;
      }

      .history-tag {
        color: var(--beldex-text);
        text-decoration: underline;
        cursor: pointer;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--beldex-space-3);
      margin-top: var(--beldex-space-6);
    }
  }

  // Order summary in the side panel while a swap is in flight.
  .swap__order {
    margin: 0;

    &-row {
      display: flex;
      justify-content: space-between;
      gap: var(--beldex-space-4);
      padding: var(--beldex-space-3) 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      border-bottom: 1px solid var(--beldex-hairline);

      dt {
        flex: none;
        font-weight: 400;
        text-transform: uppercase;
        color: var(--beldex-text-muted);
      }

      dd {
        min-width: 0;
        margin: 0;
        text-align: right;
        color: var(--beldex-text);
        overflow-wrap: anywhere;
      }

      &--stack {
        flex-direction: column;
        gap: var(--beldex-space-1);

        dd {
          text-align: left;
        }
      }

      &--total {
        padding-top: var(--beldex-space-5);
        border-bottom: 0;

        dt {
          color: var(--beldex-text);
        }

        dd {
          font-size: var(--beldex-text-lg);
          font-weight: 700;
          color: var(--beldex-accent);
        }
      }
    }
  }

  .SwapTxnCompeleted {
    color: var(--beldex-text);

    .header-txt {
      font-size: var(--beldex-text-base);
      color: var(--beldex-accent);
    }

    .header-pair {
      background-color: var(--beldex-warning-wash);
      border: 1px solid var(--beldex-warning-border);
      border-radius: 0;
    }

    .txn-id-wrapper {
      background-color: rgba(8, 8, 8, 0.8);
      border: 1px solid var(--beldex-hairline);
      border-radius: 0;
    }

    .receipt-wrapper .hr-seperator {
      background-color: var(--beldex-hairline);
    }

    .hash-btn,
    .action-btn {
      font-family: var(--beldex-font-mono) !important; // beats app.styl
      font-size: var(--beldex-text-md);
      border-radius: 0;
    }
  }

  .q-btn[disabled] {
    opacity: 0.5;
  }
}
</style>
