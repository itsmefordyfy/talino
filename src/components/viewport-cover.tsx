import { StyleSheet } from 'react-native';
import Animated, { measure, useAnimatedRef, useAnimatedStyle, useFrameCallback, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import { skeletonShowing } from '@/lib/viewport-signal';

/** A change in width this big or more is a fold or an unfold, not an animation's first frames. */
const CHANGE_THRESHOLD = 40;
/** The cover never stays longer than this, whether or not a tab has put its skeleton up. */
const MAX_COVER_MS = 350;

/**
 * Hides the screen at the very moment the iPhone Duo is folded or opened (owner's request, 2026-10-26). The native side
 * lays the screen out at the new size at once, while JavaScript hears about it a few frames later: until then the old
 * (wide or narrow) arrangement is drawn at the new width, squeezed, for a split second. JavaScript can't prevent that
 * (it is always behind), so this watches the real width on the UI thread, every frame, and covers the screen in the
 * same frame the width changes. It lets go once the tabs' skeleton is up (`skeletonShowing`) or after MAX_COVER_MS,
 * with a short fade, so the owner sees the skeleton and then the screen for the new size, never the squeezed one.
 * Draws nothing otherwise and takes no touches.
 */
export function ViewportCover() {
  const theme = useTheme();
  const ref = useAnimatedRef<Animated.View>();
  const baseline = useSharedValue(0);
  const covered = useSharedValue(0);
  const since = useSharedValue(0);

  useFrameCallback((frame) => {
    const size = measure(ref);
    if (!size || size.width === 0) return;
    if (baseline.value === 0) {
      baseline.value = size.width;
      return;
    }
    if (covered.value === 0) {
      if (Math.abs(size.width - baseline.value) >= CHANGE_THRESHOLD) {
        covered.value = 1;
        since.value = frame.timestamp;
      }
      return;
    }
    if (skeletonShowing.value === 1 || frame.timestamp - since.value > MAX_COVER_MS) {
      baseline.value = size.width;
      covered.value = 0;
    }
  });

  const style = useAnimatedStyle(() => ({ opacity: covered.value === 1 ? 1 : withTiming(0, { duration: 120 }) }));

  return <Animated.View ref={ref} pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }, style]} />;
}
