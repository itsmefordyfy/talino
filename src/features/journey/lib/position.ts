import type { JourneyState } from './types';

/** Where the learner was on the map when they left, and the progress it was taken at. */
export type SavedPosition = { y: number; signature: string };

/**
 * A short fingerprint of the learner's place in the journey: the milestone they are on and how much of the journey is done. If it is the
 * same when they come back, they return to the exact spot they left; if they finished something meanwhile, the map takes them to
 * their new current step instead of a place that is no longer where the action is.
 */
export function signatureOf(state: JourneyState): string {
  const current = state.current;
  return `${current?.id ?? 'end'}:${state.done}:${current?.stepsDone ?? 0}`;
}

export function parsePosition(raw: string | null): SavedPosition | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SavedPosition> | null;
    if (value && typeof value.y === 'number' && Number.isFinite(value.y) && value.y >= 0 && typeof value.signature === 'string') return { y: value.y, signature: value.signature };
  } catch {
    // A damaged value is the same as none.
  }
  return null;
}

/** Where to scroll when the map opens: the saved spot if progress hasn't changed, else the current node (never above the top). */
export function placeToOpen(saved: SavedPosition | null, signature: string, currentY: number | null): number | null {
  if (saved && saved.signature === signature) return saved.y;
  return currentY === null ? null : Math.max(0, currentY);
}
