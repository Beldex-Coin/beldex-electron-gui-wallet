<template>
  <div class="swapStatus">
    <header class="swapStatus__head">
      <div class="swapStatus__title-wrap">
        <h2 class="swapStatus__title">
          {{ $t("titles.swap.exchanging") }}
        </h2>
        <span class="swapStatus__badge">
          <span class="swapStatus__badge-dot" />
          {{ $t("titles.swap.inProgress") }}
        </span>
      </div>
      <div class="beldex-segmented" role="tablist">
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item beldex-segmented__item--active"
          aria-selected="true"
        >
          <span class="beldex-segmented__dot" />
          {{ $t("titles.swap.exchange") }}
        </button>
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item"
          aria-selected="false"
          @click="$emit('toHistory')"
        >
          {{ $t("titles.swap.history") }}
        </button>
      </div>
    </header>

    <ol class="swapStatus__steps">
      <li
        v-for="step in steps"
        :key="step.key"
        class="swapStatus__step"
        :class="`swapStatus__step--${step.state}`"
      >
        <span class="swapStatus__marker">
          <beldex-spinner
            v-if="step.state === 'active' && step.key === 'confirming'"
            size="14px"
          />
          <q-icon v-else :name="step.icon" size="16px" />
        </span>
        <div class="swapStatus__step-body">
          <div class="swapStatus__step-title">{{ step.title }}</div>
          <div class="swapStatus__step-desc">{{ step.desc }}</div>
          <a
            v-if="step.key === 'confirming' && payinHash"
            class="swapStatus__link"
            @click="copyInputHash"
          >
            <q-icon name="open_in_new" size="12px" />
            {{ $t("titles.swap.seenInputExplorer") }}
          </a>
        </div>
      </li>
    </ol>

    <div class="swapStatus__note">
      <q-icon name="info_outline" size="14px" />
      <span>
        <strong>{{ $t("titles.swap.waitHere") }}.</strong>
        {{ $t("titles.swap.waitHereDesc") }}
        <a class="history-tag" @click="$emit('toHistory')">{{
          $t("titles.swap.swapHistory").toLowerCase()
        }}</a
        >.
      </span>
    </div>

    <div class="swapStatus__actions">
      <q-btn
        :label="$t('titles.swap.openHistory')"
        class="beldex-btn beldex-btn--ghost"
        unelevated
        no-caps
        @click="$emit('toHistory')"
      />
      <q-btn
        icon="add"
        :label="$t('titles.swap.newTransactionBtn')"
        class="beldex-btn"
        unelevated
        no-caps
        @click="$emit('newTxn')"
      />
    </div>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";

export default {
  name: "SwapStatus",
  components: {},

  computed: {
    ...mapState({
      statusDetails: state => {
        let data = state.gateway.txnStatus;
        let result = {};
        if (data.hasOwnProperty("result")) {
          if (data.status) {
            result = data.result[0];
          }
        }
        return result;
      }
    }),

    payinHash() {
      return (
        this.statusDetails?.payinHash ||
        this.statusDetails?.raw_response?.deposits?.[0]?.txId ||
        ""
      );
    },

    // Three-stage timeline; each stage is done, active or pending.
    steps() {
      const order = ["confirming", "exchanging", "sending"];
      const current = order.indexOf(this.statusDetails?.status);
      const state = index =>
        current === -1
          ? index === 0
            ? "active"
            : "pending"
          : index < current
          ? "done"
          : index === current
          ? "active"
          : "pending";
      const from = (this.statusDetails?.currencyFrom || "").toUpperCase();
      const to = (this.statusDetails?.currencyTo || "").toUpperCase();
      const icon = (index, pendingIcon) =>
        state(index) === "done" ? "check" : pendingIcon;
      return [
        {
          key: "confirming",
          state: state(0),
          icon: icon(0, "hourglass_empty"),
          title: this.$t("titles.swap.confirmingDeposit"),
          desc: `${this.$t("titles.swap.Once")} ${from}${this.$t(
            "titles.swap.confirmedInBlockchain"
          )} ${to}.`
        },
        {
          key: "exchanging",
          state: state(1),
          icon: icon(1, "sync_alt"),
          title: `${this.$t("titles.swap.exchanging")} ${from} ${this.$t(
            "titles.swap.to"
          )} ${to}`,
          desc: this.$t("titles.swap.pleaseWait")
        },
        {
          key: "sending",
          state: state(2),
          icon: icon(2, "send"),
          title: this.$t("titles.swap.sendFundsToWallet"),
          desc: this.$t("titles.swap.pleaseWait")
        }
      ];
    }
  },

  methods: {
    copyInputHash() {
      clipboard.writeText(this.payinHash);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: "Input Hash is copied!"
      });
    }
  }
};
</script>
