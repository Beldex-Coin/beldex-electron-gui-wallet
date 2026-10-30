<template>
  <div class="language-select language-select--settings">
    <div class="language-select__grid" role="radiogroup">
      <button
        v-for="(option, index) in options"
        :key="option.value"
        type="button"
        role="radio"
        class="beldex-option language-select__card"
        :class="{ 'beldex-option--active': langSelect === option.value }"
        :aria-checked="langSelect === option.value ? 'true' : 'false'"
        @click="setLanguage(option.value)"
      >
        <span
          :class="`flag-icon flag-icon-${option.flag}`"
          class="language-select__flag"
        />
        <span class="language-select__text">
          <span class="language-select__index">
            {{ String(index + 1).padStart(2, "0") }} /
            {{
              index === 0
                ? $t("strings.languageDefault")
                : $t("strings.languageRegional")
            }}
          </span>
          <span class="language-select__name">{{ option.label }}</span>
        </span>
        <span
          class="beldex-check"
          :class="{ 'beldex-check--on': langSelect === option.value }"
        />
      </button>
    </div>
    <div class="language-select__actions">
      <div class="language-select__info" />
      <q-btn
        class="beldex-btn"
        unelevated
        no-caps
        :label="$t('buttons.save')"
        @click="save"
      />
    </div>
  </div>
</template>

<script>
import { languages } from "src/i18n";

export default {
  name: "LanguageSelect",
  data() {
    return {
      langSelect: this.$i18n.locale
    };
  },
  computed: {
    pending_config: state => state.gateway.app.pending_config,
    lang() {
      return this.$i18n.locale;
    },
    options() {
      return languages.map(lang => ({
        label: lang.name,
        value: lang.code,
        flag: lang.flag
      }));
    }
  },
  watch: {
    isVisible: function() {
      if (this.isVisible == false) {
        this.$store.dispatch("gateway/resetPendingConfig");
      }
    }
  },
  methods: {
    save() {
      const lang = this.langSelect;

      this.$gateway.send("core", "set_language", { lang });
      this.$emit("select", lang);

      this.$gateway.send("core", "save_config", this.pending_config);
      this.isVisible = false;
    },
    setLanguage(lang) {
      this.langSelect = lang;
      // this.$gateway.send("core", "set_language", { lang });
      // this.$emit("select", lang);
    }
  }
};
</script>

<style lang="scss">
// Card styles are shared with language_select.vue (its
// unscoped `.language-select` block); only the settings variant differs here.
.language-select--settings {
  .beldex-check {
    margin-left: auto;
  }
}
</style>
