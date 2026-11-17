import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { dayAdvice, dayBarSegments, daySummary, type DayAdvice } from '../lib/day-plan';
import { formatDuration } from '../lib/time';
import { productivityStrings } from '../strings';
import type { Block, ScheduleRules, ScheduleScenario } from '../types';

export type DaySummaryCardProps = { scenario: ScheduleScenario; blocks: Block[]; rules: ScheduleRules };

const ADVICE_LOOK: Record<DayAdvice['level'], { icon: IconName; color: ThemeColor }> = {
  problem: { icon: 'error', color: 'danger' },
  note: { icon: 'warning', color: 'statusWarn' },
  ok: { icon: 'check_circle', color: 'statusOk' },
};

/**
 * The day at a glance, live: a bar of where work, commitments and rest sit, one line of work, rest and free time, and plain advice. An overpacked
 * day shows here before any check.
 */
export function DaySummaryCard({ scenario, blocks, rules }: DaySummaryCardProps) {
  const t = useLocalized(productivityStrings);
  const theme = useTheme();
  const tones = useTones();
  const { work, rest, free } = daySummary(scenario, blocks);
  const line = t.daySummary(formatDuration(work), formatDuration(rest), formatDuration(free));
  const advice = dayAdvice(scenario, blocks, rules);
  const fill = { task: tones.violet.solid, fixed: tones.indigo.solid, rest: tones.mint.solid } as const;
  const legend = [
    { label: t.dayWork, color: fill.task },
    { label: t.dayLegendFixed, color: fill.fixed },
    { label: t.dayRest, color: fill.rest },
    { label: t.dayFreeLabel, color: theme.backgroundSelected, outlined: true },
  ];
  return (
    <Card style={styles.card}>
      {/* The bar is a picture of the same figures the sentence gives, so screen readers skip it. */}
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.bar, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
        {dayBarSegments(scenario, blocks)
          .filter((segment) => segment.tone !== 'buffer')
          .map((segment, index) => (
            <View key={index} style={[styles.segment, { left: `${segment.left}%`, width: `${segment.width}%`, backgroundColor: fill[segment.tone as keyof typeof fill] }]} />
          ))}
      </View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.legend}>
        {legend.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: item.color }, item.outlined && { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]} />
            <ThemedText type="caption" themeColor="textSecondary">
              {item.label}
            </ThemedText>
          </View>
        ))}
      </View>
      <ThemedText type="bodySemiBold" accessibilityLiveRegion="polite" tabular>
        {line}
      </ThemedText>
      {advice.length > 0 && (
        <View style={styles.advice} accessibilityLiveRegion="polite">
          {advice.length > 1 || advice[0]!.level !== 'ok' ? (
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {t.dayWatchTitle}
            </ThemedText>
          ) : null}
          {advice.map((item) => (
            <View key={item.code} style={styles.adviceRow} accessible accessibilityLabel={`${t.dayAdviceLevel[item.level]}: ${t.dayAdvice(item)}`}>
              <Icon name={ADVICE_LOOK[item.level].icon} size={18} color={ADVICE_LOOK[item.level].color} />
              <ThemedText type="secondary" style={styles.adviceText}>
                <ThemedText type="secondarySemiBold" themeColor={ADVICE_LOOK[item.level].color}>
                  {`${t.dayAdviceLevel[item.level]}. `}
                </ThemedText>
                {t.dayAdvice(item)}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  bar: { height: 14, borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  segment: { position: 'absolute', top: 0, bottom: 0 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  swatch: { width: 10, height: 10, borderRadius: 3, borderCurve: 'continuous' },
  advice: { gap: Spacing.one + 2, marginTop: Spacing.one },
  adviceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  adviceText: { flex: 1 },
});
