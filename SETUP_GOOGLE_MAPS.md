# Setting Up Google Maps API for High-Resolution Satellite Imagery

FastFind360 now uses **Google Maps** for superior satellite imagery quality compared to Mapbox. Follow these steps to set up your Google Maps API key.

## Why Google Maps?

- **Higher Resolution**: Google Maps provides superior satellite imagery quality
- **Better Coverage**: More detailed coverage of Gombe State, Nigeria
- **Open Buildings Integration**: Seamless integration with Google's Open Buildings dataset
- **More Frequent Updates**: Google updates their satellite imagery more frequently

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (required)
   - **Geocoding API** (optional, for address lookup)
   - **Places API** (optional, for location search)

4. Create API credentials:
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy your API key

5. Restrict your API key (recommended for production):
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain(s), e.g., `localhost:5173/*` for development
   - Under "API restrictions", select "Restrict key"
   - Choose only the APIs you enabled above

## Step 2: Configure Your Application

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Save the file

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Application

```bash
npm run dev
```

The map should now load with high-resolution Google satellite imagery!

## Troubleshooting

### Map not loading?
- **Check console**: Open browser dev tools (F12) and check for API errors
- **Verify API key**: Make sure your API key is correct in `.env.local`
- **Check API status**: Ensure Maps JavaScript API is enabled in Google Cloud Console
- **Check billing**: Google Maps requires billing to be enabled (includes free tier)

### Low resolution imagery?
- **Zoom level**: Google Maps provides higher resolution at zoom levels 15+
- **Location**: Some areas may have limited high-res coverage
- **Try different map types**: Switch between Satellite and Hybrid views

### Rate limiting errors?
- **Enable billing**: Google Maps free tier is generous but requires billing enabled
- **Check quotas**: Monitor your usage in Google Cloud Console
- **Implement caching**: Consider caching frequently accessed areas

## Open Buildings Dataset

To get real building data from Google's Open Buildings dataset:

1. Install Python dependencies:
   ```bash
   pip install kagglehub pandas shapely
   ```

2. Set up Kaggle credentials (if using Kaggle):
   ```bash
   export KAGGLE_USERNAME=your_username
   export KAGGLE_KEY=your_api_key
   ```

3. Run the data fetcher:
   ```bash
   cd scripts
   python fetch_open_buildings.py
   ```

4. The script will:
   - Download building footprints for Gombe State
   - Filter and process the data
   - Save to `public/data/gombe_open_buildings.geojson`
   - Auto-classify buildings by type

## API Cost Estimates

Google Maps offers a **$200/month free credit** which includes:
- ~28,000 map loads per month (free tier)
- Dynamic Maps: $7 per 1,000 loads
- Static Maps: $2 per 1,000 loads

For most development and small-scale applications, the free tier is sufficient.

## Next Steps

- ✅ Map with high-res satellite imagery
- ✅ Open Buildings dataset integration
- 🔜 Real-time building detection
- 🔜 Multi-source data fusion
- 🔜 Export to various formats (KML, Shapefile, etc.)

## Support

For issues:
1. Check Google Cloud Console for API errors
2. Review browser console for JavaScript errors
3. Verify `.env.local` configuration
4. Check [Google Maps Platform docs](https://developers.google.com/maps/documentation)

---

**Note**: The application will fall back to generated sample data if Open Buildings data is not available. For production use, always fetch real data using the provided script.
