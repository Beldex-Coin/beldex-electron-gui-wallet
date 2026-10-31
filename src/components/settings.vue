<template>
  <q-dialog v-model="isVisible" maximized>
    <q-layout view="hHh Lpr lFf" class="settings-modal">
      <q-header class="settings-modal__header">
        <BeldexTopBar :net-type="config.app.net_type">
          <template #actions>
            <MainMenu disable-settings="true" @about="page = 'about'" />
          </template>
        </BeldexTopBar>
      </q-header>

      <q-page-container>
        <q-page class="settings-modal__page">
          <aside class="settings-modal__nav">
            <div class="settings-modal__nav-title">
              <span class="beldex-label">{{ $t("titles.configure") }}</span>
            </div>
            <nav class="settings-modal__nav-items">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                class="settings-modal__nav-item"
                :class="{
                  'settings-modal__nav-item--active': page === tab.value
                }"
                :aria-current="page === tab.value ? 'page' : null"
                @click="page = tab.value"
              >
                <span
                  class="settings-modal__nav-icon"
                  :class="`settings-modal__nav-icon--${tab.value}`"
                  aria-hidden="true"
                />
                <span class="settings-modal__nav-label">{{ tab.label }}</span>
                <span
                  v-if="page === tab.value"
                  class="settings-modal__nav-chevron"
                  aria-hidden="true"
                  >›</span
                >
              </button>
            </nav>
            <div class="settings-modal__version">
              <img src="~assets/icons/version-info.svg" alt="" />
              {{ $t("strings.version") }} {{ version }}
            </div>
          </aside>

          <main
            class="settings-modal__content"
            :class="{
              'settings-modal__content--narrow': page === 'language',
              'settings-modal__content--about': page === 'about'
            }"
          >
            <div v-if="page !== 'ban'" class="beldex-heading">
              <button
                type="button"
                class="beldex-icon-btn"
                :aria-label="$t('buttons.back')"
                @click="isVisible = false"
              >
                ←
              </button>
              <h1 class="beldex-heading__title">
                {{ headingTitle }}
              </h1>
              <span v-if="page === 'peers'" class="beldex-chip">
                {{ daemon.connections.length }}
              </span>
            </div>

            <section
              v-if="page == 'general'"
              class="beldex-panel settings-modal__panel"
            >
              <SettingsGeneral
                ref="settingsGeneral"
                :randomise-remote="false"
              />
            </section>

            <section
              v-if="page == 'peers'"
              class="beldex-panel settings-modal__panel settings-modal__peers"
            >
              <div class="settings-modal__peer-row settings-modal__peer-head">
                <span>{{ $t("fieldLabels.address") }}</span>
                <span>{{ $t("strings.height") }}</span>
                <span>{{ $t("footer.status") }}</span>
                <span />
              </div>
              <button
                v-for="entry in peers"
                :key="entry.connection_id || entry.address"
                type="button"
                class="settings-modal__peer-row"
                @click="showPeerDetails(entry)"
              >
                <span class="settings-modal__peer-address">
                  <span
                    class="settings-modal__peer-dot"
                    :class="{
                      'settings-modal__peer-dot--busy': entry.state !== 'normal'
                    }"
                  />
                  <span class="beldex-truncate">{{ entry.address }}</span>
                </span>
                <span class="settings-modal__peer-muted">{{
                  entry.height
                }}</span>
                <span
                  class="settings-modal__peer-state"
                  :class="{
                    'settings-modal__peer-state--busy': entry.state !== 'normal'
                  }"
                  >{{ entry.state }}</span
                >
                <span class="settings-modal__peer-muted" aria-hidden="true"
                  >›</span
                >
              </button>

              <template v-if="daemon.bans.length">
                <div class="beldex-label settings-modal__bans-title">
                  {{ $t("strings.bannedPeers.title") }}
                </div>
                <div
                  v-for="entry in daemon.bans"
                  :key="entry.host"
                  class="settings-modal__peer-row settings-modal__peer-row--static"
                >
                  <span class="beldex-truncate">{{ entry.host }}</span>
                  <span class="settings-modal__peer-muted">
                    {{
                      $t("strings.bannedPeers.bannedUntil", {
                        time: new Date(
                          Date.now() + entry.seconds * 1000
                        ).toLocaleString()
                      })
                    }}
                  </span>
                </div>
              </template>
            </section>

            <AboutPanel v-if="page === 'about'" @close="isVisible = false" />

            <div v-if="page === 'ban'" class="settings-modal__ban">
              <div class="beldex-heading">
                <button
                  type="button"
                  class="beldex-icon-btn"
                  :aria-label="$t('buttons.back')"
                  @click="page = 'peers'"
                >
                  ←
                </button>
                <h1 class="beldex-heading__title">
                  {{ $t("dialog.banPeer.title") }}
                </h1>
              </div>
              <p class="settings-modal__ban-desc">
                {{ $t("dialog.banPeer.description") }}
              </p>
              <section class="beldex-panel settings-modal__ban-card">
                <div class="settings-modal__ban-target">
                  <span>{{ $t("dialog.banPeer.targetIp") }}</span>
                  <strong>{{ peerEntry.address }}</strong>
                </div>
                <input
                  v-model="banSeconds"
                  class="settings-modal__ban-input"
                  type="number"
                  min="0"
                  :placeholder="$t('dialog.banPeer.lengthPlaceholder')"
                  :aria-label="$t('dialog.banPeer.lengthPlaceholder')"
                  @keyup.enter="confirmBan"
                />
                <div class="settings-modal__ban-hints">
                  <span>{{ $t("dialog.banPeer.minimum") }}</span>
                </div>
                <p v-if="banError" class="settings-modal__ban-error">
                  {{ banError }}
                </p>
                <div class="settings-modal__ban-actions">
                  <q-btn
                    class="beldex-btn beldex-btn--ghost"
                    unelevated
                    no-caps
                    :label="$t('dialog.buttons.cancel')"
                    @click="page = 'peers'"
                  />
                  <q-btn
                    class="beldex-btn settings-modal__ban-ok"
                    unelevated
                    no-caps
                    :label="$t('dialog.banPeer.ok')"
                    @click="confirmBan"
                  />
                </div>
              </section>
            </div>

            <section
              v-if="page === 'language'"
              class="beldex-panel settings-modal__panel settings-modal__language"
            >
              <LanguageSelect username="matt" />
            </section>
          </main>
        </q-page>
      </q-page-container>

      <q-dialog v-model="peerEntryModal" minimized>
        <q-card class="beldex-dialog peer-dialog">
          <div class="beldex-dialog__head">
            <div class="beldex-dialog__icon">
              <img src="~assets/icons/nav-peers.svg" alt="" />
            </div>
            <div>
              <h2 class="beldex-dialog__title">
                {{ $t("dialog.banPeer.peerDetailsTitle") }}
              </h2>
              <p class="beldex-dialog__subtitle">{{ peerEntry.address }}</p>
            </div>
          </div>
          <pre class="peer-dialog__json">{{ peerJson }}</pre>
          <div class="beldex-dialog__actions">
            <q-btn
              class="beldex-btn beldex-btn--ghost"
              unelevated
              no-caps
              :label="$t('buttons.close')"
              @click="peerEntryModal = false"
            />
            <q-btn
              class="beldex-btn confirm-dialog__ok--danger"
              unelevated
              no-caps
              :label="'✕ ' + $t('dialog.banPeer.banAction')"
              @click="startBan"
            />
          </div>
        </q-card>
      </q-dialog>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import SettingsGeneral from "components/settings_general";
