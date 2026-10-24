/*
  electron-builder beforePack hook (Linux only).

  better-sqlite3 ships a prebuilt prebuilds/linux-x64.node that needs
  glibc 2.34, so the swap DB fails to load on Ubuntu 20.04 (glibc 2.31).
  Electron itself and the beldexd / beldex-wallet-rpc binaries already
  only need glibc 2.25, so this module is the only thing to fix.

  Here we recompile it from source with `zig cc` targeting glibc 2.31
  (no Docker or old-distro build machine needed) and drop the prebuilds
  for other platforms. after-pack.js then verifies the packaged app.

  Runs against Quasar's dist/electron/UnPackaged copy of node_modules
  (Quasar does its own `npm install --production` there), not the
  project's node_modules.
*/
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { Arch } = require("electron-builder");

const GLIBC_TARGET = "2.31";
const ZIG_VERSION = "0.15.2";

const log = msg => console.log(`  • [glibc-compat] ${msg}`);

function findZig() {
  if (process.env.ZIG) {
    return process.env.ZIG;
  }
  const cached = path.join(
    process.env.BELDEX_BUILD_CACHE ||
      path.join(os.homedir(), ".cache", "beldex-build"),
    `zig-x86_64-linux-${ZIG_VERSION}`,
    "zig"
  );
  if (fs.existsSync(cached)) {
    return cached;
  }
  try {
    execFileSync("zig", ["version"], { stdio: "ignore" });
    return "zig";
  } catch (e) {
    throw new Error(
      "Zig is required to build the Linux package (it compiles better-sqlite3 " +
        "for Ubuntu 20.04+). Install it with: bash build/linux-glibc-compat/install-zig.sh"
    );
  }
}

exports.default = async function beforePack(context) {
  if (context.electronPlatformName !== "linux") {
    return;
  }
  if (context.arch !== Arch.x64) {
    throw new Error(
      `glibc-compat build only supports x64, got ${Arch[context.arch]}`
    );
  }

  const moduleDir = path.join(
    context.packager.info.appDir,
    "node_modules",
    "better-sqlite3"
  );
  const zig = findZig();
  const nodeGyp = require.resolve("node-gyp/bin/node-gyp.js");

  log(`compiling better-sqlite3 for glibc ${GLIBC_TARGET} with ${zig}`);
  execFileSync(
    process.execPath,
    [nodeGyp, "rebuild", "--release", "--force_build=1"],
    {
      cwd: moduleDir,
      stdio: "inherit",
      env: {
        ...process.env,
        ZIG: zig,
        GLIBC_TARGET,
        CC: path.join(__dirname, "zig-cc"),
        CXX: path.join(__dirname, "zig-cxx")
      }
    }
  );

  const prebuildsDir = path.join(moduleDir, "prebuilds");
  fs.copyFileSync(
    path.join(moduleDir, "build", "Release", "better_sqlite3.node"),
    path.join(prebuildsDir, "linux-x64.node")
  );
  for (const file of fs.readdirSync(prebuildsDir)) {
    if (file !== "linux-x64.node") {
      fs.rmSync(path.join(prebuildsDir, file));
    }
  }
  fs.rmSync(path.join(moduleDir, "build"), { recursive: true, force: true });
  log("replaced prebuilds/linux-x64.node");
};
