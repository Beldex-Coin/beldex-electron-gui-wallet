<template>
  <!-- My stakes. -->
  <div v-if="isVisible" class="master-node-stake-tab master-node-unlock">
    <div class="master-node-unlock__group">
      <span v-if="master_nodes.length">{{
        $t("titles.currentlyStakedNodes")
      }}</span>
    </div>
    <section v-if="!master_nodes.length" class="master-node-unlock__empty">
      <div class="master-node-unlock__empty-icon">
        <img src="~assets/icons/tx-stake.svg" alt="" />
      </div>
      <p class="master-node-unlock__empty-title">
        {{ $t("strings.noActiveStakes") }}
      </p>
      <p class="master-node-unlock__empty-hint">
        {{ $t("strings.noActiveStakesHint") }}
      </p>
      <q-btn
        class="beldex-btn master-node-unlock__empty-btn"
        unelevated
        no-caps
        @click="$emit('goToStake')"
      >
        {{ $t("buttons.goToStake") }}
        <img src="~assets/icons/arrow-right.svg" alt="" />
      </q-btn>
    </section>
    <MasterNodeList
      v-if="master_nodes"
      :master-nodes="master_nodes"
      button-i18n="buttons.unlock"
      :details="details"
      :action="unlockWarning"
    />
    <template v-if="deregister_master_nodes.length > 0">
      <div class="master-node-unlock__group">Deregistered Nodes</div>
      <div class="master-node-list">
        <div
          v-for="node in deregister_master_nodes"
          :key="node.key_image"
          class="master-node-list__row"
          @click="assignDeregisterDetails(node)"
        >
          <span class="master-node-list__icon">
            <img src="~assets/icons/rail-masternode.svg" alt="" />
          </span>
          <div class="master-node-list__main">
            <div class="master-node-list__key beldex-truncate">
              {{ $t("strings.masterNodeKeyShort") }}: {{ node.key_image }}
            </div>
          </div>
          <span class="contri-wrapper">
            Amount: <FormatBeldex :amount="node.amount" />
          </span>
        </div>
      </div>
    </template>
    <q-inner-loading :showing="unlock_status.sending || fetching" dark>
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>

  <MasterNodeDetails
    v-else
    ref="masterNodeDetailsUnlock"
    :action="unlockWarning"
    action-i18n="buttons.unlock"
    :node="this.nodeDetails"
    :goback="goback"
    :deregister-detail="this.deregisterDetail"
  />
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { master_node_key } from "src/validators/common";
import WalletPassword from "src/mixins/wallet_password";
import MasterNodeDetails from "./master_node_details";
import MasterNodeList from "./master_node_list";
import FormatBeldex from "components/format_beldex";

