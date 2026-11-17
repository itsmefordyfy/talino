import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';

import { ratingFor, type CriterionScore } from '../lib/scoring';
import type { PracticeText } from '../strings';

export type CriteriaCardProps = {
  title: string;
  criteria: readonly CriterionScore[];
  text: PracticeText;
};

/**
 * One row per criterion the item names: its label, the rating in words AND the number (so nothing rests on colour), a bar, and the one-line
 * reason. The role-play debrief and the message review share it.
 */
export function CriteriaCard({ title, criteria, text }: CriteriaCardProps) {
  if (criteria.length === 0) return null;
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {title}
      </ThemedText>
      {criteria.map((criterion) => {
        const label = text.criteria[criterion.id];
        const rating = text.ratings[ratingFor(criterion.score)];
        const spoken = text.ui.criterionLabel(label, rating, criterion.score);
        return (
          <View key={criterion.id} style={styles.item}>
            <View style={styles.head} accessible accessibilityLabel={spoken}>
              <ThemedText type="bodySemiBold" style={styles.name}>
                {label}
              </ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {rating}
              </ThemedText>
              <ThemedText type="bodySemiBold" tabular>
                {criterion.score}
              </ThemedText>
            </View>
            <ProgressBar fraction={criterion.score / 100} accessibilityLabel={spoken} done={criterion.score >= 70} />
            <ThemedText type="secondary" themeColor="textSecondary">
              {criterion.reason}
            </ThemedText>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.four },
  item: { gap: Spacing.two },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  name: { flex: 1 },
});
