#!/bin/bash
# Generate PWA icons from guide image
# Requires ImageMagick: brew install imagemagick (Mac) or apt-get install imagemagick (Linux)

SOURCE_IMAGE="kacuna/guide.jpeg"
ICON_DIR="icons"

# Create icons directory if it doesn't exist
mkdir -p "$ICON_DIR"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Installing..."
    echo "On Mac: brew install imagemagick"
    echo "On Linux: sudo apt-get install imagemagick"
    echo ""
    echo "Alternatively, use online tools:"
    echo "https://realfavicongenerator.net/"
    echo "https://www.pwabuilder.com/imageGenerator"
    exit 1
fi

echo "Generating icons from $SOURCE_IMAGE..."

# Generate all required icon sizes
convert "$SOURCE_IMAGE" -resize 72x72 -background white -gravity center -extent 72x72 "$ICON_DIR/icon-72x72.png"
convert "$SOURCE_IMAGE" -resize 96x96 -background white -gravity center -extent 96x96 "$ICON_DIR/icon-96x96.png"
convert "$SOURCE_IMAGE" -resize 128x128 -background white -gravity center -extent 128x128 "$ICON_DIR/icon-128x128.png"
convert "$SOURCE_IMAGE" -resize 144x144 -background white -gravity center -extent 144x144 "$ICON_DIR/icon-144x144.png"
convert "$SOURCE_IMAGE" -resize 152x152 -background white -gravity center -extent 152x152 "$ICON_DIR/icon-152x152.png"
convert "$SOURCE_IMAGE" -resize 192x192 -background white -gravity center -extent 192x192 "$ICON_DIR/icon-192x192.png"
convert "$SOURCE_IMAGE" -resize 384x384 -background white -gravity center -extent 384x384 "$ICON_DIR/icon-384x384.png"
convert "$SOURCE_IMAGE" -resize 512x512 -background white -gravity center -extent 512x512 "$ICON_DIR/icon-512x512.png"

echo "✅ Icons generated successfully in $ICON_DIR/"

