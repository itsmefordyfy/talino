import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Section } from '@/components/ui/section';
import { Spacing } from '@/constants/theme';
import type { PracticeText } from '@/features/practice/strings';

import { practiceProgress, type PracticeRow } from '../lib/practice-summary';

export type PracticeSummaryCardProps = {
  rows: readonly PracticeRow[];
  text: PracticeText;
  /** Nudge about items not yet practised (the project is open and not yet passed). */
  nudge?: boolean;
};

/**
 * The practice items a project's steps name, with how many the learner has done and their best score, shown before they submit. It is information
 * and a nudge, not a gate: the steps say which items to choose, and the coach reads this summary with the submission without ever judging by it.
 */
export function PracticeSummaryCard({ rows, text, nudge = false }: PracticeSummaryCardProps) {
  if (rows.length === 0) return null;
  const progress = practiceProgress(rows);
  const label = text.ui.projectPracticeProgress(progress.done, progress.total);
  return (
    <Section title={text.ui.projectPracticeTitle}>
      <Card style={styles.card}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.ui.projectPracticeIntro}
        </ThemedText>
        <View style={styles.progress}>
          <ThemedText type="secondarySemiBold" tabular accessibilityLiveRegion="polite">
            {label}
            {progress.best !== null ? ` · ${text.ui.projectPracticeBest(progress.best)}` : ''}
          </ThemedText>
          <ProgressBar fraction={progress.fraction} accessibilityLabel={label} done={progress.missing === 0} />
        </View>
      </Card>
      <Card padded={false}>
        {rows.map((row, index) => {
          const state = row.practised ? text.ui.projectPracticeTries(row.attempts, row.best) : row.attempts > 0 ? text.ui.projectPracticeTries(row.attempts, null) : text.ui.projectPracticeNone;
          return (
            <View key={row.id}>
              {index > 0 && <Divider />}
              <ListRow
                title={row.title}
                titleLines={2}
                subtitle={state}
                icon={row.practised ? 'check_circle' : 'radio_button_unchecked'}
                iconColor={row.practised ? 'statusOk' : 'textSecondary'}
                iconBackground={row.practised ? 'statusOkSoft' : 'backgroundSelected'}
                accessibilityLabel={`${row.title}. ${state}`}
                showChevron={false}
              />
            </View>
          );
        })}
      </Card>
      {nudge && (progress.missing > 0 ? <Notice tone="info" message={text.ui.projectPracticeNudge(progress.missing)} /> : <Notice tone="success" message={text.ui.projectPracticeAllDone} />)}
    </Section>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  progress: { gap: Spacing.one },
});
