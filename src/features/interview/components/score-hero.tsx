import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { ProgressRing } from '@/features/courses';

import type { Rating } from '../lib/report';

const TONE: Record<Rating, { color: ThemeColor; background: ThemeColor }> = {
  excellent: { color: 'statusOk', background: 'statusOkSoft' },
  good: { color: 'statusOk', background: 'statusOkSoft' },
  fair: { color: 'statusWarn', background: 'statusWarnSoft' },
  needs_improvement: { color: 'statusDanger', background: 'statusDangerSoft' },
};

export type ScoreHeroProps = {
  score: number;
  rating: Rating;
  ratingLabel: string;
  ratingLine: string;
  outOf: string;
  summary: string;
};

/** The overall score first: a ring with the number, the rating in words (so meaning never rests on colour alone) and the summary of how it went. */
export function ScoreHero({ score, rating, ratingLabel, ratingLine, outOf, summary }: ScoreHeroProps) {
  const tone = TONE[rating];
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <ProgressRing fraction={score / 100} size={104} stroke={10} label={String(score)} accessibilityLabel={`${score} ${outOf}`} />
        <View style={styles.text}>
          <Badge label={ratingLabel} color={tone.color} background={tone.background} />
          <ThemedText type="secondary" themeColor="textSecondary">
            {outOf}
          </ThemedText>
          <ThemedText type="body">{ratingLine}</ThemedText>
        </View>
      </View>
      <ThemedText type="body" themeColor="textSecondary">
        {summary}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
});
