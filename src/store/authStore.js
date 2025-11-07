import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login(username, password);
          
          // Guardar en localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.register(userData);
          set({ isLoading: false, error: null });
          return { success: true, data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Verificar si el token es válido
      verifyAuth: async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
          return false;
        }

        try {
          await authAPI.verifyToken();
          set({
            user: JSON.parse(user),
            token,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
