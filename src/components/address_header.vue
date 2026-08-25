<template>
  <div class="address-header-div">
    <q-item-section class="self-start">
      <div class="name q-mb-sm">{{ this.$t("fieldLabels.name") }}</div>
      <q-item-label
        class="tittle-Box non-selectable flex items-center q-mb-md ellipsis"
        >{{ title }}</q-item-label
      >

      <div class="flex row items-center q-mb-sm">
        <div class="name ">{{ this.$t("fieldLabels.address") }}</div>
        <q-btn
          side
          flat
          padding="sm"
          size="sm"
          icon="content_copy"
          class="q-ml-sm copy-icon "
          color="green"
          @click="copyAddress"
        >
          <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
            {{ $t("menuItems.copyAddress") }}
          </q-tooltip>
        </q-btn>
      </div>

      <q-item-label class="row">
        <q-item-section class="break-all address_box">
          {{ address }}
        </q-item-section>
        <!-- <q-item-section v-if="showCopy" side>
          <q-btn
            ref="copy"
            color="primary"
            padding="xs"
            size="sm"
            icon="file_copy"
            @click="copyAddress"
          >
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[5, 10]"
            >
              {{ $t("menuItems.copyAddress") }}
            </q-tooltip>
          </q-btn>
        </q-item-section> -->
      </q-item-label>
      <q-item-label v-if="extra" header class="extra non-selectable">{{
        extra
      }}</q-item-label>
    </q-item-section>
    <ContextMenu :menu-items="menuItems" @copyAddress="copyAddress" />
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import ContextMenu from "components/menus/contextmenu";

export default {
  name: "AddressHeader",
  components: {
    ContextMenu
  },
  props: {
    title: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    extra: {
      type: String,
      required: false,
      default: undefined
    },
    showCopy: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    const menuItems = [
      { action: "copyAddress", i18n: "menuItems.copyAddress" }
    ];
    return {
      menuItems
    };
  },
  methods: {
    copyAddress() {
      if (this.$refs.copy) {
        this.$refs.copy.$el.blur();
      }
      clipboard.writeText(this.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
</script>

<style lang="scss">
.address-header-div {
  .title {
    font-size: 20px;
    color: #fff;
  }

  .name {
    // font-weight: 500;
    font-weight: 500;
    font-size: 16px;
    // line-height: 24px;
    color: #ffffff;
    font-family: "Poppins-Regular";
  }

  .extra {
    color: #fff;
  }
  .copy-icon {
    height: 34px;
  }
}

// is this even used?
.address-header {
  padding: 0;
  img {
    float: left;
    margin-right: 15px;
  }
  h3 {
    margin: 15px 0 0;
  }
  p {
    word-break: break-all;
  }

  &::after {
    content: "";
    clear: both;
    display: table;
  }

  .q-item-label {
    .q-item-label {
      font-weight: 400;
    }
  }
}
</style>
