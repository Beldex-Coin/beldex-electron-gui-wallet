<template>
  <!-- BNS records. Handlers are unchanged. -->
  <div class="bns-record-list">
    <div
      v-for="record in recordList"
      :key="record.name_hash"
      class="bns-record"
      :class="{ 'bns-record--open': selectedNameHash === record.name_hash }"
    >
      <div
        class="bns-record__head"
        @click="
          selectAndValidateNamehash(
            selectedNameHash === record.name_hash ? '' : record.name_hash
          )
        "
      >
        <span class="bns-record__icon">
          <img
            v-if="selectedNameHash === record.name_hash"
            src="~assets/icons/tag-accent.svg"
            alt=""
          />
          <img v-else src="~assets/icons/tag-muted.svg" alt="" />
        </span>
        <div class="bns-record__title">
          <span class="bns-record__name" :class="bindClass(record)">
            {{ record.name ? record.name : $t("strings.encryptedRecord") }}
          </span>
          <span class="bns-record__hash beldex-truncate">
            {{ $t("fieldLabels.nameHash") }}: {{ record.name_hash }}
          </span>
        </div>
        <div class="bns-record__height">
          <span class="bns-record__height-value">{{
            record.expiration_height
          }}</span>
          <span class="bns-record__height-label">{{
            $t("strings.expirationHeight")
          }}</span>
        </div>
        <span class="bns-record__chevron">
          <img
            v-if="selectedNameHash === record.name_hash"
            src="~assets/icons/chevron-down-sm.svg"
            alt=""
          />
          <img v-else src="~assets/icons/chevron-right-sm.svg" alt="" />
        </span>
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
      </div>
      <section
        v-if="selectedNameHash === record.name_hash"
        class="bns-record__body"
      >
        <div class="bns-record__kv">
          <span class="bns-record__kv-label">{{
            $t("fieldLabels.updateHeight")
          }}</span>
          <span class="bns-record__kv-value">{{ record.update_height }}</span>
        </div>
        <div class="bns-record__kv">
          <span class="bns-record__kv-label">{{
            $t("fieldLabels.owner")
          }}</span>
          <span class="bns-record__kv-value">{{ record.owner }}</span>
        </div>
        <div class="bns-record__kv">
          <span class="bns-record__kv-label">{{
            $t("fieldLabels.transactionId")
          }}</span>
          <span class="bns-record__kv-value">{{ record.txid }}</span>
        </div>
        <div
          v-if="!record.name && record.encrypted_bchat_value"
          class="bns-record__kv"
        >
          <span class="bns-record__kv-label">{{
            $t("strings.encryptedBchatValue")
          }}</span>
          <span class="bns-record__kv-value">{{
            record.encrypted_bchat_value
          }}</span>
        </div>
        <div
          v-if="!record.name && record.encrypted_belnet_value"
          class="bns-record__kv"
        >
          <span class="bns-record__kv-label">{{
            $t("strings.encryptedBelnetValue")
          }}</span>
          <span class="bns-record__kv-value">{{
            record.encrypted_belnet_value
          }}</span>
        </div>
        <div
          v-if="!record.name && record.encrypted_wallet_value"
          class="bns-record__kv"
        >
          <span class="bns-record__kv-label">{{
            $t("strings.encryptedWalletValue")
          }}</span>
          <span class="bns-record__kv-value">{{
            record.encrypted_wallet_value
          }}</span>
        </div>
        <div
          v-if="!record.name && record.encrypted_eth_addr_value"
          class="bns-record__kv"
        >
          <span class="bns-record__kv-label">{{
            $t("strings.encryptedEthAddrValue")
          }}</span>
          <span class="bns-record__kv-value">{{
            record.encrypted_eth_addr_value
          }}</span>
        </div>
        <div v-if="record.name" class="bns-record__kv">
          <span class="bns-record__kv-label">{{
            $t("fieldLabels.walletAddress")
          }}</span>
          <span class="bns-record__kv-value">{{
            record.value_wallet ? record.value_wallet : "None"
          }}</span>
        </div>
        <div v-if="record.name" class="bns-record__kv">
          <span class="bns-record__kv-label">BChat ID</span>
          <span class="bns-record__kv-value">{{
            record.value_bchat ? record.value_bchat : "None"
          }}</span>
        </div>
        <div v-if="record.name" class="bns-record__kv">
          <span class="bns-record__kv-label">Belnet ID</span>
          <span class="bns-record__kv-value">{{
            record.value_belnet ? record.value_belnet : "None"
          }}</span>
        </div>
        <div v-if="record.name" class="bns-record__kv">
          <span class="bns-record__kv-label">ETH Address</span>
          <span class="bns-record__kv-value">{{
            record.value_eth_addr ? record.value_eth_addr : "None"
          }}</span>
        </div>
        <div
          v-if="
            record.name &&
              (record.value_wallet ||
                record.value_bchat ||
                record.value_belnet ||
                record.value_eth_addr)
          "
          class="bns-record__actions"
        >
          <q-btn
            class="bns-record__btn"
            unelevated
            no-caps
            @click="onUpdate(record)"
          >
            <img src="~assets/icons/proof-sign.svg" alt="" />
            {{ $t("buttons.update") }}
          </q-btn>
          <q-btn
            class="bns-record__btn bns-record__btn--primary"
            unelevated
            no-caps
            @click="onRenew(record)"
          >
            <img src="~assets/icons/renew.svg" alt="" />
            {{ $t("buttons.renew") }}
          </q-btn>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { i18n } from "boot/i18n";
