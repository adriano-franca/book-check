import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string; // ID do usuário
  tipoUsuario: 'LEITOR' | 'SEBO'; // Tipo do usuário
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  usuarioId: number | null;
  tipoUsuario: 'leitor' | 'sebo' | null;
  login: (email: string, password: string, tipoUsuario: 'leitor' | 'sebo') => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  usuarioId: parseInt(localStorage.getItem('usuarioId') || '0') || null,
  tipoUsuario: localStorage.getItem('tipoUsuario') as 'leitor' | 'sebo' | null,
  login: async (email: string, password: string, tipoUsuario: 'leitor' | 'sebo') => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: email,
        password,
      });
      const { token } = response.data;
      const decoded: TokenPayload = jwtDecode(token);
      const usuarioId = parseInt(decoded.sub);
      const tipoUsuarioBackend = decoded.tipoUsuario.toLowerCase() as 'leitor' | 'sebo';
      if (tipoUsuario !== tipoUsuarioBackend) {
        throw new Error('Tipo de usuário inválido');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('usuarioId', usuarioId.toString());
      localStorage.setItem('tipoUsuario', tipoUsuario);
      set({ isAuthenticated: true, token, usuarioId, tipoUsuario });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('tipoUsuario');
    set({ isAuthenticated: false, token: null, usuarioId: null, tipoUsuario: null });
  },
}));