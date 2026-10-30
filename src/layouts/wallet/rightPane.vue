<template>
  <!-- Send / Receive / Contacts panel. Tabs still go through
       router() → set_router_path_rightpane, as before. -->
  <section class="wallet-pane">
    <div class="wallet-pane__head">
      <div class="beldex-segmented" role="tablist">
        <button
          v-for="tab in [
            { key: 'send', label: $t('buttons.send') },
            { key: 'receive', label: $t('buttons.receive') },
            { key: 'address', label: $t('buttons.contacts') }
          ]"
          :key="tab.key"
          type="button"
          role="tab"
          class="beldex-segmented__item"
          :class="{ 'beldex-segmented__item--active': routes === tab.key }"
          :aria-selected="routes === tab.key ? 'true' : 'false'"
          @click="router(tab.key)"
        >
          <span v-if="routes === tab.key" class="beldex-segmented__dot" />
          {{ tab.label }}
        </button>
      </div>
      <q-btn
        v-if="routes === 'address'"
        class="beldex-btn wallet-pane__add"
        unelevated
        no-caps
        @click="$refs.contacts.addEntry()"
      >
        <img src="~assets/icons/plus.svg" alt="" />
        {{ $t("buttons.add") }}
      </q-btn>
    </div>
    <div class="wallet-pane__body">
      <!-- Same structure as before: the div wrappers mean keep-alive caches
           nothing, so each tab is re-created on switch (unchanged behaviour). -->
      <keep-alive>
        <div v-if="routes === 'send'">
          <Send />
        </div>
        <div v-else-if="routes === 'receive'">
          <Receive />
        </div>
        <div v-else>
          <Adressbook ref="contacts" />
        </div>
      </keep-alive>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import Send from "pages/wallet/send";
import Receive from "pages/wallet/receive";
import Adressbook from "pages/wallet/addressbook.vue";

export default {
  name: "RightPane",
  components: {
    Send,
    Receive,
    Adressbook
  },
  computed: mapState({
    info: state => state.gateway.wallet.info,
    view_only: state => state.gateway.wallet.info.view_only,
    routes: state => state.gateway.router_path_rightpane
  }),
  methods: {
    router: function(e) {
      this.$gateway.send("wallet", "set_sender_address", {
        data: ""
      });
      this.$gateway.send("wallet", "set_router_path_rightpane", { data: e });
    }
  }
};
</script>

<style lang="scss">
.wallet-pane {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);
  min-height: 100%;

  &__head {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;

    > * {
      flex: 1 1 auto;
    }
  }
}

// Beats `.beldex-app .beldex-btn` (uppercase mono, wide padding).
.beldex-app .wallet-pane__add.beldex-btn {
  min-height: 32px;
  padding: 0 var(--beldex-space-4);
  font-family: var(--beldex-font-sans-medium);
  text-transform: none;
  color: #000;

  img {
    width: 12px;
    height: 12px;
  }
}
</style>
