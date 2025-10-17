import { useState, useCallback } from 'react';
import { MapViewport, GOMBE_CENTER } from '../types';

export function useMapState() {
  const [viewport, setViewport] = useState<MapViewport>({
    longitude: GOMBE_CENTER[0],
    latitude: GOMBE_CENTER[1],
    zoom: 13,
  });

  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const updateViewport = useCallback((newViewport: Partial<MapViewport>) => {
    setViewport(prev => ({ ...prev, ...newViewport }));
  }, []);

  const flyTo = useCallback((longitude: number, latitude: number, zoom: number = 15) => {
    setViewport({ longitude, latitude, zoom });
  }, []);

  const selectBuilding = useCallback((buildingId: string | null) => {
    setSelectedBuildingId(buildingId);
  }, []);

  return {
    viewport,
    updateViewport,
    flyTo,
    selectedBuildingId,
    selectBuilding,
  };
}
