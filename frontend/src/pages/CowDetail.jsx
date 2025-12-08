import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function CowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cow, setCow] = useState(null);
  const [health, setHealth] = useState(null);
  const [yieldHistory, setYieldHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!cow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cow not found</div>
      </div>
    );
  }

  const feedData = [
    { name: 'Green Fodder', amount: cow.feedRequirements.greenFodder, color: '#22c55e' },
    { name: 'Dry Fodder', amount: cow.feedRequirements.dryFodder, color: '#eab308' },
    { name: 'Concentrate', amount: cow.feedRequirements.concentrate, color: '#3b82f6' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-farm-green-600 hover:text-farm-green-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cow.id}</h1>
              <p className="text-gray-500 mt-1">RFID: {cow.rfidTag}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              cow.status === 'healthy' ? 'bg-green-100 text-green-800' :
              cow.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cow.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-gray-500 text-sm">Breed</p>
              <p className="text-lg font-semibold">{cow.breed}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Age</p>
              <p className="text-lg font-semibold">{cow.age} years</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Weight</p>
              <p className="text-lg font-semibold">{cow.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Lactation Stage</p>
              <p className="text-lg font-semibold">{cow.lactationStage}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Health Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Health Score</span>
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
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="text-gray-500 text-sm">Temperature</p>
                  <p className="text-lg font-semibold">{cow.temperature}°C</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="text-gray-500 text-sm">Activity Score</p>
                  <p className="text-lg font-semibold">{cow.activityScore}/100</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="text-gray-500 text-sm">Rumination</p>
                  <p className="text-lg font-semibold">{cow.ruminationScore}/100</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <p className="text-gray-500 text-sm">Current Yield</p>
                  <p className="text-lg font-semibold">{cow.currentYield} L</p>
                </div>
              </div>
              {health?.alerts && health.alerts.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="font-semibold text-red-800 mb-2">Health Alerts:</p>
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
            <h2 className="text-xl font-semibold mb-4">Feed Requirements</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={feedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border-l-4 border-green-500 pl-3">
                <p className="text-gray-500 text-sm">Green Fodder</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.greenFodder} kg</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <p className="text-gray-500 text-sm">Dry Fodder</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.dryFodder} kg</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-gray-500 text-sm">Concentrate</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.concentrate} kg</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <p className="text-gray-500 text-sm">Minerals</p>
                <p className="text-lg font-semibold">{cow.feedRequirements.minerals} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Milk Yield Monitoring</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis label={{ value: 'Yield (L)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value.toFixed(2)} L`, 'Yield']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="yield" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                name="Daily Milk Yield"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm">Current Yield</p>
              <p className="text-2xl font-bold text-blue-600">{cow.currentYield} L</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Avg (30 days)</p>
              <p className="text-2xl font-bold text-green-600">
                {yieldHistory.length > 0 ? (yieldHistory.reduce((sum, d) => sum + d.yield, 0) / yieldHistory.length).toFixed(1) : 0} L
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm">Peak Yield</p>
              <p className="text-2xl font-bold text-purple-600">
                {yieldHistory.length > 0 ? Math.max(...yieldHistory.map(d => d.yield)).toFixed(1) : 0} L
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-gray-600 text-sm">Trend</p>
              <p className="text-2xl font-bold text-yellow-600">
                {yieldHistory.length >= 2 ? 
                  (yieldHistory[yieldHistory.length - 1].yield > yieldHistory[0].yield ? '📈' : '📉') 
                  : '➡️'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profit Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 mb-2">Feed Cost</p>
              <p className="text-3xl font-bold text-blue-600">${cow.feedRequirements.totalFeedCost}</p>
              <p className="text-sm text-gray-500 mt-1">per day</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-2">Milk Revenue</p>
              <p className="text-3xl font-bold text-green-600">${cow.feedRequirements.expectedMilkRevenue}</p>
              <p className="text-sm text-gray-500 mt-1">per day</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 mb-2">Net Profit</p>
              <p className={`text-3xl font-bold ${
                cow.feedRequirements.dailyProfit >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                ${cow.feedRequirements.dailyProfit}
              </p>
              <p className="text-sm text-gray-500 mt-1">per day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
