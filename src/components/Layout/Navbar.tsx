import { Map, List, Users, Download, Search as SearchIcon } from 'lucide-react';

interface NavbarProps {
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
  adminMode: boolean;
  onAdminModeChange: (mode: boolean) => void;
  onExport: () => void;
  onSearch: (query: string) => void;
  totalBuildings: number;
  potentialRevenue: number;
}

export default function Navbar({
  viewMode,
  onViewModeChange,
  adminMode,
  onAdminModeChange,
  onExport,
  onSearch,
  totalBuildings,
  potentialRevenue,
}: NavbarProps) {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section - Logo & View Selector */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo-white.png" 
              alt="FastFind360 Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* View Selector */}
          {!adminMode && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
            </div>
          )}
        </div>
        
        {/* Center Section - Search */}
        {!adminMode && (
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations (e.g., Nasarawo, Tudun Wada)..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Stats Badge */}
          {!adminMode && (
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-right">
                <div className="text-xs text-gray-600">Buildings</div>
                <div className="text-sm font-semibold text-gray-900">
                  {totalBuildings.toLocaleString()}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Revenue Potential</div>
                <div className="text-sm font-semibold text-gray-900">
                  ₦{potentialRevenue.toFixed(1)}B
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Toggle */}
          <button
            onClick={() => onAdminModeChange(!adminMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              adminMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            {adminMode ? 'Exit Admin' : 'Admin View'}
          </button>
          
          {/* Export Button */}
          {!adminMode && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

