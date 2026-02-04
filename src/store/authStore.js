/**
 * Auth Store - Zustand Global State Management
 * Manages authentication state across the application
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'cdss-auth';

const initialState = {
  user: null,
  role: 'guest', // 'guest' | 'patient' | 'clinician' | 'admin'
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Login action - Set user data and token
       * @param {Object} userData - User object from API
       * @param {string} token - JWT token (if applicable)
       */
      login: (userData, token = null) => {
        console.log(`[Auth Store] Logging in user: ${userData?.email || userData?.id}`);
        set({
          user: userData,
          role: userData?.role?.toLowerCase() || 'guest',
          token: token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      /**
       * Logout action - Clear all auth state
       */
      logout: () => {
        console.log('[Auth Store] Logging out user');
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
        set({
          ...initialState,
          isLoading: false,
        });
      },

      /**
       * Hydrate action - Restore state from localStorage on app load
       * Fetches fresh user data from /api/auth/me
       */
      hydrate: async () => {
        console.log('[Auth Store] Starting hydration...');
        set({ isLoading: true });

        try {
          // Attempt to fetch fresh user data from the server
          // This is more reliable than localStorage and helps fix cookie-related issues
          const response = await fetch('/api/auth/me');

          if (response.ok) {
            const data = await response.json();
            console.log(
              '[Auth Store] Hydration successful, user fetched from /api/auth/me'
            );
            set({
              user: data.user,
              role: data.user.role?.toLowerCase() || 'guest',
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.warn(
              `[Auth Store] Hydration: /api/auth/me returned ${response.status}`
            );
            // If /me fails, we are probably not logged in
            set({
              ...initialState,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('[Auth Store] Hydration failed:', error);
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      /**
       * Update user profile data
       * @param {Object} updates - Partial user object
       */
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          console.log('[Auth Store] Updating user profile data');
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      /**
       * Set loading state
       * @param {boolean} loading
       */
      setLoading: (loading) => {
        console.log(`[Auth Store] Setting loading: ${loading}`);
        set({ isLoading: loading });
      },

      /**
       * Check if user has specific role
       * @param {string|string[]} requiredRoles - Role(s) to check
       * @returns {boolean}
       */
      hasRole: (requiredRoles) => {
        const currentRole = get().role;
        if (Array.isArray(requiredRoles)) {
          return requiredRoles.includes(currentRole);
        }
        return currentRole === requiredRoles;
      },

      /**
       * Get authorization header
       * @returns {Object} Headers object with Bearer token
       */
      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
