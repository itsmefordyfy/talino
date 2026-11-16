import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/lib/dates';
import { formatMoney } from '@/lib/money';

import type { GoalProgress } from '../lib/goal-progress';
import type { CareerStrings } from '../strings';
import { DEFAULT_CURRENCY, type GoalRow } from '../types';

export type GoalCardProps = {
  goal: GoalRow;
  progress: GoalProgress;
  strings: CareerStrings;
  onPress: () => void;
};

export function goalProgressText(goal: GoalRow, progress: GoalProgress, strings: CareerStrings): string {
  if (goal.metric !== 'income') return strings.goalProgressCount(progress.current, progress.target);
  const currency = goal.currency ?? DEFAULT_CURRENCY;
  return strings.goalProgressMoney(formatMoney(progress.current, currency, { compact: true }), formatMoney(progress.target, currency, { compact: true }));
}

/** A goal with its bar: what it counts, how far along, and when it's due. */
export function GoalCard({ goal, progress, strings, onPress }: GoalCardProps) {
  const text = goalProgressText(goal, progress, strings);
  const meta = [strings.metrics[goal.metric], goal.due_on ? strings.goalDue(formatDate(goal.due_on)) : null].filter(Boolean).join(' · ');
  return (
    <Card onPress={onPress} accessibilityLabel={strings.goalA11y(goal.title, text)}>
      <View style={styles.header}>
        <ThemedText type="cardTitle" style={styles.flex} numberOfLines={2}>
          {goal.title}
        </ThemedText>
        <ThemedText type="secondarySemiBold" themeColor={progress.reached ? 'statusOk' : 'textSecondary'} tabular>
          {progress.reached ? strings.goalReached : text}
        </ThemedText>
      </View>
      <View style={styles.bar}>
        <ProgressBar fraction={progress.fraction} done={progress.reached} accessibilityLabel={text} />
      </View>
      <ThemedText type="caption" themeColor="textSecondary" tabular>
        {progress.reached ? `${text} · ${meta}` : meta}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  bar: {
    marginVertical: Spacing.two,
  },
});
