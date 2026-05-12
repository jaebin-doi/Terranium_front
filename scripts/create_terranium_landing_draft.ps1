Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "design\drafts\landing-page"
$slideOutDir = Join-Path $outDir "source_light_slides_renamed"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $slideOutDir | Out-Null

$slideDir = Join-Path $root "design\assets\images\generated\회사소개서_슬라이드_Light"
$slides = Get-ChildItem $slideDir -Filter "*.png" | Sort-Object Name

$slideNames = @(
  "company_profile",
  "about_doi_platform",
  "doi_strength_metrics",
  "drone_and_sensors",
  "ai_infrastructure",
  "drone_mapping_workflow",
  "terranium_platform_overview",
  "public_infrastructure_references"
)

for ($i = 0; $i -lt $slides.Count; $i++) {
  $target = Join-Path $slideOutDir ("light_slide_{0:D2}_{1}.png" -f ($i + 1), $slideNames[$i])
  Copy-Item -LiteralPath $slides[$i].FullName -Destination $target -Force
}

$renamedSlides = Get-ChildItem $slideOutDir -Filter "*.png" | Sort-Object Name

$W = 1920
$H = 5200
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Color($hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush((Color $hex))
}

function PenC($hex, $w = 1) {
  return New-Object System.Drawing.Pen((Color $hex), $w)
}

