import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildTree, deleteSteps, heightOf, insertSteps, layoutTree, searchSteps, traversalSteps, traverse, TRAVERSALS, type Traversal, type TreeStep } from './bst';
import { dsaStrings } from './strings';

const LEVEL = 46;
const NODE = 30;
const START = buildTree([50, 30, 70, 20, 40, 60, 80]);

export function BstVisual({ compact }: VisualProps) {
  const t = useLocalized(dsaStrings).bst;
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [trace, setTrace] = useState<TreeStep[]>(() => [{ root: START, visited: [], current: null, found: null, fresh: null, doomed: null, output: null, queue: null, caption: dsaStrings.en.bst.intro }]);
  const [value, setValue] = useState(65);
  const stepper = useStepper(trace, { intervalMs: 1000 });
  const step = stepper.step;
  const settled = trace[trace.length - 1]?.root ?? null;

  const placed = layoutTree(step.root);
  const count = Math.max(placed.length, 1);
  const spacing = Math.min(46, width / count);
  const offset = (width - spacing * count) / 2;
  const depth = heightOf(step.root);
  const at = new Map(placed.map((node) => [node.value, { x: offset + spacing * (node.column + 0.5), y: NODE / 2 + node.depth * LEVEL }]));
  const inOrder = traverse(step.root, 'inorder');

  const colorFor = (nodeValue: number) => {
    if (step.doomed === nodeValue) return { tone: tones.red, strong: true };
    if (step.found === nodeValue) return { tone: tones.mint, strong: true };
    if (step.fresh === nodeValue) return { tone: tones.violet, strong: true };
    if (step.current === nodeValue) return { tone: tones.amber, strong: true };
    if (step.visited.includes(nodeValue)) return { tone: tones.amber, strong: false };
    return { tone: tones.neutral, strong: false };
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <NumberAdjust label={t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.insert} icon="add" onPress={() => setTrace(insertSteps(settled, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.search} icon="search" onPress={() => setTrace(searchSteps(settled, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.delete} onPress={() => setTrace(deleteSteps(settled, value, t))} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={() => setTrace([{ root: START, visited: [], current: null, found: null, fresh: null, doomed: null, output: null, queue: null, caption: t.intro }])} />
            <Button size="small" variant="ghost" title={t.buttons.clear} onPress={() => setTrace([{ root: null, visited: [], current: null, found: null, fresh: null, doomed: null, output: null, queue: null, caption: t.emptyHint }])} />
          </View>
          <ChipSelect<Traversal> label={t.traversalLabel} wrap value={null} onChange={(kind) => setTrace(traversalSteps(settled, kind, t))} options={TRAVERSALS.map((kind) => ({ value: kind, label: t.traversalNames[kind] }))} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        {step.root === null ? (
          <ThemedText type="secondary" themeColor="textSecondary">{t.emptyHint}</ThemedText>
        ) : (
          <View style={{ height: NODE + Math.max(depth - 1, 0) * LEVEL, width }} accessible accessibilityLabel={t.treeLabel(inOrder, depth)}>
            <Svg width={width} height={NODE + Math.max(depth - 1, 0) * LEVEL} style={StyleSheet.absoluteFill}>
              {placed.map((node) => {
                const from = node.parent === null ? undefined : at.get(node.parent);
                const to = at.get(node.value);
                return from && to ? <Line key={node.value} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={theme.textTertiary} strokeWidth={1.5} /> : null;
              })}
            </Svg>
            {placed.map((node) => {
              const point = at.get(node.value);
              if (!point) return null;
              const { tone, strong } = colorFor(node.value);
              return (
                <View key={node.value} style={[styles.node, { left: point.x - NODE / 2, top: point.y - NODE / 2, backgroundColor: tone.soft, borderColor: strong ? tone.ink : theme.textTertiary }, strong && styles.nodeStrong]}>
                  <ThemedText type="caption" tabular style={{ color: tone.ink }}>{node.value}</ThemedText>
                </View>
              );
            })}
          </View>
        )}
        {step.output !== null ? (
          <View style={styles.outRow}>
            <ThemedText type="caption" themeColor="textSecondary">{t.outputLabel}</ThemedText>
            <ThemedText type="codeInline" tabular>{step.output.length === 0 ? t.none : step.output.join(', ')}</ThemedText>
          </View>
        ) : null}
        {step.queue !== null ? (
          <View style={styles.outRow}>
            <ThemedText type="caption" themeColor="textSecondary">{t.queueLabel}</ThemedText>
            <View style={styles.tags}>
              {step.queue.length === 0 ? <ThemedText type="codeInline">{t.none}</ThemedText> : step.queue.map((item) => <Tag key={item} text={String(item)} mono tone="indigo" />)}
            </View>
          </View>
        ) : null}
        <ThemedText type="caption" themeColor="textSecondary">{t.legend}</ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  node: { position: 'absolute', width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  nodeStrong: { borderWidth: 3 },
  outRow: { gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
});
