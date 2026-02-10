export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">--</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</h3>
          <p className="text-3xl font-bold text-green-600 mt-1">--</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
          <p className="text-3xl font-bold text-primary-600 mt-1">--</p>
        </div>
      </div>
    </div>
  );
}
