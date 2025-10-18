# FastFind360 - Satellite-Powered Property Intelligence

> Africa's first AI-native property detection system using Google's Open Buildings dataset and high-resolution satellite imagery.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Google Maps](https://img.shields.io/badge/Google%20Maps-Latest-green)
![Open Buildings](https://img.shields.io/badge/Open%20Buildings-516M%20buildings-orange)

## 🌟 What's New

### ✅ Google Maps Integration (High-Resolution Satellite)
- Switched from Mapbox to **Google Maps** for superior satellite imagery quality
- Higher resolution imagery perfect for building detection in Gombe State, Nigeria
- Better coverage and more frequent updates

### ✅ Open Buildings Dataset
- Integration with **Google's Open Buildings dataset** (516M+ buildings across Africa)
- Real building footprints with confidence scores
- Accurate area measurements and geographic coordinates
- Plus Code support for precise location identification

### ✅ 5,000+ Real Buildings in Gombe
- Pre-loaded dataset with 5,000+ building footprints
- Real building classifications (Residential, Commercial, Industrial, Institutional)
- Confidence scores from AI detection (65-95%)
- Property valuations and tax estimates

## 🏗️ Features

- 🛰️ **High-Resolution Satellite Map**: Google Maps satellite imagery at 14+ zoom levels
- 🏘️ **Real Building Data**: Open Buildings dataset with 516M+ buildings across Africa
- 📍 **Gombe State Focus**: 5,000+ buildings detected in Gombe, Nigeria (10.2897°N, 11.1672°E)
- 🎨 **Interactive Visualization**: Color-coded building polygons by type
- 📊 **Live Statistics**: Real-time metrics on building counts, areas, and revenue potential
- 🔍 **Search & Filter**: Find properties by type, size, confidence, or ID
- 💰 **Revenue Projection**: Automatic property valuation and tax estimates
- 🗺️ **Plus Code Support**: Google Plus Codes for precise location identification

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
./scripts/setup.sh
```

This will:
1. Create `.env.local` from template
2. Install Node dependencies
3. Fetch Open Buildings data for Gombe
4. Set up the project for development

### Option 2: Manual Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fastfind360
   npm install
   ```

2. **Set Up Google Maps API**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Maps API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
   
   📘 **Get API Key**: https://console.cloud.google.com/google/maps-apis
   
   Required APIs:
   - Maps JavaScript API ✅

3. **Fetch Open Buildings Data** (Optional but recommended)
   ```bash
   # Install Python dependencies
   pip install -r scripts/requirements.txt
   
   # Run data fetcher
   python scripts/fetch_open_buildings.py
   ```
   
   This will download building footprints for Gombe and save to `public/data/gombe_open_buildings.geojson`

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173

## 📊 Data Sources

### Open Buildings Dataset
- **Source**: Google Research (https://sites.research.google/open-buildings/)
- **Coverage**: 516M buildings across 19.4M km² of Africa (64% of the continent)
- **License**: CC BY-4.0 and ODbL v1.0
- **Data Format**: GeoJSON with polygon geometries
- **Attributes**:
  - `area_in_meters`: Building footprint area
  - `confidence`: AI detection confidence (0.5-1.0)
  - `latitude`, `longitude`: Building centroid
  - `full_plus_code`: Google Plus Code
  - `geometry`: Building polygon (WKT format)

### Citation
```
W. Sirko, S. Kashubin, M. Ritter, A. Annkah, Y.S.E. Bouchareb, Y. Dauphin, 
D. Keysers, M. Neumann, M. Cisse, J.A. Quinn. 
Continental-scale building detection from high resolution satellite imagery. 
arXiv:2107.12283, 2021.
```

## 🏗️ Building Classification

FastFind360 automatically classifies buildings based on area:

| Type | Area Range | Color | Tax Rate |
|------|-----------|-------|----------|
| 🏠 Residential | 50-200 m² | Blue (#3B82F6) | ₦150,000/m² |
| 🏢 Commercial | 200-500 m² | Orange (#F59E0B) | ₦300,000/m² |
| 🏭 Industrial | 1000+ m² | Purple (#8B5CF6) | ₦100,000/m² |
| 🏛️ Institutional | 500-1000 m² | Green (#10B981) | ₦200,000/m² |

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **@react-google-maps/api** - Google Maps integration

### Data Processing
- **Python 3.8+** - Data fetching and processing
- **pandas** - Data manipulation
- **shapely** - Geometry processing
- **kagglehub** - Dataset download

### Maps & Satellite
- **Google Maps JavaScript API** - High-res satellite imagery
- **Google Open Buildings** - Building footprint data
- **Turf.js** - Geospatial analysis

## 📁 Project Structure

```
fastfind360/
├── src/
│   ├── components/
│   │   ├── Map.tsx              # Google Maps component
│   │   ├── Dashboard.tsx        # Statistics dashboard
│   │   ├── Search.tsx           # Property search
│   │   ├── Filters.tsx          # Building filters
│   │   ├── Sidebar.tsx          # Side panel
│   │   └── PropertyCard.tsx     # Property details
│   ├── hooks/
│   │   ├── useBuildingData.ts   # Load Open Buildings data
│   │   ├── useMapState.ts       # Map state management
│   │   └── useFilters.ts        # Filter logic
│   ├── utils/
│   │   ├── buildingClassifier.ts    # Classification logic
│   │   ├── buildingGenerator.ts     # Sample data generator
│   │   └── statistics.ts            # Metrics calculation
│   └── types/
│       └── index.ts             # TypeScript types
├── scripts/
│   ├── fetch_open_buildings.py  # Data fetcher
│   ├── setup.sh                 # Setup script
│   └── requirements.txt         # Python dependencies
├── public/
│   └── data/
│       └── gombe_open_buildings.geojson  # Building data
├── .env.example                 # Environment template
└── package.json
```

## 🎯 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fetch Open Buildings data
python scripts/fetch_open_buildings.py
```

### Environment Variables

```env
# Google Maps API Key (required)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Kaggle credentials for Open Buildings data
KAGGLE_USERNAME=your_username
KAGGLE_KEY=your_api_key
```

## 📈 Performance

- **Map Load**: < 2 seconds
- **Building Rendering**: 5,000+ polygons rendered smoothly
- **Search Response**: < 100ms
- **Build Time**: ~1 second
- **Bundle Size**: ~325 KB (gzipped: 87 KB)

## 🌍 Gombe State Coverage

**Center Coordinates**: 10.2897°N, 11.1672°E

**Bounding Box**:
- North: 10.45°N
- South: 10.15°N
- East: 11.35°E
- West: 11.05°E

**Coverage**: ~900 km² with 5,000+ buildings detected

## 🔧 Customization

### Add More Regions

Edit `scripts/fetch_open_buildings.py`:

```python
# Add new bounding box
NEW_REGION_BBOX = {
    "min_lat": <latitude>,
    "max_lat": <latitude>,
    "min_lng": <longitude>,
    "max_lng": <longitude>
}
```

### Modify Classification Rules

Edit `src/utils/buildingClassifier.ts`:

```typescript
export function classifyBuilding(
  area: number,
  nearRoad: boolean,
  shapeRegularity: number
): ClassificationResult {
  // Your custom logic here
}
```

### Change Map Style

Edit `src/components/Map.tsx`:

```typescript
const mapOptions: google.maps.MapOptions = {
  mapTypeId: 'satellite',  // or 'roadmap', 'hybrid', 'terrain'
  // ... other options
};
```

## 🐛 Troubleshooting

### Map not loading?
1. Check if `VITE_GOOGLE_MAPS_API_KEY` is set in `.env.local`
2. Verify API key is valid at https://console.cloud.google.com
3. Ensure Maps JavaScript API is enabled
4. Check browser console for errors

### No buildings showing?
1. Verify `public/data/gombe_open_buildings.geojson` exists
2. Run `python scripts/fetch_open_buildings.py` to generate data
3. Check browser network tab for data loading errors
4. Try zooming into the Gombe region (center: 10.2897°N, 11.1672°E)

### Low-quality imagery?
1. Zoom in closer (level 15+)
2. Switch to "Satellite" or "Hybrid" view
3. Some areas may have limited high-res coverage

## 📚 Documentation

- [Setup Guide](SETUP_GOOGLE_MAPS.md) - Detailed setup instructions
- [Open Buildings Dataset](https://sites.research.google/open-buildings/) - Dataset information
- [Google Maps API](https://developers.google.com/maps/documentation) - API documentation

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project uses data from Google's Open Buildings dataset:
- Creative Commons Attribution (CC BY-4.0)
- Open Data Commons Open Database License (ODbL) v1.0

## 🙏 Acknowledgments

- **Google Research** - Open Buildings dataset
- **Google Maps** - High-resolution satellite imagery
- **React Community** - Amazing ecosystem
- **Gombe State Government** - Target region for pilot

## 📞 Contact

- **Email**: info@fastfind360.ng
- **Phone**: +234 805 641 9040
- **Location**: Abuja, Nigeria

---

**FastFind360** - Making Nigeria's invisible economy, visible. 🛰️🗺️

Built with ❤️ for Africa's future
