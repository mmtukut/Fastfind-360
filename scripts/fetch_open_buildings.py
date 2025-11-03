#!/usr/bin/env python3
"""
Fetch Open Buildings dataset for Gombe State, Nigeria
This script downloads building footprints from Google's Open Buildings dataset
for the Gombe region and converts them to GeoJSON format.
"""

import json
import os
from typing import List, Dict, Any

# Gombe State bounding box
GOMBE_BBOX = {
    "min_lat": 10.15,
    "max_lat": 10.45,
    "min_lng": 11.05,
    "max_lng": 11.35
}

def fetch_gombe_buildings() -> List[Dict[str, Any]]:
    """
    Fetch building data for Gombe State from Open Buildings dataset.
    
    For now, this creates a sample structure. In production, you would:
    1. Use kagglehub to download the dataset
    2. Filter for Gombe region using the bounding box
    3. Parse CSV files and convert to GeoJSON
    """
    
    try:
        # Try to import kagglehub if available
        import kagglehub
        from kagglehub import KaggleDatasetAdapter
        import pandas as pd
        
        print("Downloading Open Buildings dataset for Gombe region...")
        print(f"Bounding Box: {GOMBE_BBOX}")
        
        # Download the dataset
        # Note: You may need to set KAGGLE_USERNAME and KAGGLE_KEY environment variables
        df = kagglehub.load_dataset(
            KaggleDatasetAdapter.PANDAS,
            "paultimothymooney/open-buildings",
            "",  # file_path - empty to get all files
        )
        
        # Filter for Gombe region
        gombe_buildings = df[
            (df['latitude'] >= GOMBE_BBOX['min_lat']) &
            (df['latitude'] <= GOMBE_BBOX['max_lat']) &
            (df['longitude'] >= GOMBE_BBOX['min_lng']) &
            (df['longitude'] <= GOMBE_BBOX['max_lng'])
        ]
        
        print(f"Found {len(gombe_buildings)} buildings in Gombe region")
        
        # Convert to GeoJSON features
        buildings = []
        for idx, row in gombe_buildings.iterrows():
            # Parse WKT geometry
            from shapely import wkt
            geometry = wkt.loads(row['geometry'])
            
            # Classify building based on area
            area = row['area_in_meters']
            if area < 200:
                classification = 'residential'
            elif area < 500:
                classification = 'commercial'
            elif area < 1000:
                classification = 'institutional'
            else:
                classification = 'industrial'
            
            # Calculate estimated value (simplified)
            value_per_sqm = {
                'residential': 150000,  # NGN per sq meter
                'commercial': 300000,
                'institutional': 200000,
                'industrial': 100000
            }
            estimated_value = area * value_per_sqm[classification]
            
            building = {
                "id": f"ob_{idx}",
                "geometry": {
                    "type": geometry.geom_type,
                    "coordinates": list(geometry.exterior.coords) if geometry.geom_type == 'Polygon' else list(geometry.geoms[0].exterior.coords)
                },
                "properties": {
                    "area_in_meters": float(area),
                    "classification": classification,
                    "confidence": float(row['confidence']) * 100,  # Convert to percentage
                    "nearRoad": True,  # Simplified
                    "estimatedValue": int(estimated_value),
                    "detectedAt": "2024-01-01T00:00:00.000Z",
                    "latitude": float(row['latitude']),
                    "longitude": float(row['longitude']),
                    "full_plus_code": row.get('full_plus_code', '')
                }
            }
            buildings.append(building)
        
        return buildings
        
    except ImportError:
        print("kagglehub not installed. Install with: pip install kagglehub pandas shapely")
        print("Generating sample Open Buildings format data...")
        return generate_sample_open_buildings_data()

def generate_sample_open_buildings_data() -> List[Dict[str, Any]]:
    """Generate sample data in Open Buildings format for testing"""
    import random
    
    buildings = []
    num_buildings = 5000  # Sample size
    
    print(f"Generating {num_buildings} sample buildings for Gombe...")
    
    for i in range(num_buildings):
        # Random location within Gombe bounds
        lat = random.uniform(GOMBE_BBOX['min_lat'], GOMBE_BBOX['max_lat'])
        lng = random.uniform(GOMBE_BBOX['min_lng'], GOMBE_BBOX['max_lng'])
        
        # Random building size
        area = random.choice([
            random.uniform(50, 200),    # 60% residential
            random.uniform(200, 500),   # 25% commercial
            random.uniform(500, 1000),  # 10% institutional
            random.uniform(1000, 2000)  # 5% industrial
        ])
        
        # Classify building
        if area < 200:
            classification = 'residential'
        elif area < 500:
            classification = 'commercial'
        elif area < 1000:
            classification = 'institutional'
        else:
            classification = 'industrial'
        
        # Calculate estimated value
        value_per_sqm = {
            'residential': 150000,
            'commercial': 300000,
            'institutional': 200000,
            'industrial': 100000
        }
        estimated_value = area * value_per_sqm[classification]
        
        # Generate simple rectangular polygon
        size_deg_lng = (area ** 0.5) / 111320
        size_deg_lat = (area ** 0.5) / 110540
        
        coords = [
            [lng - size_deg_lng/2, lat - size_deg_lat/2],
            [lng + size_deg_lng/2, lat - size_deg_lat/2],
            [lng + size_deg_lng/2, lat + size_deg_lat/2],
            [lng - size_deg_lng/2, lat + size_deg_lat/2],
            [lng - size_deg_lng/2, lat - size_deg_lat/2]
        ]
        
        building = {
            "id": f"ob_gombe_{i+1}",
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            },
            "properties": {
                "area_in_meters": round(area, 2),
                "classification": classification,
                "confidence": round(random.uniform(65, 95), 1),
                "nearRoad": random.choice([True, False]),
                "estimatedValue": int(estimated_value),
                "detectedAt": "2024-01-01T00:00:00.000Z",
                "latitude": lat,
                "longitude": lng,
                "full_plus_code": f"6FX{random.randint(10000, 99999)}"
            }
        }
        buildings.append(building)
    
    return buildings

def save_geojson(buildings: List[Dict[str, Any]], output_path: str):
    """Save buildings as GeoJSON file"""
    geojson = {
        "type": "FeatureCollection",
        "features": buildings
    }
    
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"Saved {len(buildings)} buildings to {output_path}")

if __name__ == "__main__":
    print("=" * 60)
    print("Open Buildings Dataset Fetcher for Gombe State")
    print("=" * 60)
    
    buildings = fetch_gombe_buildings()
    
    # Save to public directory for frontend access
    output_path = "../public/data/gombe_open_buildings.geojson"
    save_geojson(buildings, output_path)
    
    # Print statistics
    print("\nDataset Statistics:")
    print(f"Total Buildings: {len(buildings)}")
    
    classifications = {}
    for b in buildings:
        cls = b['properties']['classification']
        classifications[cls] = classifications.get(cls, 0) + 1
    
    for cls, count in sorted(classifications.items()):
        print(f"  {cls.capitalize()}: {count}")
    
    print("\n✓ Data ready for use in FastFind360!")
    print(f"✓ Location: {output_path}")
