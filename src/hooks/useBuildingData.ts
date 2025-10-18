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
        
        // Try to load Open Buildings dataset first (priority)
        try {
          console.log('Loading Open Buildings dataset for Gombe...');
          const response = await fetch('/data/gombe_open_buildings.geojson');
          if (response.ok) {
            const data: BuildingCollection = await response.json();
            setBuildings(data.features);
            console.log(`✓ Loaded ${data.features.length} buildings from Open Buildings dataset`);
            console.log('Data source: Google Open Buildings');
            return;
          }
        } catch (err) {
          console.log('Open Buildings data not found, trying alternative sources...');
        }
        
        // Fallback: Try to load from legacy file
        try {
          const response = await fetch('/data/gombe_buildings.geojson');
          if (response.ok) {
            const data: BuildingCollection = await response.json();
            setBuildings(data.features);
            console.log(`Loaded ${data.features.length} buildings from legacy file`);
            return;
          }
        } catch (err) {
          console.log('No building data file found, generating sample data...');
        }
        
        // Last resort: Generate sample data
        console.warn('Using generated sample data. For production, run: python scripts/fetch_open_buildings.py');
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
