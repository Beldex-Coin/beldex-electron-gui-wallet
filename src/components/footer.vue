<template>
  <footer class="status-footer q-mt-md">
    <div class="status-bars" :class="[status]">
      <div :style="{ width: daemon_pct + '%' }"></div>
      <div :style="{ width: wallet_pct + '%' }"></div>
    </div>
    <div class="status-line row items-center">
      <div class="status row items-center">
        <span class="ft-medium">{{ $t("footer.status") }}:</span>
        <span class="status-text ft-semibold" :class="[status]">{{
          $t(`footer.${status}`)
        }}</span>
      </div>
      <div class="row ft-medium">
        <template v-if="config_daemon.type !== 'remote'">
          <div>
            Daemon: {{ daemon_height }} / {{ target_height }} ({{
              daemon_local_pct
            }}%)
          </div>
        </template>

        <template v-if="config_daemon.type !== 'local'">
          <div>{{ $t("footer.remote") }}: {{ daemon.info.height }}</div>
        </template>

        <div>
          {{ $t("footer.wallet") }}: {{ wallet.info.height }} /
          {{ target_height }} ({{ wallet_pct }}%)
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StatusFooter",
  data() {
    return {};
  },
  computed: mapState({
    config: state => state.gateway.app.config,
    daemon: state => state.gateway.daemon,
    wallet: state => state.gateway.wallet,
    update_required: state => state.gateway.update_required,

    config_daemon() {
      return this.config.daemons[this.config.app.net_type];
    },
    target_height() {
      const daemonHeight = this.toSafeHeight(this.daemon.info.height);
      const daemonTargetHeight = this.toSafeHeight(
        this.daemon.info.target_height
      );
      const localHeight = this.toSafeHeight(
        this.daemon.info.height_without_bootstrap
      );

      if (this.config_daemon.type === "local") {
        return Math.max(daemonHeight, daemonTargetHeight, localHeight);
      }

      if (this.config_daemon.type === "local_remote") {
        return Math.max(daemonHeight, daemonTargetHeight, localHeight);
      }

      return daemonHeight;
    },
    daemon_pct() {
      if (this.config_daemon.type === "local") return this.daemon_local_pct;
      return 0;
    },
    daemon_height() {
      if (this.config_daemon.type === "local_remote") {
        return this.toSafeHeight(this.daemon.info.height_without_bootstrap);
      }

      return this.toSafeHeight(this.daemon.info.height);
    },
    daemon_local_pct() {
      if (this.config_daemon.type === "remote") return 0;
      return this.calculatePercent(this.daemon_height, this.target_height);
    },
    wallet_pct() {
      return this.calculatePercent(
        this.toSafeHeight(this.wallet.info.height),
        this.target_height
      );
    },
    wallet_height() {
      return this.toSafeHeight(this.wallet.info.height);
    },
    isWalletRpcSyncing() {
      return this.wallet.isRPCSyncing === true;
    },
    status() {
      const daemonType = this.config_daemon.type;
      const isSyncing = this.daemon_height < this.target_height;
      const hasSyncTarget = this.target_height > 0;
      const isScanning = hasSyncTarget
        ? this.wallet_height < this.target_height - 1
        : this.isWalletRpcSyncing;

      if (this.update_required) {
        // i18n string and class of statusbar
        return "updateRequired";
      }

      if (daemonType === "local") {
        if (isSyncing) {
          return "syncing";
        } else if (isScanning) {
          return "scanning";
        } else {
          return "ready";
        }
      } else {
        if (isScanning) {
          return "scanning";
        } else if (daemonType === "local_remote" && isSyncing) {
          return "syncing";
        } else {
          return "ready";
        }
      }
    }
  }),
  methods: {
    toSafeHeight(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    },
    calculatePercent(currentHeight, targetHeight) {
      const current = this.toSafeHeight(currentHeight);
      const target = this.toSafeHeight(targetHeight);

      if (target === 0) {
        return 0;
      }

      const rawPercent = (100 * current) / target;
      if (rawPercent >= 100) {
        return current < target ? 99.9 : 100;
      }

      return Math.max(0, rawPercent).toFixed(1);
    }
  }
};
</script>

<style lang="scss"></style>
