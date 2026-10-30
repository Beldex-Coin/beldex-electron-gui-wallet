<template>
  <!-- Ledger row tile. miner / mnode / gov use the incoming tile, failed the
       outgoing tile, pool the pending tile. -->
  <div
    class="tx-icon"
    :class="{
      'tx-icon--in': ['in', 'miner', 'mnode', 'gov'].includes(type),
      'tx-icon--out': ['out', 'failed'].includes(type),
      'tx-icon--pending': ['pending', 'pool'].includes(type)
    }"
  >
    <img
      v-if="['in', 'miner', 'mnode', 'gov'].includes(type)"
      src="~assets/icons/tx-in.svg"
      alt=""
    />
    <img
      v-else-if="['out', 'failed'].includes(type)"
      src="~assets/icons/tx-out.svg"
      alt=""
    />
    <img
      v-else-if="['pending', 'pool'].includes(type)"
      src="~assets/icons/tx-pending.svg"
      alt=""
    />
    <img v-else-if="type === 'stake'" src="~assets/icons/tx-stake.svg" alt="" />
    <img v-else-if="type === 'bns'" src="~assets/icons/tx-bns.svg" alt="" />
    <img v-else src="~assets/icons/tx-network.svg" alt="" />
  </div>
</template>

<script>
export default {
  name: "TxTypeIcon",
  props: {
    type: {
      type: String,
      required: true
    },
    tooltip: {
      type: Boolean,
      default: true,
      required: false
    }
  }
};
</script>

<style>
.tx-icon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: rgba(235, 235, 235, 0.05);
  border: 1px solid rgba(235, 235, 235, 0.1);
}

.tx-icon img {
  width: 14px;
  height: 14px;
}

.tx-icon--in {
  background-color: rgba(0, 191, 10, 0.05);
  border-color: rgba(0, 191, 10, 0.2);
}

.tx-icon--out {
  background-color: var(--beldex-danger-wash);
  border-color: var(--beldex-danger-border);
}

.tx-icon--pending {
  background-color: var(--beldex-warning-wash);
  border-color: var(--beldex-warning-border);
}
</style>
