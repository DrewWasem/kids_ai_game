import type { Item } from '../../types/items';
import type { User } from '../../types/auth';

let nextId = 1;

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: nextId++,
    email: `user${nextId}@example.com`,
    display_name: `User ${nextId}`,
    is_active: true,
    ...overrides,
  };
}

export function createMockItem(overrides: Partial<Item> = {}): Item {
  const id = nextId++;
  return {
    id,
    user_id: 1,
    title: `Item ${id}`,
    description: `Description for item ${id}`,
    status: 'active',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockItems(count: number): Item[] {
  return Array.from({ length: count }, () => createMockItem());
}
