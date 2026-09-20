import { create } from 'zustand';
import { AuthUser, LoginCredentials, UserRole } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => void;
  clearError: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with persisted session if available
  const existingUser = authService.getCurrentUser();

  return {
    user: existingUser,
    isAuthenticated: !!existingUser,
    isLoading: false,
    error: null,

    login: async (credentials: LoginCredentials) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authService.login(credentials);
        if (response.success && response.user) {
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return { success: true, user: response.user };
        } else {
          const err = response.error || 'Authentication failed. Please verify credentials.';
          set({ isLoading: false, error: err });
          return { success: false, error: err };
        }
      } catch (err: any) {
        const errMessage = err?.message || 'Authentication error';
        set({ isLoading: false, error: errMessage });
        return { success: false, error: errMessage };
      }
    },

    logout: () => {
      authService.logout();
      set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => {
      set({ error: null });
    },

    checkSession: () => {
      const activeUser = authService.getCurrentUser();
      set({ user: activeUser, isAuthenticated: !!activeUser });
    }
  };
});
