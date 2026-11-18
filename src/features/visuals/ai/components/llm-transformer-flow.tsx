import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { StepControls } from '../../components/step-controls';
import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import { Panel, Tag } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { llmTransformerStrings } from '../llm-transformer-strings';
import { formatNumber, formatVector, toPercents } from '../lib/llm-math';
import { buildFlow, FLOW_CANDIDATE_SCORES, FLOW_STEP_IDS, FLOW_TOKEN_IDS, type FlowStepId } from '../lib/llm-transformer';

const FLOW = buildFlow();
const LAST = FLOW_TOKEN_IDS.length - 1;

type VectorLine = { label: string; value: string };
type VectorRow = { token: string; lines: VectorLine[] };

/** Rows of "token chip + its numbers" that change from step to step: the heart of the schematic. */
function TokenRows({ rows, tokenLabel }: { rows: readonly VectorRow[]; tokenLabel: (token: string, lines: string) => string }) {
  return (
    <View style={styles.rows}>
      {rows.map((row, index) => (
        <View key={index} accessible accessibilityLabel={tokenLabel(row.token, row.lines.map((line) => `${line.label} ${line.value}`).join(', '))} style={styles.tokenRow}>
          <Tag text={row.token} tone="violet" outlined />
          <View style={styles.lines}>
            {row.lines.map((line) => (
              <View key={line.label} style={styles.line}>
                <ThemedText type="caption" themeColor="textSecondary" style={styles.lineLabel}>
                  {line.label}
                </ThemedText>
                <ThemedText type="codeInline">{line.value}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * One token's journey: seven steps from text to a list of likely next words, on "The cat sat on the". A simple schematic with made-up numbers (the
 * arithmetic on them is real); every step says what goes in, what happens and what comes out.
 */
export function LlmTransformerFlowVisual({ compact }: VisualProps) {
  const t = useLocalized(llmTransformerStrings);
  const theme = useTheme();
  const tones = useTones();
  const stepper = useStepper(FLOW_STEP_IDS);
  const id: FlowStepId = stepper.step;
  const text = t.steps[id];
  const number = stepper.index + 1;
  const total = stepper.count;

  const rowsFor = (build: (index: number) => VectorLine[]): VectorRow[] => t.tokens.map((token, index) => ({ token, lines: build(index) }));
  const attention = FLOW.attentionWeights[LAST];
  const attentionPercents = toPercents(attention);
  const candidatePercents = toPercents(FLOW.candidateProbabilities);

  const picture = (() => {
    switch (id) {
      case 'tokens':
        return (
          <View style={styles.chips}>
            {t.tokens.map((token, index) => (
              <View key={index} accessible accessibilityLabel={`${token}, ${t.tokenId} ${FLOW_TOKEN_IDS[index]}`} style={styles.chipColumn}>
                <Tag text={token} tone="violet" outlined />
                <ThemedText type="codeInline" themeColor="textSecondary" tabular>
                  {`${t.tokenId} ${FLOW_TOKEN_IDS[index]}`}
                </ThemedText>
              </View>
            ))}
          </View>
        );
      case 'embed':
        return <TokenRows tokenLabel={t.tokenRow} rows={rowsFor((i) => [{ label: t.embeddingLabel, value: formatVector(FLOW.embeddings[i]) }])} />;
      case 'position':
        return (
          <TokenRows
            tokenLabel={t.tokenRow}
            rows={rowsFor((i) => [
              { label: t.embeddingLabel, value: formatVector(FLOW.embeddings[i]) },
              { label: `+ ${t.positionLabel} ${i + 1}`, value: formatVector(FLOW.positions[i]) },
              { label: `= ${t.sumLabel}`, value: formatVector(FLOW.withPosition[i]) },
            ])}
          />
        );
      case 'attention':
        return (
          <View style={styles.block}>
            <Panel label={t.attendTitle}>
              {t.tokens.map((token, index) => (
                <View key={index} accessible accessibilityLabel={t.attendRow(token, attentionPercents[index])} style={styles.barRow}>
                  <ThemedText type="secondarySemiBold" style={styles.barWord}>
                    {token}
                  </ThemedText>
                  <View style={[styles.track, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
                    <View style={[styles.fill, { width: `${Math.max(1, attention[index] * 100)}%`, backgroundColor: theme.primary }]} />
                  </View>
                  <ThemedText type="secondarySemiBold" tabular style={styles.barValue}>
                    {attentionPercents[index]}%
                  </ThemedText>
                </View>
              ))}
            </Panel>
            <TokenRows
              tokenLabel={t.tokenRow}
              rows={rowsFor((i) => [
                { label: t.beforeLabel, value: formatVector(FLOW.withPosition[i]) },
                { label: t.afterLabel, value: formatVector(FLOW.attended[i]) },
              ])}
            />
          </View>
        );
      case 'ffn':
        return (
          <TokenRows
            tokenLabel={t.tokenRow}
            rows={rowsFor((i) => [
              { label: t.beforeLabel, value: formatVector(FLOW.attended[i]) },
              { label: t.afterLabel, value: formatVector(FLOW.processed[i]) },
            ])}
          />
        );
      case 'layers':
        return (
          <View style={styles.block}>
            <View style={styles.layerStack} accessible accessibilityLabel={`${t.layersTitle}. ${t.layersCount}. ${t.layersNote}`}>
              {[t.layerBlock(1), t.layerBlock(2), t.layerMore, t.layerLast].map((label, index) => (
                <View key={index} style={styles.layerWrap}>
                  {index > 0 && <Icon name="arrow_upward" size={16} color="textSecondary" />}
                  <View style={[styles.layer, { backgroundColor: tones.indigo.soft, borderColor: tones.indigo.ink }, label === t.layerMore && styles.layerGap]}>
                    <ThemedText type="secondarySemiBold" style={{ color: tones.indigo.ink }}>
                      {label}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
            <Tag text={t.layersCount} tone="amber" outlined marker="⟳" />
            {!compact && (
              <ThemedText type="secondary" themeColor="textSecondary">
                {t.layersNote}
              </ThemedText>
            )}
          </View>
        );
      case 'predict':
        return (
          <View style={styles.block}>
            <Panel label={t.candidatesTitle}>
              {t.candidates.map((token, index) => {
                const picked = index === FLOW.pickedCandidate;
                return (
                  <View key={token} accessible accessibilityLabel={t.candidateRow(token, FLOW_CANDIDATE_SCORES[index], candidatePercents[index], picked)} style={styles.barRow}>
                    <ThemedText type="codeInline" style={styles.barWord}>
                      {token.trim()}
                    </ThemedText>
                    <View style={[styles.track, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
                      <View style={[styles.fill, { width: `${Math.max(1, FLOW.candidateProbabilities[index] * 100)}%`, backgroundColor: picked ? theme.primary : tones.neutral.solid }]} />
                    </View>
                    <View style={styles.barValue}>
                      <ThemedText type="secondarySemiBold" tabular>
                        {candidatePercents[index]}%
                      </ThemedText>
                      <ThemedText type="caption" themeColor="textSecondary" tabular>
                        {`${t.scoreWord} ${formatNumber(FLOW_CANDIDATE_SCORES[index])}`}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
            </Panel>
            <Tag text={t.pickedLabel(t.candidates[FLOW.pickedCandidate].trim())} tone="mint" outlined marker="✓" />
            {!compact && (
              <ThemedText type="caption" themeColor="textSecondary">
                {`${t.vocabularyNote} ${t.pickNote}`}
              </ThemedText>
            )}
          </View>
        );
    }
  })();

  return (
    <VisualFrame title={t.title} description={t.description} compact={compact} caption={text.caption} controls={<StepControls stepper={stepper} hidePlay />}>
      <View style={styles.stage}>
        <View accessible accessibilityRole="progressbar" accessibilityLabel={t.progressLabel(number, total, text.name)} accessibilityValue={{ min: 1, max: total, now: number }} style={styles.progress}>
          {FLOW_STEP_IDS.map((step, index) => (
            <View key={step} style={[styles.segment, { backgroundColor: index <= stepper.index ? theme.primary : theme.backgroundSelected }]} />
          ))}
        </View>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {`${number}. ${text.name}`}
        </ThemedText>

        {picture}

        <View style={styles.io}>
          {(
            [
              ['inLabel', text.input],
              ['happensLabel', text.happens],
              ['outLabel', text.output],
            ] as const
          ).map(([key, value]) => (
            <View key={key} style={styles.ioRow}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.ioLabel}>
                {t[key]}
              </ThemedText>
              <ThemedText type="secondary" style={styles.ioText}>
                {value}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stage: { gap: Spacing.three },
  progress: { flexDirection: 'row', gap: Spacing.one },
  segment: { flex: 1, height: 6, borderRadius: Radius.pill },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chipColumn: { alignItems: 'center', gap: Spacing.one },
  block: { gap: Spacing.two },
  rows: { gap: Spacing.two },
  tokenRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  lines: { flex: 1, gap: 2 },
  line: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: Spacing.two },
  lineLabel: { minWidth: 76 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  barWord: { width: 56 },
  track: { flex: 1, height: 14, borderRadius: Radius.small / 2, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.small / 2 },
  barValue: { width: 64, alignItems: 'flex-end' },
  layerStack: { gap: Spacing.one, alignItems: 'stretch' },
  layerWrap: { alignItems: 'center', gap: Spacing.half },
  layer: { alignSelf: 'stretch', paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  layerGap: { borderStyle: 'dashed' },
  io: { gap: Spacing.two },
  ioRow: { flexDirection: 'row', gap: Spacing.two },
  ioLabel: { width: 84 },
  ioText: { flex: 1 },
});
