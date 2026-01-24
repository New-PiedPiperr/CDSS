/**
 * Auth Provider Component
 * Wraps app with authentication context and hydration
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function AuthProvider({ children }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // Hydrate auth state from localStorage on mount
    hydrate();
  }, [hydrate]);

  return children;
}
