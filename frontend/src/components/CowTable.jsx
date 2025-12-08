import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CowTable({ cows, language = 'en' }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const t = (key) => {
    const translations = {
      en: {
        cowId: 'Cow ID',
        name: 'Name',
        breed: 'Breed',
        age: 'Age',
        healthScore: 'Health Score',
        milkYield: 'Milk Yield',
        feedRequired: 'Feed Required',
        status: 'Status',
        healthy: 'Healthy',
        warning: 'Warning',
        alert: 'Alert',
        years: 'years',
        liters: 'L',
        kg: 'kg'
      },
      ta: {
        cowId: 'மாடு எண்',
        name: 'பெயர்',
        breed: 'இனம்',
        age: 'வயது',
        healthScore: 'உடல்நலம் மதிப்பெண்',
        milkYield: 'பால் உற்பத்தி',
        feedRequired: 'தீவனம் தேவை',
        status: 'நிலை',
        healthy: 'ஆரோக்கியமான',
        warning: 'எச்சரிக்கை',
        alert: 'அபாய எச்சரிக்கை',
        years: 'ஆண்டுகள்',
        liters: 'லி',
        kg: 'கிகி'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-100 text-green-800 border border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'alert': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'healthy': return t('healthy');
      case 'warning': return t('warning');
      case 'alert': return t('alert');
      default: return status;
    }
  };

  const getHealthBarColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('breed')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('age')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('healthScore')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('milkYield')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('feedRequired')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('status')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {cows.map((cow, index) => (
              <tr
                key={cow.id}
                onClick={() => navigate(`/cow/${cow.id}`)}
                onMouseEnter={() => setHoveredRow(cow.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`
                  cursor-pointer transition-all duration-200
                  ${hoveredRow === cow.id ? 'bg-green-50/50 shadow-sm' : 'hover:bg-gray-50'}
                  animate-fade-in-up
                `}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  transform: hoveredRow === cow.id ? 'scale(1.005)' : 'scale(1)'
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 
                      flex items-center justify-center text-lg
                      transition-transform duration-200
                      ${hoveredRow === cow.id ? 'scale-110' : ''}
                    `}>
                      🐄
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{cow.name || cow.id}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {cow.earTagId || cow.rfidTag}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700 font-medium">{cow.breed}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {cow.age} {t('years')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900">{cow.healthScore}</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${getHealthBarColor(cow.healthScore)} progress-bar-animate`}
                        style={{ width: `${cow.healthScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {cow.currentYield} {t('liters')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(cow.feedRequirements.greenFodder + cow.feedRequirements.dryFodder + 
                    cow.feedRequirements.concentrate).toFixed(1)} {t('kg')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${getStatusColor(cow.status)}
                    transition-all duration-200
                    ${hoveredRow === cow.id ? 'shadow-sm scale-105' : ''}
                  `}>
                    {cow.status === 'healthy' && <span className="mr-1">✓</span>}
                    {cow.status === 'warning' && <span className="mr-1">⚠</span>}
                    {cow.status === 'alert' && <span className="mr-1">!</span>}
                    {getStatusText(cow.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
