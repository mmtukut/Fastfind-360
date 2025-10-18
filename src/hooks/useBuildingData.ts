import { useState, useEffect } from 'react';
import { Building, BuildingCollection } from '../types';
import { generateGombeBuildings } from '../utils/buildingGenerator';

export function useBuildingData() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBuildingData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from local file first
        // Using Google Open Buildings data for Gombe State
        try {
          const response = await fetch('/data/buildings/gombe_buildings.geojson');
          if (response.ok) {
            const data: BuildingCollection = await response.json();
            setBuildings(data.features);
            console.log(`✅ Loaded ${data.features.length} buildings from Google Open Buildings + FastFind360`);
            return;
          }
        } catch (err) {
          console.log('No building data file found, generating sample data...');
        }
        
        // Generate sample data
        const buildingData = generateGombeBuildings(12847);
        setBuildings(buildingData.features);
        console.log(`Generated ${buildingData.features.length} sample buildings`);
        
      } catch (err) {
        console.error('Error loading building data:', err);
        setError('Failed to load building data');
      } finally {
        setIsLoading(false);
      }
    };

    loadBuildingData();
  }, []);

  return { buildings, isLoading, error };
}
