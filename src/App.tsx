import { useState, useMemo } from 'react';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import Filters from './components/Filters';
import Sidebar from './components/Sidebar';
import PropertyCard from './components/PropertyCard';
import { useBuildingData } from './hooks/useBuildingData';
import { useMapState } from './hooks/useMapState';
import { useFilters } from './hooks/useFilters';
import { calculateStatistics } from './utils/statistics';

export default function App() {
  const { buildings, isLoading, error } = useBuildingData();
  const { selectedBuildingId, selectBuilding } = useMapState();
  const [showDashboard, setShowDashboard] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
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
                  Satellite-Powered Property Intelligence
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
      <div className="flex-1 relative overflow-hidden">
        {/* Map */}
        <div className={`absolute inset-0 ${sidebarOpen ? 'md:left-80' : 'left-0'} transition-all duration-300`}>
          <Map
            buildings={filteredBuildings}
            selectedBuildingId={selectedBuildingId}
            onBuildingClick={selectBuilding}
          />
        </div>

        {/* Left Sidebar - Filters */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}>
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Search</h2>
              <Search onSearch={updateSearchQuery} />
            </div>

            {/* Filters */}
            <Filters
              selectedTypes={filters.buildingTypes}
              onTypesChange={updateBuildingTypes}
              sizeRange={filters.sizeRange}
              onSizeRangeChange={updateSizeRange}
              confidenceRange={filters.confidenceRange}
              onConfidenceRangeChange={updateConfidenceRange}
              onReset={resetFilters}
            />

            {/* Results Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Filtered Results
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {filteredBuildings.length.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700">
                of {buildings.length.toLocaleString()} total buildings
              </p>
            </div>
          </div>
        </Sidebar>

        {/* Dashboard Overlay */}
        {showDashboard && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 z-30 pointer-events-none">
            <div className="pointer-events-auto">
              <Dashboard statistics={statistics} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Property Card */}
        <PropertyCard building={selectedBuilding} onClose={() => selectBuilding(null)} />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Generating Building Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Creating 12,847 buildings for Gombe State...
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
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 text-white px-6 py-3 text-sm flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <span>📍 Gombe State, Nigeria</span>
          <span>🛰️ NIGCOMSAT-1R Live Feed</span>
          <span className="text-green-400">● Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Powered by</span>
          <span className="font-semibold">FastFind360</span>
        </div>
      </div>
    </div>
  );
}
