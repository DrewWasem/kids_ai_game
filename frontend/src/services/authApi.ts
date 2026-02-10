import { apiFetch } from '../config/api';
import type { TokenResponse, User } from '../types/auth';

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email: string, password: string, displayName?: string): Promise<User> {
  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, display_name: displayName }),
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/auth/me');
}
