# Mobile App Setup Guide

This guide explains how to convert the Guria Guide web app into a mobile app.

## Option 1: Progressive Web App (PWA) - Easiest ✅

The app is already configured as a PWA! Just follow these steps:

### Testing PWA Locally

1. **Start a local server** (required for service workers):
   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser**: `http://localhost:8000`

3. **Install on mobile**:
   - **Android Chrome**: Menu → "Add to Home screen"
   - **iOS Safari**: Share → "Add to Home Screen"
   - **Desktop Chrome**: Click install icon in address bar

### Generate App Icons

You need to create app icons. Use the guide image or create custom icons:

**Quick method using ImageMagick** (if installed):
```bash
# Convert guide image to icons
convert kacuna/guide.jpeg -resize 512x512 icons/icon-512x512.png
convert kacuna/guide.jpeg -resize 384x384 icons/icon-384x384.png
convert kacuna/guide.jpeg -resize 192x192 icons/icon-192x192.png
convert kacuna/guide.jpeg -resize 152x152 icons/icon-152x152.png
convert kacuna/guide.jpeg -resize 144x144 icons/icon-144x144.png
convert kacuna/guide.jpeg -resize 128x128 icons/icon-128x128.png
convert kacuna/guide.jpeg -resize 96x96 icons/icon-96x96.png
convert kacuna/guide.jpeg -resize 72x72 icons/icon-72x72.png
```

**Or use online tools**:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## Option 2: Native App with Capacitor (Advanced)

For a true native app with access to device features:

### Installation

```bash
# Install Capacitor CLI
npm install -g @capacitor/cli

# Initialize Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init

# Add platforms
npx cap add ios
npx cap add android
```

### Configuration

Create `capacitor.config.json`:
```json
{
  "appId": "com.guriaguide.app",
  "appName": "Guria Guide",
  "webDir": ".",
  "server": {
    "url": "http://localhost:8000",
    "cleartext": true
  }
}
```

### Build Commands

```bash
# Sync web assets
npx cap sync

# Open in native IDEs
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio

# Build
npx cap build ios
npx cap build android
```

## Mobile-Specific Features Already Included

✅ Responsive design (mobile-first CSS)
✅ Touch-friendly buttons
✅ Geolocation API (works on mobile)
✅ Fullscreen display mode
✅ Offline capability (service worker)
✅ Install prompt support

## Deployment

### For PWA:
1. Deploy to any web hosting (GitHub Pages, Netlify, Vercel, etc.)
2. Ensure HTTPS (required for service workers)
3. Users can install from browser

### For Native App:
1. Build in Xcode/Android Studio
2. Submit to App Store/Play Store
3. Follow platform guidelines

## Testing Checklist

- [ ] Icons display correctly
- [ ] App installs on device
- [ ] Geolocation works
- [ ] Map loads and displays
- [ ] Language switching works
- [ ] Offline mode works (disable WiFi)
- [ ] Touch interactions work smoothly

## Troubleshooting

**Service Worker not registering?**
- Must use HTTPS or localhost
- Check browser console for errors

**Icons not showing?**
- Ensure icons exist in `/icons/` folder
- Check manifest.json paths

**Geolocation not working?**
- Check device permissions
- Ensure HTTPS (required on mobile)

## Next Steps

1. Generate app icons (see above)
2. Test PWA installation
3. Deploy to hosting
4. (Optional) Set up Capacitor for native app stores

