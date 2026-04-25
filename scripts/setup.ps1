Write-Host "[CT] Installing dependencies..."
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Error "Install failed"; exit 1 }
Write-Host "[CT] Setup complete"
