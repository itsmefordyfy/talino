import { StyleSheet, View } from 'react-native';

import { ScoreHero } from '@/components/score-hero';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { ReviewResult } from '../lib/review';
import type { PracticeText } from '../strings';
import { CriteriaCard } from './criteria-card';

export type ReviewViewProps = {
  review: ReviewResult;
  /** The learner's own message that was reviewed: the only text that is ever their work. */
  original: string;
  text: PracticeText;
  /** Side by side (an iPad, the open Duo, the web) instead of stacked. */
  wide?: boolean;
};

/**
 * The message coach's review: the score, a short reason for each measure, what is missing, then the learner's own message beside a suggested
 * version with why it changed. The suggestion is labelled a model, with the note to rewrite it in their own words.
 */
export function ReviewView({ review, original, text, wide = false }: ReviewViewProps) {
  const theme = useTheme();
  if (review.tooShort || review.overall === null || review.rating === null) {
    return (
      <Card style={styles.card}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.ui.tooShortTitle}
        </ThemedText>
        <Notice tone="info" message={review.summary || text.tooShortReview} />
      </Card>
    );
  }
  return (
    <View style={styles.stack}>
      <ScoreHero score={review.overall} rating={review.rating} ratingLabel={text.ratings[review.rating]} ratingLine={text.ui.ratingLines[review.rating]} outOf={text.ui.scoreOutOf} summary={review.summary} />
      <CriteriaCard title={text.ui.measuresTitle} criteria={review.criteria} text={text} />

      {review.missing.length > 0 && (
        <Card style={styles.card}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {text.ui.missingTitle}
          </ThemedText>
          {review.missing.map((item, index) => (
            <View key={index} style={styles.bullet}>
              <Icon name="radio_button_unchecked" size={16} color="textSecondary" />
              <ThemedText type="body" style={styles.fill}>
                {item}
              </ThemedText>
            </View>
          ))}
        </Card>
      )}

      {review.improved ? (
        <View style={styles.stack}>
          <ThemedText type="section" accessibilityRole="header">
            {text.ui.compareTitle}
          </ThemedText>
          <View style={[styles.compare, wide && styles.compareWide]}>
            <Card tone="backgroundSelected" style={[styles.card, wide && styles.fill]}>
              <ThemedText type="secondarySemiBold" themeColor="textSecondary">
                {text.ui.originalLabel}
              </ThemedText>
              <ThemedText type="body" selectable>
                {original}
              </ThemedText>
            </Card>
            <Card style={[styles.card, styles.improved, { borderColor: theme.primary }, wide && styles.fill]}>
              <ThemedText type="secondarySemiBold" themeColor="primaryText">
                {text.ui.improvedLabel}
              </ThemedText>
              <ThemedText type="body" selectable>
                {review.improved}
              </ThemedText>
            </Card>
          </View>
          <Notice tone="info" message={text.ui.improvedNote} />
          {review.changes.length > 0 && (
            <Card style={styles.card}>
              <ThemedText type="cardTitle" accessibilityRole="header">
                {text.ui.changesTitle}
              </ThemedText>
              {review.changes.map((change, index) => (
                <View key={index} style={styles.change}>
                  <ThemedText type="bodySemiBold">{change.what}</ThemedText>
                  <ThemedText type="secondary" themeColor="textSecondary">
                    {change.why}
                  </ThemedText>
                </View>
              ))}
            </Card>
          )}
        </View>
      ) : null}

      {review.nextStep ? (
        <Card style={styles.card}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {text.ui.nextStepTitle}
          </ThemedText>
          <ThemedText type="body">{review.nextStep}</ThemedText>
        </Card>
      ) : null}
      <ThemedText type="caption" themeColor="textTertiary">
        {text.ui.scoreNote}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  card: { gap: Spacing.three },
  fill: { flex: 1 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  compare: { gap: Spacing.three },
  compareWide: { flexDirection: 'row', alignItems: 'stretch' },
  improved: { borderWidth: 1, borderRadius: Radius.large, borderCurve: 'continuous' },
  change: { gap: Spacing.half },
});
