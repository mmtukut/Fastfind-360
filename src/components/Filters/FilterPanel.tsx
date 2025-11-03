import { Home, Store, Factory, School, Building2, Filter } from 'lucide-react';
import { BuildingType, BUILDING_COLORS } from '../../types';

interface FilterPanelProps {
  selectedTypes: BuildingType[];
  onTypesChange: (types: BuildingType[]) => void;
  sizeRange: [number, number];
  onSizeRangeChange: (range: [number, number]) => void;
  confidenceRange: [number, number];
  onConfidenceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  totalBuildings: number;
  filteredCount: number;
  classifications: Record<BuildingType, number>;
}

const BUILDING_TYPE_CONFIG = [
  { type: 'residential' as BuildingType, icon: Home, label: 'Residential' },
  { type: 'commercial' as BuildingType, icon: Store, label: 'Commercial' },
  { type: 'industrial' as BuildingType, icon: Factory, label: 'Industrial' },
  { type: 'institutional' as BuildingType, icon: School, label: 'Institutional' },
  { type: 'mixed' as BuildingType, icon: Building2, label: 'Mixed Use' },
];

export default function FilterPanel({
  selectedTypes,
  onTypesChange,
  sizeRange,
  onSizeRangeChange,
  confidenceRange,
  onConfidenceRangeChange,
  onReset,
  totalBuildings,
  filteredCount,
  classifications,
}: FilterPanelProps) {
  const handleTypeToggle = (type: BuildingType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Reset All
          </button>
        </div>
        
        {/* Results Counter */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="text-xs text-blue-700 mb-1">Showing</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">
              {filteredCount.toLocaleString()}
            </span>
            <span className="text-sm text-blue-600">
              of {totalBuildings.toLocaleString()} total buildings
            </span>
          </div>
        </div>
      </div>
      
      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Building Type Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Building Type</h3>
          </div>
          <div className="space-y-2">
            {BUILDING_TYPE_CONFIG.map(({ type, icon: Icon, label }) => {
              const isSelected = selectedTypes.includes(type);
              const count = classifications[type] || 0;
              const color = BUILDING_COLORS[type];
              
              return (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500">{count.toLocaleString()} buildings</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Size Range Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Building Size (m²)</h3>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={sizeRange[1]}
              onChange={(e) => onSizeRangeChange([sizeRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{sizeRange[0]} m²</span>
              <div className="px-3 py-1 bg-blue-100 rounded-md">
                <span className="text-sm font-semibold text-blue-900">
                  ≤ {sizeRange[1]} m²
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Confidence Score Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Detection Confidence</h3>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidenceRange[0]}
              onChange={(e) => onConfidenceRangeChange([parseInt(e.target.value), confidenceRange[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between items-center">
              <div className="px-3 py-1 bg-green-100 rounded-md">
                <span className="text-sm font-semibold text-green-900">
                  ≥ {confidenceRange[0]}%
                </span>
              </div>
              <span className="text-sm text-gray-600">100%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

