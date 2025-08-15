import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  tipoUsuario?: 'LEITOR' | 'SEBO';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          token: null,
          user: null,
          isAuthenticated: false,
          _hasHydrated: false,

          setAuth: (token, user) => {
            set({
              token,
              user,
              isAuthenticated: true
            });
          },

          clearAuth: () => {
            set({
              token: null,
              user: null,
              isAuthenticated: false
            });
          },

          setHasHydrated: (state) => {
            set({
              _hasHydrated: state
            });
          }
        }),
        {
          name: "auth-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            token: state.token,
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          }),
          onRehydrateStorage: () => (state) => {
            if (state) {
              state.setHasHydrated(true);
            }
          }
        }
    )
);

// Hook auxiliar para verificar autenticação
export const useAuth = () => {
  const { token, isAuthenticated, user } = useAuthStore();
  return {
    isAuthenticated: isAuthenticated && !!token,
    user,
    token
  };
};