import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { cleanKey, countOf, deleteSteps, idleStep, insertSteps, lookupSteps, maxKeys, MAX_KEY_LENGTH, tableFromKeys, TABLE_SIZE, type HashMode, type HashStep } from './hash-table';
import { hashTableStrings } from './hash-table-strings';

const START_KEYS = ['cat', 'dog', 'map', 'pen'];
const PRESETS = ['sun', 'tea', 'ant', 'cup', 'bee', 'owl'];

export function HashTableVisual({ compact }: VisualProps) {
  const t = useLocalized(hashTableStrings);
  const theme = useTheme();
  const tones = useTones();
  const [trace, setTrace] = useState<HashStep[]>(() => [idleStep(tableFromKeys('chaining', START_KEYS), hashTableStrings.en.intro('chaining', START_KEYS.length))]);
  const [text, setText] = useState('sun');
  const stepper = useStepper(trace, { intervalMs: 1000 });
  const step = stepper.step;
  const table = step.table;
  // Operations start from where the last one ended; the mode follows the table.
  const settled = trace[trace.length - 1]?.table ?? table;
  const key = cleanKey(text);
  const run = (build: (key: string) => HashStep[]) => setTrace(build(key));
  const rebuild = (mode: HashMode, keys: readonly string[]) => {
    const kept = keys.slice(0, maxKeys(mode));
    setTrace([idleStep(tableFromKeys(mode, kept), t.switched(mode, keys.length - kept.length, TABLE_SIZE))]);
  };

  const toneFor = (index: number): Tone => {
    if (step.found?.index === index) return 'mint';
    if (step.placed?.index === index) return 'violet';
    if (step.removed?.index === index) return 'red';
    if (step.collision === index) return 'red';
    if (step.focus === index) return 'amber';
    return 'neutral';
  };

  const chipTone = (index: number, pos: number): Tone => {
    if (step.found?.index === index && step.found.pos === pos) return 'mint';
    if (step.placed?.index === index && step.placed.pos === pos) return 'violet';
    if (step.focus === index && step.chainPos === pos) return 'amber';
    return 'neutral';
  };

  const entries = table.mode === 'chaining' ? table.chains.map((chain, index) => t.bucketEntry(index, chain)) : table.slots.map((slot, index) => t.slotEntry(index, slot.kind === 'full' ? slot.key : slot.kind === 'deleted' ? t.deletedMark : t.emptyBucket));
  const count = countOf(table);
  const load = count / TABLE_SIZE;

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <SegmentedControl<HashMode>
            accessibilityLabel={t.modeLabel}
            value={settled.mode}
            options={[
              { value: 'chaining', label: t.modes.chaining },
              { value: 'probing', label: t.modes.probing },
            ]}
            onChange={(mode) => {
              if (mode !== settled.mode) rebuild(mode, settled.keys);
            }}
          />
          <TextField label={t.keyLabel} value={text} onChangeText={(next) => setText(cleanKey(next))} maxLength={MAX_KEY_LENGTH} autoCapitalize="none" autoCorrect={false} />
          <ChipSelect<string> label={t.presetsLabel} wrap value={PRESETS.includes(text) ? text : null} onChange={setText} options={PRESETS.map((word) => ({ value: word, label: word }))} />
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.insert} icon="add" disabled={key === ''} onPress={() => run((value) => insertSteps(settled, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.lookup} icon="search" disabled={key === ''} onPress={() => run((value) => lookupSteps(settled, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.delete} disabled={key === ''} onPress={() => run((value) => deleteSteps(settled, value, t))} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={() => setTrace([idleStep(tableFromKeys(settled.mode, START_KEYS), t.intro(settled.mode, START_KEYS.length))])} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <ThemedText type="caption" themeColor="textSecondary">{t.hashRule}</ThemedText>
        <View style={styles.rows} accessible accessibilityLabel={t.tableLabel(table.mode, entries)}>
          {Array.from({ length: TABLE_SIZE }, (_, index) => {
            const tone = tones[toneFor(index)];
            const strong = toneFor(index) !== 'neutral';
            const slot = table.slots[index]!;
            return (
              <View key={index} style={styles.row}>
                <View style={styles.indexBox}>
                  <ThemedText type="caption" themeColor="textSecondary">{table.mode === 'chaining' ? t.bucketLabel : t.slotLabel}</ThemedText>
                  <ThemedText type="secondarySemiBold" tabular>{index}</ThemedText>
                </View>
                <View style={[styles.bucket, { backgroundColor: strong ? tone.soft : 'transparent', borderColor: strong ? tone.ink : theme.border }, strong && styles.bucketStrong]}>
                  {table.mode === 'chaining' ? (
                    table.chains[index]!.length === 0 ? (
                      <ThemedText type="caption" themeColor="textTertiary">{t.emptyBucket}</ThemedText>
                    ) : (
                      <View style={styles.chain}>
                        {table.chains[index]!.map((chainKey, pos) => {
                          const chip = tones[chipTone(index, pos)];
                          return (
                            <View key={`${chainKey}-${pos}`} style={styles.chainItem}>
                              <View style={[styles.chip, { backgroundColor: chip.soft, borderColor: chip.ink }]}>
                                <ThemedText type="codeInline" style={{ color: chip.ink }}>{chainKey}</ThemedText>
                              </View>
                              <ThemedText type="caption" themeColor="textSecondary">{pos === table.chains[index]!.length - 1 ? `→ ${t.chainEnd}` : '→'}</ThemedText>
                            </View>
                          );
                        })}
                      </View>
                    )
                  ) : slot.kind === 'full' ? (
                    <View style={[styles.chip, { backgroundColor: tones[chipTone(index, 0)].soft, borderColor: tones[chipTone(index, 0)].ink }]}>
                      <ThemedText type="codeInline" style={{ color: tones[chipTone(index, 0)].ink }}>{slot.key}</ThemedText>
                    </View>
                  ) : (
                    <ThemedText type="caption" themeColor="textTertiary">{slot.kind === 'deleted' ? t.deletedMark : t.emptyBucket}</ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.counters}>
          <Tag text={`${t.operationLabel}: ${step.operation ? t.operationNames[step.operation] : t.noOperation}`} tone={step.refused ? 'red' : 'indigo'} outlined />
          <Tag text={t.loadFactor(count, TABLE_SIZE)} tone="violet" mono outlined />
          <Tag text={t.probes(step.probes)} tone="amber" mono />
          <Tag text={t.compares(step.compares)} tone="amber" mono />
          <Tag text={t.collisions(step.collisions)} tone="red" mono marker={step.collisions > 0 ? '!' : undefined} />
        </View>
        <ThemedText type="secondary" themeColor="textSecondary">{t.loadNote(table.mode, load)}</ThemedText>
        <ThemedText type="secondarySemiBold">{t.complexity}</ThemedText>
        {!compact ? (
          <Legend
            items={[
              { label: t.legend.looking, tone: 'amber', marker: '●' },
              { label: t.legend.collision, tone: 'red', marker: '!' },
              { label: t.legend.stored, tone: 'violet', marker: '+' },
              { label: t.legend.found, tone: 'mint', marker: '✓' },
            ]}
          />
        ) : null}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  rows: { gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  indexBox: { width: 52, flexDirection: 'row', alignItems: 'baseline', gap: Spacing.one },
  bucket: { flex: 1, minHeight: 40, justifyContent: 'center', paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  bucketStrong: { borderWidth: 2 },
  chain: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.one },
  chainItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  chip: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5, alignSelf: 'flex-start' },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
