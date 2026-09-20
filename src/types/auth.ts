export type UserRole = 'LEA' | 'BANK' | 'I4C' | 'ADMIN';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  agency: string;
  badgeNumber?: string;
  clearanceLevel: string;
  token: string;
  authorizedDashboard: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
