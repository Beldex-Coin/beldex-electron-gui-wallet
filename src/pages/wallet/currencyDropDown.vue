<template>
  <span class="dropdown" :class="{ shown: state }">
    <!-- <a href="#" @click.prevent="toggleDropdown" class="dropdown-toggle"
      >toggle</a
    > -->
    <button
      class="currency-btn dropdown-send-type justify-between items-center"
      @click.prevent="toggleDropdown"
    >
      <div class="current-name">
        <span
          class="currency-coin currency-coin--letter"
          :style="badgeStyle(sendAmounTypeValue.name)"
          >{{ badgeLetter(sendAmounTypeValue.name) }}</span
        >
        <span class="ft-semibold">{{ this.sendAmounTypeValue.name }}</span>
        <span class="currency-name ft-regular">{{
          this.sendAmounTypeValue.fullName
        }}</span>
      </div>
      <q-icon name="expand_more" size="sm"></q-icon>
    </button>
    <div v-show="state" class="dropdown-menu">
      <div class="optionView">
        <div class="innerWrapper coin-picker">
          <div class="coin-search">
            <q-icon name="search" size="18px" class="coin-search__icon" />
            <input
              ref="currency"
              :value="searchTxt"
              class="search-input coin-search__input"
              placeholder="Search coins"
              @input="event => this.set_searchCurrency(event.target.value)"
            />
          </div>
          <div class="coin-list">
            <template v-for="section in sections">
              <div
                v-if="section.title"
                :key="`title-${section.key}`"
                class="coin-section-title"
              >
                {{ section.title }}
              </div>
              <div
                v-for="(currency, index) in section.items"
                :key="
                  `${section.key}-${currency.value}-${currency.protocol}-${index}`
                "
                class="coin-row"
                :class="{ 'coin-row--selected': isSelected(currency) }"
                @click="set_amountValidator(currency)"
              >
                <span class="coin-badge" :style="badgeStyle(currency.name)">{{
                  badgeLetter(currency.name)
                }}</span>
                <span class="coin-ticker">{{ currency.name }}</span>
                <span class="coin-full">{{ currency.fullName }}</span>
                <span v-if="currency.protocol" class="coin-proto">{{
                  currency.protocol
                }}</span>
                <q-icon
                  v-if="isSelected(currency)"
                  name="check"
                  size="18px"
                  class="coin-check"
                />
              </div>
            </template>
            <div v-if="!hasResults" class="coin-empty">No coins found</div>
          </div>
        </div>
      </div>
    </div>
    <transition />
  </span>
</template>

<script>
const COIN_COLORS = {
  ETH: "#8a92b2",
  BTC: "#f7931a",
  XRP: "#6b6b6b",
  XMR: "#ff6600",
  SOL: "#9945ff",
  BNB: "#f0b90b",
  BDX: "#00ad7c",
  USDT: "#26a17b",
  USDC: "#2775ca"
};

