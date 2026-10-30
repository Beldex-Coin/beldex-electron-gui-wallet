import Vue from "vue";
import { Loading } from "quasar";
import BeldexSpinner from "components/beldex_spinner.vue";

/* Re-skins every loading indicator (Figma Scrim 571:2298) with the Beldex
   spinner animation. The full-screen Loading overlay uses it by default, so
   existing $q.loading.show calls need no changes, and inline loaders use the
   globally registered <beldex-spinner>. The scrim itself (72% black + 5px
   backdrop blur) lives under `.q-loading` in app.styl. */
Vue.component("BeldexSpinner", BeldexSpinner);

Loading.setDefaults({
  spinner: BeldexSpinner,
  spinnerSize: 48
});
