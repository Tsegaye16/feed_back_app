export interface LoginData {
  // name: string;
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface AuthState {
  authData: AuthResponse | null;
  loading: boolean;
  error: string | null;
}
