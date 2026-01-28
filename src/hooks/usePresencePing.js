'use client';

import { useEffect } from 'react';

/**
 * Hook to send presence heartbeat pings
 * Sends a POST request to /api/presence/ping every 30 seconds
 * Stops when tab is hidden or component unmounts
 * @param {boolean} enabled - Whether the ping should be active (default: true)
 */
export function usePresencePing(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Ping function
    const sendPing = async () => {
      // Don't ping if tab is hidden
      if (document.visibilityState === 'hidden') return;

      try {
        await fetch('/api/presence/ping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Silently fail for presence pings
        console.error('Presence ping failed:', error);
      }
    };

    // Initial ping
    sendPing();

    // Set up interval
    const intervalId = setInterval(sendPing, 30 * 1000); // 30 seconds

    // Handle visibility change to resume pinging immediately when returning
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendPing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
}
