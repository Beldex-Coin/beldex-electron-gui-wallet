<template>
  <div class="wallet-details wallet-details--compact">
    <!-- Balance strip on every section: label, balance, unlocked and address
         on one row. -->
    <div class="wallet-details__hero">
      <div class="wallet-details__left">
        <div class="wallet-details__label">
          <span class="beldex-net-chip__dot" />
          <span>{{ $t("strings.availableBalance") }}</span>
          <button
            type="button"
            class="wallet-details__toggle"
            :aria-pressed="balanceHidden ? 'true' : 'false'"
            @click="toggleBalance"
          >
            <img src="~assets/icons/eye.svg" alt="" />
            {{
              balanceHidden
                ? $t("strings.showBalance")
                : $t("strings.hideBalance")
            }}
          </button>
          <span class="wallet-details__amount wallet-details__amount--inline">
            <FormatBeldex v-if="!balanceHidden" :amount="info.balance" />
            <span v-else class="wallet-details__mask" aria-hidden="true"
              ><i class="wallet-details__mask-int" /><b>.</b
              ><i class="wallet-details__mask-dec" /><span
                class="coin-extensions"
                >BDX</span
              ></span
            >
          </span>
          <span class="wallet-details__muted">·</span>
          <span class="wallet-details__unlocked">
            {{ $t("strings.oxenUnlockedShort") }}:
            <FormatBeldex
              v-if="!balanceHidden"
              :amount="info.unlocked_balance"
            />
            <span v-else class="wallet-details__mask wallet-details__mask--sm"
              ><i class="wallet-details__mask-int" /><b>.</b
              ><i class="wallet-details__mask-dec" /><span
                class="coin-extensions"
                >BDX</span
              ></span
            >
          </span>
          <template v-if="info.view_only">
            <span class="wallet-details__muted">·</span>
            <span class="wallet-details__no-spend">{{
              $t("strings.spendKeyNotLoaded")
            }}</span>
            <span class="wallet-details__badge">{{
              $t("strings.viewOnlyTag")
            }}</span>
          </template>
        </div>
      </div>

      <div class="wallet-details__chips">
        <button
          type="button"
          class="wallet-details__chip"
          @click="copyAddress(info.address)"
        >
          <img src="~assets/icons/chip-wallet.svg" alt="" />
          <span>{{
            info.address.slice(0, 12) + "…" + info.address.slice(-8)
          }}</span>
          <img src="~assets/icons/chip-copy.svg" alt="" />
          <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
            {{ $t("menuItems.copyAddress") }}
          </q-tooltip>
        </button>
      </div>
    </div>

    <!-- RESCAN MODAL -->
    <q-dialog v-model="modals.rescan.visible" minimized>
      <q-card class="beldex-dialog confirm-dialog">
        <div class="beldex-dialog__head">
          <div class="beldex-dialog__icon confirm-dialog__icon--accent">
            <span class="confirm-dialog__ico" :style="rescanIconStyle" />
          </div>
          <div>
            <h2 class="beldex-dialog__title">
              {{ $t("titles.rescanWallet") }}
            </h2>
            <p class="beldex-dialog__subtitle">
              {{ $t("strings.rescanModalDescription") }}
            </p>
          </div>
        </div>

        <div class="beldex-dialog__body">
          <div class="beldex-dialog__options">
            <button
              v-for="option in [
                {
                  value: 'full',
                  label: $t('fieldLabels.rescanFullBlockchain'),
                  hint: $t('strings.rescanFullHint')
                },
                {
                  value: 'spent',
                  label: $t('fieldLabels.rescanSpentOutputs'),
                  hint: $t('strings.rescanSpentHint')
                }
              ]"
              :key="option.value"
              type="button"
              class="beldex-option"
              :class="{
                'beldex-option--active': modals.rescan.type === option.value
              }"
              @click="modals.rescan.type = option.value"
            >
              <span
                class="beldex-check"
                :class="{
                  'beldex-check--on': modals.rescan.type === option.value
                }"
              />
              <span class="beldex-option__text">
                <span class="beldex-option__title">{{ option.label }}</span>
                <span class="beldex-option__hint">{{ option.hint }}</span>
              </span>
            </button>
          </div>
        </div>

        <div class="beldex-dialog__actions">
          <q-btn
            class="beldex-btn beldex-btn--ghost"
            unelevated
            no-caps
            :label="$t('buttons.cancel')"
            @click="hideModal('rescan')"
          />
          <q-btn class="beldex-btn" unelevated no-caps @click="rescanWallet()">
            <span
              class="confirm-dialog__ico confirm-dialog__ico--btn"
              :style="rescanIconStyle"
            />
            {{ $t("buttons.rescan") }}
          </q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { clipboard } from "src/shims/electron-renderer";
