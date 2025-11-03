import { motion } from 'framer-motion';
import { Statistics, BUILDING_COLORS } from '../types';
import { formatNaira, formatNumber } from '../utils/statistics';
import { exportToCSV, exportToGeoJSON, exportToPDF } from '../utils/exportService';
import { Building } from '../types';

interface DashboardProps {
  statistics: Statistics;
  isLoading: boolean;
  buildings?: Building[];
}

export default function Dashboard({ statistics, isLoading, buildings = [] }: DashboardProps) {
  const handleExportCSV = () => {
    exportToCSV(buildings);
  };

  const handleExportGeoJSON = () => {
    exportToGeoJSON(buildings);
  };

  const handleExportPDF = () => {
    exportToPDF(buildings, statistics);
  };
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const {
    totalBuildings,
    detectionAccuracy,
    areaCovered,
    potentialRevenue,
    classifications,
    totalArea,
    averageBuildingSize,
  } = statistics;

  const total = Object.values(classifications).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Buildings"
          value={formatNumber(totalBuildings)}
          icon="🏢"
          color="bg-blue-500"
        />
        <MetricCard
          title="Detection Accuracy"
          value={`${detectionAccuracy}%`}
          icon="🎯"
          color="bg-green-500"
        />
        <MetricCard
          title="LGAs Covered"
          value={areaCovered.toString()}
          icon="📍"
          color="bg-purple-500"
        />
        <MetricCard
          title="Revenue Potential"
          value={formatNaira(potentialRevenue * 1_000_000_000)}
          icon="💰"
          color="bg-orange-500"
        />
      </div>

      {/* Classification Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Building Classification</h3>
        
        {/* Bar Chart */}
        <div className="space-y-3 mb-6">
          {Object.entries(classifications).map(([type, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const color = BUILDING_COLORS[type as keyof typeof BUILDING_COLORS];
            
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium text-gray-700">{type}</span>
                  <span className="text-gray-600">
                    {formatNumber(count)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie Chart Legend */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          {Object.entries(classifications).map(([type, count]) => {
            const color = BUILDING_COLORS[type as keyof typeof BUILDING_COLORS];
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-600 capitalize">
                  {type}: {formatNumber(count)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Total Built-Up Area</h4>
          <p className="text-2xl font-bold text-blue-600">{totalArea.toFixed(2)} km²</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Average Building Size</h4>
          <p className="text-2xl font-bold text-blue-600">{formatNumber(averageBuildingSize)} m²</p>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Export Data</h3>
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            📊 Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportGeoJSON}
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            🗺️ Export GeoJSON
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            📄 Export PDF
          </motion.button>
        </div>
      </div>

      {/* Impact Comparison */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">FastFind360 vs Traditional Methods</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Traditional Survey</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-red-600">3-5 years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-semibold text-red-600">₦500M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-red-600">70-80%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">FastFind360</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-green-600">48 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-semibold text-green-600">₦50M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-green-600">{detectionAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Cost Reduction:</span>
            <span className="text-xl font-bold text-green-600">90%</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-gray-700">Time Reduction:</span>
            <span className="text-xl font-bold text-green-600">99%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