export default {
  name: "MasterNodeUnlock",
  components: {
    MasterNodeDetails,
    MasterNodeList,
    FormatBeldex
  },
  mixins: [WalletPassword],
  props: {
    onChangeVisible: {
      type: Function,
      require: false
    }
  },
  data() {
    const menuItems = [
      { action: "copyMasterNodeKey", i18n: "menuItems.copyMasterNodeKey" },
      { action: "viewOnExplorer", i18n: "menuItems.viewOnExplorer" }
    ];
    return {
      menuItems,
      isVisible: true,
      nodeDetails: "",
      deregisterDetail: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlock_status: state => state.gateway.master_node_status.unlock,
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    },
    deregister_master_nodes: state => {
      let master_nodes_deregister = state.gateway.daemon.master_nodes_deregister
        ? state.gateway.daemon.master_nodes_deregister
        : [];
      let signed_key_images = state.gateway.daemon.signed_key_images
        ? state.gateway.daemon.signed_key_images
        : [];
      let degisterList = [];
      for (let i = 0; i < master_nodes_deregister.length; i++) {
        for (let j = 0; j < signed_key_images.length; j++) {
          if (
            master_nodes_deregister[i].key_image ==
            signed_key_images[j].key_image
          ) {
            degisterList.push(
              Object.assign(signed_key_images[j], master_nodes_deregister[i])
            );
          }
        }
      }
      return degisterList;
    },
    // just SNs the user has contributed to
    master_nodes(state) {
      let nodes = state.gateway.daemon.master_nodes.nodes;
      // don't count reserved nodes in my stakes (where they are a contributor of amount 0)

      const getOurContribution = node =>
        node.contributors.find(
          c => c.address === this.our_address && c.amount > 0
        );
      let masterNodes = nodes.filter(getOurContribution).map(n => {
        const ourContribution = getOurContribution(n);
        return {
          ...n,
          ourContributionAmount: ourContribution.amount
        };
      });
      return masterNodes;
    },
    fetching: state => state.gateway.daemon.master_nodes.fetching
  }),
  validations: {
    node_key: { required, master_node_key }
  },
  watch: {
    unlock_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.key = null;
            this.password = null;

            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            break;
          case 1:
            // Tell the user to confirm
            this.$q
              .dialog({
                title: this.$t("dialog.unlockMasterNode.confirmTitle"),
                message,
                ok: {
                  label: this.$t("dialog.unlockMasterNode.ok"),
                  color: "primary"
                },
                cancel: {
                  label: this.$t("dialog.buttons.cancel"),
                  color: "accent"
                },
                style: "min-width: 500px; overflow-wrap: break-word;",
                dark: this.theme == "dark",
                color: this.theme == "dark" ? "white" : "dark"
              })
              .onOk(() => {
                let password = this.password || "";
                this.gatewayUnlock(password, this.key, true);
              })
              .onDismiss(() => null)
              .onCancel(() => null);
            break;
          case -1:
            this.key = null;
            this.password = null;

            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
          default:
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    details(node) {
      this.nodeDetails = node;
      this.isVisible = false;
      this.deregisterDetail = "";
      this.$emit("onChangeVisible", false);
    },
    assignDeregisterDetails(node) {
      this.nodeDetails = "";
      this.isVisible = false;
      this.deregisterDetail = node;
      this.$emit("onChangeVisible", false);
    },
    goback() {
      this.isVisible = true;
      this.$emit("onChangeVisible", true);
    },
    unlockWarning(node, event) {
      const key = node.master_node_pubkey;
      // stop detail page from popping up
      this.$gateway.send("wallet", "update_master_node_list");
      event.stopPropagation();
      this.$q
        .dialog({
          title: this.$t("dialog.unlockMasterNodeWarning.title"),
          message: this.$t("dialog.unlockMasterNodeWarning.message"),
          ok: {
            label: this.$t("dialog.unlockMasterNodeWarning.ok"),
            color: "primary"
          },
          cancel: {
            label: this.$t("dialog.buttons.cancel"),
            color: "accent"
          },
          dark: this.theme == "dark",
          color: this.theme == "dark" ? "white" : "dark"
        })
        .onOk(() => {
          this.unlock(key);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async unlock(key) {
      // We store this as it could change between the 2 step process
      this.key = key;

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.unlockMasterNode.title"),
        noPasswordMessage: this.$t("dialog.unlockMasterNode.message"),
        ok: {
          label: this.$t("dialog.unlockMasterNode.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });

      passwordDialog
        .onOk(password => {
          this.password = password || "";
          this.gatewayUnlock(this.password, this.key, false);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    gatewayUnlock(password, key, confirmed = false) {
      password = password || "";
      this.$store.commit("gateway/set_mnode_status", {
        unlock: {
          code: 2, // Code 1 is reserved for can_unlock
          message: "Unlocking...",
          sending: true
        }
      });
      this.$gateway.send("wallet", "unlock_stake", {
        password,
        master_node_key: key,
        confirmed
      });
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
    },
    getRole(node) {
      const key =
        node.operator_address === this.our_address
          ? "strings.operator"
          : "strings.contributor";
      return this.$t(key);
    },
    getFee(node) {
      const operatorPortion = node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee}% ${this.$t("strings.transactions.fee")}`;
    }
  }
};
</script>

<style lang="scss">
.beldex-app .master-node-unlock {
  position: relative;
  min-height: 120px;

  &__group {
    padding: var(--beldex-space-1) 0;
    margin-top: var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 15px;
    color: var(--beldex-text-faint);
    text-transform: uppercase;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--beldex-space-2);
    min-height: 380px;
    text-align: center;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin-bottom: var(--beldex-space-3);
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid rgba(235, 235, 235, 0.1);

    img {
      width: 20px;
      height: 20px;
    }
  }

  &__empty-title {
    margin: 0;
    font-family: var(--beldex-font-sans-medium);
    font-size: 14px;
    color: var(--beldex-text-strong);
  }

  &__empty-hint {
    max-width: 300px;
    margin: 0 0 var(--beldex-space-3);
    font-size: var(--beldex-text-md);
    line-height: 18px;
    color: var(--beldex-text-muted);
  }
}
</style>
