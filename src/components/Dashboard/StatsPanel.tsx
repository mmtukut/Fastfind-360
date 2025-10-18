import { Building2, MapPin, CheckCircle, DollarSign, BarChart3, Eye } from 'lucide-react';
import { Statistics, BUILDING_COLORS } from '../../types';

interface StatsPanelProps {
  statistics: Statistics;
  isLoading: boolean;
}

export default function StatsPanel({ statistics, isLoading }: StatsPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full bg-white border-l border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const {
    totalBuildings,
    detectionAccuracy,
    totalArea,
    potentialRevenue,
    classifications,
  } = statistics;

  const total = Object.values(classifications).reduce((sum, count) => sum + count, 0);

  const metrics = [
    {
      label: 'Total Buildings',
      value: totalBuildings.toLocaleString(),
      icon: Building2,
      trend: '+2.4%',
      trendUp: true,
    },
    {
      label: 'Total Area',
      value: `${totalArea.toFixed(1)} km²`,
      icon: MapPin,
      trend: '+1.8%',
      trendUp: true,
    },
    {
      label: 'Detection Rate',
      value: `${detectionAccuracy}%`,
      icon: CheckCircle,
      trend: 'High',
      trendUp: true,
    },
    {
      label: 'Revenue Potential',
      value: `₦${potentialRevenue.toFixed(1)}B`,
      icon: DollarSign,
      trend: '+5.2%',
      trendUp: true,
    },
  ];

  const classificationData = [
    { type: 'residential', label: 'Residential', count: classifications.residential, color: BUILDING_COLORS.residential },
    { type: 'commercial', label: 'Commercial', count: classifications.commercial, color: BUILDING_COLORS.commercial },
    { type: 'industrial', label: 'Industrial', count: classifications.industrial, color: BUILDING_COLORS.industrial },
    { type: 'institutional', label: 'Institutional', count: classifications.institutional, color: BUILDING_COLORS.institutional },
  ];

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Live Intelligence</h2>
        <p className="text-sm text-gray-600">Gombe State Property Overview</p>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metric.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
              </div>
            );
          })}
        </div>
        
        {/* Classification Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Building Classification</h3>
          <div className="space-y-3">
            {classificationData.map((cat) => {
              const percentage = total > 0 ? (cat.count / total) * 100 : 0;
              return (
                <div key={cat.type}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{cat.label}</span>
                    <span className="text-gray-600">{cat.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">View Analytics</div>
                <div className="text-xs text-gray-600">Detailed insights</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Export Report</div>
                <div className="text-xs text-gray-600">Download full dataset</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

