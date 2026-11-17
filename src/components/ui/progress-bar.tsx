import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { HeroInk, Motion, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ProgressBarProps = {
  /** 0 to 1. */
  fraction: number;
  /** "3 of 5 lessons", read out with the bar. */
  accessibilityLabel: string;
  /** Finished: drawn in Fresh Mint (the "ok" color). */
  done?: boolean;
  /** A thicker bar for a hero card; the default is the slim one used in lists. */
  thick?: boolean;
  /** For a bar on the brand gradient: a translucent white track and a white fill. */
  onGradient?: boolean;
};

/** A progress bar that fills smoothly when the figure changes (instantly with Reduce Motion): violet while under way, mint when finished. */
export function ProgressBar({ fraction, accessibilityLabel, done = false, thick = false, onGradient = false }: ProgressBarProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, Number.isFinite(fraction) ? fraction : 0));
  const shown = useSharedValue(clamped);

  useEffect(() => {
    shown.value = reduceMotion ? clamped : withTiming(clamped, { duration: Motion.progress, easing: Easing.out(Easing.cubic) });
  }, [clamped, reduceMotion, shown]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${shown.value * 100}%` }));
  const height = thick ? 12 : 8;
  const track = onGradient ? 'rgba(255, 255, 255, 0.28)' : theme.primarySoft;
  // On a dark card the fill is white while under way, and green once finished like every other bar (owner, 2026-11-17).
  const fill = done ? theme.success : onGradient ? HeroInk.text : theme.primary;

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel} accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }} style={[styles.track, { height, backgroundColor: track }]}>
      <Animated.View style={[styles.fill, { height, backgroundColor: fill }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.pill,
  },
});
