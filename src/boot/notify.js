import { Notify } from "quasar";

/* Re-skins Quasar's built-in notify types as the designer's Toast component
   (Figma 524:2108-524:2200), so every existing $q.notify / Notify.create call
   picks up the new look without touching its call site. Styles live under
   `.beldex-toast` in app.styl.

   - Compact (default): icon + message.
   - Detailed: pass a `caption` - the message becomes the title, the caption
     the description, and any actions drop below them. Add `progress: true`
     for the auto-dismiss timer bar, and `class: "beldex-toast__dismiss"` on
     a muted "Dismiss" action. */
const toastType = (type, icon) => ({
  icon: `img:${icon}`,
  classes: `beldex-toast beldex-toast--${type}`,
  // Quasar defaults textColor to "white", whose `text-white` class is
  // !important and would override the toast colours.
  textColor: void 0
});

export default () => {
  // Design stacks toasts in the bottom-right corner (Figma 524:2495).
  Notify.setDefaults({ position: "bottom-right" });

  Notify.registerType(
    "positive",
    toastType("success", require("assets/icons/toast-success.svg"))
  );
  Notify.registerType(
    "negative",
    toastType("error", require("assets/icons/toast-error.svg"))
  );
  Notify.registerType(
    "warning",
    toastType("warning", require("assets/icons/toast-warning.svg"))
  );
  Notify.registerType(
    "info",
    toastType("info", require("assets/icons/toast-info.svg"))
  );
};
