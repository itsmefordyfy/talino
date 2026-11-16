import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { COMPARISON_ROWS, type ComparisonCell } from '../lib/paywall-content';
import { paywallStrings } from '../paywall-strings';

export type PlanComparisonProps = {
  /** Pro's column is dimmed into the background when it's already the learner's plan. */
  isPro?: boolean;
};

/** Free next to Pro, one row per difference, as the app gates them. */
export function PlanComparison({ isPro = false }: PlanComparisonProps) {
  const s = useLocalized(paywallStrings);
  const c = s.compare;
  const theme = useTheme();
  const words = (cell: ComparisonCell): string | null => {
    if (typeof cell === 'boolean') return null;
    if (typeof cell === 'object') return c.perDay(cell.perDay);
    return c[cell];
  };
  const spoken = (cell: ComparisonCell) => words(cell) ?? (cell ? c.included : c.notIncluded);
  const render = (cell: ComparisonCell, pro: boolean) => {
    const text = words(cell);
    return text !== null ? (
      <ThemedText type="secondarySemiBold" themeColor={pro ? 'primaryText' : 'text'} style={styles.value} numberOfLines={2} tabular>
        {text}
      </ThemedText>
    ) : (
      <Icon name={cell ? 'check_circle' : 'remove'} size={20} color={cell ? 'statusOk' : 'textTertiary'} accessibilityLabel={spoken(cell)} />
    );
  };
  return (
    <View style={styles.compare}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.title} accessibilityRole="header">
        {c.title}
      </ThemedText>
      <Card padded={false}>
        <View style={[styles.row, styles.headRow]}>
          <View style={styles.label} />
          {/* Boxed as PRO's pill, so both labels share its height and centre line. */}
          <View style={[styles.col, styles.proHead]}>
            <ThemedText type="secondarySemiBold" themeColor={isPro ? 'textSecondary' : 'text'}>
              {c.free}
            </ThemedText>
          </View>
          <View style={[styles.col, styles.proHead, { backgroundColor: theme.primarySoft }]}>
            <ThemedText type="secondarySemiBold" themeColor="primaryText">
              {s.badge}
            </ThemedText>
          </View>
        </View>
        {COMPARISON_ROWS.map((row) => (
          <View key={row.key}>
            <Divider inset />
            <View style={styles.row} accessible accessibilityLabel={`${c.rows[row.key]}: ${c.free} ${spoken(row.free)}, ${s.badge} ${spoken(row.pro)}`}>
              <ThemedText type="secondary" style={styles.label}>
                {c.rows[row.key]}
              </ThemedText>
              <View style={styles.col}>{render(row.free, false)}</View>
              <View style={styles.col}>{render(row.pro, true)}</View>
            </View>
          </View>
        ))}
      </Card>
      {/* The one place Pro's number is told: Pro is unlimited AI chat, under fair use. */}
      <ThemedText type="caption" themeColor="textTertiary" style={styles.fineprint}>
        {s.fairUseNote}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  compare: {
    gap: Spacing.two,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.two,
  },
  fineprint: {
    paddingHorizontal: Spacing.two,
  },
  headRow: {
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: MinTouchSize,
  },
  label: {
    flex: 1,
  },
  col: {
    width: 84,
    alignItems: 'center',
  },
  // The column's full width, wrapping to a second line when needed: iOS's adjustsFontSizeToFit shrinks short values in a column this narrow.
  value: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  proHead: {
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
});
