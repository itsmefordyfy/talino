import { useSyncExternalStore } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const noopSubscribe = () => () => {};

/**
 * Web: the browser's scheme. With static rendering it's only known on the client, so it reads as
 * light until hydrated; `useSyncExternalStore` flips it without an extra effect-triggered render.
 */
export function useColorScheme(): 'light' | 'dark' {
  const hasHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const system = useSystemColorScheme();
  return hasHydrated && system === 'dark' ? 'dark' : 'light';
}
