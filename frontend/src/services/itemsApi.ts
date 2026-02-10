import { apiFetch } from '../config/api';
import type { Item, ItemCreate, ItemUpdate } from '../types/items';
import type { PaginatedResponse } from '../types';

export async function listItems(page = 1, limit = 50): Promise<PaginatedResponse<Item>> {
  return apiFetch(`/items?page=${page}&limit=${limit}`);
}

export async function createItem(data: ItemCreate): Promise<Item> {
  return apiFetch('/items', { method: 'POST', body: JSON.stringify(data) });
}

export async function getItem(id: number): Promise<Item> {
  return apiFetch(`/items/${id}`);
}

export async function updateItem(id: number, data: ItemUpdate): Promise<Item> {
  return apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteItem(id: number): Promise<void> {
  return apiFetch(`/items/${id}`, { method: 'DELETE' });
}
