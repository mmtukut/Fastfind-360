import { useState, useMemo, useRef } from 'react';
import Map from './components/Map';
import Navbar from './components/Layout/Navbar';
import FilterPanel from './components/Filters/FilterPanel';
import StatsPanel from './components/Dashboard/StatsPanel';
import AdminDashboard from './components/Admin/AdminDashboard';
import PropertyDetailModal from './components/PropertyDetailModal';
import ExportModal from './components/ExportModal';
import { useBuildingData } from './hooks/useBuildingData';
import { useMapState } from './hooks/useMapState';
import { useFilters } from './hooks/useFilters';
import { calculateStatistics } from './utils/statistics';
import { findLocation } from './utils/locations';
import { MapPin, Layers, Building2, Loader2, AlertTriangle } from 'lucide-react';

export default function App() {
  const { buildings, isLoading, error } = useBuildingData();
  const { selectedBuildingId, selectBuilding } = useMapState();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [adminMode, setAdminMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showDashboard, setShowDashboard] = useState(true);
  const mapRef = useRef<{ flyTo: (coords: [number, number], zoom?: number) => void }>(null);

  const {
    filters,
    updateBuildingTypes,
    updateSizeRange,
    updateConfidenceRange,
    updateSearchQuery,
    resetFilters,
    filteredBuildings,
  } = useFilters(buildings);

  // Calculate statistics for filtered buildings
  const statistics = useMemo(() => {
    if (filteredBuildings.length === 0) {
      return {
        totalBuildings: 0,
        detectionAccuracy: 0,
        areaCovered: 0,
        potentialRevenue: 0,
        classifications: {
          residential: 0,
          commercial: 0,
          industrial: 0,
          institutional: 0,
          mixed: 0,
        },
        totalArea: 0,
        averageBuildingSize: 0,
      };
    }
    return calculateStatistics(filteredBuildings);
  }, [filteredBuildings]);

  // Find selected building
  const selectedBuilding = useMemo(() => {
    return buildings.find((b) => b.id === selectedBuildingId) || null;
  }, [buildings, selectedBuildingId]);

  // Handle location search
  const handleLocationSearch = (query: string) => {
    updateSearchQuery(query);
    
    // Check if it's a location name
    const location = findLocation(query);
    if (location && mapRef.current) {
      mapRef.current.flyTo(location.coordinates, location.zoom);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Error Loading Data</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🛰️</div>
              <div>
                <h1 className="text-2xl font-bold">FastFind360</h1>
                <p className="text-sm opacity-90">
                  {statistics.totalBuildings.toLocaleString()} Buildings Detected | ₦{statistics.potentialRevenue.toFixed(1)}B Revenue Potential
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showDashboard
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {showDashboard ? '📊 Hide Dashboard' : '📊 Show Dashboard'}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? '◀ Hide Filters' : '▶ Show Filters'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {adminMode ? (
        <AdminDashboard />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                selectedTypes={filters.buildingTypes}
                onTypesChange={updateBuildingTypes}
                sizeRange={filters.sizeRange}
                onSizeRangeChange={updateSizeRange}
                confidenceRange={filters.confidenceRange}
                onConfidenceRangeChange={updateConfidenceRange}
                onReset={resetFilters}
                totalBuildings={buildings.length}
                filteredCount={filteredBuildings.length}
                classifications={statistics.classifications}
              />
            </div>
          )}

          {/* Map Container */}
          <div className="flex-1 relative">
            {viewMode === 'map' ? (
              <Map
                ref={mapRef}
                buildings={filteredBuildings}
                selectedBuildingId={selectedBuildingId}
                onBuildingClick={selectBuilding}
              />
            ) : (
              <div className="h-full overflow-y-auto bg-white p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property List View</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredBuildings.slice(0, 100).map((building) => {
                    const coords = building.geometry.coordinates[0][0];
                    return (
                      <div
                        key={building.id}
                        onClick={() => selectBuilding(building.id)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-600" />
                            <span className="font-mono text-sm text-gray-900">{building.id}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 uppercase">
                            {building.properties.classification}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area:</span>
                            <span className="font-semibold text-gray-900">
                              {building.properties.area_in_meters.toFixed(0)} m²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-semibold text-gray-900">
                              {building.properties.confidence}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-mono text-xs text-gray-900">
                              {coords[1].toFixed(4)}°N, {coords[0].toFixed(4)}°E
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredBuildings.length > 100 && (
                  <div className="mt-6 text-center text-gray-600">
                    Showing 100 of {filteredBuildings.length.toLocaleString()} buildings
                  </div>
                )}
              </div>
            )}

            {/* Toggle Buttons */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title={showFilters ? 'Hide Filters' : 'Show Filters'}
              >
                <Layers className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title={showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
              >
                <Building2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Right Sidebar - Dashboard */}
          {showDashboard && (
            <div className="w-80 flex-shrink-0">
              <StatsPanel statistics={statistics} isLoading={isLoading} />
            </div>
          )}
        </div>
      )}

      {/* Property Detail Modal */}
      <PropertyDetailModal
        building={selectedBuilding}
        onClose={() => selectBuilding(null)}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          buildings={filteredBuildings}
          statistics={statistics}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Loading Building Data
                </h3>
                <p className="text-sm text-gray-600">
                  Processing 50,000+ buildings from Google Open Buildings...
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing satellite imagery...</span>
                <span>94.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: '94.3%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <footer className="h-10 bg-gray-800 text-white px-6 flex items-center justify-between text-xs z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Gombe State, Nigeria</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3 h-3" />
            <span>Satellite-Powered Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{statistics.totalBuildings.toLocaleString()} Buildings Detected</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Powered by</span>
          <span className="font-semibold">Google Open Buildings + FastFind360 AI</span>
        </div>
      </footer>
    </div>
  );
}
