import { BuildingType, ClassificationResult } from '../types';

/**
 * Classify a building based on its characteristics
 */
export function classifyBuilding(
  area: number,
  nearRoad: boolean = false,
  shapeRegularity: number = 0.7
): ClassificationResult {
  let type: BuildingType;
  let confidence: number;
  let estimatedValue: number;

  // Classification logic based on area and characteristics
  if (area < 100) {
    type = 'residential';
    confidence = 85 + Math.random() * 10;
    estimatedValue = area * 500; // ₦500/sq meter
  } else if (area >= 100 && area < 300) {
    if (nearRoad && shapeRegularity > 0.6) {
      type = 'commercial';
      confidence = 75 + Math.random() * 10;
      estimatedValue = area * 1200; // ₦1200/sq meter
    } else {
      type = 'residential';
      confidence = 80 + Math.random() * 10;
      estimatedValue = area * 500;
    }
  } else if (area >= 300 && area < 500) {
    if (nearRoad) {
      type = 'commercial';
      confidence = 78 + Math.random() * 10;
      estimatedValue = area * 1200;
    } else {
      type = 'residential';
      confidence = 75 + Math.random() * 10;
      estimatedValue = area * 500;
    }
  } else if (area >= 500 && area < 1000) {
    if (nearRoad && shapeRegularity > 0.7) {
      type = 'commercial';
      confidence = 82 + Math.random() * 8;
      estimatedValue = area * 1200;
    } else if (shapeRegularity > 0.8) {
      type = 'institutional';
      confidence = 80 + Math.random() * 10;
      estimatedValue = area * 800;
    } else {
      type = 'mixed';
      confidence = 65 + Math.random() * 15;
      estimatedValue = area * 700;
    }
  } else {
    // Large buildings (>1000 sq meters)
    if (shapeRegularity < 0.6) {
      type = 'industrial';
      confidence = 85 + Math.random() * 10;
      estimatedValue = area * 600;
    } else if (shapeRegularity > 0.8) {
      type = 'institutional';
      confidence = 82 + Math.random() * 10;
      estimatedValue = area * 800;
    } else {
      type = 'industrial';
      confidence = 80 + Math.random() * 10;
      estimatedValue = area * 600;
    }
  }

  return {
    type,
    confidence: Math.min(Math.round(confidence * 10) / 10, 100),
    estimatedValue: Math.round(estimatedValue),
  };
}

/**
 * Calculate shape regularity (0-1, 1 being perfectly regular)
 */
export function calculateShapeRegularity(coordinates: number[][][]): number {
  // Simplified shape regularity calculation
  // In real implementation, would use perimeter-to-area ratio
  return 0.5 + Math.random() * 0.5;
}

/**
 * Check if building is near a major road
 * Simplified: randomly assign based on probability
 */
export function isNearRoad(): boolean {
  return Math.random() > 0.6; // 40% of buildings are near roads
}
