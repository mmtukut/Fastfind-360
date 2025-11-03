# 🧪 Testing Real Building Data

## Quick Test Guide

Your FastFind360 app now displays **245,265 REAL buildings** from Google Open Buildings! Here's how to verify it's working:

## 🚀 Step 1: Start the App

The dev server is already running! Just open your browser:

```
http://localhost:5173
```

Or if it's not running:
```bash
npm run dev
```

## ✅ Step 2: Verify Data Loading

### Check Browser Console (F12)

You should see this output:

```
🌍 Loading Gombe building data from Open Buildings dataset...
📦 CSV file loaded, parsing buildings...
📊 Total buildings in dataset: 245264
📥 Loading 50000 buildings...
📍 Parsed 10000 / 50000 buildings...
📍 Parsed 20000 / 50000 buildings...
📍 Parsed 30000 / 50000 buildings...
📍 Parsed 40000 / 50000 buildings...
✅ Successfully loaded 50000 buildings from Open Buildings dataset
💡 Tip: Full dataset contains 245K+ buildings. Showing first 50K for performance.
```

**If you see this** ✅ Real data is loading correctly!

**If you see errors** ❌ Check troubleshooting section below

## 🗺️ Step 3: Visual Verification

### What to Look For:

1. **Building Distribution**
   - Buildings should cluster around Gombe city center
   - Natural, organic distribution (not uniform grid)
   - More buildings in urban areas, fewer in rural areas

2. **Building Shapes**
   - Complex polygon shapes (not just rectangles)
   - Varied sizes and orientations
   - Real-world building footprints

3. **Building Colors**
   - 🔵 Blue (Residential) - most common
   - 🟠 Orange (Commercial) - medium frequency
   - 🟣 Purple (Industrial) - rare, large buildings
   - 🟢 Green (Institutional) - schools, hospitals

4. **Map Coordinates**
   - Center: Gombe city (10.2897°N, 11.1672°E)
   - Zoom in to see individual buildings
   - Zoom out to see distribution

## 🔍 Step 4: Test Interactions

### Click a Building
1. Click any colored polygon on the map
2. Popup should show:
   - Building ID (e.g., "gombe_1234")
   - Type (residential/commercial/industrial/institutional)
   - Area in m² (actual measured area)
   - Confidence score (0.7-0.9)
   - Estimated value in Naira

### Expected Values:
- **Residential**: 50-300 m²
- **Commercial**: 200-1000 m²
- **Industrial**: 1000+ m²
- **Confidence**: 0.65-0.95 (real detection scores)

## 📊 Step 5: Check Statistics

In the sidebar dashboard, verify:

- **Total Buildings**: Should show ~50,000
- **Detection Accuracy**: Based on confidence scores
- **Classification Breakdown**: 
  - Residential: ~60-70%
  - Commercial: ~20-30%
  - Industrial: ~5-10%
  - Institutional: ~5%

## 🔧 Step 6: Test Filters

### Location Search
- Try searching: "Gombe Central", "Nasarawo", "Pantami"
- Map should fly to location
- Buildings should be visible in that area

### Building Type Filter
- Uncheck "Residential" - blue buildings disappear
- Check only "Commercial" - only orange buildings show
- Filter should work instantly

### Size Range Slider
- Move slider to show only large buildings (>500 m²)
- Smaller buildings should disappear
- Count should update

## 📥 Step 7: Export Data

1. Click "Export Data" button
2. CSV file should download
3. Open in Excel/Sheets
4. Should contain:
   - Building IDs (gombe_*)
   - Real coordinates
   - Actual areas
   - Classifications
   - Confidence scores

## 🐛 Troubleshooting

### Problem: "Failed to fetch building data"

**Solutions:**
1. Check if CSV file exists:
   ```bash
   ls -lh public/data/buildings/gombe_buildings.csv
   ```
   Should show ~2.5MB file

2. Restart dev server:
   ```bash
   # Kill existing server
   pkill -f vite
   
   # Start fresh
   npm run dev
   ```

### Problem: "Buildings not appearing"

**Solutions:**
1. Zoom in closer (buildings visible at zoom 12+)
2. Wait 10 seconds for parsing to complete
3. Check browser console for errors
4. Try refreshing the page (Cmd+R / Ctrl+R)

### Problem: "Loading takes too long"

**Solutions:**
1. Reduce building count in `src/hooks/useBuildingData.ts`:
   ```typescript
   // Line 28 - change 50000 to 10000
   const buildingData = await parseGombeBuildingsCSV(csvText, 10000);
   ```

2. Restart dev server after change

### Problem: "Map not loading"

**Solutions:**
1. Check Mapbox token in `.env.local`:
   ```bash
   cat .env.local | grep VITE_MAPBOX_TOKEN
   ```

2. Should show: `VITE_MAPBOX_TOKEN=pk.your_token_here`

3. If missing, add your Mapbox token

## 🎯 What's Different from Before?

### Old (Generated Data)
- ❌ Fake building positions
- ❌ Simple rectangular shapes
- ❌ 12,847 synthetic buildings
- ❌ Simulated confidence scores

### New (Real Data)
- ✅ Actual building locations
- ✅ Real building footprints
- ✅ 245,265 real buildings
- ✅ AI detection confidence scores

## 📈 Performance Benchmarks

| Action | Expected Time |
|--------|--------------|
| CSV Download | 1-2 seconds |
| CSV Parsing | 5-8 seconds |
| Map Rendering | 1-2 seconds |
| Total Load Time | 8-12 seconds |

**Note**: First 50K buildings out of 245K total

## 🔄 Adjusting Building Count

Want to load more or fewer buildings?

### Load 10,000 buildings (faster):
```typescript
// src/hooks/useBuildingData.ts, line 28
const buildingData = await parseGombeBuildingsCSV(csvText, 10000);
```

### Load 100,000 buildings (slower):
```typescript
// src/hooks/useBuildingData.ts, line 28
const buildingData = await parseGombeBuildingsCSV(csvText, 100000);
```

### Load ALL buildings (very slow):
```typescript
// src/hooks/useBuildingData.ts, line 28
const buildingData = await parseGombeBuildingsCSV(csvText);
```

**Save file and dev server will hot-reload!**

## ✅ Success Criteria

You've successfully verified the real data integration if:

- ✅ Console shows "Successfully loaded 50000 buildings"
- ✅ Map displays colored building polygons
- ✅ Buildings cluster around Gombe city
- ✅ Clicking buildings shows real data
- ✅ Shapes are complex (not just rectangles)
- ✅ Confidence scores are between 0.65-0.95
- ✅ Dashboard shows ~50,000 buildings
- ✅ Export works and shows real coordinates

## 🎉 Next Steps

Once verified:

1. **Show stakeholders** - Real data makes a huge difference!
2. **Test performance** - Try different building counts
3. **Explore data** - Click around, see real patterns
4. **Take screenshots** - Document the real data
5. **Plan deployment** - Consider vector tiles for production

## 📞 Need Help?

Check these files for more info:
- `INTEGRATION_SUMMARY.md` - Overall summary
- `REAL_DATA_INTEGRATION.md` - Technical details
- `BEFORE_AFTER_COMPARISON.md` - What changed
- Browser console - Detailed error messages

---

**Ready to test? Open http://localhost:5173 now! 🚀**
