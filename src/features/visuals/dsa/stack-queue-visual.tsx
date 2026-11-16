import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { applyQueueOp, applyStackOp, type LinearOp } from './stack-queue';
import { dsaStrings } from './strings';

type Kind = 'stack' | 'queue';

function LinearVisual({ kind, compact }: VisualProps & { kind: Kind }) {
  const strings = useLocalized(dsaStrings);
  const t = strings[kind];
  const theme = useTheme();
  const tones = useTones();
  const [items, setItems] = useState<number[]>([4, 9]);
  const [taken, setTaken] = useState<number[]>([]);
  const [marked, setMarked] = useState<number | null>(null);
  const [value, setValue] = useState(7);
  const [caption, setCaption] = useState(t.intro);
  const [failed, setFailed] = useState(false);

  const run = (op: LinearOp) => {
    const outcome = kind === 'stack' ? applyStackOp(items, op, strings.stack) : applyQueueOp(items, op, strings.queue);
    setItems(outcome.items);
    setMarked(outcome.marked);
    if (outcome.taken !== null) setTaken([...taken, outcome.taken]);
    setCaption(outcome.caption);
    setFailed(!outcome.ok);
  };
  const reset = () => {
    setItems([4, 9]);
    setTaken([]);
    setMarked(null);
    setCaption(t.intro);
    setFailed(false);
  };

  const label = kind === 'stack' ? (t as typeof strings.stack).lifoLabel : (t as typeof strings.queue).fifoLabel;
  const cellFor = (item: number, position: number, edge: string | null) => {
    const on = marked === position;
    return (
      <View key={`${position}-${item}`} accessible accessibilityLabel={edge ? `${item}, ${edge}` : String(item)} style={[styles.cell, { backgroundColor: on ? tones.violet.soft : theme.backgroundElement, borderColor: on || edge ? tones.violet.ink : theme.border }, on && styles.cellOn]}>
        <ThemedText type="statSmall" tabular style={{ color: on ? tones.violet.ink : theme.text }}>{item}</ThemedText>
        {edge ? <ThemedText type="caption" themeColor="primary">{edge}</ThemedText> : null}
      </View>
    );
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          <NumberAdjust label={t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.add} icon="add" onPress={() => run({ kind: 'add', value })} />
            <Button size="small" variant="secondary" title={t.buttons.remove} icon="remove" onPress={() => run({ kind: 'remove' })} />
            <Button size="small" variant="outline" title={t.buttons.peek} icon="visibility" onPress={() => run({ kind: 'peek' })} />
            <Button size="small" variant="ghost" title={t.buttons.reset} icon="refresh" onPress={reset} />
          </View>
        </View>
      }>
      <View style={styles.stage} accessible accessibilityLabel={t.listLabel(items)}>
        <Tag text={label} tone={failed ? 'red' : 'violet'} outlined />
        {items.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">{t.emptyHint}</ThemedText>
        ) : kind === 'stack' ? (
          <View style={styles.column}>
            {[...items].reverse().map((item, reversed) => {
              const position = items.length - 1 - reversed;
              return cellFor(item, position, position === items.length - 1 ? strings.stack.topLabel : position === 0 ? strings.stack.bottomLabel : null);
            })}
          </View>
        ) : (
          <View style={styles.row}>
            {items.map((item, position) => cellFor(item, position, position === 0 ? strings.queue.frontLabel : position === items.length - 1 ? strings.queue.rearLabel : null))}
          </View>
        )}
        <View style={styles.takenRow}>
          <ThemedText type="caption" themeColor="textSecondary">{t.takenLabel}</ThemedText>
          <ThemedText type="codeInline" tabular>{taken.length === 0 ? t.none : taken.join(', ')}</ThemedText>
        </View>
      </View>
    </VisualFrame>
  );
}

export function StackVisual(props: VisualProps) {
  return <LinearVisual kind="stack" {...props} />;
}

export function QueueVisual(props: VisualProps) {
  return <LinearVisual kind="queue" {...props} />;
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  column: { gap: 4, alignItems: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { minWidth: 72, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  cellOn: { borderWidth: 2.5 },
  takenRow: { gap: 2 },
});
