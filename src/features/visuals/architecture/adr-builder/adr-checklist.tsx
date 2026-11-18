import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import type { AdrProblem } from '@/features/architecture/lib/adr';
import { useLocalized } from '@/hooks/use-strings';

import { Panel } from '../../fundamentals/parts';
import { adrStrings } from '../../../architecture/adr/strings';

export type AdrChecklistProps = { problems: readonly AdrProblem[] };

/** What the rule-based checks found, calm and specific: what is missing first, then what would make the record stronger. Never blocks saving. */
export function AdrChecklist({ problems }: AdrChecklistProps) {
  const t = useLocalized(adrStrings);
  const missing = problems.filter((problem) => problem.severity === 'missing');
  const improve = problems.filter((problem) => problem.severity === 'improve');
  const summary = t.checkSummary(missing.length, improve.length);

  return (
    <Panel>
      <View style={styles.header}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {t.checkTitle}
        </ThemedText>
        <View style={styles.noAi}>
          <Icon name="rule" size={16} color="textSecondary" />
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {t.checkNoAi}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" themeColor="textSecondary">
        {t.checkNote}
      </ThemedText>
      <ThemedText type="bodySemiBold" accessibilityLiveRegion="polite">
        {summary}
      </ThemedText>
      {problems.length === 0 ? (
        <View style={styles.row}>
          <Icon name="check_circle" size={20} color="statusOk" />
          <ThemedText type="body" style={styles.text}>
            {t.checkClear}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {[...missing, ...improve].map((problem, index) => {
            const field = t.fields[problem.field];
            const severity = problem.severity === 'missing' ? t.severityMissing : t.severityImprove;
            return (
              <View key={`${problem.id}-${problem.field}-${problem.optionIndex ?? ''}-${index}`} style={styles.row} accessible accessibilityLabel={t.findingLabel(field, severity, problem.message)}>
                <Icon name={problem.severity === 'missing' ? 'edit_note' : 'lightbulb'} size={20} color={problem.severity === 'missing' ? 'statusWarn' : 'primary'} />
                <View style={styles.text}>
                  <ThemedText type="secondarySemiBold">{`${field} · ${severity}`}</ThemedText>
                  <ThemedText type="secondary" themeColor="textSecondary">
                    {problem.message}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  noAi: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  list: { gap: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  text: { flex: 1, gap: 2 },
});
