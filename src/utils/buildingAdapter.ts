import { Building } from '../types';

// Adapter to convert between the existing Building type structure
// and what components expect
export interface SimplifiedBuilding {
  id: string;
  type: string;
  area: number;
  confidence: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function adaptBuilding(building: Building): SimplifiedBuilding {
  // Get center coordinates from polygon
  const coords = building.geometry.coordinates[0][0];
  
  return {
    id: building.id,
    type: building.properties.classification,
    area: building.properties.area_in_meters,
    confidence: building.properties.confidence,
    coordinates: {
      lng: coords[0],
      lat: coords[1],
    },
  };
}

export function getBuildingCenter(building: Building): [number, number] {
  const coords = building.geometry.coordinates[0][0];
  return [coords[0], coords[1]];
}

