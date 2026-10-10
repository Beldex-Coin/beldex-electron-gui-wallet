#!/usr/bin/env bash
# Compiler wrapper used as CC/CXX by before-pack.js: `zig cc` / `zig c++`
# targeting an old glibc, so the resulting .node only needs symbols that
# Ubuntu 20.04 provides.
#
# Usage: zig-wrapper.sh <cc|c++> [compiler args...]
# Env:   ZIG (path to zig binary), GLIBC_TARGET (e.g. 2.31)
set -euo pipefail

MODE="$1"
shift

args=()
is_addon_link=0
for arg in "$@"; do
  # GNU ld only; zig's lld rejects it. Symbol hiding is done by the
  # version script below instead.
  [ "$arg" = "-Wl,--exclude-libs,ALL" ] && continue
  case "$arg" in
    *better_sqlite3.node) is_addon_link=1 ;;
  esac
  args+=("$arg")
done

# Match the official prebuild: export only the N-API entry points
# (not the ~280 bundled sqlite3_* symbols) and strip the output.
if [ "$is_addon_link" = 1 ]; then
  args+=("-Wl,--version-script=$(dirname "$0")/napi-exports.map" "-s")
fi

exec "${ZIG:-zig}" "$MODE" -target "x86_64-linux-gnu.${GLIBC_TARGET:-2.31}" "${args[@]}"
