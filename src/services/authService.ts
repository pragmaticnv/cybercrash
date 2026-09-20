import { AuthResponse, AuthUser, LoginCredentials, UserRole } from '../types/auth';
import { findDemoAccount, DEMO_ACCOUNTS } from '../data/authDemoAccounts';

const AUTH_STORAGE_KEY = 'cybercrash_auth_session';

export const authService = {
  /**
   * Authenticate a user using provided credentials.
   * Note: In production this will make an async request to `/api/auth/login`.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Artificial slight network latency simulation for authentic Gov-Net auth feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const { username, password } = credentials;
    if (!username || !username.trim()) {
      return { success: false, error: 'Gov-Net Operator ID is required' };
    }

    const matchedEntry = findDemoAccount(username);
    if (!matchedEntry) {
      return {
        success: false,
        error: `Unknown Operator ID "${username}". Use a registered prototype demo account.`
      };
    }

    // Verify password (in prototype, accept assigned demo passwords or fallback 'password123')
    const isValidPassword =
      matchedEntry.passwords.includes(password.trim()) ||
      password.trim() === 'password123' ||
      password.trim() === 'admin' ||
      password.trim() === '••••••••••••';

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid authentication credential / password for this security profile.'
      };
    }

    // Save session to localStorage
    const authenticatedUser: AuthUser = {
      ...matchedEntry.user,
      token: `token_${Date.now()}_${matchedEntry.user.id}`
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch {
      // LocalStorage access errors handled gracefully
    }

    return {
      success: true,
      user: authenticatedUser
    };
  },

  /**
   * Clear active authentication session.
   */
  logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * Retrieve active session user if already stored.
   */
  getCurrentUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Check whether a user's role satisfies the required route permissions.
   */
  hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  },

  /**
   * Helper to retrieve all available demo accounts for reference in UI.
   */
  getDemoAccounts() {
    return DEMO_ACCOUNTS;
  }
};
