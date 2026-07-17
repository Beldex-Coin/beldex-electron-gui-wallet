require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { notarize } = require("@electron/notarize");
/*
 Pre-requisites: https://github.com/electron/electron-notarize#prerequisites
    1. Generate an app specific password
    2. Add SIGNING_APPLE_ID, SIGNING_APP_PASSWORD, SIGNING_TEAM_ID to .env file in the root directory (where quasar.conf.js is located)
*/

/*
  Notarizing: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
*/

const log = msg => console.log(`\n${msg}`);
const isEmpty = v => !v || v.length === 0;

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  log("Notarizing mac application");

  const appName = context.packager.appInfo.productFilename;
  const {
    SIGNING_APPLE_ID,
    SIGNING_APP_PASSWORD,
    SIGNING_TEAM_ID
  } = process.env;

  if (isEmpty(SIGNING_APPLE_ID) || isEmpty(SIGNING_APP_PASSWORD)) {
    log(
      "SIGNING_APPLE_ID or SIGNING_APP_PASSWORD not set.\nSkipping notarization."
    );
    return;
  }

  const appPath = path.join(appOutDir, `${appName}.app`);
  if (!fs.existsSync(appPath)) {
    log(
      `App bundle not found at ${appPath}.\nSkipping notarization and leaving the packaging logs intact for the upstream build failure.`
    );
    return;
  }

  const options = {
    tool: "notarytool",
    appBundleId: "com.beldex.electronwallet",
    appPath,
    appleId: SIGNING_APPLE_ID,
    appleIdPassword: SIGNING_APP_PASSWORD,
    teamId: SIGNING_TEAM_ID
  };
  if (!isEmpty(SIGNING_TEAM_ID)) options.ascProvider = SIGNING_TEAM_ID;

  try {
    return await notarize(options);
  } catch (error) {
    log(
      `Notarization failed for ${appPath}.\n${
        error && error.message ? error.message : error
      }`
    );
    throw error;
  }
};
