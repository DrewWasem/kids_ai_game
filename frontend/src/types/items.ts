export interface Item {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ItemCreate {
  title: string;
  description?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface ItemUpdate {
  title?: string;
  description?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}
