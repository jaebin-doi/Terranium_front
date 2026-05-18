Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "apps\web\public\assets\project-create\dataset-icons"
$aliasDir = Join-Path $root "apps\web\public\assets\project-create\dataset"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $aliasDir | Out-Null

$size = 1024
$primary = [System.Drawing.Color]::FromArgb(238, 222, 232, 241)
$secondary = [System.Drawing.Color]::FromArgb(180, 142, 160, 174)
$accent = [System.Drawing.Color]::FromArgb(235, 255, 193, 7)

function New-Canvas {
  $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  return @{ Bitmap = $bmp; Graphics = $g }
}

function New-Pen($color, $width) {
  $pen = New-Object System.Drawing.Pen($color, $width)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  return $pen
}

function Save-Icon($canvas, $name) {
  $path = Join-Path $outDir $name
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Bitmap.Dispose()
}

function Draw-Orthomosaic {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $primary 42
  $p2 = New-Pen $secondary 26
  $brush = New-Object System.Drawing.SolidBrush($primary)

  $g.DrawRectangle($p, 198, 360, 628, 372)
  $g.DrawRectangle($p2, 330, 286, 212, 82)
  $g.DrawLine($p2, 230, 360, 294, 286)
  $g.DrawLine($p2, 694, 360, 760, 286)
  $g.DrawEllipse($p, 360, 410, 304, 304)
  $g.DrawEllipse($p2, 442, 492, 140, 140)
  $g.FillEllipse($brush, 668, 420, 48, 48)

  $p.Dispose(); $p2.Dispose(); $brush.Dispose()
  Save-Icon $c "orthomosaic-camera.png"
}

function Draw-PointCloud {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $secondary 18
  $brush1 = New-Object System.Drawing.SolidBrush($primary)
  $brush2 = New-Object System.Drawing.SolidBrush($secondary)
  $points = @(
    @(302,352,28), @(418,306,22), @(538,318,26), @(662,368,24),
    @(236,488,24), @(356,454,30), @(480,444,22), @(608,468,31), @(748,506,22),
    @(286,642,26), @(418,602,24), @(536,642,32), @(664,620,24), @(766,682,20),
    @(378,760,18), @(512,738,24), @(632,772,18)
  )
  foreach ($pt in $points) {
    $brush = if ($pt[2] -ge 26) { $brush1 } else { $brush2 }
    $g.FillEllipse($brush, $pt[0] - $pt[2], $pt[1] - $pt[2], $pt[2] * 2, $pt[2] * 2)
  }
  $lines = @(
    @(302,352,418,306), @(418,306,538,318), @(538,318,662,368),
    @(302,352,356,454), @(356,454,480,444), @(480,444,608,468),
    @(608,468,748,506), @(236,488,356,454), @(286,642,418,602),
    @(418,602,536,642), @(536,642,664,620), @(664,620,766,682),
    @(378,760,512,738), @(512,738,632,772), @(418,602,512,738)
  )
  foreach ($l in $lines) { $g.DrawLine($p, $l[0], $l[1], $l[2], $l[3]) }
  $p.Dispose(); $brush1.Dispose(); $brush2.Dispose()
  Save-Icon $c "point-cloud-lidar.png"
}

function Draw-Mesh3D {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $primary 34
  $p2 = New-Pen $secondary 24
  $front = @(
    [System.Drawing.Point]::new(304, 392),
    [System.Drawing.Point]::new(512, 286),
    [System.Drawing.Point]::new(720, 392),
    [System.Drawing.Point]::new(720, 636),
    [System.Drawing.Point]::new(512, 756),
    [System.Drawing.Point]::new(304, 636)
  )
  $g.DrawPolygon($p, $front)
  $g.DrawLine($p2, 304, 392, 512, 512)
  $g.DrawLine($p2, 720, 392, 512, 512)
  $g.DrawLine($p2, 720, 636, 512, 512)
  $g.DrawLine($p2, 512, 756, 512, 512)
  $g.DrawLine($p2, 304, 636, 512, 512)
  $g.DrawLine($p2, 304, 392, 304, 636)
  $g.DrawLine($p2, 512, 286, 512, 512)
  $g.DrawLine($p2, 720, 392, 720, 636)
  $p.Dispose(); $p2.Dispose()
  Save-Icon $c "mesh-3d-textured.png"
}

