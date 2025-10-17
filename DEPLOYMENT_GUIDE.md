# FastFind360 - Deployment Guide 🚀

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended for Demo)

**Setup** (One-time):
```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
npm pkg set scripts.predeploy="npm run build"
npm pkg set scripts.deploy="gh-pages -d dist"
```

**Deploy**:
```bash
# Build and deploy in one command
npm run deploy
```

**Access**: `https://yourusername.github.io/fastfind360/`

---

### Option 2: Vercel (Best for Production)

**Setup**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

**Deploy**:
```bash
# Deploy to production
vercel --prod
```

**Result**: Get instant production URL like `fastfind360.vercel.app`

**Benefits**:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant deployments
- ✅ Preview deployments for branches
- ✅ Free tier available

---

### Option 3: Netlify

**Setup**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login
```

**Deploy**:
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Benefits**:
- ✅ Automatic HTTPS
- ✅ Form handling
- ✅ Serverless functions
- ✅ Split testing
- ✅ Free tier available

---

## Manual Deployment

### Step 1: Build for Production

```bash
# Create optimized build
npm run build
```

This creates a `dist/` folder with:
- `index.html` - Entry point
- `assets/` - JS, CSS, and other assets
- `data/` - Empty folder for optional GeoJSON

### Step 2: Upload to Hosting

Upload the entire `dist/` folder to:
- AWS S3 + CloudFront
- DigitalOcean Spaces
- Firebase Hosting
- Any static hosting service

### Step 3: Configure Base Path

If deploying to a subdirectory (e.g., `yoursite.com/fastfind360/`):

Edit `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/fastfind360/', // Your subdirectory
  // ...
})
```

Rebuild:
```bash
npm run build
```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
VITE_MAPBOX_TOKEN=your_production_mapbox_token
```

### Security Considerations

1. **API Keys**: 
   - Use restricted Mapbox tokens
   - Limit to your production domain
   - Rotate keys regularly

2. **CORS**: 
   - Configure if using external APIs
   - Allow only your domain

3. **HTTPS**: 
   - Always use HTTPS in production
   - Most hosting services provide this automatically

---

## Pre-Deployment Checklist

### ✅ Code Quality

- [ ] Run `npm run build` - No errors
- [ ] Test production build with `npm run preview`
- [ ] Check browser console - No errors
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices

### ✅ Performance

- [ ] Map loads in < 3 seconds
- [ ] Buildings render smoothly (12,847 polygons)
- [ ] Search responds quickly
- [ ] Filters update in real-time
- [ ] No memory leaks during extended use

### ✅ Content

- [ ] Mapbox token is valid and production-ready
- [ ] All statistics show correct values
- [ ] Building classifications are accurate
- [ ] Revenue calculations are correct
- [ ] Links and buttons work

### ✅ SEO & Meta

- [ ] Page title is set
- [ ] Meta description is set
- [ ] Favicon is set
- [ ] Open Graph tags (optional)

---

## Deployment Workflows

### GitHub Actions (Automatic Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_MAPBOX_TOKEN: ${{ secrets.MAPBOX_TOKEN }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

**Setup**:
1. Go to GitHub repo → Settings → Secrets
2. Add `MAPBOX_TOKEN` secret
3. Push to main branch
4. Automatic deployment!

---

## Monitoring & Analytics

### Add Google Analytics

Edit `index.html`:
```html
<head>
  <!-- ... -->
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
  </script>
</head>
```

### Error Tracking with Sentry

```bash
npm install @sentry/react
```

Add to `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## Performance Optimization

### 1. Enable Compression

Most hosting services enable gzip/brotli automatically.

**Verify**: Check response headers for `Content-Encoding: gzip`

### 2. Cache Static Assets

Configure cache headers:
```
# Example for Netlify (_headers file)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: no-cache
```

### 3. Lazy Load Components

For future optimization:
```typescript
const Dashboard = lazy(() => import('./components/Dashboard'));
```

---

## Scaling for Production

### If Traffic Increases

1. **Vector Tiles**: 
   - Convert GeoJSON to vector tiles
   - Serve from CDN
   - Use Mapbox tilesets

2. **API Backend**:
   - Move building data to API
   - Add server-side filtering
   - Implement caching

3. **Database**:
   - PostgreSQL with PostGIS
   - Store building footprints
   - Enable spatial queries

---

## Troubleshooting

### Build Fails

**Error**: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: TypeScript compilation errors
- Check `tsconfig.json`
- Fix type errors in code
- Run `npx tsc --noEmit` to test

### Map Not Loading in Production

**Issue**: Gray map or no tiles

**Solutions**:
1. Check Mapbox token is valid
2. Verify token not restricted to localhost
3. Check browser console for CORS errors
4. Confirm HTTPS is enabled

### Large Bundle Size

**Issue**: Bundle > 2MB

**Solutions**:
1. Enable tree-shaking (already configured)
2. Use dynamic imports for large components
3. Optimize images and assets
4. Consider code splitting

---

## Domain Setup

### Custom Domain (e.g., fastfind360.ng)

**For Vercel**:
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records at your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP)
   ```

**For Netlify**:
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

**For GitHub Pages**:
1. Create `CNAME` file in `public/` folder:
   ```
   fastfind360.ng
   ```
2. Update DNS A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

---

## Backup & Rollback

### Git Tags for Versions

```bash
# Tag current version
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0

# Rollback if needed
git checkout v1.0.0
npm install
npm run build
# Deploy old version
```

### Automated Backups

- Use Git for code
- Export building data regularly
- Backup environment variables
- Document configuration

---

## Launch Day Checklist

### 1 Week Before
- [ ] Test on all major browsers
- [ ] Test on mobile devices
- [ ] Set up monitoring/analytics
- [ ] Configure custom domain
- [ ] Create backup deployment

### 1 Day Before
- [ ] Final build test
- [ ] Verify all features work
- [ ] Check API tokens
- [ ] Test demo flow
- [ ] Prepare backup screenshots

### Launch Day
- [ ] Deploy to production
- [ ] Verify live site works
- [ ] Test from multiple devices
- [ ] Monitor for errors
- [ ] Share with team

---

## Support Resources

### Hosting Documentation
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

### Mapbox Resources
- API Docs: https://docs.mapbox.com
- Token Management: https://account.mapbox.com
- Pricing: https://www.mapbox.com/pricing

### Community Support
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- TypeScript Docs: https://www.typescriptlang.org

---

## Quick Reference

### Deploy Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Verification URLs

After deployment, test these:
- Homepage loads
- Map displays with buildings
- Dashboard shows statistics
- Search works
- Filters update map
- Click building shows details

---

## 🎉 You're Ready to Deploy!

Choose your deployment method:
1. **Quick Demo**: GitHub Pages
2. **Best for Production**: Vercel
3. **Advanced Features**: Netlify

Run the deploy command and go live! 🚀

---

**FastFind360 - Making Nigeria's invisible economy, visible.** 🛰️

*Need help? Check README-NEW.md or contact info@fastfind360.ng*
