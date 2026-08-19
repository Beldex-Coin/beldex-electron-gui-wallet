/* eslint-disable no-template-curly-in-string */
// Configuration for your app

const path = require("path");
const envVars = require("dotenv").config().parsed || {};
function addCommonJsExternals(cfg, moduleNames) {
  if (Array.isArray(cfg.externals)) {
    moduleNames.forEach(moduleName => {
      cfg.externals.push({
        [moduleName]: `commonjs ${moduleName}`
      });
    });
    return;
  }

  cfg.externals = cfg.externals || {};
  moduleNames.forEach(moduleName => {
    cfg.externals[moduleName] = `commonjs ${moduleName}`;
  });
}

const whitelistedEnv = {
  CHANGELLY_SWAP_API_KEY: envVars.CHANGELLY_SWAP_API_KEY || "",
  CHANGELLY_PRIVACY_SWAP_API_KEY: envVars.CHANGELLY_PRIVACY_SWAP_API_KEY || "",
  CHANGELLY_SWAP_PRIVATE_KEY: envVars.CHANGELLY_SWAP_PRIVATE_KEY || "",
  CHANGELLY_PRIVACY_SWAP_PRIVATE_KEY:
    envVars.CHANGELLY_PRIVACY_SWAP_PRIVATE_KEY || "",
  QUICKEX_SWAP_PUPLIC_KEY: envVars.QUICKEX_SWAP_PUPLIC_KEY || "",
  QUICKEX_SWAP_SECRET_KEY: envVars.QUICKEX_SWAP_SECRET_KEY || "",
  QUICKEX_REFERRER_ID: envVars.QUICKEX_REFERRER_ID || ""
};

module.exports = function() {
  return {
    // app boot (/src/boot)
    boot: ["i18n", "axios", "vuelidate", "gateway", "timeago"],
    css: ["app.styl"],
    extras: [
      // ctx.theme.mat ? "roboto-font" : null,
      "material-icons", // optional, you are not bound to it
      "material-icons-outlined"
      // "ionicons-v4",
      // "mdi-v5",
      // "fontawesome-v5"
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: "history",
      env: whitelistedEnv,
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.resolve = cfg.resolve || {};
        cfg.resolve.alias = cfg.resolve.alias || {};
        cfg.resolve.alias.electron = path.resolve(
          __dirname,
          "src/shims/electron-renderer.js"
        );
        addCommonJsExternals(cfg, ["bufferutil", "utf-8-validate"]);
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: "all" --- includes everything; for dev only!
    framework: {
      components: [
        "QLayout",
        "QHeader",
        "QFooter",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QTooltip",
        "QField",
        "QInput",
        "QRadio",
        "QOptionGroup",
        "QBtn",
        "QBtnToggle",
        "QIcon",
        "QTabs",
        "QTab",
        "QRouteTab",
        "QBtnDropdown",
        "QMenu",
        "QDialog",
        "QStep",
        "QStepper",
        "QStepperNavigation",
        "QSpinner",
        "QList",
        "QItemLabel",
        "QItem",
        "QSeparator",
        "QItemSection",
        "QSelect",
        "QToggle",
        "QPageSticky",
        "QExpansionItem",
        "QCheckbox",
        "QInnerLoading",
        "QInfiniteScroll",
        "QDate",
        "QTime",
        "QScrollArea"
      ],
      directives: ["Ripple"],
      // Quasar plugins
      plugins: ["Notify", "Loading", "LocalStorage", "Dialog"]
      // iconSet: ctx.theme.mat ? "material-icons" : "ionicons-v4"
      // i18n: "de" // Quasar language
    },
    // animations: "all" --- includes all animations
    animations: [],
    pwa: {
      // workboxPluginMode: "InjectManifest",
      // workboxOptions: {},
      manifest: {
        // name: "Quasar App",
        // short_name: "Quasar-PWA",
        // description: "Best PWA App in town!",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#43BD43",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    cordova: {
      // id: "org.cordova.quasar.app"
    },
    electron: {
      nodeIntegration: false,
      bundler: "builder", // or "packager"
      extendWebpack(cfg) {
        addCommonJsExternals(cfg, ["bufferutil", "utf-8-validate"]);
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: "",
        // appCategoryType: "",
        // osxSign: "",
        // protocol: "myapp://path",

        // Window only
        // win32metadata: { ... }

        extraResource: ["bin"]
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "com.beldex.electronwallet",
        productName: "Beldex Electron Wallet",
        copyright: "Copyright © 2018-2021 Beldex, 2018 Ryo Currency Project",
        afterSign: "build/notarize.js",
        artifactName: "beldex-electron-wallet-${version}-${os}.${ext}",
        publish: {
          provider: "generic",
          url:
            "https://github.com/Beldex-coin/beldex-electron-gui-wallet/releases/latest/download/"
        },

        linux: {
          target: ["deb", "AppImage"],
          icon: "src-electron/icon.png",
          category: "Finance"
        },

        mac: {
          // We need zip for auto-updating
          // Ref: https://github.com/electron-userland/electron-builder/issues/2199
          target: ["dmg", "zip"],
          icon: "src-electron/icons/icon.icns",
          category: "public.app-category.finance",
          binaries: ["bin/beldexd", "bin/beldex-wallet-rpc"],
          // Notarizing: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist"
        },

        dmg: {
          background: "src-electron/build/beldex-dmg.tiff",
          sign: false
        },

        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },

        files: [
          "!build/*.js",
          "!.env",
          "!dev-app-update.yml",
          "!downloads/**",
          "!dist/**"
        ],

        extraResources: ["bin"]
      }
    }
  };
};
