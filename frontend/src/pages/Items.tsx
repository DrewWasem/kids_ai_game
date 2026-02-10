import { useCallback, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import Modal, { ConfirmDialog } from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import { handleApiError } from '../config/api';
import { listItems, createItem, deleteItem } from '../services/itemsApi';
import type { Item } from '../types/items';
import type { PaginatedResponse } from '../types';

export default function Items() {
  const { addToast } = useToast();
  const [data, setData] = useState<PaginatedResponse<Item> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listItems(page);
      setData(result);
    } catch (err) {
      addToast(handleApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, addToast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = async () => {
    try {
      await createItem({ title, description });
      addToast('Item created', 'success');
      setShowCreate(false);
      setTitle('');
      setDescription('');
      fetchItems();
    } catch (err) { addToast(handleApiError(err), 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId);
      addToast('Item deleted', 'success');
      setDeleteId(null);
      fetchItems();
    } catch (err) { addToast(handleApiError(err), 'error'); }
  };

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'status', header: 'Status', render: (item: Item) => (
      <span className={item.status === 'active' ? 'badge-green' : 'badge-gray'}>{item.status}</span>
    )},
    { key: 'created_at', header: 'Created', render: (item: Item) => new Date(item.created_at).toLocaleDateString() },
    { key: 'actions', header: '', render: (item: Item) => (
      <button onClick={e => { e.stopPropagation(); setDeleteId(item.id); }} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Items</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary">Create Item</button>
      </div>

      <div className="card">
        <DataTable columns={columns} data={data?.items ?? []} loading={loading} />
        {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Item">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} disabled={!title} className="btn-primary">Create</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                     title="Delete Item" message="Are you sure? This action cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
