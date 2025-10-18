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
