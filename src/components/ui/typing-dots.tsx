import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TypingDotsProps = {
  /** What screen readers say while it shows ("Tali is thinking…"). The dots themselves are hidden from them. */
  label: string;
  color?: ThemeColor;
};

const DOT = 8;
const RISE = 4;
const STEP_MS = 160;
const UP_MS = 320;
const DOWN_MS = 320;
const REST_MS = 260;

/**
 * The three-dot "someone is typing" indicator: the dots rise and fade in turn, on the UI thread. With Reduce Motion they
 * hold still at one steady shade, so the wait is still shown without movement. Announced once as a polite live region.
 */
export function TypingDots({ label, color = 'textSecondary' }: TypingDotsProps) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityLiveRegion="polite" style={styles.row}>
      {[0, 1, 2].map((index) => (
        <Dot key={index} index={index} color={color} />
      ))}
    </View>
  );
}

function Dot({ index, color }: { index: number; color: ThemeColor }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const level = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    // Each dot starts a beat after the one before it, and all three repeat on the same beat, so the wave keeps its shape.
    level.set(withDelay(index * STEP_MS, withRepeat(withSequence(withTiming(1, { duration: UP_MS, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: DOWN_MS, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: REST_MS })), -1)));
    return () => cancelAnimation(level);
  }, [index, level, reduceMotion]);

  const animated = useAnimatedStyle(() => ({ opacity: 0.35 + 0.65 * level.get(), transform: [{ translateY: -RISE * level.get() }] }));

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[styles.dot, { backgroundColor: theme[color] }, reduceMotion ? styles.still : animated]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    // Room for the rise, so the dots never touch the bubble's edge.
    paddingVertical: RISE,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  still: {
    opacity: 0.7,
  },
});
