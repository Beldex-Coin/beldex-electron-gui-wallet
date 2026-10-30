<template>
  <!-- Masternode rows. Handlers and data are unchanged. -->
  <div class="master-node-list">
    <div
      v-for="node in masterNodes"
      :key="node.master_node_pubkey"
      class="master-node-list__row"
      @click="details(nodeWithMinContribution(node))"
    >
      <span
        class="master-node-list__icon"
        :class="{
          'master-node-list__icon--op': node.operator_address === our_address
        }"
      >
        <img src="~assets/icons/rail-masternode.svg" alt="" />
      </span>
      <div class="master-node-list__main">
        <div class="master-node-list__head">
          <span
            v-if="getRole(node)"
            class="master-node-list__role"
            :class="{
              'master-node-list__role--op':
                node.operator_address === our_address
            }"
          >
            {{ getRole(node) }}
          </span>
          <span v-if="node.ourContributionAmount > 0" class="contri-wrapper">
            {{ $t("strings.contribution") }}:
            <FormatBeldex :amount="node.ourContributionAmount" />
          </span>
          <!-- you only have a contribution amount of 0 if you are a
               "contributor" by way of the node having reserved a spot for you -->
          <span
            v-if="node.ourContributionAmount === 0 && node.awaitingContribution"
            class="master-node-list__meta"
          >
            {{ $t("strings.masterNodeDetails.reserved") }}
          </span>
          <span
            v-if="node.awaitingContribution"
            class="master-node-list__meta contrib-amounts"
          >
            {{ $t("strings.masterNodeDetails.minContribution") }}:
            {{ getMinContribution(node) }} BDX ·
            {{ $t("strings.masterNodeDetails.maxContribution") }}:
            {{ openForContriubtionOxen(node) }} BDX
          </span>
        </div>
        <div class="master-node-list__key beldex-truncate">
          {{ $t("strings.masterNodeKeyShort") }}: {{ node.master_node_pubkey }}
        </div>
      </div>
      <div class="master-node-list__fee">
        <div class="master-node-list__fee-row">
          <span class="master-node-list__bar">
            <span
              class="master-node-list__bar-fill"
              :style="{
                width: `${Math.min(
                  100,
                  (node.portions_for_operator / 18446744073709551612) * 100
                )}%`
              }"
            />
          </span>
          <span>{{ getFee(node) }}</span>
        </div>
      </div>
      <q-btn
        v-if="node.requested_unlock_height === 0"
        class="beldex-btn beldex-btn--ghost master-node-list__btn"
        unelevated
        no-caps
        :label="$t(buttonI18n)"
        :disabled="!is_ready"
        @click="action(nodeWithMinContribution(node), $event)"
      />
      <span
        v-if="node.requested_unlock_height > 0"
        class="master-node-list__meta"
      >
        {{
          $t("strings.unlockingAtHeight", {
            number: node.requested_unlock_height
          })
        }}
      </span>
      <ContextMenu
        :menu-items="menuItems"
        @viewOnExplorer="openExplorer(node.master_node_pubkey)"
        @copyMasterNodeKey="copyKey(node.master_node_pubkey)"
      />
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import ContextMenu from "components/menus/contextmenu";
import FormatBeldex from "components/format_beldex";
import MasterNodeMixin from "src/mixins/master_node_mixin";
import { mapState } from "vuex";

export default {
  name: "MasterNodeList",
  components: {
    ContextMenu,
    FormatBeldex
  },
  mixins: [MasterNodeMixin],
  props: {
    masterNodes: {
      type: Array,
      required: true
    },
    details: {
      type: Function,
      required: true
    },
    buttonI18n: {
      type: String,
      required: true
    },
    action: {
      type: Function,
      required: true
    }
  },
  data() {
    const menuItems = [
      { action: "copyMasterNodeKey", i18n: "menuItems.copyMasterNodeKey" },
      { action: "viewOnExplorer", i18n: "menuItems.viewOnExplorer" }
    ];
    return {
      menuItems
    };
  },
  computed: mapState({
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    }
  }),
  methods: {
    nodeWithMinContribution(node) {
      const nodeWithMinContribution = {
        ...node,
        minContribution: this.getMinContribution(node)
      };
      return nodeWithMinContribution;
    },
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    getRole(node) {
      let role = "";
      const opAddress = node.operator_address;
      if (opAddress === this.our_address) {
        role = "strings.operator";
      } else if (node.ourContributionAmount && opAddress !== this.our_address) {
        // if we're not the operator and we have a contribution amount
        role = "strings.contributor";
      }
      return this.$t(role);
    },
    getNumContributors(node) {
      return node.contributors.length;
    },
    getFee(node) {
      const operatorPortion = node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee.toFixed(2)}% ${this.$t(
        "strings.transactions.fee"
      )}`;
    },
    copyKey(key) {
      clipboard.writeText(key);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.copied", {
          item: "Master node key"
        })
      });
    },
    openExplorer(key) {
      this.$gateway.send("core", "open_explorer", {
        type: "master_node",
        id: key
      });
    }
  }
};
</script>

<style lang="scss">
.beldex-app .master-node-list {
  display: flex;
  flex-direction: column;

  &__row {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
    min-height: 63px;
    padding: var(--beldex-space-3) var(--beldex-space-1);
    border-bottom: 1px solid var(--beldex-hairline);
    cursor: pointer;

    &:hover {
      background-color: var(--beldex-accent-bg);
    }
  }

  &__icon {
    display: flex;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    height: 28px;
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid var(--beldex-border);

    img {
      width: 14px;
      height: 14px;
    }

    &--op {
      background-color: var(--beldex-accent-bg);
      border-color: var(--beldex-accent-border-soft);
    }
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--beldex-space-2);
    margin-bottom: var(--beldex-space-1);
  }

  &__role {
    padding: 2px var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 15px;
    color: var(--beldex-text-muted);
    text-transform: uppercase;
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid var(--beldex-border);

    &--op {
      color: var(--beldex-accent);
      background-color: var(--beldex-accent-bg);
      border-color: var(--beldex-accent-border-soft);
    }
  }

  .contri-wrapper {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text);
  }

  &__meta {
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-muted);
  }

  &__key {
    font-size: var(--beldex-text-sm);
    line-height: 16px;
    color: var(--beldex-text-faint);
  }

  &__fee {
    flex: 0 0 auto;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 500;
    color: var(--beldex-text-muted);
  }

  &__fee-row {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
  }

  &__bar {
    width: 46px;
    height: 2px;
    background-color: var(--beldex-hairline);
  }

  &__bar-fill {
    display: block;
    height: 100%;
    background-color: var(--beldex-accent);
  }

  &__btn.q-btn {
    min-width: 90px;
    height: 32px;
    min-height: 32px;
    padding: 0 var(--beldex-space-3);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);
  }
}
</style>
