<template>
  <q-page class="init-screen">
    <div class="init-screen__splash">
      <img src="~assets/images/splash-k-dither.png" alt="" />
    </div>

    <div class="init-screen__status">
      <div class="init-screen__wordmark">Beldex</div>
      <div class="init-screen__status-line">{{ startupMessage }}</div>
      <div class="init-screen__progress">
        <div
          class="init-screen__progress-value"
          :style="{ width: `${overallPercent}%` }"
        />
      </div>

      <div class="init-screen__steps">
        <div
          v-for="step in steps"
          :key="step.key"
          class="init-screen__step"
          :class="`init-screen__step--${step.state}`"
        >
          <div class="init-screen__step-label">
            <span class="init-screen__indicator" />
            {{ step.label }}
          </div>
          <span class="init-screen__step-meta">{{ step.meta }}</span>
        </div>
      </div>
    </div>

    <div class="init-screen__footer init-screen__footer--version">
      {{ $t("strings.electronWallet") }} · v{{ appVersion }}
    </div>
    <div v-if="netType" class="init-screen__footer init-screen__footer--net">
      <span class="init-screen__net-dot" />
      {{ $t(`strings.netTypes.${netType}`) }}
    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { version } from "../../../package.json";
export default {
  data() {
    return {
      version: "",
      appVersion: version,
      stage: 0,
      stageMessageKey: "strings.connectingToBackend"
    };
  },
  computed: mapState({
    status: state => state.gateway.app.status,
    config: state => state.gateway.app.config,
    daemon: state => state.gateway.daemon,
    wallet: state => state.gateway.wallet,
    configDaemon() {
      if (!this.config || !this.config.app || !this.config.app.net_type) {
        return null;
      }

      return this.config.daemons[this.config.app.net_type] || null;
    },
    daemonTargetHeight() {
      return Math.max(
        this.toSafeHeight(this.daemon.info.height_without_bootstrap),
        this.toSafeHeight(this.daemon.info.height),
        this.toSafeHeight(this.daemon.info.target_height)
      );
    },
    daemonCurrentHeight() {
      if (!this.configDaemon) {
        return 0;
      }

      if (this.configDaemon.type === "local_remote") {
        return this.toSafeHeight(this.daemon.info.height_without_bootstrap);
      }

      return this.toSafeHeight(this.daemon.info.height);
    },
    walletTargetHeight() {
      if (!this.configDaemon) {
        return 0;
      }

      if (
        this.configDaemon.type === "local" ||
        this.configDaemon.type === "local_remote"
      ) {
        return this.daemonTargetHeight;
      }

      return this.toSafeHeight(this.daemon.info.height);
    },
    walletCurrentHeight() {
      return this.toSafeHeight(this.wallet.info.height);
    },
    daemonProgressItem() {
      if (!this.configDaemon) {
        return null;
      }

      if (
        this.configDaemon.type === "remote" ||
        this.daemonTargetHeight === 0 ||
        this.daemonCurrentHeight >= this.daemonTargetHeight
      ) {
        return null;
      }

      return {
        key: "daemon",
        label: this.$t("strings.syncingDaemon"),
        status: `${this.daemonCurrentHeight}/${
          this.daemonTargetHeight
        } (${this.calculatePercent(
          this.daemonCurrentHeight,
          this.daemonTargetHeight
        )}%)`,
        percent: this.calculatePercentNumber(
          this.daemonCurrentHeight,
          this.daemonTargetHeight
        )
      };
    },
    walletProgressItem() {
      if (
        this.walletTargetHeight === 0 ||
        this.walletCurrentHeight === 0 ||
        this.walletCurrentHeight >= this.walletTargetHeight
      ) {
        return null;
      }

      return {
        key: "wallet",
        label: `${this.$t("footer.wallet")} ${this.$t("footer.scanning")}`,
        status: `${this.walletCurrentHeight}/${
          this.walletTargetHeight
        } (${this.calculatePercent(
          this.walletCurrentHeight,
          this.walletTargetHeight
        )}%)`,
        percent: this.calculatePercentNumber(
          this.walletCurrentHeight,
          this.walletTargetHeight
        )
      };
    },
    progressItems() {
      return [this.daemonProgressItem, this.walletProgressItem].filter(Boolean);
    },
    startupMessage() {
      if (this.walletProgressItem) {
        return `${this.$t("footer.wallet")} ${this.$t("footer.scanning")}`;
      }

      if (this.daemonProgressItem) {
        return this.$t("strings.syncingDaemon");
      }

      // Neither progress item exists yet during the early startup stages
      // (connecting to backend, loading settings, starting the daemon
      // before its first height arrives, starting the wallet, reading the
      // wallet list) - show the current stage instead.
      return this.$t(this.stageMessageKey);
    },
    netType() {
      return this.config && this.config.app ? this.config.app.net_type : null;
    },
    daemonVersion() {
      // `beldexd --version` prints e.g. "Beldex 'Obscura' (v7.0.4-4cd63fd51)"
      const match = /v\d+\.\d+\.\d+/.exec(this.version || "");
      return match ? `beldexd ${match[0]}` : "";
    },
    steps() {
      const syncStatus = item => (item ? item.status.split(" ")[0] : "");
      return [
        {
          key: "backend",
          label: this.$t("strings.connectingToBackend"),
          meta: ""
        },
        {
          key: "daemon",
          label: this.$t("strings.startingDaemon"),
          meta: syncStatus(this.daemonProgressItem) || this.daemonVersion
        },
        {
          key: "wallets",
          label: this.$t("strings.readingWalletList"),
          meta: syncStatus(this.walletProgressItem)
        }
      ].map((step, index) => {
        const state =
          index < this.stage
            ? "done"
            : index === this.stage
            ? "active"
            : "pending";
        let meta = step.meta;
        if (state === "pending") {
          meta = "—";
        } else if (state === "done") {
          meta = "✓";
        }
        return { ...step, state, meta };
      });
    },
    overallPercent() {
      const item = this.walletProgressItem || this.daemonProgressItem;
      if (item) {
        return item.percent;
      }
      return ((this.stage + 0.5) / this.steps.length) * 100;
    }
  }),
  watch: {
    status: {
      handler() {
        this.updateStatus();
      },
      deep: true
    }
  },
  mounted() {
    this.updateStatus();
  },
  methods: {
    toSafeHeight(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    },
    calculatePercent(currentHeight, targetHeight) {
      return this.calculatePercentNumber(currentHeight, targetHeight).toFixed(
        1
      );
    },
    calculatePercentNumber(currentHeight, targetHeight) {
      if (targetHeight === 0) {
        return 0;
      }

      const rawPercent = (100 * currentHeight) / targetHeight;
      if (rawPercent >= 100) {
        return currentHeight < targetHeight ? 99.9 : 100;
      }

      return Math.max(0, rawPercent);
    },
    updateStatus() {
      switch (this.status.code) {
        case -1: // config not found, go to welcome screen
          this.$router.replace({ path: "welcome" });
          break;
        case 0: // start-up complete, go to wallet-select
          this.$router.replace({ path: "wallet-select" });
          break;
        case 1:
          this.setStage(0, "strings.connectingToBackend");
          break;
        case 2:
          this.setStage(1, "strings.loadingSettings");
          break;
        case 3:
          this.setStage(1, "strings.startingDaemon");
          break;
        case 4:
          this.version = this.status.message;
          break;
        case 5:
          this.$q.notify({
            type: "warning",
            timeout: 2000,
            message:
              "Warning: " + this.$t("notification.warnings.usingRemoteNode")
          });
          break;
        case 6:
          this.setStage(2, "strings.startingWallet");
          break;
        case 7:
          this.setStage(2, "strings.readingWalletList");
          break;
      }
    },
    // Codes 4/5 overwrite status.code mid-startup, so the stage only
    // ever moves forward and the step list doesn't flicker back.
    setStage(stage, messageKey) {
      if (stage < this.stage) {
        return;
      }
      this.stage = stage;
      this.stageMessageKey = messageKey;
    }
  }
};
</script>

