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
            Daemon: {{ daemon.info.height_without_bootstrap }} /
            {{ target_height }} ({{ daemon_local_pct }}%)
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
      if (this.config_daemon.type === "local")
        return Math.max(
          this.daemon.info.height,
          this.daemon.info.target_height
        );
      else return this.daemon.info.height;
    },
    daemon_pct() {
      if (this.config_daemon.type === "local") return this.daemon_local_pct;
      return 0;
    },
    daemon_local_pct() {
      if (this.config_daemon.type === "remote") return 0;
      let pct = (
        (100 * this.daemon.info.height_without_bootstrap) /
        this.target_height
      ).toFixed(1);
      if (
        pct == 100.0 &&
        this.daemon.info.height_without_bootstrap < this.target_height
      )
        return 99.9;
      else return pct;
    },
    wallet_pct() {
      let pct;
      if (this.config_daemon.type == "local_remote") {
        if (this.wallet.info.height == this.target_height) {
          pct = ((100 * this.wallet.info.height) / this.target_height).toFixed(
            1
          );
        } else {
          // pct = ((100 * this.target_height) / this.wallet.info.height).toFixed(
          //   1
          // );
          pct = ((100 * this.wallet.info.height) / this.target_height).toFixed(
            1
          );
          // console.log("pct 0", pct);
        }
      } else {
        pct = ((100 * this.wallet.info.height) / this.target_height).toFixed(1);
      }
      // this.walletStatus()
      if (pct == 100.0 && this.wallet.info.height < this.target_height)
        return 99.9;
      else return pct;
    },
    status() {
      // console.log("deamon details ::", this.daemon.info);
      // console.log("wallet details ::", this.wallet);

      const daemonType = this.config_daemon.type;
      const isSyncing =
        this.daemon.info.height_without_bootstrap < this.target_height;
      const isScanning =
        this.wallet.info.height < this.target_height - 1 &&
        this.wallet.info.height != 0;

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
  })
  // methods:{
  //   walletStatus() {
  //     // console.log("deamon details ::", this.daemon.info);
  //     console.log("walletStatus walletStatus 1::", this.wallet.info);

  //     const daemonType = this.config_daemon.type;
  //     console.log("walletStatus walletStatus 2::", daemonType);

  //     const isSyncing =
  //       this.daemon.info.height_without_bootstrap < this.target_height;
  //     console.log("walletStatus walletStatus 3::",  this.daemon.info.height_without_bootstrap,this.target_height);

  //     const isScanning =
  //       this.wallet.info.height < this.target_height - 1 &&
  //       this.wallet.info.height != 0;
  //     console.log("walletStatus walletStatus 4::",  this.wallet.info.height , this.target_height - 1 , this.wallet.info.height);

  //       // console.log("sync 1::", isSyncing);
  //       // console.log("sync 2::", isScanning);

  //     if (this.update_required) {
  //       // i18n string and class of statusbar
  //       return "updateRequired";
  //     }

  //     if (daemonType === "local") {
  //       if (isSyncing) {
  //         return "syncing";
  //       } else if (isScanning) {
  //         return "scanning";
  //       } else {
  //         return "ready";
  //       }
  //     } else {
  //       if (isScanning) {
  //         console.log("walletStatus walletStatus 5::",isScanning);

  //         return "scanning";
  //       } else if (daemonType === "local_remote" && isSyncing) {
  //         console.log("walletStatus walletStatus 6::",isSyncing,daemonType);

  //         return "syncing";
  //       } else {
  //         console.log("walletStatus walletStatus 7::",'ready');

  //         return "ready";
  //       }
  //     }
  //   }
  // }
};
</script>

<style lang="scss"></style>
