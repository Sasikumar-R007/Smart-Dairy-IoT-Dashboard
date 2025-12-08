import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import CowTable from '../components/CowTable';
import LiveMap from '../components/LiveMap';
import { 
  StatCardSkeleton, 
  TableSkeleton, 
  MapSkeleton, 
  QuickStatsSkeleton,
  FullPageLoader 
} from '../components/LoadingSkeleton';

export default function Dashboard({ language = 'en' }) {
  const [stats, setStats] = useState(null);
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
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
        loading: 'Loading your farm data...',
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
        loading: 'உங்கள் பண்ணை தரவை ஏற்றுகிறது...',
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
      setTimeout(() => setDataLoaded(true), 100);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleCowClick = (cow) => {
    navigate(`/cow/${cow.id}`);
  };

  if (loading) {
    return <FullPageLoader message={t('loading')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="inline-block animate-bounce-gentle">📊</span>
            {t('appName')}
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {language === 'ta' ? 'உங்கள் பண்ணையை நிகழ்நேரத்தில் கண்காணிக்கவும்' : 'Monitor your farm in real-time'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={t('totalCows')}
            value={stats?.totalCows || 0}
            icon={<span className="text-2xl">🐄</span>}
            color="green"
            delay={0}
          />
          <StatCard
            title={t('cowsInLactation')}
            value={stats?.lactatingCows || 0}
            icon={<span className="text-2xl">🥛</span>}
            color="blue"
            delay={50}
          />
          <StatCard
            title={`${t('todaysMilkYield')} (${t('liters')})`}
            value={stats?.totalMilkYield || 0}
            icon={<span className="text-2xl">📊</span>}
            color="purple"
            delay={100}
          />
          <StatCard
            title={`${t('totalFeedRequired')} (${t('kg')})`}
            value={stats?.totalFeedRequired || 0}
            icon={<span className="text-2xl">🌾</span>}
            color="yellow"
            delay={150}
          />
          <StatCard
            title={t('healthAlerts')}
            value={stats?.healthAlerts || 0}
            icon={<span className="text-2xl">⚠️</span>}
            color="red"
            delay={200}
          />
          <StatCard
            title={`${t('dailyProfit')} (${t('inr')})`}
            value={`₹${stats?.estimatedDailyProfit || 0}`}
            icon={<span className="text-2xl">💰</span>}
            color="green"
            delay={250}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <LiveMap cows={cows} language={language} onCowClick={handleCowClick} />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up card-interactive" style={{ animationDelay: '350ms' }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              {t('quickStats')}
            </h2>
            <div className="space-y-4">
              <QuickStatItem 
                label={t('avgMilkPerCow')}
                value={`${stats?.totalCows > 0 ? (stats.totalMilkYield / stats.totalCows).toFixed(1) : 0} ${t('liters')}`}
                icon="🥛"
                delay={400}
              />
              <QuickStatItem 
                label={t('avgFeedPerCow')}
                value={`${stats?.totalCows > 0 ? (stats.totalFeedRequired / stats.totalCows).toFixed(1) : 0} ${t('kg')}`}
                icon="🌾"
                delay={450}
              />
              <QuickStatItem 
                label={t('profitPerCow')}
                value={`₹${stats?.totalCows > 0 ? (stats.estimatedDailyProfit / stats.totalCows).toFixed(2) : 0}`}
                icon="💵"
                delay={500}
              />
              <QuickStatItem 
                label={t('healthAlertRate')}
                value={`${stats?.totalCows > 0 ? ((stats.healthAlerts / stats.totalCows) * 100).toFixed(1) : 0}%`}
                valueColor={stats?.healthAlerts > 0 ? 'text-red-600' : 'text-green-600'}
                icon={stats?.healthAlerts > 0 ? '⚠️' : '✅'}
                delay={550}
              />
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span className="text-xl">📡</span>
                {language === 'ta' ? 'IoT நிலை' : 'IoT Status'}
              </h3>
              <div className="space-y-3 text-sm">
                <IoTStatusItem 
                  label={language === 'ta' ? 'காது டேக் சென்சார்கள் இணைக்கப்பட்டுள்ளன' : 'Ear tag sensors connected'}
                  delay={650}
                />
                <IoTStatusItem 
                  label={language === 'ta' ? 'GPS கண்காணிப்பு செயலில் உள்ளது' : 'GPS tracking active'}
                  delay={700}
                />
                <IoTStatusItem 
                  label={language === 'ta' ? 'வெப்பநிலை சென்சார்கள் இயங்குகின்றன' : 'Temperature sensors running'}
                  delay={750}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🐄</span>
            {t('cowStatus')}
          </h2>
          <CowTable cows={cows} language={language} />
        </div>
      </div>
    </div>
  );
}

function QuickStatItem({ label, value, icon, valueColor = 'text-gray-900', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`
        flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white 
        rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer
        ${isHovered ? 'shadow-md border-green-200 scale-[1.02]' : 'hover:shadow-sm'}
        ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <span className={`text-xl transition-transform duration-200 ${isHovered ? 'scale-125' : ''}`}>{icon}</span>
        <span className="text-gray-600">{label}</span>
      </div>
      <span className={`font-semibold text-lg ${valueColor} transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function IoTStatusItem({ label, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-100/50 transition-all duration-200 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></div>
      </div>
      <span className="text-green-700 font-medium">{label}</span>
    </div>
  );
}
