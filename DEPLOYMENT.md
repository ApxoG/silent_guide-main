# GitHub Pages Deployment Guide

This repository is now configured to automatically deploy to GitHub Pages.

## 🚀 Quick Setup

### Step 1: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Save the changes

### Step 2: Deploy
Two ways to deploy:

#### Option A: Automatic (Recommended)
- Simply push to the `main` branch
- The GitHub Actions workflow will automatically build and deploy
- Check the **Actions** tab to monitor deployment progress

#### Option B: Manual
1. Go to the **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the branch and click **Run workflow**

### Step 3: Access Your Site
Once deployed, your site will be available at:
```
https://ApxoG.github.io/silent_guide-main/
```

## 📋 What Was Changed

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically deploys on push to `main` branch
- Can also be triggered manually
- Uses official GitHub Pages actions for secure deployment

### 2. Path Updates for GitHub Pages Compatibility
The following files were updated to use relative paths (required for GitHub Pages subdirectory deployment):

#### `manifest.json`
- `start_url`: `/index.html` → `./index.html`
- `shortcuts.url`: `/map.html` → `./map.html`

#### `sw.js` (Service Worker)
- All cached URLs changed from absolute (`/`) to relative (`./`) paths
- Fallback page path updated to relative

### 3. Jekyll Bypass (`.nojekyll`)
- Empty file that prevents GitHub Pages from processing with Jekyll
- Ensures all files are served correctly, including those starting with `_`

## 🔧 Technical Details

### PWA Features Preserved
All Progressive Web App features remain fully functional:
- ✅ Service worker offline caching
- ✅ Installable on mobile devices
- ✅ Geolocation tracking
- ✅ Multi-language support
- ✅ Fullscreen app experience

### HTTPS & Security
- GitHub Pages provides HTTPS by default (required for PWA features)
- Service workers and geolocation APIs require HTTPS
- All external resources (Leaflet) loaded over HTTPS

## 🐛 Troubleshooting

### Deployment Not Working?
1. Check that GitHub Pages is enabled in Settings → Pages
2. Verify the source is set to "GitHub Actions"
3. Check the Actions tab for any error messages

### Site Not Loading?
1. Wait a few minutes after deployment completes
2. Clear your browser cache
3. Check browser console for any errors
4. Verify the URL: `https://ApxoG.github.io/silent_guide-main/`

### PWA Not Installing?
1. Ensure you're accessing via HTTPS
2. Clear site data and try again
3. Check manifest.json is being served correctly
4. Look for service worker errors in browser console

## 📱 Testing Your Deployment

### Desktop
1. Open the deployed URL in Chrome/Edge
2. Look for the install icon in the address bar
3. Test the map and geolocation features

### Mobile
1. Open the URL on your mobile device
2. **Android**: Chrome menu → "Add to Home screen"
3. **iOS**: Safari share → "Add to Home Screen"
4. Open the installed app and test features

## 🔄 Making Updates

After merging this PR, any future changes follow this workflow:
1. Make changes to your code
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys
4. Changes live in ~2-3 minutes

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Leaflet Documentation](https://leafletjs.com/)

---

**Note**: Remember to merge this PR to the `main` branch to activate the deployment workflow!
