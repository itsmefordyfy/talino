import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../../components/visual-frame';
import { Panel, Tag } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { llmSamplingStrings } from '../llm-sampling-strings';
import { toPercents } from '../lib/llm-math';
import {
  CANDIDATE_COUNT,
  DEFAULT_SETTINGS,
  DRAWS,
  drawSeed,
  drawTokens,
  factsOf,
  MAX_TEMPERATURE,
  MAX_TOP_P,
  MIN_TEMPERATURE,
  MIN_TOP_P,
  SAMPLING_LOGITS,
  SAMPLING_PROMPT_IDS,
  sampleTable,
  tally,
  type SamplingPromptId,
} from '../lib/llm-sampling';
import { ValueAdjust } from './value-adjust';

// The controls count in whole steps (tenths of a degree, twentieths of a share) so the setting never carries a floating-point error.
const T_MIN = Math.round(MIN_TEMPERATURE * 10);
const T_MAX = Math.round(MAX_TEMPERATURE * 10);
const P_MIN = Math.round(MIN_TOP_P * 20);
const P_MAX = Math.round(MAX_TOP_P * 20);
const START = { temperature: Math.round(DEFAULT_SETTINGS.temperature * 10), topK: DEFAULT_SETTINGS.topK, topP: Math.round(DEFAULT_SETTINGS.topP * 20) };

/**
 * Temperature, top-k and top-p on a made-up next-token table. The bars are the real result of the chain (softmax with temperature, top-k, top-p,
 * renormalise); the scores are made up. "Draw 10 times" uses a seeded generator, so a press always gives the same tokens.
 */