export default {
  name: "Dropdown",
  props: {
    filterCurrecyList: {
      type: Array,
      require: true
    },
    privacyCurrency: {
      type: Array,
      require: true
    },
    sendAmountValidator: {
      require: true
    },
    sendAmounType: {
      require: true
    },
    searchCurrency: {
      require: true
    },
    sendAmounTypeValue: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      state: false,
      searchTxt: ""
    };
  },
  computed: {
    sections() {
      const all = this.filterCurrecyList || [];
      if (this.searchTxt) {
        return [{ key: "all", title: "", items: all }];
      }
      const privacy = this.privacyCurrency || [];
      return [
        ...(privacy.length
          ? [{ key: "privacy", title: "Privacy Currencies", items: privacy }]
          : []),
        {
          key: "all",
          title: privacy.length ? "All Currencies" : "",
          items: all
        }
      ];
    },
    hasResults() {
      return this.sections.some(section => section.items.length);
    }
  },
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.close);
  },
  methods: {
    isSelected(currency) {
      const current = this.sendAmounTypeValue || {};
      return (
        currency.value === current.value &&
        (currency.protocol || "") === (current.protocol || "")
      );
    },
    badgeLetter(name) {
      return String(name || "")
        .charAt(0)
        .toUpperCase();
    },
    // No provider logos: a letter on a per-coin colour (known coins fixed,
    // everything else a stable hue derived from the ticker).
    badgeStyle(name) {
      const ticker = String(name || "").toUpperCase();
      let background = COIN_COLORS[ticker];
      if (!background) {
        let hash = 0;
        for (let i = 0; i < ticker.length; i++) {
          hash = (hash * 31 + ticker.charCodeAt(i)) % 360;
        }
        background = `hsl(${hash}, 55%, 45%)`;
      }
      return { backgroundColor: background };
    },

    set_searchCurrency(val) {
      this.searchTxt = val;
      this.$emit("searchCurrency", val);
    },

    set_amountValidator(val) {
      this.$emit("sendAmounType", val);
      this.$emit("sendAmountValidator");
      this.state = false;
      if (this.searchTxt) {
        this.searchTxt = "";
        this.$emit("searchCurrency", "");
      }
    },

    toggleDropdown() {
      this.state = !this.state;
      this.$nextTick(() => {
        // This callback will only be called after the
        // DOM has been updated
        this.$refs.currency.focus();
      });
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.state = false;
        if (this.searchTxt) {
          this.searchTxt = "";
          this.$emit("searchCurrency", "");
        }
      }
    }
  }
};
</script>

<style lang="scss">
.beldex-app .swap .coin-picker.innerWrapper {
  display: flex;
  flex-direction: column;
  width: 340px;
  height: auto;
  max-height: 380px;
  padding: var(--beldex-space-3);
  overflow: hidden;
  background-color: var(--beldex-panel);
  border: 1px solid var(--beldex-border-strong);
  border-radius: 4px;
  box-shadow: var(--beldex-shadow-panel);

  .coin-search {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--beldex-space-3);
    height: 44px;
    padding: 0 var(--beldex-space-4);
    background-color: var(--beldex-input-bg);
    border: 1px solid var(--beldex-border-input);
    border-radius: 4px;

    &:focus-within {
      border-color: var(--beldex-border-focus);
    }
  }

  .coin-search__icon {
    color: var(--beldex-text-muted);
  }

  .coin-search__input {
    flex: 1;
    min-width: 0;
    font-family: var(--beldex-font-mono);
    font-size: 13px;
    color: var(--beldex-text);
    background-color: transparent;

    &::placeholder {
      color: var(--beldex-text-faint);
    }
  }

  .coin-list {
    flex: 1;
    min-height: 0;
    margin-top: var(--beldex-space-2);
    overflow-y: auto;
  }

  .coin-section-title {
    padding: var(--beldex-space-3) var(--beldex-space-3) var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);
  }

  .coin-row {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    height: 44px;
    padding: 0 var(--beldex-space-3);
    cursor: pointer;
    color: var(--beldex-text);
    border-radius: 4px;

    &:hover,
    &--selected {
      background-color: var(--beldex-panel-raised);
    }
  }

  .coin-badge {
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--beldex-font-mono);
    font-size: 12px;
    font-weight: 700;
    color: #fff;
  }

  .coin-ticker {
    flex: none;
    font-weight: 700;
  }

  .coin-full {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-family: var(--beldex-font-mono);
    font-size: 13px;
    color: var(--beldex-text-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .coin-proto {
    flex: none;
    padding: 1px 6px;
    font-size: 10px;
    color: var(--beldex-text-muted);
    border: 1px solid var(--beldex-border-strong);
    border-radius: 3px;
  }

  .coin-check {
    flex: none;
    color: #3fb950;
  }

  .coin-empty {
    padding: var(--beldex-space-5) var(--beldex-space-3);
    font-size: 13px;
    color: var(--beldex-text-muted);
  }
}
</style>
