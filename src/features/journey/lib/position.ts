import type { CoursePath } from './course-path';

/** Where the learner was on the map when they left, and the progress it was taken at. */
export type SavedPosition = { y: number; signature: string };

/**
 * A short fingerprint of the learner's place in the journey: the course they are on and how many courses are finished. If it is the
 * same when they come back, they return to the exact spot they left; if they finished a course meanwhile, the map takes them to
 * their new current course instead of a place that is no longer where the action is. (Lessons inside a course don't change it: the
 * resume card on Home shows those.)
 */
export function signatureOf(path: CoursePath): string {
  return `${path.current?.key ?? 'end'}:${path.nodes.filter((node) => node.status === 'completed').length}`;
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
