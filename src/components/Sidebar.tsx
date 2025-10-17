import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  position?: 'left' | 'right';
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({
  children,
  position = 'left',
  isOpen = true,
  onToggle,
}: SidebarProps) {
  const positionClass = position === 'left' ? 'left-0' : 'right-0';
  
  return (
    <>
      {/* Toggle button for mobile */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="md:hidden fixed top-20 left-4 z-50 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 ${positionClass} h-full w-80 bg-gray-50 shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
          overflow-y-auto
        `}
      >
        <div className="p-6 pt-20">
          {children}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && onToggle && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
