param(
  [string]$Version,
  [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Get-CurrentVersion {
  (Get-Content package.json -Raw | ConvertFrom-Json).version
}

function Get-NextPatchVersion([string]$currentVersion) {
  $parts = $currentVersion.Split('.')
  if ($parts.Count -ne 3) {
    throw "Unsupported version format: $currentVersion"
  }

  $parts[2] = ([int]$parts[2] + 1).ToString()
  return ($parts -join '.')
}

$currentVersion = Get-CurrentVersion
if ([string]::IsNullOrWhiteSpace($Version)) {
  $Version = Get-NextPatchVersion $currentVersion
}

if ($Version -eq $currentVersion) {
  throw "Version $Version is already active. Pass a newer version or omit -Version to bump patch automatically."
}

Write-Host "Bumping version: $currentVersion -> $Version"
& npm.cmd version $Version --no-git-tag-version
if ($LASTEXITCODE -ne 0) {
  throw "npm version failed."
}

if (-not $NoBuild) {
  Write-Host "Building installer..."
  & npm.cmd run dist
  if ($LASTEXITCODE -ne 0) {
    throw "npm run dist failed."
  }
}

Write-Host "Committing and pushing to GitHub..."
git add -A
git commit -m "chore: bump version to $Version"
if ($LASTEXITCODE -ne 0) {
  throw "git commit failed."
}

git push origin main
if ($LASTEXITCODE -ne 0) {
  throw "git push failed."
}

Write-Host "Done. Version $Version is pushed to origin/main."
