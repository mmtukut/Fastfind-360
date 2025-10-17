import { motion, AnimatePresence } from 'framer-motion';
import { Building, BUILDING_COLORS } from '../types';
import { formatNaira, formatNumber } from '../utils/statistics';

interface PropertyCardProps {
  building: Building | null;
  onClose: () => void;
}

export default function PropertyCard({ building, onClose }: PropertyCardProps) {
  return (
    <AnimatePresence>
      {building && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-20 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div
            className="p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${BUILDING_COLORS[building.properties.classification]} 0%, ${BUILDING_COLORS[building.properties.classification]}dd 100%)`
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
            <p className="text-sm opacity-90">{building.id}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Classification */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-600">Classification</span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium capitalize text-white"
                style={{ backgroundColor: BUILDING_COLORS[building.properties.classification] }}
              >
                {building.properties.classification}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Area" value={`${formatNumber(building.properties.area_in_meters)} m²`} />
              <DetailItem label="Confidence" value={`${building.properties.confidence.toFixed(1)}%`} />
              <DetailItem label="Near Road" value={building.properties.nearRoad ? 'Yes' : 'No'} />
              <DetailItem
                label="Detected"
                value={new Date(building.properties.detectedAt).toLocaleDateString()}
              />
            </div>

            {/* Value Estimation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">Estimated Value</span>
                <span className="text-lg font-bold text-green-700">
                  {formatNaira(building.properties.estimatedValue)}
                </span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-green-200">
                <span className="text-sm font-medium text-gray-700">Annual Tax (1%)</span>
                <span className="text-lg font-bold text-green-700">
                  {formatNaira(building.properties.estimatedValue * 0.01)}
                </span>
              </div>
            </motion.div>

            {/* Coordinates */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Coordinates</div>
              <div className="text-xs font-mono text-gray-700">
                {building.geometry.coordinates[0][0][1].toFixed(6)}°N, {building.geometry.coordinates[0][0][0].toFixed(6)}°E
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Flag for Review
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Export Data
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This property was automatically detected using satellite imagery and AI-powered
                classification. Confidence score indicates the accuracy of the classification.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}
