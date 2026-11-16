import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';

import type { CategoryId, CategoryScore, Comparison } from '../lib/report';

export type CategoryBarsProps = {
  categories: readonly CategoryScore[];
  labels: Record<CategoryId, { label: string; hint: string }>;
  comparison: Comparison | null;
  deltaLabel: (delta: number) => string;
  confidenceNote: string;
};

/** One bar per category with its score and the reason for it. Against an earlier attempt, each shows how much it moved. */
export function CategoryBars({ categories, labels, comparison, deltaLabel, confidenceNote }: CategoryBarsProps) {
  const delta = new Map(comparison?.categories.map((entry) => [entry.id, entry.delta]));
  return (
    <Card style={styles.card}>
      {categories.map((category) => {
        const change = delta.get(category.id);
        return (
          <View key={category.id} style={styles.item}>
            <View style={styles.head}>
              <ThemedText type="bodySemiBold" style={styles.name}>
                {labels[category.id].label}
              </ThemedText>
              {change !== undefined && change !== 0 && (
                <ThemedText type="secondarySemiBold" themeColor={change > 0 ? 'statusOk' : 'statusDanger'} tabular>
                  {deltaLabel(change)}
                </ThemedText>
              )}
              <ThemedText type="bodySemiBold" tabular>
                {category.score}
              </ThemedText>
            </View>
            <ProgressBar fraction={category.score / 100} accessibilityLabel={`${labels[category.id].label}: ${category.score} / 100`} done={category.score >= 70} />
            {category.feedback ? (
              <ThemedText type="secondary" themeColor="textSecondary">
                {category.feedback}
              </ThemedText>
            ) : null}
            {category.id === 'confidence' && (
              <ThemedText type="caption" themeColor="textTertiary">
                {confidenceNote}
              </ThemedText>
            )}
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.four,
  },
  item: {
    gap: Spacing.two,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
});
