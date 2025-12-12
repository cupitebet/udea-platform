<#
.SYNOPSIS
  Install Node LTS (and optionally Docker) and optionally start the dev server.

.USAGE
  # Install Node only
  .\install-node.ps1

  # Install Node and Docker
  .\install-node.ps1 -InstallDocker

  # After Node is installed and you re-open PowerShell, run dev server:
  .\install-node.ps1 -StartDev

.PARAMETER InstallDocker
  Install Docker Desktop (optional). Requires virtualization/WSL2 on Windows.

.PARAMETER StartDev
  Run 'npm install' and 'npm run dev' in the project root (F:\UDEA) after Node is present.
#>

param(
  [switch]$InstallDocker,
  [switch]$StartDev
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

$projectPath = "F:\UDEA"

# Helpers
function Command-Exists($cmd){
  return (Get-Command $cmd -ErrorAction SilentlyContinue) -ne $null
}

# 1. Check node
if (Command-Exists "node") {
  Write-Info "Node sudah terpasang: $(node -v)"
} else {
  Write-Info "Node tidak ditemukan."
  if (Command-Exists "winget") {
    Write-Info "Menggunakan winget untuk memasang Node LTS..."
    try {
      winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
    } catch {
      Write-Warn "winget gagal memasang Node. Silakan jalankan installer dari https://nodejs.org (LTS)."
    }
    Write-Info "Jika instalasi berhasil, TUTUP dan BUKA kembali PowerShell agar PATH diperbarui."
    Write-Info "Setelah membuka ulang terminal, jalankan skrip ini lagi dengan -StartDev untuk melanjutkan."
    exit 0
  } else {
    Write-Warn "Winget tidak tersedia. Silakan unduh installer MSI dari https://nodejs.org dan pasang (pilih LTS)."
    Write-Info "Setelah memasang Node, buka ulang PowerShell dan jalankan skrip ini lagi dengan -StartDev."
    exit 0
  }
}

# 2. Optionally install Docker
if ($InstallDocker) {
  if (Command-Exists "docker") {
    Write-Info "Docker sudah terpasang: $(docker --version)"
  } else {
    if (Command-Exists "winget") {
      Write-Info "Menginstal Docker Desktop via winget..."
      try {
        winget install --id Docker.DockerDesktop -e --accept-package-agreements --accept-source-agreements
        Write-Info "Docker Desktop diinstal. Ikuti instruksi installer (mungkin perlu restart atau enable WSL2)."
      } catch {
        Write-Warn "Gagal memasang Docker via winget. Silakan instal manual dari https://www.docker.com/products/docker-desktop"
      }
    } else {
      Write-Warn "winget tidak tersedia — silakan instal Docker Desktop manual: https://www.docker.com/products/docker-desktop"
    }
    Write-Info "Setelah instalasi Docker, buka ulang PowerShell dan verifikasi dengan: docker --version"
    # do not exit; continue
  }
}

# 3. Optionally start dev server
if ($StartDev) {
  if (-Not (Command-Exists "npm")) {
    Write-Err "npm tidak ditemukan — pastikan Anda sudah menutup dan membuka ulang PowerShell setelah memasang Node."
    Write-Info "Jalankan 'node -v' dan 'npm -v' untuk memverifikasi."
    exit 1
  }

  Write-Info "Memulai instalasi dependensi dan dev server di $projectPath"
  if (-Not (Test-Path $projectPath)) {
    Write-Err "Project path tidak ditemukan: $projectPath. Pastikan proyek ada di lokasi itu."
    exit 1
  }

  Push-Location $projectPath

  Write-Info "Menjalankan: npm install"
  $installSucceeded = $false
  try {
    npm install
    $installSucceeded = $true
  } catch {
    Write-Warn "npm install gagal, mencoba kembali dengan --legacy-peer-deps..."
    try {
      npm install --legacy-peer-deps
      $installSucceeded = $true
    } catch {
      Write-Err "npm install dengan --legacy-peer-deps juga gagal. Lihat log di atas untuk detail."
    }
  }

  if ($installSucceeded) {
    Write-Info "Menjalankan: npm run dev"
    try {
      npm run dev
    } catch {
      Write-Warn "npm run dev gagal. Cek log di atas untuk detail."
    }
  } else {
    Write-Err "Dependensi gagal diinstal. Tidak dapat menjalankan dev server."
  }

  Pop-Location
  exit 0
}

Write-Info "Selesai. Jika Anda baru saja memasang Node, TUTUP dan BUKA ulang PowerShell lalu jalankan skrip ini lagi dengan -StartDev untuk menginstall dependensi dan menjalankan dev server."