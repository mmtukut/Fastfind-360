import { Building, BuildingCollection, GOMBE_BBOX } from '../types';
import { classifyBuilding, calculateShapeRegularity, isNearRoad } from './buildingClassifier';

/**
 * Generate a realistic building polygon around a center point
 */
function generateBuildingPolygon(
  centerLon: number,
  centerLat: number,
  area: number
): number[][][] {
  // Calculate approximate side length for square building
  const sideLength = Math.sqrt(area);
  
  // Convert meters to degrees (approximate)
  const lonOffset = (sideLength / 111320) * (Math.random() * 0.4 + 0.8); // Add variation
  const latOffset = (sideLength / 110540) * (Math.random() * 0.4 + 0.8);
  
  // Create a roughly rectangular polygon with slight variations
  const angle = Math.random() * Math.PI / 6; // Random rotation up to 30 degrees
  const aspectRatio = 0.6 + Math.random() * 0.8; // 0.6 to 1.4
  
  const points = [
    [centerLon - lonOffset / 2, centerLat - latOffset * aspectRatio / 2],
    [centerLon + lonOffset / 2, centerLat - latOffset * aspectRatio / 2],
    [centerLon + lonOffset / 2, centerLat + latOffset * aspectRatio / 2],
    [centerLon - lonOffset / 2, centerLat + latOffset * aspectRatio / 2],
    [centerLon - lonOffset / 2, centerLat - latOffset * aspectRatio / 2], // Close the polygon
  ];
  
  return [points];
}

/**
 * Generate building distribution pattern
 * Returns cluster centers with density information
 */
function generateClusterCenters(): Array<{ lon: number; lat: number; density: number }> {
  const clusters = [];
  
  // Gombe Central - High density
  clusters.push({ lon: 11.1672, lat: 10.2897, density: 0.3 });
  
  // Nasarawo - Medium-high density
  clusters.push({ lon: 11.175, lat: 10.295, density: 0.2 });
  
  // Tudun Wada - Medium density
  clusters.push({ lon: 11.159, lat: 10.284, density: 0.15 });
  
  // Herwagana - Medium density
  clusters.push({ lon: 11.182, lat: 10.301, density: 0.12 });
  
  // Pantami - Low-medium density
  clusters.push({ lon: 11.151, lat: 10.277, density: 0.1 });
  
  //散布 additional clusters
  for (let i = 0; i < 10; i++) {
    clusters.push({
      lon: GOMBE_BBOX.minLng + Math.random() * (GOMBE_BBOX.maxLng - GOMBE_BBOX.minLng),
      lat: GOMBE_BBOX.minLat + Math.random() * (GOMBE_BBOX.maxLat - GOMBE_BBOX.minLat),
      density: 0.03 + Math.random() * 0.07,
    });
  }
  
  return clusters;
}

/**
 * Generate realistic building size distribution
 */
function generateBuildingSize(): number {
  const rand = Math.random();
  
  // Realistic distribution: most buildings are small
  if (rand < 0.6) {
    // 60% small residential (50-200 sq meters)
    return 50 + Math.random() * 150;
  } else if (rand < 0.85) {
    // 25% medium residential/small commercial (200-500 sq meters)
    return 200 + Math.random() * 300;
  } else if (rand < 0.95) {
    // 10% commercial/institutional (500-1000 sq meters)
    return 500 + Math.random() * 500;
  } else {
    // 5% large commercial/industrial (1000-2000 sq meters)
    return 1000 + Math.random() * 1000;
  }
}

/**
 * Generate sample building data for Gombe State
 */
export function generateGombeBuildings(count: number = 12847): BuildingCollection {
  const buildings: Building[] = [];
  const clusters = generateClusterCenters();
  
  console.log(`Generating ${count} buildings for Gombe State...`);
  
  for (let i = 0; i < count; i++) {
    // Select cluster based on density
    const totalDensity = clusters.reduce((sum, c) => sum + c.density, 0);
    let random = Math.random() * totalDensity;
    let selectedCluster = clusters[0];
    
    for (const cluster of clusters) {
      random -= cluster.density;
      if (random <= 0) {
        selectedCluster = cluster;
        break;
      }
    }
    
    // Generate position near cluster with some spread
    const spread = 0.01 + Math.random() * 0.02; // Spread radius
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * spread;
    
    const lon = selectedCluster.lon + Math.cos(angle) * distance;
    const lat = selectedCluster.lat + Math.sin(angle) * distance;
    
    // Ensure within Gombe bounds
    if (
      lon < GOMBE_BBOX.minLng || lon > GOMBE_BBOX.maxLng ||
      lat < GOMBE_BBOX.minLat || lat > GOMBE_BBOX.maxLat
    ) {
      continue;
    }
    
    // Generate building characteristics
    const area = generateBuildingSize();
    const nearRoad = isNearRoad();
    const geometry = generateBuildingPolygon(lon, lat, area);
    const shapeRegularity = calculateShapeRegularity(geometry);
    
    // Classify building
    const classification = classifyBuilding(area, nearRoad, shapeRegularity);
    
    // Create building feature
    const building: Building = {
      id: `building_${i + 1}`,
      geometry: {
        type: 'Polygon',
        coordinates: geometry,
      },
      properties: {
        area_in_meters: Math.round(area),
        classification: classification.type,
        confidence: classification.confidence,
        nearRoad,
        estimatedValue: classification.estimatedValue,
        detectedAt: new Date().toISOString(),
      },
    };
    
    buildings.push(building);
  }
  
  console.log(`Generated ${buildings.length} buildings`);
  
  return {
    type: 'FeatureCollection',
    features: buildings,
  };
}
