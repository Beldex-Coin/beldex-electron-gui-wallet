<template>
  <q-layout view="hHh Lpr lFf" class="welcome-layout">
    <q-header class="welcome-layout__header">
      <!-- Gear menu left out: its Settings item edits the same pending_config
           this wizard is building. -->
      <BeldexTopBar
        :net-type="($store.state.gateway.app.pending_config.app || {}).net_type"
      />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import BeldexTopBar from "components/beldex_top_bar";

export default {
  // name: 'LayoutName',
  components: {
    BeldexTopBar
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.welcome-layout {
  min-height: 100vh;

  .welcome-layout__header {
    background: transparent;
    color: inherit;
  }
}
</style>
