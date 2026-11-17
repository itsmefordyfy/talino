import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, NumberAdjust, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildSteps, extractSteps, heapifyValues, heapSortSteps, idleStep, insertSteps, leftOf, levelOf, parentOf, randomValues, rightOf, START_VALUES, type HeapKind, type HeapRun, type HeapStep } from './heap';
import { heapStrings } from './heap-strings';

const NODE = 30;
const ROW = NODE + 18;
const WIDE = 520;
const CELL = 36;

type NodeState = 'plain' | 'compare' | 'swapped' | 'focus' | 'out';

function nodeState(step: HeapStep, index: number): NodeState {
  if (step.swapped?.includes(index)) return 'swapped';
  if (index >= step.size) return 'out';
  if (step.compare?.includes(index)) return 'compare';
  if (step.focus === index) return 'focus';
  return 'plain';
}

const MARKERS: Record<NodeState, string> = { plain: '', compare: '●', swapped: '⇄', focus: '★', out: '✓' };

export function HeapVisual({ compact }: VisualProps) {
  const t = useLocalized(heapStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [kind, setKind] = useState<HeapKind>('min');
  const [heap, setHeap] = useState<number[]>(() => heapifyValues(START_VALUES, 'min'));
  const [trace, setTrace] = useState<HeapStep[]>(() => [idleStep(heapifyValues(START_VALUES, 'min'), t.intro('min'))]);
  const [value, setValue] = useState(6);
  const [seed, setSeed] = useState(1);
  const stepper = useStepper(trace, { intervalMs: 900 });
  const step = stepper.step;

  const apply = (run: HeapRun) => {
    setHeap(run.result);
    setTrace(run.steps);
  };
  const changeKind = (next: HeapKind) => {
    const arranged = heapifyValues(heap, next);
    setKind(next);
    setHeap(arranged);
    setTrace([idleStep(arranged, t.switched(next))]);
  };
  const startOver = () => {
    const fresh = heapifyValues(START_VALUES, kind);
    setHeap(fresh);
    setTrace([idleStep(fresh, t.restarted(kind))]);
  };
  const build = () => {
    apply(buildSteps(randomValues(9, seed), kind, t));
    setSeed(seed + 1);
  };

  const wide = width >= WIDE;
  const treeWidth = wide ? Math.floor(width * 0.58) : width;
  const levels = Math.max(3, levelOf(Math.max(step.values.length, 1)) + 1);
  const treeHeight = levels * ROW;
  const point = (index: number) => {
    const level = levelOf(index);
    const count = 2 ** level;
    return { x: ((index + 1 - count + 0.5) / count) * treeWidth, y: level * ROW + NODE / 2 };
  };
  const toneFor = (state: NodeState): Tone => (state === 'compare' ? 'amber' : state === 'swapped' ? 'red' : state === 'focus' ? 'violet' : state === 'out' ? 'mint' : 'indigo');
  const heapIndexes = Array.from({ length: step.size }, (_, index) => index);

  const shown = step.focus ?? step.compare?.[0] ?? null;
  const relation = shown !== null && shown < step.size ? t.relation(shown, shown === 0 ? null : parentOf(shown), leftOf(shown) < step.size ? leftOf(shown) : null, rightOf(shown) < step.size ? rightOf(shown) : null) : null;

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.kindLabel} value={kind} onChange={changeKind} options={[{ value: 'min', label: t.kinds.min }, { value: 'max', label: t.kinds.max }]} />
          <NumberAdjust label={t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.insert} icon="add" onPress={() => apply(insertSteps(heap, value, kind, t))} />
            <Button size="small" variant="secondary" title={kind === 'min' ? t.buttons.extractMin : t.buttons.extractMax} icon="arrow_upward" onPress={() => apply(extractSteps(heap, kind, t))} />
            <Button size="small" variant="secondary" title={t.buttons.build} icon="shuffle" onPress={build} />
            <Button size="small" variant="outline" title={t.buttons.sort} icon="sort" onPress={() => apply(heapSortSteps(heap, kind, t))} />
            <Button size="small" variant="ghost" title={t.buttons.restart} icon="refresh" onPress={startOver} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout} accessible accessibilityLabel={t.stateLabel(step.values, step.size, kind)}>
        <View style={styles.counters}>
          <Tag text={`${t.comparisons}: ${step.comparisons}`} tone="amber" outlined />
          <Tag text={`${t.swaps}: ${step.swaps}`} tone="red" outlined />
          <Tag text={`${t.heapSize}: ${step.size}`} tone="indigo" outlined />
        </View>
        <View style={wide ? styles.wideRow : styles.column}>
          <View style={wide ? { width: treeWidth } : styles.section}>
            <ThemedText type="caption" themeColor="textSecondary">{t.treeTitle}</ThemedText>
            {step.size === 0 ? (
              <ThemedText type="secondary" themeColor="textSecondary">{t.emptyHint}</ThemedText>
            ) : (
              <View style={{ width: treeWidth, height: treeHeight }}>
                <Svg width={treeWidth} height={treeHeight} style={StyleSheet.absoluteFill}>
                  {heapIndexes.slice(1).map((index) => {
                    const from = point(parentOf(index));
                    const to = point(index);
                    const active = step.compare !== null && step.compare.includes(index) && step.compare.includes(parentOf(index));
                    return <Line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? tones.amber.ink : theme.textTertiary} strokeWidth={active ? 3 : 1.5} />;
                  })}
                </Svg>
                {heapIndexes.map((index) => {
                  const state = nodeState(step, index);
                  const tone = tones[toneFor(state)];
                  const p = point(index);
                  return (
                    <View key={index} style={[styles.nodeBox, { left: p.x - NODE / 2, top: p.y - NODE / 2 }]}>
                      <View style={[styles.node, { backgroundColor: tone.soft, borderColor: state === 'plain' ? theme.textTertiary : tone.ink }, state !== 'plain' && styles.nodeStrong]}>
                        <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>{step.values[index]}</ThemedText>
                      </View>
                      <ThemedText type="caption" themeColor="textSecondary" tabular>{index}</ThemedText>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View style={wide ? styles.arrayWide : styles.section}>
            <ThemedText type="caption" themeColor="textSecondary">{t.arrayTitle}</ThemedText>
            <View style={styles.cells}>
              {step.values.map((cell, index) => {
                const state = nodeState(step, index);
                const tone = tones[toneFor(state)];
                return (
                  <View key={index} style={styles.cellColumn}>
                    <ThemedText type="caption" themeColor="textSecondary" tabular>{index}</ThemedText>
                    <View style={[styles.cell, { backgroundColor: tone.soft, borderColor: state === 'plain' ? theme.border : tone.ink }, state !== 'plain' && styles.nodeStrong]}>
                      <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>{cell}</ThemedText>
                    </View>
                    <ThemedText type="caption" themeColor="textSecondary">{MARKERS[state] || ' '}</ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <Legend items={[{ label: t.legend.compare, tone: 'amber', marker: '●' }, { label: t.legend.swapped, tone: 'red', marker: '⇄' }, { label: t.legend.focus, tone: 'violet', marker: '★' }, { label: t.legend.out, tone: 'mint', marker: '✓' }]} />
        <ThemedText type="secondary" themeColor="textSecondary">{t.rule[kind]}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">{relation ?? t.relationRule}</ThemedText>
        <View style={styles.complexity}>
          <Tag text={t.complexityLabel} tone="violet" outlined />
          <ThemedText type="secondary" style={styles.fill}>{t.complexity[step.op]}</ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  column: { gap: Spacing.three },
  wideRow: { flexDirection: 'row', gap: Spacing.three },
  section: { gap: Spacing.one },
  fill: { flex: 1 },
  arrayWide: { flex: 1, gap: Spacing.one },
  nodeBox: { position: 'absolute', width: NODE, alignItems: 'center' },
  node: { width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 3 },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  cellColumn: { width: CELL, alignItems: 'center' },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  complexity: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
});
