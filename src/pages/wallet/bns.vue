<template>
  <!-- BNS. The purchase summary has no network-fee row: the wallet exposes
       no fee estimate before the transaction is built. -->
  <q-page class="bns-page" style="min-height: unset">
    <section class="bns-page__main">
      <div
        v-if="screen === 'purchase' || screen === 'my_bns'"
        class="bns-page__head"
      >
        <div class="beldex-segmented" role="tablist">
          <button
            v-for="tab in [
              { label: $t('titles.bns.purchase'), value: 'purchase' },
              { label: $t('titles.bns.myBns'), value: 'my_bns' }
            ]"
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
        <span class="beldex-hint bns__hint">
          <img src="~assets/icons/at-sign.svg" alt="" />
          {{ $t("strings.bnsServiceHint") }}
        </span>
      </div>

      <BNSPurchase
        v-if="screen === 'purchase'"
        ref="purchase"
        @onSummary="summary = $event"
      />
      <MyBNS
        v-if="screen === 'my_bns'"
        @onUpdate="onUpdate"
        @onRenew="onRenew"
        @onBuy="screen = 'purchase'"
      />
      <BNSUpdate
        v-if="screen === 'updateBns'"
        :current-record="this.record"
        @onBack="onBack"
      />
      <BNSRenew
        v-if="screen === 'renewBns'"
        :current-record="this.record"
        @onBack="onBack"
      />
    </section>

    <aside v-if="screen === 'purchase'" class="bns-page__side">
      <div class="bns-page__side-head">
        <h2 class="bns-page__side-title">
          {{ $t("strings.purchaseSummary") }}
        </h2>
        <span class="beldex-chip">{{ $t("strings.estimate") }}</span>
      </div>
      <dl class="bns-page__stats">
        <div class="bns-page__stat">
          <dt>{{ $t("fieldLabels.name") }}</dt>
          <dd>{{ summary.name || "—" }}</dd>
        </div>
        <div class="bns-page__stat">
          <dt>{{ $t("strings.bns.duration") }}</dt>
          <dd>{{ summary.duration }}</dd>
        </div>
        <div class="bns-page__stat">
          <dt>{{ $t("strings.price") }}</dt>
          <dd>{{ summary.price }} BDX</dd>
        </div>
      </dl>
      <div class="bns-page__total">
        <span>{{ $t("strings.total") }}</span>
        <strong>{{ summary.price }} BDX</strong>
      </div>
      <p class="bns-page__note">{{ $t("strings.bnsPurchaseNote") }}</p>
    </aside>

    <aside v-else-if="screen !== 'purchase'" class="bns-page__side">
      <div class="bns-page__side-head">
        <h2 class="bns-page__side-title">{{ $t("strings.yourNames") }}</h2>
        <span class="beldex-chip">{{ names.length }}</span>
      </div>
      <dl class="bns-page__stats">
        <div class="bns-page__stat">
          <dt>{{ $t("strings.activeNames") }}</dt>
          <dd>{{ names.length }}</dd>
        </div>
        <div class="bns-page__stat">
          <dt>{{ $t("strings.nextExpiry") }}</dt>
          <dd>{{ nextExpiry }}</dd>
        </div>
      </dl>
      <p class="bns-page__note">{{ $t("strings.bnsRenewNote") }}</p>
    </aside>
  </q-page>
</template>

<script>
import BNSPurchase from "components/bns/bns_purchase";
import MyBNS from "components/bns/bns_mybns";
import BNSUpdate from "components/bns/bns_update.vue";
import BNSRenew from "components/bns/bns_renew.vue";
import Vue from "vue";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  components: {
    MyBNS,
    BNSPurchase,
    BNSUpdate,
    BNSRenew
  },
  data() {
    return {
      screen: "purchase",
      record: {},
      summary: { name: "", duration: "", price: 0 }
    };
  },
  computed: {
    // Our records, same ownership filter as BNSRecords.
    ...mapState({
      names(state) {
        const { used, unused, primary } = state.gateway.wallet.address_list;
        const ours = [...used, ...unused, ...primary]
          .map(a => a.address)
          .filter(a => !!a);
        return (state.gateway.wallet.bnsRecords || []).filter(
          record =>
            ours.includes(record.owner) || ours.includes(record.backup_owner)
        );
      }
    }),
    nextExpiry() {
      const heights = this.names
        .map(r => r.expiration_height)
        .filter(h => h > 0);
      return heights.length ? `Height ${Math.min(...heights)}` : "-";
    }
  },
  methods: {
    purchasePageAction(record, action) {
      // don't update the pointer to the record (else it'll update on the records page)
      let recordCopy = _.cloneDeep(record);

      if (record.type === "belnet" && record.name.endsWith(".bdx")) {
        // The UI expects no ".bdx" extension
        recordCopy.name = recordCopy.name.slice(0, -5);
        recordCopy.value = recordCopy.value.slice(0, -5);
      }
      this.screen = "purchase";
      // refs are not dynamic, so let the purchase tab render
      // then we can call the ref method
      Vue.nextTick().then(() => {
        this.$refs.purchase[action](recordCopy);
      });
    },
    onBack() {
      this.screen = "my_bns";
    },
    onUpdate(record) {
      let updateRecord = {
        ...record
      };
      this.record = updateRecord;
      this.screen = "updateBns";
    },
    onRenew(record) {
      let updateRecord = {
        ...record,
        name: record.name.slice(0, record.name.length - 4)
      };
      this.record = updateRecord;
      this.screen = "renewBns";
    }
  }
};
</script>

<style lang="scss">
.beldex-app .bns-page {
  display: flex;
  // Don't shrink below the content: the shell panel scrolls, and a shrunk
  // page left the form overflowing its card border.
  flex: 1 0 auto;
  align-items: stretch;
  gap: var(--beldex-space-5);
  min-height: 0 !important; // beats q-page's inline min-height
  padding: 0;
  // app.styl `.bns-page` card (purple background, radius).
  background-color: transparent;
  border-radius: 0;

  // app.styl `.bns-purchase, .my-bns` fixed height + purple tab backgrounds.
  .bns-purchase,
  .my-bns {
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

  &__head,
  &__side-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__head {
    margin-bottom: var(--beldex-space-5);
  }

  .bns__hint {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
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
    margin: 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--beldex-space-3) 0;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    border-bottom: 1px solid var(--beldex-hairline);

    dt {
      color: var(--beldex-text-muted);
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      font-size: var(--beldex-text-md);
      color: var(--beldex-text-strong);
    }
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-strong);
    text-transform: uppercase;

    strong {
      font-size: 16px;
      font-weight: 600;
      color: var(--beldex-accent);
      text-transform: none;
    }
  }

  &__note {
    margin: 0;
    padding: 12px 14px;
    font-size: var(--beldex-text-sm);
    line-height: 17px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);
  }
}
</style>
