import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '□' },
  { path: '/items', label: 'Items', icon: '≡' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">MyApp</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button onClick={toggleTheme} className="w-full btn-secondary text-sm">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 truncate">{user?.email}</span>
            <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <Outlet />
      </main>
    </div>
  );
}
