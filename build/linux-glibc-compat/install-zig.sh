#!/usr/bin/env bash
# Downloads the pinned Zig toolchain that before-pack.js uses to compile
# better-sqlite3 against an old glibc.
# No root needed: installs into ~/.cache/beldex-build by default.
set -euo pipefail

ZIG_VERSION="0.15.2"
ZIG_SHA256="02aa270f183da276e5b5920b1dac44a63f1a49e55050ebde3aecc9eb82f93239"
ZIG_NAME="zig-x86_64-linux-${ZIG_VERSION}"
INSTALL_ROOT="${BELDEX_BUILD_CACHE:-${HOME}/.cache/beldex-build}"
ZIG_BIN="${INSTALL_ROOT}/${ZIG_NAME}/zig"

if [ -x "$ZIG_BIN" ]; then
  echo "Zig ${ZIG_VERSION} already installed: ${ZIG_BIN}"
  exit 0
fi

mkdir -p "$INSTALL_ROOT"
TARBALL="${INSTALL_ROOT}/${ZIG_NAME}.tar.xz"

echo "Downloading Zig ${ZIG_VERSION}..."
curl -fsSL -o "$TARBALL" "https://ziglang.org/download/${ZIG_VERSION}/${ZIG_NAME}.tar.xz"
echo "${ZIG_SHA256}  ${TARBALL}" | sha256sum -c -
tar -xf "$TARBALL" -C "$INSTALL_ROOT"
rm -f "$TARBALL"

"$ZIG_BIN" version >/dev/null
echo "Zig ${ZIG_VERSION} installed: ${ZIG_BIN}"
