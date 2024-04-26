<template>
  <q-page class="receive" style="min-height: unset">
    <q-list
      v-if="!address"
      link
      no-border
      :dark="theme == 'dark'"
      class="oxen-list"
    >
      <q-item-label header class="list-header text-center ft-semibold"
        >{{ $t("strings.addresses.primaryAccount") }}
      </q-item-label>
      <!-- <ReceiveItem
        v-for="address in address_list.primary"
        :key="address.address"
        class="primary-address"
        :address="address"
        :sublabel="$t('strings.addresses.primaryAddress')"
        :show-q-r="showQR"
        :copy-address="copyAddress"
        :details="details"
        white-q-r-icon
      />-->
      <article class="flex justify-center align-center">
        <div
          style="
            border: 11px solid #1f1f28;
            display: inline-block;
            border-radius: 20px;
          "
        >
          <div class="text-center qr-card">
            <QrcodeVue ref="qr" :value="info.address" size="100"></QrcodeVue>
          </div>
        </div>
      </article>
      <article
        class="copy-btn flex justify-center align-center q-mt-sm q-mb-lg"
      >
        <q-btn
          style="border-radius: 6px"
          color="primary"
          :label="$t('dialog.copyAddress.title')"
          icon="content_copy"
          padding="md"
          class="q-px-md"
          @click="copyAddress(info.address)"
        />
      </article>
      <div class="hr-separator" />

      <template v-if="address_list.used.length">
        <q-item-label header class="list-header">
          {{ $t("strings.addresses.myUsedAddresses") }}
        </q-item-label>

        <ReceiveItem
          v-for="address in address_list.used"
          :key="address.address"
          :address="address"
          :sublabel="
            `${$t('strings.addresses.subAddress')} (${$t(
              'strings.addresses.subAddressIndex',
              {
                index: address.address_index
              }
            )})`
          "
          :show-q-r="showQR"
          :copy-address="copyAddress"
          :details="details"
        />
      </template>

      <template v-if="address_list.unused.length">
        <q-item-label header class="list-header">{{
          $t("strings.addresses.myUnusedAddresses")
        }}</q-item-label>
        <ReceiveItem
          v-for="address in address_list.unused"
          :key="address.address"
          :address="address"
          :sublabel="
            `${$t('strings.addresses.subAddress')} (${$t(
              'strings.addresses.subAddressIndex',
              {
                index: address.address_index
              }
            )})`
          "
          :show-q-r="showQR"
          :copy-address="copyAddress"
          :details="details"
          :should-show-info="false"
        />
      </template>
    </q-list>
    <AddressDetails
      v-else-if="address"
      :address="address"
      @details="details($event)"
    />

    <!-- QR Code -->
    <template v-if="QR.address != null">
      <q-dialog v-model="QR.visible" :content-class="'qr-code-modal'">
        <q-card class="qr-code-card">
          <div
            class="text-center  q-pa-md q-ma-lg "
            style="background-color: white; border-radius: 10px;"
          >
            <QrcodeVue ref="qr" :value="QR.address" size="240"></QrcodeVue>
            <ContextMenu
              :menu-items="menuItems"
              @copyQR="copyQR()"
              @saveQR="saveQR()"
            />
          </div>

          <q-card-actions class="q-mb-md " style="margin-right: 0;">
            <q-btn
              color="primary"
              :label="$t('buttons.close')"
              @click="QR.visible = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </q-page>
</template>

<script>
const { clipboard, nativeImage } = require("electron");
import { mapState } from "vuex";
import QrcodeVue from "qrcode.vue";
import AddressDetails from "components/address_details";
import ReceiveItem from "components/receive_item";
import ContextMenu from "components/menus/contextmenu";

export default {
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
  components: {
    AddressDetails,
    QrcodeVue,
    ReceiveItem,
    ContextMenu
  },
  data() {
    const menuItems = [
      { action: "copyQR", i18n: "menuItems.copyQR" },
      { action: "saveQR", i18n: "menuItems.saveQR" }
    ];

    return {
      QR: {
        visible: false,
        address: null
      },
      menuItems,
      subAddressList: false,
      address: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    address_list: state => state.gateway.wallet.address_list,
    info: state => state.gateway.wallet.info
  }),
  methods: {
    details(address) {
      this.address = address;
      // this.$refs.addressDetails.address = address;
      // this.$refs.addressDetails.isVisible = true;
    },
    showQR(address, event) {
      event.stopPropagation();
      this.QR.visible = true;
      this.QR.address = address;
    },
    copyQR() {
      const data = this.$refs.qr.$el.childNodes[0].toDataURL();
      const img = nativeImage.createFromDataURL(data);
      clipboard.writeImage(img);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.qrCopied")
      });
    },
    saveQR() {
      let img = this.$refs.qr.$el.childNodes[0].toDataURL();
      this.$gateway.send("core", "save_png", { img, type: "QR Code" });
    },
    copyAddress(value) {
      clipboard.writeText(value);
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
.qr-options-menu {
  min-width: 150px;
  max-height: 300px;
  color: white;
}

.receive {
  // height: 599px;
  // overflow: auto;
  min-height: unset;
  .q-item-label {
    font-weight: 400;
  }

  .oxen-list-item {
    cursor: pointer;
    border: none;
    .q-item-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .info {
      span {
        font-size: 14px;
      }

      .value {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .qr-card {
    background: white;
    display: inline-block;
    border-radius: 10px;
    line-height: unset;
    padding: 8px 8px 4px 8px;
  }
}
.copy-btn {
  .q-btn .q-icon {
    font-size: 1.2em;
  }
  .on-left {
    margin-right: 5px;
  }
  .bg-primary {
    min-width: unset;
    // height: 35px;
    font-size: 14px;
  }
}
</style>
