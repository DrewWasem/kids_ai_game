interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
};

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[type]}`}>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
}
