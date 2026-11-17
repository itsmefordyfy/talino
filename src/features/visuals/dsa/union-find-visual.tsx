import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Polygon } from 'react-native-svg';

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
import { chainState, ELEMENTS, findSteps, forestLayout, heightOf, idleStep, initialState, setsOf, unionSteps, type UFCounters, type UFRun, type UFState, type UFStep } from './union-find';
import { unionFindStrings } from './union-find-strings';

const NODE = 28;
const ROW = 40;
const ARROW = 7;

type NodeState = 'rewired' | 'joined' | 'path' | 'root' | 'plain';
const toneFor: Record<NodeState, Tone> = { rewired: 'red', joined: 'mint', path: 'amber', root: 'violet', plain: 'neutral' };
const MARKERS: Record<NodeState, string> = { rewired: '⇄', joined: '+', path: '●', root: '★', plain: '' };

function nodeState(step: UFStep, index: number): NodeState {
  if (step.rewired.includes(index)) return 'rewired';
  if (step.linked?.[0] === index) return 'joined';
  if (step.path.includes(index) && step.parent[index] !== index) return 'path';
  if (step.parent[index] === index) return 'root';
  return 'plain';
}

export function UnionFindVisual({ compact }: VisualProps) {
  const t = useLocalized(unionFindStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [state, setState] = useState<UFState>(initialState);
  const [counters, setCounters] = useState<UFCounters>({ hops: 0, rewires: 0 });
  const [trace, setTrace] = useState<UFStep[]>(() => [idleStep(initialState(), t.intro)]);
  const [a, setA] = useState(0);
  const [b, setB] = useState(5);
  const [compress, setCompress] = useState<'on' | 'off'>('on');
  const [bySize, setBySize] = useState<'on' | 'off'>('on');
  const stepper = useStepper(trace, { intervalMs: 800 });
  const step = stepper.step;

  const options = { compress: compress === 'on', bySize: bySize === 'on' };
  const apply = (run: UFRun) => {
    setState(run.state);
    setCounters({ hops: run.hops, rewires: run.rewires });
    setTrace(run.steps);
  };
  const fresh = (next: UFState, caption: string) => {
    setState(next);
    setCounters({ hops: 0, rewires: 0 });
    setTrace([idleStep(next, caption)]);
  };

  const layout = forestLayout(step.parent);
  const levels = Math.max(...trace.map((s) => heightOf(s.parent))) + 1;
  const height = levels * ROW;
  const slot = width / Math.max(layout.slots, 1);
  const point = (index: number) => {
    const p = layout.points[index] ?? { x: 0, y: 0 };
    return { x: p.x * slot, y: p.y * ROW + NODE / 2 };
  };
  const sets = setsOf(step.parent);
  const elements = Array.from({ length: ELEMENTS }, (_, i) => i);

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <View style={styles.adjusts}>
            <NumberAdjust label={t.firstLabel} value={a} min={0} max={ELEMENTS - 1} onChange={setA} />
            <NumberAdjust label={t.secondLabel} value={b} min={0} max={ELEMENTS - 1} onChange={setB} />
          </View>
          <ChipSelect label={t.compressLabel} value={compress} onChange={setCompress} options={[{ value: 'on', label: t.on }, { value: 'off', label: t.off }]} />
          <ChipSelect label={t.sizeLabel} value={bySize} onChange={setBySize} options={[{ value: 'on', label: t.on }, { value: 'off', label: t.off }]} />
          <View style={styles.buttons}>
            <Button size="small" title={`${t.buttons.union} (${a}, ${b})`} icon="add" onPress={() => apply(unionSteps(state, a, b, options, counters, t))} />
            <Button size="small" variant="secondary" title={`${t.buttons.find} (${a})`} icon="search" onPress={() => apply(findSteps(state, a, options, counters, t))} />
            <Button size="small" variant="outline" title={t.buttons.chain} onPress={() => fresh(chainState(), t.chain)} />
            <Button size="small" variant="ghost" title={t.buttons.reset} icon="refresh" onPress={() => fresh(initialState(), t.fresh)} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={styles.counters}>
          <Tag text={`${t.counters.hops}: ${step.hops}`} tone="amber" outlined />
          <Tag text={`${t.counters.rewires}: ${step.rewires}`} tone="red" outlined />
          <Tag text={`${t.counters.sets}: ${sets.length}`} tone="violet" outlined />
          <Tag text={`${t.counters.height}: ${heightOf(step.parent)}`} tone="indigo" outlined />
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.forestTitle}</ThemedText>
        <View style={{ width, height }} accessible accessibilityLabel={t.forestLabel(sets, step.parent)}>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            {elements.map((child) => {
              const parent = step.parent[child] ?? child;
              if (parent === child) return null;
              const from = point(child);
              const to = point(parent);
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const length = Math.hypot(dx, dy) || 1;
              const ux = dx / length;
              const uy = dy / length;
              const tip = { x: to.x - ux * (NODE / 2 + 1), y: to.y - uy * (NODE / 2 + 1) };
              const left = { x: tip.x - ux * ARROW - uy * (ARROW / 2), y: tip.y - uy * ARROW + ux * (ARROW / 2) };
              const right = { x: tip.x - ux * ARROW + uy * (ARROW / 2), y: tip.y - uy * ARROW - ux * (ARROW / 2) };
              const color = step.rewired.includes(child) ? tones.red.ink : step.path.includes(child) && step.path.includes(parent) ? tones.amber.ink : theme.textTertiary;
              const strong = color !== theme.textTertiary;
              return (
                <G key={child}>
                  <Line x1={from.x} y1={from.y} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={strong ? 3 : 1.5} />
                  <Polygon points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`} fill={color} />
                </G>
              );
            })}
          </Svg>
          {elements.map((index) => {
            const p = point(index);
            const state2 = nodeState(step, index);
            const tone = tones[toneFor[state2]];
            return (
              <View key={index} accessible accessibilityLabel={`${index}, ${step.parent[index] === index ? t.rootLabel : `${t.parentLabel} ${step.parent[index]}`}`} style={[styles.node, { left: p.x - NODE / 2, top: p.y - NODE / 2, backgroundColor: tone.soft, borderColor: state2 === 'plain' ? theme.textTertiary : tone.ink }, state2 !== 'plain' && styles.nodeStrong]}>
                <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>{index}</ThemedText>
              </View>
            );
          })}
        </View>
        <Legend items={[{ label: t.legend.path, tone: 'amber', marker: '●' }, { label: t.legend.rewired, tone: 'red', marker: '⇄' }, { label: t.legend.root, tone: 'violet', marker: '★' }, { label: t.legend.linked, tone: 'mint', marker: '+' }]} />
        <ThemedText type="caption" themeColor="textSecondary">{t.arrayTitle}</ThemedText>
        <View style={styles.cells}>
          {elements.map((index) => {
            const state2 = nodeState(step, index);
            const tone = tones[toneFor[state2]];
            return (
              <View key={index} style={styles.cellColumn}>
                <ThemedText type="caption" themeColor="textSecondary" tabular>{index}</ThemedText>
                <View style={[styles.cell, { backgroundColor: tone.soft, borderColor: state2 === 'plain' ? theme.border : tone.ink }, state2 !== 'plain' && styles.nodeStrong]}>
                  <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>{step.parent[index]}</ThemedText>
                </View>
                <ThemedText type="caption" themeColor="textSecondary">{MARKERS[state2] || ' '}</ThemedText>
              </View>
            );
          })}
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.setsTitle}</ThemedText>
        <View style={styles.tags}>
          {sets.map((set) => (
            <Tag key={set[0]} text={`{${set.join(', ')}}`} mono tone="indigo" outlined />
          ))}
        </View>
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
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  node: { position: 'absolute', width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 3 },
  cells: { flexDirection: 'row', gap: Spacing.one },
  cellColumn: { flex: 1, minWidth: 0, alignItems: 'center' },
  cell: { width: '100%', height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  complexity: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  fill: { flex: 1 },
});
