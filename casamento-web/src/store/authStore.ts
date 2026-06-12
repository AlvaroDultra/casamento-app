import { create } from "zustand";
import type { User } from "@/types";

const SESSION_KEY = "casamento_token";
const SESSION_USER = "casamento_user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  rehydrate: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  setAuth: (token, user) => {
    // localStorage: o convidado continua logado mesmo fechando o app durante a festa
    localStorage.setItem(SESSION_KEY, token);
    localStorage.setItem(SESSION_USER, JSON.stringify(user));
    set({ token, user });
  },

  updateUser: (partial) => {
    const updated = { ...get().user!, ...partial };
    localStorage.setItem(SESSION_USER, JSON.stringify(updated));
    set({ user: updated });
  },

  clearAuth: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_USER);
    set({ token: null, user: null });
  },

  isAuthenticated: () => get().token !== null,

  rehydrate: () => {
    if (get().token) return;
    try {
      const token = localStorage.getItem(SESSION_KEY);
      const raw = localStorage.getItem(SESSION_USER);
      if (token && raw) {
        set({ token, user: JSON.parse(raw) });
      }
    } catch {
      // localStorage indisponível (SSR) — ignorar
    }
  },
}));
