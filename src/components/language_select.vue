<template>
  <section class="language-select">
    <div class="language-select__grid">
      <button
        v-for="(option, index) in options"
        :key="option.value"
        type="button"
        class="beldex-option language-select__card"
        :class="{ 'beldex-option--active': lang === option.value }"
        :aria-pressed="lang === option.value ? 'true' : 'false'"
        @click="setLanguage(option.value)"
      >
        <span
          class="language-select__flag"
          :class="{ 'language-select__flag--row': option.flag.row }"
        >
          <span
            v-for="(stripe, i) in option.flag.stripes"
            :key="i"
            :style="{ background: stripe[0], flex: `${stripe[1]} 1 0` }"
          />
        </span>
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
        <span class="language-select__code">
          <span class="language-select__marker" />
          {{ localeCode(option.value) }}
        </span>
      </button>
    </div>
    <div class="language-select__actions">
      <div class="language-select__info">
        <slot name="info" />
      </div>
      <q-btn class="beldex-btn" unelevated no-caps @click="submit()">
        {{ $t("buttons.next") }}
        <img src="~assets/icons/arrow-right.svg" alt="" />
      </q-btn>
    </div>
  </section>
</template>

<script>
import { languages } from "src/i18n";
import { flagGraphic, localeCode } from "src/i18n/flags";

export default {
  name: "LanguageSelect",
  data() {
    return {
      langData: ""
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
    options() {
      return languages.map(lang => ({
        label: lang.native || lang.name,
        value: lang.code,
        flag: flagGraphic(lang.code)
      }));
    }
  },
  methods: {
    localeCode,
    setLanguage(lang) {
      this.$gateway.send("core", "set_language", { lang });
      this.langData = lang;
      // this.$emit("select", lang);
    },
    submit() {
      this.$emit("select", this.langData);
    }
  }
};
</script>
