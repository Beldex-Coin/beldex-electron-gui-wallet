<template>
  <!-- Receive -->
  <q-page class="receive">
    <div v-if="!address" class="receive__list">
      <section class="receive__primary">
        <!-- QR stays dark-on-light with a quiet zone (plan §8.3). -->
        <div class="receive__qr">
          <QrcodeVue ref="qr" :value="info.address" size="92"></QrcodeVue>
        </div>
        <div class="receive__primary-meta">
          <span class="beldex-label">{{
            $t("strings.addresses.primaryAccount")
          }}</span>
          <p class="receive__address">{{ info.address }}</p>
          <div class="receive__primary-actions">
            <q-btn
              class="beldex-btn beldex-btn--ghost receive__copy"
              unelevated
              no-caps
              @click="copyAddress(info.address)"
            >
              <img src="~assets/icons/copy.svg" alt="" />
              {{ $t("dialog.copyAddress.title") }}
            </q-btn>
          </div>
        </div>
      </section>

      <section v-if="address_list.unused.length" class="receive__group">
        <div class="receive__group-head">
          <span class="beldex-label">{{
            $t("strings.addresses.myUnusedAddresses")
          }}</span>
          <span class="receive__count">{{ address_list.unused.length }}</span>
        </div>
        <ReceiveItem
          v-for="item in address_list.unused"
          :key="item.address"
          :address="item"
          :show-q-r="showQR"
          :copy-address="copyAddress"
          :details="details"
          :should-show-info="false"
        />
      </section>

      <!-- Used addresses list -->
      <section v-if="address_list.used.length" class="receive__group">
        <div class="receive__group-head">
          <span class="beldex-label">{{
            $t("strings.addresses.myUsedAddresses")
          }}</span>
          <span class="receive__count">{{ address_list.used.length }}</span>
        </div>
        <ReceiveItem
          v-for="item in address_list.used"
          :key="item.address"
          :address="item"
          :show-q-r="showQR"
          :copy-address="copyAddress"
          :details="details"
        />
      </section>
    </div>
    <AddressDetails
      v-else-if="address"
      :address="address"
      @details="details($event)"
    />

    <!-- QR Code -->
    <template v-if="QR.address != null">
      <q-dialog v-model="QR.visible">
        <div class="beldex-dialog">
          <div class="beldex-dialog__head">
            <div class="beldex-dialog__icon">
              <q-icon name="qr_code_2" size="20px" />
            </div>
            <div>
              <h2 class="beldex-dialog__title">
                {{
                  QR.address === info.address
                    ? $t("strings.addresses.primaryAccount")
                    : $t("strings.addresses.subAddress")
                }}
              </h2>
            </div>
          </div>

          <div class="beldex-dialog__body">
            <!-- Dark modules on a light tile with a quiet zone (plan §8.3) -->
            <div class="beldex-dialog__qr">
              <QrcodeVue ref="qr" :value="QR.address" size="176"></QrcodeVue>
              <ContextMenu
                :menu-items="menuItems"
                @copyQR="copyQR()"
                @saveQR="saveQR()"
              />
            </div>

            <div class="beldex-dialog__inset beldex-dialog__inset--copy">
              <div class="beldex-dialog__inset-text">{{ QR.address }}</div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                :aria-label="$t('menuItems.copyAddress')"
                @click="copyAddress(QR.address)"
              >
                <img src="~assets/icons/copy.svg" alt="" />
              </q-btn>
            </div>
          </div>

          <div class="beldex-dialog__actions">
            <q-btn
              class="beldex-btn beldex-btn--ghost"
              unelevated
              no-caps
              :label="$t('buttons.close')"
              @click="QR.visible = false"
            />
          </div>
        </div>
      </q-dialog>
    </template>
  </q-page>
</template>

<script>
import { clipboard, nativeImage } from "src/shims/electron-renderer";
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

.beldex-app .receive {
  min-height: 0 !important; // beats q-page's inline min-height

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-6);
  }

  &__primary {
    display: flex;
    gap: var(--beldex-space-6);
  }

  &__qr {
    flex: none;
    line-height: 0;
    padding: 8px; // quiet zone ≥ 4 modules at this size
    background-color: #fff;
  }

  &__primary-meta {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
    min-width: 0;
  }

  &__address {
    margin: 0;
    font-size: var(--beldex-text-md);
    line-height: 20px;
    color: var(--beldex-text);
    word-break: break-all;
  }

  &__primary-actions {
    display: flex;
    gap: var(--beldex-space-2);
  }

  &__copy {
    min-height: 32px;
    padding: 0 var(--beldex-space-3);
    font-size: var(--beldex-text-md);
    text-transform: none;

    img {
      width: 14px;
      height: 14px;
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
  }

  &__group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-2);
    border-bottom: 1px solid var(--beldex-hairline);

    .beldex-label {
      font-size: var(--beldex-text-sm);
    }
  }

  &__count {
    font-size: var(--beldex-text-xs);
    color: var(--beldex-text-faint);
  }
}
</style>
