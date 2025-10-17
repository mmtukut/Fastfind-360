import { Building } from '../types';

/**
 * Export buildings as CSV
 */
export function exportToCSV(buildings: Building[], filename: string = 'fastfind360_buildings.csv'): void {
  // Create CSV header
  const headers = [
    'Building ID',
    'Classification',
    'Area (m²)',
    'Confidence (%)',
    'Estimated Value (₦)',
    'Near Road',
    'Longitude',
    'Latitude',
    'Detected At'
  ];

  // Create CSV rows
  const rows = buildings.map(building => {
    const coords = building.geometry.coordinates[0][0]; // Get first coordinate
    return [
      building.id,
      building.properties.classification,
      building.properties.area_in_meters,
      building.properties.confidence,
      building.properties.estimatedValue,
      building.properties.nearRoad ? 'Yes' : 'No',
      coords[0].toFixed(6),
      coords[1].toFixed(6),
      building.properties.detectedAt
    ].join(',');
  });

  // Combine header and rows
  const csv = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export buildings as GeoJSON
 */
export function exportToGeoJSON(buildings: Building[], filename: string = 'fastfind360_buildings.geojson'): void {
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generated: new Date().toISOString(),
      source: 'FastFind360',
      count: buildings.length,
    },
    features: buildings.map(building => ({
      type: 'Feature',
      id: building.id,
      geometry: building.geometry,
      properties: building.properties,
    })),
  };

  const json = JSON.stringify(geojson, null, 2);
  const blob = new Blob([json], { type: 'application/geo+json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF report summary
 */
export function exportToPDF(_buildings: Building[], statistics: any): void {
  // Create a simple HTML report that can be printed as PDF
  const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>FastFind360 Building Detection Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }
    h1 {
      color: #2563EB;
      border-bottom: 3px solid #2563EB;
      padding-bottom: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563EB;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .metric {
      background: #F3F4F6;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #2563EB;
    }
    .metric-label {
      color: #6B7280;
      font-size: 14px;
      margin-top: 5px;
    }
    .classification {
      margin: 30px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #E5E7EB;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #2563EB;
      color: white;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
      color: #6B7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🛰️ FastFind360</div>
    <div style="text-align: right;">
      <div><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
      <div><strong>Location:</strong> Gombe State, Nigeria</div>
    </div>
  </div>

  <h1>Building Detection Report</h1>

  <div class="metrics">
    <div class="metric">
      <div class="metric-value">${statistics.totalBuildings.toLocaleString()}</div>
      <div class="metric-label">Total Buildings</div>
    </div>
    <div class="metric">
      <div class="metric-value">${statistics.detectionAccuracy}%</div>
      <div class="metric-label">Accuracy</div>
    </div>
    <div class="metric">
      <div class="metric-value">${statistics.areaCovered}</div>
      <div class="metric-label">LGAs Covered</div>
    </div>
    <div class="metric">
      <div class="metric-value">₦${statistics.potentialRevenue}B</div>
      <div class="metric-label">Revenue Potential</div>
    </div>
  </div>

  <div class="classification">
    <h2>Building Classification Breakdown</h2>
    <table>
      <tr>
        <th>Type</th>
        <th>Count</th>
        <th>Percentage</th>
        <th>Total Area (m²)</th>
      </tr>
      ${Object.entries(statistics.classifications).map(([type, count]: [string, any]) => {
        const percentage = ((count / statistics.totalBuildings) * 100).toFixed(1);
        return `
          <tr>
            <td style="text-transform: capitalize;">${type}</td>
            <td>${count.toLocaleString()}</td>
            <td>${percentage}%</td>
            <td>${(count * statistics.averageBuildingSize).toLocaleString()}</td>
          </tr>
        `;
      }).join('')}
    </table>
  </div>

  <div class="classification">
    <h2>Key Insights</h2>
    <ul>
      <li><strong>Total Built-Up Area:</strong> ${statistics.totalArea.toFixed(2)} km²</li>
      <li><strong>Average Building Size:</strong> ${statistics.averageBuildingSize.toLocaleString()} m²</li>
      <li><strong>Detection Method:</strong> AI-powered satellite imagery analysis</li>
      <li><strong>Data Source:</strong> High-resolution satellite imagery</li>
      <li><strong>Confidence Level:</strong> ${statistics.detectionAccuracy}% average accuracy</li>
    </ul>
  </div>

  <div class="classification">
    <h2>Impact Analysis</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Traditional Method</th>
        <th>FastFind360</th>
        <th>Improvement</th>
      </tr>
      <tr>
        <td>Time Required</td>
        <td>3-5 years</td>
        <td>48 hours</td>
        <td style="color: #10B981; font-weight: bold;">99% faster</td>
      </tr>
      <tr>
        <td>Cost</td>
        <td>₦500 Million</td>
        <td>₦50 Million</td>
        <td style="color: #10B981; font-weight: bold;">90% cheaper</td>
      </tr>
      <tr>
        <td>Accuracy</td>
        <td>70-80%</td>
        <td>${statistics.detectionAccuracy}%</td>
        <td style="color: #10B981; font-weight: bold;">Higher accuracy</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p><strong>FastFind360</strong> - Satellite-Powered Property Intelligence for Nigeria</p>
    <p>Generated by FastFind360 AI Detection System | Powered by NIGCOMSAT</p>
  </div>
</body>
</html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Auto-print after load
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Copy data to clipboard as JSON
 */
export function copyToClipboard(buildings: Building[]): Promise<void> {
  const json = JSON.stringify(buildings, null, 2);
  return navigator.clipboard.writeText(json);
}
