<template>
  <div class="lns-purchase">
    <div class="q-mb-lg q-px-md q-pt-md">
      <div class="tab-desc">
        {{ $t("strings.lnsPurchaseDescription") }}
      </div>
      <div class="prices">
        {{ $t("strings.lns.prices") }}
        <table>
          <tr>
            <td>{{ $t("strings.lns.sessionID") }}:</td>
            <td>15 BDX</td>
          </tr>
          <tr>
            <td>{{ $t("strings.lns.lokinetName1Year") }}:</td>
            <td>15 BDX</td>
          </tr>
          <tr>
            <td>{{ $t("strings.lns.lokinetNameXYears", { years: 2 }) }}:</td>
            <td>30 BDX</td>
          </tr>
          <tr>
            <td>{{ $t("strings.lns.lokinetNameXYears", { years: 5 }) }}:</td>
            <td>60 BDX</td>
          </tr>
          <tr>
            <td>{{ $t("strings.lns.lokinetNameXYears", { years: 10 }) }}:</td>
            <td>90 BDX</td>
          </tr>
        </table>
      </div>
      <LNSInput ref="input" />
    </div>
  </div>
</template>

<script>
import LNSInput from "./lns_input";
export default {
  name: "LNSPurchase",
  components: {
    LNSInput
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
.lns-purchase {
  .description {
    white-space: pre-line;
    // oxen-navy
    color: #010101;
  }

  .prices {
    // oxen-navy
    margin-top: 20px;
    color: #010101;
  }
}
</style>
