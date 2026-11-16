import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ProgressRingProps = {
  /** 0 to 1. */
  fraction: number;
  size?: number;
  stroke?: number;
  /** Text in the middle; the percentage when absent. */
  label?: string;
  /** Fixed colors for use on the brand gradient. */
  tint?: string;
  track?: string;
  accessibilityLabel: string;
};

/** The largest the figure gets (a 64 pt ring and up). */
const MAX_FONT = 15;
/** Clear space between the figure and the ring's inner edge. */
const ringMargin = (size: number) => Math.max(9, Math.round(size * 0.2));

/** A round progress meter with its figure in the middle. */
export function ProgressRing({ fraction, size = 64, stroke = 7, label, tint, track, accessibilityLabel }: ProgressRingProps) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, fraction));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const text = label ?? `${Math.round(clamped * 100)}%`;
  // The figure sits inside the ring with room to spare (owner, 2026-11-16: "100%" touched the ring on the Me tab's 44 pt rings). Sized from the
  // inner diameter minus a margin and from the longest it can be ("100%", or the given label), so every ring in a list uses the same size.
  const inner = size - 2 * stroke - ringMargin(size);
  const fontSize = Math.max(9, Math.min(MAX_FONT, Math.floor(inner / (Math.max(4, text.length) * 0.62))));
  return (
    <View style={{ width: size, height: size }} accessible accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel} accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={track ?? theme.backgroundSelected} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tint ?? theme.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <ThemedText type="secondarySemiBold" tabular numberOfLines={1} style={[{ fontSize, lineHeight: fontSize + 4 }, tint ? { color: tint } : undefined]}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
