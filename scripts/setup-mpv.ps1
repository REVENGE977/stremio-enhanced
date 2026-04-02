<#
.SYNOPSIS
    Downloads the latest MPV build for Windows into static/mpv/<platform>/.
.EXAMPLE
    .\scripts\setup-mpv.ps1
    .\scripts\setup-mpv.ps1 -Arch arm64
#>

param(
    [ValidateSet('x64', 'arm64')]
    [string]$Arch = $(if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' })
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

$ArchMap = @{
    'x64'   = @{ github = 'x86_64';  dir = 'win32-x64' }
    'arm64' = @{ github = 'aarch64'; dir = 'win32-arm64' }
}

$GithubArch = $ArchMap[$Arch].github
$TargetDir  = Join-Path $RepoRoot "static\mpv\$($ArchMap[$Arch].dir)"
$TempDir    = Join-Path $env:TEMP "stremio-enhanced-mpv-setup"

function Find-7Zip {
    $inPath = Get-Command '7z' -ErrorAction SilentlyContinue
    if ($inPath) { return $inPath.Source }

    $candidates = @(
        "${env:ProgramFiles}\7-Zip\7z.exe",
        "${env:ProgramFiles(x86)}\7-Zip\7z.exe",
        "${env:LOCALAPPDATA}\Programs\7-Zip\7z.exe"
    )

    if ($env:SCOOP) {
        $candidates += Join-Path $env:SCOOP 'apps\7zip\current\7z.exe'
    } else {
        $candidates += Join-Path $env:USERPROFILE 'scoop\apps\7zip\current\7z.exe'
    }

    foreach ($path in $candidates) {
        if (Test-Path $path) { return $path }
    }

    return $null
}

function Get-7ZipExtractor {
    $existing = Find-7Zip
    if ($existing) {
        Write-Host "  Found 7-Zip: $existing"
        return $existing
    }

    Write-Host "  7-Zip not found, downloading portable extractor..."
    $7zaPath = Join-Path $TempDir '7za.exe'

    if (-not (Test-Path $7zaPath)) {
        $7zaZip = Join-Path $TempDir '7za.zip'
        Invoke-WebRequest -Uri 'https://www.7-zip.org/a/7za920.zip' -OutFile $7zaZip -UseBasicParsing
        Expand-Archive -Path $7zaZip -DestinationPath $TempDir -Force
        Remove-Item $7zaZip -Force
    }

    if (-not (Test-Path $7zaPath)) {
        throw "Failed to obtain 7za.exe. Install 7-Zip manually: https://7-zip.org"
    }

    return $7zaPath
}

function Get-LatestMpvAsset {
    Write-Host "Querying GitHub for latest MPV release..."
    $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/shinchiro/mpv-winbuild-cmake/releases/latest' -UseBasicParsing
    $pattern = "^mpv-${GithubArch}-\d{8}-git-[0-9a-f]+\.7z$"

    $asset = $release.assets |
        Where-Object { $_.name -match $pattern } |
        Select-Object -First 1

    if (-not $asset) {
        throw "No MPV build found for $GithubArch. Assets: $($release.assets.name -join ', ')"
    }

    Write-Host "  Found: $($asset.name) ($([math]::Round($asset.size / 1MB, 1)) MB)"
    return $asset
}

Write-Host "`n=== Stremio Enhanced: MPV Setup (Windows $Arch) ===`n"

$existingMpv = Join-Path $TargetDir 'mpv.exe'
if (Test-Path $existingMpv) {
    Write-Host "mpv.exe already exists at: $existingMpv"
    $response = Read-Host "Overwrite? (y/N)"
    if ($response -notmatch '^[Yy]') {
        Write-Host "Skipped."
        exit 0
    }
}

if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

try {
    $asset = Get-LatestMpvAsset

    $archivePath = Join-Path $TempDir $asset.name
    Write-Host "Downloading $($asset.name)..."
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $archivePath -UseBasicParsing

    Write-Host "Extracting..."
    $extractDir = Join-Path $TempDir 'extracted'
    $sevenZip = Get-7ZipExtractor
    & $sevenZip x $archivePath "-o$extractDir" -y | Out-Null

    if ($LASTEXITCODE -ne 0) {
        throw "7-Zip extraction failed with exit code $LASTEXITCODE"
    }

    $mpvExe = Get-ChildItem -Path $extractDir -Filter 'mpv.exe' -Recurse | Select-Object -First 1
    if (-not $mpvExe) {
        throw "mpv.exe not found in extracted archive."
    }

    $sourceDir = $mpvExe.DirectoryName

    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }

    $filesToCopy = @('mpv.exe') + @(
        Get-ChildItem -Path $sourceDir -Filter '*.dll' | ForEach-Object { $_.Name }
    )

    $copied = @()
    foreach ($file in $filesToCopy) {
        $src = Join-Path $sourceDir $file
        if (Test-Path $src) {
            Copy-Item $src -Destination $TargetDir -Force
            $copied += $file
        }
    }

    Write-Host "`nDone! Copied to: $TargetDir"
    Write-Host "  Files: $($copied -join ', ')`n"

} finally {
    if (Test-Path $TempDir) {
        Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
