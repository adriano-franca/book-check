// @/app/stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  // Adicione outros campos do usuário conforme necessário
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
          token: null,
          user: null,
          isAuthenticated: false,

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

          hydrateAuth: () => {
            // Pode ser usado para verificar a validade do token
            const { token } = get();
            set({ isAuthenticated: !!token });
          }
        }),
        {
          name: "auth-storage", // Chave para localStorage
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            token: state.token,
            user: state.user
          }),
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