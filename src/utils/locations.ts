/**
 * Predefined locations in Gombe State for quick search
 */

export interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  zoom?: number;
}

export const GOMBE_LOCATIONS: Location[] = [
  {
    name: 'Gombe Central',
    coordinates: [11.1672, 10.2897],
    zoom: 14,
  },
  {
    name: 'Nasarawo',
    coordinates: [11.1450, 10.3100],
    zoom: 14,
  },
  {
    name: 'Tudun Wada',
    coordinates: [11.1900, 10.2700],
    zoom: 14,
  },
  {
    name: 'Herwagana',
    coordinates: [11.1820, 10.3010],
    zoom: 14,
  },
  {
    name: 'Pantami',
    coordinates: [11.1510, 10.2770],
    zoom: 14,
  },
  {
    name: 'Bajoga',
    coordinates: [11.2450, 10.3250],
    zoom: 14,
  },
  {
    name: 'Kumo',
    coordinates: [11.2100, 10.0500],
    zoom: 14,
  },
];

/**
 * Find a location by name (case-insensitive, partial match)
 */
export function findLocation(query: string): Location | null {
  if (!query) return null;
  
  const normalized = query.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = GOMBE_LOCATIONS.find(
    loc => loc.name.toLowerCase() === normalized
  );
  if (exactMatch) return exactMatch;
  
  // Try partial match
  const partialMatch = GOMBE_LOCATIONS.find(
    loc => loc.name.toLowerCase().includes(normalized)
  );
  
  return partialMatch || null;
}

/**
 * Get all location names for autocomplete
 */
export function getAllLocationNames(): string[] {
  return GOMBE_LOCATIONS.map(loc => loc.name);
}
