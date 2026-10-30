<template>
  <!-- Address row -->
  <div class="receive-item">
    <button type="button" class="receive-item__main" @click="details(address)">
      <span class="receive-item__index">#{{ address.address_index }}</span>
      <span class="receive-item__text">
        <span class="beldex-truncate receive-item__address">{{
          address.address
        }}</span>
        <span v-if="sublabel" class="receive-item__sub">{{ sublabel }}</span>
      </span>
    </button>
    <button
      type="button"
      class="beldex-square-btn"
      :aria-label="$t('menuItems.copyAddress')"
      @click="copyAddress(address.address, $event)"
    >
      <q-icon name="content_copy" size="14px" />
      <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
        {{ $t("menuItems.copyAddress") }}
      </q-tooltip>
    </button>
    <button
      type="button"
      class="beldex-square-btn"
      :aria-label="$t('menuItems.showQRCode')"
      @click="showQR(address.address, $event)"
    >
      <q-icon name="qr_code_scanner" size="14px" />
      <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
        {{ $t("menuItems.showQRCode") }}
      </q-tooltip>
    </button>
    <ContextMenu
      :menu-items="menuItems"
      @showDetails="details(address)"
      @copyAddress="copyAddress(address.address, $event)"
    />
  </div>
</template>

<script>
import ContextMenu from "components/menus/contextmenu";

export default {
  name: "ReceiveItem",
  components: {
    ContextMenu
  },
  filters: {
    toString: function(value) {
      if (typeof value !== "number") return "N/A";
      return String(value);
    },
    currency: function(value) {
      if (typeof value !== "number") return "N/A";

      const amount = value / 1e9;
      return amount.toLocaleString();
    }
  },
  props: {
    address: {
      type: Object,
      required: true
    },
    sublabel: {
      type: String,
      required: false,
      default: undefined
    },
    shouldShowInfo: {
      type: Boolean,
      required: false,
      default: true
    },
    showQR: {
      type: Function,
      required: true
    },
    copyAddress: {
      type: Function,
      required: true
    },
    details: {
      type: Function,
      required: true
    },
    whiteQRIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    const menuItems = [
      { action: "showDetails", i18n: "menuItems.showDetails" },
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];
    return {
      menuItems
    };
  },
  computed: {
    qrImage() {
      const image = this.whiteQRIcon ? "qr-code" : "qr-code-grey";
      return `${image}.svg`;
    }
  }
};
</script>

<style>
/* Legacy globals: addressbook.vue uses these class names too. */
.address-label {
  color: #afafbe;
  font-size: 14px;
}
.address-sub-label {
  color: #afafbe;
  font-size: 10px;
}
</style>

<style lang="scss">
.beldex-app .receive-item {
  display: flex;
  align-items: center;
  gap: var(--beldex-space-2);
  min-height: 40px;
  padding: var(--beldex-space-1) 0;
  border-bottom: 1px solid var(--beldex-hairline);

  &__main {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: var(--beldex-space-4);
    min-width: 0;
    padding: 0;
    text-align: left;
    color: var(--beldex-text);
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  &__index {
    flex: none;
    min-width: 28px;
    padding: 2px 6px;
    font-size: var(--beldex-text-xs);
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border);
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__address {
    font-size: var(--beldex-text-md);
    line-height: 16px;
  }

  &__sub {
    font-size: var(--beldex-text-xs);
    color: var(--beldex-text-faint);
  }
}
</style>
