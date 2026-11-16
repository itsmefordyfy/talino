import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { GRAPHS, graphSteps, type GraphAlgorithm } from './graph';
import { dsaStrings } from './strings';

const HEIGHT = 190;
const NODE = 34;
const PAD = NODE / 2 + 2;

export function GraphVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).graph;
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [graphIndex, setGraphIndex] = useState(0);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs');
  const [start, setStart] = useState('A');
  const graph = GRAPHS[graphIndex] ?? GRAPHS[0]!;
  const safeStart = graph.nodes.some((node) => node.id === start) ? start : 'A';
  const steps = graphSteps(algorithm, graph, safeStart, t);
  const stepper = useStepper(steps, { intervalMs: 1000 });
  const step = stepper.step;
  const pos = new Map(graph.nodes.map((node) => [node.id, { x: PAD + node.x * (width - 2 * PAD), y: PAD + node.y * (HEIGHT - 2 * PAD) }]));
  const finished = step.order.filter((id) => id !== step.current);

  const status = (id: string) => (step.current === id ? 'current' : finished.includes(id) ? 'done' : step.frontier.includes(id) ? 'waiting' : 'unseen');
  const toneFor = { current: tones.amber, done: tones.mint, waiting: tones.indigo, unseen: tones.neutral } as const;

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.graphLabel} value={graph.id} onChange={(id) => setGraphIndex(GRAPHS.findIndex((entry) => entry.id === id))} options={GRAPHS.map((entry) => ({ value: entry.id, label: t.graphNames[entry.id] }))} />
          <ChipSelect label={t.algorithmLabel} value={algorithm} onChange={setAlgorithm} options={[{ value: 'bfs', label: t.algorithms.bfs }, { value: 'dfs', label: t.algorithms.dfs }]} />
          <ChipSelect label={t.startLabel} value={safeStart} onChange={setStart} options={graph.nodes.map((node) => ({ value: node.id, label: node.id }))} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={{ width, height: HEIGHT }} accessible accessibilityLabel={t.graphDescription(graph.nodes.length, graph.edges.length, t.algorithms[algorithm])}>
          <Svg width={width} height={HEIGHT} style={StyleSheet.absoluteFill}>
            {graph.edges.map(([a, b]) => {
              const from = pos.get(a);
              const to = pos.get(b);
              if (!from || !to) return null;
              const active = step.edge !== null && ((step.edge[0] === a && step.edge[1] === b) || (step.edge[0] === b && step.edge[1] === a));
              return <Line key={`${a}${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? tones.amber.ink : theme.textTertiary} strokeWidth={active ? 4 : 1.5} />;
            })}
          </Svg>
          {graph.nodes.map((node) => {
            const point = pos.get(node.id);
            if (!point) return null;
            const state = status(node.id);
            const tone = toneFor[state];
            return (
              <View key={node.id} accessible accessibilityLabel={t.nodeLabel(node.id, t.statusLegend[state])} style={[styles.node, { left: point.x - NODE / 2, top: point.y - NODE / 2, backgroundColor: tone.soft, borderColor: state === 'unseen' ? theme.textTertiary : tone.ink }, state !== 'unseen' && styles.nodeStrong]}>
                <ThemedText type="secondarySemiBold" style={{ color: tone.ink }}>{node.id}</ThemedText>
              </View>
            );
          })}
        </View>
        <Legend items={[{ label: t.statusLegend.current, tone: 'amber', marker: '●' }, { label: t.statusLegend.done, tone: 'mint', marker: '✓' }, { label: t.statusLegend.waiting, tone: 'indigo', marker: '…' }]} />
        <View style={styles.listRow}>
          <ThemedText type="caption" themeColor="textSecondary">{t.frontierLabel[algorithm]}</ThemedText>
          <View style={styles.tags}>
            {step.frontier.length === 0 ? <ThemedText type="codeInline">{t.none}</ThemedText> : step.frontier.map((id, index) => <Tag key={`${id}-${index}`} text={id} mono tone="indigo" outlined={index === 0} marker={index === 0 ? '▶' : undefined} />)}
          </View>
        </View>
        <View style={styles.listRow}>
          <ThemedText type="caption" themeColor="textSecondary">{t.orderLabel}</ThemedText>
          <ThemedText type="codeInline">{step.order.length === 0 ? t.none : step.order.join(' → ')}</ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two },
  node: { position: 'absolute', width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 3 },
  listRow: { gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
});
