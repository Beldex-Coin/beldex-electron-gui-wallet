<template>
  <!-- Swap under maintenance. -->
  <section class="swap-maintenance">
    <div class="swap-maintenance__tabs">
      <div class="beldex-segmented" role="tablist">
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item beldex-segmented__item--active"
          aria-selected="true"
        >
          <span class="beldex-segmented__dot" />
          {{ $t("titles.swap.exchange") }}
        </button>
        <button
          type="button"
          role="tab"
          class="beldex-segmented__item"
          aria-selected="false"
          @click="$emit('openHistory')"
        >
          {{ $t("titles.swap.history") }}
        </button>
      </div>
    </div>
    <div class="swap-maintenance__empty">
      <div class="swap-maintenance__head">
        <div class="swap-maintenance__icon">
          <img src="~assets/images/swap_maintenance.svg" alt="" />
        </div>
        <p class="swap-maintenance__title">
          {{ $t("titles.swap.swapMaintenance") }}
        </p>
      </div>
      <p class="swap-maintenance__hint">
        {{ $t("titles.swap.tryAgainSomeTimes") }}
      </p>
      <q-btn
        class="swap-maintenance__btn"
        flat
        no-caps
        @click="$emit('openHistory')"
      >
        {{ $t("titles.swap.openHistory") }}
      </q-btn>
    </div>
  </section>
</template>

<script>
export default {
  name: "SwapUnderMaintenance"
};
</script>

<style lang="scss">
.swap-maintenance {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--beldex-space-3);

  &__tabs {
    display: flex;
    justify-content: flex-end;
  }

  &__empty {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 22px;
    min-height: 320px;
    text-align: center;
  }

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--beldex-space-4);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background-color: var(--beldex-warning-wash);
    border: 1px solid var(--beldex-warning-border);

    img {
      display: block;
    }
  }

  &__title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: var(--beldex-text);
  }

  &__hint {
    max-width: 320px;
    margin: 0;
    font-family: var(--beldex-font-mono);
    font-size: 12px;
    line-height: 18px;
    color: var(--beldex-text-muted);
  }

  &__btn.q-btn {
    min-height: 32px;
    height: 32px;
    padding: 0 var(--beldex-space-3);
    font-family: var(--beldex-font-mono);
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--beldex-text-muted);
    border: 1px solid rgba(235, 235, 235, 0.1);
    border-radius: 0;

    // q-btn's inner wrapper adds 4px 16px padding on top of ours.
    .q-btn__wrapper {
      min-height: 0;
      padding: 0;
    }

    &:hover {
      color: var(--beldex-text);
      border-color: var(--beldex-border-focus);
    }
  }
}
</style>
