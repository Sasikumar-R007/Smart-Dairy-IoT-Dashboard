import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function CowDetail({ language = 'en' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cow, setCow] = useState(null);
  const [health, setHealth] = useState(null);
  const [yieldHistory, setYieldHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = (key) => {
    const translations = {
      en: {
        backToDashboard: 'Back to Dashboard',
        healthMetrics: 'Health Metrics',
        feedRequirements: 'Feed Requirements',
        milkYieldMonitoring: 'Milk Yield Monitoring',
        profitAnalysis: 'Profit Analysis',
        healthScore: 'Health Score',
        temperature: 'Temperature',
        activityScore: 'Activity Score',
        rumination: 'Rumination',
        currentYield: 'Current Yield',
        greenFodder: 'Green Fodder',
        dryFodder: 'Dry Fodder',
        concentrate: 'Concentrate',
        minerals: 'Minerals',
        feedCost: 'Feed Cost',
        milkRevenue: 'Milk Revenue',
        netProfit: 'Net Profit',
        perDay: 'per day',
        avgYield: 'Avg (30 days)',
        peakYield: 'Peak Yield',
        trend: 'Trend',
        loading: 'Loading...',
        cowNotFound: 'Cow not found',
        breed: 'Breed',
        age: 'Age',
        weight: 'Weight',
        lactationStage: 'Lactation Stage',
        years: 'years',
        kg: 'kg',
        liters: 'L',
        healthAlerts: 'Health Alerts',
        dailyMilkYield: 'Daily Milk Yield',
        earTagId: 'Ear Tag',
        zone: 'Current Zone'
      },
      ta: {
        backToDashboard: 'முகப்புக்கு திரும்பு',
        healthMetrics: 'உடல்நலம் அளவீடுகள்',
        feedRequirements: 'தீவன தேவைகள்',
        milkYieldMonitoring: 'பால் உற்பத்தி கண்காணிப்பு',
        profitAnalysis: 'லாப பகுப்பாய்வு',
        healthScore: 'உடல்நலம் மதிப்பெண்',
        temperature: 'வெப்பநிலை',
        activityScore: 'செயல்பாடு மதிப்பெண்',
        rumination: 'அசை',
        currentYield: 'தற்போதைய உற்பத்தி',
        greenFodder: 'பச்சை தீவனம்',
        dryFodder: 'உலர் தீவனம்',
        concentrate: 'செறிவூட்டம்',
        minerals: 'தாது உப்புகள்',
        feedCost: 'தீவன செலவு',
        milkRevenue: 'பால் வருமானம்',
        netProfit: 'நிகர லாபம்',
        perDay: 'ஒரு நாள்',
        avgYield: 'சராசரி (30 நாள்)',
        peakYield: 'உச்ச உற்பத்தி',
        trend: 'போக்கு',
        loading: 'ஏற்றுகிறது...',
        cowNotFound: 'மாடு கிடைக்கவில்லை',
        breed: 'இனம்',
        age: 'வயது',
        weight: 'எடை',
        lactationStage: 'பால் கொடுக்கும் நிலை',
        years: 'ஆண்டுகள்',
        kg: 'கிகி',
        liters: 'லி',
        healthAlerts: 'உடல்நலம் எச்சரிக்கைகள்',
        dailyMilkYield: 'தினசரி பால் உற்பத்தி',
        earTagId: 'காது டேக்',
        zone: 'தற்போதைய பகுதி'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    loadCowData();
  }, [id]);

  const loadCowData = async () => {
    try {
      const [cowData, healthData, yieldData] = await Promise.all([
        api.getCow(id),
        api.getHealth(id),
        api.getYield(id)
      ]);
      setCow(cowData);
      setHealth(healthData);
      setYieldHistory(yieldData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cow data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (!cow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">{t('cowNotFound')}</div>
      </div>
    );
  }

  const feedData = [
    { name: t('greenFodder'), amount: cow.feedRequirements.greenFodder },
    { name: t('dryFodder'), amount: cow.feedRequirements.dryFodder },
    { name: t('concentrate'), amount: cow.feedRequirements.concentrate },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-green-600 hover:text-green-700 flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('backToDashboard')}
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cow.name || cow.id}</h1>
              <p className="text-gray-500 mt-1">{t('earTagId')}: {cow.earTagId || cow.rfidTag}</p>
              <p className="text-gray-500">{t('zone')}: {cow.zone}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              cow.status === 'healthy' ? 'bg-green-100 text-green-800' :
              cow.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cow.status === 'healthy' ? (language === 'ta' ? 'ஆரோக்கியமான' : 'HEALTHY') :
               cow.status === 'warning' ? (language === 'ta' ? 'எச்சரிக்கை' : 'WARNING') :
               (language === 'ta' ? 'அபாய எச்சரிக்கை' : 'ALERT')}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">{t('breed')}</p>
              <p className="text-lg font-semibold">{cow.breed}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">{t('age')}</p>
              <p className="text-lg font-semibold">{cow.age} {t('years')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">{t('weight')}</p>
              <p className="text-lg font-semibold">{cow.weight} {t('kg')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">{t('lactationStage')}</p>
              <p className="text-lg font-semibold">{cow.lactationStage}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">{t('currentYield')}</p>
              <p className="text-lg font-semibold">{cow.currentYield} {t('liters')}/day</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('healthMetrics')}</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t('healthScore')}</span>
                  <span className="font-semibold">{health?.healthScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      health?.healthScore >= 80 ? 'bg-green-500' :
                      health?.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${health?.healthScore}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-3 rounded-r-lg">
                  <p className="text-gray-500 text-sm">{t('temperature')}</p>
                  <p className="text-lg font-semibold">{cow.temperature}°C</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 bg-green-50 p-3 rounded-r-lg">
                  <p className="text-gray-500 text-sm">{t('activityScore')}</p>
                  <p className="text-lg font-semibold">{cow.activityScore}/100</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3 bg-purple-50 p-3 rounded-r-lg">
                  <p className="text-gray-500 text-sm">{t('rumination')}</p>
                  <p className="text-lg font-semibold">{cow.ruminationScore}/100</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3 bg-yellow-50 p-3 rounded-r-lg">
                  <p className="text-gray-500 text-sm">{t('currentYield')}</p>
                  <p className="text-lg font-semibold">{cow.currentYield} {t('liters')}</p>
                </div>
              </div>
              {health?.alerts && health.alerts.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-semibold text-red-800 mb-2">{t('healthAlerts')}:</p>
                  <ul className="list-disc list-inside text-red-700 text-sm">
                    {health.alerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('feedRequirements')}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border-l-4 border-green-500 pl-3 p-2">
                <p className="text-gray-500 text-sm">{t('greenFodder')}</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.greenFodder} {t('kg')}</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 p-2">
                <p className="text-gray-500 text-sm">{t('dryFodder')}</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.dryFodder} {t('kg')}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 p-2">
                <p className="text-gray-500 text-sm">{t('concentrate')}</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.concentrate} {t('kg')}</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3 p-2">
                <p className="text-gray-500 text-sm">{t('minerals')}</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.minerals} {t('kg')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('milkYieldMonitoring')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis label={{ value: `${t('liters')}`, angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US')}
                formatter={(value) => [`${value.toFixed(2)} ${t('liters')}`, t('dailyMilkYield')]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="yield" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                name={t('dailyMilkYield')}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('currentYield')}</p>
              <p className="text-2xl font-bold text-blue-600">{cow.currentYield} {t('liters')}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('avgYield')}</p>
              <p className="text-2xl font-bold text-green-600">
                {yieldHistory.length > 0 ? (yieldHistory.reduce((sum, d) => sum + d.yield, 0) / yieldHistory.length).toFixed(1) : 0} {t('liters')}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('peakYield')}</p>
              <p className="text-2xl font-bold text-purple-600">
                {yieldHistory.length > 0 ? Math.max(...yieldHistory.map(d => d.yield)).toFixed(1) : 0} {t('liters')}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('trend')}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {yieldHistory.length >= 2 ? 
                  (yieldHistory[yieldHistory.length - 1].yield > yieldHistory[0].yield ? '📈' : '📉') 
                  : '➡️'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('profitAnalysis')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-gray-600 mb-2">{t('feedCost')}</p>
              <p className="text-3xl font-bold text-blue-600">₹{cow.feedRequirements.totalFeedCost}</p>
              <p className="text-sm text-gray-500 mt-1">{t('perDay')}</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-2">{t('milkRevenue')}</p>
              <p className="text-3xl font-bold text-green-600">₹{cow.feedRequirements.expectedMilkRevenue}</p>
              <p className="text-sm text-gray-500 mt-1">{t('perDay')}</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <p className="text-gray-600 mb-2">{t('netProfit')}</p>
              <p className={`text-3xl font-bold ${
                cow.feedRequirements.dailyProfit >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                ₹{cow.feedRequirements.dailyProfit}
              </p>
              <p className="text-sm text-gray-500 mt-1">{t('perDay')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
