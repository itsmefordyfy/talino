import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, NumberAdjust, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildExtraSteps, EXTRA_ALGORITHMS, makeExtraInput, MAX_ITEMS, MAX_VALUE, MIN_ITEMS, parseExtraValues, type ExtraAlgorithm } from './sort-extra';
import { sortExtraStrings } from './sort-extra-strings';

const BAR_AREA = 110;
const GAP = 3;
const STARTER = [5, 2, 8, 1, 9, 3, 7, 4];

export function SortExtraVisual({ compact }: VisualProps) {
  const t = useLocalized(sortExtraStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [algorithm, setAlgorithm] = useState<ExtraAlgorithm>('heap');
  const [pattern, setPattern] = useState<'random' | 'custom'>('random');
  const [size, setSize] = useState(8);
  const [seed, setSeed] = useState(1);
  const [custom, setCustom] = useState(STARTER.join(', '));

  const parsed = pattern === 'custom' ? parseExtraValues(custom) : null;
  const input = pattern === 'custom' ? (parsed ?? STARTER) : makeExtraInput(size, seed);
  const run = buildExtraSteps(algorithm, input, t);
  const stepper = useStepper(run.steps, { intervalMs: 650 });
  const step = stepper.step;
  const k = Math.max(...input) + 1;
  const barWidth = Math.max(8, (width - GAP * (input.length - 1)) / input.length);

  const colorFor = (index: number) => {
    if (step.moved.includes(index)) return tones.red.solid;
    if (step.compare.includes(index)) return tones.amber.solid;
    if (step.readIndex === index) return tones.violet.solid;
    if (algorithm === 'heap' && index >= step.sortedFrom) return tones.mint.solid;
    return tones.indigo.solid;
  };
  const symbolFor = (index: number) => (step.moved.includes(index) ? '⇄' : step.compare.includes(index) ? '●' : step.readIndex === index ? '★' : algorithm === 'heap' && index >= step.sortedFrom ? '✓' : '');

  const bars = (values: readonly (number | null)[], colorOf: (index: number) => string, symbolOf: (index: number) => string) => (
    <View accessible accessibilityLabel={t.barsLabel(values)}>
      <View style={[styles.bars, { height: BAR_AREA }]}>
        {values.map((value, index) => (
          <View key={index} style={[styles.barColumn, { width: barWidth }]}>
            <ThemedText type="caption" tabular>{value === null ? '' : value}</ThemedText>
            {value === null ? <View style={[styles.empty, { borderColor: theme.border, height: 14 }]} /> : <View style={[styles.bar, { height: Math.max(6, ((BAR_AREA - 18) * (value + 1)) / (MAX_VALUE + 1)), backgroundColor: colorOf(index) }]} />}
          </View>
        ))}
      </View>
      <View style={styles.symbols}>
        {values.map((_, index) => (
          <ThemedText key={index} type="caption" themeColor="textSecondary" style={[styles.symbol, { width: barWidth }]}>{symbolOf(index)}</ThemedText>
        ))}
      </View>
    </View>
  );

  const countsPhase = step.phase === 'count' || step.phase === 'prefix' || step.phase === 'place' ? step.phase : step.phase === 'done' ? 'place' : 'count';
  const moveLabel = run.moveKind === 'swaps' ? t.swaps : t.writes;

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.algorithmLabel} value={algorithm} onChange={setAlgorithm} options={EXTRA_ALGORITHMS.map((value) => ({ value, label: t.algorithms[value] }))} />
          <ChipSelect label={t.patternLabel} value={pattern} onChange={setPattern} options={[{ value: 'random', label: t.patterns.random }, { value: 'custom', label: t.patterns.custom }]} />
          {pattern === 'custom' ? (
            <TextField label={t.customLabel} value={custom} onChangeText={setCustom} keyboardType="numbers-and-punctuation" error={parsed ? null : t.customError} />
          ) : (
            <View style={styles.row}>
              <NumberAdjust label={t.sizeLabel} value={size} min={MIN_ITEMS} max={MAX_ITEMS} onChange={setSize} />
              <Button title={t.shuffle} icon="shuffle" size="small" variant="secondary" onPress={() => setSeed(seed + 1)} />
            </View>
          )}
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={styles.counters}>
          <Tag text={`${t.comparisons}: ${step.comparisons}`} tone="amber" outlined />
          <Tag text={`${moveLabel}: ${step.moves}`} tone="red" outlined />
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.inputTitle}</ThemedText>
        {bars(step.values, colorFor, symbolFor)}
        {algorithm === 'heap' && step.heapSize !== null ? <ThemedText type="secondary" themeColor="textSecondary">{t.heapRegion(step.heapSize)}</ThemedText> : null}

        {step.counts ? (
          <>
            <ThemedText type="caption" themeColor="textSecondary">{t.countsTitle[countsPhase]}</ThemedText>
            <View style={styles.cells} accessible accessibilityLabel={t.countsLabel(step.counts)}>
              {step.counts.map((count, value) => {
                const on = step.countFocus === value;
                return (
                  <View key={value} style={styles.cellColumn}>
                    <ThemedText type="caption" themeColor="textSecondary" tabular>{value}</ThemedText>
                    <View style={[styles.cell, { backgroundColor: on ? tones.violet.soft : theme.backgroundElement, borderColor: on ? tones.violet.ink : theme.border }, on && styles.cellOn]}>
                      <ThemedText type="secondarySemiBold" tabular style={{ color: on ? tones.violet.ink : theme.text }}>{count}</ThemedText>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : null}

        {step.output ? (
          <>
            <ThemedText type="caption" themeColor="textSecondary">{t.outputTitle}</ThemedText>
            {bars(step.output, (index) => (step.outputFocus === index ? tones.red.solid : tones.mint.solid), (index) => (step.outputFocus === index ? '⇄' : step.output?.[index] !== null && step.output?.[index] !== undefined ? '✓' : ''))}
          </>
        ) : null}

        <Legend
          items={
            algorithm === 'heap'
              ? [{ label: t.legend.compare, tone: 'amber', marker: '●' }, { label: t.legend.moved, tone: 'red', marker: '⇄' }, { label: t.legend.heap, tone: 'indigo', marker: '' }, { label: t.legend.sorted, tone: 'mint', marker: '✓' }]
              : [{ label: t.legend.read, tone: 'violet', marker: '★' }, { label: t.legend.moved, tone: 'red', marker: '⇄' }, { label: t.legend.sorted, tone: 'mint', marker: '✓' }]
          }
        />
        <View style={styles.space}>
          <Tag text={t.spaceLabel} tone="violet" outlined />
          <ThemedText type="secondary" style={styles.fill}>{algorithm === 'heap' ? t.spaceNotes.heap : t.spaceNotes.counting(input.length, k)}</ThemedText>
        </View>
        <ThemedText type="secondary" themeColor="textSecondary">{t.notes[algorithm]}</ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: Spacing.three },
  stage: { gap: Spacing.two },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: GAP },
  barColumn: { alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  empty: { width: '100%', borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 4 },
  symbols: { flexDirection: 'row', gap: GAP, minHeight: 16 },
  symbol: { textAlign: 'center' },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  cellColumn: { width: 36, alignItems: 'center' },
  cell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  cellOn: { borderWidth: 3 },
  space: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  fill: { flex: 1 },
});