function FontF($size, $style = [System.Drawing.FontStyle]::Regular) {
  return New-Object System.Drawing.Font("Malgun Gothic", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function RectPath($x, $y, $w, $h, $r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function FillRound($x, $y, $w, $h, $r, $fill, $stroke = $null, $sw = 1) {
  $path = RectPath $x $y $w $h $r
  $g.FillPath((Brush $fill), $path)
  if ($stroke) { $g.DrawPath((PenC $stroke $sw), $path) }
  $path.Dispose()
}

function Text($s, $x, $y, $w, $h, $size, $color, $style = [System.Drawing.FontStyle]::Regular, $align = "Near") {
  $font = FontF $size $style
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::$align
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Near
  $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $g.DrawString($s, $font, (Brush $color), $rect, $fmt)
  $font.Dispose()
  $fmt.Dispose()
}

function Line($x1, $y1, $x2, $y2, $hex, $w = 1) {
  $g.DrawLine((PenC $hex $w), $x1, $y1, $x2, $y2)
}

function DrawImageFit($path, $x, $y, $w, $h, $mode = "cover") {
  $img = [System.Drawing.Image]::FromFile($path)
  $scaleW = $w / $img.Width
  $scaleH = $h / $img.Height
  $scale = if ($mode -eq "contain") { [Math]::Min($scaleW, $scaleH) } else { [Math]::Max($scaleW, $scaleH) }
  $dw = [int]($img.Width * $scale)
  $dh = [int]($img.Height * $scale)
  $dx = [int]($x + ($w - $dw) / 2)
  $dy = [int]($y + ($h - $dh) / 2)
  $g.DrawImage($img, $dx, $dy, $dw, $dh)
  $img.Dispose()
}

function ImageCard($path, $x, $y, $w, $h, $label) {
  FillRound $x $y $w $h 18 "#ffffff" "#d9e7f5" 2
  DrawImageFit $path ($x + 18) ($y + 18) ($w - 36) ($h - 72) "contain"
  Text $label ($x + 24) ($y + $h - 44) ($w - 48) 28 22 "#16324f" ([System.Drawing.FontStyle]::Bold)
}

$g.Clear((Color "#f7fbff"))

# Soft geometric background bands
$g.FillRectangle((Brush "#e8f4ff"), 0, 0, $W, 780)
$g.FillEllipse((Brush "#d5eef8"), -220, 60, 580, 580)
$g.FillEllipse((Brush "#cce7ff"), 1460, -140, 620, 620)
$g.FillRectangle((Brush "#ffffff"), 0, 780, $W, 4420)

# Navigation
Text "DOI Inc.  |  Terranium" 120 54 440 42 28 "#0b4c8c" ([System.Drawing.FontStyle]::Bold)
Text "Platform   Workflow   Trust   Roadmap" 1220 58 580 34 21 "#4c6478"
Line 120 116 1800 116 "#c8def2" 2

# Hero
Text "Terranium" 120 182 760 92 82 "#081d34" ([System.Drawing.FontStyle]::Bold)
Text "Spatial AI Digital Twin Platform" 124 286 760 62 42 "#0b7fca" ([System.Drawing.FontStyle]::Bold)
Text "드론 측량 데이터, 2D/3D 디지털 트윈, GeoAI 분석, 검수 워크플로우, 보고서 자동화를 하나의 안전 점검 운영 흐름으로 연결합니다." 124 370 760 132 30 "#20384d"
FillRound 124 540 260 64 16 "#087fd3" $null 1
Text "Request Pilot" 124 554 260 44 25 "#ffffff" ([System.Drawing.FontStyle]::Bold) "Center"
FillRound 408 540 330 64 16 "#ffffff" "#9cc9ed" 2
Text "View Platform Scope" 408 554 330 44 25 "#0b4c8c" ([System.Drawing.FontStyle]::Bold) "Center"

FillRound 910 170 820 500 24 "#ffffff" "#c9deee" 2
DrawImageFit $renamedSlides[6].FullName 936 196 768 386 "contain"
Text "Level 4 digital twin analysis, prediction, and reporting experience" 944 596 744 42 24 "#16324f" ([System.Drawing.FontStyle]::Bold) "Center"

# Metrics strip
$metricY = 750
$metrics = @(
  @("100+", "정부·공공 검증"),
  @("1,500km²+", "누적 촬영 면적"),
  @("GSD 3~5cm", "초정밀 항공측량"),
  @("0%", "외부 클라우드 의존"),
  @("Level 4", "디지털트윈 분석")
)
for ($i = 0; $i -lt $metrics.Count; $i++) {
  $x = 120 + $i * 340
  FillRound $x $metricY 300 126 18 "#ffffff" "#d8e7f5" 2
  Text $metrics[$i][0] ($x + 22) ($metricY + 22) 256 42 34 "#087fd3" ([System.Drawing.FontStyle]::Bold) "Center"
  Text $metrics[$i][1] ($x + 22) ($metricY + 70) 256 34 21 "#4b6072" ([System.Drawing.FontStyle]::Regular) "Center"
}

# Problem / positioning
Text "Why Terranium" 120 980 420 46 34 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "분산된 드론·공간 데이터를 검수 가능한 의사결정 자산으로 전환" 120 1040 1320 70 38 "#101f2f" ([System.Drawing.FontStyle]::Bold)
Text "기존 GIS, 3D 뷰어, 드론 데이터 관리 도구의 단절을 넘어 데이터 등록, 시각화, 분석, 승인, 보고서를 연결하는 업무형 플랫폼입니다." 120 1120 1120 74 28 "#34495c"

$cards = @(
  @("01", "Project Data Hub", "정사영상, LiDAR, Point Cloud, DEM/DSM, 현장 사진을 프로젝트 단위로 통합 관리"),
  @("02", "2D/3D Digital Twin", "MapLibre·Cesium 기반 Web GIS와 3D Tiles, Point Cloud, 레이어 패널 제공"),
  @("03", "GeoAI Inspection", "균열 또는 도로 손상 등 대표 모델 결과를 지도 레이어와 테이블로 검수"),
  @("04", "Report Automation", "승인된 분석 결과, 지도 캡처, 검수 의견을 보고서 초안으로 자동 생성")
)
for ($i = 0; $i -lt 4; $i++) {
  $x = 120 + ($i % 2) * 850
  $y = 1250 + [Math]::Floor($i / 2) * 220
  FillRound $x $y 780 170 18 "#ffffff" "#dbe8f3" 2
  Text $cards[$i][0] ($x + 28) ($y + 28) 72 44 32 "#087fd3" ([System.Drawing.FontStyle]::Bold)
  Text $cards[$i][1] ($x + 118) ($y + 28) 590 38 28 "#132b42" ([System.Drawing.FontStyle]::Bold)
  Text $cards[$i][2] ($x + 118) ($y + 76) 600 68 23 "#53697b"
}

# Workflow
Text "Operating Workflow" 120 1760 680 46 34 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "Acquisition → Processing → Quality → Decision → Deliverables" 120 1820 1480 70 38 "#101f2f" ([System.Drawing.FontStyle]::Bold)
ImageCard $renamedSlides[5].FullName 120 1930 800 510 "Drone Mapping: GSD 3-5cm, four-step workflow"
ImageCard $renamedSlides[1].FullName 1000 1930 800 510 "End-to-end Spatial AI stack"

# Platform modules
Text "Platform Experience" 120 2590 720 46 34 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "고객 데모와 파일럿 운영을 분리한 현실적인 구축형 우선 제품 구조" 120 2650 1500 70 38 "#101f2f" ([System.Drawing.FontStyle]::Bold)
$moduleY = 2760
$mods = @(
  @("Dashboard", "운영 현황, 위험 알림, 최근 보고서"),
  @("Digital Twin Viewer", "2D/3D 전환, 레이어, 측정 도구"),
  @("Drone Mission QC", "촬영 구역, GCP/CP, RTK 기준 정보"),
  @("GeoAI Review", "결과 레이어, 신뢰도, 오탐·누락 검수"),
  @("Data Governance", "권한, 반출 이력, 보관 정책"),
  @("Report Builder", "승인 결과 기반 PDF 보고서")
)
for ($i = 0; $i -lt 6; $i++) {
  $x = 120 + ($i % 3) * 570
  $y = $moduleY + [Math]::Floor($i / 3) * 160
  FillRound $x $y 520 118 16 "#f9fcff" "#d6e7f5" 2
  Text $mods[$i][0] ($x + 26) ($y + 22) 470 32 26 "#132b42" ([System.Drawing.FontStyle]::Bold)
  Text $mods[$i][1] ($x + 26) ($y + 62) 460 38 21 "#5a6f80"
}
ImageCard $renamedSlides[2].FullName 120 3150 520 330 "Five quantified DOI strengths"
ImageCard $renamedSlides[3].FullName 700 3150 520 330 "19 drones and 8 sensor types"
ImageCard $renamedSlides[4].FullName 1280 3150 520 330 "Private AI infrastructure"

# Trust section
$trustY = 3640
$g.FillRectangle((Brush "#eef7ff"), 0, $trustY, $W, 760)
Text "Company Trust" 120 ($trustY + 90) 560 46 34 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "한국 핵심 인프라 데이터로 검증된 DOI의 현장 역량" 120 ($trustY + 150) 1020 70 38 "#101f2f" ([System.Drawing.FontStyle]::Bold)
Text "국토·공공·시설 레퍼런스와 자체 데이터센터, DGX H100 기반 AI 인프라를 바탕으로 외부 클라우드 의존 없이 고객 데이터 주권을 지향합니다." 120 ($trustY + 230) 850 90 27 "#34495c"
ImageCard $renamedSlides[0].FullName 1060 ($trustY + 80) 740 330 "Company profile"
ImageCard $renamedSlides[7].FullName 120 ($trustY + 382) 800 300 "Public and government references"
FillRound 1000 ($trustY + 450) 800 180 18 "#ffffff" "#c8dff0" 2
Text "Positioning" 1034 ($trustY + 482) 250 32 25 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "Web GIS / 3D Digital Twin · Drone Mapping · GeoAI Inspection · Data Governance" 1034 ($trustY + 526) 716 76 28 "#132b42" ([System.Drawing.FontStyle]::Bold)

# Roadmap
Text "Pragmatic MVP Roadmap" 120 4530 700 46 34 "#087fd3" ([System.Drawing.FontStyle]::Bold)
Text "기술 리스크 검증 후 고객 데모와 파일럿 운영을 단계적으로 완성" 120 4590 1500 70 38 "#101f2f" ([System.Drawing.FontStyle]::Bold)
$road = @(
  @("Phase 0", "2-3 weeks", "COG, 3D Tiles, Point Cloud, PDF capture, GeoAI result layer PoC"),
  @("MVP-A", "8 weeks", "Customer demo: dashboard, project, 2D/3D viewer, basic review, sample PDF"),
  @("MVP-B / Pilot", "16 weeks", "Real customer data: chunk upload, processing queue, GeoAI execution, approval, audit log")
)
for ($i = 0; $i -lt 3; $i++) {
  $x = 120 + $i * 570
  FillRound $x 4710 520 250 18 "#ffffff" "#d7e6f2" 2
  Text $road[$i][0] ($x + 28) 4740 220 38 30 "#132b42" ([System.Drawing.FontStyle]::Bold)
  Text $road[$i][1] ($x + 28) 4784 220 32 24 "#087fd3" ([System.Drawing.FontStyle]::Bold)
  Text $road[$i][2] ($x + 28) 4834 456 92 23 "#51697c"
}
Line 120 5060 1800 5060 "#c8def2" 2
Text "Terranium · DOI Inc. · B2B Spatial AI Platform for Industrial and Public Facility Safety Inspection" 120 5090 1680 44 24 "#51697c" ([System.Drawing.FontStyle]::Regular) "Center"

$outPng = Join-Path $outDir "terranium_landing_page_concept_desktop.png"
$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

$manifest = @"
Terranium Landing Page Design Draft

Generated asset:
- terranium_landing_page_concept_desktop.png

Renamed source slide copies:
- source_light_slides_renamed/light_slide_01_company_profile.png
- source_light_slides_renamed/light_slide_02_about_doi_platform.png
- source_light_slides_renamed/light_slide_03_doi_strength_metrics.png
- source_light_slides_renamed/light_slide_04_drone_and_sensors.png
- source_light_slides_renamed/light_slide_05_ai_infrastructure.png
- source_light_slides_renamed/light_slide_06_drone_mapping_workflow.png
- source_light_slides_renamed/light_slide_07_terranium_platform_overview.png
- source_light_slides_renamed/light_slide_08_public_infrastructure_references.png

Message hierarchy:
- Terranium connects drone mapping data, 2D/3D digital twins, GeoAI inspection, review/approval, and report automation.
- Initial target: industrial and public facility safety inspection.
- Deployment posture: single-customer pilot first, extensible to SaaS/multi-tenant operations later.
"@
$manifestPath = Join-Path $outDir "design_manifest.txt"
Set-Content -Path $manifestPath -Value $manifest -Encoding UTF8

Write-Output $outPng
