import create from "zustand";

type User = { id: string; email?: string; firstName?: string; lastName?: string; role?: string } | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u: User) => set({ user: u }),
  logout: () => set({ user: null }),
}));
