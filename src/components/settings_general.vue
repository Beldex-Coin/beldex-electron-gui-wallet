<template>
  <div class="settings-general">
    <div class="daemonType">
      <div class="row justify-between q-mb-sm q-pb-sm daemonType">
        <div
          :class="
            `daemonTitle-wrapper  ${
              config_daemon.type === 'remote' ? 'active' : ''
            }`
          "
        >
          <q-radio
            v-model="config_daemon.type"
            dense
            size="sm"
            val="remote"
            :label="$t('strings.daemon.remote.title')"
          />
        </div>
        <div
          :class="
            `daemonTitle-wrapper  ${
              config_daemon.type === 'local_remote' ? 'active' : ''
            }`
          "
        >
          <q-radio
            v-model="config_daemon.type"
            dense
            size="sm"
            val="local_remote"
            :label="$t('strings.daemon.localRemote.title')"
          />
        </div>
        <div
          :class="
            `daemonTitle-wrapper  ${
              config_daemon.type === 'local' ? 'active' : ''
            }`
          "
        >
          <q-radio
            v-model="config_daemon.type"
            dense
            size="sm"
            val="local"
            :label="$t('strings.daemon.local.title')"
          />
        </div>
      </div>

      <p v-if="config_daemon.type == 'local_remote'" class="daemonDiscription">
        {{ $t("strings.daemon.localRemote.description") }}
      </p>
      <p v-if="config_daemon.type == 'local'" class="daemonDiscription">
        {{ $t("strings.daemon.local.description") }}
      </p>
      <p v-if="is_remote" class="daemonDiscription">
        {{ $t("strings.daemon.remote.description") }}
      </p>
    </div>

    <template v-if="config_daemon.type != 'remote'">
      <div class="row pl-sm q-mt-md">
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.localDaemonIP')"
        >
          <q-input
            v-model="config_daemon.rpc_bind_ip"
            class="box-input"
            :placeholder="daemon_defaults.rpc_bind_ip"
            disable
            borderless
            dense
          />
        </OxenField>
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.localDaemonPort') + '(RPC)'"
        >
          <!-- v-model="config_daemon.rpc_bind_port" -->
          <q-input
            v-model="config_daemon.rpc_bind_port"
            class="box-input"
            :placeholder="toString(daemon_defaults.rpc_bind_port)"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
      </div>
    </template>

    <template v-if="config_daemon.type != 'local'">
      <div class="row q-mt-md pl-sm">
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.remoteNodeHost')"
        >
          <q-input
            v-model="config_daemon.remote_host"
            class="box-input"
            :placeholder="daemon_defaults.remote_host"
            borderless
            dense
          />
          <!-- Remote node presets -->
          <q-btn-dropdown
            v-if="config.app.net_type === 'mainnet'"
            class="remote-dropdown"
            dropdown-icon="expand_more"
          >
            <q-list link no-border>
              <q-item
                v-for="option in remotes"
                :key="option.host"
                v-close-popup
                @click.native="setPreset(option)"
              >
                <q-item-label>
                  <q-item-label header
                    >{{ option.host }}:{{ option.port }}</q-item-label
                  >
                </q-item-label>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </OxenField>
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.remoteNodePort')"
        >
          <q-input
            v-model="config_daemon.remote_port"
            class="box-input"
            :placeholder="toString(daemon_defaults.remote_port)"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            :dark="theme == 'dark'"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
      </div>
    </template>

    <div class="row q-mt-md pl-sm">
      <OxenField
        class="col-6 box-header"
        :label="$t('fieldLabels.dataStoragePath')"
        disable-hover
      >
        <q-input
          v-model="config.app.data_dir"
          class="box-input"
          disable
          :dark="theme == 'dark'"
          borderless
          dense
        />
        <input
          id="dataPath"
          ref="fileInputData"
          type="file"
          webkitdirectory
          directory
          hidden
          @change="setDataPath"
        />
        <q-btn
          style="color: red"
          color="primary1"
          :text-color="theme == 'dark' ? 'white' : 'dark'"
          @click="selectPath('data')"
          >{{ $t("buttons.selectLocation") }}</q-btn
        >
      </OxenField>
      <OxenField
        class="col-6 box-header"
        :label="$t('fieldLabels.walletStoragePath')"
        disable-hover
      >
        <q-input
          v-model="config.app.wallet_data_dir"
          class="box-input"
          disable
          :dark="theme == 'dark'"
          borderless
          dense
        />
        <input
          id="walletPath"
          ref="fileInputWallet"
          type="file"
          webkitdirectory
          directory
          hidden
          @change="setWalletDataPath"
        />
        <q-btn
          color="primary1"
          :text-color="theme == 'dark' ? 'white' : 'dark'"
          @click="selectPath('wallet')"
          >{{ $t("buttons.selectLocation") }}</q-btn
        >
      </OxenField>
    </div>

    <q-expansion-item
      expand-separator
      header-class="q-mt-md q-px-md non-selectable row advanced-options-label"
      :label="$t('strings.advancedOptions')"
    >
      <div class="row pl-sm q-mt-sm">
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.daemonLogLevel')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.log_level"
            class="box-input"
            :placeholder="toString(daemon_defaults.log_level)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            :decimals="0"
            :step="1"
            min="0"
            max="4"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
        <OxenField
          class="col-6 box-header"
          :label="$t('fieldLabels.walletLogLevel')"
        >
          <q-input
            v-model="config.wallet.log_level"
            class="box-input"
            :placeholder="toString(defaults.wallet.log_level)"
            :dark="theme == 'dark'"
            :decimals="0"
            :step="1"
            min="0"
            max="4"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
      </div>

      <div class="row pl-sm q-mt-md">
        <!-- TODO: Can be generalised to a "port" (or similar) field -->
        <OxenField
          class="col-3 box-header"
          :label="$t('fieldLabels.maxIncomingPeers')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.in_peers"
            class="box-input"
            :placeholder="toString(daemon_defaults.in_peers)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
            @keydown="keyHandler"
          />
        </OxenField>
        <OxenField
          class="col-3 box-header"
          :label="$t('fieldLabels.maxOutgoingPeers')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.out_peers"
            class="box-input"
            :placeholder="toString(daemon_defaults.out_peers)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
            @keydown="keyHandler"
          />
        </OxenField>
        <OxenField
          class="col-3 box-header"
          :label="$t('fieldLabels.limitUploadRate')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.limit_rate_up"
            class="box-input"
            :placeholder="toString(daemon_defaults.limit_rate_up)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            suffix="Kb/s"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
            @keydown="keyHandler"
          />
        </OxenField>
        <OxenField
          class="col-3 box-header"
          :label="$t('fieldLabels.limitDownloadRate')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.limit_rate_down"
            class="box-input"
            :placeholder="toString(daemon_defaults.limit_rate_down)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            suffix="Kb/s"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
            @keydown="keyHandler"
          />
        </OxenField>
      </div>
      <div class="row pl-sm q-mt-md">
        <OxenField
          class="col-4 box-header"
          :label="$t('fieldLabels.daemonP2pPort')"
          :disable="is_remote"
        >
          <q-input
            v-model="config_daemon.p2p_bind_port"
            class="box-input"
            :placeholder="toString(daemon_defaults.p2p_bind_port)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            float-
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
        <OxenField
          class="col-4 box-header"
          :label="$t('fieldLabels.internalWalletPort')"
        >
          <q-input
            v-model="config.app.ws_bind_port"
            class="box-input"
            :placeholder="toString(defaults.app.ws_bind_port)"
            :dark="theme == 'dark'"
            float-
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
        <OxenField
          class="col-4 box-header"
          :label="$t('fieldLabels.walletRPCPort')"
          :disable="is_remote"
        >
          <q-input
            v-model="config.wallet.rpc_bind_port"
            class="box-input"
            :placeholder="toString(defaults.wallet.rpc_bind_port)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            float-
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
            mask="######"
            unmasked-value
          />
        </OxenField>
      </div>
      <!-- <OxenField
          :helper="$t('fieldLabels.chooseNetwork')"
          :label="$t('fieldLabels.network')"
          class="network-group-field"
        >
          <q-option-group
            v-model="config.app.net_type"
            type="radio"
            dense
            inline
            :options="[
            { label: 'Main Net', value: 'mainnet' },
            { label: 'Stage Net', value: 'stagenet' },
            { label: 'Test Net', value: 'testnet' }
          ]"
          />
      </OxenField>-->

      <div
        class="row q-mb-sm q-pb-sm q-mt-md daemonType"
        style="background-color: #32324a"
      >
        <p class="netType">{{ $t("fieldLabels.network") }}</p>
        <div class="q-ml-lg q-pa-sm">
          <q-radio
            v-model="config.app.net_type"
            dense
            size="sm"
            val="mainnet"
            label="Main Net"
          />
        </div>
        <div class="q-ml-lg q-pa-sm">
          <q-radio
            v-model="config.app.net_type"
            dense
            size="sm"
            val="stagenet"
            label="Stage Net"
          />
        </div>
        <div class="q-ml-lg q-pa-sm">
          <q-radio
            v-model="config.app.net_type"
            dense
            size="sm"
            val="testnet"
            label="Test Net"
          />
        </div>
      </div>
    </q-expansion-item>
    <div
      v-if="!welcome"
      class="flex row align-center justify-center a-center q-mt-lg"
    >
      <q-btn
        :disable="this.saveBtnValidation(this.config_daemon)"
        color="primary"
        :label="$t('buttons.save')"
        @click="save"
      />
    </div>
    <div v-if="welcome" class="flex row align-center justify-center q-mt-lg">
      <div class="a-center q-mr-lg">
        <q-btn
          color="accent"
          :label="$t('buttons.back')"
          @click="() => this.$emit('clickPrev')"
        />
      </div>
      <div class="a-center">
        <q-btn
          color="primary"
          :label="$t('buttons.next')"
          @click="() => this.$emit('clickNext')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OxenField from "components/oxen_field";
