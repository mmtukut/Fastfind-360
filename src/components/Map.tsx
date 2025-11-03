import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, InfoWindow } from '@react-google-maps/api';
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

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 10.2897, // Gombe latitude
  lng: 11.1672, // Gombe longitude
};

const mapOptions: google.maps.MapOptions = {
  mapTypeId: 'satellite',
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    position: google.maps.ControlPosition.TOP_CENTER,
  },
  streetViewControl: false,
  fullscreenControl: true,
  zoomControl: true,
};
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

export default function Map({ buildings, selectedBuildingId, onBuildingClick }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [infoWindowData, setInfoWindowData] = useState<{
    position: google.maps.LatLngLiteral;
    building: Building;
  } | null>(null);

  const onLoad = useCallback((_map: google.maps.Map) => {
    // Map is loaded and ready
  }, []);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
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
    if (mapInstance.getLayer('clusters')) {
      mapInstance.removeLayer('clusters');
    }
    if (mapInstance.getLayer('cluster-count')) {
      mapInstance.removeLayer('cluster-count');
    }
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

    // Add source with clustering
    mapInstance.addSource('buildings', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points
    });

    // Add cluster circle layer
    mapInstance.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'buildings',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#3B82F6',
          100,
          '#F59E0B',
          500,
          '#EF4444',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          500,
          40,
        ],
        'circle-opacity': 0.8,
      },
    });

    // Add cluster count layer
    mapInstance.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'buildings',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });

    // Add fill layer (for unclustered points)
    mapInstance.addLayer({
      id: 'buildings-fill',
      type: 'fill',
      source: 'buildings',
      filter: ['!', ['has', 'point_count']],
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
      filter: ['!', ['has', 'point_count']],
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 1,
      },
    });
  }, [onBuildingClick]);

    // Add selected building layer
    mapInstance.addLayer({
      id: 'buildings-selected',
      type: 'line',
      source: 'buildings',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['id'], '']],
      paint: {
        'line-color': '#FFFF00',
        'line-width': 3,
      },
    });

    // Click handler for clusters
    mapInstance.on('click', 'clusters', (e) => {
      if (!e.features || !e.features.length) return;
      
      const features = e.features;
      const clusterId = features[0].properties?.cluster_id;
      const source = mapInstance.getSource('buildings') as mapboxgl.GeoJSONSource;
      
      if (source && source.getClusterExpansionZoom) {
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          
          mapInstance.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom,
          });
        });
      }
    });

    // Change cursor on cluster hover
    mapInstance.on('mouseenter', 'clusters', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    mapInstance.on('mouseleave', 'clusters', () => {
      mapInstance.getCanvas().style.cursor = '';
    });

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Render building polygons */}
        {buildings.map((building) => {
          const isSelected = building.id === selectedBuildingId;
          const isHovered = building.id === hoveredBuildingId;
          
          return (
            <Polygon
              key={building.id}
              paths={convertToGoogleMapsPath(building.geometry.coordinates)}
              options={{
                fillColor: BUILDING_COLORS[building.properties.classification] || '#6B7280',
                fillOpacity: isSelected ? 0.8 : isHovered ? 0.7 : 0.5,
                strokeColor: isSelected ? '#FFFF00' : '#FFFFFF',
                strokeOpacity: 1,
                strokeWeight: isSelected ? 3 : 1,
                clickable: true,
                zIndex: isSelected ? 100 : isHovered ? 50 : 1,
              }}
              onClick={() => handlePolygonClick(building)}
              onMouseOver={() => setHoveredBuildingId(building.id)}
              onMouseOut={() => setHoveredBuildingId(null)}
            />
          );
        })}

        {/* Info Window */}
        {infoWindowData && (
          <InfoWindow
            position={infoWindowData.position}
            onCloseClick={() => setInfoWindowData(null)}
          >
            <div style={{ padding: '12px', minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>
                {infoWindowData.building.id}
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
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Type:</strong> {infoWindowData.building.properties.classification}
              </div>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Area:</strong> {formatNumber(infoWindowData.building.properties.area_in_meters)} m²
              </div>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Confidence:</strong> {infoWindowData.building.properties.confidence.toFixed(1)}%
              <div style="margin-bottom: 6px; font-size: 12px;">
                <strong>Confidence:</strong> ${((props?.confidence || 0) * 100).toFixed(1)}%
              </div>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Estimated Value:</strong> {formatNaira(infoWindowData.building.properties.estimatedValue)}
              </div>
              <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '4px', marginTop: '8px', fontSize: '11px', color: '#166534' }}>
                Annual Tax: {formatNaira(infoWindowData.building.properties.estimatedValue * 0.01)}
              </div>
              {infoWindowData.building.properties.full_plus_code && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>
                  Plus Code: {infoWindowData.building.properties.full_plus_code}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
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
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <strong>Data Source:</strong> Open Buildings
          </div>
          <div className="text-xs text-gray-600">
            <strong>Imagery:</strong> Google Satellite
          </div>
        </div>
      </div>

      {/* Building count indicator */}
      <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
        <div className="text-sm text-gray-700">
          <strong>{buildings.length.toLocaleString()}</strong> buildings detected
        </div>
      </div>
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
