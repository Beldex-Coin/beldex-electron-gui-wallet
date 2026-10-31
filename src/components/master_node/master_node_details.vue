<template>
  <!-- Masternode details. Props, data and
       handlers are unchanged. -->
  <div class="masterNodeDetails">
    <div class="mn-details__head">
      <button
        type="button"
        class="beldex-square-btn mn-details__back"
        :aria-label="$t('buttons.back')"
        @click="goback()"
      >
        <img src="~assets/icons/arrow-left.svg" alt="" />
      </button>
      <h3 class="mn-details__title">{{ $t("titles.masterNodeDetails") }}</h3>
      <span
        class="mn-details__status"
        :class="{ 'mn-details__status--bad': deregisterDetail }"
      >
        {{
          deregisterDetail
            ? $t("strings.masterNodeDeregistered")
            : $t("strings.masterNodeRegistered")
        }}
      </span>
      <span class="mn-details__spacer" />
      <q-btn
        v-if="!deregisterDetail && node.requested_unlock_height === 0"
        class="beldex-btn mn-details__btn"
        unelevated
        no-caps
        :disabled="!is_ready || unlock_status.sending"
        :label="$t(actionI18n)"
        @click="action(node, $event)"
      />
      <q-btn
        v-if="can_open && !deregisterDetail"
        class="beldex-btn beldex-btn--ghost mn-details__btn"
        unelevated
        no-caps
        :label="$t('buttons.viewOnExplorer')"
        @click="openExplorer"
      />
    </div>

    <div v-if="!deregisterDetail" class="mn-details__body">
      <div class="mn-details__grid">
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.stakingRequirement")
          }}</span>
          <span class="mn-details__value"
            ><FormatBeldex :amount="node.staking_requirement"
          /></span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.totalContributed")
          }}</span>
          <span class="mn-details__value"
            ><FormatBeldex :amount="node.total_contributed"
          /></span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.registrationHeight")
          }}</span>
          <span class="mn-details__value">{{ node.registration_height }}</span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.operatorFee")
          }}</span>
          <span class="mn-details__value">{{ operatorFee }}</span>
        </div>
        <div v-if="node.requested_unlock_height > 0" class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.unlockHeight")
          }}</span>
          <span class="mn-details__value">{{
            node.requested_unlock_height
          }}</span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.lastUptimeProof")
          }}</span>
          <span class="mn-details__value">{{
            node.last_uptime_proof > 0
              ? formatDate(node.last_uptime_proof * 1000)
              : $t("strings.masterNodeDetails.noUptimeProof")
          }}</span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.lastRewardBlockHeight")
          }}</span>
          <span class="mn-details__value">{{
            node.last_reward_block_height
          }}</span>
        </div>
      </div>

      <div class="beldex-label mn-details__group">
        {{ $t("strings.masterNodeDetails.contributors") }}
      </div>
      <div class="master-node-list">
        <div
          v-for="contributor in contributors"
          :key="contributor.address"
          class="master-node-list__row"
          @click="openUserWalletInfo(contributor.address)"
        >
          <div class="master-node-list__main">
            <div class="master-node-list__head">
              <span
                class="master-node-list__role"
                :class="{
                  'master-node-list__role--op': isOperator(contributor)
                }"
              >
                {{
                  isOperator(contributor)
                    ? $t("strings.operator")
                    : $t("strings.contributor")
                }}
              </span>
              <span v-if="isMe(contributor)" class="contri-wrapper">{{
                $t("strings.me")
              }}</span>
              <span v-else-if="contributor.name" class="contri-wrapper">{{
                contributor.name
              }}</span>
            </div>
            <div class="master-node-list__key beldex-truncate">
              {{ contributor.address }}
            </div>
          </div>
          <div class="mn-details__amount">
            <FormatBeldex :amount="contributor.amount" />
            <span class="master-node-list__meta">{{
              $t("strings.contribution")
            }}</span>
          </div>
          <ContextMenu
            :menu-items="menuItems"
            @copyAddress="copyAddress(contributor.address)"
          />
        </div>
      </div>
      <q-inner-loading :showing="unlock_status.sending" dark>
        <beldex-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>

    <!-- deregister details -->
    <div v-else class="mn-details__body">
      <div class="mn-details__grid mn-details__grid--two">
        <div class="mn-details__stat">
          <span class="beldex-label">Amount</span>
          <span class="mn-details__value mn-details__value--big"
            ><FormatBeldex :amount="deregisterDetail.amount"
          /></span>
        </div>
        <div class="mn-details__stat">
          <span class="beldex-label">{{
            $t("strings.masterNodeDetails.unlockHeight")
          }}</span>
          <span class="mn-details__value mn-details__value--big">{{
            deregisterDetail.unlock_height
          }}</span>
        </div>
      </div>
      <div class="beldex-label mn-details__group">
        {{ $t("strings.keyImage") }}
      </div>
      <div class="mn-details__inset">{{ deregisterDetail.key_image }}</div>
      <div class="beldex-label mn-details__group">
        {{ $t("strings.signature") }}
      </div>
      <div class="mn-details__inset">{{ deregisterDetail.signature }}</div>
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import { date } from "quasar";
import FormatBeldex from "components/format_beldex";
import ContextMenu from "components/menus/contextmenu";
export default {
  name: "MasterNodeDetails",
  components: {
    FormatBeldex,
    ContextMenu
  },
  props: {
    action: {
      type: Function,
      required: true
    },
    actionI18n: {
      type: String,
      required: true
    },
    goback: {
      type: Function,
      required: true
    },
    node: {
      required: false
    },
    deregisterDetail: {
      required: false
    }
  },
  data() {
    const menuItems = [
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];

    return {
      isVisible: false,

      menuItems
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlock_status: state => state.gateway.master_node_status.unlock,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    },
    can_open(state) {
      const { net_type } = state.gateway.app.config.app;
      return net_type !== "stagenet";
    },

    contributors(state) {
      if (!this.node.contributors) return [];
      const { address_book } = state.gateway.wallet.address_list;
      let contributors = [];

      for (const contributor of this.node.contributors) {
        let values = { ...contributor };
        const address = address_book.find(
          a => a.address === contributor.address
        );
        if (address) {
          const { name, description } = address;
          const separator = description === "" ? "" : " - ";
          values.name = `${name}${separator}${description}`;
        }
        contributors.push(values);
      }
      return contributors;
    },
    operatorFee() {
      const operatorPortion = this.node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee}%`;
    }
  }),
  methods: {
    openUserWalletInfo(contributorAddress) {
      console.log(contributorAddress);
      // const url = `https://www.beldexsn.com/user/${contributorAddress}`;
      // this.$gateway.send("core", "open_url", {
      //   url
      // });
    },
    openExplorer() {
      this.$gateway.send("core", "open_explorer", {
        type: "master_node",
        id: this.node.master_node_pubkey
      });
    },
    formatDate(timestamp) {
      return date.formatDate(timestamp, "YYYY-MM-DD hh:mm a");
    },
    copyAddress(address) {
      clipboard.writeText(address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    },
    isMe(contributor) {
      return contributor.address === this.our_address;
    },
    isOperator(contributor) {
      return this.node.operator_address === contributor.address;
    }
  }
};
</script>

