import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, InfoWindow } from '@react-google-maps/api';
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

  const handlePolygonClick = useCallback((building: Building) => {
    onBuildingClick(building.id);
    const center = building.properties.latitude && building.properties.longitude
      ? { lat: building.properties.latitude, lng: building.properties.longitude }
      : getPolygonCenter(building.geometry.coordinates);
    
    setInfoWindowData({
      position: center,
      building,
    });
  }, [onBuildingClick]);

  const getPolygonCenter = (coordinates: number[][][]): google.maps.LatLngLiteral => {
    const coords = coordinates[0];
    const avgLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
    const avgLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
    return { lat: avgLat, lng: avgLng };
  };

  const convertToGoogleMapsPath = (coordinates: number[][][]): google.maps.LatLngLiteral[] => {
    return coordinates[0].map(coord => ({
      lat: coord[1],
      lng: coord[0],
    }));
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error loading map</h3>
          <p className="text-red-600 text-sm">{loadError.message}</p>
          <p className="text-red-600 text-sm mt-2">
            Please ensure VITE_GOOGLE_MAPS_API_KEY is set in your .env.local file
          </p>
        </div>
      </div>
    );
  }


  if (!isLoaded) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading high-resolution satellite map...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              </h3>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Type:</strong> {infoWindowData.building.properties.classification}
              </div>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Area:</strong> {formatNumber(infoWindowData.building.properties.area_in_meters)} m²
              </div>
              <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>Confidence:</strong> {infoWindowData.building.properties.confidence.toFixed(1)}%
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
}
