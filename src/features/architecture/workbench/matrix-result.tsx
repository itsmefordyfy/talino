import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { MATRIX_LIMITS, type MatrixResult, type MatrixState, type MatrixWarning } from '../lib/tradeoff';
import { architectureToolStrings } from './strings';

export type MatrixResultViewProps = { state: MatrixState; result: MatrixResult };

/**
 * The live result: each option's weighted average, then either a leader (with the gap) or, when the top two are within half a point, "too close to call" and the
 * qualities where they differ most. It always says the matrix organises the learner's judgment and does not decide for them.
 */
export function MatrixResultView({ state, result }: MatrixResultViewProps) {
  const t = useLocalized(architectureToolStrings).matrix;
  const nameOf = (id: string) => state.options.find((option) => option.id === id)?.name ?? id;
  const unscored = result.scores.filter((row) => row.average === null);
  const warningText = (warning: MatrixWarning): string => {
    switch (warning.code) {
      case 'same_weights':
        return t.warnings.same_weights;
      case 'few_differing':
        return t.warnings.few_differing(warning.count);
      case 'unscored_option':
        return t.warnings.unscored_option(nameOf(warning.optionId));
      case 'missing_scores':
        return t.warnings.missing_scores(warning.count);
    }
  };

  return (
    <View style={styles.root}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {t.resultHeading}
      </ThemedText>

      <View style={styles.rows}>
        {[...result.ranking, ...unscored].map((row) => {
          const rank = result.ranking.indexOf(row);
          const label = t.optionResult(rank === -1 ? null : rank + 1, row.name, row.average);
          return (
            <View key={row.optionId} style={styles.row} accessible accessibilityLabel={label}>
              <View style={styles.rowTop}>
                <ThemedText type="bodySemiBold" style={styles.name} numberOfLines={2}>
                  {row.name}
                </ThemedText>
                <ThemedText type="bodySemiBold" tabular themeColor={row.average === null ? 'textSecondary' : 'text'}>
                  {t.averageText(row.average)}
                </ThemedText>
              </View>
              <ProgressBar fraction={row.average === null ? 0 : row.average / MATRIX_LIMITS.maxRating} accessibilityLabel={label} />
            </View>
          );
        })}
      </View>

      <View accessibilityLiveRegion="polite" style={styles.verdict}>
        {result.verdict === 'not_ready' ? (
          <ThemedText type="body" themeColor="textSecondary">
            {t.notReady}
          </ThemedText>
        ) : result.verdict === 'leader' && result.leaderId && result.margin !== null ? (
          <ThemedText type="body">{t.leader(nameOf(result.leaderId), result.margin)}</ThemedText>
        ) : result.margin !== null ? (
          <>
            <Notice tone="info" message={t.tooClose(result.margin)} />
            <ThemedText type="bodySemiBold">{t.closeHeading}</ThemedText>
            {result.closeCriteria.length === 0 ? (
              <ThemedText type="secondary" themeColor="textSecondary">
                {t.closeNoDifference}
              </ThemedText>
            ) : (
              result.closeCriteria.map((row) => (
                <ThemedText key={row.criterionId} type="secondary" themeColor="textSecondary">
                  {`• ${t.closeRow(row.name, row.weight, nameOf(row.higherOptionId), row.higherScore, nameOf(row.lowerOptionId), row.lowerScore)}`}
                </ThemedText>
              ))
            )}
          </>
        ) : null}
      </View>

      {result.warnings.length > 0 ? (
        <View style={styles.warnings}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {t.warningsHeading}
          </ThemedText>
          {result.warnings.map((warning, index) => (
            <Notice key={`${warning.code}-${index}`} tone="warning" message={warningText(warning)} />
          ))}
        </View>
      ) : null}

      <ThemedText type="secondary" themeColor="textSecondary">
        {t.disclaimer}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  rows: { gap: Spacing.three },
  row: { gap: Spacing.one },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: Spacing.two },
  name: { flex: 1 },
  verdict: { gap: Spacing.two },
  warnings: { gap: Spacing.two },
});
