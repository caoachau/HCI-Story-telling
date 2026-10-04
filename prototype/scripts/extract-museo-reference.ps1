param(
  [Parameter(Mandatory = $true)][string]$ReferenceDirectory
)

$ErrorActionPreference = 'Stop'

# Extract the supplied artwork without inventing replacement photography.
# Coordinates refer to a 546px-wide view of Frame 55 and the individual plates.
Add-Type -AssemblyName System.Drawing
$projectDirectory = Split-Path $PSScriptRoot -Parent
$assetDirectory = Join-Path $projectDirectory 'src/assets/museo'
$reviewDirectory = Join-Path $projectDirectory '.museum-review'
New-Item -ItemType Directory -Force -Path $assetDirectory, $reviewDirectory | Out-Null
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]92)

function Export-ReferenceRegion($Source, $Name, $Rectangle, $CoordinateWidth, $MaxWidth = 1600, $Review = $false) {
  $ratio = $Source.Width / $CoordinateWidth
  $sourceRectangle = New-Object System.Drawing.RectangleF ($Rectangle[0] * $ratio), ($Rectangle[1] * $ratio), ($Rectangle[2] * $ratio), ($Rectangle[3] * $ratio)
  $outputWidth = [int][Math]::Min($MaxWidth, $sourceRectangle.Width)
  $outputHeight = [int][Math]::Round($outputWidth * $sourceRectangle.Height / $sourceRectangle.Width)
  $bitmap = New-Object System.Drawing.Bitmap $outputWidth, $outputHeight
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($Source, (New-Object System.Drawing.RectangleF 0, 0, $outputWidth, $outputHeight), $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
  $directory = if ($Review) { $reviewDirectory } else { $assetDirectory }
  $bitmap.Save((Join-Path $directory ($Name + '.jpg')), $jpegEncoder, $encoderParameters)
  $graphics.Dispose()
  $bitmap.Dispose()
}

$frame = [System.Drawing.Image]::FromFile((Join-Path $ReferenceDirectory 'Frame 55.png'))
try {
  Export-ReferenceRegion $frame '01-hero' @(0,0,523,295) 546 1400 $true
  Export-ReferenceRegion $frame '03-map' @(4,655,520,305) 546 1400 $true
  Export-ReferenceRegion $frame '05-gallery' @(4,1317,529,307) 546 1400 $true
  Export-ReferenceRegion $frame 'hero-skull' @(214,32,282,180) 546
  Export-ReferenceRegion $frame 'world-map' @(135,703,218,178) 546 1400
  Export-ReferenceRegion $frame 'map-chauvet' @(366,707,134,68) 546 700
  Export-ReferenceRegion $frame 'site-chauvet' @(67,899,73,34) 546 600
  Export-ReferenceRegion $frame 'site-lascaux' @(147,899,73,34) 546 600
  Export-ReferenceRegion $frame 'site-altamira' @(227,899,73,34) 546 600
  Export-ReferenceRegion $frame 'site-olduvai' @(308,899,73,34) 546 600
  Export-ReferenceRegion $frame 'site-blombos' @(389,899,71,34) 546 600
  Export-ReferenceRegion $frame 'tour-wall' @(220,1360,250,173) 546
  Export-ReferenceRegion $frame 'tour-art' @(33,1547,77,36) 546 600
  Export-ReferenceRegion $frame 'tour-chamber' @(122,1547,77,36) 546 600
  Export-ReferenceRegion $frame 'tour-mammoth' @(216,1547,77,36) 546 600
  Export-ReferenceRegion $frame 'tour-fire' @(308,1547,77,36) 546 600
  Export-ReferenceRegion $frame 'tour-landscape' @(401,1547,77,36) 546 600
} finally { $frame.Dispose() }

$overview = [System.Drawing.Image]::FromFile((Join-Path $ReferenceDirectory 'Group 86.png'))
try {
  Export-ReferenceRegion $overview 'cave-entrance' @(707,115,1184,522) 1897
  Export-ReferenceRegion $overview 'main-chamber' @(676,882,659,304) 1897
  Export-ReferenceRegion $overview 'bison-art' @(68,930,134,99) 1897 500
  Export-ReferenceRegion $overview 'hand-art' @(68,1047,134,96) 1897 500
  Export-ReferenceRegion $overview 'early-people' @(68,1165,134,97) 1897 500
  Export-ReferenceRegion $overview 'france-map' @(1534,663,340,190) 1897 600
} finally { $overview.Dispose() }

$timeline = [System.Drawing.Image]::FromFile((Join-Path $ReferenceDirectory 'image 106.png'))
try {
  Export-ReferenceRegion $timeline 'evolution-skull' @(688,130,893,426) 1920
  Export-ReferenceRegion $timeline 'evolution-landscape' @(1350,431,463,133) 1920 900
  Export-ReferenceRegion $timeline 'ancestors' @(780,793,489,367) 1920 1100
  Export-ReferenceRegion $timeline 'stone-tool' @(1293,795,182,124) 1920 500
  Export-ReferenceRegion $timeline 'early-symbols' @(1293,946,182,131) 1920 500
  Export-ReferenceRegion $timeline 'ice-world' @(1293,1104,182,131) 1920 500
  Export-ReferenceRegion $timeline 'era-paleolithic' @(212,567,154,87) 1920 450
  Export-ReferenceRegion $timeline 'era-erectus' @(568,564,139,94) 1920 450
  Export-ReferenceRegion $timeline 'era-neanderthal' @(880,564,145,95) 1920 450
  Export-ReferenceRegion $timeline 'era-sapiens' @(1170,542,130,111) 1920 450
  Export-ReferenceRegion $timeline 'era-neolithic' @(1491,556,177,104) 1920 450
} finally { $timeline.Dispose() }

$exhibitions = [System.Drawing.Image]::FromFile((Join-Path $ReferenceDirectory 'image 107.png'))
try {
  Export-ReferenceRegion $exhibitions 'exhibition-origins' @(70,519,517,290) 1758 900
  Export-ReferenceRegion $exhibitions 'exhibition-tools' @(641,519,516,290) 1758 900
  Export-ReferenceRegion $exhibitions 'exhibition-environment' @(1210,519,526,290) 1758 900
  Export-ReferenceRegion $exhibitions 'exhibition-culture' @(70,1010,517,250) 1758 900
  Export-ReferenceRegion $exhibitions 'exhibition-ice' @(641,1010,516,250) 1758 900
  Export-ReferenceRegion $exhibitions 'exhibition-legacy' @(1210,1010,526,250) 1758 900
  Export-ReferenceRegion $exhibitions 'rock-texture' @(1110,170,602,309) 1758 1000
} finally { $exhibitions.Dispose() }
$encoderParameters.Dispose()
Write-Output ('Extracted artwork: ' + $assetDirectory)
