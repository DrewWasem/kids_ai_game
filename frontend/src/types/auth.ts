export interface User {
  id: number;
  email: string;
  display_name: string | null;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
