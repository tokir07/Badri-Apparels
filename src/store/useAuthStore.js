import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import { setAccessToken } from '../services/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      loading: true,

      checkAuth: async () => {
        const savedUser = authService.getCurrentUser();
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (savedUser && refreshToken) {
          set({ 
            user: savedUser, 
            role: savedUser.role?.toLowerCase(), 
            isAuthenticated: true,
            loading: false 
          });
          // Optionally trigger a silent refresh to get a fresh access token
          get().silentRefresh();
        } else {
          set({ loading: false });
        }
      },

      silentRefresh: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;

        try {
          const response = await authService.refreshToken(refreshToken);
          if (response.success) {
            const userData = response.data;
            setAccessToken(userData.accessToken);
            localStorage.setItem('refreshToken', userData.refreshToken);
            set({ 
              user: userData, 
              role: userData.role?.toLowerCase(), 
              isAuthenticated: true 
            });
          }
        } catch (error) {
          console.error("Silent refresh failed:", error);
          get().logout();
        }
      },

      login: async (email, password) => {
        try {
          const response = await authService.login({ email, password });
          if (response.success) {
            const userData = response.data;
            setAccessToken(userData.accessToken);
            localStorage.setItem('refreshToken', userData.refreshToken);
            set({ 
              user: userData, 
              role: userData.role?.toLowerCase(), 
              isAuthenticated: true 
            });
            return { success: true, role: userData.role?.toLowerCase() };
          }
          return { success: false, message: response.message };
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Authentication failed. Please check your credentials.' 
          };
        }
      },

      signup: async (userData) => {
        try {
          const response = await authService.signup(userData);
          if (response.success) {
            const userData = response.data;
            setAccessToken(userData.accessToken);
            localStorage.setItem('refreshToken', userData.refreshToken);
            set({ 
              user: userData, 
              role: userData.role?.toLowerCase(), 
              isAuthenticated: true 
            });
            return { success: true };
          }
          return { success: false, message: response.message };
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Registration failed. Please try again.' 
          };
        }
      },

      logout: () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          authService.logout(refreshToken);
        }
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        set({ 
          user: null, 
          role: null, 
          isAuthenticated: false 
        });
      },

      updateProfile: async (userData) => {
        try {
          const response = await authService.updateProfile(userData);
          if (response.success) {
            const updatedUser = authService.getCurrentUser();
            set({ user: updatedUser });
            return { success: true };
          }
          return { success: false, message: response.message };
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to update profile.' 
          };
        }
      },
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'badri-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, role: state.role }),
    }
  )
);
