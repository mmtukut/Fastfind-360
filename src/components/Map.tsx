import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building, BUILDING_COLORS } from '../types';
import { formatNaira, formatNumber } from '../utils/statistics';

interface MapProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  onBuildingClick: (buildingId: string) => void;
}

export interface MapHandle {
  flyTo: (coords: [number, number], zoom?: number) => void;
}

const Map = forwardRef<MapHandle, MapProps>(({ buildings, selectedBuildingId, onBuildingClick }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Expose flyTo method to parent components
  useImperativeHandle(ref, () => ({
    flyTo: (coords: [number, number], zoom = 15) => {
      if (map.current) {
        map.current.flyTo({
          center: coords,
          zoom: zoom,
          duration: 2000,
        });
      }
    },
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found. Please set VITE_MAPBOX_TOKEN in .env.local');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [11.1672, 10.2897], // Gombe coordinates
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add building layers when map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded || buildings.length === 0) return;

    const mapInstance = map.current;

    // Create GeoJSON from buildings
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: buildings.map((building, index) => ({
        type: 'Feature',
        id: index, // Use numeric ID for Mapbox feature state
        geometry: building.geometry,
        properties: {
          ...building.properties,
          buildingId: building.id, // Keep string ID as property
        },
      })),
    };

    // Remove existing sources and layers if they exist
    if (mapInstance.getLayer('buildings-fill')) {
      mapInstance.removeLayer('buildings-fill');
    }
    if (mapInstance.getLayer('buildings-outline')) {
      mapInstance.removeLayer('buildings-outline');
    }
    if (mapInstance.getLayer('buildings-selected')) {
      mapInstance.removeLayer('buildings-selected');
    }
    if (mapInstance.getSource('buildings')) {
      mapInstance.removeSource('buildings');
    }

    // Add source
    mapInstance.addSource('buildings', {
      type: 'geojson',
      data: geojson,
    });

    // Add fill layer
    mapInstance.addLayer({
      id: 'buildings-fill',
      type: 'fill',
      source: 'buildings',
      paint: {
        'fill-color': [
          'match',
          ['get', 'classification'],
          'residential',
          BUILDING_COLORS.residential,
          'commercial',
          BUILDING_COLORS.commercial,
          'industrial',
          BUILDING_COLORS.industrial,
          'institutional',
          BUILDING_COLORS.institutional,
          'mixed',
          BUILDING_COLORS.mixed,
          '#6B7280',
        ],
        'fill-opacity': 0.6,
      },
    });

    // Add outline layer
    mapInstance.addLayer({
      id: 'buildings-outline',
      type: 'line',
      source: 'buildings',
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 1,
      },
    });

    // Add selected building layer
    mapInstance.addLayer({
      id: 'buildings-selected',
      type: 'line',
      source: 'buildings',
      paint: {
        'line-color': '#FFFF00',
        'line-width': 3,
      },
      filter: ['==', ['id'], ''],
    });

    // Add hover effect
    let hoveredBuildingId: number | null = null;

    mapInstance.on('mousemove', 'buildings-fill', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredBuildingId !== null) {
          mapInstance.setFeatureState(
            { source: 'buildings', id: hoveredBuildingId },
            { hover: false }
          );
        }
        hoveredBuildingId = e.features[0].id as number;
        mapInstance.setFeatureState(
          { source: 'buildings', id: hoveredBuildingId },
          { hover: true }
        );
        mapInstance.getCanvas().style.cursor = 'pointer';
      }
    });

    mapInstance.on('mouseleave', 'buildings-fill', () => {
      if (hoveredBuildingId !== null) {
        mapInstance.setFeatureState(
          { source: 'buildings', id: hoveredBuildingId },
          { hover: false }
        );
      }
      hoveredBuildingId = null;
      mapInstance.getCanvas().style.cursor = '';
    });

    // Add click handler
    mapInstance.on('click', 'buildings-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const buildingId = feature.properties?.buildingId as string;
        onBuildingClick(buildingId);

        // Show popup
        const props = feature.properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="padding: 12px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e3a8a;">
                ${buildingId || 'Building ' + feature.id}
              </h3>
              <div style="margin-bottom: 6px; font-size: 12px;">
                <strong>Type:</strong> ${props?.classification || 'Unknown'}
              </div>
              <div style="margin-bottom: 6px; font-size: 12px;">
                <strong>Area:</strong> ${formatNumber(props?.area_in_meters || 0)} m²
              </div>
              <div style="margin-bottom: 6px; font-size: 12px;">
                <strong>Confidence:</strong> ${((props?.confidence || 0) * 100).toFixed(1)}%
              </div>
              <div style="margin-bottom: 6px; font-size: 12px;">
                <strong>Estimated Value:</strong> ${formatNaira(props?.estimatedValue || 0)}
              </div>
              <div style="background: #f0fdf4; padding: 6px; border-radius: 4px; margin-top: 8px; font-size: 11px; color: #166534;">
                Annual Tax: ${formatNaira((props?.estimatedValue || 0) * 0.01)}
              </div>
            </div>
          `
          )
          .addTo(mapInstance);
      }
    });
  }, [mapLoaded, buildings, onBuildingClick]);

  // Update selected building highlight
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;
    if (mapInstance.getLayer('buildings-selected')) {
      mapInstance.setFilter('buildings-selected', [
        '==',
        ['id'],
        selectedBuildingId || '',
      ]);
    }
  }, [selectedBuildingId, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold mb-3 text-gray-800">Building Types</h3>
        <div className="space-y-2">
          {Object.entries(BUILDING_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading map...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
