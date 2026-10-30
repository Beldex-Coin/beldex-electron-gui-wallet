<template>
  <q-page class="welcome">
    <!-- Visual stepper; q-stepper below keeps driving the steps
         ($refs.stepper.next / previous) with its own header hidden. -->
    <div class="beldex-stepper welcome__stepper">
      <div
        class="beldex-stepper__step"
        :class="{
          'beldex-stepper__step--active': step === 1,
          'beldex-stepper__step--done': step > 1
        }"
      >
        <span class="beldex-stepper__marker" />
        01 // {{ $t("titles.chooseLanguage") }}
      </div>
      <div class="beldex-stepper__divider" />
      <div
        class="beldex-stepper__step"
        :class="{ 'beldex-stepper__step--active': step === 2 }"
      >
        <span class="beldex-stepper__marker" />
        02 // {{ $t("titles.configure") }}
      </div>
    </div>

    <q-stepper ref="stepper" v-model="step" class="welcome-stepper" flat dark>
      <q-step
        :name="1"
        :title="$t('titles.chooseLanguage')"
        :done="step > 1"
        icon="settings"
      >
        <div class="beldex-panel welcome__language">
          <LanguageSelect @select="onLanguageSelected">
            <template #info>
              <div class="welcome__versions">
                <span>
                  Wallet {{ $t("strings.version") }}: <b>{{ version }}</b>
                </span>
                <span>
                  Daemon {{ $t("strings.version") }}:
                  <b>{{ daemonVersion }}</b>
                </span>
              </div>
            </template>
          </LanguageSelect>
        </div>
      </q-step>

      <q-step :name="2" :title="$t('titles.configure')" icon="settings">
        <div class="welcome__configure">
          <div class="beldex-heading">
            <button
              type="button"
              class="beldex-icon-btn"
              :aria-label="$t('buttons.back')"
              @click="clickPrev()"
            >
              ←
            </button>
            <h1 class="beldex-heading__title">
              {{ $t("titles.settings.title") }}
            </h1>
          </div>
          <div class="beldex-panel welcome__configure-panel">
            <SettingsGeneral
              ref="settingsGeneral"
              :randomise-remote="true"
              :welcome="true"
              @clickPrev="clickPrev"
              @clickNext="clickNext"
            />
          </div>
        </div>
      </q-step>
    </q-stepper>
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
// Choose language and Configuration steps.
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44px var(--beldex-space-6) var(--beldex-space-9);

  &__stepper {
    flex: none;
  }

  .welcome-stepper {
    width: 100%;
    background: transparent;
    box-shadow: none;

    // The step header is replaced by .welcome__stepper above.
    .q-stepper__header {
      display: none;
    }

    .q-stepper__step-inner {
      padding: 0;
    }
  }

  &__language {
    width: 100%;
    max-width: 554px;
    margin: 56px auto 0;
    padding: 30px;
    box-shadow: none;
  }

  &__versions {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: var(--beldex-text-xs);
    line-height: 15px;
    color: var(--beldex-text-muted);

    b {
      font-weight: 400;
      color: var(--beldex-text);
    }
  }

  &__configure {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 1082px;
    margin: var(--beldex-space-6) auto 0;
  }

  &__configure-panel {
    padding: var(--beldex-space-7);
    box-shadow: none;
  }
}
</style>
