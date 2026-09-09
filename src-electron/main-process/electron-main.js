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
    // Currency icons only ever come from Changelly/QuickEx - see the
    // matching hostname allowlist in currencyDropDown.vue's safeImageSrc().
    "img-src 'self' data: https://changelly.com https://*.changelly.com https://quickex.io https://*.quickex.io",
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
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1200,
    minHeight: 650,
    icon: require("path").join(__statics, "icon.png"),
    title,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      sandbox: false,
      // anything we want preloaded, e.g. global vars
      preload: path.resolve(__dirname, "electron-preload.js")
    }
  });

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
