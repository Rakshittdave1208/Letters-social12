import { create } from "zustand";

type User = {
  id: string;
  name: string;
};

type AuthState = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (name) =>
    set({
      user: {
        id: Date.now().toString(),
        name,
      },
    }),

  logout: () => set({ user: null }),
}));