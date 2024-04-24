<template>
  <div v-if="isVisible" class="master-node-stake-tab q-pr-md">
    <div :class="` ${master_nodes.length === 0 ? 'd-center' : ''}`">
      <div class="q-my-md header items-center" style="font-size: 16px">
        <span v-if="master_nodes.length">{{
          $t("titles.currentlyStakedNodes")
        }}</span>
        <span v-else style="color: #77778b"
          >{{ $t("strings.masterNodeStartStakingDescription") }}
          <span style="font-family: Poppins-SemiBold">{{
            $t("titles.masterNode.staking")
          }}</span
          >&nbsp;
          <span>{{ $t("strings.masterNodeStartStakingDescription1") }}</span>
        </span>
      </div>
      <div></div>
      <div v-if="master_nodes">
        <MasterNodeList
          :master-nodes="master_nodes"
          button-i18n="buttons.unlock"
          :details="details"
          :action="unlockWarning"
        />
      </div>
      <div>
        <div class="deregister-header q-my-md">Deregistered Nodes</div>

        <q-list class="master-node-list" no-border>
          <q-item v-for="node in deregister_master_nodes" :key="node.key_image">
            <q-item-section>
              <q-item-label class="ellipsis">
                <span style="font-weight: 600"
                  >{{ $t("strings.masterNodeDetails.snKey") }} </span
                >:
                f839c386fd94ddb026fb88d3579f0f0a09b823a1505b57c5ff186e134bbd9f23</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <span>
                <span class="contri-wrapper">
                  Amount:
                  <span class="amount">
                    <FormatOxen :amount="node.amount" />
                  </span>
                </span>
              </span>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-inner-loading
        :showing="unlock_status.sending || fetching"
        :dark="theme == 'dark'"
      >
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
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
import { clipboard } from "electron";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { master_node_key } from "src/validators/common";
import WalletPassword from "src/mixins/wallet_password";
import MasterNodeDetails from "./master_node_details";
import MasterNodeList from "./master_node_list";
import FormatOxen from "components/format_oxen";

export default {
  name: "MasterNodeUnlock",
  components: {
    MasterNodeDetails,
    MasterNodeList,
    FormatOxen
  },
  mixins: [WalletPassword],
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
    deregister_master_nodes: state =>
      state.gateway.daemon.master_nodes_deregister,
    // just SNs the user has contributed to
    master_nodes(state) {
      let nodes = state.gateway.daemon.master_nodes.nodes;
      // don't count reserved nodes in my stakes (where they are a contributor of amount 0)
      console.log(
        "master_nodes_deregister:",
        state.gateway.daemon.master_nodes_deregister
      );
      console.log("signed_key_images:", state.gateway.daemon.signed_key_images);
      let master_nodes_deregister = state.gateway.daemon.master_nodes_deregister
        ? state.gateway.daemon.master_nodes_deregister
        : [];
      let signed_key_images = state.gateway.daemon.signed_key_images
        ? state.gateway.daemon.signed_key_images
        : [];
      console.log("master_nodes_deregister:", master_nodes_deregister);
      console.log("signed_key_images:", signed_key_images);
      let match = [];
      for (let i = 0; i < master_nodes_deregister.length; i++) {
        for (let j = 0; j < signed_key_images.length; j++) {
          if (
            master_nodes_deregister[i].key_image ==
            signed_key_images[j].key_image
          ) {
            console.log("i....", i, j);
            console.log(
              "master_nodes_deregister[i].key_image:",
              master_nodes_deregister[i]
            );
            console.log(
              "signed_key_images[j].key_image:",
              signed_key_images[j]
            );
            match.push(
              Object.assign(signed_key_images[j], master_nodes_deregister[i])
            );
            //amount: 10000000000000
            // key_image:"bde711f12eb61c25f7b6a6fe52826c560f5f4919e45626ab93c243d646293e60"
            // signature: "cb0c8caedb27eb06a87786a895f0c7d62ecda1923aee177b6d68620da8dafe04aa5402a8e0a5a678b6cd10aefd94c630f77ddbb6ab80f9dae1a60e54bcfdb80b"
            // unlock_height: 1418700
          }
        }
      }
      console.log("match:", match);
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
      console.log("final mn data .....", masterNodes);
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

      this.$gateway.send("wallet", "set_mnDetails", {
        data: node
      });

      // this.$refs.masterNodeDetailsUnlock.isVisible = true;
      // this.$refs.masterNodeDetailsUnlock.node = node;
    },
    goback() {
      this.isVisible = true;
      this.$gateway.send("wallet", "set_mnDetails", {
        data: {}
      });
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
.deregister-header {
  color: white;
  font-size: 1rem;
}
.d-center {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
}
</style>
