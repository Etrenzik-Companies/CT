$ErrorActionPreference = "Stop"

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$upstream = cmd /c "git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>nul"
if (-not $upstream) {
    $upstream = "(no upstream configured)"
}

$latestCommit = (git log -1 --oneline).Trim()
$statusLines = git status --short --branch

git merge-base --is-ancestor phase6-rwa-xrpl-pof-funding-v1 main
$tagReachable = if ($LASTEXITCODE -eq 0) { "yes" } else { "no" }

Write-Host "[CT] Current branch: $branch"
Write-Host "[CT] Upstream branch: $upstream"
Write-Host "[CT] Latest commit: $latestCommit"
Write-Host "[CT] Phase 6 tag reachable from main: $tagReachable"
Write-Host "[CT] Working tree status:"

if ($statusLines) {
    $statusLines | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "## $branch"
}