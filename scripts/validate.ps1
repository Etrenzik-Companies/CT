Write-Host "[CT] Running validation..."
pnpm typecheck
if ($LASTEXITCODE -ne 0) { exit 1 }
pnpm test
if ($LASTEXITCODE -ne 0) { exit 1 }
pnpm lint
if ($LASTEXITCODE -ne 0) { exit 1 }
pnpm build
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "[CT] Validation passed"
