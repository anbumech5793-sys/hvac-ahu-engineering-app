# SAFE CLEANUP SCRIPT FOR APFEL GLOBUS ENGINEERING OS
# Purpose: Move only unused duplicate/old files to src/archive.
# It does NOT permanently delete files.
# Run from your project root folder: pharma-hvac-app

Write-Host "\n=== Apfel Globus Safe Cleanup Started ===" -ForegroundColor Cyan

$Root = Get-Location
$Src = Join-Path $Root "src"
$Archive = Join-Path $Src "archive"

if (!(Test-Path $Src)) {
  Write-Host "ERROR: src folder not found. Please run this script inside your project root folder." -ForegroundColor Red
  exit 1
}

if (!(Test-Path $Archive)) {
  New-Item -ItemType Directory -Path $Archive | Out-Null
  Write-Host "Created src/archive folder" -ForegroundColor Green
}

# Core files that must NOT be moved
$KeepAlways = @(
  "App.jsx",
  "App.css",
  "main.jsx",
  "index.css",
  "authEngine.js",
  "license.js",
  "supabase.js",
  "EngineeringOSDashboard.jsx"
)

# Old / duplicate / experimental top-level src files to check.
# Script moves them ONLY if they are not imported anywhere else.
$Candidates = @(
  "AHUCalculator.jsx",
  "AHUSketch.jsx",
  "ashraeMasterEngine.js",
  "AuthScreen.jsx",
  "autoDesignEngine.js",
  "AutoDesignStudio.jsx",
  "AutoDuctRoutingDashboard.jsx",
  "autoDuctRoutingEngine.js",
  "BOMCalculator.jsx",
  "BOMEngine.jsx",
  "CADCanvas.jsx",
  "catalogEngine.js",
  "CoilCatalogDashboard.jsx",
  "coilCatalogEngine.js",
  "CoilEngine.jsx",
  "commercialEngine.js",
  "CompleteProjectDashboard.jsx",
  "DXFGenerator.jsx",
  "EngineeringDashboard.jsx",
  "engineeringEngine.js",
  "EngineeringStudio.jsx",
  "FanCatalogDashboard.jsx",
  "fanCatalogEngine.js",
  "FanCurve.jsx",
  "FanCurveEngine.jsx",
  "FilterCatalogDashboard.jsx",
  "filterCatalogEngine.js",
  "FinalEngineeringOS.jsx",
  "industryWizard.js",
  "manufacturerCatalogEngine.js",
  "MultiRoomDashboard.jsx",
  "multiRoomZoningEngine.js",
  "PDFReportEngine.js",
  "PressureLossDashboard.jsx",
  "pressureLossEngine.js",
  "professionalDesignBasisEngine.js",
  "professionalHeatLoadEngine.js",
  "ProfessionalHVACPlatform.jsx",
  "ProfessionalProjectInputDashboard.jsx",
  "professionalPsychrometricEngine.js",
  "projectDataEngine.js",
  "ProjectManager.jsx",
  "PsychrometricChart.jsx",
  "PsychrometricEngine.jsx",
  "psychrometricMasterEngine.js",
  "PumpCatalogDashboard.jsx",
  "pumpCatalogEngine.js",
  "RealCADEngine.jsx",
  "RealPsychrometricChart.jsx",
  "recoveryMasterEngine.js",
  "reportEngine.js",
  "roomIntelligenceEngine.js",
  "standardsEngine.js"
)

$Moved = @()
$Kept = @()
$Missing = @()

foreach ($file in $Candidates) {
  $path = Join-Path $Src $file

  if (!(Test-Path $path)) {
    $Missing += $file
    continue
  }

  if ($KeepAlways -contains $file) {
    $Kept += "$file  (core file)"
    continue
  }

  $base = [System.IO.Path]::GetFileNameWithoutExtension($file)

  # Search all JS/JSX files in src except archive and the file itself
  $matches = Get-ChildItem -Path $Src -Recurse -Include *.js,*.jsx |
    Where-Object { $_.FullName -notlike "*$([IO.Path]::DirectorySeparatorChar)archive$([IO.Path]::DirectorySeparatorChar)*" -and $_.FullName -ne $path } |
    Select-String -Pattern $base -SimpleMatch -ErrorAction SilentlyContinue

  if ($matches.Count -eq 0) {
    Move-Item -Path $path -Destination (Join-Path $Archive $file) -Force
    $Moved += $file
    Write-Host "MOVED to archive: $file" -ForegroundColor Yellow
  } else {
    $Kept += "$file  (used/imported somewhere)"
    Write-Host "KEPT because used: $file" -ForegroundColor Green
  }
}

Write-Host "\n=== Cleanup Summary ===" -ForegroundColor Cyan
Write-Host "Moved to src/archive:" -ForegroundColor Yellow
$Moved | ForEach-Object { Write-Host " - $_" }

Write-Host "\nKept:" -ForegroundColor Green
$Kept | ForEach-Object { Write-Host " - $_" }

Write-Host "\nNow run:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor White
Write-Host "\nIf app works, commit changes:" -ForegroundColor Cyan
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'safe cleanup old duplicate files'" -ForegroundColor White
Write-Host "git push origin main" -ForegroundColor White

Write-Host "\nIMPORTANT: This script does not delete files. It only moves unused files to src/archive." -ForegroundColor Magenta
