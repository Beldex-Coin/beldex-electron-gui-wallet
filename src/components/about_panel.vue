<template>
  <section class="beldex-panel about-panel">
    <span
      class="about-panel__corner about-panel__corner--tl"
      aria-hidden="true"
    />
    <span
      class="about-panel__corner about-panel__corner--br"
      aria-hidden="true"
    />
    <div class="about-panel__logo">
      <img src="~assets/icons/brand-logo.png" alt="" />
    </div>
    <h2 class="about-panel__title">Beldex Electron Wallet</h2>
    <div class="about-panel__divider" aria-hidden="true" />

    <dl class="about-panel__rows">
      <div class="about-panel__row">
        <dt>{{ $t("strings.aboutPanel.walletVersion") }}</dt>
        <dd class="about-panel__value--strong">{{ version }}</dd>
      </div>
      <div class="about-panel__row">
        <dt>{{ $t("strings.aboutPanel.daemonVersion") }}</dt>
        <dd class="about-panel__value--accent">{{ daemonVersion }}</dd>
      </div>
    </dl>

    <p class="about-panel__copyright">
      {{ $t("strings.aboutPanel.copyright") }}<br />
      {{ $t("strings.aboutPanel.rights") }}
    </p>

    <div class="about-panel__links">
      <button
        v-for="link in links"
        :key="link.label"
        type="button"
        class="about-panel__link"
        @click="openExternal(link.url)"
      >
        <img :src="link.icon" alt="" />
        {{ link.label }}
      </button>
    </div>

    <button
      type="button"
      class="about-panel__site"
      @click="openExternal('https://beldex.io')"
    >
      <img src="www.svg" alt="" />
      www.beldex.io
    </button>

    <q-btn
      class="beldex-btn beldex-btn--light about-panel__ok"
      unelevated
      no-caps
      label="OK"
      @click="$emit('close')"
    />
  </section>
</template>

<script>
// About tab. Shown in the Settings modal; `close` leaves it.
import { mapState } from "vuex";
import { version } from "../../package.json";

export default {
  name: "AboutPanel",
  data() {
    return {
      version,
      links: [
        {
          label: "Telegram",
          icon: "telegram.svg",
          url: "https://t.me/official_beldex"
        },
        {
          label: "Discord",
          icon: "discord.svg",
          url: "https://discord.com/invite/Hj4MAmA5gs"
        },
        {
          label: "Github",
          icon: "github.svg",
          url: "https://github.com/Beldex-Coin/beldex-electron-gui-wallet"
        }
      ]
    };
  },
  computed: mapState({
    daemonVersion: state => state.gateway.daemon.info.version || "N/A"
  }),
  methods: {
    openExternal(url) {
      this.$gateway.send("core", "open_url", { url });
    }
  }
};
</script>

<style lang="scss">
// Figma "About": 448px HUD card with green corner brackets.
.about-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 448px;
  max-width: 100%;
  padding: 32px;
  margin: 0 auto;
  background-color: rgba(17, 17, 17, 0.2);
  box-shadow: none;

  &__corner {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 0 solid var(--beldex-accent);

    &--tl {
      top: -2px;
      left: -2px;
      border-top-width: 2px;
      border-left-width: 2px;
    }

    &--br {
      right: -2px;
      bottom: -2px;
      border-right-width: 2px;
      border-bottom-width: 2px;
    }
  }

  &__logo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background-color: #111;
    border: 1px solid #111;

    img {
      width: 28px;
      height: 33px;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background-color: var(--beldex-accent);
    }
  }

  &__title {
    margin: 16px 0 0;
    font-family: var(--beldex-font-display);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.8px;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
  }

  &__divider {
    width: 64px;
    height: 2px;
    margin: 12px 0 24px;
    background-color: #111;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin: 0;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0 3px;
    font-family: var(--beldex-font-micro);
    font-size: 11px;
    line-height: 16px;
    letter-spacing: 0.55px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);
    border-bottom: 1px solid #111;

    dd {
      margin: 0;
      text-transform: none;
      letter-spacing: 0;
    }
  }

  &__value--strong {
    font-size: 12px;
    font-weight: 500;
    color: #fff;
  }

  &__value--accent {
    color: var(--beldex-accent);
  }

  &__copyright {
    width: 100%;
    margin: 6px 0 0;
    padding: 8px 0 24px;
    font-family: var(--beldex-font-micro);
    font-size: 11px;
    line-height: 22px;
    text-align: center;
    color: var(--beldex-text-muted);
    border-bottom: 1px solid rgba(26, 26, 26, 0.6);
  }

  &__links {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 21px;
  }

  &__link {
    display: flex;
    flex: 1 1 0;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 5px;
    font-family: var(--beldex-font-micro);
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.275px;
    color: #ebebeb;
    background-color: rgba(26, 26, 26, 0.6);
    border: 1px solid #111;
    cursor: pointer;

    img {
      width: 14px;
      height: 14px;
    }

    &:hover {
      background-color: var(--beldex-panel-raised);
    }
  }

  &__site {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 0 24px;
    padding: 6px 0;
    font-family: var(--beldex-font-micro);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.6px;
    color: var(--beldex-text-muted);
    background: transparent;
    border: 0;
    cursor: pointer;

    img {
      width: 14px;
      height: 14px;
    }
  }

  .beldex-app &__ok,
  &__ok.beldex-btn {
    width: 100%;
    height: 44px;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.4px;
    color: #0b0b0b;
    background-color: #fff;
  }
}
</style>
