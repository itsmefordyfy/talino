import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { productivityStrings } from '../strings';
import { DIMENSION_PASS, PLAN_DIMENSIONS, type Finding, type FindingLevel, type ScheduleResult } from '../types';

export type DayResultProps = { result: ScheduleResult };

const LOOK: Record<FindingLevel, { icon: IconName; color: ThemeColor }> = {
  blocker: { icon: 'error', color: 'danger' },
  issue: { icon: 'warning', color: 'statusWarn' },
  good: { icon: 'check_circle', color: 'statusOk' },
};

/** What a check found, in words: the five dimension scores as labelled bars, then the findings grouped must fix, could be stronger and working well. */
export function DayResult({ result }: DayResultProps) {
  const t = useLocalized(productivityStrings);
  const groups: { level: FindingLevel; title: string; findings: Finding[] }[] = [
    { level: 'blocker', title: t.planBlockers, findings: result.findings.filter((finding) => finding.level === 'blocker') },
    { level: 'issue', title: t.planNotes, findings: result.findings.filter((finding) => finding.level === 'issue') },
    { level: 'good', title: t.planGood, findings: result.findings.filter((finding) => finding.level === 'good') },
  ];
  return (
    <Card style={styles.card} accessibilityLiveRegion="polite">
      <ThemedText type="cardTitle" accessibilityRole="header">
        {t.dayResultTitle}
      </ThemedText>
      <ThemedText type="bodySemiBold" tabular>
        {t.planOverall(result.overall)}
      </ThemedText>
      <View style={styles.bars}>
        {PLAN_DIMENSIONS.map((dimension) => {
          const score = result.scores[dimension];
          if (score === undefined) return null;
          const ok = score >= DIMENSION_PASS;
          const label = t.planScore(t.dimensions[dimension], score);
          return (
            <View key={dimension} style={styles.bar}>
              <View style={styles.barHead}>
                <ThemedText type="secondarySemiBold" tabular style={styles.barLabel}>
                  {label}
                </ThemedText>
                <View style={styles.status}>
                  <Icon name={ok ? 'check_circle' : 'error'} size={16} color={ok ? 'statusOk' : 'statusWarn'} />
                  <ThemedText type="caption" themeColor={ok ? 'statusOk' : 'statusWarn'}>
                    {ok ? t.dayScoreOk : t.dayScoreLow}
                  </ThemedText>
                </View>
              </View>
              <ProgressBar fraction={score / 100} done={ok} accessibilityLabel={`${label}. ${ok ? t.dayScoreOk : t.dayScoreLow}`} />
            </View>
          );
        })}
      </View>
      {groups
        .filter((group) => group.findings.length > 0)
        .map((group) => (
          <View key={group.level} style={styles.group}>
            <ThemedText type="secondarySemiBold" themeColor={LOOK[group.level].color} accessibilityRole="header">
              {group.title}
            </ThemedText>
            {group.findings.map((finding, index) => (
              <View key={`${finding.code}-${index}`} style={styles.finding} accessible accessibilityLabel={`${t.planCheckStatus[group.level]}: ${t.findings(finding)}`}>
                <Icon name={LOOK[group.level].icon} size={18} color={LOOK[group.level].color} />
                <ThemedText type="secondary" style={styles.findingText}>
                  {t.findings(finding)}
                </ThemedText>
              </View>
            ))}
          </View>
        ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  bars: { gap: Spacing.three },
  bar: { gap: Spacing.one + 2 },
  barHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  barLabel: { flexShrink: 1 },
  status: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  group: { gap: Spacing.two },
  finding: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  findingText: { flex: 1 },
});
