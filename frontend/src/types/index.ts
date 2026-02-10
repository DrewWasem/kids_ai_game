export interface APIResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ErrorResponse {
  detail: string;
  error_id?: string;
  type?: string;
}
