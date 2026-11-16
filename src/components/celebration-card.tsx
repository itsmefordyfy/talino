import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali, type TaliMood } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import type { IconName } from '@/components/ui/icon';
import { BrandGradient, HeroInk, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CelebrationCardProps = {
  mood: TaliMood;
  /** What was earned, drawn beside Tali on the gradient (a badge's medallion); Tali alone is centred without it. */
  prize?: ReactNode;
  /** A small label over the title ("New badge"). */
  eyebrow?: string;
  title: string;
  message?: string;
  actionLabel: string;
  actionIcon?: IconName;
  onAction: () => void;
  /** Read aloud as the card appears (Tali's own words), without being drawn. */
  announcement?: string;
};

/**
 * The one celebration card (a new badge, Talino Pro): a brand-gradient stage with Tali standing on its bottom edge and the prize beside
 * her, then the label, the title, a line of explanation and one button. Replaces the speech bubble over a small icon, which said the
 * same thing three times (owner, 2026-11-15: "I do not like this design"). Confetti is drawn by the caller, over the card.
 */
export function CelebrationCard({ mood, prize, eyebrow, title, message, actionLabel, actionIcon, onAction, announcement }: CelebrationCardProps) {
  const theme = useTheme();
  return (
    <View
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
      accessibilityLabel={announcement}
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.stage}>
        <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={[styles.glow, { backgroundColor: HeroInk.glass }]} />
        <View style={styles.row}>
          <Tali size={prize ? 128 : 150} mood={mood} tight />
          {prize && <View style={styles.prize}>{prize}</View>}
        </View>
      </View>
      <View style={styles.body}>
        {eyebrow && (
          <View style={[styles.eyebrow, { backgroundColor: theme.primarySoft }]}>
            <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrowText}>
              {eyebrow}
            </ThemedText>
          </View>
        )}
        <ThemedText type="title" style={styles.center} accessibilityRole="header">
          {title}
        </ThemedText>
        {message && (
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {message}
          </ThemedText>
        )}
        <Button title={actionLabel} icon={actionIcon} onPress={onAction} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    borderRadius: Radius.sheet,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  glow: {
    position: 'absolute',
    bottom: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  prize: {
    alignSelf: 'center',
  },
  body: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  eyebrow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.chip,
  },
  eyebrowText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 700,
  },
  center: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
});
