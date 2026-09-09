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
        <span class="ft-semibold">{{ this.sendAmounTypeValue.name }}</span>
        <span class="currency-name ft-regular">
          - {{ this.sendAmounTypeValue.fullName }}
        </span>
      </div>
      <q-icon name="expand_more" size="sm"></q-icon>
    </button>
    <div v-show="state" class="dropdown-menu">
      <!-- <ul class="list-unstyled"  v-for="currency in this.filterCurrecyList"
                :key="currency.value" >
                  
                {{ currency.name }}
                </ul> -->
      <div class="optionView">
        <div class="innerWrapper q-px-lg">
          <OxenField class="q-mt-md  q-mb-sm ft-regular ">
            <input
              ref="currency"
              :value="searchTxt"
              class="search-input "
              placeholder="Search"
              @input="event => this.set_searchCurrency(event.target.value)"
            />
          </OxenField>
          <div v-if="!searchTxt">
            <div>Privacy Currencies</div>
            <div
              v-for="(currency, index) in this.privacyCurrency"
              :key="`${currency.ticker}-${index}`"
              @click="set_amountValidator(currency)"
            >
              <q-item-section class="swapdropDown-option q-py-sm q-pl-md">
                <q-img
                  class="q-mr-sm"
                  :src="safeImageSrc(currency.image)"
                  style="height: 20px; max-width: 20px; filter: grayscale(150)"
                />
                <q-item-label class="ft-bold q-mr-xs"
                  >{{ currency.name }}
                </q-item-label>
                <q-item-label class="currency-name ft-regular ">
                  - {{ currency.fullName }}</q-item-label
                >
                <q-item-label
                  v-if="currency.protocol"
                  class="currency-proto ft-semibold q-ml-sm "
                >
                  {{ currency.protocol }}</q-item-label
                >
              </q-item-section>
            </div>
          </div>

          <div v-if="!searchTxt">All Currencies</div>

          <div
            v-for="(currency, index) in this.filterCurrecyList"
            :key="`${currency.value}-${index}`"
            @click="set_amountValidator(currency)"
          >
            <q-item-section class="swapdropDown-option q-py-sm q-pl-md">
              <q-img
                class="q-mr-sm"
                :src="safeImageSrc(currency.image)"
                style="height: 20px; max-width: 20px; filter: grayscale(150)"
              />
              <q-item-label class="ft-bold q-mr-xs"
                >{{ currency.name }}
              </q-item-label>
              <q-item-label class="currency-name ft-regular">
                - {{ currency.fullName }}</q-item-label
              >
              <q-item-label
                v-if="currency.protocol"
                class="currency-proto ft-semibold q-ml-sm"
              >
                {{ currency.protocol }}</q-item-label
              >
            </q-item-section>
          </div>
        </div>
      </div>
    </div>
    <transition />
  </span>
</template>

<script>
import OxenField from "components/oxen_field";

// Currency icon URLs come straight from the Changelly/QuickEx API responses
// (see swap_mappers.js) and are rendered as <img> sources - an "https only"
// check alone still lets either provider (or anyone able to influence what
// they return) point this at an arbitrary host. Restrict to the two swap
// providers' own domains, which is where their currency icons are actually
// served from (e.g. Changelly's are documented at cdn.changelly.com).
const TRUSTED_IMAGE_HOSTS = ["changelly.com", "quickex.io"];

function isTrustedImageHost(hostname) {
  return TRUSTED_IMAGE_HOSTS.some(
    domain => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export default {
  name: "Dropdown",
  components: {
    OxenField
  },
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
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.close);
  },
  methods: {
    safeImageSrc(url) {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" &&
          isTrustedImageHost(parsed.hostname)
          ? url
          : undefined;
      } catch (error) {
        return undefined;
      }
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
