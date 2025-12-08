export default function FarmMap({ cows }) {
  const zones = {
    'Milking Area': { x: 20, y: 20 },
    'Feeding Area': { x: 60, y: 20 },
    'Rest Area': { x: 40, y: 60 }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#eab308';
      case 'alert': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Farm Map View</h2>
      <div className="relative bg-gray-100 rounded-lg" style={{ height: '400px' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <rect x="10" y="10" width="35" height="25" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.5" rx="2" />
          <text x="27.5" y="22" textAnchor="middle" fontSize="3" fill="#0c4a6e">Milking Area</text>
          
          <rect x="55" y="10" width="35" height="25" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.5" rx="2" />
          <text x="72.5" y="22" textAnchor="middle" fontSize="3" fill="#14532d">Feeding Area</text>
          
          <rect x="30" y="50" width="40" height="35" fill="#fef3c7" stroke="#eab308" strokeWidth="0.5" rx="2" />
          <text x="50" y="67" textAnchor="middle" fontSize="3" fill="#713f12">Rest Area</text>
          
          {cows.map((cow, idx) => {
            const zone = zones[cow.zone] || { x: 50, y: 50 };
            const offset = idx * 3;
            return (
              <g key={cow.id}>
                <circle
                  cx={zone.x + (offset % 10) - 5}
                  cy={zone.y + Math.floor(offset / 10) * 3}
                  r="2"
                  fill={getStatusColor(cow.status)}
                  stroke="white"
                  strokeWidth="0.5"
                />
                <text
                  x={zone.x + (offset % 10) - 5}
                  y={zone.y + Math.floor(offset / 10) * 3 + 5}
                  textAnchor="middle"
                  fontSize="2"
                  fill="#374151"
                >
                  {cow.id.slice(-2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Alert</span>
        </div>
      </div>
    </div>
  );
}
