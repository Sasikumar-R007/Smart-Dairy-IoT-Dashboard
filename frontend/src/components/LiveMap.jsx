import { useState, useEffect } from 'react';

export default function LiveMap({ cows, language, onCowClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCow, setHoveredCow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const farmZones = [
    { id: 'milking', name: language === 'ta' ? 'பால் கறக்கும் பகுதி' : 'Milking Area', x: 180, y: 200, width: 120, height: 80, color: '#10b981' },
    { id: 'feeding', name: language === 'ta' ? 'உணவு பகுதி' : 'Feeding Area', x: 350, y: 150, width: 120, height: 80, color: '#3b82f6' },
    { id: 'rest', name: language === 'ta' ? 'ஓய்வு பகுதி' : 'Rest Area', x: 120, y: 320, width: 140, height: 70, color: '#8b5cf6' },
    { id: 'grazing', name: language === 'ta' ? 'மேய்ச்சல் நிலம்' : 'Grazing Field', x: 320, y: 280, width: 160, height: 100, color: '#22c55e' },
  ];

  const getCowPosition = (cow, index) => {
    const zone = cow.zone?.toLowerCase().includes('milking') ? farmZones[0] :
                 cow.zone?.toLowerCase().includes('feeding') ? farmZones[1] :
                 cow.zone?.toLowerCase().includes('rest') ? farmZones[2] : farmZones[3];
    
    const offsetX = (index % 3) * 35 + 20;
    const offsetY = Math.floor(index / 3) * 30 + 25;
    
    return {
      x: zone.x + offsetX,
      y: zone.y + offsetY
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#eab308';
      case 'alert': return '#ef4444';
      default: return '#22c55e';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} card-interactive`}>
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              {language === 'ta' ? 'நேரடி மாடு இருப்பிட வரைபடம்' : 'Live Cow Location Map'}
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
              {language === 'ta' ? 'தமிழ்நாடு பண்ணை - நேரடி கண்காணிப்பு' : 'Tamil Nadu Farm - Real-time Monitoring'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{cows.length}</span>
            <span>{language === 'ta' ? 'மாடுகள்' : 'cows'}</span>
          </div>
        </div>
      </div>
      
      <div className="relative p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)' }}>
        <svg viewBox="0 0 600 450" className="w-full h-auto" style={{ minHeight: '350px' }}>
          <defs>
            <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#86efac" />
              <circle cx="5" cy="5" r="1" fill="#22c55e" opacity="0.5" />
              <circle cx="15" cy="15" r="1" fill="#22c55e" opacity="0.5" />
            </pattern>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
          </defs>
          
          <rect x="0" y="0" width="600" height="450" fill="url(#grass)" />
          
          <text x="300" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#166534">
            {language === 'ta' ? '🌾 கோயம்புத்தூர் பண்ணை, தமிழ்நாடு' : '🌾 Coimbatore Farm, Tamil Nadu'}
          </text>
          <text x="300" y="50" textAnchor="middle" fontSize="12" fill="#4b5563">
            {language === 'ta' ? 'அட்சரேகை: 11.0168°N, தீர்க்கரேகை: 76.9558°E' : 'Lat: 11.0168°N, Lng: 76.9558°E'}
          </text>

          <path d="M50,80 Q100,60 150,75 T250,70 T350,80 T450,65 T550,85" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <text x="60" y="100" fontSize="10" fill="#6b7280">{language === 'ta' ? 'சாலை' : 'Road'}</text>

          {farmZones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx="8"
                fill={zone.color}
                opacity="0.2"
                stroke={zone.color}
                strokeWidth="2"
                filter="url(#shadow)"
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y - 8}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={zone.color}
              >
                {zone.name}
              </text>
            </g>
          ))}

          <g>
            <rect x="520" y="120" width="60" height="50" rx="4" fill="#78716c" opacity="0.8" filter="url(#shadow)" />
            <text x="550" y="150" textAnchor="middle" fontSize="10" fill="white">{language === 'ta' ? 'கொட்டில்' : 'Barn'}</text>
          </g>

          <g>
            <circle cx="80" cy="380" r="25" fill="#60a5fa" opacity="0.6" />
            <text x="80" y="385" textAnchor="middle" fontSize="10" fill="#1e40af">{language === 'ta' ? 'நீர்' : 'Water'}</text>
          </g>

          {cows.map((cow, index) => {
            const pos = getCowPosition(cow, index);
            const statusColor = getStatusColor(cow.status);
            const isHovered = hoveredCow === cow.id;
            
            return (
              <g
                key={cow.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onClick={() => onCowClick && onCowClick(cow)}
                onMouseEnter={() => setHoveredCow(cow.id)}
                onMouseLeave={() => setHoveredCow(null)}
              >
                <circle
                  r={isHovered ? 22 : 18}
                  fill={statusColor}
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                  style={{ transition: 'r 0.2s ease' }}
                />
                <text
                  y="1"
                  textAnchor="middle"
                  fontSize="16"
                  dominantBaseline="middle"
                >
                  🐄
                </text>
                <text
                  y="30"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#374151"
                >
                  {cow.name}
                </text>
                {isHovered && (
                  <g>
                    <rect x="-60" y="-70" width="120" height="50" rx="6" fill="white" stroke="#e5e7eb" filter="url(#shadow)" />
                    <text x="0" y="-52" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1f2937">
                      {cow.name} ({cow.id})
                    </text>
                    <text x="0" y="-38" textAnchor="middle" fontSize="10" fill="#6b7280">
                      {language === 'ta' ? 'பால்' : 'Milk'}: {cow.currentYield}L | {language === 'ta' ? 'வெப்பம்' : 'Temp'}: {cow.temperature}°C
                    </text>
                    <text x="0" y="-24" textAnchor="middle" fontSize="10" fill={statusColor} fontWeight="600">
                      {cow.status === 'healthy' ? (language === 'ta' ? 'ஆரோக்கியமான' : 'Healthy') :
                       cow.status === 'warning' ? (language === 'ta' ? 'எச்சரிக்கை' : 'Warning') :
                       (language === 'ta' ? 'அபாயம்' : 'Alert')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <g transform="translate(500, 380)">
            <rect x="-40" y="-25" width="80" height="60" rx="4" fill="white" opacity="0.9" stroke="#e5e7eb" />
            <text x="0" y="-10" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
              {language === 'ta' ? 'திசை' : 'Direction'}
            </text>
            <text x="0" y="5" textAnchor="middle" fontSize="10" fill="#ef4444">N ↑</text>
            <text x="-15" y="18" fontSize="8" fill="#6b7280">W</text>
            <text x="10" y="18" fontSize="8" fill="#6b7280">E</text>
            <text x="0" y="28" textAnchor="middle" fontSize="8" fill="#6b7280">S</text>
          </g>
        </svg>
      </div>

      <div className="p-4 bg-gradient-to-r from-gray-50 to-white flex gap-6 justify-center text-sm border-t">
        <LegendItem color="bg-green-500" label={language === 'ta' ? 'ஆரோக்கியமான' : 'Healthy'} />
        <LegendItem color="bg-yellow-500" label={language === 'ta' ? 'எச்சரிக்கை' : 'Warning'} />
        <LegendItem color="bg-red-500" label={language === 'ta' ? 'அபாய எச்சரிக்கை' : 'Alert'} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${isHovered ? 'bg-gray-100 scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-4 h-4 rounded-full ${color} border-2 border-white shadow transition-transform duration-200 ${isHovered ? 'scale-125' : ''}`}></div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}
