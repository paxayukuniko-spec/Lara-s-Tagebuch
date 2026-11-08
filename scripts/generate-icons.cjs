const { execSync } = require('child_process');
const fs = require('fs');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// 1. Create a circular mask (1024x1024, circle at 512,512 with radius 508)
execSync('convert -size 1024x1024 xc:none -fill white -draw "circle 512,512 512,4" mask.png');

// 2. Cut out the circle from Lara_Croft_Icon_lara-master-1024_1024x1024.png
execSync('convert src/assets/images/Lara_Croft_Icon_lara-master-1024_1024x1024.png mask.png -alpha set -compose DstIn -composite src/assets/images/app-icon-round.png');

// 3. Create a clean gold outer border circle
execSync('convert -size 1024x1024 xc:none -stroke "#d4af37" -strokewidth 5 -fill none -draw "circle 512,512 512,4" rim.png');
execSync('convert src/assets/images/app-icon-round.png rim.png -compose Over -composite src/assets/images/app-icon-round.png');

// 4. Clean up temporary mask files
if (fs.existsSync('mask.png')) fs.unlinkSync('mask.png');
if (fs.existsSync('rim.png')) fs.unlinkSync('rim.png');

// 5. Generate standard web app icons
execSync('convert src/assets/images/app-icon-round.png -resize 512x512 public/icon-512.png');
execSync('convert src/assets/images/app-icon-round.png -resize 192x192 public/icon-192.png');
execSync('convert src/assets/images/app-icon-round.png -resize 180x180 public/apple-touch-icon.png');
execSync('convert src/assets/images/app-icon-round.png -resize 64x64 public/favicon.png');
execSync('convert src/assets/images/app-icon-round.png -resize 32x32 public/favicon-32.png');

console.log('App icons generated successfully!');