<style lang="scss">
.beldex-app .masterNodeDetails {
  // app.styl `.masterNodeDetails { background-color #242433 }`
  background-color: transparent;
  min-height: 0;
}

.beldex-app .mn-details {
  &__head {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    padding-bottom: var(--beldex-space-4);
    margin-bottom: var(--beldex-space-5);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__back {
    width: 28px;
    height: 28px;
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    color: var(--beldex-text-strong);
  }

  &__status {
    padding: 2px var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    letter-spacing: 0.5px;
    line-height: 15px;
    color: var(--beldex-accent);
    text-transform: uppercase;
    background-color: var(--beldex-accent-bg);
    border: 1px solid var(--beldex-accent-border-soft);

    &--bad {
      color: var(--beldex-danger);
      background-color: var(--beldex-danger-wash);
      border-color: var(--beldex-danger-border);
    }
  }

  &__spacer {
    flex: 1 1 auto;
  }

  &__btn.q-btn {
    height: 36px;
    min-height: 36px;
    padding: 0 var(--beldex-space-4);
    font-size: var(--beldex-text-md);
  }

  &__body {
    position: relative;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--beldex-space-4);

    &--two {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-2);
    min-width: 0;
    padding: 14px var(--beldex-space-4);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  &__value {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-base);
    font-weight: 500;
    color: var(--beldex-text-strong);
    overflow-wrap: anywhere;

    &--big {
      font-size: 20px;
      font-weight: 700;
    }
  }

  &__group {
    margin: var(--beldex-space-5) 0 var(--beldex-space-2);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--beldex-text-faint);
  }

  &__amount {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    color: var(--beldex-text);
  }

  &__inset {
    padding: var(--beldex-space-3) var(--beldex-space-4);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    line-height: 18px;
    color: var(--beldex-text);
    word-break: break-all;
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
    user-select: text;
  }
}
</style>
