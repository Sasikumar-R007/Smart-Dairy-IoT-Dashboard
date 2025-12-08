import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ cows, language, onCowClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const centerLat = 11.0168;
    const centerLng = 76.9558;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true
    }).setView([centerLat, centerLng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.on('load', () => {
      setIsMapLoaded(true);
    });

    setTimeout(() => setIsMapLoaded(true), 500);

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

    cows.forEach((cow, index) => {
      if (cow.lat && cow.lng) {
        const statusColor = cow.status === 'healthy' ? '#22c55e' : 
                           cow.status === 'warning' ? '#eab308' : '#ef4444';
        
        const customIcon = L.divIcon({
          className: 'custom-cow-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              animation: markerPop 0.4s ease-out ${index * 0.1}s both;
            ">
              <span style="color: white; font-size: 12px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                ${cow.id.slice(-2)}
              </span>
            </div>
            <style>
              @keyframes markerPop {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
              }
              .custom-cow-marker:hover > div {
                transform: scale(1.15) !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.4) !important;
              }
            </style>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
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
          <div style="min-width: 200px; font-family: system-ui, sans-serif; padding: 4px;">
            <div style="
              font-weight: 700; 
              font-size: 16px; 
              margin-bottom: 12px; 
              border-bottom: 2px solid ${statusColor}; 
              padding-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <span style="font-size: 20px;">🐄</span>
              <span>${cow.name || cow.id}</span>
              <span style="
                font-size: 10px; 
                color: #666;
                background: #f3f4f6;
                padding: 2px 6px;
                border-radius: 4px;
              ">${cow.earTagId || cow.rfidTag}</span>
            </div>
            <div style="display: grid; gap: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #6b7280;">🏷️ ${language === 'ta' ? 'இனம்' : 'Breed'}</span>
                <span style="font-weight: 600;">${cow.breed}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #6b7280;">🥛 ${yieldLabel}</span>
                <span style="font-weight: 600;">${cow.currentYield} ${language === 'ta' ? 'லி' : 'L'}/day</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #6b7280;">🌡️ ${tempLabel}</span>
                <span style="font-weight: 600;">${cow.temperature}°C</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #6b7280;">📍 ${zoneLabel}</span>
                <span style="font-weight: 600;">${cow.zone}</span>
              </div>
              <div style="margin-top: 8px; text-align: center;">
                <span style="
                  display: inline-block;
                  padding: 6px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  background: ${statusColor}20;
                  color: ${statusColor};
                  border: 1px solid ${statusColor}40;
                ">${statusText}</span>
              </div>
            </div>
          </div>
        `, {
          className: 'custom-popup',
          maxWidth: 250
        });

        marker.on('click', () => {
          if (onCowClick) onCowClick(cow);
        });

        markersRef.current.push(marker);
      }
    });
  }, [cows, language, onCowClick]);

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
              {language === 'ta' ? 'மாடுகளின் நேரடி இருப்பிடத்தைக் காண்க' : 'View real-time cow locations with ear tag tracking'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{cows.length}</span>
            <span>{language === 'ta' ? 'மாடுகள்' : 'cows'}</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="loading-spinner"></div>
              <span className="text-gray-500 text-sm animate-pulse">
                {language === 'ta' ? 'வரைபடம் ஏற்றுகிறது...' : 'Loading map...'}
              </span>
            </div>
          </div>
        )}
        <div ref={mapRef} style={{ height: '400px', width: '100%' }} className={`transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`} />
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
