<template>
  <div class="settings-general">
    <section class="settings-general__topology">
      <div class="settings-general__topology-head">
        <span class="beldex-label">{{ $t("strings.connectionTopology") }}</span>
        <span class="settings-general__ringct">
          {{ $t("strings.ringCtEnforced") }}
        </span>
      </div>
      <div class="settings-general__options" role="radiogroup">
        <button
          v-for="option in [
            { value: 'remote', key: 'remote' },
            { value: 'local_remote', key: 'localRemote' },
            { value: 'local', key: 'local' }
          ]"
          :key="option.value"
          type="button"
          role="radio"
          class="beldex-option"
          :class="{
            'beldex-option--active': config_daemon.type === option.value
          }"
          :aria-checked="config_daemon.type === option.value ? 'true' : 'false'"
          @click="config_daemon.type = option.value"
        >
          <span
            class="beldex-check"
            :class="{ 'beldex-check--on': config_daemon.type === option.value }"
          />
          {{ $t(`strings.daemon.${option.key}.title`) }}
        </button>
      </div>
      <p class="beldex-hint settings-general__description">
        <span class="settings-general__bolt" aria-hidden="true">⚡</span>
        <template v-if="config_daemon.type == 'local_remote'">
          {{ $t("strings.daemon.localRemote.description") }}
        </template>
        <template v-if="config_daemon.type == 'local'">
          {{ $t("strings.daemon.local.description") }}
        </template>
        <template v-if="is_remote">
          {{ $t("strings.daemon.remote.description") }}
        </template>
      </p>
    </section>

    <div
      v-if="config_daemon.type != 'remote'"
      class="settings-general__grid settings-general__grid--2"
    >
      <BeldexField :label="$t('fieldLabels.localDaemonIP')">
        <q-input
          v-model="config_daemon.rpc_bind_ip"
          :placeholder="daemon_defaults.rpc_bind_ip"
          disable
          borderless
          dense
        />
      </BeldexField>
      <BeldexField :label="$t('fieldLabels.localDaemonPort') + '(RPC)'">
        <q-input
          v-model="config_daemon.rpc_bind_port"
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
      </BeldexField>
    </div>

    <div
      v-if="config_daemon.type != 'local'"
      class="settings-general__grid settings-general__grid--2"
    >
      <BeldexField :label="$t('fieldLabels.remoteNodeHost')">
        <q-input
          v-model="config_daemon.remote_host"
          :placeholder="daemon_defaults.remote_host"
          dark
          borderless
          dense
        />
        <!-- Remote node presets -->
        <q-btn-dropdown
          v-if="config.app.net_type === 'mainnet'"
          class="settings-general__presets"
          content-class="beldex-menu beldex-menu--compact"
          dropdown-icon="expand_more"
          :menu-offset="[10, 7]"
          flat
          dense
        >
          <q-list link no-border>
            <q-item
              v-for="option in remotes"
              :key="option.host"
              v-close-popup
              clickable
              @click.native="setPreset(option)"
            >
              <q-item-section>
                <q-item-label>{{ option.host }}:{{ option.port }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </BeldexField>
      <BeldexField :label="$t('fieldLabels.remoteNodePort')">
        <q-input
          v-model="config_daemon.remote_port"
          :placeholder="toString(daemon_defaults.remote_port)"
          :decimals="0"
          :step="1"
          min="1024"
          max="65535"
          dark
          borderless
          dense
          mask="######"
          unmasked-value
        />
      </BeldexField>
    </div>

    <div class="settings-general__grid settings-general__grid--2">
      <BeldexField
        class="beldex-field--with-action"
        :label="$t('fieldLabels.dataStoragePath')"
        disable-hover
      >
        <q-input v-model="config.app.data_dir" disable dark borderless dense />
        <q-btn flat no-caps @click="selectPath('data')">
          {{ $t("buttons.selectLocation") }}
        </q-btn>
      </BeldexField>
      <BeldexField
        class="beldex-field--with-action"
        :label="$t('fieldLabels.walletStoragePath')"
        disable-hover
      >
        <q-input
          v-model="config.app.wallet_data_dir"
          disable
          dark
          borderless
          dense
        />
        <q-btn flat no-caps @click="selectPath('wallet')">
          {{ $t("buttons.selectLocation") }}
        </q-btn>
      </BeldexField>
    </div>

    <q-expansion-item
      class="beldex-collapse"
      header-class="non-selectable"
      :label="$t('strings.advancedOptions')"
    >
      <div class="settings-general__advanced">
        <div class="settings-general__grid settings-general__grid--2">
          <BeldexField
            :label="$t('fieldLabels.daemonLogLevel')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.log_level"
              :placeholder="toString(daemon_defaults.log_level)"
              :disable="is_remote"
              dark
              :decimals="0"
              :step="1"
              min="0"
              max="4"
              borderless
              dense
              mask="######"
              unmasked-value
            />
          </BeldexField>
          <BeldexField :label="$t('fieldLabels.walletLogLevel')">
            <q-input
              v-model="config.wallet.log_level"
              :placeholder="toString(defaults.wallet.log_level)"
              dark
              :decimals="0"
              :step="1"
              min="0"
              max="4"
              borderless
              dense
              mask="######"
              unmasked-value
            />
          </BeldexField>
        </div>

        <div class="settings-general__grid settings-general__grid--4">
          <!-- TODO: Can be generalised to a "port" (or similar) field -->
          <BeldexField
            :label="$t('fieldLabels.maxIncomingPeers')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.in_peers"
              :placeholder="toString(daemon_defaults.in_peers)"
              :disable="is_remote"
              dark
              type="number"
              :decimals="0"
              :step="1"
              min="-1"
              max="65535"
              borderless
              dense
              @keydown="keyHandler"
            />
          </BeldexField>
          <BeldexField
            :label="$t('fieldLabels.maxOutgoingPeers')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.out_peers"
              :placeholder="toString(daemon_defaults.out_peers)"
              :disable="is_remote"
              dark
              type="number"
              :decimals="0"
              :step="1"
              min="-1"
              max="65535"
              borderless
              dense
              @keydown="keyHandler"
            />
          </BeldexField>
          <BeldexField
            :label="$t('fieldLabels.limitUploadRate')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.limit_rate_up"
              :placeholder="toString(daemon_defaults.limit_rate_up)"
              :disable="is_remote"
              dark
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
          </BeldexField>
          <BeldexField
            :label="$t('fieldLabels.limitDownloadRate')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.limit_rate_down"
              :placeholder="toString(daemon_defaults.limit_rate_down)"
              :disable="is_remote"
              dark
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
          </BeldexField>
        </div>

        <div class="settings-general__grid settings-general__grid--3">
          <BeldexField
            :label="$t('fieldLabels.daemonP2pPort')"
            :disable="is_remote"
          >
            <q-input
              v-model="config_daemon.p2p_bind_port"
              :placeholder="toString(daemon_defaults.p2p_bind_port)"
              :disable="is_remote"
              dark
              :decimals="0"
              :step="1"
              min="1024"
              max="65535"
              borderless
              dense
              mask="######"
              unmasked-value
            />
          </BeldexField>
          <BeldexField :label="$t('fieldLabels.internalWalletPort')">
            <q-input
              v-model="config.app.ws_bind_port"
              :placeholder="toString(defaults.app.ws_bind_port)"
              dark
              :decimals="0"
              :step="1"
              min="1024"
              max="65535"
              borderless
              dense
              mask="######"
              unmasked-value
            />
          </BeldexField>
          <BeldexField
            :label="$t('fieldLabels.walletRPCPort')"
            :disable="is_remote"
          >
            <q-input
              v-model="config.wallet.rpc_bind_port"
              :placeholder="toString(defaults.wallet.rpc_bind_port)"
              :disable="is_remote"
              dark
              :decimals="0"
              :step="1"
              min="1024"
              max="65535"
              borderless
              dense
              mask="######"
              unmasked-value
            />
          </BeldexField>
        </div>
      </div>

      <div class="settings-general__network" role="radiogroup">
        <span class="settings-general__network-label">
          {{ $t("fieldLabels.network") }}
        </span>
        <button
          v-for="net in ['mainnet', 'stagenet', 'testnet']"
          :key="net"
          type="button"
          role="radio"
          class="settings-general__network-option"
          :class="{
            'settings-general__network-option--active':
              config.app.net_type === net
          }"
          :aria-checked="config.app.net_type === net ? 'true' : 'false'"
          @click="config.app.net_type = net"
        >
          <span
            class="beldex-check"
            :class="{ 'beldex-check--on': config.app.net_type === net }"
          />
          {{ $t(`strings.netTypes.${net}`) }}
        </button>
      </div>
    </q-expansion-item>

    <div class="settings-general__actions">
      <q-btn
        v-if="!welcome"
        class="beldex-btn"
        unelevated
        no-caps
        :disable="saveBtnValidation(config_daemon)"
        :label="$t('buttons.save')"
        @click="save"
      />
      <q-btn
        v-else
        class="beldex-btn"
        unelevated
        no-caps
        @click="$emit('clickNext')"
      >
        {{ $t("buttons.next") }}
        <img src="~assets/icons/arrow-right.svg" alt="" />
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BeldexField from "components/beldex_field";
import { dialog } from "src/shims/electron-renderer";
export default {
  name: "SettingsGeneral",
  components: {
    BeldexField
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
    async selectPath(type) {
      const path = await dialog.selectDirectory({
        title:
          type === "data"
            ? this.$t("fieldLabels.dataStoragePath")
            : this.$t("fieldLabels.walletStoragePath")
      });
      if (!path) return;
      if (type === "data") {
        this.config.app.data_dir = path;
      } else {
        this.config.app.wallet_data_dir = path;
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
// Configuration step and General settings tab.
.settings-general {
  display: flex;
  flex-direction: column;
  gap: 30px;

  &__topology {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 14px 30px 19px 21px;
    border: 1px solid var(--beldex-border-strong);
  }

  &__topology-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-4);
  }

  &__ringct {
    font-size: var(--beldex-text-xs);
    line-height: 16px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--beldex-accent);
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: 26px;

    .beldex-option {
      gap: 10px;
      font-size: var(--beldex-text-base);
      font-weight: 600;
    }
  }

  &__description {
    margin: 0;
    font-size: var(--beldex-text-md);
  }

  &__bolt {
    color: var(--beldex-accent);
  }

  &__grid {
    display: grid;
    gap: var(--beldex-space-3);

    &--2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    &--4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &__presets {
    color: var(--beldex-accent);
    padding: 0;
    // Keep the host field the same height as the port field next to it.
    // `!important` beats the generic `.beldex-field .q-btn` pill rules.
    width: 24px !important;
    height: 24px !important;
    min-height: 0;
    margin: 0;
    padding: 0 !important;
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none;

    .q-btn__content,
    .q-btn-dropdown__arrow {
      margin: 0 !important;
      line-height: 1;
    }

    .q-icon {
      color: var(--beldex-accent) !important;
      font-size: 20px;
    }
  }

  &__advanced {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-4);
  }

  &__network {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--beldex-space-6);
    margin-top: var(--beldex-space-5);
    padding: 14px 18px;
    border: 1px solid var(--beldex-border-strong);
  }

  &__network-label {
    font-size: var(--beldex-text-base);
    color: var(--beldex-text-strong);
    text-transform: uppercase;
  }

  &__network-option {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-base);
    color: var(--beldex-text-muted);
    background: transparent;
    border: 0;
    cursor: pointer;

    &--active {
      font-weight: 600;
      color: var(--beldex-text);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: calc(var(--beldex-space-3) - 30px);

    // Save / Next: 32px sides and dark green text, as in the design.
    .beldex-btn.q-btn {
      padding: 0 32px;
      color: #002203;
    }

    .beldex-btn img {
      width: 11px;
      height: 11px;
    }
  }
}
</style>
