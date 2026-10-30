<template>
  <!-- Available masternodes. -->
  <div v-if="toggleVisible" class="master-node-stake-tab contribute">
    <div class="contribute__head">
      <h3 class="contribute__title">
        {{ $t("titles.availableForContribution") }}
      </h3>
      <q-btn
        class="beldex-btn beldex-btn--ghost contribute__refresh"
        unelevated
        no-caps
        icon="refresh"
        :label="$t('buttons.refresh')"
        @click="updateMasterNodeList"
      />
    </div>
    <div v-if="awaitingMasterNodes.length == 0" class="contribute__empty">
      <img src="~assets/icons/info.svg" alt="" />
      {{ $t("strings.noMasterNodesCurrentlyAvailable") }}
    </div>
    <MasterNodeList
      v-if="awaitingMasterNodes.length > 0"
      :master-nodes="awaitingMasterNodes"
      button-i18n="buttons.stake"
      :details="details"
      :action="contributeToNode"
    />

    <q-inner-loading :showing="fetching" dark>
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
  <MasterNodeDetails
    v-else
    ref="masterNodeDetailsContribute"
    :action="contributeToNode"
    action-i18n="buttons.stake"
    :node="this.nodeDetails"
    :goback="goback"
  />
</template>

<script>
import { mapState } from "vuex";
import MasterNodeList from "./master_node_list";
import MasterNodeDetails from "./master_node_details";
export default {
  name: "MasterNodeContribute",
  components: {
    MasterNodeList,
    MasterNodeDetails
  },
  props: {
    awaitingMasterNodes: {
      type: Array,
      required: true
    },
    toggleVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      nodeDetails: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    fetching: state => state.gateway.daemon.master_nodes.fetching
  }),
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    contributeToNode(node, event) {
      // stop detail page from popping up
      event.stopPropagation();
      this.scrollToTop();
      const key = node.master_node_pubkey;
      const minContribution = node.minContribution;
      // close the detail popup if it's open
      this.$refs.masterNodeDetailsContribute.isVisible = false;
      this.$emit("onChangeVisible", false);
      this.$emit("contribute", key, minContribution);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.masterNodeInfoFilled")
      });
    },
    details(node) {
      this.nodeDetails = node;
      this.$emit("onChangeVisible", false);
    },
    goback() {
      this.$emit("onChangeVisible", true);
    },
    updateMasterNodeList() {
      this.$gateway.send("wallet", "update_master_node_list");
    }
  }
};
</script>

<style lang="scss">
.beldex-app .contribute {
  position: relative;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--beldex-space-3);
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.35px;
    line-height: 20px;
    color: var(--beldex-text-strong);
  }

  &__refresh.q-btn {
    height: 32px;
    min-height: 32px;
    padding: 0 var(--beldex-space-3);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);

    .q-icon {
      font-size: 14px;
      color: inherit;
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    padding: var(--beldex-space-3) var(--beldex-space-4);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);

    img {
      width: 14px;
      height: 14px;
    }
  }
}

.master-node-stake-tab {
  user-select: none;
}
</style>
