<template>
  <q-layout view="hHh Lpr lFf" class="wallet-select-layout">
    <q-header class="wallet-select-layout__header">
      <BeldexTopBar
        :net-type="($store.state.gateway.app.config.app || {}).net_type"
      >
        <template #actions>
          <MainMenu :disable-switch-wallet="true" />
        </template>
      </BeldexTopBar>
    </q-header>

    <q-page-container>
      <router-view ref="page" />
    </q-page-container>
  </q-layout>
</template>

<script>
// import StatusFooter from "components/footer";
import MainMenu from "components/menus/mainmenu";
import BeldexTopBar from "components/beldex_top_bar";

export default {
  components: {
    // StatusFooter,
    MainMenu,
    BeldexTopBar
  },
  data() {
    return {};
  },
  computed: {
    show_menu() {
      return this.$route.name === "wallet-select";
    },
    page_title() {
      switch (this.$route.name) {
        case "wallet-create":
          return this.$t("titles.wallet.createNew");
        case "wallet-restore":
          return this.$t("titles.wallet.restoreFromSeed");
        case "wallet-import":
          return this.$t("titles.wallet.importFromFile");
        case "wallet-import-view-only":
          return this.$t("titles.wallet.restoreViewOnly");
        case "wallet-import-legacy":
          return this.$t("titles.wallet.importFromLegacyGUI");
        case "wallet-import-old-gui":
          return this.$t("titles.wallet.importFromOldGUI");
        case "wallet-created":
          return this.$t("titles.wallet.createdOrRestored");

        default:
        case "wallet-select":
          return "Beldex";
      }
    }
  },
  watch: {
    $route() {
      this.$q.loading.hide();
    }
  },
  mounted() {
    this.$q.loading.hide();
  },

  methods: {
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
      this.$gateway.send("wallet", "close_wallet");
      setTimeout(() => {
        // short delay to prevent wallet data reaching the
        // websocket moments after we close and reset data
        this.$store.dispatch("gateway/resetWalletData");
      }, 250);
    }
  }
};
</script>

<style lang="scss">
.wallet-select-layout {
  min-height: 100vh;

  .wallet-select-layout__header {
    background: transparent;
    color: inherit;
  }
}
</style>
