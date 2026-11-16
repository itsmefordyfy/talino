import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali, type TaliMood } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { nameText } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { defineStrings } from '@/lib/i18n';
import { useAppSelector } from '@/store/hooks';

const strings = defineStrings({ en: { says: 'Tali says' }, fil: { says: 'Sabi ni Tali' } });

const SIZES = { small: 48, medium: 72, large: 104 } as const;

export type TaliSaysProps = {
  text: string;
  mood: TaliMood;
  size?: keyof typeof SIZES;
  /** `side`: Tali beside the bubble (the usual); `stacked`: Tali above it, centred, for a hero or a result. */
  layout?: 'side' | 'stacked';
  /** More under the words, inside the bubble (a button, a hint). */
  children?: ReactNode;
  /** Announce the words when they change (a quiz answer); the rest are read with the page. */
  live?: boolean;
};

/**
 * Tali talking to the learner: her face and a speech bubble with the words, so a message reads as a person beside
 * you rather than a banner. Inline in the page (never over the lesson, never a pop-up), so it can't interrupt reading
 * or coding. Tali is never animated (owner, 2026-11-14): no pop, fade, bounce or blink, and neither is the bubble.
 * Key it by its words so a new message replaces the old one.
 */
export function TaliSays({ text: said, mood, size = 'medium', layout = 'side', children, live = false }: TaliSaysProps) {
  const theme = useTheme();
  // The lines are written for Tali; Tala's learner reads the same words in her name.
  const text = nameText(said, useAppSelector(selectCompanion));
  const t = useLocalized(strings);
  const stacked = layout === 'stacked';
  const tailColor = theme.primarySoft;
  return (
    <View
      accessible
      accessibilityLabel={`${t.says}: ${text}`}
      accessibilityLiveRegion={live ? 'polite' : 'none'}
      style={[styles.row, stacked && styles.stacked]}>
      <View style={styles.tali}>
        <Tali size={SIZES[size]} tight mood={mood} />
      </View>
      <View style={[styles.bubbleWrap, !stacked && styles.bubbleBeside]}>
        <View style={[styles.tail, stacked ? styles.tailUp : styles.tailLeft, { backgroundColor: tailColor }]} />
        <View style={[styles.bubble, { backgroundColor: theme.primarySoft }]}>
          <ThemedText type="body">{text}</ThemedText>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stacked: {
    flexDirection: 'column',
    gap: Spacing.two,
  },
  tali: {
    alignItems: 'center',
  },
  bubbleWrap: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  // Beside Tali the bubble takes the width that is left. Stacked it must NOT grow: its column has no height of its own (a result page,
  // a badge card), so a growing bubble filled the whole screen, or was squeezed to its tail (owner's screenshots, 2026-11-15).
  bubbleBeside: {
    flex: 1,
  },
  bubble: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three - 2,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  tail: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  tailLeft: {
    left: -5,
    top: '50%',
    marginTop: -7,
  },
  tailUp: {
    top: -5,
    left: '50%',
    marginLeft: -7,
  },
});
