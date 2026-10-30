<template>
  <!-- Advanced tabs. -->
  <q-page class="advanced-page" style="min-height: unset;">
    <section class="advanced-page__main">
      <div class="advanced-page__head">
        <div class="beldex-segmented" role="tablist">
          <button
            v-for="tab in [
              { label: $t('titles.advanced.prove'), value: 'prove' },
              { label: $t('titles.advanced.checkTransaction'), value: 'check' },
              {
                label: $t('titles.advanced.signAndVerify'),
                value: 'signAndVerify'
              }
            ]"
            :key="tab.value"
            type="button"
            role="tab"
            class="beldex-segmented__item"
            :class="{ 'beldex-segmented__item--active': screen === tab.value }"
            :aria-selected="screen === tab.value ? 'true' : 'false'"
            @click="screen = tab.value"
          >
            <span v-if="screen === tab.value" class="beldex-segmented__dot" />
            {{ tab.label }}
          </button>
        </div>
        <span class="beldex-hint advanced-page__hint">
          <img src="~assets/icons/advanced-hint.svg" alt="" />
          {{ $t("titles.advanced.proofsHint") }}
        </span>
      </div>
      <ProveTransaction v-if="screen === 'prove'" />
      <CheckTransaction v-if="screen === 'check'" />
      <SignAndVerify v-if="screen === 'signAndVerify'" />
    </section>

    <aside class="advanced-page__side">
      <div class="advanced-page__side-head">
        <h2 class="advanced-page__side-title">
          {{ $t("titles.advanced.proofsHowTitle") }}
        </h2>
      </div>
      <ul class="advanced-page__proofs">
        <li
          v-for="item in [
            {
              icon: 'proof-prove',
              title: $t('titles.advanced.prove'),
              hint: $t('titles.advanced.proofProveHint')
            },
            {
              icon: 'proof-check',
              title: $t('titles.advanced.checkTransaction'),
              hint: $t('titles.advanced.proofCheckHint')
            },
            {
              icon: 'proof-sign',
              title: $t('titles.advanced.signAndVerify'),
              hint: $t('titles.advanced.proofSignHint')
            }
          ]"
          :key="item.icon"
          class="advanced-page__proof"
        >
          <span class="advanced-page__proof-icon">
            <img :src="require(`assets/icons/${item.icon}.svg`)" alt="" />
          </span>
          <span class="advanced-page__proof-text">
            <span class="advanced-page__proof-title">{{ item.title }}</span>
            <span class="advanced-page__proof-hint">{{ item.hint }}</span>
          </span>
        </li>
      </ul>
      <div class="advanced-page__note">
        <img src="~assets/icons/proof-shield.svg" alt="" />
        <p>{{ $t("titles.advanced.proofsNote") }}</p>
      </div>
    </aside>
  </q-page>
</template>

<script>
import ProveTransaction from "components/advanced/prove_transaction";
import CheckTransaction from "components/advanced/check_transaction";
import SignAndVerify from "components/advanced/sign_and_verify";

export default {
  components: {
    ProveTransaction,
    CheckTransaction,
    SignAndVerify
  },
  data() {
    return {
      screen: "prove"
    };
  }
};
</script>

<style lang="scss">
.beldex-app .advanced-page {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  gap: var(--beldex-space-5);
  min-height: 0 !important; // beats q-page's inline min-height
  padding: 0;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  // app.styl gives each tab body a fixed height with its own scrollbar.
  .prove-transaction,
  .check-transaction,
  .sign-and-verify {
    height: auto;
    overflow-y: visible;
    background-color: transparent; // beats app.styl `$beldex-lightgray` panel
  }

  .q-pa-md {
    padding: 0;
  }

  // Fields are unfilled with a 1px #222 bottom line, 40px tall.
  .beldex-field .content,
  .beldex-field:not(.disable):not(.disable-hover) .content:hover {
    min-height: 40px;
    padding: 0;
    background: transparent;
    border-bottom-color: #222;
  }

  .beldex-field .q-field--dense .q-field__control,
  .beldex-field .q-field--dense .q-field__marginal {
    height: 40px;
    min-height: 40px;
  }

  .beldex-field .content:focus-within {
    border-bottom-color: var(--beldex-accent-border);
  }

  // Rhythm: label 8px above its field; 40px between Prove /
  // Check fields; 12px between Verify fields inside compact cards.
  .beldex-field .label {
    margin-bottom: var(--beldex-space-2);
  }

  .prove-transaction .beldex-field.q-mt-md,
  .check-transaction .beldex-field.q-mt-md {
    margin-top: 40px !important;
  }

  .sign-and-verify .beldex-box {
    gap: var(--beldex-space-3);
    padding: var(--beldex-space-4);
    margin-bottom: var(--beldex-space-4);

    .beldex-box__title {
      font-size: 13px;
      line-height: 20px;
    }
  }

  // Buttons are Inter, mixed case.
  .beldex-btn {
    font-family: var(--beldex-font-sans);
    font-weight: 600;
    text-transform: none;

    img {
      width: 14px;
      height: 14px;
    }
  }

  &__main,
  &__side {
    padding: var(--beldex-space-5);
    background-color: var(--beldex-panel-glass);
    border: 1px solid var(--beldex-border);
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__side {
    display: flex;
    flex: 0 0 400px;
    flex-direction: column;
    gap: var(--beldex-space-5);
  }

  &__head,
  &__side-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--beldex-space-4);
    border-bottom: 1px solid var(--beldex-hairline);
  }

  &__hint {
    display: inline-flex;
    align-items: center;
    gap: var(--beldex-space-2);
  }

  &__side-title {
    margin: 0;
    font-family: var(--beldex-font-sans);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    line-height: 20px;
    color: var(--beldex-text-strong);
  }

  &__proofs {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__proof {
    display: flex;
    gap: var(--beldex-space-3);
  }

  &__proof-icon {
    display: flex;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: #111;
    border: 1px solid var(--beldex-border);
  }

  &__proof-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__proof-title {
    font-family: var(--beldex-font-sans-medium);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: #acacac;
  }

  &__proof-hint {
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-sm);
    line-height: 16px;
    color: #666;
  }

  &__note {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-4);
    padding: 12px 14px;
    background-color: rgba(0, 191, 10, 0.02);
    border: 1px solid rgba(0, 191, 10, 0.2);

    p {
      margin: 0;
      font-family: var(--beldex-font-mono);
      font-size: var(--beldex-text-sm);
      line-height: 17px;
      color: #acacac;
    }
  }
}
</style>
