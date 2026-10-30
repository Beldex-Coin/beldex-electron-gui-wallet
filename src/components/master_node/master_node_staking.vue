<template>
  <!-- Stake tab. Bindings and handlers are unchanged. -->
  <div :class="`${toggleVisible ? 'master-node-staking' : ''}`">
    <div v-if="toggleVisible" class="master-node-staking__form">
      <p class="beldex-form-desc">
        {{ $t("strings.masterNodeContributionDescription") }}
        <a class="master-node-staking__link" @click="oxenWebsite"
          >Beldex {{ $t("strings.website") }}.</a
        >
      </p>
      <BeldexField
        :label="$t('fieldLabels.masterNodeKey')"
        :error="$v.master_node.key.$error"
      >
        <q-input
          v-model.trim="master_node.key"
          dark
          :placeholder="$t('placeholders.hexCharacters', { count: 64 })"
          borderless
          dense
          @input="applyAlphanumericMask"
          @blur="$v.master_node.key.$touch"
        />
      </BeldexField>
      <BeldexField
        :label="$t('fieldLabels.amount')"
        :error="$v.master_node.amount.$error"
      >
        <q-input
          v-model.trim="master_node.amount"
          dark
          type="number"
          min="0"
          :max="unlocked_balance / 1e9"
          placeholder="0"
          borderless
          dense
          @blur="$v.master_node.amount.$touch"
          @keydown="keyHandler"
        />
        <span class="master-node-staking__unit">BDX</span>
        <button
          type="button"
          class="master-node-staking__act"
          :disabled="!areButtonsEnabled()"
          @click="master_node.amount = minStake(master_node.key)"
        >
          {{ $t("buttons.min") }}
        </button>
        <button
          type="button"
          class="master-node-staking__act master-node-staking__act--accent"
          :disabled="!areButtonsEnabled()"
          @click="master_node.amount = maxStake(master_node.key)"
        >
          {{ $t("buttons.max") }}
        </button>
      </BeldexField>
      <div class="beldex-form-actions">
        <q-btn
          class="beldex-btn beldex-btn--ghost"
          unelevated
          no-caps
          :disable="!is_able_to_send"
          :label="$t('buttons.sweepAll')"
          @click="sweepAllWarning()"
        />
        <q-btn
          class="beldex-btn"
          unelevated
          no-caps
          :disable="!is_able_to_send"
          :label="$t('buttons.stake')"
          @click="stake()"
        />
      </div>
    </div>
    <div v-if="toggleVisible" class="beldex-hr master-node-staking__hr" />
    <MasterNodeContribute
      :awaiting-master-nodes="awaiting_master_nodes"
      :toggle-visible="toggleVisible"
      @contribute="fillStakingFields"
      @onChangeVisible="onChangeVisible"
    />
    <ConfirmTransactionDialog
      :show="confirmSweepAll"
      :amount="confirmFields.totalAmount"
      :isflash="confirmFields.isflash"
      :send-to="confirmFields.destination"
      :fee="confirmFields.totalFees"
      :on-confirm-transaction="onConfirmTransaction"
      :on-cancel-transaction="onCancelTransaction"
    />
    <q-inner-loading
      :showing="stake_status.sending || sweep_all_status.sending"
    >
      <beldex-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import objectAssignDeep from "object-assign-deep";
import { mapState } from "vuex";
import { required, decimal } from "vuelidate/lib/validators";
import { master_node_key, greater_than_zero } from "src/validators/common";
import BeldexField from "components/beldex_field";
import WalletPassword from "src/mixins/wallet_password";
import ConfirmDialogMixin from "src/mixins/confirm_dialog_mixin";
import MasterNodeContribute from "./master_node_contribute";
import MasterNodeMixin from "src/mixins/master_node_mixin";
import ConfirmTransactionDialog from "components/confirm_tx_dialog";

const DO_NOTHING = 10;

