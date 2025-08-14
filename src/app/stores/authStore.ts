import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean; // Adicionado para controlar o estado de hidratação
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void; // Adicionada função para mudar o estado
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          token: null,
          user: null,
          isAuthenticated: false,
          _hasHydrated: false, // Estado inicial

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

          setHasHydrated: (state) => { // Implementação da função
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
            isAuthenticated: state.isAuthenticated, // Persistir o isAuthenticated também
          }),
          onRehydrateStorage: () => (state) => { // Ação a ser executada após a reidratação
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