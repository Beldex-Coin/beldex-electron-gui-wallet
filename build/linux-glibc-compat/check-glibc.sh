#!/usr/bin/env bash
# Fails if any ELF file (executable, .so, .node) under a packaged Linux app
# needs a newer glibc than MAX_GLIBC. Ubuntu 20.04 ships glibc 2.31, so the
# default keeps the build installable on Ubuntu 20.04 / 22.04 / 24.04.
#
# Usage: check-glibc.sh <dir> [max-glibc]
#   e.g. check-glibc.sh dist/electron/Packaged/linux-unpacked
set -euo pipefail

DIR="${1:?Usage: $0 <dir> [max-glibc]}"
MAX_GLIBC="${2:-2.31}"

if ! command -v objdump >/dev/null; then
  echo "objdump not found (install binutils)" >&2
  exit 1
fi

failed=0
while IFS= read -r -d '' file; do
  # Only look at ELF files; skips scripts, .pak, asar, etc. cheaply.
  [ "$(head -c 4 "$file" | od -An -c | tr -d ' ')" = "177ELF" ] || continue

  needed="$(objdump -T "$file" 2>/dev/null |
    grep -o 'GLIBC_[0-9][0-9.]*' | sed 's/GLIBC_//' | sort -uV | tail -1 || true)"
  [ -n "$needed" ] || continue

  highest="$(printf '%s\n%s\n' "$needed" "$MAX_GLIBC" | sort -V | tail -1)"
  if [ "$highest" = "$MAX_GLIBC" ]; then
    printf 'OK    glibc %-5s %s\n' "$needed" "${file#"$DIR"/}"
  else
    printf 'FAIL  glibc %-5s %s\n' "$needed" "${file#"$DIR"/}"
    failed=1
  fi
done < <(find "$DIR" -type f \( -perm -u+x -o -name '*.so*' -o -name '*.node' \) -print0)

if [ "$failed" = 1 ]; then
  echo "Some files need glibc newer than ${MAX_GLIBC}; the build would not run on Ubuntu 20.04." >&2
  exit 1
fi
echo "All ELF files need glibc <= ${MAX_GLIBC}."
