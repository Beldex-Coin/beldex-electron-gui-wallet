/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn"t be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

// Install `electron-debug` with `devtron`
require("electron-debug")({
  showDevTools: true
});

// Install `vue-devtools`
// Install `vue-devtools` only when explicitly requested.
// Newer Electron versions or locked-down environments can fail while
// downloading the extension, which should not block local development.

require("electron").app.on("ready", () => {
  if (process.env.BELDEX_INSTALL_VUE_DEVTOOLS !== "true") {
    console.info(
      "Skipping `vue-devtools` auto-install. Set BELDEX_INSTALL_VUE_DEVTOOLS=true to enable it."
    );
    return;
  }

  let installExtension = require("electron-devtools-installer");
  installExtension
    .default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {
      console.info("Installed `vue-devtools`.");
    })
    .catch(err => {
      console.warn(
        "Unable to install `vue-devtools`. Continuing without it.\n",
        err
      );
    });
});

// Require `main` process to boot app
require("./electron-main");
