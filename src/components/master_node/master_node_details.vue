<template>
  <!-- <q-dialog v-model="isVisible" class="masterNodeDetails" > -->
  <q-layout class="masterNodeDetails" style="min-height:unset">
    <q-header>
      <q-toolbar color="dark" inverted class="q-pa-none">
        <div class="flex items-center back-arrow-btn" @click="goback()">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
              fill="white"
            />
          </svg>
        </div>
        <q-toolbar-title class="ft-semibold">
          {{ $t("strings.masterNodeDetails.masterNodeKey") }}
        </q-toolbar-title>

        <q-btn
          v-if="node.requested_unlock_height === 0"
          class="q-mr-sm unlock-btn"
          color="primary"
          :disabled="!is_ready || unlock_status.sending"
          :label="$t(actionI18n)"
          @click="action(node, $event)"
        />
        <q-btn
          v-if="can_open"
          color="accent"
          class="explorebtn"
          :label="$t('buttons.viewOnExplorer')"
          @click="openExplorer"
        />
        <!-- <q-btn flat round dense icon="reply" @click="isVisible = false" />
          <q-toolbar-title>
            {{ $t("titles.masterNodeDetails") }}
          </q-toolbar-title>
          <q-btn
            v-if="node.requested_unlock_height === 0"
            class="q-mr-sm"
            color="primary"
            :disabled="!is_ready || unlock_status.sending"
            :label="$t(actionI18n)"
            @click="action(node, $event)"
          />
          <q-btn
            v-if="can_open"
            color="primary"
            :label="$t('buttons.viewOnExplorer')"
            @click="openExplorer"
          /> -->
      </q-toolbar>
    </q-header>
    <q-page class="detail-page" style="min-height:unset;">
      <div lass="q-mt-lg ">
        <!-- <h6 class="q-mt-xs q-mb-none text-weight-light">
          {{ $t("strings.masterNodeDetails.masterNodeKey") }}
        </h6>
        <p class="break-all">{{ node.master_node_pubkey }}</p> -->

        <div class=" detailbox flex row justify-between">
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light">
                <span>{{
                  $t("strings.masterNodeDetails.stakingRequirement")
                }}</span>
              </div>
              <div class="value ft-semibold">
                <span
                  ><FormatOxen :amount="node.staking_requirement" raw-value
                /></span>
              </div>
            </div>
          </div>
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light">
                <span>{{
                  $t("strings.masterNodeDetails.totalContributed")
                }}</span>
              </div>
              <div class="value ft-semibold">
                <span
                  ><FormatOxen :amount="node.total_contributed" raw-value
                /></span>
              </div>
            </div>
          </div>
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light">
                <span>{{
                  $t("strings.masterNodeDetails.registrationHeight")
                }}</span>
              </div>
              <div class="value ft-semibold">
                <span>{{ node.registration_height }}</span>
              </div>
            </div>
          </div>
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light" style="padding-right: 25px;">
                <span>{{ $t("strings.masterNodeDetails.operatorFee") }}</span>
              </div>
              <div class="value ft-semibold">
                <span>{{ operatorFee }}</span>
              </div>
            </div>
          </div>
          <div v-if="node.requested_unlock_height > 0" class="infoBox">
            <div class="mn-detail-wrapper">
              <div class="text ft-Light">
                <span>{{ $t("strings.masterNodeDetails.unlockHeight") }}</span>
              </div>
              <div class="value ft-semibold">
                <span>{{ node.requested_unlock_height }}</span>
              </div>
            </div>
          </div>
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light">
                <span>{{
                  $t("strings.masterNodeDetails.lastUptimeProof")
                }}</span>
              </div>
              <div class="value ft-semibold">
                <span>{{ formatDate(node.last_uptime_proof * 1000) }}</span>
              </div>
            </div>
          </div>
          <div class="mn-detail-wrapper">
            <div class="infoBoxContent">
              <div class="text ft-Light">
                <span>{{
                  $t("strings.masterNodeDetails.lastRewardBlockHeight")
                }}</span>
              </div>
              <div class="value ft-semibold">
                <span>{{ node.last_reward_block_height }}</span>
              </div>
            </div>
          </div>
        </div>
        <q-list no-border :dark="theme == 'dark'" class="oxen-list">
          <q-item-label class="contributors-title ft-regular"
            >{{ $t("strings.masterNodeDetails.contributors") }}:</q-item-label
          >
          <!-- clickable -->
          <q-item
            v-for="contributor in contributors"
            :key="contributor.address"
            class="oxen-list-item"
            style="margin-right: 5px;"
            @click="openUserWalletInfo(contributor.address)"
          >
            <q-item-label>
              <q-item-label
                v-if="isMe(contributor)"
                class="name non-selectable"
                >{{ $t("strings.me") }}</q-item-label
              >
              <q-item-label v-else class="name non-selectable">{{
                contributor.name
              }}</q-item-label>
              <q-item-label class="address ellipsis non-selectable">{{
                contributor.address
              }}</q-item-label>
              <q-item-label class="non-selectable" caption>
                <span v-if="isOperator(contributor)"
                  >{{ $t("strings.operator") }} •
                </span>
                {{ $t("strings.contribution") }}:
                <FormatOxen :amount="contributor.amount" raw-value />
              </q-item-label>
            </q-item-label>
            <ContextMenu
              :menu-items="menuItems"
              @copyAddress="copyAddress(contributor.address)"
            />
          </q-item>
        </q-list>
      </div>
      <q-inner-loading :showing="unlock_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </q-page>
  </q-layout>
  <!-- </q-dialog> -->
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import { date } from "quasar";
import FormatOxen from "components/format_oxen";
import ContextMenu from "components/menus/contextmenu";
export default {
  name: "MasterNodeDetails",
  components: {
    FormatOxen,
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
      type: Object,
      required: true
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
    nodedetails: state => state.gateway.mnDetails,
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
      // console.log('nodedetails::',this.nodedetails)
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
.contributors-title {
  margin-top: 17px;
  font-size: 16px;
}

.masterNodeDetails {
  .name {
    font-size: 0.92rem;
  }

  .infoBox {
    margin-left: 30px;
  }

  .info {
    margin-right: 30px;
  }
}
</style>
