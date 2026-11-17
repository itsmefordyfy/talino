import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type TimerRingProps = {
  /** 0 to 1: how much of the phase has passed. */
  fraction: number;
  size: number;
  /** The ring's colour (a tone's ink): the phase. The phase is also named in words next to it, never by colour alone. */
  color: string;
  /** The countdown, in the middle. */
  time: string;
  /** Under the countdown: the status in words. */
  children?: ReactNode;
  accessibilityLabel: string;
};

const STROKE = 10;

/** The focus timer's face: a ring that fills as the phase passes, with the countdown in the middle. */
export function TimerRing({ fraction, size, color, time, children, accessibilityLabel }: TimerRingProps) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, fraction));
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <View style={{ width: size, height: size }} accessible accessibilityRole="timer" accessibilityLabel={accessibilityLabel}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={theme.backgroundSelected} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <ThemedText type="stat" tabular numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {time}
        </ThemedText>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: STROKE * 2,
  },
});
