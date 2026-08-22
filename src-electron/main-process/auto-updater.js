import * as path from "path";
import * as fs from "fs-extra";
import { dialog, shell } from "electron";
import isDev from "electron-is-dev";
import { autoUpdater } from "electron-updater";
import { app } from "electron";

const RELEASES_URL =
  "https://github.com/Beldex-coin/beldex-electron-gui-wallet/releases/latest";

let isUpdating = false;

/*
  Check if we have the required files to auto update.
  These files won't exist inside certain formats such as a linux deb file.
*/
async function canAutoUpdate() {
  const { isPackaged } = app;

  // On a production app, we need to use resources path to check for the file
  if (isPackaged && !process.resourcesPath) {
    return false;
  }

  // Taken from: https://github.com/electron-userland/electron-builder/blob/d4feb6d3c8b008f8b455c761d654c8088f90d8fa/packages/electron-updater/src/ElectronAppAdapter.ts#L25
  const updateFile = isPackaged ? "app-update.yml" : "dev-app-update.yml";
  const basePath =
    isPackaged && process.resourcesPath
      ? process.resourcesPath
      : app.getAppPath();
  const appUpdateConfigPath = path.join(basePath, updateFile);

  return new Promise(resolve => {
    try {
      // tslint:disable-next-line: non-literal-fs-path
      const exists = fs.existsSync(appUpdateConfigPath);
      resolve(exists);
    } catch (e) {
      resolve(false);
    }
  });
}

async function checkForUpdate(getMainWindow, onQuitAndInstall) {
  // Disable for development
  if (isDev) {
    return;
  }

  if (isUpdating) {
    return;
  }

  const canUpdate = await canAutoUpdate();
  if (!canUpdate) {
    return;
  }

  autoUpdater.logger = console;

  if (process.platform === "linux" && !process.env.APPIMAGE) {
    await checkForUpdateOnNonAppImageLinux(getMainWindow);
    return;
  }

  try {
    // Get the update using electron-updater
    const info = await autoUpdater.checkForUpdates();
    if (!info || !info.downloadPromise) {
      console.info("auto-update: no update to download");

      return;
    }

    try {
      await info.downloadPromise;
    } catch (error) {
      await showCannotUpdateDialog(getMainWindow());
      throw error;
    }

    // Update downloaded successfully, we should ask the user to update
    console.info("auto-update: showing update dialog...");
    const shouldUpdate = await showUpdateDialog(getMainWindow());
    if (!shouldUpdate) {
      return;
    }

    console.info("auto-update: calling quitAndInstall...");
    if (onQuitAndInstall) {
      onQuitAndInstall(autoUpdater);
    }
  } catch (error) {
    console.error("auto-update error:", getPrintableError(error));
  } finally {
    isUpdating = false;
  }
}

async function checkForUpdateOnNonAppImageLinux(getMainWindow) {
  try {
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.autoDownload = false;

    const result = await autoUpdater.checkForUpdates();
    if (!result || !result.isUpdateAvailable) {
      console.info("auto-update: no update available (non-AppImage linux)");

      return;
    }

    console.info(
      `auto-update: version ${result.updateInfo.version} available, but automatic updates aren't supported for this package format`
    );
    await showManualUpdateDialog(getMainWindow(), result.updateInfo.version);
  } catch (error) {
    console.error(
      "auto-update error (non-AppImage linux):",
      getPrintableError(error)
    );
  } finally {
    autoUpdater.forceDevUpdateConfig = false;
    autoUpdater.autoDownload = true;
  }
}

function getPrintableError(error) {
  return error && error.stack ? error.stack : error;
}

async function showUpdateDialog(mainWindow) {
  const RESTART_BUTTON = 0;
  const LATER_BUTTON = 1;
  const options = {
    type: "info",
    buttons: ["Restart Wallet", "Later"],
    title: "Beldex Electron Wallet update available",
    message: "There is a new version of Beldex Electron Wallet available.",
    detail: "Press Restart Wallet to apply the update",
    defaultId: LATER_BUTTON,
    cancelId: RESTART_BUTTON
  };
  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, response => {
      resolve(response === RESTART_BUTTON);
    });
  });
}

async function showManualUpdateDialog(mainWindow, latestVersion) {
  const DOWNLOAD_BUTTON = 0;
  const LATER_BUTTON = 1;
  const options = {
    type: "info",
    buttons: ["Download Update", "Later"],
    title: "Beldex Electron Wallet update available",
    message: `Beldex Electron Wallet v${latestVersion} is available.`,
    detail:
      "Automatic updates aren't supported for this package format. Please download and install the latest version manually.",
    defaultId: LATER_BUTTON,
    cancelId: LATER_BUTTON
  };

  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, response => {
      if (response === DOWNLOAD_BUTTON) {
        shell.openExternal(RELEASES_URL);
      }

      resolve();
    });
  });
}

async function showCannotUpdateDialog(mainWindow) {
  const options = {
    type: "error",
    buttons: ["Ok"],
    title: "Cannot update",
    message:
      "Beldex Electron Wallet failed to update but there is a new version available. Please go to https://beldex.io/ and install the new version manually."
  };

  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, () => {
      resolve();
    });
  });
}

export { checkForUpdate };
