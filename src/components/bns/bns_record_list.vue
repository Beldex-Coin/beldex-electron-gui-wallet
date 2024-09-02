<template>
  <q-list link no-border class="bns-record-list">
    <div
      v-for="record in recordList"
      :key="record.name_hash"
      class="recordListWrapper q-mb-md"
    >
      <q-item
        v-if="selectedNameHash !== record.name_hash"
        class="oxen-list-item q-px-md"
      >
        <q-item-section>
          <q-item-label
            :class="bindClass(record)"
            @click="selectAndValidateNamehash(record.name_hash)"
          >
            {{ record.name ? record.name : record.name_hash }}
            <!-- <span class="namehash">
              {{ record.name || record.name_hash }}
            </span>-->
          </q-item-label>
        </q-item-section>
        <q-item-section
          side
          class="height"
          @click="selectAndValidateNamehash(record.name_hash)"
        >
          <div>
            {{ record.expiration_height | expirationHeight }}
            <q-icon color="#8787A8" name="play_arrow" size="18px"></q-icon>
          </div>

          <!-- </template> -->
          <!-- <template v-else>
          <q-item-section>
            <div class="row update-renew-buttons">
              <q-btn
                color="primary"
                :label="$t('buttons.update')"
                @click="onUpdate(record)"
              />
              <q-btn
                v-if="isBelnet"
                color="primary"
                :label="$t('buttons.renew')"
                @click="onRenew(record)"
              />
            </div>
          </q-item-section>
          </template>-->
        </q-item-section>
        <!-- <q-item-section v-if="!isLocked(record)" side>
        <span v-if="record.type === 'bchat'">{{
          record.update_height | blockHeight
        }}</span>
        <span v-else class="belnet-expiration">{{
          record.expiration_height | expirationHeight
        }}</span>
        </q-item-section>-->

        <ContextMenu
          :menu-items="validMenuItems(record)"
          @ownerCopy="
            copy(record.owner, $t('notification.positive.ownerCopied'))
          "
          @nameCopy="copy(record.name, $t('notification.positive.nameCopied'))"
          @copyValue="copyValue(record)"
          @backupOwnerCopy="
            copy(
              record.backup_owner,
              $t('notification.positive.backupOwnerCopied')
            )
          "
        />
      </q-item>
      <section
        v-if="selectedNameHash === record.name_hash"
        class="q-pa-md"
        style="position: relative"
      >
        <div class="tablewrapper flex row no-wrap">
          <div class="label">{{ record.name ? "Name" : "Name Hash" }}</div>
          <div class="row no-wrap" style="width: 70%">
            <div class="address" style="width: 100%">
              {{ record.name || record.name_hash }}
            </div>
            <div
              class="upArrow clickable"
              @click="selectAndValidateNamehash('')"
            >
              <q-icon color="#8787A8" name="play_arrow" size="18px"></q-icon>
            </div>
          </div>
        </div>

        <div class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Expiration Height</div>
          <div class="address">{{ record.expiration_height }}</div>
        </div>

        <div class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Update Height</div>
          <div class="address">{{ record.update_height }}</div>
        </div>
        <div class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Owner</div>
          <div class="address">{{ record.owner }}</div>
        </div>
        <div class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Transaction ID</div>
          <div class="address">{{ record.txid }}</div>
        </div>
        <div
          v-if="!record.name && record.encrypted_bchat_value"
          class="tablewrapper flex row q-mt-md no-wrap"
        >
          <div class="label">Encrypted Bchat Value</div>
          <div class="address">{{ record.encrypted_bchat_value }}</div>
        </div>
        <div
          v-if="!record.name && record.encrypted_belnet_value"
          class="tablewrapper flex row q-mt-md no-wrap"
        >
          <div class="label">Encrypted Belnet Value</div>
          <div class="address">{{ record.encrypted_belnet_value }}</div>
        </div>
        <div
          v-if="!record.name && record.encrypted_wallet_value"
          class="tablewrapper flex row q-mt-md no-wrap"
        >
          <div class="label">Encrypted Wallet Value</div>
          <div class="address">{{ record.encrypted_wallet_value }}</div>
        </div>
        <div
          v-if="!record.name && record.encrypted_eth_addr_value"
          class="tablewrapper flex row q-mt-md no-wrap"
        >
          <div class="label">Encrypted ETH Value</div>
          <div class="address">{{ record.encrypted_eth_addr_value }}</div>
        </div>
        <div v-if="record.name" class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Wallet Address</div>
          <div class="address">
            {{ record.value_wallet ? record.value_wallet : "None" }}
          </div>
        </div>
        <div v-if="record.name" class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">BChat ID</div>
          <div class="address">
            {{ record.value_bchat ? record.value_bchat : "None" }}
          </div>
        </div>
        <div v-if="record.name" class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">Belnet ID</div>
          <div class="address">
            {{ record.value_belnet ? record.value_belnet : "None" }}
          </div>
        </div>
        <div v-if="record.name" class="tablewrapper flex row q-mt-md no-wrap">
          <div class="label">ETH Address</div>
          <div class="address">
            {{ record.value_eth_addr ? record.value_eth_addr : "None" }}
          </div>
        </div>
        <div
          v-if="
            record.name &&
              (record.value_wallet ||
                record.value_bchat ||
                record.value_belnet ||
                record.value_eth_addr)
          "
          class="flex row justify-end"
        >
          <q-btn
            color="secondary"
            class="q-mt-lg updation-btn"
            @click="onUpdate(record)"
          >
            <img
              src="../../assets/images/update.svg"
              alt="Update"
              style="height: 24px; width: auto;margin-right: 5px;"
            />
            Update
          </q-btn>

          <q-btn
            color="primary"
            class="q-mt-lg q-ml-sm updation-btn"
            @click="onRenew(record)"
          >
            <img
              src="../../assets/images/renew.svg"
              alt="Update"
              style="height: 24px; width: auto;margin-right: 5px;"
            />
            Renew
          </q-btn>
        </div>
      </section>
    </div>
  </q-list>
