import { useSyncExternalStore } from 'react';

/**
 * How much of the top safe area something drawn above the whole navigator covers (the lesson audio's player bar draws over the status
 * bar). Each tab screen gets its own natively measured safe area from the tab bar, which ignores the bar, so the screens subtract this
 * from their top padding themselves instead of leaving a gap the height of the status bar under it (owner's screenshot, 2026-11-18).
 */
let covered = 0;
const listeners = new Set<() => void>();

export function setTopCovered(points: number): void {
  if (points === covered) return;
  covered = points;
  listeners.forEach((listener) => listener());
}

export function useTopCovered(): number {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => covered,
  );
}