<style lang="scss">
.init-screen {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  // Design places the block 189px from the top of a 900px frame, 21px
  // above true centre.
  padding-bottom: 21px;
  overflow: hidden;
  background-color: var(--beldex-bg);
}

// The splash art is a full 1440x900 image; only its 261px band is shown,
// centred horizontally at any window width.
.init-screen__splash {
  position: relative;
  flex: none;
  width: 100%;
  height: 261px;
  overflow: hidden;
  pointer-events: none;

  img {
    position: absolute;
    top: -221px;
    left: 50%;
    width: 1440px;
    height: 900px;
    max-width: none;
    transform: translateX(-50%);
  }
}

.init-screen__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.init-screen__wordmark {
  font-family: var(--beldex-font-display);
  font-size: 28px;
  line-height: 34px;
  letter-spacing: 2.8px;
  color: var(--beldex-text-strong);
  text-transform: uppercase;
  white-space: nowrap;
}

.init-screen__status-line {
  margin-top: 16px;
  font-family: var(--beldex-font-mono);
  font-size: var(--beldex-text-sm);
  line-height: 16px;
  letter-spacing: 1.65px;
  color: var(--beldex-text-subtle);
  text-transform: uppercase;
  white-space: nowrap;
}

.init-screen__progress {
  position: relative;
  width: 240px;
  height: 2px;
  margin-top: 14px;
  background-color: rgba(235, 235, 235, 0.08);
}

.init-screen__progress-value {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--beldex-accent);
  transition: width 0.25s ease;
}

.init-screen__steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
  margin-top: 36px;
}

.init-screen__step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--beldex-font-mono);
  font-size: var(--beldex-text-md);
  line-height: 16px;
  color: var(--beldex-text-faint);
  white-space: nowrap;
}

.init-screen__step-label {
  display: flex;
  align-items: center;
  gap: 12px;
}

.init-screen__indicator {
  position: relative;
  flex: none;
  width: 12px;
  height: 12px;
  background-color: #000000;
  border: 1px solid var(--beldex-text-faint);
}

.init-screen__step--active {
  .init-screen__step-label {
    color: var(--beldex-text);
  }

  .init-screen__step-meta {
    color: var(--beldex-text-muted);
  }

  .init-screen__indicator {
    border-color: var(--beldex-accent);
    filter: drop-shadow(0 0 3px rgba(0, 191, 10, 0.6));

    &::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 4px;
      height: 4px;
      background-color: var(--beldex-accent);
    }
  }
}

.init-screen__step--done {
  .init-screen__step-label,
  .init-screen__step-meta {
    color: var(--beldex-text-muted);
  }

  // Not in the design (it only shows active/pending); active marker
  // without the glow.
  .init-screen__indicator {
    border-color: var(--beldex-accent-border-strong);

    &::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 4px;
      height: 4px;
      background-color: var(--beldex-accent);
    }
  }
}

.init-screen__footer {
  position: absolute;
  bottom: 32px;
  font-family: var(--beldex-font-mono);
  font-size: var(--beldex-text-sm);
  line-height: 16px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  white-space: nowrap;

  &--version {
    left: 40px;
    color: var(--beldex-text-faint);
  }

  &--net {
    right: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--beldex-text-subtle);
  }
}

.init-screen__net-dot {
  width: 6px;
  height: 6px;
  background-color: var(--beldex-accent);
}
</style>
