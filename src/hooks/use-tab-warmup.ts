import { useEffect, useState } from 'react';

/** The shortest time a tab's skeleton stays up when the tab first opens, so it is seen rather than flashed. */
const WARMUP_MS = 350;

/**
 * True while a tab is opening for the first time (owner, 2026-11-17: "add [a skeleton] on each tab when the tab is rendering or loading").
 * A tab draws a lot on its first visit, so it shows its skeleton first and its content once the skeleton has been up for a moment. Tabs
 * stay mounted afterwards, so coming back to one never shows it again. The skeleton's pulse runs on the UI thread, so it keeps moving
 * while the content renders.
 */
export function useTabWarmup(): boolean {
  const [warming, setWarming] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setWarming(false), WARMUP_MS);
    return () => clearTimeout(timer);
  }, []);
  return warming;
}
