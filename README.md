# Guria QR Audio Guide - Mobile App

A Progressive Web App (PWA) for exploring the Guria region of Georgia with interactive maps, geolocation tracking, and multilingual support.

## 🚀 Quick Start

### 1. Generate App Icons

```bash
./generate-icons.sh
```

Or manually create icons in the `icons/` folder (see sizes in `manifest.json`).

### 2. Start Local Server

```bash
python3 -m http.server 8000
```

### 3. Open in Browser

Visit `http://localhost:8000`

### 4. Install as Mobile App

- **Android Chrome**: Menu → "Add to Home screen"
- **iOS Safari**: Share → "Add to Home Screen"  
- **Desktop Chrome**: Click install icon in address bar

## 📱 Mobile Features

✅ **Progressive Web App (PWA)**
- Installable on mobile devices
- Works offline with service worker
- Fullscreen app experience

✅ **Native-like Experience**
- Touch-optimized interface
- Geolocation tracking
- Responsive design

✅ **Multi-language Support**
- English, Russian, Georgian
- Real-time language switching

## 🛠️ For Native App Stores

See `MOBILE_SETUP.md` for Capacitor setup instructions to build for iOS and Android app stores.

## 📁 Project Structure

```
├── index.html          # Splash screen
├── map.html            # Main map interface
├── manifest.json        # PWA manifest
├── sw.js               # Service worker
├── icons/              # App icons (generate with generate-icons.sh)
├── src/
│   ├── scrpt.js        # Main JavaScript
│   └── style.css       # Styles
└── kacuna/
    └── guide.jpeg       # Guide character image
```

## 🌐 Deployment

### GitHub Pages (Automated)

This repository is configured to automatically deploy to GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Automatic Deployment**:
   - Push to the `main` branch triggers automatic deployment
   - The GitHub Actions workflow builds and deploys the site
   - Access your site at: `https://<username>.github.io/<repository-name>/`

3. **Manual Deployment**:
   - Go to Actions tab → "Deploy to GitHub Pages" → Run workflow

### Other Hosting Options

Deploy to any static hosting:
- Netlify
- Vercel
- Firebase Hosting

**Important**: Use HTTPS (required for service workers and geolocation on mobile)

## 📝 License

MIT

