<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <!-- <MainMenu /> -->
      <q-toolbar>
        <!-- <div>
          <img src="../../assets/images/Logo.png" />
        </div> -->
        <div class="main-title flex items-center">
          <img src="../../assets/images/Logo.png" />
          <span class="green q-mr-xs q-ml-sm">Beldex </span>
          <span>Electron Wallet</span>
        </div>
        <!-- <div class="flex items-center justify-center" style="margin:9px">
          <img src="beldex.png" height="32" />
          welcome
        </div>-->

        <MainMenu />
      </q-toolbar>
    </q-header>

    <q-page class="flex row justify-around">
      <!-- <div class="col-md-3"> -->
      <div style="width: 23%; height: auto">
        <section class="rectangleBox" style="position: relative;">
          <article style="height: 93%; overflow-y: auto">
            <router-link to="/wallet" class="box">
              <article
                class="flex row alignItem-center justify-between menuList selected"
              >
                <div class="flex row align-center justify-center a-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 27 27"
                    xmlns="http://www.w3.org/2000/svg"
                    class="leftIcon"
                  >
                    <path
                      d="M8.33301 0.583313C4.05759 0.583313 0.583008 4.0579 0.583008 8.33331C0.583008 12.6087 4.05759 16.0833 8.33301 16.0833C8.6753 16.0833 9.01764 16.0643 9.35347 16.0127C9.57306 15.2312 9.88901 14.4886 10.2894 13.804C9.67589 14.0236 9.01759 14.1458 8.33301 14.1458C5.12967 14.1458 2.52051 11.5366 2.52051 8.33331C2.52051 5.12998 5.12967 2.52081 8.33301 2.52081C11.5363 2.52081 14.1455 5.12998 14.1455 8.33331C14.1455 9.0179 14.0233 9.67619 13.8037 10.2897C14.4883 9.88932 15.2309 9.57336 16.0124 9.35378C16.064 9.01795 16.083 8.6756 16.083 8.33331C16.083 4.0579 12.6084 0.583313 8.33301 0.583313ZM20.4966 0.583313C20.3003 0.583313 20.1077 0.65939 19.9643 0.804057L18.4569 2.31142C18.1625 2.60528 18.1625 3.08218 18.4569 3.37604L19.9643 4.8834C20.1794 5.09846 20.502 5.16302 20.7842 5.04612C21.0658 4.92923 21.2497 4.65467 21.2497 4.34983V3.81248H21.5726C22.4756 3.81248 23.1872 4.52404 23.1872 5.42706V6.71873C23.1854 6.8471 23.2091 6.97455 23.2569 7.09368C23.3048 7.2128 23.3759 7.32123 23.466 7.41265C23.5562 7.50407 23.6636 7.57666 23.782 7.62621C23.9004 7.67576 24.0275 7.70128 24.1559 7.70128C24.2843 7.70128 24.4114 7.67576 24.5298 7.62621C24.6483 7.57666 24.7557 7.50407 24.8458 7.41265C24.936 7.32123 25.007 7.2128 25.0549 7.09368C25.1028 6.97455 25.1265 6.8471 25.1247 6.71873V5.42706C25.1247 3.47679 23.5229 1.87498 21.5726 1.87498H21.2497V1.33763C21.2497 1.03215 21.0658 0.757587 20.7842 0.641337C20.6912 0.602587 20.5929 0.583313 20.4966 0.583313ZM18.6663 10.9166C14.3976 10.9166 10.9163 14.3979 10.9163 18.6666C10.9163 22.9354 14.3976 26.4166 18.6663 26.4166C22.9351 26.4166 26.4163 22.9354 26.4163 18.6666C26.4163 14.3979 22.9351 10.9166 18.6663 10.9166ZM18.6663 12.8541C21.888 12.8541 24.4788 15.445 24.4788 18.6666C24.4788 21.8883 21.888 24.4791 18.6663 24.4791C15.4447 24.4791 12.8538 21.8883 12.8538 18.6666C12.8538 15.445 15.4447 12.8541 18.6663 12.8541ZM2.82829 19.2986C2.57158 19.3026 2.32696 19.4084 2.14816 19.5926C1.96935 19.7768 1.87099 20.0245 1.87467 20.2812V21.5729C1.87467 23.5232 3.47649 25.125 5.42676 25.125H5.74967V25.6623C5.74967 25.9678 5.93355 26.2424 6.21513 26.3586C6.30813 26.3974 6.4065 26.4166 6.50273 26.4166C6.69906 26.4166 6.89166 26.3406 7.03503 26.1959L8.5424 24.6885C8.8369 24.3947 8.8369 23.9178 8.5424 23.6239L7.03503 22.1166C6.81997 21.9015 6.49736 21.8369 6.21513 21.9538C5.93355 22.0707 5.74967 22.3453 5.74967 22.6501V23.1875H5.42676C4.52374 23.1875 3.81217 22.4759 3.81217 21.5729V20.2812C3.81403 20.1516 3.78985 20.0229 3.74104 19.9027C3.69224 19.7826 3.61982 19.6735 3.52807 19.5818C3.43631 19.4902 3.3271 19.4179 3.2069 19.3692C3.08669 19.3206 2.95795 19.2966 2.82829 19.2986Z"
                    />
                  </svg>
                  <!-- <span class="divider"></span> -->
                  <span>{{ this.$t("titles.transactions") }}</span>
                </div>
                <q-icon name="chevron_right" size="24px" />
              </article>
            </router-link>

            <router-link to="/wallet/bns" class="box ">
              <article
                class="flex row alignItem-center justify-between menuList selected q-mt-md"
              >
                <div class="flex row align-center justify-center a-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 29 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="leftIcon"
                  >
                    <path
                      d="M14.4108 0C8.25738 0 2.88683 3.35992 0 8.33333H4.06901C5.56912 6.48004 7.52658 5.01302 9.80469 4.16992C9.28277 5.38303 8.86502 6.80013 8.54492 8.33333H11.9727C12.7707 5.03852 13.8889 3.33333 14.4108 3.33333C14.9327 3.33333 16.0509 5.03852 16.849 8.33333H20.2767C19.9566 6.80013 19.5367 5.38303 19.0169 4.16992C21.2934 5.01302 23.2525 6.48004 24.7526 8.33333H28.8216C25.9348 3.35992 20.5642 0 14.4108 0ZM0 25C2.88683 29.9734 8.25738 33.3333 14.4108 33.3333C20.5642 33.3333 25.9348 29.9734 28.8216 25H24.7526C23.2525 26.8533 21.295 28.3203 19.0169 29.1634C19.5367 27.9503 19.9533 26.5332 20.2734 25H16.8457C16.0476 28.2948 14.9295 30 14.4076 30C13.8856 30 12.7707 28.2948 11.9727 25H8.54492C8.86502 26.5332 9.28494 27.9503 9.80469 29.1634C7.52821 28.3203 5.56912 26.8533 4.06901 25H0Z"
                    />
                    <path
                      d="M6.08153 18.5914C6.08153 17.7922 5.4231 17.3127 4.38188 17.3127H2.2688V19.8169H4.42781C5.46904 19.8169 6.08153 19.3773 6.08153 18.5914ZM5.82122 14.7153C5.82122 13.9694 5.23936 13.5431 4.22875 13.5431H2.2688V15.8741H4.22875C5.23936 15.8741 5.82122 15.4745 5.82122 14.7153ZM8.25585 18.8179C8.25585 20.2964 6.95432 21.3353 4.73406 21.3353H0.125093V12.038H4.535C6.77057 12.038 8.01086 13.0503 8.01086 14.4356C8.01086 15.5678 7.22994 16.2737 6.18871 16.5668C7.39837 16.7532 8.25585 17.7256 8.25585 18.8179Z"
                    />
                    <path
                      d="M16.962 12.0246H19.1057V21.3353H16.962L12.1081 14.955V21.3353H9.96436V12.0246H12.1081L16.962 18.4182V12.0246Z"
                    />
                    <path
                      d="M28.6965 18.6447C28.6965 20.1099 27.349 21.4286 24.9144 21.4286C22.6941 21.4286 20.9792 20.4163 20.9486 18.658H23.2454C23.3066 19.4039 23.8732 19.8968 24.8685 19.8968C25.8791 19.8968 26.4763 19.4306 26.4763 18.7646C26.4763 16.7532 20.9639 17.9654 20.9792 14.5954C20.9792 12.9171 22.541 11.9048 24.746 11.9048C26.9356 11.9048 28.4362 12.8771 28.574 14.5554H26.2159C26.17 13.9427 25.6035 13.4632 24.6847 13.4499C23.8426 13.4232 23.2148 13.7829 23.2148 14.5421C23.2148 16.4069 28.6965 15.368 28.6965 18.6447Z"
                    />
                  </svg>
                  <!-- <span class="divider"></span> -->
                  <span>{{ this.$t("titles.bnsServices") }}</span>
                </div>
                <q-icon name="chevron_right" size="24px" />
              </article>
            </router-link>

            <router-link to="/wallet/masternode" class="box">
              <article
                class="flex row alignItem-center justify-between menuList selected q-mt-md"
              >
                <div class="flex row align-center justify-center a-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 25 28"
                    class="leftIcon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.75 19.0436V8.95638C23.75 8.01591 23.2442 7.14044 22.4297 6.66919L13.6953 1.6256C12.8808 1.15638 11.8692 1.15638 11.0547 1.6256L2.32031 6.66919C1.50578 7.14044 1 8.01591 1 8.95638V19.0415C1 19.982 1.50578 20.8575 2.32031 21.3287L11.0547 26.3723C11.4609 26.6079 11.918 26.7258 12.375 26.7258C12.832 26.7258 13.2891 26.6079 13.6953 26.3723L22.4297 21.3287C23.2442 20.8595 23.75 19.984 23.75 19.0436ZM11.7656 25.3668C11.7311 25.3506 11.6966 25.3364 11.6641 25.3161L2.92969 20.2725C2.49094 20.0186 2.21875 19.5473 2.21875 19.0415V8.95638C2.21875 8.91981 2.22281 8.88325 2.22687 8.84872L11.7656 14.3554V25.3668ZM2.83219 7.79044C2.86469 7.7681 2.89516 7.74372 2.92969 7.72544L11.6641 2.68185C12.1028 2.42794 12.6472 2.42794 13.0859 2.68185L21.8203 7.72544C21.8548 7.74575 21.8853 7.7681 21.9178 7.79044L12.375 13.3012L2.83219 7.79044ZM21.8203 20.2745L13.0859 25.3181C13.0534 25.3364 13.0189 25.3526 12.9844 25.3689V14.3554L22.5231 8.84872C22.5252 8.88528 22.5312 8.91981 22.5312 8.95638V19.0415C22.5312 19.5493 22.2591 20.0206 21.8203 20.2745Z"
                      stroke-width="0.604167"
                    />
                  </svg>
                  <!-- <span class="divider"></span> -->
                  <span>{{
                    this.$t("strings.transactions.types.masterNode")
                  }}</span>
                </div>
                <q-icon name="chevron_right" size="24px" />
              </article>
            </router-link>

            <router-link to="/wallet/swap" class="box">
              <article
                class="flex row alignItem-center justify-between menuList selected box q-mt-md"
              >
                <div class="flex row align-center justify-center a-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 27 22"
                    class="leftIcon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.1325 0.717408C19.8922 0.717705 19.6575 0.789624 19.4583 0.923976C19.2591 1.05833 19.1044 1.24901 19.0141 1.47168C18.9238 1.69434 18.9019 1.93886 18.9513 2.17402C19.0006 2.40918 19.119 2.62429 19.2911 2.79187L20.2493 3.75004H19.5413C16.9564 3.75004 14.7839 5.19413 13.4996 7.24288C12.2154 5.19413 10.0429 3.75004 7.45797 3.75004H2.02047C1.86035 3.74778 1.70137 3.77736 1.55279 3.83707C1.4042 3.89677 1.26896 3.98542 1.15493 4.09785C1.0409 4.21028 0.950356 4.34425 0.888552 4.49197C0.826749 4.6397 0.794922 4.79824 0.794922 4.95837C0.794922 5.11851 0.826749 5.27705 0.888552 5.42477C0.950356 5.5725 1.0409 5.70647 1.15493 5.8189C1.26896 5.93133 1.4042 6.01997 1.55279 6.07968C1.70137 6.13939 1.86035 6.16897 2.02047 6.16671H7.45797C10.1418 6.16671 12.2913 8.31622 12.2913 11C12.2913 13.6839 10.1418 15.8334 7.45797 15.8334H6.74996L7.70813 14.8752C7.88274 14.7055 8.002 14.487 8.05028 14.2483C8.09857 14.0096 8.07362 13.7619 7.97872 13.5377C7.88381 13.3134 7.72338 13.1231 7.51843 12.9916C7.31349 12.8601 7.0736 12.7936 6.8302 12.8007C6.51628 12.8101 6.21833 12.9413 5.99947 13.1665L2.97864 16.1874C2.75212 16.414 2.62486 16.7213 2.62486 17.0417C2.62486 17.3621 2.75212 17.6694 2.97864 17.896L5.99947 20.9169C6.11081 21.0328 6.24417 21.1254 6.39175 21.1892C6.53932 21.253 6.69814 21.2867 6.85889 21.2883C7.01965 21.29 7.17912 21.2595 7.32796 21.1987C7.4768 21.138 7.61202 21.0481 7.7257 20.9344C7.83938 20.8208 7.92923 20.6855 7.99 20.5367C8.05076 20.3879 8.08122 20.2284 8.07958 20.0676C8.07795 19.9069 8.04425 19.7481 7.98047 19.6005C7.91669 19.4529 7.8241 19.3195 7.70813 19.2082L6.74996 18.25H7.45797C10.0429 18.25 12.2154 16.806 13.4996 14.7572C14.7839 16.806 16.9564 18.25 19.5413 18.25H24.9788C25.1389 18.2523 25.2979 18.2227 25.4465 18.163C25.5951 18.1033 25.7303 18.0147 25.8443 17.9022C25.9584 17.7898 26.0489 17.6558 26.1107 17.5081C26.1725 17.3604 26.2043 17.2018 26.2043 17.0417C26.2043 16.8816 26.1725 16.723 26.1107 16.5753C26.0489 16.4276 25.9584 16.2936 25.8443 16.1812C25.7303 16.0687 25.5951 15.9801 25.4465 15.9204C25.2979 15.8607 25.1389 15.8311 24.9788 15.8334H19.5413C16.8575 15.8334 14.708 13.6839 14.708 11C14.708 8.31622 16.8575 6.16671 19.5413 6.16671H20.2493L19.2911 7.12488C19.1752 7.23622 19.0826 7.36958 19.0188 7.51715C18.955 7.66473 18.9213 7.82354 18.9197 7.9843C18.918 8.14506 18.9485 8.30453 19.0093 8.45337C19.07 8.60221 19.1599 8.73743 19.2736 8.8511C19.3873 8.96478 19.5225 9.05464 19.6713 9.1154C19.8202 9.17617 19.9796 9.20663 20.1404 9.20499C20.3011 9.20335 20.46 9.16966 20.6075 9.10588C20.7551 9.04209 20.8885 8.9495 20.9998 8.83354L24.0206 5.8127C24.2472 5.58609 24.3744 5.27879 24.3744 4.95837C24.3744 4.63796 24.2472 4.33066 24.0206 4.10405L20.9998 1.08321C20.8871 0.967318 20.7522 0.875227 20.6032 0.812393C20.4542 0.749559 20.2942 0.717259 20.1325 0.717408Z"
                    />
                  </svg>
                  <span>{{ this.$t("titles.swap.swap") }}</span>
                </div>
                <q-icon name="chevron_right" size="24px" />
              </article>
            </router-link>
            <!-- 
          <div class="q-pa-md swap-stepper">
            <q-stepper v-model="step" vertical color="primary" animated>
              <q-step
                :name="1"
                title="Select campaign settings"
                icon="1"
                :done="this.step > 1"
              >
                For each ad campaign that you create, 

                <q-stepper-navigation>
                  <q-btn @click="step = 2" color="primary" label="Continue" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Create an ad group"
                caption="Optional"
                icon="2"
                :done="step > 2"
              >
                An ad group contains 

                <q-stepper-navigation>
                  <q-btn @click="step = 4" color="primary" label="Continue" />
                  <q-btn
                    flat
                    @click="step = 1"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="Ad template" icon="assignment" disable>
                This step won't show up because it is disabled.
              </q-step>

              <q-step :name="4" title="Create an ad" icon="add_comment">
                Try out different ad text to see 
                <q-stepper-navigation>
                  <q-btn color="primary" label="Finish" />
                  <q-btn
                    flat
                    @click="step = 2"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div> -->
            <div class="swap-stepper q-mt-sm">
              <div class="flex row">
                <div
                  class="icon-wrapper q-mr-sm flex justify-center items-center"
                >
                  <span
                    class="position flex justify-center items-center indicateLine"
                  >
                    <span
                      v-if="this.stepperPosition === 1"
                      class="dot flex"
                    ></span>
                    <q-icon
                      v-if="this.stepperPosition > 1"
                      name="check_circle"
                      color="primary"
                      size="xs"
                    />
                  </span>
                </div>
                <div class="menu-wrapper">
                  <span class="ft-semibold">{{
                    this.$t("titles.swap.exchangePair")
                  }}</span
                  ><br />
                  <span class="ft-Light step-content"
                    >{{ this.$t("titles.swap.exchangePairDisc") }}r</span
                  >
                </div>
              </div>

              <div class="flex row q-mt-md">
                <div
                  class="icon-wrapper q-mr-sm flex justify-center items-center no-wrap"
                >
                  <span
                    class="position flex justify-center items-center"
                    style="position: relative"
                  >
                    <span v-if="this.stepperPosition < 2">2</span>
                    <span
                      v-if="this.stepperPosition === 2"
                      class="dot flex"
                    ></span>
                    <q-icon
                      v-if="this.stepperPosition > 2"
                      name="check_circle"
                      color="primary"
                      size="xs"
                    />
                  </span>
                </div>
                <div class="menu-wrapper">
                  <span class="ft-semibold">{{
                    this.$t("titles.swap.walletAddress")
                  }}</span
                  ><br />
                  <span class="ft-Light step-content">{{
                    this.$t("titles.swap.walletAddressDisc")
                  }}</span>
                </div>
              </div>

              <div class="flex row q-mt-md">
                <div
                  class="icon-wrapper q-mr-sm flex justify-center items-center no-wrap"
                >
                  <span
                    class="position flex justify-center items-center"
                    style="position: relative"
                  >
                    <span v-if="this.stepperPosition < 3">3</span>
                    <span
                      v-if="this.stepperPosition === 3"
                      class="dot flex"
                    ></span>
                    <q-icon
                      v-if="this.stepperPosition > 3"
                      name="check_circle"
                      color="primary"
                      size="xs"
                    />
                  </span>
                </div>
                <div class="menu-wrapper">
                  <span class="ft-semibold">{{
                    this.$t("titles.swap.payment")
                  }}</span
                  ><br />
                  <span class="ft-Light step-content">{{
                    this.$t("titles.swap.paymentDisc")
                  }}</span>
                </div>
              </div>

              <div class="flex row q-mt-md">
                <div
                  class="icon-wrapper q-mr-sm flex justify-center items-center no-wrap"
                >
                  <span
                    class="position flex justify-center items-center"
                    style="position: relative"
                  >
                    <span v-if="this.stepperPosition < 4">4</span>
                    <span
                      v-if="this.stepperPosition === 4"
                      class="dot flex"
                    ></span>
                    <q-icon
                      v-if="this.stepperPosition > 4"
                      name="check_circle"
                      color="primary"
                      size="xs"
                    />
                  </span>
                  <!-- <span class="position flex justify-center items-center">4</span> -->
                </div>
                <div class="menu-wrapper">
                  <span class="ft-semibold">{{
                    this.$t("titles.swap.exchange")
                  }}</span
                  ><br />
                  <span class="ft-Light step-content">{{
                    this.$t("titles.swap.exchangeDisc")
                  }}</span>
                </div>
              </div>
            </div>
            <router-link to="/wallet/advanced" class="box">
              <article
                class="flex row alignItem-center justify-between menuList selected q-mt-md"
              >
                <div class="flex row align-center justify-center a-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 23 23"
                    class="leftIcon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.83032 0.0734866C8.14796 0.075684 7.48299 0.288927 6.9266 0.683971C6.37022 1.07901 5.94968 1.63651 5.72264 2.28H1.10326C0.810654 2.28 0.530037 2.39624 0.323136 2.60314C0.116236 2.81004 0 3.09066 0 3.38326C0 3.67586 0.116236 3.95648 0.323136 4.16338C0.530037 4.37028 0.810654 4.48652 1.10326 4.48652H5.71898C5.92216 5.05692 6.27816 5.56052 6.74812 5.94234C7.21808 6.32415 7.78391 6.56948 8.38383 6.65155C8.98375 6.73362 9.59469 6.64926 10.1499 6.4077C10.7052 6.16613 11.1833 5.77664 11.5322 5.28176C11.8811 4.78688 12.0874 4.20565 12.1284 3.60153C12.1694 2.99741 12.0436 2.39364 11.7648 1.85616C11.4859 1.31867 11.0648 0.868135 10.5473 0.553755C10.0298 0.239375 9.43583 0.0732378 8.83032 0.0734866ZM15.4499 2.28C15.1573 2.28 14.8766 2.39624 14.6697 2.60314C14.4628 2.81004 14.3466 3.09066 14.3466 3.38326C14.3466 3.67586 14.4628 3.95648 14.6697 4.16338C14.8766 4.37028 15.1573 4.48652 15.4499 4.48652H20.9667C21.2593 4.48652 21.54 4.37028 21.7469 4.16338C21.9538 3.95648 22.07 3.67586 22.07 3.38326C22.07 3.09066 21.9538 2.81004 21.7469 2.60314C21.54 2.39624 21.2593 2.28 20.9667 2.28H15.4499ZM14.3509 7.7969C13.6677 7.79809 13.0016 8.01087 12.4443 8.40598C11.8869 8.80109 11.4656 9.35914 11.2383 10.0034H1.10326C0.810654 10.0034 0.530037 10.1197 0.323136 10.3266C0.116236 10.5335 0 10.8141 0 11.1067C0 11.3993 0.116236 11.6799 0.323136 11.8868C0.530037 12.0937 0.810654 12.2099 1.10326 12.2099H11.2383C11.4415 12.7805 11.7977 13.2842 12.2678 13.666C12.7379 14.0479 13.304 14.2932 13.9041 14.3751C14.5042 14.457 15.1152 14.3724 15.6705 14.1306C16.2258 13.8887 16.7039 13.4989 17.0526 13.0037C17.4013 12.5085 17.6073 11.927 17.6479 11.3227C17.6884 10.7184 17.5622 10.1145 17.2828 9.57713C17.0035 9.03973 16.5818 8.58946 16.0639 8.2755C15.5459 7.96154 14.9517 7.79598 14.346 7.7969H14.3509ZM20.9704 10.0034C20.7531 10.0034 20.5406 10.0679 20.3598 10.1886C20.1791 10.3094 20.0383 10.481 19.9551 10.6818C19.8719 10.8826 19.8501 11.1036 19.8925 11.3168C19.9349 11.53 20.0396 11.7258 20.1933 11.8795C20.347 12.0332 20.5428 12.1379 20.756 12.1803C20.9692 12.2227 21.1902 12.2009 21.391 12.1177C21.5918 12.0345 21.7634 11.8937 21.8842 11.713C22.0049 11.5322 22.0694 11.3198 22.0694 11.1024C22.0694 10.8109 21.9536 10.5314 21.7475 10.3253C21.5414 10.1192 21.2619 10.0034 20.9704 10.0034ZM5.52116 15.5191C4.8388 15.5213 4.17383 15.7345 3.61745 16.1296C3.06106 16.5246 2.64052 17.0821 2.41349 17.7256H1.10326C0.810654 17.7256 0.530037 17.8418 0.323136 18.0487C0.116236 18.2556 0 18.5363 0 18.8289C0 19.1215 0.116236 19.4021 0.323136 19.609C0.530037 19.8159 0.810654 19.9321 1.10326 19.9321H2.41349C2.61672 20.5027 2.97285 21.0064 3.44298 21.3882C3.91311 21.7701 4.47915 22.0154 5.07925 22.0973C5.67934 22.1792 6.29041 22.0946 6.84569 21.8527C7.40096 21.6109 7.87908 21.2211 8.2278 20.7259C8.57652 20.2307 8.78243 19.6491 8.82302 19.0448C8.86362 18.4405 8.73735 17.8367 8.45799 17.2993C8.17864 16.7619 7.75696 16.3117 7.23902 15.9977C6.72109 15.6837 6.12683 15.5182 5.52116 15.5191ZM12.1407 17.7256C11.8481 17.7256 11.5675 17.8418 11.3606 18.0487C11.1537 18.2556 11.0374 18.5363 11.0374 18.8289C11.0374 19.1215 11.1537 19.4021 11.3606 19.609C11.5675 19.8159 11.8481 19.9321 12.1407 19.9321H20.9667C21.2593 19.9321 21.54 19.8159 21.7469 19.609C21.9538 19.4021 22.07 19.1215 22.07 18.8289C22.07 18.5363 21.9538 18.2556 21.7469 18.0487C21.54 17.8418 21.2593 17.7256 20.9667 17.7256H12.1407Z"
                    />
                  </svg>
                  <!-- <span class="divider"></span> -->
                  <span> {{ this.$t("buttons.advanced") }}</span>
                </div>
                <q-icon name="chevron_right" size="24px" />
              </article>
            </router-link>
          </article>

          <article class="version-wrapper">
            <div class="version ft-regular">
              <svg
                width="18"
                height="18"
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

              <span>Version {{ version }}</span>
            </div>
          </article>
        </section>
      </div>
      <!-- <div class="col-md-6"> -->
      <div style="width: 50%; height: auto">
        <WalletDetails />
        <q-dialog ref="aboutModal" minimized>
          <div class="about-modal">
            <p class="q-my-sm">
              There is a new version of Beldex Electron Wallet is available.
              Please update your wallet from Beldex Official Website.
            </p>

            <div class="q-mt-md q-mb-lg external-links">
              <p>
                <a
                  href="#"
                  style="text-decoration: none"
                  @click="
                    openExternal('https://beldex.io/index.html#beldex-wallets')
                  "
                  >https://beldex.io/index.html#beldex-wallets</a
                >
                <q-btn
                  ref="copy"
                  color="primary"
                  padding="xs"
                  size="sm"
                  icon="content_copy"
                  style="margin-left: 8px"
                  @click="copyAddress"
                />
              </p>
            </div>
            <q-btn color="primary" label="Close" @click="showAbout(false)" />
          </div>
        </q-dialog>
        <!-- <div v-if="!is_able_to_send" class="app-content router-view-wrapper"> -->
        <div class="app-content router-view-wrapper">
          <!-- <div class="navigation row items-end"> -->
          <!-- <router-link to="/wallet">
              <q-btn class="single-icon" size="md" icon="swap_horiz" />
            </router-link> -->
          <!-- <router-link to="/wallet/send">
              <q-btn
                class="large-btn"
                :label="$t('buttons.send')"
                size="md"
                icon-right="arrow_right_alt"
                align="between"
              />
            </router-link>-->
          <!-- <router-link to="/wallet/receive">
              <q-btn
                class="large-btn"
                :label="$t('buttons.receive')"
                size="md"
                icon-right="save_alt"
                align="between"
              />
            </router-link>-->
          <!-- <router-link to="/wallet/masternode">
              <q-btn
                class="large-btn"
                :label="$t('buttons.masterNode')"
                size="md"
                icon-right="router"
                align="between"
              />
            </router-link> -->
          <!-- <router-link to="/wallet/bns">
            <q-btn
              class="large-btn"
              :label="$t('buttons.bns')"
              size="md"
              icon-right="text_fields"
              align="between"
            />
            </router-link>-->
          <!-- <router-link to="/wallet/advanced">
              <q-btn
                class="large-btn"
                :label="$t('buttons.advanced')"
                size="md"
                icon-right="tune"
                align="between"
              />
            </router-link> -->
          <!-- <router-link to="/wallet/addressbook" class="address">
              <q-btn class="single-icon" size="md" icon="person" />
            </router-link> -->
          <!-- </div> -->
          <!-- <div class="hr-separator" /> -->
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
        <div class="footer">
          <StatusFooter />
        </div>
      </div>

      <!-- <div class="col-md-3"> -->
      <div style="width: 27%; height: auto">
        <section class="rectangleBox rightPane">
          <!-- <router-view class="view right-sidebar" name="RightSidebar"></router-view> -->
          <RightPane />
        </section>
      </div>
    </q-page>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import { mapState } from "vuex";
