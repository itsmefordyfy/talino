import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Runs `onActive` each time the app comes back to the front while `enabled`: a screen waiting on a
 * permission re-reads it after the owner went to Settings (Expo's permission hooks read it only
 * when they mount).
 */
export function useOnAppActive(onActive: () => void, enabled = true): void {
  const latest = useRef(onActive);
  useEffect(() => {
    latest.current = onActive;
  });
  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') latest.current();
    });
    return () => subscription.remove();
  }, [enabled]);
}