import LanguageSelect from "components/language_select_settings";
import MainMenu from "components/menus/mainmenu";
import BeldexTopBar from "components/beldex_top_bar";
import AboutPanel from "components/about_panel";
import { version } from "../../package.json";

export default {
  name: "SettingsModal",
  components: {
    LanguageSelect,
    SettingsGeneral,
    MainMenu,
    BeldexTopBar,
    AboutPanel
  },
  data() {
    return {
      page: "general",
      isVisible: false,
      version,
      username: "matt",
      peerEntry: {},
      peerEntryModal: false,
      banSeconds: "",
      banError: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    daemon: state => state.gateway.daemon,
    pending_config: state => state.gateway.app.pending_config,
    config: state => state.gateway.app.config,
    tabs: function(state) {
      const { app, daemons } = state.gateway.app.config;
      let tabs = [
        {
          label: this.$t("titles.settings.tabs.general"),
          value: "general",
          icon: "settings"
        },
        {
          label: this.$t("titles.settings.tabs.language"),
          value: "language",
          icon: "language"
        }
      ];
      if (daemons[app.net_type].type != "remote") {
        tabs.push({
          label: this.$t("titles.settings.tabs.peers"),
          value: "peers",
          icon: "cloud_queue"
        });
      }
      tabs.push({
        label: this.$t("titles.settings.tabs.about"),
        value: "about",
        icon: "info"
      });
      return tabs;
    },
    headingTitle: function() {
      const tabs = {
        language: "titles.settings.tabs.language",
        peers: "titles.settings.tabs.peers",
        about: "titles.settings.tabs.about"
      };
      return this.$t(tabs[this.page] || "titles.settings.title");
    },
    peerJson: function() {
      return JSON.stringify(this.peerEntry, null, 2);
    },
    // beldexd's get_connections reports `ip` and `port` only; fall back to
    // them when `address` / `host` (used by the list and by ban_peer) are
    // absent so rows are not blank and a ban targets the peer's IP.
    peers: function() {
      return (this.daemon.connections || []).map(entry => ({
        ...entry,
        address: entry.address || (entry.ip ? `${entry.ip}:${entry.port}` : ""),
        host: entry.host || entry.ip
      }));
    }
  }),
  watch: {
    isVisible: function() {
      if (this.isVisible == false) {
        this.$store.dispatch("gateway/resetPendingConfig");
      }
    }
  },
  methods: {
    save() {
      this.$gateway.send("core", "save_config", this.pending_config);
      this.isVisible = false;
    },
    showPeerDetails(entry) {
      this.peerEntry = entry;
      this.peerEntryModal = true;
    },
    startBan() {
      this.peerEntryModal = false;
      this.banSeconds = "";
      this.banError = "";
      this.page = "ban";
    },
    confirmBan() {
      // Blank keeps the daemon default (1 hour). daemon.js turns 0 into the
      // default too, so a "Permaban: 0" hint is not offered.
      const raw = String(this.banSeconds).trim();
      const seconds = raw === "" ? 3600 : Number(raw);
      if (!Number.isInteger(seconds) || seconds < 60) {
        this.banError = this.$t("dialog.banPeer.invalid");
        return;
      }
      this.$gateway.send("daemon", "ban_peer", {
        host: this.peerEntry.host,
        seconds
      });
      this.page = "peers";
    }
  }
};
</script>

