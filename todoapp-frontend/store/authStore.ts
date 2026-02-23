import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const data = await authApi.login(username, password);
          set({ user: data.user, isAuthenticated: true });
          toast.success('Login successful!');
        } catch (error: any) {
          toast.error(error.response?.data?.error || 'Login failed');
          throw error;
        }
      },

      register: async (data: any) => {
        try {
          const user = await authApi.register(data);
          set({ user, isAuthenticated: true });
          toast.success('Registration successful!');
        } catch (error: any) {
          toast.error(error.response?.data?.error || 'Registration failed');
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      checkAuth: async () => {
        try {
          const data = await authApi.verify();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
