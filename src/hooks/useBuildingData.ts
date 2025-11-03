import { useState, useEffect } from 'react';
import { Building } from '../types';
import { parseGombeBuildingsCSV } from '../utils/csvParser';

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
        // Load real building data from Open Buildings CSV
        console.log('🌍 Loading Gombe building data from Open Buildings dataset...');
        const response = await fetch('/data/buildings/gombe_buildings.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch building data: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        console.log(`📦 CSV file loaded (${(csvText.length / 1024 / 1024).toFixed(2)} MB), parsing buildings...`);
        
        // Load first 50,000 buildings for better performance
        // TODO: Implement clustering/tiling for full 245K+ dataset
        const buildingData = await parseGombeBuildingsCSV(csvText, 50000);
        setBuildings(buildingData);
        
        console.log(`✅ Successfully loaded ${buildingData.length} real buildings from Open Buildings!`);
        console.log('💡 Tip: Full dataset contains 245K+ buildings. Adjust limit in useBuildingData.ts if needed.');
        
      } catch (err) {
        console.error('Error loading building data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load building data');
      } finally {
        setIsLoading(false);
      }
    };

    loadBuildingData();
  }, []);

  return { buildings, isLoading, error };
}
