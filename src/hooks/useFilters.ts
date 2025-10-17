import { useState, useCallback, useMemo } from 'react';
import { Building, BuildingType, FilterState } from '../types';

const initialFilterState: FilterState = {
  buildingTypes: ['residential', 'commercial', 'industrial', 'institutional', 'mixed'],
  sizeRange: [0, 2000],
  confidenceRange: [0, 100],
  searchQuery: '',
};

export function useFilters(buildings: Building[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateBuildingTypes = useCallback((types: BuildingType[]) => {
    setFilters(prev => ({ ...prev, buildingTypes: types }));
  }, []);

  const updateSizeRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({ ...prev, sizeRange: range }));
  }, []);

  const updateConfidenceRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({ ...prev, confidenceRange: range }));
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  // Filter buildings based on current filters
  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      const { classification, area_in_meters, confidence } = building.properties;
      
      // Check building type
      if (!filters.buildingTypes.includes(classification)) {
        return false;
      }
      
      // Check size range
      if (area_in_meters < filters.sizeRange[0] || area_in_meters > filters.sizeRange[1]) {
        return false;
      }
      
      // Check confidence range
      if (confidence < filters.confidenceRange[0] || confidence > filters.confidenceRange[1]) {
        return false;
      }
      
      // Check search query (if any)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesId = building.id.toLowerCase().includes(query);
        const matchesType = classification.toLowerCase().includes(query);
        const matchesAddress = building.properties.address?.toLowerCase().includes(query);
        
        return matchesId || matchesType || matchesAddress;
      }
      
      return true;
    });
  }, [buildings, filters]);

  return {
    filters,
    updateBuildingTypes,
    updateSizeRange,
    updateConfidenceRange,
    updateSearchQuery,
    resetFilters,
    filteredBuildings,
  };
}