import ContextMenu from "components/menus/contextmenu";

import ClipboardCopyMixin from "src/mixins/clipboard_copy_mixin";

export default {
  name: "BNSRecordList",
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
  components: {
    ContextMenu
  },
  mixins: [ClipboardCopyMixin],
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
  methods: {
    isLocked(record) {
      return !record.name || !record.value;
    },
    bindClass(record) {
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
      this.copyToClipboardAndNotify(value, message);
    }
  }
};
</script>

<style lang="scss">
.beldex-app .bns-record-list {
  display: flex;
  flex-direction: column;
  gap: var(--beldex-space-2);
}

.beldex-app .bns-record {
  background-color: rgba(8, 8, 8, 0.8);
  border: 1px solid var(--beldex-hairline);

  &--open {
    background-color: rgba(34, 34, 34, 0.05);
    border-color: var(--beldex-accent-border-soft);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    padding: 14px var(--beldex-space-4);
    cursor: pointer;
  }

  &__icon {
    display: flex;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    height: 28px;
    background-color: rgba(235, 235, 235, 0.05);
    border: 1px solid var(--beldex-border);

    img {
      width: 14px;
      height: 14px;
    }
  }

  &--open .bns-record__icon {
    background-color: var(--beldex-accent-bg);
    border-color: var(--beldex-accent-border-soft);
  }

  &__title {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    // Icon-to-text gap is 16px; the row gap is 12px.
    margin-left: var(--beldex-space-1);
    line-height: 16px;
  }

  &__name {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text);
  }

  &__hash {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    color: var(--beldex-text-faint);
  }

  &__height {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 2px;
    align-items: flex-end;
    white-space: nowrap;
  }

  &__height-value {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 700;
    line-height: 16px;
    color: var(--beldex-text);
  }

  &__height-label {
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    line-height: 15px;
    color: var(--beldex-text-faint);
  }

  &__chevron {
    display: flex;
    flex: 0 0 14px;
    align-items: center;
    justify-content: center;
    height: 14px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
    padding: 0 var(--beldex-space-4) var(--beldex-space-4);
  }

  &__kv {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--beldex-space-5);
    padding: var(--beldex-space-3) 0;
    font-family: var(--beldex-font-mono);
    line-height: 16px;
    white-space: nowrap;
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__kv-label {
    flex: 0 0 auto;
    font-size: var(--beldex-text-sm);
    letter-spacing: 0.6px;
    color: var(--beldex-text-muted);
    text-transform: uppercase;
  }

  &__kv-value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--beldex-text-md);
    color: var(--beldex-text);
    user-select: text;
  }

  // Update / Renew.
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--beldex-space-3);
  }

  &__btn.q-btn {
    min-width: 91px;
    min-height: 32px;
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    font-weight: 500;
    line-height: 16px;
    color: var(--beldex-text-muted);
    background: transparent;
    border: 1px solid rgba(235, 235, 235, 0.1);
    border-radius: 0;

    &:before {
      box-shadow: none;
    }

    &:hover {
      color: var(--beldex-text);
    }

    .q-focus-helper {
      display: none;
    }

    .q-btn__wrapper {
      min-height: 0;
      padding: 0;
    }

    .q-btn__content {
      gap: var(--beldex-space-2);
    }
  }

  &__btn--primary.q-btn {
    font-family: var(--beldex-font-sans);
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--beldex-btn-primary-text);
    text-transform: uppercase;
    background: var(--beldex-btn-primary-bg);
    border-color: var(--beldex-btn-primary-bg);

    &:hover {
      color: var(--beldex-btn-primary-text);
      background: var(--beldex-text-strong);
    }
  }
}
</style>
