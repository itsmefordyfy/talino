import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { BrandGradient, HeroInk, Radius, Spacing } from '@/constants/theme';

import { coverColors, CourseCover } from './course-cover';

export type CourseHeroProps = {
  icon: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** The course whose cover art fills the top of the card; without it the card is the plain brand gradient with the icon. */
  course?: { id: string; kind: string };
  /** Under the text, e.g. the progress ring. */
  children?: ReactNode;
};

const COVER_HEIGHT = 168;

/** The card at the top of a course (its cover over its own gradient), or the plain brand gradient with an icon. */
export function CourseHero({ icon, eyebrow, title, subtitle, course, children }: CourseHeroProps) {
  const text = (
    <>
      <ThemedText type="caption" style={[styles.eyebrow, { color: HeroInk.muted }]}>
        {eyebrow}
      </ThemedText>
      <ThemedText type="title" style={{ color: HeroInk.text }} accessibilityRole="header">
        {title}
      </ThemedText>
      <ThemedText type="body" style={{ color: HeroInk.muted }}>
        {subtitle}
      </ThemedText>
      {children}
    </>
  );

  if (course) {
    // The gradient runs mostly downwards, so the text lower down sits on the palette's deep end.
    return (
      <LinearGradient colors={coverColors(course)} start={{ x: 0, y: 0 }} end={{ x: 0.35, y: 1 }} style={styles.card}>
        <CourseCover course={course} height={COVER_HEIGHT} corners="none" transparent />
        <View style={styles.text}>{text}</View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={BrandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, styles.text]}>
      <View style={[styles.iconWrap, { backgroundColor: HeroInk.glass }]}>
        <Icon name={icon as MaterialSymbolName} size={28} tint={HeroInk.text} />
      </View>
      {text}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  text: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
