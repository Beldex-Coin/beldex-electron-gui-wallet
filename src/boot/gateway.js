import { Gateway } from "src/gateway/gateway";

/* This plugin gets called early in the life-cycle
   In the future, we can detect what platform we
   are on and include the correct gateway.

   The gateway just gets stored into the app global
   object to be called from anywhere within the
   frontend
*/

export default ({ app, router, Vue }) => {
  // A manual reload (or a dev full-refresh) keeps the old hash, e.g. #/wallet,
  // but the backend restarts from scratch with no wallet open. Start from the
  // root route so the normal startup flow picks the screen, instead of
  // rendering a wallet layout with no wallet behind it (blank page).
  if (window.location.hash && window.location.hash !== "#/") {
    window.location.hash = "#/";
  }
  Vue.prototype.$gateway = new Gateway(app, router);
};
