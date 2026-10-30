<template>
  <!-- Telemetry bar. Heights and status come from the
       existing computeds; only the markup changed. -->
  <footer class="status-footer">
    <div class="status-footer__status">
      <span class="status-footer__dot" :class="[status]" />
      <span class="status-footer__label">{{ $t("footer.status") }} :</span>
      <span class="status-text" :class="[status]">{{
        $t(`footer.${status}`)
      }}</span>
    </div>
    <div class="status-footer__heights">
      <template v-if="config_daemon.type !== 'remote'">
        <span>
          <span class="status-footer__key">Daemon:</span>
          {{ daemon_height }} / {{ target_height }}
          <span class="status-text" :class="[status]"
            >({{ formatPercent(daemon_local_pct) }}%)</span
          >
        </span>
        <span class="status-footer__sep">|</span>
      </template>
      <template v-if="config_daemon.type !== 'local'">
        <span>
          <span class="status-footer__key">{{ $t("footer.remote") }}:</span>
          {{ daemon.info.height }}
        </span>
        <span class="status-footer__sep">|</span>
      </template>
      <span>
        <span class="status-footer__key">{{ $t("footer.wallet") }}:</span>
        {{ wallet_display_height }} / {{ target_height }}
      </span>
      <span class="status-text" :class="[status]"
        >({{ formatPercent(wallet_pct) }}%)</span
      >
    </div>
    <div class="status-bars" :class="[status]">
      <div :style="{ width: daemon_pct + '%' }"></div>
      <div :style="{ width: wallet_pct + '%' }"></div>
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

      if (
        this.config_daemon.type === "local" ||
        this.config_daemon.type === "local_remote"
      ) {
        return Math.max(
          daemonHeight,
          daemonTargetHeight,
          localHeight,
          this.wallet_height
        );
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
        this.wallet_display_height,
        this.target_height
      );
    },
    wallet_height() {
      return this.toSafeHeight(this.wallet.info.height);
    },
    wallet_display_height() {
      if (this.config_daemon.type === "local") {
        return Math.min(this.wallet_height, this.daemon_height);
      }

      return this.wallet_height;
    },
    status() {
      const daemonType = this.config_daemon.type;
      const isSyncing = this.daemon_height < this.target_height;
      const isAwaitingHeights =
        this.wallet_height === 0 ||
        this.toSafeHeight(this.daemon.info.height) === 0;

      if (this.update_required) {
        // i18n string and class of statusbar
        return "updateRequired";
      }

      if (isAwaitingHeights) {
        return "scanning";
      }

      if (daemonType === "local") {
        if (this.wallet_display_height < this.daemon_height - 1 || isSyncing) {
          return "syncing";
        } else {
          return "ready";
        }
      } else {
        if (this.wallet_height < this.target_height - 1) {
          return "syncing";
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
    // One decimal, e.g. "(100.0%)".
    formatPercent(value) {
      return Number(value).toFixed(1);
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

<style lang="scss">
// Telemetry strip (status, heights, version).
.beldex-app .status-footer {
  // Static so the progress line below spans the whole telemetry bar
  // (.wallet-shell__telemetry is the positioned ancestor).
  position: static;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  gap: var(--beldex-space-4);
  min-width: 0;
  height: 100%;
  padding: 0;
  font-size: var(--beldex-text-sm);
  line-height: 16px;
  color: var(--beldex-text);
  background: transparent;
  border: 0;
  border-radius: 0;
  overflow: visible;

  .status-footer__status,
  .status-footer__heights {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-2);
    white-space: nowrap;
  }

  .status-footer__heights {
    gap: var(--beldex-space-3);
    min-width: 0;
    overflow: hidden;
  }

  .status-footer__label {
    color: var(--beldex-text-faint);
    text-transform: uppercase;
  }

  .status-footer__key {
    color: var(--beldex-text-muted);
  }

  .status-footer__sep {
    color: #2c2c2c;
  }

  .status-footer__dot {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: var(--beldex-accent);
    box-shadow: 0 0 6px var(--beldex-accent-glow);

    &.syncing,
    &.scanning {
      background-color: var(--beldex-warning);
      box-shadow: none;
    }

    &.updateRequired {
      background-color: var(--beldex-danger);
      box-shadow: none;
    }
  }

  .status-text {
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--beldex-accent);

    &.syncing,
    &.scanning {
      color: var(--beldex-warning);
    }

    &.updateRequired {
      color: var(--beldex-danger);
    }
  }

  // Sync progress: thin line along the bottom edge of the bar.
  .status-bars {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;

    div {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px;
    }

    div:first-child,
    div:last-child {
      background-color: var(--beldex-accent);
    }

    &.syncing div,
    &.scanning div {
      background-color: var(--beldex-warning);
    }

    &.updateRequired div {
      background-color: var(--beldex-danger);
    }
  }
}
</style>
