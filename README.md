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

Deploy to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

**Important**: Use HTTPS (required for service workers and geolocation on mobile)

## 📝 License

MIT

