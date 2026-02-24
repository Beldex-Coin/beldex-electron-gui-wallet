<template>
  <q-page class="welcome" style="min-height:unset;">
    <q-stepper
      ref="stepper"
      v-model="step"
      class="welcome-stepper"
      active-color="#00AD07"
      done-color="#000"
      flat
      dark
    >
      <q-step
        :name="1"
        :title="$t('titles.chooseLanguage')"
        :done="step > 1"
        class="first-step"
        icon="settings"
      >
        <div class="welcome-container">
          <div>
            <img src="../../assets/images/Logo.png" class="logo" />
          </div>
          <h3 class="ft-bold q-my-md appName">
            <span>Beldex</span> Electron Wallet
          </h3>
          <div class="ft-medium wallet-txt">
            Wallet {{ this.$t("strings.version") }} : <span>{{ version }}</span>
          </div>
          <div class="ft-medium wallet-txt">
            Daemon {{ this.$t("strings.version") }} :
            <span>{{ daemonVersion }}</span>
          </div>
          <LanguageSelect class="q-mt-md" @select="onLanguageSelected" />
        </div>
      </q-step>

      <q-step
        :name="2"
        :title="$t('titles.configure')"
        icon="settings"
        class="second-step"
      >
        <SettingsGeneral
          ref="settingsGeneral"
          :randomise-remote="true"
          :welcome="true"
          @clickPrev="clickPrev"
          @clickNext="clickNext"
        />
      </q-step>
    </q-stepper>

    <!-- <q-footer v-if="!(step === 1)" class="no-shadow q-pa-sm">
      <div class="row justify-end">
        <div>
          <q-btn flat :label="$t('buttons.back')" @click="clickPrev()" />
        </div>
        <div>
          <q-btn
            class="q-ml-sm"
            color="primary"
            :label="$t('buttons.next')"
            @click="clickNext()"
          />
        </div>
      </div>
    </q-footer> -->
  </q-page>
</template>

<script>
import { version } from "../../../package.json";
import { mapState } from "vuex";
import LanguageSelect from "components/language_select";
import SettingsGeneral from "components/settings_general";

export default {
  components: {
    LanguageSelect,
    SettingsGeneral
  },
  data() {
    return {
      step: 1,
      version: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    pending_config: state => state.gateway.app.pending_config,
    config_daemon() {
      return this.pending_config.daemons[this.pending_config.app.net_type];
    },
    daemon: state => state.gateway.daemon,

    // to be fixed
    daemonVersion() {
      const dVersion = this.daemon.info.version;
      return dVersion ? "v" + dVersion : "N/A";
    }
  }),
  mounted() {
    this.version = version;

    // set add status back to 2
    this.$store.commit("gateway/set_app_data", {
      status: {
        code: 2 // Loading config
      }
    });
  },
  methods: {
    clickNext() {
      // if the last step i s active, then we want to initialise the config
      if (this.step === 2) {
        this.$gateway.send("core", "save_config_init", this.pending_config);
        this.$router.replace({ path: "/" });
      } else {
        this.$refs.stepper.next();
      }
    },
    clickPrev() {
      this.$refs.stepper.previous();
    },
    onLanguageSelected() {
      this.clickNext();
    }
  }
};
</script>

<style lang="scss">
.welcome {
  height: 100vh;
  .welcome-stepper {
    .q-stepper__header {
      width: 50%;
      margin: 0 auto;
    }
    .q-stepper__title {
      font-family: "poppins-SemiBold";
      font-size: 16px;
    }
  }
  .logo {
    height: 100px;
    width: 100px;
  }
  .q-dark {
    // background-color: #292929;
    background: #1c1c26;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .first-step {
    // .welcome-stepper {

    // width: 1001px;
    height: 100%;

    background: transparent;
    margin: auto;
    font-size: 5px;
  }

  .welcome-container,
  .second-step {
    // padding-top: 14vh;
    width: 1001px;
    padding-bottom: 25px;

    padding-top: 3vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #242433;

    border: 1px solid #242433;
    box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.2);
    border-radius: 25px;

    .appName {
      font-size: 2.75rem;
      span {
        color: #00ad07;
      }
    }
    .wallet-txt {
      font-size: 1.125rem;
      span {
        color: #00ad07;
      }
    }
  }

  .first-step .q-stepper-step-inner {
    min-height: 250px;
    height: calc(100vh - 102px);
  }
  .second-step {
    display: block;
    margin-bottom: 49px;
    max-height: 81vh;
    overflow: auto;
  }
}

.language-item {
  padding: 10px 30px 10px 20px;
  border: 1px solid #ccc;
  cursor: pointer;

  .language-item-circle {
    background: #cc90e2;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    color: white;
    margin-right: 10px;
  }
}

.q-stepper-header {
  min-height: 10vh;
}

@media only screen and (max-height: 780px) {
  .welcome {
    .first-step {
      max-height: 92vh;
    }
    .welcome-container {
      padding: 35px 0;
    }
    .logo {
      height: 50px;
      width: 50px;
    }
    .second-step {
      padding-bottom: 0;
    }
  }
}
</style>
