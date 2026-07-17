#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${BELDEX_LINUX_BUILD_IMAGE:-beldex-electron-wallet-linux-compat}"
BUILD_SCRIPT="${1:-build}"

case "$BUILD_SCRIPT" in
  build|release)
    ;;
  *)
    echo "Usage: $0 [build|release]" >&2
    exit 1
    ;;
esac

mkdir -p "${HOME}/.cache/electron" "${HOME}/.cache/electron-builder"

docker build \
  -f "${PROJECT_DIR}/build/linux-compat.Dockerfile" \
  -t "${IMAGE_NAME}" \
  "${PROJECT_DIR}"

docker run --rm \
  -e ELECTRON_CACHE="/root/.cache/electron" \
  -e ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -e GH_TOKEN="${GH_TOKEN:-}" \
  -v "${PROJECT_DIR}:/project" \
  -v "${HOME}/.cache/electron:/root/.cache/electron" \
  -v "${HOME}/.cache/electron-builder:/root/.cache/electron-builder" \
  -w /project \
  "${IMAGE_NAME}" \
  bash -lc "npm install && npm run ${BUILD_SCRIPT}"
