import { Building } from '../types';

interface ExportButtonProps {
  buildings: Building[];
  disabled?: boolean;
}

export default function ExportButton({ buildings, disabled }: ExportButtonProps) {
  const handleExport = () => {
    if (buildings.length === 0) return;

    // Create CSV content
    const headers = [
      'ID',
      'Classification',
      'Area (m²)',
      'Confidence (%)',
      'Estimated Value (₦)',
      'Longitude',
      'Latitude',
      'Detected At',
    ];

    const rows = buildings.map(building => {
      // Get center coordinates from polygon
      const coords = building.geometry.coordinates[0][0];
      return [
        building.id,
        building.properties.classification,
        building.properties.area_in_meters.toFixed(2),
        building.properties.confidence,
        building.properties.estimatedValue?.toFixed(2) || '0',
        coords[0].toFixed(6),
        coords[1].toFixed(6),
        building.properties.detectedAt || '',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `fastfind360_buildings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || buildings.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-md"
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="font-medium">Export CSV</span>
      <span className="text-xs opacity-80">({buildings.length.toLocaleString()} buildings)</span>
    </button>
  );
}
