import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ cows, language, onCowClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const centerLat = 11.0168;
    const centerLng = 76.9558;

    mapInstanceRef.current = L.map(mapRef.current).setView([centerLat, centerLng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    cows.forEach(cow => {
      if (cow.lat && cow.lng) {
        const statusColor = cow.status === 'healthy' ? '#22c55e' : 
                           cow.status === 'warning' ? '#eab308' : '#ef4444';
        
        const customIcon = L.divIcon({
          className: 'custom-cow-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: ${statusColor};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <span style="color: white; font-size: 10px; font-weight: bold;">${cow.id.slice(-2)}</span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([cow.lat, cow.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current);

        const statusText = language === 'ta' ? 
          (cow.status === 'healthy' ? 'ஆரோக்கியமான' : cow.status === 'warning' ? 'எச்சரிக்கை' : 'அபாய எச்சரிக்கை') :
          cow.status.charAt(0).toUpperCase() + cow.status.slice(1);

        const yieldLabel = language === 'ta' ? 'பால்' : 'Milk';
        const tempLabel = language === 'ta' ? 'வெப்பநிலை' : 'Temp';
        const zoneLabel = language === 'ta' ? 'பகுதி' : 'Zone';

        marker.bindPopup(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 6px;">
              ${cow.name || cow.id} 
              <span style="font-size: 11px; color: #666;">(${cow.earTagId || cow.rfidTag})</span>
            </div>
            <div style="display: grid; gap: 4px; font-size: 12px;">
              <div><strong>${language === 'ta' ? 'இனம்' : 'Breed'}:</strong> ${cow.breed}</div>
              <div><strong>${yieldLabel}:</strong> ${cow.currentYield} ${language === 'ta' ? 'லி' : 'L'}/day</div>
              <div><strong>${tempLabel}:</strong> ${cow.temperature}°C</div>
              <div><strong>${zoneLabel}:</strong> ${cow.zone}</div>
              <div style="margin-top: 6px;">
                <span style="
                  display: inline-block;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 500;
                  background-color: ${statusColor}20;
                  color: ${statusColor};
                ">${statusText}</span>
              </div>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onCowClick) onCowClick(cow);
        });

        markersRef.current.push(marker);
      }
    });
  }, [cows, language, onCowClick]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {language === 'ta' ? 'நேரடி மாடு இருப்பிட வரைபடம்' : 'Live Cow Location Map'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {language === 'ta' ? 'மாடுகளின் நேரடி இருப்பிடத்தைக் காண்க' : 'View real-time cow locations with ear tag tracking'}
        </p>
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      <div className="p-3 bg-gray-50 flex gap-4 justify-center text-sm border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
          <span>{language === 'ta' ? 'ஆரோக்கியமான' : 'Healthy'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
          <span>{language === 'ta' ? 'எச்சரிக்கை' : 'Warning'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
          <span>{language === 'ta' ? 'அபாய எச்சரிக்கை' : 'Alert'}</span>
        </div>
      </div>
    </div>
  );
}
