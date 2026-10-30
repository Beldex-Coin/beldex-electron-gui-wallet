<template>
  <!-- Address details with QR dialog. -->
  <div class="address_details">
    <div class="details__head">
      <button
        type="button"
        class="beldex-icon-btn"
        :aria-label="$t('buttons.back')"
        @click="$emit('details', '')"
      >
        ←
      </button>
      <span class="details__title">{{ $t("titles.addressDetails") }}</span>
    </div>

    <template v-if="address != null">
      <div class="details__summary">
        <button
          type="button"
          class="details__qr"
          :aria-label="$t('menuItems.showQRCode')"
          @click="isQRCodeVisible = true"
        >
          <QrcodeVue :value="address.address" size="112"></QrcodeVue>
        </button>
        <div class="details__who">
          <span class="beldex-label">
            {{
              address.address_index === 0
                ? $t("strings.addresses.primaryAccount")
                : $t("strings.addresses.subAddress") +
                  " · " +
                  $t("strings.addresses.subAddressIndex", {
                    index: address.address_index
                  })
            }}
          </span>
          <p class="details__address">{{ address.address }}</p>
          <q-btn
            class="beldex-btn beldex-btn--ghost details__copy"
            unelevated
            no-caps
            icon="content_copy"
            :label="$t('menuItems.copyAddress')"
            @click="copyAddress()"
          />
        </div>
      </div>

      <div class="beldex-hint details__note">
        <q-icon name="info_outline" size="14px" />
        {{ addressHeaderInfo.extra }}
      </div>

      <div class="details__stats">
        <div class="details__stat">
          <span class="beldex-label">{{ $t("strings.oxenBalance") }}</span>
          <span class="details__value"
            ><FormatBeldex :amount="address.used ? address.balance : 0"
          /></span>
        </div>
        <div class="details__stat">
          <span class="beldex-label">{{
            $t("strings.oxenUnlockedBalance")
          }}</span>
          <span class="details__value"
            ><FormatBeldex :amount="address.used ? address.unlocked_balance : 0"
          /></span>
        </div>
        <div class="details__stat">
          <span class="beldex-label">{{ $t("strings.unspentOutputs") }}</span>
          <span class="details__value">{{
            address.used ? address.num_unspent_outputs : 0
          }}</span>
        </div>
      </div>

      <q-dialog v-model="isQRCodeVisible">
        <div class="beldex-dialog">
          <div class="beldex-dialog__head">
            <div class="beldex-dialog__icon">
              <q-icon name="qr_code_2" size="20px" />
            </div>
            <div>
              <h2 class="beldex-dialog__title">
                {{
                  address.address_index === 0
                    ? $t("strings.addresses.primaryAccount")
                    : $t("strings.addresses.subAddress")
                }}
              </h2>
            </div>
          </div>

          <div class="beldex-dialog__body">
            <!-- Dark modules on a light tile with a quiet zone (plan §8.3) -->
            <div class="beldex-dialog__qr">
              <QrcodeVue ref="qr" :value="address.address" size="176">
              </QrcodeVue>
              <q-menu content-menu>
                <q-list
                  link
                  separator
                  style="min-width: 150px; max-height: 300px"
                >
                  <q-item v-close-popup @click.native="copyQR()">
                    <q-item-label :label="$t('menuItems.copyQR')" />
                  </q-item>
                  <q-item v-close-popup @click.native="saveQR()">
                    <q-item-label :label="$t('menuItems.saveQR')" />
                  </q-item>
                </q-list>
              </q-menu>
            </div>

            <div class="beldex-dialog__inset beldex-dialog__inset--copy">
              <div class="beldex-dialog__inset-text">{{ address.address }}</div>
              <q-btn
                class="beldex-dialog__copy"
                flat
                :aria-label="$t('menuItems.copyAddress')"
                @click="copyAddress()"
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
              @click="isQRCodeVisible = false"
            />
          </div>
        </div>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clipboard, nativeImage } from "src/shims/electron-renderer";
// import AddressHeader from "components/address_header";
import FormatBeldex from "components/format_beldex";
import QrcodeVue from "qrcode.vue";
// import TxList from "components/tx_list";
export default {
  name: "AddressDetails",
  components: {
    // AddressHeader,
    // TxList,
    FormatBeldex,
    QrcodeVue
  },
  props: {
    address: {
      required: false
    }
  },
  data() {
    return {
      isVisible: false,
      isQRCodeVisible: false
    };
  },
  computed: mapState({
    addressHeaderInfo() {
      if (!this.address) return null;

      let title = this.$t("strings.addresses.primaryAddress");
      if (this.address.address_index !== 0) {
        title =
          this.$t("strings.addresses.subAddress") +
          " (" +
          this.$t("strings.addresses.subAddressIndex", {
            index: this.address.address_index
          }) +
          ")";
      }

      const extra = this.address.used
        ? this.$t("strings.userUsedAddress")
        : this.$t("strings.userNotUsedAddress");

      return {
        title,
        extra
      };
    }
  }),
  methods: {
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
    copyAddress() {
      clipboard.writeText(this.address.address);
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
.beldex-app .address_details {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-5);

  .details__head {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
  }

  .details__title {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-base);
    color: var(--beldex-text);
  }

  .details__summary {
    display: flex;
    gap: var(--beldex-space-5);
  }

  // QR sits dark-on-light with a 4+ module quiet zone (plan §8.3).
  .details__qr {
    flex: none;
    align-self: flex-start;
    padding: var(--beldex-space-3);
    line-height: 0;
    cursor: pointer;
    background-color: #fff;
    border: 0;
  }

  .details__who {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--beldex-space-3);
    min-width: 0;
  }

  .details__address {
    margin: 0;
    font-size: var(--beldex-text-md);
    line-height: 18px;
    color: var(--beldex-text);
    word-break: break-all;
  }

  .details__copy {
    align-self: flex-start;
    min-height: 32px;
    padding: 0 var(--beldex-space-4);

    .q-icon {
      font-size: 14px;
    }
  }

  .details__note {
    padding: var(--beldex-space-3) var(--beldex-space-4);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  .details__stats {
    display: flex;
    gap: var(--beldex-space-3);
  }

  .details__stat {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    gap: var(--beldex-space-2);
    min-width: 0;
    padding: var(--beldex-space-3) var(--beldex-space-4);
    background-color: rgba(8, 8, 8, 0.8);
    border: 1px solid var(--beldex-hairline);
  }

  .details__value {
    font-size: var(--beldex-text-base);
    font-weight: 700;
    color: var(--beldex-text);
  }
}
</style>
