import * as path from "path";
import * as fs from "fs-extra";
import { dialog } from "electron";
import isDev from "electron-is-dev";
import { autoUpdater } from "electron-updater";
import { app } from "electron";
console.log("isUpdating:...");
let isUpdating = false;
import { version } from "./../../package.json";

/*
  Check if we have the required files to auto update.
  These files won't exist inside certain formats such as a linux deb file.
*/

async function writeFile(content) {
  const os = require("os");
  const path = require("upath");
  let configDir = path.join(os.homedir(), "/Documents/example.txt");
  content += "\n";
  console.log("configDir:", configDir);
  fs.appendFile(configDir, content, "utf8", error => {
    if (error) {
      console.error("An error occurred while writing to the file:", error);
      return;
    }
    console.log("File has been written successfully.");
  });
}

async function canAutoUpdate() {
  const { isPackaged } = app;
  writeFile(
    `isPackaged ${isPackaged}, ${process.resourcesPath}, ${isPackaged &&
      !process.resourcesPath}`
  );
  console.log(
    "isPackaged...",
    isPackaged,
    process.resourcesPath,
    isPackaged && !process.resourcesPath
  );
  // On a production app, we need to use resources path to check for the file
  if (isPackaged && !process.resourcesPath) {
    return false;
  }
  console.log("update......");
  // Taken from: https://github.com/electron-userland/electron-builder/blob/d4feb6d3c8b008f8b455c761d654c8088f90d8fa/packages/electron-updater/src/ElectronAppAdapter.ts#L25
  const updateFile = isPackaged ? "app-update.yml" : "dev-app-update.yml";
  const basePath =
    isPackaged && process.resourcesPath
      ? process.resourcesPath
      : app.getAppPath();
  console.log("basePath:", basePath);
  console.log("updateFile:", updateFile);
  const appUpdateConfigPath = path.join(basePath, updateFile);
  console.log("appUpdateConfigPath:", appUpdateConfigPath);
  writeFile(`appUpdateConfigPath ${appUpdateConfigPath}`);
  return new Promise(resolve => {
    try {
      // tslint:disable-next-line: non-literal-fs-path
      const exists = fs.existsSync(appUpdateConfigPath);
      writeFile(`exits ${exists}`);

      console.log("exists:", exists);
      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
}

async function checkForUpdate(getMainWindow, onQuitAndInstall) {
  console.log("check for update...", isDev, isUpdating);
  // Disable for development
  // if (isDev) {
  //   return;
  // }

  // if (isUpdating) {
  //   return;
  // }
  writeFile(`check canUpdate`);
  const canUpdate = await canAutoUpdate();
  console.log("canUpdate....:", canUpdate);
  writeFile(`canUpdate ${canUpdate}`);

  if (!canUpdate) {
    return;
  }

  autoUpdater.logger = console;
  // let isUpdating = true;
  const mainWindow = getMainWindow();
  if (!mainWindow) {
    console.warn("cannot showDownloadUpdateDialog, mainWindow is unset");
    return;
  }

  try {
    console.log("checkForUpdates......");
    // Get the update using electron-updater
    // const currentVersion = autoUpdater.currentVersion.toString();
    // console.log("currentVersion:", currentVersion)

    const result = await autoUpdater.checkForUpdates();
    writeFile(`result.....: ${JSON.stringify(result)}`);
    console.log("result.....:", JSON.stringify(result));
    if (!result.updateInfo) {
      // logger.info('[updater] no update info received');

      return;
    }
    // if (!info || !info.downloadPromise) {
    //   console.info("auto-update: no update to download");

    //   return;
    // }

    // Access the version property

    if (!result.updateInfo.version) {
      // logger.info('[updater] no update available');
      return;
    }
    writeFile(`dddd...ss..:${version}`);
    // const currentVersion = packageInfo.version;
    console.log("version:......", version);
    const isMoreRecent = version >= result.updateInfo.version;
    writeFile(`isMoreRecent.....: ${isMoreRecent}`);
    console.log("isMoreRecent:", isMoreRecent);
    if (isMoreRecent) {
      // logger.info(
      //   `The app is upto date`
      // );
      return;
    }
    writeFile(`dddd...ss..:`, isMoreRecent);
    try {
      autoUpdater.on("update-available", async info => {
        // insertInto(`update-downloaded-releasename",${releaseName}`);
        writeFile(`update available ...: ${JSON.stringify(info)}`);
        // console.log('event, releaseNotes, releaseName:', event, releaseNotes, releaseName);
        // await autoUpdater.quitAndInstall(false);
        writeFile(`downloading.....:`);
        await autoUpdater.downloadUpdate();
        writeFile(`downloaded....:`);
      });
      const shouldDownload = await showDownloadUpdateDialog(mainWindow);
      writeFile(`shouldDownload.....: ${shouldDownload}`);
      // insertInto(`[updater] shouldDownload:",${shouldDownload}`);
      if (!shouldDownload) {
        // insertInto(`[updater] shouldDownload:if ::",${!shouldDownload}`);
        // downloadIgnored = true;

        return;
      }
      autoUpdater.on(
        "update-downloaded",
        async (event, releaseNotes, releaseName) => {
          // insertInto(`update-downloaded-releasename",${releaseName}`);
          writeFile(
            `update downloaded..event...: ${(event, releaseNotes, releaseName)}`
          );
          console.log(
            "event, releaseNotes, releaseName:",
            event,
            releaseNotes,
            releaseName
          );
          await autoUpdater.quitAndInstall(false);
        }
      );
    } catch (err) {
      writeFile(`errd..event...: ${err}`);
      const mainWindow = getMainWindow();
      if (!mainWindow) {
        console.warn("cannot showDownloadUpdateDialog, mainWindow is unset");
        return;
      }
      await showCannotUpdateDialog(getMainWindow());
    }
    // await autoUpdater.downloadUpdate();

    // const hasUpdate = isUpdateAvailable(info.updateInfo);
    // logger.info('[updater] hasUpdate:', hasUpdate);

    // if (!hasUpdate) {
    //   logger.info('[updater] no update available');

    //   return;
    // }
    // try {
    //   await info.downloadPromise;
    // } catch (error) {
    //   writeFile(`info.....: ${error}`)
    //   await showCannotUpdateDialog(getMainWindow());
    //   throw error;
    // }

    const window = getMainWindow();
    if (!window) {
      console.warn("cannot showDownloadUpdateDialog, mainWindow is unset");
      return;
    }
    // Update downloaded successfully, we should ask the user to update

    // Update downloaded successfully, we should ask the user to update
    console.info("auto-update: showing update dialog...");
    const shouldUpdate = await showUpdateDialog(window);
    writeFile(`shouldUpdate.....: ${shouldUpdate}`);

    if (!shouldUpdate) {
      return;
    }
    await autoUpdater.quitAndInstall();

    console.info("auto-update: calling quitAndInstall...");
    if (onQuitAndInstall) {
      onQuitAndInstall(autoUpdater);
    }
  } catch (error) {
    console.log("errorerrorerror:", error);
    writeFile(`errorerrorerror ${error}`);
    console.error("auto-update error:", getPrintableError(error));
  } finally {
    isUpdating = false;
  }
}

function getPrintableError(error) {
  return error && error.stack ? error.stack : error;
}

async function showUpdateDialog(mainWindow) {
  console.log("show.....");
  const RESTART_BUTTON = 0;
  const LATER_BUTTON = 1;
  const options = {
    type: "info",
    buttons: ["Restart Wallet", "Later"],
    title: "Beldex Electron Wallet update available",
    message:
      "There auto update is a new version of Beldex Electron Wallet available.",
    detail: "Press Restart Wallet to apply the update",
    defaultId: LATER_BUTTON,
    cancelId: RESTART_BUTTON
  };
  // return new Promise(resolve => {
  //   dialog.showMessageBox(mainWindow, options, response => {
  //     resolve(response === RESTART_BUTTON);
  //   });
  // });
  const ret = await dialog.showMessageBox(mainWindow, options);

  return ret.response === RESTART_BUTTON;
}

async function showDownloadUpdateDialog(
  mainWindow
  // messages
) {
  const DOWNLOAD_BUTTON = 0;
  const LATER_BUTTON = 1;
  const options = {
    type: "info",
    buttons: ["Download update", "Later"],
    title: "Download update",
    message: "knkndkn",
    detail: "ksdjkkjdsds",
    // buttons: [messages.autoUpdateDownloadButtonLabel, messages.autoUpdateLaterButtonLabel],
    // title: messages.autoUpdateNewVersionTitle,
    // message: messages.autoUpdateNewVersionMessage,
    // detail: messages.autoUpdateDownloadInstructions,
    defaultId: LATER_BUTTON,
    cancelId: DOWNLOAD_BUTTON
  };

  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, response => {
      resolve(response === DOWNLOAD_BUTTON);
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
