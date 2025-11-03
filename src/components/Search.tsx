import { useState, useCallback } from 'react';
import { Search as SearchIcon, X, MapPin } from 'lucide-react';
import { getAllLocationNames } from '../utils/locations';

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function Search({ onSearch, placeholder = 'Search buildings, locations...' }: SearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick search suggestions */}
      {query && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 px-2 py-1 mb-1">
              <MapPin className="w-3 h-3" />
              <span>Locations:</span>
            </div>
            {getAllLocationNames()
              .filter(name => name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </form>
  );
}
