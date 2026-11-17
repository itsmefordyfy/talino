import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Polygon } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { dijkstraSteps, topoSteps, tasksGraph, WEIGHTED, type DijkstraStep, type PathGraph, type TopoStep } from './graph-paths';
import { graphPathsStrings } from './graph-paths-strings';

const HEIGHT = 210;
const NODE = 34;
const PAD = NODE / 2 + 4;
const ARROW = 9;

type Mode = 'dijkstra' | 'topo';
type NodeState = 'current' | 'settled' | 'path' | 'ready' | 'stuck' | 'waiting';

const infinity = '∞';

export function GraphPathsVisual({ compact }: VisualProps) {
  const t = useLocalized(graphPathsStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [mode, setMode] = useState<Mode>('dijkstra');
  const [start, setStart] = useState('A');
  const [target, setTarget] = useState('G');
  const [loop, setLoop] = useState<'off' | 'on'>('off');

  const graph: PathGraph = mode === 'dijkstra' ? WEIGHTED : tasksGraph(loop === 'on');
  const directed = mode === 'topo';
  const dijkstra = mode === 'dijkstra' ? dijkstraSteps(WEIGHTED, start, target, t) : null;
  const topo = mode === 'topo' ? topoSteps(graph, t) : null;
  const steps: readonly (DijkstraStep | TopoStep)[] = dijkstra?.steps ?? topo?.steps ?? [];
  const stepper = useStepper(steps, { intervalMs: 1100 });
  const step = stepper.step;
  const dStep = dijkstra ? dijkstra.steps[stepper.index] : null;
  const kStep = topo ? topo.steps[stepper.index] : null;

  const pos = new Map(graph.nodes.map((node) => [node.id, { x: PAD + node.x * (width - 2 * PAD), y: PAD + node.y * (HEIGHT - 2 * PAD) }]));
  const indexOf = (id: string) => graph.nodes.findIndex((node) => node.id === id);

  const stateOf = (id: string): NodeState => {
    if (dStep) {
      if (dStep.current === id) return 'current';
      if (dStep.path.includes(id)) return 'path';
      if (dStep.settled.includes(id)) return 'settled';
      return dStep.dist[indexOf(id)] !== null ? 'ready' : 'waiting';
    }
    if (kStep) {
      if (kStep.leftover.includes(id)) return 'stuck';
      if (kStep.current === id) return 'current';
      if (kStep.order.includes(id)) return 'settled';
      return kStep.queue.includes(id) ? 'ready' : 'waiting';
    }
    return 'waiting';
  };
  const toneFor: Record<NodeState, Tone> = { current: 'amber', settled: 'mint', path: 'violet', ready: 'indigo', stuck: 'red', waiting: 'neutral' };

  const onPath = (a: string, b: string) => {
    const path = dStep?.path ?? [];
    for (let i = 0; i + 1 < path.length; i += 1) if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) return true;
    return false;
  };
  const isPrev = (a: string, b: string) => dStep !== null && dStep !== undefined && (dStep.prev[indexOf(b)] === a || dStep.prev[indexOf(a)] === b);

  const edgeLook = (from: string, to: string) => {
    if (dStep) {
      const checked = dStep.edge !== null && ((dStep.edge.from === from && dStep.edge.to === to) || (dStep.edge.from === to && dStep.edge.to === from));
      if (checked) return { color: tones.amber.ink, width: 4, dash: dStep.edge?.improved ? undefined : '5 4' };
      if (onPath(from, to)) return { color: tones.violet.ink, width: 4, dash: undefined };
      if (isPrev(from, to)) return { color: tones.mint.ink, width: 2.5, dash: undefined };
    }
    if (kStep) {
      const active = kStep.edge !== null && kStep.edge[0] === from && kStep.edge[1] === to;
      if (active) return { color: tones.amber.ink, width: 4, dash: undefined };
      if (kStep.stuck && kStep.leftover.includes(from) && kStep.leftover.includes(to)) return { color: tones.red.ink, width: 3, dash: undefined };
      if (kStep.cleared.includes(`${from}>${to}`)) return { color: theme.border, width: 1.5, dash: '4 4' };
    }
    return { color: theme.textTertiary, width: 1.5, dash: undefined };
  };

  const legend =
    mode === 'dijkstra'
      ? [{ label: t.legend.current, tone: 'amber' as const, marker: '●' }, { label: t.legend.settled, tone: 'mint' as const, marker: '✓' }, { label: t.legend.path, tone: 'violet' as const, marker: '★' }]
      : [{ label: t.legend.current, tone: 'amber' as const, marker: '●' }, { label: t.legend.settled, tone: 'mint' as const, marker: '✓' }, { label: t.legend.ready, tone: 'indigo' as const, marker: '…' }, { label: t.legend.stuck, tone: 'red' as const, marker: '✕' }];
  const nodeOptions = graph.nodes.map((node) => ({ value: node.id, label: node.id }));
  const modeName = t.modes[mode];

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step?.caption ?? ''}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.modeLabel} value={mode} onChange={setMode} options={[{ value: 'dijkstra', label: t.modes.dijkstra }, { value: 'topo', label: t.modes.topo }]} />
          {mode === 'dijkstra' ? (
            <>
              <ChipSelect label={t.startLabel} value={start} onChange={setStart} options={nodeOptions} />
              <ChipSelect label={t.targetLabel} value={target} onChange={setTarget} options={nodeOptions} />
            </>
          ) : (
            <ChipSelect label={t.cycleLabel} value={loop} onChange={setLoop} options={[{ value: 'off', label: t.cycleOptions.off }, { value: 'on', label: t.cycleOptions.on }]} />
          )}
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={styles.counters}>
          {dStep ? (
            <>
              <Tag text={`${t.counters.settled}: ${dStep.settledCount}`} tone="mint" outlined />
              <Tag text={`${t.counters.relaxations}: ${dStep.relaxations}`} tone="amber" outlined />
              <Tag text={`${t.counters.updates}: ${dStep.updates}`} tone="violet" outlined />
            </>
          ) : kStep ? (
            <>
              <Tag text={`${t.counters.taken}: ${kStep.order.length}`} tone="mint" outlined />
              <Tag text={`${t.counters.removed}: ${kStep.clearedCount}`} tone="amber" outlined />
            </>
          ) : null}
        </View>
        <View style={{ width, height: HEIGHT }} accessible accessibilityLabel={t.graphDescription(modeName, graph.nodes.length, graph.edges.length)}>
          <Svg width={width} height={HEIGHT} style={StyleSheet.absoluteFill}>
            {graph.edges.map((edge) => {
              const from = pos.get(edge.from);
              const to = pos.get(edge.to);
              if (!from || !to) return null;
              const look = edgeLook(edge.from, edge.to);
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const length = Math.hypot(dx, dy) || 1;
              const ux = dx / length;
              const uy = dy / length;
              const tip = { x: to.x - ux * (NODE / 2 + 2), y: to.y - uy * (NODE / 2 + 2) };
              const left = { x: tip.x - ux * ARROW - uy * (ARROW / 2), y: tip.y - uy * ARROW + ux * (ARROW / 2) };
              const right = { x: tip.x - ux * ARROW + uy * (ARROW / 2), y: tip.y - uy * ARROW - ux * (ARROW / 2) };
              return (
                <G key={`${edge.from}${edge.to}`}>
                  <Line x1={from.x} y1={from.y} x2={directed ? tip.x : to.x} y2={directed ? tip.y : to.y} stroke={look.color} strokeWidth={look.width} strokeDasharray={look.dash} />
                  {directed ? <Polygon points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`} fill={look.color} /> : null}
                </G>
              );
            })}
          </Svg>
          {!directed
            ? graph.edges.map((edge) => {
                const from = pos.get(edge.from);
                const to = pos.get(edge.to);
                if (!from || !to) return null;
                const checked = dStep?.edge !== null && dStep?.edge !== undefined && ((dStep.edge.from === edge.from && dStep.edge.to === edge.to) || (dStep.edge.from === edge.to && dStep.edge.to === edge.from));
                return (
                  <View key={`w${edge.from}${edge.to}`} accessible accessibilityLabel={t.edgeLabel(edge.from, edge.to, edge.w)} style={[styles.weight, { left: (from.x + to.x) / 2 - 11, top: (from.y + to.y) / 2 - 10, backgroundColor: checked ? tones.amber.soft : theme.backgroundElement, borderColor: checked ? tones.amber.ink : theme.border }]}>
                    <ThemedText type="caption" tabular style={{ color: checked ? tones.amber.ink : theme.text }}>{edge.w}</ThemedText>
                  </View>
                );
              })
            : null}
          {graph.nodes.map((node) => {
            const point = pos.get(node.id);
            if (!point) return null;
            const state = stateOf(node.id);
            const tone = tones[toneFor[state]];
            const dist = dStep ? dStep.dist[indexOf(node.id)] ?? null : null;
            return (
              <View key={node.id} accessible accessibilityLabel={t.nodeState(node.id, t.states[state], dist)} style={[styles.node, { left: point.x - NODE / 2, top: point.y - NODE / 2, backgroundColor: tone.soft, borderColor: state === 'waiting' ? theme.textTertiary : tone.ink }, state !== 'waiting' && styles.nodeStrong]}>
                <ThemedText type="secondarySemiBold" style={{ color: tone.ink }}>{node.id}</ThemedText>
              </View>
            );
          })}
        </View>
        <Legend items={legend} />

        {dStep ? (
          <View style={styles.table} accessible accessibilityLabel={graph.nodes.map((node, i) => `${node.id}: ${t.distLabel} ${dStep.dist[i] ?? infinity}, ${t.viaLabel} ${dStep.prev[i] ?? t.none}`).join('. ')}>
            <ThemedText type="caption" themeColor="textSecondary">{t.tableHint}</ThemedText>
            <View style={styles.tableBody}>
              {graph.nodes.map((node, i) => {
                const state = stateOf(node.id);
                const tone = tones[toneFor[state]];
                return (
                  <View key={node.id} style={[styles.column, { backgroundColor: tone.soft, borderColor: state === 'waiting' ? theme.border : tone.ink }]}>
                    <ThemedText type="secondarySemiBold" style={{ color: tone.ink }}>{node.id}</ThemedText>
                    <ThemedText type="secondarySemiBold" tabular>{dStep.dist[i] ?? infinity}</ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary">{dStep.prev[i] ?? '–'}</ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {kStep ? (
          <>
            <View style={styles.table} accessible accessibilityLabel={graph.nodes.map((node, i) => `${node.id}: ${t.indegreeLabel} ${kStep.indegree[i]}`).join('. ')}>
              <ThemedText type="caption" themeColor="textSecondary">{t.indegreeLabel}</ThemedText>
              <View style={styles.tableBody}>
                {graph.nodes.map((node, i) => {
                  const state = stateOf(node.id);
                  const tone = tones[toneFor[state]];
                  return (
                    <View key={node.id} style={[styles.column, { backgroundColor: tone.soft, borderColor: state === 'waiting' ? theme.border : tone.ink }]}>
                      <ThemedText type="secondarySemiBold" style={{ color: tone.ink }}>{node.id}</ThemedText>
                      <ThemedText type="secondarySemiBold" tabular>{kStep.indegree[i]}</ThemedText>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.listRow}>
              <ThemedText type="caption" themeColor="textSecondary">{t.queueLabel}</ThemedText>
              <View style={styles.tags}>
                {kStep.queue.length === 0 ? <ThemedText type="codeInline">{t.none}</ThemedText> : kStep.queue.map((id, index) => <Tag key={id} text={id} mono tone="indigo" outlined={index === 0} marker={index === 0 ? '▶' : undefined} />)}
              </View>
            </View>
            <View style={styles.listRow}>
              <ThemedText type="caption" themeColor="textSecondary">{t.orderLabel}</ThemedText>
              <ThemedText type="codeInline">{kStep.order.length === 0 ? t.none : kStep.order.join(' → ')}</ThemedText>
            </View>
            {kStep.stuck ? (
              <View style={styles.listRow}>
                <ThemedText type="caption" themeColor="textSecondary">{t.leftoverLabel}</ThemedText>
                <View style={styles.tags}>{kStep.leftover.map((id) => <Tag key={id} text={id} mono tone="red" outlined marker="✕" />)}</View>
              </View>
            ) : null}
          </>
        ) : null}
        {dStep && dStep.path.length > 0 ? (
          <View style={styles.listRow}>
            <ThemedText type="caption" themeColor="textSecondary">{t.legend.path}</ThemedText>
            <ThemedText type="codeInline">{dStep.path.join(' → ')}</ThemedText>
          </View>
        ) : null}
        <View style={styles.complexity}>
          <Tag text={t.complexityLabel} tone="violet" outlined />
          <ThemedText type="secondary" style={styles.fill}>{t.complexity[mode]}</ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  stage: { gap: Spacing.two },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  node: { position: 'absolute', width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 3 },
  weight: { position: 'absolute', minWidth: 22, height: 20, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, borderWidth: 1 },
  table: { gap: Spacing.one },
  tableBody: { flexDirection: 'row', gap: Spacing.one },
  column: { flex: 1, minWidth: 0, alignItems: 'center', paddingVertical: Spacing.one, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  listRow: { gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  complexity: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  fill: { flex: 1 },
});
