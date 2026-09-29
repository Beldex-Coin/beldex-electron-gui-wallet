import {
  app,
  ipcMain,
  BrowserWindow,
  Menu,
  dialog,
  powerMonitor,
  session,
  shell
} from "electron";
import { version, productName } from "../../package.json";
import { Backend } from "./modules/backend";
import { checkForUpdate } from "./auto-updater";
import menuTemplate from "./menu";
import isDev from "electron-is-dev";
const portscanner = require("portscanner");
const windowStateKeeper = require("electron-window-state");
const path = require("upath");
const fs = require("fs");
const child_process = require("child_process");

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = path.join(__dirname, "statics").replace(/\\/g, "\\\\");
  global.__ryo_bin = path.join(__dirname, "..", "bin").replace(/\\/g, "\\\\");
} else {
  global.__ryo_bin = path.join(process.cwd(), "bin").replace(/\\/g, "\\\\");
}
// Some Electron 42.x builds have been unstable for macOS users during very
// early startup; disabling V8's Maglev compiler tier avoids that. Scoped to
// macOS only - Windows and Linux don't need to lose this optimizing tier,
// which matters here since the renderer parses large transaction lists.
// Revisit once a newer Electron release confirms the instability is gone.
//
// appendSwitch("js-flags", ...) replaces any previously set js-flags value
// rather than merging with it, so a second unrelated appendSwitch("js-flags",
// ...) call elsewhere would silently clobber this one. Collect any future
// V8 flags into V8_FLAGS below instead of adding another appendSwitch call.
const V8_FLAGS = ["--no-maglev"];
if (process.platform === "darwin") {
  app.commandLine.appendSwitch("js-flags", V8_FLAGS.join(" "));
}
// Chromium's Linux sandbox works one of two ways: a setuid-root
// `chrome-sandbox` helper (which electron-builder packages at mode 4755
// for the deb/rpm targets), or the kernel's unprivileged user namespaces
// (which the AppImage target relies on, since a FUSE-mounted AppImage is
// commonly `nosuid`, defeating the setuid helper regardless of its file
// permissions). Only fall back to running unsandboxed if neither path is
// actually usable on this system, instead of disabling it unconditionally
// for every Linux user.
// Node's fs.constants doesn't expose the setuid bit (only file-type and
// permission bits), so use the standard POSIX octal value directly.
const S_ISUID = 0o4000;

function hasWorkingSetuidSandboxHelper() {
  try {
    const helperPath = path.join(
      path.dirname(process.execPath),
      "chrome-sandbox"
    );
    const stats = fs.statSync(helperPath);
    const isSetuid = (stats.mode & S_ISUID) !== 0;
    return stats.uid === 0 && isSetuid;
  } catch (err) {
    return false;
  }
}

function canUseUnprivilegedUserNamespaces() {
  try {
    const result = child_process.spawnSync(
      "unshare",
      ["--user", "--pid", "--", "true"],
      { stdio: "ignore", timeout: 2000 }
    );
    return result.status === 0;
  } catch (err) {
    return false;
  }
}

if (process.platform === "linux") {
  // Chromium hard-refuses to start sandboxed while running as root (there
  // is nothing for the setuid helper to drop privileges to), so treat that
  // the same as a failed probe rather than let the app fail to launch -
  // this matters for CI/Docker dev environments that commonly run as root.
  const runningAsRoot =
    typeof process.getuid === "function" && process.getuid() === 0;

  const sandboxUsable =
    !runningAsRoot &&
    (hasWorkingSetuidSandboxHelper() || canUseUnprivilegedUserNamespaces());

  if (!sandboxUsable) {
    console.warn(
      "[sandbox] Neither the packaged chrome-sandbox helper nor " +
        "unprivileged user namespaces are usable on this system - " +
        "falling back to --no-sandbox. Renderer processes will not be " +
        "sandboxed."
    );
    app.commandLine.appendSwitch("no-sandbox");
  }
}

let mainWindow, backend;
let showConfirmClose = true;
let forceQuit = false;
let installUpdate = false;
let startingToken = null;

const title = `${productName} v${version}`;

const selectionMenu = Menu.buildFromTemplate([
  { role: "copy" },
  { type: "separator" },
  { role: "selectall" }
]);

const inputMenu = Menu.buildFromTemplate([
  { role: "cut" },
  { role: "copy" },
  { role: "paste" },
  { type: "separator" },
  { role: "selectall" }
]);

const rendererConnectSrc = [
  "'self'",
  "ws://127.0.0.1:12313",
  "https://api.beldex.dev",
  "https://api.changelly.com"
];

const devConnectSrc = [
  ...rendererConnectSrc,
  "http://127.0.0.1:*",
  "http://localhost:*",
  "http://0.0.0.0:*",
  "ws://127.0.0.1:*",
  "ws://localhost:*",
  "ws://0.0.0.0:*"
];

function getContentSecurityPolicy() {
  const scriptSrc = ["'self'"];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = isDev ? devConnectSrc : rendererConnectSrc;

  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `style-src ${styleSrc.join(" ")}`,
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'"
  ].join("; ");
}

function isAllowedWindowOpenUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      (parsedUrl.hostname === "beldex.io" ||
        parsedUrl.hostname === "www.beldex.io")
    );
  } catch (error) {
    return false;
  }
}

function createWindow() {
  /**
   * Initial window options
   */

  let mainWindowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 700
  });
  const windowOptions = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1200,
    minHeight: 650,
    title,
    backgroundColor: "#1c1c26",
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      sandbox: false,
      // anything we want preloaded, e.g. global vars
      preload: path.resolve(__dirname, "electron-preload.js")
    }
  };
  // macOS reads the app bundle icon from the .app resources; avoid forcing a
  // separate window icon decode path during startup. (windowOptions used to
  // set `icon` unconditionally above and then only re-set it here for the
  // non-darwin case, which never actually skipped it for darwin - the icon
  // is now only added to windowOptions in this branch.)
  if (process.platform !== "darwin") {
    windowOptions.icon = path.join(__statics, "icon.png");
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.on("close", e => {
    // Don't ask for confirmation if we're installing an update
    if (installUpdate) {
      return;
    }

    if (process.platform === "darwin") {
      if (forceQuit) {
        forceQuit = false;
        if (showConfirmClose) {
          e.preventDefault();
          mainWindow.show();
          mainWindow.webContents.send("confirmClose");
        } else {
          e.defaultPrevented = false;
        }
      } else {
        e.preventDefault();
        mainWindow.hide();
      }
    } else {
      if (showConfirmClose) {
        e.preventDefault();
        mainWindow.webContents.send("confirmClose");
      } else {
        e.defaultPrevented = false;
      }
    }
  });

  ipcMain.on("confirmClose", (e, restart) => {
    showConfirmClose = false;

    // In dev mode, this will launch a blank white screen
    if (restart && !isDev) app.relaunch();

    const promise = backend ? backend.quit() : Promise.resolve();
    promise.then(() => {
      backend = null;
      app.quit();
    });
  });

  mainWindow.webContents.on("did-finish-load", () => {
    // Set the title
    mainWindow.setTitle(title);

    require("crypto").randomBytes(64, (err, buffer) => {
      // if err, then we may have to use insecure token generation perhaps
      if (err) throw err;

      let config = {
        port: 12313,
        token: buffer.toString("hex")
      };

      portscanner.checkPortStatus(config.port, "127.0.0.1", (error, status) => {
        if (error) {
          console.error(error);
        }

        if (status === "closed") {
          backend = new Backend(mainWindow);
          backend.init(config);
          startingToken = config.token;
          mainWindow.webContents.send("initialize", config);
        } else {
          dialog.showMessageBox(
            mainWindow,
            {
              title: "Startup error",
              message: `Beldex Wallet is already open, or port ${config.port} is in use`,
              type: "error",
              buttons: ["ok"]
            },
            () => {
              showConfirmClose = false;
              app.quit();
            }
          );
        }
      });
    });
  });

  mainWindow.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== "") {
      selectionMenu.popup(mainWindow);
    }
  });
  mainWindow.loadURL(process.env.APP_URL);
  mainWindowState.manage(mainWindow);
}
async function selectPath(title, property) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return "";
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title,
    properties: [property]
  });

  if (canceled || !filePaths || filePaths.length === 0) {
    return "";
  }

  return filePaths[0];
}

ipcMain.handle("dialog:selectWalletFile", async () => {
  return selectPath("Select wallet file", "openFile");
});

ipcMain.handle("dialog:selectFile", async (event, options = {}) => {
  return selectPath(options.title || "Select file", "openFile");
});

ipcMain.handle("dialog:selectDirectory", async (event, options = {}) => {
  return selectPath(options.title || "Select folder", "openDirectory");
});

powerMonitor.on("suspend", () => {
  mainWindow.webContents.send("appSuspend");
});

powerMonitor.on("resume", () => {
  let config = {
    port: 12313,
    token: startingToken
  };
  mainWindow.webContents.send("appResumed", config);
});

app.on("ready", () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [getContentSecurityPolicy()]
      }
    });
  });

  checkForUpdate(
    () => mainWindow,
    autoUpdater => {
      if (mainWindow) {
        mainWindow.webContents.send("showQuitScreen");
      }

      const promise = backend ? backend.quit() : Promise.resolve();
      promise.then(() => {
        installUpdate = true;
        backend = null;
        autoUpdater.quitAndInstall();
      });
    }
  );
  if (process.platform === "darwin") {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }
  createWindow();
});

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (event, url) => {
    const currentUrl = contents.getURL();
    if (url !== currentUrl) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(({ url }) => {
    if (isAllowedWindowOpenUrl(url)) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } else if (process.platform === "darwin") {
    mainWindow.show();
  }
});

app.on("before-quit", () => {
  // Quit instantly if we are installing an update
  if (installUpdate) {
    return;
  }

  if (process.platform === "darwin") {
    forceQuit = true;
  } else {
    if (backend) {
      backend.quit().then(() => {
        mainWindow.close();
      });
    }
  }
});

app.on("quit", () => {});
