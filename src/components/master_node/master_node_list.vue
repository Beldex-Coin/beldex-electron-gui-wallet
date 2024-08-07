<template>
  <div>
    <q-list class="master-node-list" no-border>
      <q-item
        v-for="node in masterNodes"
        :key="node.master_node_pubkey"
        @click.native="details(nodeWithMinContribution(node))"
      >
        <q-item-section>
          <span v-if="getRole(node)" class="header-label"
            >{{ getRole(node) }}
          </span>

          <q-item-label class="non-selectable">
            <!-- you only have a contribution amount of 0 if you are a "contributor"
            by way of the node having reserved a spot for you on the node -->
            <span
              v-if="
                node.ourContributionAmount === 0 && node.awaitingContribution
              "
            >
              {{ $t("strings.masterNodeDetails.reserved") }} •
            </span>
            <span v-if="node.awaitingContribution" class="contrib-amounts">
              {{ $t("strings.masterNodeDetails.minContribution") }}:
              {{ getMinContribution(node) }} BDX •
              {{ $t("strings.masterNodeDetails.maxContribution") }}:
              {{ openForContriubtionOxen(node) }} BDX
            </span>
          </q-item-label>
          <q-item-label class="ellipsis">
            <span style="font-weight: 600;"
              >{{ $t("strings.masterNodeDetails.snKey") }} </span
            >: {{ node.master_node_pubkey }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <span v-if="node.ourContributionAmount > 0">
            <!-- <span v-if="getRole(node)">{{ getRole(node) }} •</span> -->
            <span class="contri-wrapper">
              {{ $t("strings.contribution") }}:
              <span class="amount">
                <FormatOxen :amount="node.ourContributionAmount" />
              </span>
            </span>
          </span>
          <span class="fee">{{ getFee(node) }}</span>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-if="node.requested_unlock_height === 0"
            color="primary"
            size="md"
            class="unlock-btn"
            :label="$t(buttonI18n)"
            :disabled="!is_ready"
            side
            @click="action(nodeWithMinContribution(node), $event)"
          />
          <q-item-label v-if="node.requested_unlock_height > 0" header>
            {{
              $t("strings.unlockingAtHeight", {
                number: node.requested_unlock_height
              })
            }}
          </q-item-label>
        </q-item-section>
        <ContextMenu
          :menu-items="menuItems"
          @viewOnExplorer="openExplorer(node.master_node_pubkey)"
          @copyMasterNodeKey="copyKey(node.master_node_pubkey)"
        />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { clipboard } from "electron";
import ContextMenu from "components/menus/contextmenu";
import FormatOxen from "components/format_oxen";
import MasterNodeMixin from "src/mixins/master_node_mixin";
import { mapState } from "vuex";

export default {
  name: "MasterNodeList",
  components: {
    ContextMenu,
    FormatOxen
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
.master-node-list {
  .header-label {
    color: #00ad07;
  }
  .unlock-btn {
    min-width: 90px;
    height: 40px;
  }
}
.contri-wrapper {
  color: white;
  .amount {
    font-weight: 600;
    font-size: 1rem;
    padding: unset;
  }
}
</style>
