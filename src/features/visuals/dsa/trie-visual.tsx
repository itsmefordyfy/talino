import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, PlayControls, Tag, useMeasuredWidth } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { buildTrie, cleanWord, depthOf, idleStep, insertSteps, layoutTrie, leafCount, MAX_WORDS, MAX_WORD_LENGTH, prefixSteps, searchSteps, START_WORDS, wordsOf, type TrieStep } from './trie';
import { trieStrings } from './trie-strings';

const LEVEL = 46;
const NODE = 28;
const MIN_SPACING = NODE + 6;
const PRESETS = ['pa', 'pen', 'ca', 'paste', 'tab'];

export function TrieVisual({ compact }: VisualProps) {
  const t = useLocalized(trieStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [trace, setTrace] = useState<TrieStep[]>(() => [idleStep(buildTrie(START_WORDS), trieStrings.en.intro(START_WORDS.length))]);
  const [text, setText] = useState('pa');
  const stepper = useStepper(trace, { intervalMs: 900 });
  const step = stepper.step;
  const settled = trace[trace.length - 1]?.root ?? step.root;
  const word = cleanWord(text);

  const placed = layoutTrie(step.root);
  const leaves = leafCount(step.root);
  const canvas = Math.max(width, leaves * MIN_SPACING);
  const spacing = canvas / leaves;
  const height = NODE + depthOf(step.root) * LEVEL;
  const at = new Map(placed.map((node) => [node.id, { x: spacing * (node.x + 0.5), y: NODE / 2 + node.depth * LEVEL }]));
  const words = wordsOf(step.root);

  const look = (id: string): { tone: Tone; strong: boolean } => {
    if (step.found === id) return { tone: 'mint', strong: true };
    if (step.fresh.includes(id)) return { tone: 'violet', strong: true };
    if (step.current === id) return { tone: 'amber', strong: true };
    if (step.collected.includes(id)) return { tone: 'indigo', strong: false };
    if (step.path.includes(id)) return { tone: 'amber', strong: false };
    return { tone: 'neutral', strong: false };
  };

  const tree = (
    <View style={{ width: canvas, height }}>
      <Svg width={canvas} height={height} style={StyleSheet.absoluteFill}>
        {placed.map((node) => {
          const from = node.parent === null ? undefined : at.get(node.parent);
          const to = at.get(node.id);
          const onPath = step.path.includes(node.id) && node.parent !== null && step.path.includes(node.parent);
          return from && to ? <Line key={node.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={onPath ? tones.amber.ink : theme.textTertiary} strokeWidth={onPath ? 2.5 : 1.5} /> : null;
        })}
      </Svg>
      {placed.map((node) => {
        const point = at.get(node.id);
        if (!point) return null;
        const { tone, strong } = look(node.id);
        const colors = tones[tone];
        return (
          <View
            key={node.id}
            style={[styles.node, { left: point.x - NODE / 2, top: point.y - NODE / 2, backgroundColor: colors.soft, borderColor: strong ? colors.ink : theme.textTertiary }, node.end ? styles.endNode : styles.plainNode, strong && styles.nodeStrong]}>
            <ThemedText type="caption" style={{ color: colors.ink }}>{node.parent === null ? '•' : node.ch}</ThemedText>
          </View>
        );
      })}
    </View>
  );

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <TextField label={t.wordLabel} value={text} onChangeText={(next) => setText(cleanWord(next))} maxLength={MAX_WORD_LENGTH} autoCapitalize="none" autoCorrect={false} />
          <ChipSelect<string> label={t.presetsLabel} wrap value={PRESETS.includes(text) ? text : null} onChange={setText} options={PRESETS.map((preset) => ({ value: preset, label: preset }))} />
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.insert} icon="add" disabled={word === ''} onPress={() => setTrace(insertSteps(settled, word, t))} />
            <Button size="small" variant="secondary" title={t.buttons.search} icon="search" disabled={word === ''} onPress={() => setTrace(searchSteps(settled, word, t))} />
            <Button size="small" variant="secondary" title={t.buttons.prefix} disabled={word === ''} onPress={() => setTrace(prefixSteps(settled, word, t))} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={() => setTrace([idleStep(buildTrie(START_WORDS), t.intro(START_WORDS.length))])} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View accessible accessibilityLabel={t.treeLabel(words)}>
          {canvas > width ? (
            <ScrollView horizontal showsHorizontalScrollIndicator>{tree}</ScrollView>
          ) : (
            tree
          )}
        </View>
        <View style={styles.counters}>
          <Tag text={`${t.operationLabel}: ${step.operation ? t.operationNames[step.operation] : t.noOperation}`} tone={step.refused ? 'red' : 'indigo'} outlined />
          <Tag text={t.visited(step.visited)} tone="amber" mono />
          <Tag text={t.created(step.created)} tone="violet" mono />
          <Tag text={t.stored(words.length, MAX_WORDS)} tone="neutral" mono />
        </View>
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">{t.suggestionsLabel}</ThemedText>
          {step.suggestions.length > 0 ? (
            <View style={styles.tags}>
              {step.suggestions.map((suggestion) => <Tag key={suggestion} text={suggestion} mono tone="indigo" outlined />)}
            </View>
          ) : (
            <ThemedText type="caption" themeColor="textTertiary">{step.noMatch ? t.noSuggestions : t.suggestionsEmpty}</ThemedText>
          )}
        </View>
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary">{t.complexityLabel}</ThemedText>
          <ThemedText type="secondarySemiBold">{t.complexity}</ThemedText>
        </View>
        {!compact ? (
          <Legend
            items={[
              { label: t.legend.path, tone: 'amber', marker: '●' },
              { label: t.legend.fresh, tone: 'violet', marker: '+' },
              { label: t.legend.found, tone: 'mint', marker: '✓' },
              { label: t.legend.endOfWord, tone: 'neutral', marker: '■' },
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
  stage: { gap: Spacing.three },
  node: { position: 'absolute', width: NODE, height: NODE, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  plainNode: { borderRadius: NODE / 2 },
  endNode: { borderRadius: Radius.small / 2 },
  nodeStrong: { borderWidth: 3 },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  block: { gap: Spacing.one },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
});
