import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, NumberAdjust, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildSortSteps, makeInput, parseCustom, SORT_ALGORITHMS, type InputPattern, type SortAlgorithm } from './sorting';
import { dsaStrings } from './strings';

const BAR_AREA = 150;
const GAP = 3;

export function SortingVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).sorting;
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [pattern, setPattern] = useState<InputPattern>('random');
  const [size, setSize] = useState(8);
  const [seed, setSeed] = useState(1);
  const [custom, setCustom] = useState('5, 2, 9, 1, 7');

  const parsed = pattern === 'custom' ? parseCustom(custom) : null;
  const input = pattern === 'custom' ? (parsed ?? [5, 2, 9, 1, 7]) : makeInput(pattern, size, seed);
  const run = buildSortSteps(algorithm, input, t);
  const stepper = useStepper(run.steps, { intervalMs: 450 });
  const step = stepper.step;
  const max = Math.max(...input, 1);
  const barWidth = Math.max(6, (width - GAP * (input.length - 1)) / input.length);
  const showValues = barWidth >= 17;
  const moveLabel = run.moveKind === 'swaps' ? t.swaps : t.writes;

  const colorFor = (index: number) => {
    if (step.moved.includes(index)) return tones.red.solid;
    if (step.compare.includes(index)) return tones.amber.solid;
    if (step.pivot === index) return tones.violet.solid;
    if (step.sorted.includes(index)) return tones.mint.solid;
    return tones.indigo.solid;
  };
  const symbolFor = (index: number) => (step.moved.includes(index) ? '⇄' : step.compare.includes(index) ? '●' : step.pivot === index ? '★' : step.sorted.includes(index) ? '✓' : '');

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.algorithmLabel} value={algorithm} onChange={setAlgorithm} options={SORT_ALGORITHMS.map((value) => ({ value, label: t.algorithms[value] }))} />
          <ChipSelect label={t.patternLabel} value={pattern} onChange={setPattern} options={(['random', 'nearly', 'sorted', 'reversed', 'custom'] as const).map((value) => ({ value, label: t.patterns[value] }))} />
          {pattern === 'custom' ? (
            <TextField label={t.customLabel} value={custom} onChangeText={setCustom} keyboardType="numbers-and-punctuation" error={parsed ? null : t.customError} />
          ) : (
            <View style={styles.row}>
              <NumberAdjust label={t.sizeLabel} value={size} min={4} max={16} onChange={setSize} />
              {pattern === 'random' || pattern === 'nearly' ? <Button title={t.shuffle} icon="shuffle" size="small" variant="secondary" onPress={() => setSeed(seed + 1)} /> : null}
            </View>
          )}
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.counters}>
          <Tag text={`${t.comparisons}: ${step.comparisons}`} tone="amber" outlined />
          <Tag text={`${moveLabel}: ${step.moves}`} tone="red" outlined />
        </View>
        <View onLayout={onLayout} accessible accessibilityLabel={t.barsLabel(step.values)}>
          <View style={[styles.bars, { height: BAR_AREA }]}>
            {step.values.map((value, index) => {
              const inRange = step.range === null || (index >= step.range[0] && index <= step.range[1]);
              return (
                <View key={index} style={[styles.barColumn, { width: barWidth }, !inRange && styles.outside]}>
                  {showValues ? (
                    <ThemedText type="caption" tabular>
                      {value}
                    </ThemedText>
                  ) : null}
                  <View style={[styles.bar, { height: Math.max(6, ((BAR_AREA - 18) * value) / max), backgroundColor: colorFor(index) }]} />
                </View>
              );
            })}
          </View>
          <View style={styles.symbols}>
            {step.values.map((_, index) => (
              <ThemedText key={index} type="caption" themeColor="textSecondary" style={[styles.symbol, { width: barWidth }]}>
                {symbolFor(index)}
              </ThemedText>
            ))}
          </View>
        </View>
        <Legend
          items={[
            { label: t.legend.compare, tone: 'amber', marker: '●' },
            { label: t.legend.moved, tone: 'red', marker: '⇄' },
            { label: t.legend.sorted, tone: 'mint', marker: '✓' },
            ...(algorithm === 'quick' || algorithm === 'selection' ? [{ label: t.legend.pivot, tone: 'violet' as const, marker: '★' }] : []),
          ]}
        />
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.notes[algorithm]}
        </ThemedText>
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
  outside: { opacity: 0.45 },
  symbols: { flexDirection: 'row', gap: GAP, minHeight: 16 },
  symbol: { textAlign: 'center' },
});
