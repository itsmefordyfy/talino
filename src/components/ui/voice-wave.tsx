import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

/** Each bar's resting height (share of the wave's height) and how long one rise-and-fall takes, so the bars never move in step. */
const BARS = [
  { rest: 0.35, peak: 0.7, ms: 420 },
  { rest: 0.4, peak: 1, ms: 520 },
  { rest: 0.3, peak: 0.55, ms: 360 },
  { rest: 0.4, peak: 0.9, ms: 480 },
  { rest: 0.35, peak: 0.65, ms: 400 },
] as const;

export type VoiceWaveProps = {
  /** True while a voice is heard: the bars move. False: they rest low and still. */
  active: boolean;
  height?: number;
};

/**
 * A small voice wave: a few bars that rise and fall while audio plays (the lesson player's bar). Decorative, so hidden from
 * screen readers (the play and pause button already says the state). It rests low and still when not `active`, and under the
 * phone's reduce-motion setting it never moves.
 */
export function VoiceWave({ active, height = 20 }: VoiceWaveProps) {
  const reduceMotion = useReducedMotion();
  return (
    <View style={[styles.row, { height }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {BARS.map((bar, index) => (
        <WaveBar key={index} rest={bar.rest} peak={bar.peak} ms={bar.ms} index={index} height={height} active={active && !reduceMotion} />
      ))}
    </View>
  );
}

function WaveBar({ rest, peak, ms, index, height, active }: { rest: number; peak: number; ms: number; index: number; height: number; active: boolean }) {
  const theme = useTheme();
  const level = useSharedValue(rest);

  useEffect(() => {
    if (active) {
      // A small stagger per bar, then each rises and falls on its own beat.
      level.value = withDelay(
        index * 70,
        withRepeat(withSequence(withTiming(peak, { duration: ms, easing: Easing.inOut(Easing.quad) }), withTiming(rest * 0.6, { duration: ms, easing: Easing.inOut(Easing.quad) })), -1, true),
      );
    } else {
      level.value = withTiming(rest, { duration: 200 });
    }
  }, [active, index, level, ms, peak, rest]);

  const style = useAnimatedStyle(() => ({ height: Math.max(3, level.value * height) }));
  return <Animated.View style={[styles.bar, { backgroundColor: theme.primary }, style]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
    borderCurve: 'continuous',
  },
});
