import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Toggle } from '@/components/ui/toggle';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { VisualFrame } from '../../components/visual-frame';
import { Panel, Tag } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { llmAttentionStrings } from '../llm-attention-strings';
import { ATTENTION_HEAD_IDS, ATTENTION_SENTENCE_IDS, ATTENTION_STEP_IDS, attentionFor, blendOf, defaultQuery, rankRows, type AttentionHeadId, type AttentionSentenceId, type AttentionStepId } from '../lib/llm-attention';
import { formatNumber } from '../lib/llm-math';

const BAR_HEIGHT = 40;

/**
 * Self-attention on three hand-written sentences: tap a word to make it the one that is looking, and every other word shows how much attention it gets
 * (weights from a real softmax over made-up scores). Two heads pay attention to different things, and the steps can be walked one at a time.
 */
export function LlmAttentionVisual({ compact }: VisualProps) {
  const t = useLocalized(llmAttentionStrings);
  const theme = useTheme();
  const [sentenceId, setSentenceId] = useState<AttentionSentenceId>('trophy');
  const [head, setHead] = useState<AttentionHeadId>('links');
  const [query, setQuery] = useState(() => defaultQuery('trophy'));
  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState<AttentionStepId>('scores');

  const { words } = t.sentences[sentenceId];
  const rows = attentionFor(sentenceId, head, query);
  const byIndex = new Map(rows.map((row) => [row.index, row]));
  const queryWord = words[query];
  // Without the steps, the picture shows the end result: weights and the blend. With them, the step the learner chose.
  const view: AttentionStepId = showSteps ? step : 'blend';
  const maxScore = Math.max(...rows.map((row) => row.score), 1);
  const maxWeight = Math.max(...rows.map((row) => row.weight));
  const ranked = rankRows(rows);
  const blend = blendOf(rows);
  const note = head === 'links' ? t.meaningNotes[`${sentenceId}:${query}`] : undefined;
  const totalPercent = rows.reduce((total, row) => total + row.percent, 0);

  const pickSentence = (id: AttentionSentenceId) => {
    setSentenceId(id);
    setQuery(defaultQuery(id));
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={showSteps ? t.steps[step].explain : t.heads[head].note}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.sentenceLabel} wrap value={sentenceId} onChange={pickSentence} options={ATTENTION_SENTENCE_IDS.map((id) => ({ value: id, label: t.sentences[id].label }))} />
          <ChipSelect label={t.headLabel} wrap value={head} onChange={setHead} options={ATTENTION_HEAD_IDS.map((id) => ({ value: id, label: t.heads[id].name }))} />
          <View style={styles.toggleRow}>
            <ThemedText type="secondarySemiBold" style={styles.toggleLabel}>
              {t.showSteps}
            </ThemedText>
            <Toggle value={showSteps} onValueChange={setShowSteps} accessibilityLabel={t.showSteps} />
          </View>
          {showSteps && <ChipSelect label={t.stepsLabel} wrap value={step} onChange={setStep} options={ATTENTION_STEP_IDS.map((id, index) => ({ value: id, label: t.stepChoice(index + 1, t.steps[id].label) }))} />}
        </View>
      }>
      <View style={styles.stage}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.sentenceText(words)}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.tapHint}
        </ThemedText>

        {/* Each word is a button: tapping it makes it the one that is looking. Its attention is a bar AND a number, so nothing rests on color alone. */}
        <View style={styles.words}>
          {words.map((word, index) => {
            const row = byIndex.get(index);
            const isQuery = index === query;
            const shown = row === undefined ? null : view === 'scores' ? formatNumber(row.score) : `${row.percent}%`;
            const height = row === undefined ? 0 : Math.max(2, Math.round(BAR_HEIGHT * (view === 'scores' ? row.score / maxScore : row.weight / maxWeight)));
            const label = row === undefined ? t.queryCell(word) : view === 'scores' ? t.scoreCell(word, queryWord, row.score) : t.weightCell(word, queryWord, row.percent);
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: isQuery }}
                onPress={() => setQuery(index)}
                style={({ pressed }) => [styles.cell, { backgroundColor: isQuery ? theme.primarySoft : theme.backgroundElement, borderColor: isQuery ? theme.primary : theme.border }, isQuery && styles.cellOn, pressed && styles.pressed]}>
                <ThemedText type="caption" themeColor={isQuery ? 'primary' : 'textSecondary'} tabular style={styles.cellTop}>
                  {isQuery ? `◎ ${t.queryMark}` : shown}
                </ThemedText>
                <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
                  <View style={[styles.fill, { height, backgroundColor: theme.primary }]} />
                </View>
                <ThemedText type="secondarySemiBold" themeColor={isQuery ? 'primary' : 'text'}>
                  {word}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <Panel label={showSteps ? t.steps[step].title : t.weightsTitle}>
          {view !== 'scores' && <Tag text={t.totalLabel(totalPercent)} tone="mint" outlined marker="∑" />}
          <ThemedText type="secondary">{t.strongest(ranked.slice(0, 3).map((row) => (view === 'scores' ? `${words[row.index]} (${formatNumber(row.score)})` : `${words[row.index]} (${row.percent}%)`)).join(', '))}</ThemedText>
        </Panel>

        {view === 'blend' && (
          <Panel label={t.blendTitle}>
            <ThemedText type="body">{t.blendLine(queryWord, blend.top.map((row) => ({ word: words[row.index], percent: row.percent })), blend.restPercent, blend.restCount)}</ThemedText>
            {note !== undefined && !compact && <ThemedText type="secondary">{note}</ThemedText>}
          </Panel>
        )}

        <ThemedText type="caption" themeColor="textSecondary">
          {t.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, minHeight: MinTouchSize },
  toggleLabel: { flex: 1 },
  stage: { gap: Spacing.three },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one + 2 },
  cell: { minWidth: MinTouchSize, minHeight: MinTouchSize, alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.one + 2, paddingVertical: Spacing.one + 2, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  cellOn: { borderWidth: 2 },
  cellTop: { minHeight: 16, textAlign: 'center' },
  track: { width: 14, height: BAR_HEIGHT, borderRadius: Radius.small / 2, justifyContent: 'flex-end', overflow: 'hidden' },
  fill: { width: '100%', borderRadius: Radius.small / 2 },
  pressed: { opacity: 0.7 },
});
