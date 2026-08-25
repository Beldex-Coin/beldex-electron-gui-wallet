<template>
  <!-- <q-dialog v-model="isVisible" maximized> -->
  <div class="address_details q-px-md">
    <q-layout style="min-height: unset">
      <q-header>
        <q-toolbar color="dark" inverted>
          <!-- <q-btn flat round dense @click="() => this.$emit('details', '')"> -->
          <div
            class="flex items-center back-arrow-btn"
            @click="() => this.$emit('details', '')"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 -6.10352e-05C5.8201 -6.10352e-05 0 5.82008 0 13C0 20.18 5.8201 26.0001 13 26.0001C20.1799 26.0001 26 20.18 26 13C26 5.82008 20.1799 -6.10352e-05 13 -6.10352e-05ZM18.2 14.3H10.9382L13 16.3618C13.507 16.8688 13.507 17.6931 13 18.2001C12.493 18.7071 11.6688 18.7071 11.1618 18.2001L6.8809 13.9191C6.3726 13.4108 6.3726 12.5879 6.8809 12.0809L11.1618 7.79999C11.6688 7.29299 12.493 7.29299 13 7.79999C13.507 8.30699 13.507 9.1312 13 9.6382L10.9382 11.7H18.2C18.9176 11.7 19.5 12.2824 19.5 13C19.5 13.7176 18.9176 14.3 18.2 14.3Z"
                fill="white"
              />
            </svg>
          </div>
          <!-- </q-btn> -->
          <q-toolbar-title>
            {{ $t("titles.addressDetails") }}
          </q-toolbar-title>
          <q-btn
            flat
            style="margin-right: 4px"
            icon="qr_code_scanner"
            padding="sm"
            size="sm"
            class="copy-icon"
            @click="isQRCodeVisible = true"
          />
          <!-- <q-btn
            class="q-ml-sm copy-icon green-icon"
            flat
            padding="sm"
            size="sm"
            icon="content_copy"
            @click="copyAddress()"
          /> -->
        </q-toolbar>
      </q-header>
      <!-- <q-page-container class="detail-page"> -->
      <q-page style="min-height: unset">
        <!-- <div class="layout-padding"> -->
        <div>
          <template v-if="address != null">
            <!-- <AddressHeader
            class="address-details"
              :address="address.address"
              :title="addressHeaderInfo.title"
              :extra="addressHeaderInfo.extra"
              :show-copy="false"
            /> -->
            <div class="address-section">
              <div class="ft-medium label q-mt-md q-mb-xs">
                {{ $t("fieldLabels.address") }}
                <q-btn
                  class="q-ml-sm address-copy-btn"
                  flat
                  padding="sm"
                  size="sm"
                  icon="content_copy"
                  color="green"
                  @click="copyAddress()"
                />
              </div>
              <div class="address-box">
                {{ address.address }}
              </div>
              <div class="hint-txt ft-medium">
                {{ addressHeaderInfo.extra }}
              </div>
            </div>

            <template v-if="address.used">
              <div class="" style="max-width: 768px">
                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.oxenBalance") }}</span>
                    </div>
                    <div class="value">
                      <span><FormatOxen :amount="address.balance"/></span>
                    </div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.oxenUnlockedBalance") }}</span>
                    </div>
                    <div class="value">
                      <span
                        ><FormatOxen :amount="address.unlocked_balance"
                      /></span>
                    </div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.numberOfUnspentOutputs") }}</span>
                    </div>
                    <div class="value">
                      <span>{{ address.num_unspent_outputs }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div style="max-width: 768px">
                <!-- <div class="infoBox">
                  <div class="infoBoxContent"> -->
                <div class="ft-medium label q-mt-sm">
                  {{ $t("strings.oxenBalance") }}
                </div>
                <div class="value balance-box">0</div>
                <!-- </div>
                </div> -->
                <div class="flex row justify-between q-mt-md">
                  <!-- <div class="infoBox">
                    <div class="infoBoxContent"> -->
                  <div class="col-sm-5">
                    <div class="ft-medium label">
                      <span>{{ $t("strings.oxenUnlockedBalance") }}</span>
                    </div>

                    <div class="value"><span>0</span></div>
                  </div>
                  <!-- </div>
                  </div> -->

                  <!-- <div class="infoBox">
                    <div class="infoBoxContent"> -->
                  <div class="col-sm-5">
                    <div class="ft-medium label">
                      <!-- <span>{{ $t("strings.numberOfUnspentOutputs") }}</span> -->
                      <span>{{ $t("strings.unspentOutputs") }}</span>
                    </div>
                    <div class="value"><span>0</span></div>
                  </div>
                  <!-- </div>
                  </div> -->
                </div>
              </div>
            </template>

            <!-- <div class="q-mt-sm">
              <div class="ft-medium recent-transactions-wrapper">
                <q-icon name="history" size="24px" /> -->
            <!-- <span class="vertical-middle q-ml-xs">{{
                  $t("strings.recentIncomingTransactionsToAddress")
                }}</span> -->
            <!-- <span class="vertical-middle q-ml-xs"
                  >Recent incoming Transactions</span
                >
              </div> -->

            <!-- <div style="margin: 12px -16px">
                <TxList
                  :key="address.address"
                  type="all_in"
                  :limit="5"
                  :to-incoming-address-index="address.address_index"
                />
              </div>
            </div> -->
          </template>
        </div>
      </q-page>
    </q-layout>
    <template v-if="address != null">
      <q-dialog
        v-model="isQRCodeVisible"
        minimized
        :content-class="'qr-code-modal'"
      >
        <q-card class="qr-code-card">
          <div
            class="text-center  q-pa-md q-ma-lg"
            style="background: white;border-radius: 10px;"
          >
            <QrcodeVue ref="qr" :value="address.address" size="240">
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
          <q-card-actions>
            <q-btn
              class="q-mb-md"
              color="primary"
              :label="$t('buttons.close')"
              @click="isQRCodeVisible = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clipboard, nativeImage } from "src/shims/electron-renderer";
// import AddressHeader from "components/address_header";
import FormatOxen from "components/format_oxen";
import QrcodeVue from "qrcode.vue";
// import TxList from "components/tx_list";
export default {
  name: "AddressDetails",
  components: {
    // AddressHeader,
    // TxList,
    FormatOxen,
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
.address_details {
  .q-layout {
    background-color: unset;
  }
  .q-toolbar {
    padding: 0;
    background-color: #242433;
  }

  .copy-icon {
    background-color: #1f1f28;
    height: 35px;
    width: 35px;
    border-radius: 7px;
  }
  .copy-icon:hover {
    border-radius: 10px !important;
  }

  .green-icon {
    .q-icon {
      color: #20d030;
    }
  }

  .address-copy-btn {
    // .q-btn--flat {
    height: unset !important;
    // }
  }
  .address-section {
    color: white;
    padding-top: 70px;
  }
  .hint-txt {
    color: #9393b1;
  }
  .label {
    color: white;
    font-size: 1rem;
  }
  .value,
  .balance-box {
    color: white;
    // width: 181px;
    font-size: 1rem !important;
    padding: 15px;
    border-radius: 10px;
  }
  .balance-box {
    width: unset;
  }
  .recent-transactions-wrapper {
    color: white;
    font-size: 1rem;
  }
}
</style>
