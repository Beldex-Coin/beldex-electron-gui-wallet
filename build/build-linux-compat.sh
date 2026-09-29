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

# node_modules is masked with its own anonymous volume rather than left
# inside the /project bind mount: without this, `npm install` here would
# overwrite the host's node_modules (electron, better-sqlite3, and every
# other native module) with Linux builds, breaking `npm run dev` on a
# macOS/Windows developer's checkout until they reinstall.
docker run --rm \
  -e ELECTRON_CACHE="/root/.cache/electron" \
  -e ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -e GH_TOKEN="${GH_TOKEN:-}" \
  -v "${PROJECT_DIR}:/project" \
  -v "${HOME}/.cache/electron:/root/.cache/electron" \
  -v "${HOME}/.cache/electron-builder:/root/.cache/electron-builder" \
  -v /project/node_modules \
  -w /project \
  "${IMAGE_NAME}" \
  bash -lc "npm install && npm run ${BUILD_SCRIPT}"
