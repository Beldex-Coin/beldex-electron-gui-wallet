<template>
  <div class="bns-purchase">
    <p class="beldex-form-desc">{{ $t("strings.bnsPurchaseDescription") }}</p>
    <BNSInput ref="input" @onSummary="$emit('onSummary', $event)" />
  </div>
</template>

<script>
import BNSInput from "./bns_input";
export default {
  name: "BNSPurchase",
  components: {
    BNSInput
  },
  methods: {
    startUpdating(record) {
      this.$refs.input.startUpdating(record);
    },
    startRenewing(record) {
      this.$refs.input.startRenewing(record);
    }
  }
};
</script>
<style lang="scss">
.beldex-app .bns-purchase {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);
  min-height: 0;

  // The description sits 20px under the tab row and 20px above
  // "Duration"; the shared margin would double that with the flex gap.
  .beldex-form-desc {
    margin: 0;
  }
}
</style>
