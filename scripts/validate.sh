#!/usr/bin/env sh
set -e

echo "[CT] Running validation..."
pnpm typecheck
pnpm test
pnpm lint
pnpm build

echo "[CT] Validation passed"
