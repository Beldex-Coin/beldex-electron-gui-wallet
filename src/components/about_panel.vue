<template>
  <section class="beldex-panel about-panel">
    <img class="about-panel__logo" src="~assets/icons/brand-logo.png" alt="" />
    <h2 class="about-panel__title">Beldex Electron Wallet</h2>

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
.about-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 448px;
  max-width: 100%;
  padding: 24px 24px 24px;
  margin: 0 auto;

  &__logo {
    width: 40px;
    height: 40px;
    margin-top: 12px;
  }

  &__title {
    margin: 22px 0 0;
    font-family: var(--beldex-font-display);
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--beldex-text-strong);
  }

  &__rows {
    width: 100%;
    margin: 28px 0 0;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 22px;
    margin-bottom: 0;
    font-family: var(--beldex-font-mono);
    font-size: 11px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);

    dd {
      margin: 0;
      text-transform: none;
      letter-spacing: 0;
    }
  }

  &__value--strong {
    font-size: 12px;
    color: var(--beldex-text-strong);
  }

  &__value--accent {
    color: var(--beldex-accent);
  }

  &__copyright {
    margin: 16px 0 0;
    padding-bottom: 24px;
    width: 100%;
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 0.8px;
    text-align: center;
    text-transform: uppercase;
    color: var(--beldex-text-muted);
    border-bottom: 1px solid var(--beldex-border);
  }

  &__links {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 24px;
  }

  &__link {
    display: flex;
    flex: 1 1 0;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    font-family: var(--beldex-font-mono);
    font-size: 11px;
    color: var(--beldex-text-strong);
    background-color: var(--beldex-panel);
    border: 1px solid var(--beldex-border);
    cursor: pointer;

    img {
      width: 12px;
      height: 12px;
    }

    &:hover {
      background-color: var(--beldex-panel-raised);
    }
  }

  &__site {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 0 24px;
    font-family: var(--beldex-font-mono);
    font-size: 11px;
    color: var(--beldex-text-muted);
    background: transparent;
    border: 0;
    cursor: pointer;

    img {
      width: 12px;
      height: 12px;
    }
  }

  .beldex-app &__ok,
  &__ok.beldex-btn {
    width: 100%;
    height: 40px;
    justify-content: center;
    color: #0a0a0a;
    background-color: #fff;
  }
}
</style>
