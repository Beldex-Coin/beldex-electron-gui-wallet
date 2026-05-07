<template>
  <q-dialog v-model="isVisible" maximized>
    <q-layout class="settings-modal">
      <q-header>
        <!-- <MainMenu /> -->
        <q-toolbar>
          <div>
            <img src="../assets/images/Logo.png" />
          </div>
          <div class="main-title">
            <span class="green q-mr-xs">Beldex </span>
            <span>Electron Wallet</span>
          </div>
          <!-- <div class="flex items-center justify-center" style="margin:9px">
          <img src="beldex.png" height="32" />
          welcome
        </div>-->

          <MainMenu disable-settings="true" />
        </q-toolbar>
      </q-header>
      <!-- <q-header>
        <q-toolbar color="dark" inverted>
          <q-btn flat round dense icon="reply" @click="isVisible = false" />
          <q-toolbar-title shrink>{{
            $t("titles.settings.title")
          }}</q-toolbar-title>

          <div class="row beldex-btn col justify-center q-pr-xl">
            <q-btn-toggle
              v-model="page"
              toggle-color="primary"
              color="accent"
              size="md"
              :options="tabs"
            />
          </div>

          <q-btn color="primary" :label="$t('buttons.save')" @click="save" />
        </q-toolbar>
      </q-header> -->
      <q-page class="flex row justify-around">
        <!-- <q-page-container> -->
        <div class="col-md-3">
          <section class="rectangleBox">
            <div
              class="flex column align-center justify-between rectangleButton"
            >
              <routering class="routering" @click="page = 'general'">
                <!-- <article
                  class="flex row alignItem-center justify-between settingsMenuList  selected"
                >-->
                <article
                  :class="[
                    page === 'general' ? 'selected' : '',
                    'flex',
                    'row',
                    'alignItem-center',
                    'justify-between',
                    'settingsMenuList'
                  ]"
                >
                  <div class="flex row align-center justify-center a-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 27 27"
                      xmlns="http://www.w3.org/2000/svg"
                      :class="[
                        page === 'general' ? 'selected' : 'leftIcon1',
                        'leftIcon'
                      ]"
                    >
                      <path
                        d="M11.3654 0C10.6881 0 10.1092 0.457102 9.9791 1.0916L9.50688 3.40664C8.34642 3.82563 7.2734 4.411 6.33116 5.14951L4.00598 4.38486C3.36549 4.17426 2.66081 4.42714 2.32147 4.98604L0.1896 8.51397C-0.148318 9.07421 -0.025332 9.78548 0.48508 10.2094L2.34909 11.7571C2.25215 12.326 2.18892 12.905 2.18892 13.5C2.18892 14.095 2.25215 14.674 2.34909 15.2429L0.48508 16.7906C-0.025332 17.2145 -0.148318 17.9258 0.1896 18.486L2.32147 22.014C2.65939 22.5742 3.36549 22.827 4.00598 22.6178L6.33116 21.8531C7.27309 22.5912 8.34695 23.1746 9.50688 23.5934L9.9791 25.9084C10.1092 26.5429 10.6881 27 11.3654 27H15.6346C16.3119 27 16.8908 26.5429 17.0209 25.9084L17.4931 23.5934C18.6536 23.1744 19.7266 22.589 20.6688 21.8505L22.994 22.6151C23.6345 22.8257 24.3392 22.5742 24.6785 22.014L26.8104 18.4834C27.1483 17.9231 27.0253 17.2145 26.5149 16.7906L24.6509 15.2429C24.7478 14.674 24.8111 14.095 24.8111 13.5C24.8111 12.905 24.7478 12.326 24.6509 11.7571L26.5149 10.2094C27.0253 9.78548 27.1483 9.07421 26.8104 8.51397L24.6785 4.98604C24.3406 4.42579 23.6345 4.17298 22.994 4.38223L20.6688 5.14687C19.7269 4.40882 18.6531 3.82544 17.4931 3.40664L17.0209 1.0916C16.8908 0.457102 16.3119 0 15.6346 0H11.3654ZM13.5 8.1C16.6233 8.1 19.1555 10.5179 19.1555 13.5C19.1555 16.4822 16.6233 18.9 13.5 18.9C10.3767 18.9 7.84446 16.4822 7.84446 13.5C7.84446 10.5179 10.3767 8.1 13.5 8.1Z"
                      />
                    </svg>
                    <!-- <span class="divider"></span> -->
                    <span>{{ this.$t("titles.settings.tabs.general") }}</span>
                  </div>
                  <q-icon
                    v-if="page === 'general'"
                    name="chevron_right"
                    size="24px"
                  />
                </article>
              </routering>

              <router
                class="rectangleButton routering q-mt-md"
                @click="page = 'language'"
              >
                <!-- <article
                  class="flex row alignItem-center justify-between settingsMenuList selected"
                >-->
                <article
                  :class="[
                    page === 'language' ? 'selected' : '',
                    'flex',
                    'row',
                    'alignItem-center',
                    'justify-between',
                    'settingsMenuList'
                  ]"
                >
                  <div class="flex row align-center justify-center a-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 26 27"
                      xmlns="http://www.w3.org/2000/svg"
                      :class="[
                        page === 'language' ? 'selected' : 'leftIcon1',
                        'leftIcon'
                      ]"
                    >
                      <path
                        d="M13 0C5.8318 0 0 5.8318 0 13C0 15.0716 0.501424 17.1242 1.45107 18.9617L0.059668 23.9396C-0.096982 24.5038 0.0626437 25.1111 0.477344 25.5252C0.786094 25.834 1.20244 26.0013 1.62754 26.0013C1.77379 26.0013 1.91869 25.9819 2.06299 25.9416L7.04336 24.5515C8.88091 25.5005 10.931 26 13 26C20.1682 26 26 20.1682 26 13C26 5.8318 20.1682 0 13 0ZM10.725 5.85127H14.625C15.1632 5.85127 15.6 6.28742 15.6 6.82627V8.45127C15.6 9.81367 14.9969 11.0925 13.9458 11.9603C13.7645 12.1104 13.5447 12.1837 13.3263 12.1837C13.0448 12.1837 12.7658 12.0628 12.5734 11.8295C12.2302 11.4141 12.2888 10.8003 12.7042 10.4571C13.3054 9.96118 13.65 9.22997 13.65 8.45127V7.80127H10.725C10.1868 7.80127 9.75 7.36512 9.75 6.82627C9.75 6.28742 10.1868 5.85127 10.725 5.85127ZM17.875 5.85127C18.4132 5.85127 18.85 6.28742 18.85 6.82627V9.10127H19.825C20.3632 9.10127 20.8 9.53742 20.8 10.0763C20.8 10.6151 20.3632 11.0513 19.825 11.0513H18.85V15.2763C18.85 15.8151 18.4132 16.2513 17.875 16.2513C17.3368 16.2513 16.9 15.8151 16.9 15.2763V6.82627C16.9 6.28742 17.3368 5.85127 17.875 5.85127ZM9.425 9.10127C9.82865 9.10127 10.1903 9.34953 10.3353 9.72588L13.5853 18.1759C13.7783 18.679 13.5272 19.2435 13.0241 19.4365C12.9091 19.4807 12.792 19.5013 12.675 19.5013C12.283 19.5013 11.9136 19.2628 11.7647 18.8754L11.0056 16.9013H7.84443L7.08525 18.8767C6.89155 19.3798 6.32573 19.6302 5.82588 19.4365C5.32343 19.2435 5.0717 18.6796 5.26475 18.1772L8.51475 9.72715C8.6597 9.35015 9.02135 9.10127 9.425 9.10127ZM9.425 12.7931L8.59473 14.9513H10.2553L9.425 12.7931Z"
                        stroke-width="0.604167"
                      />
                    </svg>
                    <!-- <span class="divider"></span> -->
                    <span>{{ this.$t("titles.settings.tabs.language") }}</span>
                  </div>
                  <q-icon
                    v-if="page === 'language'"
                    name="chevron_right"
                    size="24px"
                  />
                </article>
              </router>
              <!-- v-if="tabs[tabs.length - 1].value === 'peers'" -->
              <routering
                v-if="tabs[tabs.length - 1].value === 'peers'"
                class="routering q-mt-md"
                @click="page = 'peers'"
              >
                <!-- <article
                  class="flex row alignItem-center justify-between settingsMenuList  selected"
                >-->
                <article
                  :class="[
                    page === 'peers' ? 'selected' : '',
                    'flex',
                    'row',
                    'alignItem-center',
                    'justify-between',
                    'settingsMenuList'
                  ]"
                >
                  <div class="flex row align-center justify-center a-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 26 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      :class="[
                        page === 'peers' ? 'selected' : 'leftIcon1',
                        'leftIcon'
                      ]"
                    >
                      <path
                        d="M21.0222 0C20.2442 0.000758949 19.4819 0.21915 18.8215 0.630486C18.1611 1.04182 17.629 1.6297 17.2852 2.32766C16.9414 3.02561 16.7998 3.80582 16.8762 4.58008C16.9527 5.35434 17.2442 6.09177 17.7179 6.70901L14.1403 11.2276H9.04025C8.82364 10.3143 8.30524 9.50079 7.56892 8.91864C6.8326 8.3365 5.92141 8.01978 4.98276 8.01974C3.87674 8.01974 2.81602 8.4591 2.03394 9.24118C1.25187 10.0233 0.8125 11.084 0.8125 12.19C0.8125 13.296 1.25187 14.3567 2.03394 15.1388C2.81602 15.9209 3.87674 16.3603 4.98276 16.3603C5.92055 16.3591 6.83057 16.0419 7.56587 15.4598C8.30117 14.8777 8.81882 14.0648 9.03524 13.1524H14.1403L17.7179 17.671C17.2442 18.2882 16.9527 19.0257 16.8762 19.7999C16.7998 20.5742 16.9414 21.3544 17.2852 22.0523C17.629 22.7503 18.1611 23.3382 18.8215 23.7495C19.4819 24.1608 20.2442 24.3792 21.0222 24.38C22.1283 24.38 23.189 23.9406 23.9711 23.1586C24.7531 22.3765 25.1925 21.3158 25.1925 20.2097C25.1925 19.1037 24.7531 18.043 23.9711 17.2609C23.189 16.4788 22.1283 16.0395 21.0222 16.0395C20.3949 16.041 19.7759 16.1841 19.2115 16.458L15.8345 12.19L19.2103 7.9245C19.7753 8.19775 20.3946 8.33996 21.0222 8.34053C22.1283 8.34053 23.189 7.90116 23.9711 7.11908C24.7531 6.33701 25.1925 5.27629 25.1925 4.17026C25.1925 3.06424 24.7531 2.00352 23.9711 1.22144C23.189 0.439366 22.1283 0 21.0222 0Z"
                      />
                    </svg>
                    <!-- <span class="divider"></span> -->
                    <span>{{ this.$t("titles.settings.tabs.peers") }}</span>
                  </div>
                  <q-icon
                    v-if="page === 'peers'"
                    name="chevron_right"
                    size="24px"
                  />
                </article>
              </routering>
            </div>

            <article
              :class="
                `${
                  tabs[tabs.length - 1].value === 'peers'
                    ? 'version-wrapperwithpeer'
                    : 'version-wrapper'
                } flex items-end`
              "
            >
              <div class="version ft-regular">
                <svg
                  width="16"
                  height="16"
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

                <span>{{ $t("strings.version") }} {{ version }}</span>
              </div>
            </article>
          </section>
        </div>
        <div class="col-md-9">
          <!-- <q-btn class="rectangleBoxex" to="/list" label="Login" /> -->

          <div class="row right-header">
            <!-- <q-btn style="width: 40px" flat round dense icon="reply" @click="isVisible = false" /> -->
            <!-- <q-btn flat round dense @click="isVisible = false"> -->
            <div
              class="flex items-center back-arrow-btn"
              @click="isVisible = false"
            >
              <svg
                width="28"
                height="28"
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
            <q-toolbar-title shrink style="font-family: Poppins-Bold">
              {{
                page === "language"
                  ? $t("titles.settings.tabs.language")
                  : page === "peers"
                  ? this.$t("titles.settings.tabs.peers")
                  : this.$t("titles.settings.tabs.general")
              }}
            </q-toolbar-title>
          </div>
          <section class="rectangleBox rightPane">
            <div v-if="page == 'general'">
              <div class="q-pa-lg">
                <SettingsGeneral
                  ref="settingsGeneral"
                  :randomise-remote="false"
                />
              </div>
            </div>

            <div
              v-if="page == 'peers'"
              class="flex column justify-center items-center peerDetails"
            >
              <q-list no-border class="peerlist-wrapper">
                <q-item-label class="title ft-medium" header>{{
                  $t("strings.peerList")
                }}</q-item-label>
                <q-item
                  v-for="entry in daemon.connections"
                  :key="entry.address"
                  clickable
                  class="items-center deamonConDetails-Wrapper q-mx-md q-my-sm"
                  @click.native="showPeerDetails(entry)"
                >
                  <q-item-label class="greenIcon"> </q-item-label>
                  <q-item-label class="deamonConDetails ft-medium">
                    <q-item-label>{{ entry.address }}</q-item-label>
                    <q-item-label>
                      <!-- {{ $t("strings.blockHeight") }} -->
                      Height :
                      {{ entry.height }}
                    </q-item-label>
                  </q-item-label>
                </q-item>

                <template v-if="daemon.bans.length">
                  <q-item-label header>
                    {{ $t("strings.bannedPeers.title") }}
                  </q-item-label>
                  <q-item v-for="entry in daemon.bans" :key="entry.host">
                    <q-item-section>
                      <q-item-label header>{{ entry.host }}</q-item-label>
                      <q-item-label caption>
                        {{
                          $t("strings.bannedPeers.bannedUntil", {
                            time: new Date(
                              Date.now() + entry.seconds * 1000
                            ).toLocaleString()
                          })
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </div>

            <div
              v-if="page === 'language'"
              class="flex justify-center items-center"
              style="height: 100%"
            >
              <LanguageSelect username="matt" />
            </div>
          </section>
        </div>
        <!-- </q-page-container> -->
      </q-page>

      <q-dialog v-model="this.peerEntryModal" minimized>
        <div class="about-modal txn-details-modal">
          <div class="modal-header ft-semibold text-center text-h6">
            {{ this.$t("dialog.banPeer.peerDetailsTitle") }}
          </div>
          <article class="content-wrapper q-mt-md">
            {{ JSON.stringify(this.peerEntry, null, 2) }}
          </article>
          <div class="flex justify-center q-my-lg">
            <q-btn
              color="accent"
              :label="this.$t('dialog.buttons.cancel')"
              @click="peerEntryModal = false"
            />

            <q-btn
              color="negative"
              :label="this.$t('dialog.banPeer.ok')"
              class="q-ml-lg"
              @click.native="showdialog"
            />
          </div>
        </div>
      </q-dialog>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import SettingsGeneral from "components/settings_general";
import LanguageSelect from "components/language_select_settings";
import MainMenu from "components/menus/mainmenu";
import { version } from "../../package.json";

export default {
  name: "SettingsModal",
  components: {
    LanguageSelect,
    SettingsGeneral,
    MainMenu
  },
  data() {
    return {
      page: "general",
      isVisible: false,
      version,
      username: "matt",
      peerEntry: "",
      peerEntryModal: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    daemon: state => state.gateway.daemon,
    pending_config: state => state.gateway.app.pending_config,
    config: state => state.gateway.app.config,
    tabs: function(state) {
      const { app, daemons } = state.gateway.app.config;
      let tabs = [
        {
          label: this.$t("titles.settings.tabs.general"),
          value: "general",
          icon: "settings"
        },
        {
          label: this.$t("titles.settings.tabs.language"),
          value: "language",
          icon: "language"
        }
      ];
      if (daemons[app.net_type].type != "remote") {
        tabs.push({
          label: this.$t("titles.settings.tabs.peers"),
          value: "peers",
          icon: "cloud_queue"
        });
      }
      return tabs;
    }
  }),
  watch: {
    isVisible: function() {
      if (this.isVisible == false) {
        this.$store.dispatch("gateway/resetPendingConfig");
      }
    }
  },
  methods: {
    save() {
      this.$gateway.send("core", "save_config", this.pending_config);
      this.isVisible = false;
    },
    showPeerDetails(entry) {
      (this.peerEntry = entry), (this.peerEntryModal = true);

      // this.$q
      //   .dialog({
      //     title: this.$t("dialog.banPeer.peerDetailsTitle"),
      //     message: JSON.stringify(entry, null, 2),
      //     ok: {
      //       label: this.$t("dialog.banPeer.ok"),
      //       color: "negative"
      //     },
      //     cancel: {
      //       label: "cancel",
      //       // color: this.theme == "dark" ? "white" : "dark"
      //       color: "accent"
      //     },
      //     dark: this.theme === "dark",
      //     style: "width: 657px;padding:20px;"
      //   })
      //   .onOk(() => {
      //     this.$q
      //       .dialog({
      //         title: this.$t("dialog.banPeer.title"),
      //         message: this.$t("dialog.banPeer.message"),
      //         prompt: {
      //           model: "",
      //           type: "number"
      //         },
      //         ok: {
      //           label: this.$t("dialog.banPeer.ok"),
      //           color: "negative"
      //         },
      //         cancel: {
      //           label: this.$t("dialog.buttons.cancel"),
      //           color: "accent"
      //         },
      //         dark: this.theme === "dark",
      //         color: this.theme === "dark" ? "white" : "dark"
      //       })
      //       .onOk(seconds => {
      //         this.$gateway.send("daemon", "ban_peer", {
      //           host: entry.host,
      //           seconds
      //         });
      //       })
      //       .onCancel(() => {})
      //       .onDismiss(() => null);
      //   })
      //   .onCancel(() => {})
      //   .onDismiss(() => {});
    },
    showdialog() {
      // console.log("show inner");
      this.peerEntryModal = false;
      this.$q
        .dialog({
          title: this.$t("dialog.banPeer.title"),
          message: this.$t("dialog.banPeer.message"),
          prompt: {
            model: "",
            type: "number"
          },
          ok: {
            label: this.$t("dialog.banPeer.ok"),
            color: "negative"
          },
          cancel: {
            label: this.$t("dialog.buttons.cancel"),
            color: "accent"
          },
          dark: this.theme === "dark",
          color: this.theme === "dark" ? "white" : "dark"
        })
        .onOk(seconds => {
          this.$gateway.send("daemon", "ban_peer", {
            host: this.peerEntry.host,
            seconds
          });
        })
        .onCancel(() => {})
        .onDismiss(() => null);
    }
  }
};
</script>

<style lang="scss">
.settings-modal {
  // .rectangleButton {
  //    // width: 832px;
  //     // height: 600px;
  //      background-color:#242433;
  //     // margin-top: 90px;
  //      padding:'15px';
  //      border-radius: '20px';
  //      box-shadow: '0px 6px 24px rgba(0, 0, 0, 0.2)';
  //      width: '90%';
  //          MARGIN: 23PX AUTO 0;

  //      height: '88VH';

  // }
  .rectangleBox {
    margin: 90px AUTO 0;
    position: relative;
  }
  .version-wrapper,
  .version-wrapperwithpeer {
    position: absolute;
    // bottom: 28px;
    bottom: 20px;
    // height: 75%;
    .version {
      display: flex;
      align-items: center;
      margin-left: 20px;

      span {
        color: #77778b;
        font-family: "Poppins-Medium";
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
  // .version-wrapperwithpeer {
  //   height: 67%;
  // }
  .right-header {
    margin: 90px auto 0px 25px;
    color: white;
    align-items: center;
  }
  .rightPane {
    margin: 5px auto 0px;
    width: 96%;
    height: 82vh;
    overflow-y: auto;
  }
  @media only screen and (max-height: 780px) {
    .rightPane {
      height: 78vh;
    }
    // .version-wrapper {
    //   height: 35%;
    // }
    // .version-wrapperwithpeer {
    //   height: 58%;
    // }
  }
  .routering {
    .selected {
      // background-color: $beldex-disable-grey;
      background-color: #32324a;
      span {
        font-family: "Poppins-SemiBold";
        font-size: 20px;
        color: #fff;
      }
    }
    :hover {
      background-color: #2b2b41;
    }
  }
}
</style>