export default {
  name: "SettingsGeneral",
  components: {
    OxenField
  },
  props: {
    randomiseRemote: {
      type: Boolean,
      required: false,
      default: false
    },
    welcome: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      select: 0,
      isVisible: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    daemon: state => state.gateway.daemon,
    pending_config: state => state.gateway.app.pending_config,
    remotes: state => state.gateway.app.remotes,
    config: state => state.gateway.app.pending_config,
    config_daemon() {
      return this.config.daemons[this.config.app.net_type];
    },
    is_remote() {
      return this.config_daemon.type === "remote";
    },
    defaults: state => state.gateway.app.defaults,
    daemon_defaults() {
      return this.defaults.daemons[this.config.app.net_type];
    }
  }),
  watch: {
    isVisible: function() {
      if (this.isVisible == false) {
        this.$store.dispatch("gateway/resetPendingConfig");
      }
    }
  },
  mounted() {
    if (
      this.randomiseRemote &&
      this.remotes.length > 0 &&
      this.config.app.net_type === "mainnet"
    ) {
      const index = Math.floor(Math.random() * Math.floor(this.remotes.length));
      this.setPreset(this.remotes[index]);
    }
  },

  methods: {
    save() {
      // console.log('local deamon ::',this.config_daemon)
      this.$gateway.send("core", "save_config", this.pending_config);
      this.isVisible = false;
    },
    selectPath(type) {
      const fileInput = type === "data" ? "fileInputData" : "fileInputWallet";
      this.$refs[fileInput].click();
    },
    setDataPath(file) {
      if (file.target.files && file.target.files.length > 0) {
        this.config.app.data_dir = file.target.files[0].path;
      }
    },
    setWalletDataPath(file) {
      if (file.target.files && file.target.files.length > 0) {
        this.config.app.wallet_data_dir = file.target.files[0].path;
      }
    },
    setPreset(option) {
      if (!option) return;

      const { host, port } = option;
      if (host) this.config_daemon.remote_host = host;
      if (port) this.config_daemon.remote_port = port;
    },
    keyHandler(evt) {
      if (
        // evt.key === "-" ||
        evt.key === "+" ||
        evt.key === "e" ||
        evt.key === "E"
      ) {
        evt.preventDefault();
      }
    },
    toString(value) {
      if (!value && typeof value !== "number") return "";
      return String(value);
    },
    saveBtnValidation(config_daemon) {
      const {
        type,
        rpc_bind_ip,
        rpc_bind_port,
        remote_host,
        remote_port
      } = config_daemon;
      const isLocal = type === "local";
      const isRemote = type === "remote";
      const isLocalRemote = type === "local_remote";

      const isValid =
        (isLocal && rpc_bind_ip && rpc_bind_port) ||
        (isRemote && remote_host && remote_port) ||
        (isLocalRemote &&
          rpc_bind_ip &&
          rpc_bind_port &&
          remote_host &&
          remote_port);

      const result = isLocal || isRemote || isLocalRemote ? !isValid : false;
      return result;
    }
  }
};
</script>

