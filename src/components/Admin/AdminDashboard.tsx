import { AlertTriangle, Flag, CheckCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface FlaggedProperty {
  id: string;
  type: string;
  location: string;
  risk: 'Critical' | 'High' | 'Medium';
}

const MOCK_FLAGGED_PROPERTIES: FlaggedProperty[] = [
  { id: 'B-12847', type: 'Unregistered', location: 'Nasarawo', risk: 'High' },
  { id: 'B-9823', type: 'Illegal Construction', location: 'Tudun Wada', risk: 'Critical' },
  { id: 'B-7651', type: 'Missing Documentation', location: 'Gombe Central', risk: 'Medium' },
  { id: 'B-5432', type: 'Unauthorized Extension', location: 'Bajoga', risk: 'High' },
  { id: 'B-3219', type: 'Incomplete Records', location: 'Kumo', risk: 'Medium' },
];

export default function AdminDashboard() {
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 border-b border-red-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Control Center</h1>
            <p className="text-sm text-red-100 mt-1">GOVERNMENT USE ONLY</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-800 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">247 Flagged Properties</span>
          </div>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enforcement Queue */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Flagged Properties</h2>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  247 Pending Review
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {MOCK_FLAGGED_PROPERTIES.map((property) => (
                <div key={property.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {property.id}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskBadgeColor(property.risk)}`}>
                          {property.risk} Risk
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.type} • {property.location}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All 247 Flagged Properties →
              </button>
            </div>
          </div>
          
          {/* Admin Stats */}
          <div className="space-y-6">
            {/* Enforcement Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Enforcement Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-semibold text-gray-900">247</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-semibold text-gray-900">89</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Resolved</span>
                    <span className="font-semibold text-gray-900">543</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Revenue Impact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Revenue Impact</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">₦2.3B</div>
                <div className="text-sm text-gray-600">Potential Annual Revenue</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Registered Properties</div>
                  <div className="text-lg font-bold text-gray-900">32%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Collection Rate</div>
                  <div className="text-lg font-bold text-gray-900">45%</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Bulk Approve (12)</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">Schedule Inspection</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