import { mapState } from "vuex";
import FormatBeldex from "components/format_beldex";
import ConfirmDialog from "components/confirm_dialog";

const RESCAN_ICON = require("assets/icons/wmenu-rescan.svg");
// import CopyIcon from "components/icons/copy_icon";

// UI-only preference (plan §5 B4): kept in localStorage, never in config.
const BALANCE_HIDDEN_KEY = "beldex.balanceHidden";

export default {
  name: "WalletDetails",
  components: {
    FormatBeldex
    // CopyIcon
  },
  data() {
    let balanceHidden = false;
    try {
      balanceHidden = localStorage.getItem(BALANCE_HIDDEN_KEY) === "1";
    } catch (e) {
      balanceHidden = false;
    }
    return {
      balanceHidden,
      modals: {
        rescan: {
          visible: false,
          type: "full"
        }
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    rescanIconStyle() {
      return { "--ico": `url(${RESCAN_ICON})` };
    },

    load_balance: state => {
      return state.gateway.wallet.info.load_balance;
    }
  }),
  methods: {
    toggleBalance() {
      this.balanceHidden = !this.balanceHidden;
      try {
        localStorage.setItem(
          BALANCE_HIDDEN_KEY,
          this.balanceHidden ? "1" : "0"
        );
      } catch (e) {
        // Storage unavailable: the toggle still works for this session.
      }
    },
    get_balance() {
      this.$store.commit("gateway/set_wallet_data", {
        info: {
          load_balance: true
        }
      });
      this.$gateway.send("wallet", "get_balance");
    },
    showModal(which) {
      if (!this.is_ready) return;
      this.modals[which].visible = true;
    },
    hideModal(which) {
      this.modals[which].visible = false;
    },
    rescanWallet() {
      this.hideModal("rescan");
      if (this.modals.rescan.type == "full") {
        this.$q
          .dialog({
            component: ConfirmDialog,
            title: this.$t("dialog.rescan.title"),
            message: this.$t("dialog.rescan.message"),
            okLabel: this.$t("buttons.rescan"),
            cancelLabel: this.$t("dialog.buttons.cancel"),
            icon: "restart",
            iconTone: "accent",
            okIcon: "restart"
          })
          .onOk(() => {
            this.$store.commit("gateway/set_wallet_data", {
              info: {
                balance: 0,
                unlocked_balance: 0,
                height: 1
              },
              transactions: { tx_list: [] }
            });
            this.$gateway.send("wallet", "rescan_blockchain");
          })
          .onDismiss(() => {})
          .onCancel(() => {});
      } else {
        this.$gateway.send("wallet", "rescan_spent");
      }
    },
    copyAddress(text) {
      clipboard.writeText(text);
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message: this.$t("notification.positive.addressCopied")
      });
    },
    addressTrim(address) {
      const startingTrim = address.slice(0, 20);
      const endingTrim = address.slice(address.length - 25, address.length);
      return startingTrim + "......" + endingTrim;
    }
  }
};
</script>

