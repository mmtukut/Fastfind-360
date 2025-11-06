Concise implementation prompt:

```markdown
# Building Detection & Mapping System - Implementation Guide

## Core Architecture

**Tech Stack**: React 18 + TypeScript + Vite + Mapbox GL JS + PapaParse

## 1. Data Structure

```typescript
interface Building {
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
  };
  properties: {
    area_in_meters: number;
    classification: 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed';
    confidence: number;
    nearRoad: boolean;
    estimatedValue: number;
    detectedAt: string;
  };
}
```

## 2. CSV Parser (gombe_buildings.csv)

**Key Function**: `parseGombeBuildingsCSV(csvText: string)`

**Critical Steps**:
1. Use PapaParse with `header: true` and `step` callback for streaming
2. Parse WKT POLYGON strings: `"POLYGON((11.206 10.261, 11.207 10.262, ...))"`
3. **CRITICAL**: Remove ALL newlines first: `wkt.replace(/[\r\n]+/g, '')` - CSV has newlines within coordinate numbers
4. Extract coordinates: Split by `,` then by whitespace to get `[lon, lat]` pairs
5. Validate: Check coordinates are within expected bounds (10-13°E, 9-12°N)
6. Close polygon: Ensure first point equals last point
7. Classify building using area, shape regularity, and road proximity

**WKT Parsing Logic**:
```typescript
function parseWKTPolygon(wkt: string): number[][][] | null {
  const cleanWkt = wkt.replace(/[\r\n]+/g, '').trim();
  const match = cleanWkt.match(/POLYGON\(\((.*)\)\)/);
  if (!match) return null;
  
  const coordPairs = match[1].split(',').map(pair => pair.trim());
  const coordinates = coordPairs
    .map(pair => {
      const parts = pair.trim().split(/\s+/).filter(p => p.length > 0);
      if (parts.length !== 2) return null;
      return [parseFloat(parts[0]), parseFloat(parts[1])];
    })
    .filter(coord => coord !== null);
  
  // Close polygon if needed
  if (coordinates[0] !== coordinates[coordinates.length - 1]) {
    coordinates.push([...coordinates[0]]);
  }
  
  return [coordinates];
}
```

## 3. Mapbox Integration

**Initialization**:
- Use `mapbox-gl` library
- Set token from `VITE_MAPBOX_TOKEN` env variable
- Center: `[11.1672, 10.2897]` (Gombe coordinates)
- Style: `'mapbox://styles/mapbox/satellite-streets-v12'`

**Building Layer Rendering**:
1. Convert Building[] to GeoJSON FeatureCollection
2. Add source: `map.addSource('buildings', { type: 'geojson', data: geojson })`
3. Add fill layer with color based on classification:
   ```typescript
   'fill-color': [
     'match',
     ['get', 'classification'],
     'residential', '#3B82F6',
     'commercial', '#F59E0B',
     'industrial', '#8B5CF6',
     'institutional', '#10B981',
     'mixed', '#6B7280',
     '#6B7280'
   ]
   ```
4. Add outline layer (white, 1px width)
5. Add selected building layer (yellow, 3px width) with filter

**Interactions**:
- Click: Get feature → extract `buildingId` from properties → trigger modal
- Hover: Use `setFeatureState` for hover effects
- Popup: Show building details on click using `mapboxgl.Popup`

## 4. Building Classification

**Function**: `classifyBuilding(area, nearRoad, shapeRegularity)`

**Rules**:
- **Residential**: <300 sqm, OR (300-500 sqm AND not near road)
- **Commercial**: 200-1000 sqm AND near road AND shapeRegularity > 0.6
- **Industrial**: >1000 sqm AND shapeRegularity < 0.6
- **Institutional**: >500 sqm AND shapeRegularity > 0.8
- **Mixed**: 500-1000 sqm, irregular shape

**Value Estimation**:
- Residential: area × ₦500
- Commercial: area × ₦1200
- Industrial: area × ₦600
- Institutional: area × ₦800
- Mixed: area × ₦700

## 5. Data Flow

```
CSV File → PapaParse (streaming) → parseWKTPolygon() → Building object → 
classifyBuilding() → Building[] → useBuildingData hook → 
App component → Map component → GeoJSON → Mapbox layers
```

**Hook Structure**:
```typescript
useBuildingData() {
  - Fetch CSV from /data/buildings/gombe_buildings.csv
  - Parse with parseGombeBuildingsCSV()
  - Return { buildings, isLoading, error }
}
```

## 6. Property Detail Modal

**Trigger**: Click building on map → `onBuildingClick(buildingId)` → `selectBuilding(id)` → Modal shows

**Display**:
- Building ID, classification badge (colored)
- Confidence percentage (color-coded: green ≥90%, blue ≥70%, yellow <70%)
- Area in square meters
- Coordinates (lat/lng)
- Estimated value in Naira
- Detection metadata (source, method, date)

**Implementation**: Fixed overlay with backdrop, scrollable content, close button

## 7. Performance Optimizations

- Limit CSV parsing: `parseGombeBuildingsCSV(csvText, 50000)` for first 50K buildings
- Remove/re-add layers on data update (don't just update source)
- Use `useMemo` for filtered buildings
- Progress logging every 10K rows during CSV parsing

## 8. Key Files Structure

```
src/
  utils/
    csvParser.ts          # WKT parsing, CSV → Building[]
    buildingClassifier.ts # Classification logic
    buildingAdapter.ts    # Coordinate extraction helpers
  hooks/
    useBuildingData.ts    # CSV loading & parsing
    useFilters.ts         # Filtering logic
    useMapState.ts        # Selected building state
  components/
    Map.tsx               # Mapbox integration, layers, interactions
    PropertyDetailModal.tsx # Building detail display
  types/
    index.ts             # Building interface, colors, constants
```

## 9. Critical Implementation Notes

1. **WKT Parsing**: Must handle newlines within coordinate strings - remove ALL newlines before parsing
2. **Polygon Closure**: Always ensure first coordinate equals last coordinate
3. **Mapbox IDs**: Use numeric IDs for feature state, keep string IDs in properties
4. **Layer Management**: Remove existing layers before adding new ones to prevent duplicates
5. **Coordinate Order**: GeoJSON uses `[longitude, latitude]` (not lat/lng)
6. **Error Handling**: Validate coordinates, handle NaN values, filter invalid buildings

## 10. Dependencies

```json
{
  "mapbox-gl": "^3.0.1",
  "papaparse": "^5.5.3",
  "react": "^18.2.0",
  "typescript": "^5.2.2"
}
```

**Environment Variable**: `VITE_MAPBOX_TOKEN` (required)
```

This prompt covers the core implementation details for replicating the system.