<style lang="scss">
.settings-general {
  // width: 69vw;
  // max-height: 695px;
  // overflow-y: auto;
  .q-field {
    margin: 20px 0;
  }
  .daemonType {
    border: 2px #484856 solid;
    font-family: "Poppins-SemiBold";
    border-radius: 12px;
    padding-top: 10px;
    padding-left: 16px;
    padding-right: 16px;

    .netType {
      padding: 10px;
      padding-right: 30px;
      margin: 0px;
      border-right: 2px solid #3e3e5b;
    }
    .daemonTitle-wrapper {
      padding: 10px 0;
      width: 33%;
      text-align: center;
      border-radius: 7px;
    }
    .daemonTitle-wrapper:hover {
      background-color: #32324b;
    }
    .active {
      background-color: #40405e;
    }
  }
  .daemonDiscription {
    font-family: "Poppins-Regular";
    color: #8787a8;
  }
  .q-if-disabled {
    cursor: default !important;
    .q-input-target {
      cursor: default !important;
    }
  }

  .network-group-field {
    color: white;
    display: inline-block;
  }

  .row.pl-sm {
    > * + * {
      padding-left: 16px;
    }
  }

  .col.pt-sm {
    > * + * {
      padding-top: 16px;
    }
  }

  .remote-dropdown {
    padding: 0 !important;
  }
  .q-item {
    background-color: #32324a;
    border-radius: 10px;
  }
  .box-header {
    font-family: "Poppins-Bold";
  }
  .box-input {
    font-family: "Poppins-Regular";
  }
}
</style>
