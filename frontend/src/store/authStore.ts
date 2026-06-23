import { create } from 'zustand';

interface AuthState {
  token: string | null;
  email: string | null;
  roles: string[];
  setAuth: (token: string, email: string, roles: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  email: null,
  roles: [],
  setAuth: (token, email, roles) => {
    localStorage.setItem('token', token);
    set({ token, email, roles });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, email: null, roles: [] });
  },
}));