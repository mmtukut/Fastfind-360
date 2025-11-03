import { X, MapPin, Ruler, Building2, Target, DollarSign, Flag } from 'lucide-react';
import { Building, BUILDING_COLORS } from '../types';
import { getBuildingCenter } from '../utils/buildingAdapter';

interface PropertyDetailModalProps {
  building: Building | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ building, onClose }: PropertyDetailModalProps) {
  if (!building) return null;

  const { id, properties } = building;
  const { classification, area_in_meters, confidence, estimatedValue } = properties;
  const [lng, lat] = getBuildingCenter(building);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-green-600 bg-green-100';
    if (conf >= 70) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: BUILDING_COLORS[classification] + '20' }}
            >
              <Building2 className="w-6 h-6" style={{ color: BUILDING_COLORS[classification] }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
              <p className="text-sm text-gray-600">ID: {id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Classification */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Classification</h3>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: BUILDING_COLORS[classification] + '20',
                  color: BUILDING_COLORS[classification]
                }}
              >
                {classification.toUpperCase()}
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getConfidenceColor(confidence)}`}>
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">{confidence}% Confidence</span>
            </div>
          </div>
          
          {/* Property Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-xs font-medium">Area</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{area_in_meters.toLocaleString()}</div>
              <div className="text-xs text-gray-600">square meters</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-medium">Building Type</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 capitalize">{classification}</div>
              <div className="text-xs text-gray-600">classification</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Coordinates</span>
              </div>
              <div className="text-sm font-mono text-gray-900">
                {lat.toFixed(6)}°N
              </div>
              <div className="text-sm font-mono text-gray-900">
                {lng.toFixed(6)}°E
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Est. Value</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₦{estimatedValue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">estimated</div>
            </div>
          </div>
          
          {/* Detection Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Detection Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Source:</span>
                <span className="font-semibold text-blue-900">Google Open Buildings Dataset</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Detection Method:</span>
                <span className="font-semibold text-blue-900">Satellite Imagery AI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Last Updated:</span>
                <span className="font-semibold text-blue-900">October 2025</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <MapPin className="w-4 h-4" />
              View on Map
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Flag className="w-4 h-4" />
              Flag for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