<style lang="scss">
// Settings shell: General, Language and Peers tabs.
.settings-modal {
  min-height: 100vh;

  &__header {
    background: transparent;
    color: inherit;
  }

  &__page {
    display: flex;
    align-items: stretch;
    min-height: calc(100vh - var(--beldex-header-height));
  }

  &__nav {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 256px;
    background-color: var(--beldex-bg);
    border-right: 1px solid var(--beldex-border);
  }

  &__nav-title {
    padding: 16px var(--beldex-space-5) 17px;
    border-bottom: 1px solid rgba(31, 36, 41, 0.7);
  }

  &__nav-items {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--beldex-space-1);
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-3);
    width: 100%;
    padding: var(--beldex-space-3) var(--beldex-space-5);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    text-align: left;
    color: var(--beldex-text-muted);
    background: transparent;
    border: 0;
    border-left: 2px solid transparent;
    cursor: pointer;

    &:hover {
      color: var(--beldex-text);
    }

    &--active {
      padding-left: 22px;
      color: var(--beldex-text-strong);
      background-color: var(--beldex-panel);
      border-left-color: var(--beldex-accent);
    }
  }

  &__nav-label {
    flex: 1 1 auto;
  }

  &__nav-chevron {
    font-size: 20px;
    line-height: 16px;
    color: var(--beldex-accent);
  }

  // Icons used as masks so they follow the item colour.
  &__nav-icon {
    flex: none;
    width: 16px;
    height: 16px;
    background-color: currentColor;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;

    &--general {
      -webkit-mask-image: url("~assets/icons/nav-general.svg");
    }

    &--language {
      -webkit-mask-image: url("~assets/icons/nav-language.svg");
    }

    &--peers {
      -webkit-mask-image: url("~assets/icons/nav-peers.svg");
    }

    &--about {
      -webkit-mask-image: url("~assets/icons/nav-about.svg");
    }
  }

  &__nav-item--active &__nav-icon {
    color: var(--beldex-accent);
  }

  &__version {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-2);
    padding: 17px var(--beldex-space-4) var(--beldex-space-4);
    font-family: var(--beldex-font-micro);
    font-size: var(--beldex-text-md);
    line-height: 16px;
    color: var(--beldex-text-muted);
    border-top: 1px solid var(--beldex-panel);

    img {
      flex: none;
    }
  }

  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 15px;
    min-width: 0;
    max-width: 1130px;
    margin: 0 auto;
    padding: 35px var(--beldex-space-6) var(--beldex-space-9);
  }

  &__panel {
    padding: var(--beldex-space-7);
    box-shadow: none;
  }

  // Language tab: heading and card share the 640px column.
  &__content--narrow {
    max-width: calc(640px + 2 * var(--beldex-space-6));
  }

  // Language and About sit in the vertical middle of the page, as in Figma.
  &__content--narrow,
  &__content--about {
    justify-content: center;
    padding-top: var(--beldex-space-9);
  }

  // About tab: heading and card share the 448px column.
  &__content--about {
    max-width: calc(448px + 2 * var(--beldex-space-6));
  }

  // Peers table
  &__peer-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.5fr) 16px;
    align-items: center;
    gap: var(--beldex-space-4);
    width: 100%;
    min-height: 47px;
    padding: 0 var(--beldex-space-2);
    font-family: var(--beldex-font-mono);
    font-size: var(--beldex-text-md);
    text-align: left;
    color: var(--beldex-text);
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--beldex-border);
    cursor: pointer;

    &:hover {
      background-color: var(--beldex-panel);
    }

    &--static {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      cursor: default;

      &:hover {
        background: transparent;
      }
    }
  }

  &__peer-head {
    min-height: 32px;
    font-size: var(--beldex-text-xs);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);
    cursor: default;

    &:hover {
      background: transparent;
    }
  }

  &__peer-address {
    display: flex;
    align-items: center;
    gap: var(--beldex-space-2);
    min-width: 0;
  }

  &__peer-dot {
    flex: none;
    width: 6px;
    height: 6px;
    background-color: var(--beldex-accent);

    &--busy {
      background-color: var(--beldex-warning);
    }
  }

  &__peer-muted {
    color: var(--beldex-text-faint);
  }

  &__peer-state {
    color: var(--beldex-accent);
    text-transform: capitalize;

    &--busy {
      color: var(--beldex-warning);
    }
  }

  &__bans-title {
    margin-top: var(--beldex-space-6);
  }

  // Ban peer view: a centred 433px column.
  &__ban {
    width: 433px;
    max-width: 100%;
    margin: 120px auto 0;
  }

  &__ban-desc {
    margin: 12px 0 14px;
    font-family: var(--beldex-font-mono);
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.4px;
    white-space: pre-line;
    color: var(--beldex-text-muted);
  }

  &__ban-card {
    padding: 16px;
  }

  &__ban-target {
    margin-bottom: 14px;
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--beldex-text-muted);

    strong {
      margin-left: 4px;
      font-weight: 500;
      color: var(--beldex-text-strong);
    }
  }

  &__ban-input {
    width: 100%;
    height: 56px;
    padding: 0 14px;
    font-family: var(--beldex-font-mono);
    font-size: 14px;
    color: var(--beldex-text-strong);
    background-color: var(--beldex-panel);
    border: 0;
    border-bottom: 1px solid var(--beldex-border-strong);
    outline: none;

    &:focus {
      border-bottom-color: var(--beldex-accent);
    }
  }

  &__ban-hints {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 16px;
    font-family: var(--beldex-font-mono);
    font-size: 9px;
    color: var(--beldex-text-muted);
  }

  &__ban-error {
    margin: -6px 0 12px;
    font-size: 11px;
    color: var(--beldex-danger, #ff5c5c);
  }

  &__ban-actions {
    display: flex;
    gap: 8px;

    .q-btn {
      flex: 1 1 0;
      height: 60px;
    }
  }
}

// Peer details dialog.
.peer-dialog {
  width: 620px;

  &__json {
    max-height: 170px;
    margin: 16px 0 0;
    padding: 12px;
    overflow: auto;
    font-family: var(--beldex-font-mono);
    font-size: 10px;
    line-height: 15px;
    color: var(--beldex-text-muted);
    background-color: var(--beldex-panel);
    border: 1px solid var(--beldex-border);
  }
}
</style>
