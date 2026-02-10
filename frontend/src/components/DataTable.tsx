import React, { useState } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, loading, onRowClick }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey], bVal = b[sortKey];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (loading) {
    return <div className="card animate-pulse"><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" /></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 cursor-pointer select-none" onClick={() => col.sortable !== false && handleSort(col.key)}>
                <span className="flex items-center gap-1">
                  {col.header}
                  {sortKey === col.key && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sorted.map((item, i) => (
            <tr key={i} onClick={() => onRowClick?.(item)}
                className={`bg-white dark:bg-gray-800 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-gray-900 dark:text-gray-200">
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
