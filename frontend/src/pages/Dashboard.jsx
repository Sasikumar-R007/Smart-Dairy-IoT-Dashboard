import { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import CowTable from '../components/CowTable';
import FarmMap from '../components/FarmMap';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Smart Dairy IoT Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Cows"
            value={stats?.totalCows || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="green"
          />
          <StatCard
            title="Cows in Lactation"
            value={stats?.lactatingCows || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="blue"
          />
          <StatCard
            title="Today's Milk Yield (L)"
            value={stats?.totalMilkYield || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="purple"
          />
          <StatCard
            title="Total Feed Required (kg)"
            value={stats?.totalFeedRequired || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="yellow"
          />
          <StatCard
            title="Health Alerts"
            value={stats?.healthAlerts || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="red"
          />
          <StatCard
            title="Daily Profit ($)"
            value={stats?.estimatedDailyProfit || 0}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FarmMap cows={cows} />
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Milk per Cow</span>
                <span className="font-semibold">{stats?.totalCows > 0 ? (stats.totalMilkYield / stats.totalCows).toFixed(1) : 0} L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Feed per Cow</span>
                <span className="font-semibold">{stats?.totalCows > 0 ? (stats.totalFeedRequired / stats.totalCows).toFixed(1) : 0} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit per Cow</span>
                <span className="font-semibold">${stats?.totalCows > 0 ? (stats.estimatedDailyProfit / stats.totalCows).toFixed(2) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Health Alert Rate</span>
                <span className={`font-semibold ${stats?.healthAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats?.totalCows > 0 ? ((stats.healthAlerts / stats.totalCows) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cow Status</h2>
          <CowTable cows={cows} />
        </div>
      </div>
    </div>
  );
}
