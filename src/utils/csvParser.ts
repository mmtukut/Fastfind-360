import Papa from 'papaparse';
import { Building } from '../types';
import { classifyBuilding } from './buildingClassifier';

/**
 * Parse WKT POLYGON string to GeoJSON coordinates
 * Example: "POLYGON((11.206 10.261, 11.207 10.262, ...))" -> [[[11.206, 10.261], [11.207, 10.262], ...]]
 */
function parseWKTPolygon(wkt: string): number[][][] | null {
  try {
    // CRITICAL: Remove ALL newlines first to prevent coordinate numbers from being split
    // The CSV has newlines WITHIN coordinate numbers (e.g., "11.1731\n298" instead of "11.1731298")
    const cleanWkt = wkt.replace(/[\r\n]+/g, '').trim();
    
    // Extract coordinates from WKT format
    // Support both single and multi-part polygons
    const match = cleanWkt.match(/POLYGON\(\((.*)\)\)/);
    if (!match) return null;
    
    const coordString = match[1];
    
    // Split by closing and opening parentheses for multi-part polygons
    const rings = coordString.split(/\)\s*,\s*\(/);
    
    const allRings = rings.map(ring => {
      // Split coordinate pairs by comma
      const coordPairs = ring.split(',').map(pair => pair.trim());
      
      const coordinates = coordPairs
        .map(pair => {
          // Split each pair by whitespace to get lon/lat
          const parts = pair.trim().split(/\s+/).filter(p => p.length > 0);
          if (parts.length !== 2) {
            console.warn(`Invalid coordinate pair: "${pair}" -> [${parts.join(', ')}]`);
            return null;
          }
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          
          // Validate coordinates
          if (isNaN(lon) || isNaN(lat)) {
            console.warn(`Invalid coordinate values: lon=${parts[0]}, lat=${parts[1]}`);
            return null;
          }
          
          // Basic sanity check for Gombe area (roughly 10-12°N, 10-12°E)
          if (lon < 10 || lon > 13 || lat < 9 || lat > 12) {
            console.warn(`Coordinate out of expected range: [${lon}, ${lat}]`);
            return null;
          }
          
          return [lon, lat];
        })
        .filter((coord): coord is [number, number] => coord !== null);
      
      // Ensure ring is closed
      if (coordinates.length > 0) {
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          coordinates.push([...first]);
        }
      }
      
      return coordinates;
    });
    
    // Return only the first ring for now (main polygon boundary)
    // TODO: Handle holes/multi-part polygons properly
    return [allRings[0]];
  } catch (error) {
    console.error('Error parsing WKT:', error);
    return null;
  }
}

/**
 * Calculate shape regularity from polygon coordinates
 */
function calculateShapeRegularity(coordinates: number[][][]): number {
  if (!coordinates || !coordinates[0] || coordinates[0].length < 4) {
    return 0.5;
  }
  
  const points = coordinates[0];
  const numPoints = points.length - 1; // Exclude closing point
  
  // Simple regularity: more points = less regular (typically)
  // Regular buildings have 4-6 points
  if (numPoints <= 6) {
    return 0.8 + Math.random() * 0.2;
  } else {
    return 0.5 + Math.random() * 0.3;
  }
}

/**
 * Parse CSV row to Building object
 */
function parseCSVRow(row: any, index: number): Building | null {
  try {
    // row is already parsed by papaparse as an object
    const latitude = parseFloat(row.latitude);
    const longitude = parseFloat(row.longitude);
    const area = parseFloat(row.area_in_meters);
    const confidence = parseFloat(row.confidence);
    const geometry = row.geometry;
    
    // Validate data
    if (isNaN(latitude) || isNaN(longitude) || isNaN(area) || isNaN(confidence)) {
      return null;
    }
    
    if (!geometry || typeof geometry !== 'string') {
      return null;
    }
    
    // Parse geometry
    const coordinates = parseWKTPolygon(geometry);
    if (!coordinates) {
      return null;
    }
    
    // Calculate building characteristics
    const shapeRegularity = calculateShapeRegularity(coordinates);
    const nearRoad = Math.random() > 0.5; // We don't have road data, so random for now
    
    // Classify building based on area and characteristics
    const classification = classifyBuilding(area, nearRoad, shapeRegularity);
    
    // Create building object
    const building: Building = {
      id: `gombe_${index}`,
      geometry: {
        type: 'Polygon',
        coordinates,
      },
      properties: {
        area_in_meters: Math.round(area),
        classification: classification.type,
        confidence: confidence,
        nearRoad,
        estimatedValue: classification.estimatedValue,
        detectedAt: new Date().toISOString(),
        numericId: index, // Add numeric ID for Mapbox feature state
      },
    };
    
    return building;
  } catch (error) {
    console.error('Error parsing CSV row:', error);
    return null;
  }
}

/**
 * Parse CSV file and return array of Buildings
 * @param csvText - The CSV file content as text
 * @param maxBuildings - Optional limit on number of buildings to load (for performance)
 */
export async function parseGombeBuildingsCSV(
  csvText: string,
  maxBuildings?: number
): Promise<Building[]> {
  return new Promise((resolve, reject) => {
    try {
      const buildings: Building[] = [];
      let rowCount = 0;
      
      console.log(`📊 Parsing CSV file with PapaParse...`);
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        step: (result) => {
          rowCount++;
          
          // Stop if we've reached the limit
          if (maxBuildings && buildings.length >= maxBuildings) {
            return;
          }
          
          const building = parseCSVRow(result.data, rowCount);
          if (building) {
            buildings.push(building);
          }
          
          // Progress logging for large datasets
          if (rowCount % 10000 === 0) {
            console.log(`📍 Parsed ${buildings.length} buildings from ${rowCount} rows...`);
          }
        },
        complete: () => {
          console.log(`✅ Successfully loaded ${buildings.length} buildings from ${rowCount} CSV rows`);
          if (maxBuildings && buildings.length < maxBuildings) {
            console.log(`💡 Note: Requested ${maxBuildings} but only ${buildings.length} valid buildings found`);
          }
          resolve(buildings);
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        },
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      reject(error);
    }
  });
}
