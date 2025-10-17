# FastFind360 - Deployment Instructions

## Prerequisites

1. **Mapbox Token** (Required)
   - Create a free account at https://account.mapbox.com/
   - Generate a new access token with default public scopes
   - Copy `.env.example` to `.env.local`
   - Add your token: `VITE_MAPBOX_TOKEN=pk.your_actual_token_here`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

## Deploy to GitHub Pages

### Option 1: Automated Deployment

```bash
# Deploy to GitHub Pages (builds and deploys)
npm run deploy
```

This will:
1. Build the production version
2. Deploy to `gh-pages` branch
3. Make it live at `https://mmtukut.github.io/fastfind360/`

### Option 2: Manual Deployment

```bash
# 1. Build
npm run build

# 2. Deploy dist folder to your hosting service
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - GitHub Pages: gh-pages -d dist
```

## Environment Variables

**CRITICAL**: You MUST set up environment variables for the app to work.

### Local Development
Create `.env.local`:
```env
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

### Production (GitHub Pages)
For GitHub Pages, you need to add the Mapbox token to your repository secrets:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret: `VITE_MAPBOX_TOKEN` = your token

Then update `.github/workflows/deploy.yml` to inject the secret during build.

### Production (Vercel/Netlify)
Add environment variable in your hosting dashboard:
- Variable name: `VITE_MAPBOX_TOKEN`
- Value: your Mapbox token

## Vite Configuration

The `vite.config.ts` is configured for GitHub Pages with:
- Base path: `/fastfind360/`
- Optimized chunking for Mapbox and Framer Motion
- No sourcemaps in production

**If deploying to a custom domain**, update `base` in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // For custom domain or root deployment
})
```

## Troubleshooting

### Map doesn't load
- Check browser console for "Invalid token" error
- Verify `.env.local` exists with valid Mapbox token
- Token should start with `pk.`

### No buildings showing
- Buildings are generated on first load (takes 2-3 seconds)
- Check browser console for errors
- Verify you're zoomed in enough (zoom level 13+)

### GitHub Pages 404 error
- Ensure `base` in `vite.config.ts` matches your repo name
- Check GitHub Pages settings (Settings → Pages)
- Verify `gh-pages` branch exists

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Verify Node.js version: `node --version` (should be 16+)

## Performance Optimization

The app is optimized for:
- 12,847+ buildings without lag
- Clustering at zoom levels < 14
- Code splitting for faster initial load
- Lazy loading of map tiles

## Browser Support

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive design

## Demo Day Checklist

Before presenting:

- [ ] Test on a clean browser (incognito mode)
- [ ] Verify Mapbox token is working
- [ ] Check that all 12,847 buildings load
- [ ] Test search functionality (try "Gombe Central", "Nasarawo")
- [ ] Test filters (building types, size range)
- [ ] Test export (CSV, GeoJSON, PDF)
- [ ] Verify statistics are accurate
- [ ] Test property card (click on buildings)
- [ ] Check mobile responsiveness
- [ ] Ensure no console errors

## Support

For issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. Mapbox token validity
4. GitHub Actions logs (for deployment issues)

Good luck with Demo Day! 🚀
