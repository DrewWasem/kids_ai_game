import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <div className="card max-w-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</label>
            <p className="text-gray-900 dark:text-white">{user?.display_name || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
