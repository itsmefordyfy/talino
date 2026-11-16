import { useEffect, useState } from 'react';

import { useViewport } from '@/hooks/use-viewport';
import { skeletonShowing } from '@/lib/viewport-signal';

/** A change in width smaller than this (a rotation animation's first frames, a scrollbar) isn't a fold or an unfold. */
const CHANGE_THRESHOLD = 40;
/** How long the screen's skeleton shows after the width changed, while the layout settles. */
const SETTLE_MS = 450;

/**
 * True for a moment after the area the app is drawn in changed width, as when the iPhone Duo is folded or opened
 * (owner's request, 2026-10-26): the tabs show their skeleton for it, so the half-switched layout is never seen, and
 * everything under them (the baby card carousel's measured width, the wide or narrow arrangement) starts again at the new size.
 * Never true on the first render. The change is noticed while rendering, so the old layout isn't drawn for a frame.
 */
export function useViewportSettling(): boolean {
  const { width } = useViewport();
  const [seen, setSeen] = useState(width);
  const [settling, setSettling] = useState(false);
  if (Math.abs(seen - width) >= CHANGE_THRESHOLD) {
    setSeen(width);
    setSettling(true);
  }
  useEffect(() => {
    // Tells the cover (on the UI thread) that the skeleton is up, so it can let go.
    skeletonShowing.value = settling ? 1 : 0;
    if (!settling) return;
    const timer = setTimeout(() => setSettling(false), SETTLE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [settling, seen]);
  return settling;
}
