import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import CowTable from '../components/CowTable';
import LiveMap from '../components/LiveMap';

export default function Dashboard({ language = 'en' }) {
  const [stats, setStats] = useState(null);
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const t = (key) => {
    const translations = {
      en: {
        appName: 'Smart Dairy IoT Dashboard',
        totalCows: 'Total Cows',
        cowsInLactation: 'Cows in Lactation',
        todaysMilkYield: "Today's Milk Yield",
        totalFeedRequired: 'Total Feed Required',
        healthAlerts: 'Health Alerts',
        dailyProfit: 'Daily Profit',
        quickStats: 'Quick Stats',
        avgMilkPerCow: 'Average Milk per Cow',
        avgFeedPerCow: 'Average Feed per Cow',
        profitPerCow: 'Profit per Cow',
        healthAlertRate: 'Health Alert Rate',
        cowStatus: 'Cow Status',
        loading: 'Loading...',
        liters: 'L',
        kg: 'kg',
        inr: 'INR'
      },
      ta: {
        appName: 'ஸ்மார்ட் டெய்ரி IoT டாஷ்போர்டு',
        totalCows: 'மொத்த மாடுகள்',
        cowsInLactation: 'பால் கொடுக்கும் மாடுகள்',
        todaysMilkYield: 'இன்றைய பால் உற்பத்தி',
        totalFeedRequired: 'மொத்த தீவனம் தேவை',
        healthAlerts: 'உடல்நலம் எச்சரிக்கைகள்',
        dailyProfit: 'தினசரி லாபம்',
        quickStats: 'விரைவு புள்ளிவிவரங்கள்',
        avgMilkPerCow: 'மாடுக்கு சராசரி பால்',
        avgFeedPerCow: 'மாடுக்கு சராசரி தீவனம்',
        profitPerCow: 'மாடுக்கு லாபம்',
        healthAlertRate: 'உடல்நலம் எச்சரிக்கை விகிதம்',
        cowStatus: 'மாடு நிலை',
        loading: 'ஏற்றுகிறது...',
        liters: 'லி',
        kg: 'கிகி',
        inr: 'ரூ'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, cowsData] = await Promise.all([
        api.getDashboardStats(),
        api.getCows()
      ]);
      setStats(statsData);
      setCows(cowsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleCowClick = (cow) => {
    navigate(`/cow/${cow.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('appName')}</h1>
          <p className="text-gray-500 mt-1">
            {language === 'ta' ? 'உங்கள் பண்ணையை நிகழ்நேரத்தில் கண்காணிக்கவும்' : 'Monitor your farm in real-time'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={t('totalCows')}
            value={stats?.totalCows || 0}
            icon={<span className="text-2xl">🐄</span>}
            color="green"
          />
          <StatCard
            title={t('cowsInLactation')}
            value={stats?.lactatingCows || 0}
            icon={<span className="text-2xl">🥛</span>}
            color="blue"
          />
          <StatCard
            title={`${t('todaysMilkYield')} (${t('liters')})`}
            value={stats?.totalMilkYield || 0}
            icon={<span className="text-2xl">📊</span>}
            color="purple"
          />
          <StatCard
            title={`${t('totalFeedRequired')} (${t('kg')})`}
            value={stats?.totalFeedRequired || 0}
            icon={<span className="text-2xl">🌾</span>}
            color="yellow"
          />
          <StatCard
            title={t('healthAlerts')}
            value={stats?.healthAlerts || 0}
            icon={<span className="text-2xl">⚠️</span>}
            color="red"
          />
          <StatCard
            title={`${t('dailyProfit')} (${t('inr')})`}
            value={`₹${stats?.estimatedDailyProfit || 0}`}
            icon={<span className="text-2xl">💰</span>}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LiveMap cows={cows} language={language} onCowClick={handleCowClick} />
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('quickStats')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('avgMilkPerCow')}</span>
                <span className="font-semibold text-lg">{stats?.totalCows > 0 ? (stats.totalMilkYield / stats.totalCows).toFixed(1) : 0} {t('liters')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('avgFeedPerCow')}</span>
                <span className="font-semibold text-lg">{stats?.totalCows > 0 ? (stats.totalFeedRequired / stats.totalCows).toFixed(1) : 0} {t('kg')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('profitPerCow')}</span>
                <span className="font-semibold text-lg">₹{stats?.totalCows > 0 ? (stats.estimatedDailyProfit / stats.totalCows).toFixed(2) : 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('healthAlertRate')}</span>
                <span className={`font-semibold text-lg ${stats?.healthAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats?.totalCows > 0 ? ((stats.healthAlerts / stats.totalCows) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                {language === 'ta' ? '💡 IoT நிலை' : '💡 IoT Status'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-700">
                    {language === 'ta' ? 'காது டேக் சென்சார்கள் இணைக்கப்பட்டுள்ளன' : 'Ear tag sensors connected'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-700">
                    {language === 'ta' ? 'GPS கண்காணிப்பு செயலில் உள்ளது' : 'GPS tracking active'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-700">
                    {language === 'ta' ? 'வெப்பநிலை சென்சார்கள் இயங்குகின்றன' : 'Temperature sensors running'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('cowStatus')}</h2>
          <CowTable cows={cows} language={language} />
        </div>
      </div>
    </div>
  );
}
