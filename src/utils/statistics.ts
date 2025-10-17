import { Building, Statistics, BuildingType } from '../types';

/**
 * Calculate statistics from building data
 */
export function calculateStatistics(buildings: Building[]): Statistics {
  const classifications = {
    residential: 0,
    commercial: 0,
    industrial: 0,
    institutional: 0,
    mixed: 0,
  };
  
  let totalArea = 0;
  let totalConfidence = 0;
  let totalRevenue = 0;
  
  buildings.forEach(building => {
    const type = building.properties.classification;
    classifications[type]++;
    totalArea += building.properties.area_in_meters;
    totalConfidence += building.properties.confidence;
    totalRevenue += building.properties.estimatedValue;
  });
  
  const averageConfidence = totalConfidence / buildings.length;
  const averageBuildingSize = totalArea / buildings.length;
  
  // Calculate potential revenue in billions (assuming annual property tax)
  const potentialRevenue = totalRevenue / 1_000_000_000;
  
  return {
    totalBuildings: buildings.length,
    detectionAccuracy: Math.round(averageConfidence * 10) / 10,
    areaCovered: 4, // Gombe State LGAs
    potentialRevenue: Math.round(potentialRevenue * 10) / 10,
    classifications,
    totalArea: Math.round(totalArea / 1_000_000 * 100) / 100, // Convert to sq km
    averageBuildingSize: Math.round(averageBuildingSize),
  };
}

/**
 * Format number as Nigerian Naira
 */
export function formatNaira(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }
  return `₦${amount.toFixed(0)}`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
