import { BuildingType, BUILDING_COLORS } from '../types';

interface FiltersProps {
  selectedTypes: BuildingType[];
  onTypesChange: (types: BuildingType[]) => void;
  sizeRange: [number, number];
  onSizeRangeChange: (range: [number, number]) => void;
  confidenceRange: [number, number];
  onConfidenceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const buildingTypes: BuildingType[] = ['residential', 'commercial', 'industrial', 'institutional', 'mixed'];

export default function Filters({
  selectedTypes,
  onTypesChange,
  sizeRange,
  onSizeRangeChange,
  confidenceRange,
  onConfidenceRangeChange,
  onReset,
}: FiltersProps) {
  const handleTypeToggle = (type: BuildingType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleSelectAll = () => {
    onTypesChange(buildingTypes);
  };

  const handleDeselectAll = () => {
    onTypesChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Building Type Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Building Type</label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              All
            </button>
            <span className="text-xs text-gray-400">|</span>
            <button
              onClick={handleDeselectAll}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {buildingTypes.map((type) => {
            const isSelected = selectedTypes.includes(type);
            const color = BUILDING_COLORS[type];
            
            return (
              <label
                key={type}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700 capitalize flex-1">{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Range Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Building Size (m²)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={sizeRange[1]}
            onChange={(e) => onSizeRangeChange([sizeRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{sizeRange[0]} m²</span>
            <span>{sizeRange[1]} m²</span>
          </div>
        </div>
      </div>

      {/* Confidence Range Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Detection Confidence (%)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={confidenceRange[0]}
            onChange={(e) =>
              onConfidenceRangeChange([parseInt(e.target.value), confidenceRange[1]])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{confidenceRange[0]}%</span>
            <span>{confidenceRange[1]}%</span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <span className="font-medium">{selectedTypes.length}</span> types selected
        </div>
      </div>
    </div>
  );
}