export default {
  name: "MasterNodeStaking",
  components: {
    BeldexField,
    MasterNodeContribute,
    ConfirmTransactionDialog
  },
  mixins: [WalletPassword, ConfirmDialogMixin, MasterNodeMixin],
  props: {
    toggleVisible: {
      type: Boolean,
      required
    }
  },
  data() {
    return {
      master_node: {
        key: "",
        amount: 0,
        // the min and max are for that particular SN,
        // start at min/max for the wallet
        minStakeAmount: 0,
        maxStakeAmount: this.unlocked_balance / 1e9
      },
      confirmFields: {
        isflash: false,
        totalAmount: -1,
        destination: "",
        totalFees: 0
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    info: state => state.gateway.wallet.info,
    stake_status: state => state.gateway.master_node_status.stake,
    sweep_all_status: state => state.gateway.sweep_all_status,
    award_address: state => state.gateway.wallet.info.address,
    confirmSweepAll: state => state.gateway.sweep_all_status.code === 1,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    address_placeholder(state) {
      const wallet = state.gateway.wallet.info;
      const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
      return `${prefix}..`;
    },
    awaiting_master_nodes(state) {
      const nodes = state.gateway.daemon.master_nodes.nodes;
      // a reserved node is one on which someone is a "contributor" of amount = 0
      const getOurContribution = node =>
        node.contributors.find(
          c => c.address === this.our_address && c.amount > 0
        );
      const isAwaitingContribution = node =>
        !node.active && !node.funded && node.requested_unlock_height === 0;
      const isAwaitingContributionNonReserved = node =>
        isAwaitingContribution(node) && !getOurContribution(node);
      const isAwaitingContributionReserved = node =>
        isAwaitingContribution(node) && getOurContribution(node);

      // we want the reserved nodes sorted by fee at the top
      const awaitingContributionNodesReserved = nodes
        .filter(isAwaitingContributionReserved)
        .map(n => {
          return {
            ...n,
            awaitingContribution: true
          };
        });
      const awaitingContributionNodesNonReserved = nodes
        .filter(isAwaitingContributionNonReserved)
        .map(n => {
          return {
            ...n,
            awaitingContribution: true
          };
        });

      const compareFee = (n1, n2) =>
        this.getFeeDecimal(n1) > this.getFeeDecimal(n2) ? 1 : -1;
      awaitingContributionNodesReserved.sort(compareFee);
      awaitingContributionNodesNonReserved.sort(compareFee);

      const nodesForContribution = [
        ...awaitingContributionNodesReserved,
        ...awaitingContributionNodesNonReserved
      ];
      return nodesForContribution;
    }
  }),
  validations: {
    master_node: {
      key: { required, master_node_key },
      amount: {
        required,
        decimal,
        greater_than_zero
      }
    }
  },
  watch: {
    stake_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.master_node = {
              key: "",
              amount: 0
            };
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    },
    sweep_all_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          // the "nothing", so we can update state without doing anything
          // in particular
          case DO_NOTHING:
            break;
          case 1:
            this.buildDialogFieldsSweepAll(val);
            break;
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.newTx = {
              amount: 0,
              address: "",
              // flash
              priority: 5,
              address_book: {
                save: false,
                name: "",
                description: ""
              },
              note: ""
            };
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    oxenWebsite() {
      const url = "https://www.beldex.io/";
      this.$gateway.send("core", "open_url", {
        url
      });
    },
    fillStakingFields(key, minContribution) {
      this.master_node.key = key;
      this.master_node.amount = minContribution;
    },
    minStake() {
      const node = this.getNodeWithPubKey();
      return this.getMinContribution(node);
    },
    maxStake() {
      const node = this.getNodeWithPubKey();
      return this.openForContriubtionOxen(node);
    },
    getFeeDecimal(node) {
      const operatorPortion = node.portions_for_operator;
      return (operatorPortion / 18446744073709551612) * 100;
    },
    keyHandler(evt) {
      if (
        evt.key === "-" ||
        evt.key === "+" ||
        evt.key === "e" ||
        evt.key === "E"
      ) {
        evt.preventDefault();
      }
    },
    getNodeWithPubKey() {
      const key = this.master_node.key;
      const nodeOfKey = this.awaiting_master_nodes.find(
        n => n.master_node_pubkey === key
      );
      if (!nodeOfKey) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidMasterNodeKey")
        });
        return;
      } else {
        return nodeOfKey;
      }
    },
    onConfirmTransaction() {
      // put the loading spinner up
      this.$store.commit("gateway/set_sweep_all_status", {
        code: DO_NOTHING,
        message: "Getting sweep all tx information",
        sending: true
      });

      const isflash = this.confirmFields.isflash;

      const relayTxData = {
        isflash,
        isSweepAll: true
      };

      // Commit the transaction
      this.$gateway.send("wallet", "relay_tx", relayTxData);
    },
    onCancelTransaction() {
      this.$store.commit("gateway/set_sweep_all_status", {
        code: DO_NOTHING,
        message: "Cancel the transaction from confirm dialog",
        sending: false
      });
    },
    sweepAllWarning() {
      this.$q
        .dialog({
          title: this.$t("dialog.sweepAllWarning.title"),
          message: this.$t("dialog.sweepAllWarning.message"),
          ok: {
            label: this.$t("dialog.sweepAllWarning.ok"),
            color: "primary"
          },
          cancel: {
            label: this.$t("dialog.buttons.cancel"),
            color: "accent"
          }
        })
        .onOk(() => {
          this.sweepAll();
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    applyAlphanumericMask() {
      // Remove non-alphanumeric characters using the regular expression
      this.master_node.key = this.master_node.key.replace(/[\W_]/g, "");
    },

    buildDialogFieldsSweepAll(txData) {
      this.confirmFields = this.buildDialogFields(txData);
    },
    areButtonsEnabled() {
      // if we can find the master node key in the list of master nodes
      const key = this.master_node.key;
      return !!this.awaiting_master_nodes.find(
        n => n.master_node_pubkey === key
      );
    },
    onChangeVisible(value) {
      this.$emit("onChangeVisible", value);
    },
    async sweepAll() {
      const { unlocked_balance } = this.info;

      const tx = {
        amount: unlocked_balance / 1e9,
        address: this.award_address,
        priority: 0
      };

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.sweepAll.title"),
        noPasswordMessage: this.$t("dialog.sweepAll.message"),
        ok: {
          label: this.$t("dialog.sweepAll.ok"),
          color: "primary"
        },
        cancel: {
          label: this.$t("dialog.buttons.cancel"),
          color: "accent"
        }
      });
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_sweep_all_status", {
            code: DO_NOTHING,
            message: "Sweeping all",
            sending: true
          });
          const newTx = objectAssignDeep.noMutate(tx, {
            password,
            isSweepAll: true
          });
          this.$gateway.send("wallet", "transfer", newTx);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async stake() {
      this.$v.master_node.$touch();

      if (this.$v.master_node.key.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidMasterNodeKey")
        });
        return;
      }

      if (this.master_node.amount < 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.negativeAmount")
        });
        return;
      } else if (this.master_node.amount == 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.zeroAmount")
        });
        return;
      } else if (this.master_node.amount > this.unlocked_balance / 1e9) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.notEnoughBalance")
        });
        return;
      } else if (this.$v.master_node.amount.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAmount")
        });
        return;
      }

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.stake.title"),
        noPasswordMessage: this.$t("dialog.stake.message"),
        ok: {
          label: this.$t("dialog.stake.ok"),
          color: "primary"
        },
        cancel: {
          label: this.$t("dialog.buttons.cancel"),
          color: "accent"
        },

        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_mnode_status", {
            stake: {
              code: 1,
              message: "Staking...",
              sending: true
            }
          });
          const master_node = objectAssignDeep.noMutate(this.master_node, {
            password,
            destination: this.award_address
          });

          this.$gateway.send("wallet", "stake", master_node);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.beldex-app .master-node-staking {
  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-5);
  }

  &__link {
    color: var(--beldex-text);
    text-decoration: underline;
    cursor: pointer;
  }

  &__hr {
    margin: var(--beldex-space-5) 0;
  }

  // Unit + Min/Max sit inside the amount field (BeldexField `.content`).
  &__unit {
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    color: var(--beldex-text-muted);
  }

  &__act {
    align-self: stretch;
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 500;
    color: var(--beldex-text);
    background: var(--beldex-panel-raised);
    border: 0;
    border-left: 1px solid var(--beldex-border);
    cursor: pointer;

    &--accent {
      font-weight: 700;
      color: var(--beldex-accent);
      text-transform: uppercase;
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.master-node-stake-tab {
  user-select: none;
}
</style>
