/*
  electron-builder afterPack hook (Linux only): fails the build if anything
  in the packaged app needs a newer glibc than Ubuntu 20.04 has (2.31).
  See before-pack.js.
*/
const { execFileSync } = require("child_process");
const path = require("path");

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") {
    return;
  }
  execFileSync(
    "bash",
    [path.join(__dirname, "check-glibc.sh"), context.appOutDir, "2.31"],
    { stdio: "inherit" }
  );
};
