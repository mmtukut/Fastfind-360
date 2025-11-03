// Building Types
export interface Building {
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    area_in_meters: number;
    classification: BuildingType;
    confidence: number;
    nearRoad: boolean;
    estimatedValue: number;
    address?: string;
    detectedAt: string;
    latitude?: number;
    longitude?: number;
    full_plus_code?: string;
    numericId?: number;
  };
}

export type BuildingType = 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed';

export interface BuildingCollection {
  type: 'FeatureCollection';
  features: Building[];
}

// Classification Result
export interface ClassificationResult {
  type: BuildingType;
  confidence: number;
  estimatedValue: number;
}

// Statistics
export interface Statistics {
  totalBuildings: number;
  detectionAccuracy: number;
  areaCovered: number;
  potentialRevenue: number;
  classifications: {
    residential: number;
    commercial: number;
    industrial: number;
    institutional: number;
    mixed: number;
  };
  totalArea: number;
  averageBuildingSize: number;
}

// Map State
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

// Filter State
export interface FilterState {
  buildingTypes: BuildingType[];
  sizeRange: [number, number];
  confidenceRange: [number, number];
  searchQuery: string;
}

// Gombe State Coordinates
export const GOMBE_CENTER: [number, number] = [11.1672, 10.2897];
export const GOMBE_BBOX = {
  minLng: 11.05,
  minLat: 10.15,
  maxLng: 11.35,
  maxLat: 10.45,
};

// Building colors by type
export const BUILDING_COLORS: Record<BuildingType, string> = {
  residential: '#3B82F6',
  commercial: '#F59E0B',
  industrial: '#8B5CF6',
  institutional: '#10B981',
  mixed: '#6B7280',
};
