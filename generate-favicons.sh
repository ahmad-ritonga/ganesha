#!/bin/bash

# Script to generate favicons from logo.png
# This script requires ImageMagick (install with: brew install imagemagick)

cd /Users/mac/Herd/ganesha/public

# Check if logo exists
if [ ! -f "assets/images/logo.png" ]; then
    echo "Logo file not found at assets/images/logo.png"
    exit 1
fi

echo "Generating favicons from logo.png..."

# Create favicon.ico (16x16, 32x32, 48x48)
convert assets/images/logo.png -resize 16x16 favicon-16.png
convert assets/images/logo.png -resize 32x32 favicon-32.png
convert assets/images/logo.png -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
rm favicon-16.png favicon-32.png favicon-48.png

# Create apple-touch-icon (180x180)
convert assets/images/logo.png -resize 180x180 apple-touch-icon.png

# Create different sized icons for PWA
convert assets/images/logo.png -resize 192x192 icon-192.png
convert assets/images/logo.png -resize 512x512 icon-512.png

# Create favicon.svg (if original is PNG, convert to SVG-like format)
# For now, we'll use PNG versions, but ideally you'd have an SVG version
convert assets/images/logo.png -resize 32x32 favicon.png

echo "Favicons generated successfully!"
echo "Generated files:"
echo "- favicon.ico"
echo "- apple-touch-icon.png"
echo "- icon-192.png"
echo "- icon-512.png"