function Draw-DsmDem {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $primary 34
  $p2 = New-Pen $secondary 22
  $poly = @(
    [System.Drawing.Point]::new(210, 660),
    [System.Drawing.Point]::new(428, 372),
    [System.Drawing.Point]::new(568, 536),
    [System.Drawing.Point]::new(718, 330),
    [System.Drawing.Point]::new(844, 660),
    [System.Drawing.Point]::new(516, 794)
  )
  $g.DrawPolygon($p, $poly)
  $g.DrawLine($p2, 210, 660, 516, 794)
  $g.DrawLine($p2, 428, 372, 516, 794)
  $g.DrawLine($p2, 568, 536, 516, 794)
  $g.DrawLine($p2, 718, 330, 516, 794)
  $g.DrawLine($p2, 844, 660, 516, 794)
  $g.DrawLine($p2, 428, 372, 568, 536)
  $g.DrawLine($p2, 568, 536, 718, 330)
  $g.DrawLine($p2, 210, 660, 568, 536)
  $g.DrawLine($p2, 568, 536, 844, 660)
  $p.Dispose(); $p2.Dispose()
  Save-Icon $c "dsm-dem-terrain.png"
}

function Draw-GeoAi {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $primary 34
  $p2 = New-Pen $secondary 22
  $brush = New-Object System.Drawing.SolidBrush($accent)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddBezier(506, 232, 356, 226, 284, 334, 316, 452)
  $path.AddBezier(242, 488, 250, 638, 380, 668, 414, 766)
  $path.AddBezier(456, 884, 594, 858, 590, 720, 694, 698)
  $path.AddBezier(842, 666, 836, 486, 728, 454, 764, 326)
  $path.AddBezier(764, 326, 712, 226, 586, 218, 506, 232)
  $g.DrawPath($p, $path)
  $g.DrawLine($p2, 506, 236, 506, 796)
  $g.DrawBezier($p2, 506, 346, 426, 342, 390, 420, 338, 424)
  $g.DrawBezier($p2, 506, 466, 584, 452, 612, 390, 712, 374)
  $g.DrawBezier($p2, 506, 584, 426, 584, 398, 650, 418, 742)
  $g.DrawBezier($p2, 506, 628, 616, 610, 666, 674, 640, 760)
  $g.FillEllipse($brush, 486, 360, 40, 40)
  $g.FillEllipse($brush, 596, 518, 34, 34)
  $g.FillEllipse($brush, 390, 528, 34, 34)
  $path.Dispose(); $p.Dispose(); $p2.Dispose(); $brush.Dispose()
  Save-Icon $c "geoai-detection.png"
}

function Draw-ReportTemplate {
  $c = New-Canvas
  $g = $c.Graphics
  $p = New-Pen $primary 34
  $p2 = New-Pen $secondary 24
  $points = @(
    [System.Drawing.Point]::new(316, 216),
    [System.Drawing.Point]::new(624, 216),
    [System.Drawing.Point]::new(748, 340),
    [System.Drawing.Point]::new(748, 808),
    [System.Drawing.Point]::new(316, 808)
  )
  $g.DrawPolygon($p, $points)
  $g.DrawLine($p, 316, 808, 316, 216)
  $g.DrawLine($p, 624, 216, 624, 340)
  $g.DrawLine($p, 624, 340, 748, 340)
  $g.DrawLine($p2, 396, 456, 666, 456)
  $g.DrawLine($p2, 396, 548, 666, 548)
  $g.DrawLine($p2, 396, 640, 568, 640)
  $g.DrawLine($p2, 396, 716, 646, 716)
  $p.Dispose(); $p2.Dispose()
  Save-Icon $c "report-template.png"
}

Draw-Orthomosaic
Draw-PointCloud
Draw-Mesh3D
Draw-DsmDem
Draw-GeoAi
Draw-ReportTemplate

$aliases = @{
  "orthomosaic-camera.png" = "orthomosaic.png"
  "point-cloud-lidar.png" = "point-cloud.png"
  "mesh-3d-textured.png" = "3d-mesh.png"
  "dsm-dem-terrain.png" = "dsm-dem.png"
  "geoai-detection.png" = "geoai.png"
  "report-template.png" = "report.png"
}

foreach ($sourceName in $aliases.Keys) {
  Copy-Item -LiteralPath (Join-Path $outDir $sourceName) -Destination (Join-Path $aliasDir $aliases[$sourceName]) -Force
}

Get-ChildItem -LiteralPath $outDir -File | Sort-Object Name | Select-Object Name, Length
