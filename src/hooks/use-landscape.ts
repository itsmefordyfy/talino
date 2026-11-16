import { useViewport } from '@/hooks/use-viewport';

/**
 * The area the app is drawn in is wider than it is tall (a phone on its side, the iPhone Duo's open screen, an iPad). Read
 * from the viewport (`useViewport`), never from the device or its orientation setting, so it follows split windows and folds
 * too, with no stale size after the Duo is folded or opened.
 */
export function useLandscape(): boolean {
  const { width, height } = useViewport();
  return width > height;
}