export function LlmSamplingVisual({ compact }: VisualProps) {
  const t = useLocalized(llmSamplingStrings);
  const theme = useTheme();
  const tones = useTones();
  const [promptId, setPromptId] = useState<SamplingPromptId>('learn');
  const [temperatureStep, setTemperatureStep] = useState(START.temperature);
  const [topK, setTopK] = useState(START.topK);
  const [topPStep, setTopPStep] = useState(START.topP);
  const [presses, setPresses] = useState(0);

  const prompt = t.prompts[promptId];
  const logits = SAMPLING_LOGITS[promptId];
  const settings = { temperature: temperatureStep / 10, topK, topP: topPStep / 20 };
  const table = sampleTable(logits, settings);
  const facts = factsOf(logits, settings, table);
  const finalPercents = toPercents(table.map((candidate) => candidate.final));
  const tempPercents = toPercents(table.map((candidate) => candidate.tempProb));
  const drawn = presses > 0 ? drawTokens(table.map((candidate) => candidate.final), DRAWS, drawSeed(SAMPLING_PROMPT_IDS.indexOf(promptId), presses)) : [];
  const counts = tally(drawn, CANDIDATE_COUNT);
  const countRows = counts.map((count, index) => ({ count, index })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count || a.index - b.index);
  const atStart = temperatureStep === START.temperature && topK === START.topK && topPStep === START.topP && presses === 0;
  const percentText = (percent: number, possible: boolean) => (percent === 0 && possible ? t.smallPercent : `${percent}%`);

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={t.explain(facts, settings, prompt.tokens[facts.topIndex], CANDIDATE_COUNT)}
      controls={
        <View style={styles.controls}>
          <ChipSelect
            label={t.promptLabel}
            wrap
            value={promptId}
            onChange={(id) => {
              setPromptId(id);
              setPresses(0);
            }}
            options={SAMPLING_PROMPT_IDS.map((id) => ({ value: id, label: t.prompts[id].label }))}
          />
          <View style={styles.settings}>
            <ValueAdjust label={t.temperatureLabel} step={temperatureStep} min={T_MIN} max={T_MAX} display={settings.temperature.toFixed(1)} onChange={setTemperatureStep} />
            <ValueAdjust label={t.topKLabel} step={topK} min={1} max={CANDIDATE_COUNT} display={topK >= CANDIDATE_COUNT ? t.all : String(topK)} onChange={setTopK} />
            <ValueAdjust label={t.topPLabel} step={topPStep} min={P_MIN} max={P_MAX} display={settings.topP.toFixed(2)} onChange={setTopPStep} />
          </View>
          <View style={styles.buttons}>
            <Button size="small" icon="casino" title={t.drawButton} onPress={() => setPresses((count) => count + 1)} />
            <Button size="small" variant="ghost" icon="refresh" title={t.reset} disabled={atStart} onPress={() => {
              setTemperatureStep(START.temperature);
              setTopK(START.topK);
              setTopPStep(START.topP);
              setPresses(0);
            }} />
          </View>
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.promptLine} accessible accessibilityLabel={`${prompt.text} …`}>
          <ThemedText type="bodySemiBold">{prompt.text}</ThemedText>
          <Tag text={`… ${t.nextToken}`} tone="violet" outlined />
        </View>

        <Panel label={t.tableTitle}>
          <View style={styles.rows}>
            {table.map((candidate) => {
              const token = prompt.tokens[candidate.index];
              const out = !candidate.kept;
              const reason = candidate.outBy ? t.outReason[candidate.outBy] : '';
              const before = percentText(tempPercents[candidate.index], true);
              const now = percentText(finalPercents[candidate.index], candidate.final > 0);
              return (
                <View key={candidate.index} accessible accessibilityLabel={t.rowLabel(token, !out, now, reason, before)} style={[styles.row, out && styles.rowOut]}>
                  <View style={[styles.token, { backgroundColor: out ? 'transparent' : tones.violet.soft, borderColor: out ? theme.textTertiary : tones.violet.ink }, out && styles.dashed]}>
                    <ThemedText type="codeInline" themeColor={out ? 'textSecondary' : 'text'} numberOfLines={1} style={out && styles.struck}>
                      {token}
                    </ThemedText>
                  </View>
                  {/* The outline is the chance after temperature alone; the fill is what is left after the filters. */}
                  <View style={[styles.track, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
                    <View style={[styles.ghost, { width: `${Math.max(1, candidate.tempProb * 100)}%`, borderColor: out ? theme.textTertiary : 'transparent' }, out && styles.dashed]} />
                    {!out && <View style={[styles.fill, { width: `${Math.max(1, candidate.final * 100)}%`, backgroundColor: theme.primary }]} />}
                  </View>
                  <View style={styles.value}>
                    <ThemedText type="secondarySemiBold" themeColor={out ? 'textSecondary' : 'text'} tabular>
                      {out ? `✕ ${t.outWord}` : now}
                    </ThemedText>
                    {!compact && (
                      <ThemedText type="caption" themeColor="textTertiary" tabular>
                        {out ? reason : `${t.scoreWord} ${candidate.logit}`}
                      </ThemedText>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.legend}
          </ThemedText>
        </Panel>

        <Panel label={t.drawsTitle}>
          {drawn.length === 0 ? (
            <ThemedText type="secondary" themeColor="textSecondary">
              {t.drawsNone}
            </ThemedText>
          ) : (
            <View style={styles.draws} accessibilityLiveRegion="polite">
              <View style={styles.tags}>
                {countRows.map((row) => (
                  <View key={row.index} accessible accessibilityLabel={t.drawCountLabel(prompt.tokens[row.index], row.count)}>
                    <Tag text={t.drawCount(prompt.tokens[row.index], row.count)} tone="indigo" outlined mono />
                  </View>
                ))}
              </View>
              <ThemedText type="secondary">{t.drawsOrder(drawn.map((index) => prompt.tokens[index]))}</ThemedText>
              {!compact && (
                <ThemedText type="caption" themeColor="textSecondary">
                  {t.drawsNote}
                </ThemedText>
              )}
            </View>
          )}
        </Panel>

        {!compact && <ThemedText type="secondary">{t.idea}</ThemedText>}
        <ThemedText type="caption" themeColor="textSecondary">
          {t.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  settings: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.three },
  promptLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  rows: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  rowOut: { opacity: 0.85 },
  token: { width: 96, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  // Dropped tokens: dashed border, struck text and the word "out" as well as the dimming, never faded alone.
  dashed: { borderStyle: 'dashed' },
  struck: { textDecorationLine: 'line-through' },
  track: { flex: 1, height: 16, borderRadius: Radius.small / 2, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden', justifyContent: 'center' },
  ghost: { position: 'absolute', left: 0, top: 0, bottom: 0, borderWidth: 1.5, borderRadius: Radius.small / 2 },
  fill: { height: '100%', borderRadius: Radius.small / 2 },
  value: { width: 76, alignItems: 'flex-end' },
  draws: { gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
