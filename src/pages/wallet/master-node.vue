<template>
  <!-- Masternode. No "Rewards earned" stat: there is no rewards data in the
       store. -->
  <q-page class="master-node-page" style="min-height: unset">
    <section class="master-node-page__main">
      <div v-if="toggleVisible" class="master-node-page__head">
        <div class="beldex-segmented" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            role="tab"
            class="beldex-segmented__item"
            :class="{ 'beldex-segmented__item--active': screen === tab.value }"
            :aria-selected="screen === tab.value ? 'true' : 'false'"
            @click="screen = tab.value"
          >
            <span v-if="screen === tab.value" class="beldex-segmented__dot" />
            {{ tab.label }}
          </button>
        </div>
        <span class="beldex-hint">{{ $t("strings.masterNodesHint") }}</span>
      </div>
      <MasterNodeUnlock
        v-if="screen === 'myStakes'"
        @goToStake="screen = 'staking'"
        @onChangeVisible="onChangeVisible"
      />
      <MasterNodeStaking
        v-if="screen === 'staking'"
        :toggle-visible="toggleVisible"
        @onChangeVisible="onChangeVisible"
      />
      <MasterNodeRegistration v-if="screen === 'registration'" />
    </section>

    <aside class="master-node-page__side">
      <div class="master-node-page__side-head">
        <h2 class="master-node-page__side-title">
          {{ $t("strings.stakingSummary") }}
        </h2>
        <span class="beldex-chip">
          {{ $t(`strings.netTypes.${netType}`) }}
        </span>
      </div>
      <div class="master-node-page__stats">
        <div class="master-node-page__stat">
          <span class="beldex-label">{{ $t("strings.totalStaked") }}</span>
          <span class="master-node-page__stat-value">
            {{ totalStaked }}
            <span class="master-node-page__stat-unit">BDX</span>
          </span>
        </div>
        <div class="master-node-page__stat">
          <span class="beldex-label">{{ $t("strings.activeStakes") }}</span>
          <span class="master-node-page__stat-value">{{ activeStakes }}</span>
        </div>
        <div class="master-node-page__stat">
          <span class="beldex-label">{{
            $t("strings.deregisteredStakes")
          }}</span>
          <span class="master-node-page__stat-value">{{
            deregisteredStakes
          }}</span>
        </div>
        <div class="master-node-page__stat">
          <span class="beldex-label">{{ $t("strings.unlockPeriod") }}</span>
          <span class="master-node-page__stat-value">{{
            $t("strings.unlockPeriodValue")
          }}</span>
        </div>
      </div>
      <div class="master-node-page__note">
        <img src="~assets/icons/note-info.svg" alt="" />
        <p>{{ $t("strings.stakingSummaryNote") }}</p>
      </div>
      <button type="button" class="master-node-page__docs" @click="openDocs">
        <q-icon name="open_in_new" size="12px" />
        {{ $t("strings.readStakingDocs") }}
      </button>
    </aside>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import MasterNodeStaking from "components/master_node/master_node_staking";
import MasterNodeRegistration from "components/master_node/master_node_registration";
import MasterNodeUnlock from "components/master_node/master_node_unlock";

export default {
  components: {
    MasterNodeStaking,
    MasterNodeRegistration,
    MasterNodeUnlock
  },

  data() {
    return {
      screen: "myStakes",
      toggleVisible: true
    };
  },
  computed: {
    ...mapState({
      netType: state => state.gateway.app.config.app.net_type,
      ourAddress: state => {
        const primary = state.gateway.wallet.address_list.primary[0];
        return (primary && primary.address) || null;
      },
      nodes: state => state.gateway.daemon.master_nodes.nodes || [],
      deregisterNodes: state => {
        const signed = state.gateway.daemon.signed_key_images || [];
        return (state.gateway.daemon.master_nodes_deregister || []).filter(n =>
          signed.some(k => k.key_image === n.key_image)
        );
      }
    }),
    tabs() {
      return [
        { label: this.$t("titles.masterNode.myStakes"), value: "myStakes" },
        { label: this.$t("titles.masterNode.staking"), value: "staking" },
        {
          label: this.$t("titles.masterNode.registration"),
          value: "registration"
        }
      ];
    },
    // Our contributions (amount > 0), same filter as MasterNodeUnlock.
    ownContributions() {
      return this.nodes
        .map(node =>
          node.contributors.find(
            c => c.address === this.ourAddress && c.amount > 0
          )
        )
        .filter(Boolean);
    },
    totalStaked() {
      const total = this.ownContributions.reduce((sum, c) => sum + c.amount, 0);
      return (total / 1e9).toLocaleString();
    },
    activeStakes() {
      return this.ownContributions.length;
    },
    deregisteredStakes() {
      return this.deregisterNodes.length;
    }
  },
  methods: {
    openDocs() {
      this.$gateway.send("core", "open_url", { url: "https://www.beldex.io/" });
    },
    onChangeVisible(value) {
      this.toggleVisible = value;
    }
  }
};
</script>

<style lang="scss">
.beldex-app .master-node-page {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  gap: var(--beldex-space-5);
  min-height: 0 !important; // beats q-page's inline min-height
  padding: 0;
  // app.styl `.master-node-page` card (purple background, radius, shadow).
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  // app.styl gives each tab body a purple background and a fixed height with
  // its own scrollbar (`.master-node-staking, .master-node-stake-tab, ...`).
  .master-node-staking,
  .master-node-stake-tab,
  .master-node-registration {
    min-height: 0;
    height: auto;
    overflow-y: visible;
    background-color: transparent;
  }

  &__main,
  &__side {
    padding: var(--beldex-space-5);
    background-color: var(--beldex-panel-glass);
    border: 1px solid var(--beldex-border);
  }

  &__main {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
  }

  &__side {
    position: sticky;
    top: 0;
    display: flex;
    flex: 0 0 400px;
    flex-direction: column;
    gap: var(--beldex-space-5);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    margin-bottom: var(--beldex-space-5);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__side-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__side-title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    line-height: 20px;
    color: var(--beldex-text-strong);
  }

  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--beldex-space-4);
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px var(--beldex-space-4);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  &__stat-value {
    font-family: var(--beldex-font-mono);
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    color: var(--beldex-text-strong);
  }

  &__stat-unit {
    font-size: var(--beldex-text-md);
    color: var(--beldex-accent);
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: var(--beldex-space-3);
    padding: 12px 14px;
    font-size: var(--beldex-text-sm);
    line-height: 17px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);

    img {
      flex: 0 0 auto;
      margin-top: 2px;
    }

    p {
      margin: 0;
    }
  }

  &__docs {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
    align-self: flex-start;
    padding: 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text);
    cursor: pointer;
    background: transparent;
    border: 0;

    &:hover {
      color: var(--beldex-text-strong);
    }
  }
}
</style>
