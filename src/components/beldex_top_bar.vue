<template>
  <header class="beldex-topbar">
    <div class="beldex-topbar__brand">
      <div class="beldex-topbar__logo-tile">
        <img src="~assets/icons/brand-logo.png" alt="" />
      </div>
      <span class="beldex-topbar__wordmark">Beldex</span>
      <span class="beldex-topbar__product">
        {{ $t("strings.electronWallet") }}
      </span>
      <!-- Testnet/stagenet use the mainnet style -->
      <span v-if="netType" class="beldex-net-chip">
        <span class="beldex-net-chip__dot" />
        {{ $t("strings.networkActive", { network: netType }) }}
      </span>
    </div>
    <div class="beldex-topbar__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script>
export default {
  name: "BeldexTopBar",
  props: {
    netType: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
