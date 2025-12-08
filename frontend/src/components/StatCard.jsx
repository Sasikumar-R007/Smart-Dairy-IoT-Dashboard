export default function StatCard({ title, value, icon, color = 'green' }) {
  const iconBgClasses = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${iconBgClasses[color]} rounded-full p-4`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
