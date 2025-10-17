# ⚡ FastFind360 - 5-Minute Quick Start

## 🎯 Goal
Get FastFind360 running on your machine in 5 minutes.

## 📋 Prerequisites Check

```bash
# Check Node.js (need 16+)
node --version

# Check npm
npm --version

# If not installed, download from: https://nodejs.org/
```

## 🚀 3-Step Setup

### Step 1: Install (1 minute)

```bash
# Navigate to project
cd /workspace

# Install dependencies
npm install
```

### Step 2: Configure Mapbox (2 minutes)

#### Get Free Mapbox Token:
1. Go to: https://account.mapbox.com/
2. Sign up (it's free, no credit card needed)
3. Copy your "Default public token" (starts with `pk.`)

#### Set Token:
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local (use any text editor)
# Replace 'your_mapbox_token_here' with your actual token
nano .env.local  # or use VS Code, vim, etc.
```

Your `.env.local` should look like:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...actual_token_here
```

### Step 3: Run (1 minute)

```bash
# Start development server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

**Open browser:** http://localhost:5173/

## ✅ Verification

You should see:
1. ✅ Hero section with animated gradient background
2. ✅ Live metrics: "12,847 Buildings | 94.3% Accuracy | ₦2.3B"
3. ✅ "Launch Detection System" button

Click the button:
4. ✅ Map loads with satellite imagery
5. ✅ Buildings appear as colored polygons
6. ✅ No console errors

## 🎨 Test Features (2 minutes)

```
1. Search: Type "Nasarawo" → Map should fly to location
2. Filter: Click "Commercial" → See orange buildings only
3. Click building → Property card slides in from right
4. Click "📊 Show Dashboard" → Statistics panel appears
5. Click "Export CSV" → File downloads
```

All working? **You're ready! 🎉**

## 🐛 Troubleshooting

### ❌ Map not loading?
```bash
# Check token in browser console (F12)
# Should NOT see "Invalid token" error

# Verify .env.local exists
ls -la .env.local

# Verify token format (should start with pk.)
cat .env.local
```

**Fix:**
- Ensure `.env.local` is in project root
- Token should be on one line (no spaces)
- Format: `VITE_MAPBOX_TOKEN=pk.your_token`

### ❌ Buildings not showing?
```bash
# Check browser console for errors
# Wait 2-3 seconds (buildings generate on load)
# Zoom in to level 13+ (buildings only show at close zoom)
```

### ❌ npm install fails?
```bash
# Clear cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### ❌ Port 5173 already in use?
```bash
# Kill existing process
killall node

# Or use different port
npm run dev -- --port 3000
```

## 📦 Build for Production

```bash
# Build optimized version
npm run build

# Output will be in dist/ folder
# Test production build:
npm run preview

# Open: http://localhost:4173/
```

## 🚀 Deploy to GitHub Pages

```bash
# Automated deployment
npm run deploy

# Your site will be live at:
# https://YOUR_USERNAME.github.io/fastfind360/
```

**First time?** Set up GitHub repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/fastfind360.git
git push -u origin main
```

## 📱 Access from Other Devices

```bash
# Run with network access
npm run dev -- --host

# You'll see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/

# Use Network URL to access from phone/tablet
```

## 🎯 Demo Day Pre-Flight Check

30 minutes before demo:

```bash
# 1. Fresh build
npm run build

# 2. Test production
npm run preview

# 3. Test in incognito mode
# Open: http://localhost:4173/

# 4. Verify all features work
# ✅ Map loads
# ✅ Buildings show (12,847)
# ✅ Search works
# ✅ Filters work
# ✅ Export downloads
# ✅ No console errors
```

## 💡 Pro Tips

### Performance
- Use Chrome/Edge for best performance
- Clear browser cache before demo
- Close other tabs (Mapbox is memory-intensive)

### Visual Impact
- Let animations complete (looks professional)
- Zoom out to show clusters
- Zoom in dramatically for building reveal
- Use search feature (map flyover is impressive)

### Backup Plan
- Record screen demo beforehand
- Have offline build ready
- Save exported data samples

## 🆘 Emergency Support

**Demo Day Issues?**

1. **Map crashes:**
   - Refresh page (CMD/CTRL + R)
   - Everything regenerates

2. **Internet fails:**
   - Run local build
   - Buildings still generate (offline)
   - Only basemap tiles need internet

3. **Total failure:**
   - Use screen recording
   - Show static slides
   - Demo code in VS Code

## 📞 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Test production build
npm run deploy           # Deploy to GitHub Pages

# Debugging
npm run lint             # Check for errors
npm run build -- --debug # Verbose build output

# Cleanup
rm -rf node_modules      # Remove dependencies
rm -rf dist              # Remove build output
npm install              # Reinstall fresh
```

## 🎓 Next Steps

Once basic setup works:

1. **Customize** - Edit building count, coordinates
2. **Real Data** - Integrate Google Open Buildings dataset
3. **Advanced** - Add AI model, change detection
4. **Deploy** - Launch to production
5. **Scale** - Expand to more states

## ✨ You're Ready!

**FastFind360 is now running on your machine.**

Test everything, practice your demo, and show them the future of property intelligence in Nigeria! 🚀🇳🇬

---

**Need help?** Check:
- `README.md` - Full documentation
- `DEMO_DAY_CHECKLIST.md` - Demo preparation
- `DEPLOYMENT_INSTRUCTIONS.md` - Deployment guide
- Browser console (F12) - Error messages
