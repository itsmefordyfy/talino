import { useWindowDimensions } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

/**
 * The size of the area the app is drawn in. On the iPhone Duo, `useWindowDimensions` kept the old size when the phone was
 * folded or opened (the wide layout stayed on the narrow outer screen, squeezed, 2026-10-26); the safe-area frame follows
 * the real layout of the root view, so this changes with it. Falls back to the window's size before the frame is known.
 */
export function useViewport(): { width: number; height: number } {
  const frame = useSafeAreaFrame();
  const window = useWindowDimensions();
  return frame.width > 0 && frame.height > 0 ? { width: frame.width, height: frame.height } : { width: window.width, height: window.height };
}
