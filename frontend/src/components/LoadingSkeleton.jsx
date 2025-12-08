export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-3"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
        <div className="skeleton w-14 h-14 rounded-full"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <th key={i} className="px-6 py-3">
                  <div className="skeleton h-4 w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <td key={i} className="px-6 py-4">
                    <div className="skeleton h-4 w-16"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-200">
        <div className="skeleton h-6 w-48 mb-2"></div>
        <div className="skeleton h-4 w-64"></div>
      </div>
      <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
      <div className="p-3 bg-gray-50 flex gap-4 justify-center border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="skeleton w-4 h-4 rounded-full"></div>
            <div className="skeleton h-4 w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickStatsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="skeleton h-6 w-32 mb-4"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-5 w-16"></div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="skeleton h-5 w-24 mb-2"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="skeleton w-2 h-2 rounded-full"></div>
              <div className="skeleton h-4 w-40"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FullPageLoader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="loading-spinner"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🐄</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      <div className="mt-2 flex gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}
