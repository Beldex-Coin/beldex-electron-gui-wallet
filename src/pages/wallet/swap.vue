<template>
  <q-page class="swap" style="min-height: unset">
    <q-inner-loading :showing="swaploading">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
    <div v-if="this.routes === 'mainPage'">
      <div class="flex row justify-between">
        <header class="text-h6 ft-bold">
          {{ this.$t("titles.swap.exchange") }}
        </header>

        <q-btn
          color="accent"
          class="history-btn"
          @click="routes = 'txnHistory'"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.6875 1.875C3.75713 1.875 3 2.63213 3 3.5625V12.375H2.4375C2.127 12.375 1.875 12.6266 1.875 12.9375V13.6875C1.875 15.0315 2.9685 16.125 4.3125 16.125H9.55298C9.3696 15.7732 9.22925 15.3956 9.1355 15H4.3125C3.58875 15 3 14.4113 3 13.6875V13.5H9.01904C9.04867 13.1104 9.12216 12.7335 9.23804 12.375H4.125V3.5625C4.125 3.25238 4.37738 3 4.6875 3H13.3125C13.6226 3 13.875 3.25238 13.875 3.5625V9C14.2627 9 14.6381 9.05 15 9.1355V3.5625C15 2.63213 14.2429 1.875 13.3125 1.875H4.6875ZM6.1875 4.875C6.03832 4.875 5.89524 4.93426 5.78975 5.03975C5.68426 5.14524 5.625 5.28832 5.625 5.4375C5.625 5.58668 5.68426 5.72976 5.78975 5.83525C5.89524 5.94074 6.03832 6 6.1875 6C6.33668 6 6.47976 5.94074 6.58525 5.83525C6.69074 5.72976 6.75 5.58668 6.75 5.4375C6.75 5.28832 6.69074 5.14524 6.58525 5.03975C6.47976 4.93426 6.33668 4.875 6.1875 4.875ZM8.0625 4.875C7.98796 4.87395 7.91396 4.88772 7.84479 4.91551C7.77562 4.94331 7.71266 4.98457 7.65958 5.03691C7.6065 5.08925 7.56435 5.15161 7.53557 5.22038C7.5068 5.28915 7.49199 5.36295 7.49199 5.4375C7.49199 5.51205 7.5068 5.58585 7.53557 5.65462C7.56435 5.72339 7.6065 5.78575 7.65958 5.83809C7.71266 5.89043 7.77562 5.93169 7.84479 5.95949C7.91396 5.98728 7.98796 6.00105 8.0625 6H11.8125C11.887 6.00105 11.961 5.98728 12.0302 5.95949C12.0994 5.93169 12.1623 5.89043 12.2154 5.83809C12.2685 5.78575 12.3107 5.72339 12.3394 5.65462C12.3682 5.58585 12.383 5.51205 12.383 5.4375C12.383 5.36295 12.3682 5.28915 12.3394 5.22038C12.3107 5.15161 12.2685 5.08925 12.2154 5.03691C12.1623 4.98457 12.0994 4.94331 12.0302 4.91551C11.961 4.88772 11.887 4.87395 11.8125 4.875H8.0625ZM6.1875 7.125C6.03832 7.125 5.89524 7.18426 5.78975 7.28975C5.68426 7.39524 5.625 7.53832 5.625 7.6875C5.625 7.83668 5.68426 7.97976 5.78975 8.08525C5.89524 8.19074 6.03832 8.25 6.1875 8.25C6.33668 8.25 6.47976 8.19074 6.58525 8.08525C6.69074 7.97976 6.75 7.83668 6.75 7.6875C6.75 7.53832 6.69074 7.39524 6.58525 7.28975C6.47976 7.18426 6.33668 7.125 6.1875 7.125ZM8.0625 7.125C7.98796 7.12395 7.91396 7.13772 7.84479 7.16551C7.77562 7.19331 7.71266 7.23457 7.65958 7.28691C7.6065 7.33925 7.56435 7.40161 7.53557 7.47038C7.5068 7.53915 7.49199 7.61295 7.49199 7.6875C7.49199 7.76205 7.5068 7.83585 7.53557 7.90462C7.56435 7.97339 7.6065 8.03575 7.65958 8.08809C7.71266 8.14043 7.77562 8.18169 7.84479 8.20949C7.91396 8.23728 7.98796 8.25105 8.0625 8.25H11.8125C11.887 8.25105 11.961 8.23728 12.0302 8.20949C12.0994 8.18169 12.1623 8.14043 12.2154 8.08809C12.2685 8.03575 12.3107 7.97339 12.3394 7.90462C12.3682 7.83585 12.383 7.76205 12.383 7.6875C12.383 7.61295 12.3682 7.53915 12.3394 7.47038C12.3107 7.40161 12.2685 7.33925 12.2154 7.28691C12.1623 7.23457 12.0994 7.19331 12.0302 7.16551C11.961 7.13772 11.887 7.12395 11.8125 7.125H8.0625ZM6.1875 9.375C6.03832 9.375 5.89524 9.43426 5.78975 9.53975C5.68426 9.64524 5.625 9.78832 5.625 9.9375C5.625 10.0867 5.68426 10.2298 5.78975 10.3352C5.89524 10.4407 6.03832 10.5 6.1875 10.5C6.33668 10.5 6.47976 10.4407 6.58525 10.3352C6.69074 10.2298 6.75 10.0867 6.75 9.9375C6.75 9.78832 6.69074 9.64524 6.58525 9.53975C6.47976 9.43426 6.33668 9.375 6.1875 9.375ZM8.0625 9.375C7.752 9.375 7.5 9.62663 7.5 9.9375C7.5 10.2484 7.752 10.5 8.0625 10.5H10.3623C10.8108 10.0331 11.3498 9.6539 11.9531 9.39478C11.9078 9.38315 11.8612 9.375 11.8125 9.375H8.0625ZM13.875 9.75C11.5969 9.75 9.75 11.5969 9.75 13.875C9.75 16.1531 11.5969 18 13.875 18C16.1531 18 18 16.1531 18 13.875C18 11.5969 16.1531 9.75 13.875 9.75ZM12.375 11.25H15.375C15.5824 11.25 15.75 11.418 15.75 11.625C15.75 11.832 15.5824 12 15.375 12V12.75C15.375 13.2 15.1714 13.5997 14.8564 13.875C15.1714 14.1503 15.375 14.55 15.375 15V15.75C15.5824 15.75 15.75 15.918 15.75 16.125C15.75 16.332 15.5824 16.5 15.375 16.5H15H12.75H12.375C12.1676 16.5 12 16.332 12 16.125C12 15.918 12.1676 15.75 12.375 15.75V15C12.375 14.55 12.5786 14.1503 12.8936 13.875C12.5786 13.5997 12.375 13.2 12.375 12.75V12C12.1676 12 12 11.832 12 11.625C12 11.418 12.1676 11.25 12.375 11.25ZM13.125 12V12.75H14.625V12H13.125ZM13.875 14.25C13.4614 14.25 13.125 14.5864 13.125 15V15.6042L13.7563 15.394C13.8332 15.3685 13.9168 15.3685 13.9937 15.394L14.625 15.6042V15C14.625 14.5864 14.2886 14.25 13.875 14.25Z"
              fill="white"
            />
          </svg>
          <span class="q-ml-xs">{{ this.$t("titles.swap.history") }}</span>
        </q-btn>
      </div>

      <section class="flex row justify-between">
        <article style="width: 49%">
          <OxenField
            class="q-mt-md ft-regular"
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
            <!-- <q-btn class="currency-btn dropdown-send-type" @click="isVisible=true" >
              <div v-html="sendAmounType.label"></div>
            </q-btn>-->

            <!-- <q-select
              v-model="sendAmounType"
              :options="
                currencyList.filter(item => item.enabledFrom && item.enabled)
              "
              borderless
              dense
              class="ft-semibold q-pl-sm dropdown-send-type"
              popup-content-class="exchage-option"
              dropdown-icon="expand_more"
              :menu-offset="[170, 10]"
              @input="value => sendAmountValidator(value)"
            >
              <template v-slot:option="scope">
            
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section class="swapdropDown-option">
                    <q-img
                      class="q-mr-sm"
                      :src="scope.opt.image"
                      style="
                        height: 20px;
                        max-width: 20px;
                        filter: grayscale(150);
                      "
                    />
                    <q-item-label class="ft-bold q-mr-xs"
                      >{{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label class="currency-name ft-regular">
                      - {{ scope.opt.fullName }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>-->
          </OxenField>

          <!-- <div class="optionView">
            <div class="innerWrapper q-px-lg">
              
              <OxenField class="q-mt-md ft-regular" label="Search">
                <input
                  :value="searchTxt"
                  class="search-input"
                  @input="(event) => this.searchCurrency(event.target.value)"
                />
              </OxenField>
              <div
                v-for="currency in this.filtercurrency"
                :key="currency.value"
                @click="sendAmountValidator(currency)"
              >
                <q-item-section
                  class="swapdropDown-option q-mt-md"
                  v-if="currency.enabledFrom && currency.enabled"
                >
                  <q-img
                    class="q-mr-sm"
                    :src="currency.image"
                    style="
                      height: 20px;
                      max-width: 20px;
                      filter: grayscale(150);
                    "
                  />
                  <q-item-label class="ft-bold q-mr-xs"
                    >{{ currency.name }}
                  </q-item-label>
                  <q-item-label class="currency-name ft-regular">
                    - {{ currency.fullName }}</q-item-label
                  >
                </q-item-section>
              </div>
            </div>
          </div>-->

          <div
            v-if="
              this.minMaxWarningContent === 'min' ||
                this.minMaxWarningContent === 'max' ||
                (this.pairsMinMax?.from && !this.pairsMinMax?.minAmountFloat)
            "
            class="q-mt-sm validMinMaxAmount-wrapper"
          >
            <span
              v-if="
                this.pairsMinMax?.from &&
                  this.pairsMinMax?.to &&
                  !this.pairsMinMax?.minAmountFloat
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
          <div v-else class="flex justify-end">
            <q-btn
              color="accent"
              class="swap-btn q-mt-sm"
              :disable="
                !sendAmounType.enabledTo || !receiveAmountType.enabledFrom
              "
              @click="swapCurrencyType"
            >
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  id="icons8-sorting_arrows_horizontal 1"
                  clip-path="url(#clip0_81_8938)"
                >
                  <path
                    id="Vector"
                    d="M2.53125 4.24068C2.53125 4.58443 2.73948 4.89183 3.05679 5.02404C3.3774 5.15294 3.74098 5.07692 3.98227 4.82903L5.92247 2.88882L5.92248 15.2308L7.61478 15.2308L7.61478 2.88882L9.55499 4.82903C9.76653 5.05048 10.0838 5.13972 10.378 5.0604C10.6755 4.98437 10.9069 4.753 10.9829 4.45553C11.0622 4.16136 10.973 3.84405 10.7515 3.63251L7.36689 0.247896C7.03636 -0.0826323 6.5009 -0.0826322 6.17037 0.247896L2.78576 3.63251C2.62049 3.79117 2.53125 4.00931 2.53125 4.24068ZM5.92248 22L7.61478 22L7.61478 20.3077L5.92248 20.3077L5.92248 22ZM5.92248 18.6154L7.61478 18.6154L7.61478 16.9231L5.92248 16.9231L5.92248 18.6154ZM10.9895 17.7858C10.9961 18.0072 11.0886 18.2154 11.2473 18.3675L14.6319 21.7521C14.9624 22.0826 15.4979 22.0826 15.8284 21.7521L19.213 18.3675C19.4345 18.1559 19.5237 17.8386 19.4444 17.5445C19.3684 17.247 19.137 17.0156 18.8395 16.9396C18.5454 16.8603 18.2281 16.9495 18.0165 17.171L16.0763 19.1112L16.0763 6.76923L14.384 6.76923L14.384 19.1112L12.4438 17.171C12.1992 16.9198 11.829 16.8471 11.5084 16.9826C11.1845 17.1181 10.9796 17.4354 10.9895 17.7858ZM14.384 5.07692L16.0763 5.07692L16.0763 3.38461L14.384 3.38461L14.384 5.07692ZM14.384 1.69231L16.0763 1.69231L16.0763 -5.92074e-07L14.384 -5.18101e-07L14.384 1.69231Z"
                    fill="#A9A9CD"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_81_8938">
                    <rect
                      width="22"
                      height="22"
                      fill="white"
                      transform="translate(0 22) rotate(-90)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </q-btn>
          </div>

          <OxenField class="ft-regular" :label="$t('titles.swap.youGet')">
            <q-input
              v-if="this.exechangeRateType === 'float'"
              v-model="this.exchange_amount.amountTo"
              borderless
              dense
              :placeholder="0"
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
            <!-- <q-select
              v-model="receiveAmountType"
              :options="currencyList.filter((item) => item.enabledTo)"
              borderless
              dense
              :menu-offset="[170, 10]"
              :options-html="receiveAmountType"
              class="ft-semibold q-pl-sm dropdown-send-type"
              popup-content-class="exchage-option"
              dropdown-icon="expand_more"
              @input="(value) => getAmountValidator(value)"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section class="swapdropDown-option">
                    <q-img
                      class="q-mr-sm"
                      :src="scope.opt.image"
                      style="
                        height: 20px;
                        max-width: 20px;
                        filter: grayscale(150);
                      "
                    />
                    <q-item-label class="ft-bold q-mr-xs"
                      >{{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label class="currency-name ft-regular">
                      - {{ scope.opt.fullName }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>-->
          </OxenField>
        </article>
        <article style="width: 48%">
          <div class="ft-semibold" style="margin-top: 14px; margin-bottom: 9px">
            {{ this.$t("titles.swap.transactionDetails") }}
          </div>
          <table style="width: 100%" class="txn-fee-details">
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
                ~
                {{
                  exchange_amount.rate
                    ? Number(exchange_amount.rate).toFixed(8)
                    : "..."
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
                      : "..."
                  }}
                  {{ this.receiveAmountType.name }}
                </span>
                <br />
                <span class="fixed-rate-hint">{{
                  this.$t("titles.swap.fixedRateUpdateSec")
                }}</span>
              </td>
            </tr>
            <tr v-if="this.exechangeRateType == 'float'">
              <td>{{ this.$t("titles.swap.serviceFee") }}</td>
              <td class="uppercase">
                {{
                  exchange_amount.fee
                    ? Number(exchange_amount.fee).toFixed(8)
                    : "..."
                }}
                {{ this.receiveAmountType.name }}
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
                    : "..."
                }}
                {{ this.receiveAmountType.name }}
              </td>
            </tr>
            <tr>
              <td>{{ this.$t("titles.swap.youGet") }}</td>
              <td v-if="this.exechangeRateType === 'float'" class="uppercase">
                ~
                {{
                  exchange_amount.amountTo
                    ? Number(exchange_amount.amountTo)
                    : "..."
                }}
                {{ this.receiveAmountType.name }}
              </td>
              <td v-else class="uppercase">
                {{
                  fixedExchangeRate.amountTo
                    ? Number(fixedExchangeRate.amountTo).toFixed(8)
                    : "..."
                }}
                {{ this.receiveAmountType.name }}
              </td>
            </tr>
          </table>
        </article>
      </section>
      <!-- <section>
        <article
          v-if="
            this.sendAmounType.hasOwnProperty('notifications')
              ? this.sendAmounType.notifications.payin
              : false
          "
          class="flex row info-wrapper q-my-md"
        >
          <div style="width: 4%; padding-top: 5px" class="flex justify-center">
            <q-icon name="o_info" size="14px" />
          </div>
          <div style="width: 95%">
            {{ this.sendAmounType.notifications.payin }}
          </div>
        </article>
        <article
          v-if="
            this.receiveAmountType.hasOwnProperty('notifications')
              ? this.receiveAmountType.notifications.payout
              : false
          "
          class="flex row info-wrapper q-my-md"
        >
          <div style="width: 4%; padding-top: 5px" class="flex justify-center">
            <q-icon name="o_info" size="14px" />
          </div>
          <div style="width: 95%">
            {{ this.receiveAmountType.notifications.payout }}
          </div>
        </article>
      </section>
      <section
        v-if="
          this.receiveAmountType.fixRateEnabled &&
            this.sendAmounType.fixRateEnabled
        "
        class="exerate-wrapper q-mt-md"
      >
        <article
          :class="
            `flex row exerate-inner-wrapper q-py-md ${
              this.exechangeRateType === 'float' ? 'active' : ''
            }`
          "
          @click="(exechangeRateType = 'float'), (refundAddress.val = '')"
        >
          <div class="col-1 flex justify-center items-center">
            <span class="flex justify-center items-center icon" style>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icons8-padlock 1">
                  <path
                    id="Vector"
                    d="M12 1C14.8722 1 17.2811 3.04615 17.877 5.78711L15.9219 6.21289C15.5177 4.35385 13.9278 3 12 3C9.72381 3 8 4.72381 8 7V8H18C19.1 8 20 8.9 20 10V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10C4 8.9 4.9 8 6 8V7C6 3.67619 8.67619 1 12 1ZM12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13Z"
                    fill="#A9A9CD"
                  />
                </g>
              </svg>
            </span>
          </div>
          <div class="col-10 flex items-center justify-between">
            <span class="ft-semibold content">{{
              this.$t("titles.swap.floatingExchangeRate")
            }}</span>
            <br />
            <span>
              ~
              {{
                exchange_amount.rate
                  ? Number(exchange_amount.amountTo).toFixed(8)
                  : ""
              }}
            </span>
          </div>
        </article>

        <article
          :class="
            ` exerate-inner-wrapper q-py-md q-mt-sm ${
              this.exechangeRateType === 'fixed' ? 'active' : ''
            }`
          "
          :style="{
            cursor:
              this.sendAmount <= Number(this.pairsMinMax.minAmountFixed) ||
              this.sendAmount >= Number(this.pairsMinMax.maxAmountFixed)
                ? 'not-allowed'
                : ''
          }"
          @click="
            () => {
              this.sendAmount > Number(this.pairsMinMax.minAmountFixed) &&
              this.sendAmount < Number(this.pairsMinMax.maxAmountFixed) &&
              !this.fixedCreateTxnValidation()
                ? (exechangeRateType = 'fixed')
                : '';
            }
          "
        >
          <div class="flex row">
            <div class="col-1 flex justify-center items-center">
              <span class="flex justify-center items-center icon" style>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="icons8-lock 3">
                    <path
                      id="Vector"
                      d="M12 1C8.67619 1 6 3.67619 6 7V8C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8V7C18 3.67619 15.3238 1 12 1ZM12 3C14.2762 3 16 4.72381 16 7V8H8V7C8 4.72381 9.72381 3 12 3ZM12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13Z"
                      fill="#A9A9CD"
                    />
                  </g>
                </svg>
              </span>
            </div>
            <div class="col-10 flex items-center justify-between">
              <span class="ft-semibold content">{{
                this.$t("titles.swap.fixedExchangeRate")
              }}</span>
              <br />
              <span>
                {{
                  fixedExchangeRate.result
                    ? Number(fixedExchangeRate.amountTo).toFixed(8)
                    : ""
                }}
              </span>
            </div>
          </div>

          <div v-if="this.fixedCreateTxnValidation()" class="warningMsg">
            {{ this.$t("titles.swap.stillProcessing") }}
          </div>
          <div
            v-if="
              this.sendAmount < this.pairsMinMax.minAmountFixed &&
                !this.fixedCreateTxnValidation()
            "
            class="warningMsg"
          >
            {{ this.$t("titles.swap.minimumExchangeAmtAbove") }}
            {{ Number(this.pairsMinMax.minAmountFixed) }}
            {{ this.$t("titles.swap.for") }}
            <span class="uppercase">{{ this.sendAmounType.ticker }}</span>
          </div>
          <div
            v-if="
              this.sendAmount > Number(this.pairsMinMax.maxAmountFixed) &&
                !this.fixedCreateTxnValidation()
            "
            class="warningMsg"
          >
            {{ this.$t("titles.swap.maximumExchangeAmtUnder") }}
            {{ this.pairsMinMax.maxAmountFixed }}
            {{ this.$t("titles.swap.for") }}
            <span class="uppercase">{{ this.sendAmounType.ticker }}</span>
          </div>
        </article>
      </section> -->

      <div class="flex row info-wrapper q-mt-md">
        <div style="width: 4%; padding-top: 5px" class="flex justify-center">
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

      <OxenField
        class="q-mt-md ft-regular address-wrapper"
        :label="$t('fieldLabels.recipientAddress')"
        :error="this.recipientAddress.error"
        error-label="Invalid Address"
      >
        <div class="q-pr-sm">
          <span class="proto ft-semibold">{{
            this.receiveAmountType.protocol
          }}</span>
        </div>
        <!-- @blur="() => this.recipientAddressValidator()" -->
        <q-input
          :value="recipientAddress.val"
          borderless
          dense
          :placeholder="
            `Enter your ${this.receiveAmountType.name} recipient address`
          "
          @input="val => this.recipientAddressValidator(val)"
        />
        <q-spinner v-if="this.recipientLoader" color="primary" size="2em" />
      </OxenField>
      <div
        v-if="
          // this.exechangeRateType === 'float' &&
          this.receiveAmountType.hasOwnProperty('extraIdName')
        "
        class="destination-tag-wrapper q-mt-md"
      >
        <span class="ft-Light hint">
          Please specify the {{ this.receiveAmountType.extraIdName }} for your
          <span class="uppercase">{{ this.receiveAmountType.value }}</span>
          receiving address if your wallet provides it. Your transaction will
          not go through if you omit it. If your wallet doesn’t require a
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
        <span
          >{{ this.$t("titles.swap.myWalletRequire") }}
          {{ this.receiveAmountType.extraIdName }}</span
        >
      </div>

      <q-input
        v-if="destinationTag === 'yes'"
        v-model="destinationTagValue"
        class="box-input"
        :placeholder="`Enter ${this.receiveAmountType.extraIdName}`"
        borderless
        dense
      />
      <article v-if="this.exechangeRateType === 'fixed'">
        <OxenField
          class="q-mt-md ft-regular address-wrapper"
          label="Refund wallet Address"
          :error="this.refundAddress.error"
          error-label="Please enter valid address"
        >
          <div class="q-pr-sm">
            <span class="proto ft-semibold">{{
              this.sendAmounType.protocol
            }}</span>
          </div>
          <q-input
            :value="refundAddress.val"
            borderless
            dense
            :placeholder="
              `Enter your ${this.sendAmounType.name} recipient address`
            "
            @input="val => this.refundAddressValidator(val)"
          />
          <q-spinner v-if="this.refundLoader" color="primary" size="2em" />
        </OxenField>
      </article>

      <div
        v-if="
          this.exechangeRateType === 'fixed' &&
            this.sendAmounType.hasOwnProperty('extraIdName')
        "
        class="destination-tag-wrapper q-mt-md"
      >
        <span class="ft-Light hint">
          Please specify the {{ this.sendAmounType.extraIdName }} for your
          <span class="uppercase">{{ this.sendAmounType.value }}</span>
          receiving address if your wallet provides it. Your transaction will
          not go through if you omit it. If your wallet doesn’t require a
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
        <span
          >{{ this.$t("titles.swap.myWalletRequire") }}
          {{ this.sendAmounType.extraIdName }}</span
        >
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
          <a @click="openExternalLink('https://changelly.com/terms-of-use')">{{
            this.$t("titles.swap.termOfUse")
          }}</a>
          {{ this.$t("titles.swap.and") }}
          <a
            @click="openExternalLink('https://changelly.com/privacy-policy')"
            >{{ this.$t("titles.swap.privacyPolicy") }}</a
          >
          <!-- <a href>AML/KYC</a> -->
        </span>
      </div>

      <div class="flex justify-center q-my-lg">
        <q-btn
          label="Next"
          color="primary"
          :disable="!this.disableValidation()"
          @click="this.next"
        />
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
      @goback="navigation('mainPage', 1)"
      @submit="confirmPayment"
    />
    <SwapTxnHistory
      v-if="this.routes === 'txnHistory'"
      @goback="
        () => {
          navigation('mainPage', 1), clearState();
        }
      "
    />
    <SwapTxnSettlement
      v-if="this.routes === 'settlement' && createdTxnDetails.status"
      :created-txn-details="createdTxnDetails.result"
      :floating-rate="this.exchange_amount"
      :fixed-rate="this.fixedExchangeRate"
      :receive-chain-details="this.receiveAmountType"
      :send-chain-details="this.sendAmounType"
      @clearAllintervals="clearAllintervals"
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

    <SwapUnderMaintenance v-if="this.routes === 'maintenance'" />
  </q-page>
</template>

<script>
const moment = require("moment");

import { required, decimal } from "vuelidate/lib/validators";
import OxenField from "components/oxen_field";
import SwapConfirmPayment from "./swapConfirmPayment.vue";
import SwapTxnHistory from "./swapTxnHistory.vue";
import SwapTxnSettlement from "./swapTxnSettlement.vue";
import swapStatus from "./swapStatus.vue";
import SwapTxnCompeleted from "./swapTxnCompeleted.vue";
import SwapUnderMaintenance from "./swapUnderMaintenance.vue";
import { mapState } from "vuex";
import Dropdown from "./currencyDropDown.vue";

export default {
  components: {
    OxenField,
    SwapConfirmPayment,
    SwapTxnHistory,
    SwapTxnSettlement,
    swapStatus,
    SwapTxnCompeleted,
    SwapUnderMaintenance,
    Dropdown
  },
  watch: {
    // whenever question changes, this function will run
    isValidRecipientAddress(newisValidRecipientAddress) {
      // console.log('newisValidRecipientAddress',newisValidRecipientAddress)
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
      // console.log("isValidRefundAddress  fn", isValidRefundAddress);
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
      // this.getFixedExchangeAmount();
    },
    pairsMinMax() {
      this.minMaxAmoutValidator(this.sendAmount);
    },
    currencyList(newValue) {
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
        let btcCoin = newValue.find(item => item.name === "BTC");
        let bdxCoin = newValue.find(item => item.name === "BDX");
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

          this.minMaxPair();
          this.clearAllintervals();
          this.getExchangeRate();
          this.validateFixedIsEnabled();

          // this.getFixedExchangeAmount();
        } else {
          // let EthDetails = newValue.find(item => item.name === "ETH");
          // this.receiveAmountType = EthDetails;
          this.navigation("maintenance", 1);
        }
      }
    },

    createdTxnDetails(newTxn) {
      if (newTxn.result) {
        // console.log("newTxn ", newTxn);
        this.swaploading = false;
        this.get_transaction_status();
      }
    },
    txnStatus(newStatus) {
      if (newStatus.hasOwnProperty("result")) {
        // console.log("txnStatustxnStatus ", newStatus);
        if (newStatus.result[0].status === "finished") {
          this.clearAllintervals();
          this.navigation("txnCompleted", 5);
        }
        if (
          newStatus.result[0].status === "confirming" ||
          newStatus.result[0].status === "exchanging"
        ) {
          // console.log("txnStatustxnStatus 2", newStatus.result[0].status);
          this.navigation("swapStatus", 4);
        }
      }
    }
  },

  computed: mapState({
    currencyList: state => {
      let data = state.gateway.currencyList.result;
      let pushedData = [];
      if (data) {
        Object.keys(data).length > 0 &&
          data.map(item => {
            (item.label = `${item.name}<span class='currency-name ft-regular'> -${item.fullName}<span>`),
              (item.value = item.ticker);
            pushedData.push(item);
          });
      }
      // console.log("data coin::", JSON.stringify(pushedData));
      return pushedData;
    },

    exchange_amount: state => {
      let data = state.gateway.exchangeAmount;
      let result = {};
      if (data.hasOwnProperty("result")) {
        if (state.gateway.exchangeAmount.status) {
          result = state.gateway.exchangeAmount.result[0];
        }
      }
      return result;
    },
    fixedExchangeRate: state => {
      let data = state.gateway.fixedExchangeRate;
      let result = {};
      if (data.hasOwnProperty("result")) {
        result = state.gateway.fixedExchangeRate.result[0];
        // console.log("fixedExchangeRate ::", result);
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
      if (data.hasOwnProperty("result")) {
        result = state.gateway.pairsMinMax.result[0];
      }
      return result;
    },
    info: state => state.gateway.wallet.info
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
  data() {
    return {
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
      // routes: "",

      exechangeRateType: "float",
      recipientAddress: { error: false, val: "" },
      refreshFixedExchangeRate: "",
      refreshFloatExchangeRate: "",
      refreshTxnStatus: "",
      minMaxWarningContent: "",
      bdxCoinDetails: {},
      btcCoinDetails: {},
      sendAmounType: {
        label:
          "<span>BTC<span class='currency-name ft-regular'> -Bitcoin<span><span>",
        value: "btc"
      },
      // receiveAmountType: {
      //   label: "BDX<span class='currency-name ft-regular'> -Beldex<span>",
      //   value: "bdx"
      // },
      // receiveAmountType: {
      //   label: "ETH<span class='currency-name ft-regular'> -Etherium<span>",
      //   value: "eth"
      // },
      receiveAmountType: {
        label: "",
        value: ""
      },
      sendAmounTypeOption: "",
      swaploading: true,
      searchTxt: "",
      recipientLoader: false,
      refundLoader: false,
      privacyCurrency: []
      // pairStatusContent:''
    };
  },
  created() {
    this.$gateway.send("swap", "currency_list", {});
  },

  beforeDestroy() {
    clearInterval(this.refreshFixedExchangeRate);
    clearInterval(this.refreshFloatExchangeRate);
    clearInterval(this.refreshTxnStatus);
  },
  methods: {
    navigation(page, step) {
      this.$gateway.send("wallet", "set_stepperPosition", {
        data: step
      });
      this.routes = page;
    },
    minMaxPair() {
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value
      };
      this.$gateway.send("swap", "get_min_max", data);
    },
    searchCurrency(txt) {
      // console.log("searchCurrency searchCurrency searchCurrency", txt);
      this.searchTxt = txt;
      if (this.searchTxt) {
        this.filtercurrency = this.currencyList.filter(item =>
          item.value.includes(this.searchTxt)
        );
      } else {
        this.filtercurrency = this.currencyList;
      }
      // console.log("searchCurrency ::", txt);
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
    sendAmountValidator() {
      this.refundAddress = { val: "", error: false };
      this.refundDestinationTag = "no";
      this.refundDestinationTagValue = "";

      if (
        this.sendAmounType.value === "bdx" &&
        this.receiveAmountType.value === "bdx"
      ) {
        this.receiveAmountType = this.btcCoinDetails;
      } else if (this.sendAmounType.value === this.receiveAmountType.value) {
        // this.sendAmounType = this.bdxCoinDetails;
        this.receiveAmountType = this.bdxCoinDetails;
      }
      // else if (this.sendAmounType.value !== "bdx") {
      //   this.receiveAmountType = this.bdxCoinDetails;
      // }
      // else if (this.sendAmounType.value !== "bdx") {
      //   this.receiveAmountType= this.bdxCoinDetails;
      // }
      this.minMaxPair();

      // if (this.exechangeRateType === "float") {
      this.clearAllintervals();
      this.getExchangeRate();
      // } else {
      // this.getFixedExchangeAmount();

      if (
        this.sendAmounType.fixRateEnabled &&
        this.receiveAmountType.fixRateEnabled
      ) {
        this.getFixedExchangeAmount();
      } else {
        this.exechangeRateType = "float";
        // clearInterval(this.refreshFixedExchangeRate);
      }
      // }
      // this.getExchangeRate();
    },
    getAmountValidator() {
      // console.log('getAmountValidator in swap',this.sendAmounType.value, this.receiveAmountType.value)
      this.recipientAddress = { val: "", error: false };
      this.refundAddress = { val: "", error: false };
      this.destinationTag = "no";
      this.destinationTagValue = "";
      // this.recipientAddress.error = false;

      if (
        this.sendAmounType.value === "bdx" &&
        this.receiveAmountType.value === "bdx"
      ) {
        // console.log('bdx =')
        this.sendAmounType = this.btcCoinDetails;
      } else if (this.sendAmounType.value === this.receiveAmountType.value) {
        this.sendAmounType = this.bdxCoinDetails;
        // this.receiveAmountType = this.bdxCoinDetails;
      }
      //else if (this.receiveAmountType !== "bdx") {
      //this.sendAmounType = this.bdxCoinDetails;
      //}
      this.minMaxPair();
      // if (this.exechangeRateType === "float") {
      this.clearAllintervals();
      this.getExchangeRate();
      // } else {
      // this.getFixedExchangeAmount();
      // }
      if (
        this.sendAmounType.fixRateEnabled &&
        this.receiveAmountType.fixRateEnabled
      ) {
        this.getFixedExchangeAmount();
      } else {
        this.exechangeRateType = "float";
        // clearInterval(this.refreshFixedExchangeRate);
      }
    },
    swapCurrencyType() {
      [this.sendAmounType, this.receiveAmountType] = [
        this.receiveAmountType,
        this.sendAmounType
      ];
      // this.recipientAddress.val = '';
      // this.recipientAddress.error = false;
      this.destinationTagValue = "";
      this.refundDestinationTagValue = "";
      this.recipientAddress = { val: "", error: false };
      this.refundAddress = { val: "", error: false };

      this.$store.commit("gateway/set_pairsMinMax", {
        result: [{ from: "", to: "", minAmountFloat: 0, maxAmountFloat: 0 }]
      });
      this.minMaxPair();
      // if (this.exechangeRateType === "float") {
      this.clearAllintervals();
      this.getExchangeRate();
      this.validateFixedIsEnabled();

      // } else {
      // this.getFixedExchangeAmount();
      // }
      // this.getExchangeRate();
    },
    minMaxAmoutValidator(amount) {
      // console.log("this.pairsMinMax", this.pairsMinMax);
      if (this.exechangeRateType === "float") {
        if (
          this.pairsMinMax.minAmountFloat &&
          Number(amount) < Number(this.pairsMinMax.minAmountFloat)
        ) {
          this.minMaxWarningContent = "min";
        } else if (
          this.pairsMinMax.maxAmountFloat &&
          Number(amount) > Number(this.pairsMinMax.maxAmountFloat)
        ) {
          this.minMaxWarningContent = "max";
        } else {
          this.minMaxWarningContent = "";
        }
      } else {
        if (
          this.pairsMinMax.minAmountFixed &&
          Number(amount) < Number(this.pairsMinMax.minAmountFixed)
        ) {
          this.minMaxWarningContent = "min";
        } else if (
          this.pairsMinMax.maxAmountFixed &&
          Number(amount) > Number(this.pairsMinMax.maxAmountFixed)
        ) {
          this.minMaxWarningContent = "max";
        } else {
          this.minMaxWarningContent = "";
        }
      }
      // if (
      //   this.pairsMinMax.from &&
      //   this.pairsMinMax.to &&
      //   !this.pairsMinMax.minAmountFloat
      // ) {
      //   // this.pairStatusContent='Unsupported exchange pair'
      //   console.log("not found the pair");
      // }
      // else{
      //   this.pairStatusContent=''
      // }
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
      // console.log("cleaar all state");
      this.minMaxPair();
      // if (this.exechangeRateType === "float") {
      this.clearAllintervals();
      this.getExchangeRate();
      this.validateFixedIsEnabled();
    },
    fixedCreateTxnValidation() {
      // console.log('button',this.sendAmount > Number(this.pairsMinMax.minAmountFixed) , this.sendAmount < Number(this.pairsMinMax.maxAmountFixed),  )
      // console.log('cursor validsation',this.sendAmount > Number(this.pairsMinMax.minAmountFixed) , this.sendAmount < Number(this.pairsMinMax.maxAmountFixed))
      let previousTxnCreatedTime = localStorage.getItem("createdFixedTxnTime");
      if (!previousTxnCreatedTime) {
        return false;
      }
      let pdate = new Date(previousTxnCreatedTime);

      if (moment(pdate).format("L") === moment().format("L")) {
        pdate = pdate.setMinutes(pdate.getMinutes() + 15);
        const currentTime = new Date();
        const sub = pdate > currentTime;
        // console.log("createdFixedTxnTime ::", sub);

        return sub;
      } else {
        return false;
      }
    },
    disableValidation() {
      // console.log(
      //   "this.isValidRecipientAddress ::",
      //   this.isValidRecipientAddress
      // );
      let fixed_validation;
      if (this.exechangeRateType === "fixed") {
        // let
        // if(Object.hasOwn(this.isValidRefundAddress, 'result'))
        // {
        // console.log("this.isValidRefundAddress", this.isValidRefundAddress);
        fixed_validation = this.isValidRefundAddress.result;
        // }
      } else {
        fixed_validation = true;
      }

      let receiveFund = "";
      let refundAdd = "";
      if (this.exechangeRateType === "float") {
        receiveFund = this.exchange_amount.amountTo;
        refundAdd = true;
      } else {
        refundAdd = this.refundAddress.val;
        receiveFund = this.fixedExchangeRate.amountTo;
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
      // console.log("openExternalLink", url);
      this.$gateway.send("core", "open_url", { url });
    },
    getExchangeRate() {
      clearInterval(this.refreshFloatExchangeRate);

      this.$store.commit("gateway/set_exchangeAmount", { result: [] });

      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        amountFrom: this.sendAmount
      };
      // console.log("getExchangeRate..........");
      // clearInterval(this.refreshFloatExchangeRate);
      this.$gateway.send("swap", "exchange_amount", data);
      // let count = 1;
      this.refreshFloatExchangeRate = setInterval(() => {
        // console.log("Float ::", count++);

        this.$gateway.send("swap", "exchange_amount", data);
      }, 30000);
    },
    clearAllintervals() {
      clearInterval(this.refreshFixedExchangeRate);
      clearInterval(this.refreshFloatExchangeRate);
      clearInterval(this.refreshTxnStatus);
    },

    getFixedExchangeAmount() {
      clearInterval(this.refreshFixedExchangeRate);

      this.$store.commit("gateway/set_fixedExchangeRate", { result: [] });
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        amountFrom: this.sendAmount
      };
      // let count = 1;
      // clearInterval(this.refreshFixedExchangeRate);

      this.$gateway.send("swap", "fixed_exchange_amount", data);
      this.refreshFixedExchangeRate = setInterval(() => {
        // console.log("Fixed ::", count++);
        this.$gateway.send("swap", "fixed_exchange_amount", data);
      }, 30000);
    },
    validateFixedIsEnabled() {
      if (
        this.sendAmounType.fixRateEnabled &&
        this.receiveAmountType.fixRateEnabled
      ) {
        // console.log("validateFixedIsEnabled validateFixedIsEnabled");
        this.getFixedExchangeAmount();
      }
    },
    // fixedInterval() {
    //   // let count = 1;
    //   this.refreshFixedExchangeRate = setInterval(
    //     this.getFixedExchangeAmount(),
    //     30000
    //   );
    // },
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
        currency: this.receiveAmountType.value
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
        currency: this.sendAmounType.value
      };
      // console.log("refund address ",this.refundAddress.val)
      // let params = {
      //   address: this.refundAddress.val,
      //   currency: 'eth'
      // };
      if (this.refundAddress.val) {
        this.$gateway.send("swap", "refundAddressValidation", params);
      }
    },
    next() {
      let refundAdderss =
        this.exechangeRateType === "fixed"
          ? this.isValidRefundAddress.result
          : true;
      // console.log("next",this.sendAmount > 0 &&
      // this.agree === "yes" &&
      // this.isValidRecipientAddress.result &&
      // refundAdderss,this.isValidRecipientAddress)
      if (
        this.sendAmount > 0 &&
        this.agree === "yes" &&
        this.isValidRecipientAddress.result &&
        refundAdderss
      ) {
        this.clearAllintervals();
        this.routes = "makePayment";
        this.$gateway.send("wallet", "set_stepperPosition", {
          data: 2
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
      if (this.exechangeRateType === "float") {
        this.createtxn();
      } else {
        this.create_fixed_transaction();
      }
    },
    createtxn() {
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        address: this.recipientAddress.val,
        amountFrom: this.sendAmount,
        walletAddress: this.info.address
      };
      if (this.destinationTag === "yes") {
        data.extraId = this.destinationTagValue;
      }
      // console.log("create_transaction", data);
      this.$gateway.send("swap", "create_transaction", data);
      this.swaploading = true;
      this.navigation("settlement", 3);
    },
    create_fixed_transaction() {
      // from: "btc",
      // to: "eth",
      // address: "0x410afe72a5f18cce5f758c731bb2a9b90e74e5c7",
      // amountFrom: "0.1",
      // rateId: "xnsnh0&jcqJG4awmG8La0y5pLGIpIQ",
      // refundAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
      let data = {
        from: this.sendAmounType.value,
        to: this.receiveAmountType.value,
        address: this.recipientAddress.val,
        amountFrom: this.sendAmount,
        rateId: this.fixedExchangeRate.id,
        refundAddress: this.refundAddress.val,
        walletAddress: this.info.address
      };
      if (this.destinationTag === "yes") {
        data.extraId = this.destinationTagValue;
      }
      // console.log("create_fixed_transaction", data);
      this.$gateway.send("swap", "create_fixed_transaction", data);
      this.swaploading = true;
      this.navigation("settlement", 3);
      localStorage.setItem("createdFixedTxnTime", new Date());
    },
    get_transaction_status() {
      // this.navigation("swapStatus", 4);
      // let data = {
      //   id: "eukaew8lktw5nlwn" //create transaction id
      // };

      let data = {
        id: this.createdTxnDetails.result.id
      };
      // console.log("get_transaction_status data", data);
      // let count = 1;
      this.refreshTxnStatus = setInterval(() => {
        // console.log("get status ::", count++);

        // this.$gateway.send("swap", "transaction_history", data);

        // this.$gateway.send("swap", "transaction_status", data);
        this.$gateway.send("swap", "transaction_status", data);
      }, 30000);
    }
  }
};
</script>
