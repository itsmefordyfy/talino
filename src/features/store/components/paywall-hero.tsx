import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { BrandGradient, HeroInk, Radius, Spacing } from '@/constants/theme';

export type PaywallHeroProps = ViewProps & {
  /** The small line over the title: "Talino Pro". */
  eyebrow: string;
  title: string;
  subtitle: string;
};

/**
 * The paywall's hero, compact as Ulamin's: the coach beside the title on the brand gradient, one short line under them. The gradient is
 * fixed, so it uses fixed light ink. There is no close button here: the sheet's own header already has the round X.
 */
export function PaywallHero({ eyebrow, title, subtitle, style, ...rest }: PaywallHeroProps) {
  return (
    <View style={[styles.hero, style]} {...rest}>
      <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.head}>
        {/* The coach the learner chose (Tali or Tala), cropped to the figure so the row stays short. */}
        <Tali size={84} mood="confident" tight />
        <View style={styles.titles}>
          <ThemedText type="caption" style={[styles.eyebrow, styles.muted]}>
            {eyebrow}
          </ThemedText>
          <ThemedText type="section" accessibilityRole="header" style={styles.ink}>
            {title}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="secondary" style={styles.muted}>
        {subtitle}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.large + 4,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(83, 109, 254, 0.28)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  titles: {
    flex: 1,
    gap: Spacing.half,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 700,
  },
  ink: {
    color: HeroInk.text,
  },
  muted: {
    color: HeroInk.muted,
  },
});