<style lang="scss">
// Full hero and compact strip.
.wallet-details {
  flex: none;

  &__hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--beldex-space-6);
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: var(--beldex-space-3);
    min-width: 0;
  }

  &__label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--beldex-space-2);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);

    .beldex-net-chip__dot {
      width: 6px;
      height: 6px;
      background-color: var(--beldex-accent);
      box-shadow: 0 0 6px var(--beldex-accent-glow);
    }

    .coin-extensions {
      color: inherit;
    }
  }

  &__muted {
    color: var(--beldex-text-faint);
  }

  &__no-spend {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    text-transform: none;
    letter-spacing: 0;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 10px;
    font-family: var(--beldex-font-mono);
    font-weight: 700;
    text-transform: uppercase;
    font-size: var(--beldex-text-sm);
    letter-spacing: 0.3px;
    color: var(--beldex-warning);
    background-color: var(--beldex-warning-wash);
    border: 1px solid var(--beldex-warning-border);
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 22px;
    margin-left: var(--beldex-space-2);
    padding: 2px 6px;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    text-transform: none;
    color: var(--beldex-text-muted);
    background-color: var(--beldex-panel);
    border: 1px solid var(--beldex-border);
    cursor: pointer;

    &:hover {
      color: var(--beldex-text);
    }

    img {
      width: 12px;
      height: 9px;
    }
  }

  &__amount {
    font-family: var(--beldex-font-display);
    font-size: 48px;
    line-height: 48px;
    letter-spacing: 2px;
    color: var(--beldex-text);
    white-space: nowrap;

    .coin-extensions {
      margin-left: var(--beldex-space-1);
      font-family: var(--beldex-font-mono);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0;
      color: var(--beldex-accent);
    }

    &--inline {
      margin-left: var(--beldex-space-3);
      font-size: 22px;
      line-height: 28px;
      text-transform: none;

      .coin-extensions {
        font-size: var(--beldex-text-sm);
      }
    }
  }

  // Hidden balance: dot-matrix blocks around a ".".
  &__mask {
    display: inline-flex;
    align-items: flex-end;
    gap: 6px;

    i {
      display: block;
      height: 26px;
      background-image: radial-gradient(
        circle,
        var(--beldex-text-faint) 0.7px,
        transparent 1.1px
      );
      background-size: 4px 4px;
    }

    &-int {
      width: 150px;
    }

    &-dec {
      width: 56px;
    }

    b {
      font-weight: 400;
      line-height: 48px;
      color: var(--beldex-text-muted);
    }

    .coin-extensions {
      margin-left: 0;
      font-size: 12px;
    }
  }

  &__amount--inline &__mask {
    gap: 5px;

    i {
      height: 19px;
    }

    &-int {
      width: 107px;
    }

    &-dec {
      width: 40px;
    }

    b {
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 2px;
    }

    .coin-extensions {
      font-size: 9px;
      line-height: 12px;
    }
  }

  &__mask--sm {
    gap: 4px;
    vertical-align: middle;

    i {
      height: 11px;
    }

    .wallet-details__mask-int {
      width: 40px;
    }

    .wallet-details__mask-dec {
      width: 16px;
    }

    b {
      font-size: 11px;
      line-height: 11px;
    }

    .coin-extensions {
      font-size: 9px;
      line-height: 11px;
    }
  }

  &__unlocked {
    font-size: var(--beldex-text-sm);
    text-transform: none;

    .coin-extensions {
      color: inherit;
    }
  }

  &__chips {
    display: flex;
    flex: none;
    gap: var(--beldex-space-3);
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
    height: 28px;
    padding: 0 10px;
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    color: var(--beldex-text-muted);
    background-color: var(--beldex-panel);
    border: 1px solid rgba(235, 235, 235, 0.1);
    cursor: pointer;

    &:hover {
      color: var(--beldex-text);
      border-color: rgba(235, 235, 235, 0.2);
    }

    img {
      width: 10px;
      height: 10px;
    }
  }

  // Compact strip on non-overview sections.
  &--compact &__hero {
    align-items: center;
    padding: var(--beldex-space-3) var(--beldex-space-4);
    background-color: rgba(11, 11, 11, 0.65);
    border: 1px solid rgba(235, 235, 235, 0.1);
  }

  &--compact &__label {
    flex-wrap: nowrap;
  }

  // Short windows (1200×650 minimum, plan §5 B6): shrink the hero.
  @media (max-height: 760px) {
    &__hero {
      padding-bottom: var(--beldex-space-3);
    }

    &__left {
      gap: var(--beldex-space-2);
    }

    &__amount:not(&__amount--inline) {
      font-size: 30px;
      line-height: 32px;
    }
  }
}
</style>