const { clipboard } = require("electron");
import WalletDetails from "components/wallet_details";
import StatusFooter from "components/footer";
import MainMenu from "components/menus/mainmenu";
import RightPane from "app/src/layouts/wallet/rightPane.vue";
import { version } from "../../../package.json";

export default {
  name: "LayoutDefault",
  components: {
    StatusFooter,
    MainMenu,
    WalletDetails,
    RightPane
  },
  data() {
    return { version, step: 1 };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    update_required: state => state.gateway.update_required,
    stepperPosition: state => state.gateway.stepperPosition,
    is_able_to_send() {
      return this.$store.state.gateway.update_required;
    }
  }),
  mounted() {
    this.update_required == true ? this.showAbout() : "";
  },

  methods: {
    openURL,
    openExternal(url) {
      this.$gateway.send("core", "open_url", { url });
    },
    showAbout(toggle = true) {
      if (toggle) this.$refs.aboutModal.show();
      else this.$refs.aboutModal.hide();
    },
    copyAddress() {
      clipboard.writeText("https://beldex.io/index.html#beldex-wallets");
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.linkCopied")
      });
    }
  }
};
</script>

<style lang="scss">
.navigation {
  padding: 8px 12px;

  > * {
    margin: 2px 0;
    margin-right: 12px;
  }

  > *:last-child {
    margin-right: 0px;
  }

  .address {
    margin-left: auto;
  }

  .single-icon {
    width: 38px;
    padding: 0;
  }

  a {
    text-decoration: none;
  }
  .a-center {
    align-items: inherit;
  }

  .large-btn {
    min-width: 160px;
    .q-btn-inner > *:last-child {
      margin-left: auto;
      padding-left: 16px;
    }
  }
}

.version-wrapper {
  position: absolute;
  bottom: 20px;
  // bottom: 28px;
  // height: 52%;
  /* background-color: aliceblue; */
  display: flex;
  align-items: flex-end;

  .version {
    display: flex;
    align-items: center;
    margin-left: 20px;

    span {
      color: #77778b;
      font-family: "Poppins-Medium";
      font-size: 18px;
      margin-left: 10px;
    }
  }
}

// @media only screen and (max-height: 780px) {
//   .version-wrapper {
//     height: 39%;
//   }
// }
.footer {
  .fixed-bottom,
  .absolute-bottom {
    right: unset;
    bottom: unset;
    left: unset;
  }
}
</style>
