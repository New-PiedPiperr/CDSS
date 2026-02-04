/**
 * Auth Provider Component
 * Wraps app with authentication context and hydration
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function AuthProvider({ children }) {
  const { hydrate, isLoading } = useAuthStore();

  useEffect(() => {
    // Hydrate auth state from /api/auth/me on mount
    hydrate();
  }, [hydrate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <style>
          {`
            .loader {
              width: 48px;
              height: 48px;
              border: 5px dotted #3b82f6;
              border-radius: 50%;
              display: inline-block;
              position: relative;
              box-sizing: border-box;
              animation: rotation 2s linear infinite;
            }
            @keyframes rotation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <span className="loader"></span>
      </div>
    );
  }

  return children;
}
