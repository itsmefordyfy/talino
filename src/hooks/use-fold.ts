/** The fold, as the system's reserved rect in window points (the iPhone Duo). */
export type Fold = { x: number; width: number };

/**
 * Talino doesn't ship the iPhone Duo's reserved-regions module (Claude's call, 2026-11-13: the shared
 * layouts still work on a fold, they just don't move a gap onto it), so there is never a fold to avoid.
 */
export function useFold(): Fold | null {
  return null;
}
