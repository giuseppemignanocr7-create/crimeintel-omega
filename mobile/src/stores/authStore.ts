import { create } from 'zustand';
import mobileApi from '../api/client';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const data = await mobileApi.login(email, password);
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', loading: false });
    }
  },

  logout: async () => {
    await mobileApi.clearToken();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = await mobileApi.getToken();
    if (token) {
      try {
        const res = await mobileApi.getCaseStats();
        set({ isAuthenticated: true });
      } catch {
        await mobileApi.clearToken();
        set({ isAuthenticated: false });
      }
    }
  },
}));
