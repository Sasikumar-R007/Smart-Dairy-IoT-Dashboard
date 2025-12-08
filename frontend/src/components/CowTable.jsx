import { useNavigate } from 'react-router-dom';

export default function CowTable({ cows, language = 'en' }) {
  const navigate = useNavigate();

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
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('breed')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('age')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('healthScore')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('milkYield')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('feedRequired')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cows.map((cow) => (
              <tr
                key={cow.id}
                onClick={() => navigate(`/cow/${cow.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{cow.name || cow.id}</div>
                  <div className="text-sm text-gray-500">{cow.earTagId || cow.rfidTag}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cow.breed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cow.age} {t('years')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{cow.healthScore}</div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          cow.healthScore >= 80 ? 'bg-green-500' :
                          cow.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${cow.healthScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cow.currentYield} {t('liters')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(cow.feedRequirements.greenFodder + cow.feedRequirements.dryFodder + 
                    cow.feedRequirements.concentrate).toFixed(1)} {t('kg')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(cow.status)}`}>
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
