import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, MinTouchSize, Spacing, type Tone } from '@/constants/theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import { Icon, type IconName } from './icon';

export type ShortcutTileProps = {
  label: string;
  /** What screen readers say, when the label is shorthand ("Record" reads as "Add record"). */
  accessibilityLabel?: string;
  /** The glyph, in its tone's ink on a soft circle of the same tone; or `illustration` in the circle. */
  icon?: IconName;
  illustration?: ReactNode;
  /** The circle's color: the feature's tone (constants/theme `FeatureTones`); mint when absent.  */
  tone?: Tone;
  onPress: () => void;
  /** Sizing from the row it sits in. */
  style?: StyleProp<ViewStyle>;
};

const CIRCLE_SIZE = 56;

/**
 * A one-tap way into a part of the app (Home's quick log): a soft, tone-colored circle with its
 * glyph over a short label, no card behind. Ported from Pawfetti.
 */
export function ShortcutTile({ label, accessibilityLabel, icon, illustration, tone = 'indigo', onPress, style }: ShortcutTileProps) {
  const tones = useTones();
  const colors = tones[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [styles.tile, style, pressed && styles.pressed]}>
      <View style={[styles.circle, { backgroundColor: colors.soft }]}>{illustration ?? <Icon name={icon ?? 'apps'} size={IconSize.tile} tint={colors.ink} />}</View>
      {/* Up to two lines: Tagalog's longer labels wrap rather than shrink to an unreadable size. */}
      <ThemedText type="secondarySemiBold" style={styles.label} numberOfLines={2}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