</template>

<script>
import { mapState } from "vuex";
import { i18n } from "boot/i18n";
import ContextMenu from "components/menus/contextmenu";

const { clipboard } = require("electron");

export default {
  name: "BNSRecordList",
  components: {
    ContextMenu
  },
  props: {
    recordList: {
      type: Array,
      required: true
    },
    isBelnet: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedNameHash: ""
    };
  },

  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  filters: {
    blockHeight(value) {
      const heightString = i18n.t("strings.blockHeight");
      return `${heightString}: ${value}`;
    },
    expirationHeight(value) {
      const expirationHeightString = i18n.t("strings.expirationHeight");
      return `${expirationHeightString}: ${value}`;
    }
  },
  methods: {
    isLocked(record) {
      return !record.name || !record.value;
    },
    bindClass(record) {
      console.log("recordList:", record);
      return [this.isLocked(record) ? "locked" : "unlocked"];
    },
    onUpdate(record) {
      this.$emit("onUpdate", record);
      // this.$router.push({ path: "/wallet/updateBns",query: { data: { record}}});
    },
    onRenew(record) {
      this.$emit("onRenew", record);
    },
    selectAndValidateNamehash(name_hash) {
      this.selectedNameHash = name_hash;
    },
    copyNameI18nLabel(record) {
      if (record.type === "bchat") {
        return "menuItems.copyName";
      } else {
        return "menuItems.copyBelnetName";
      }
    },
    copyValueI18nLabel(record) {
      if (record.type === "bchat") {
        return "menuItems.copyBchatId";
      } else if (record.type === "belnet") {
        return "menuItems.copyBelnetAddress";
      }
      return "menuItems.copyAddress";
    },
    validMenuItems(record) {
      // change name depending on if belnet or bchat
      const lockedItems = [
        { action: "nameCopy", i18n: this.copyNameI18nLabel(record) },
        { action: "copyValue", i18n: this.copyValueI18nLabel(record) }
      ];
      let menuItems = [{ action: "ownerCopy", i18n: "menuItems.copyOwner" }];
      const backupOwnerItem = [
        { action: "backupOwnerCopy", i18n: "menuItems.copyBackupOwner" }
      ];
      if (!this.isLocked(record)) {
        menuItems = [...lockedItems, ...menuItems];
      }
      if (record.backup_owner !== "") {
        menuItems = [...menuItems, ...backupOwnerItem];
      }
      return menuItems;
    },
    // can copy a value on unlock
    copyValue(record) {
      let message = this.$t("notification.positive.belnetAddressCopied");
      if (record.type === "bchat") {
        message = this.$t("notification.positive.bchatIdCopied");
      }
      this.copy(record.value, message);
    },
    copy(value, message) {
      if (!value) return;
      clipboard.writeText(value.trim());
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message
      });
    }
  }
};
</script>

<style lang="scss">
.bns-record-list {
  .recordListWrapper {
    width: 100%;
    background-color: #32324a;
    border-radius: 10px;
    .q-item {
      padding: 10 !important;
    }
    .clickable {
      cursor: pointer;
    }
  }
  .namehash {
    color: #afafbe !important;
    font-weight: 400;
    word-break: break-word;
    font-size: 12px;
  }
  .tablewrapper {
    padding-bottom: 5px;
    border-bottom: 1px solid #41415b;
    .upArrow {
      position: absolute;
      right: 20px;
      .q-icon {
        transform: rotate(-93deg);
      }
    }
    .label {
      width: 150px;
      font-weight: 600;
      font-size: 14px;
    }

    .address {
      color: #afafbe;
      font-weight: 400;
      word-break: break-word;
      width: 75%;
    }
  }
  .updation-btn {
    min-width: unset;
    width: 140px;
    height: 45px;
    font-size: 15px;
  }
}
</style>
