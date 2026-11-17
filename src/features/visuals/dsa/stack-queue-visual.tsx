import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { applyDequeOp, applyQueueOp, applyStackOp, currentFrame, operationCount, recordOutcome, resetHistory, startHistory, undoLast, type DequeOp, type LinearOp, type LinearOutcome, type OperationName } from './stack-queue';
import { stackQueueStrings } from './stack-queue-strings';
import { dsaStrings } from './strings';

type Kind = 'stack' | 'queue' | 'deque';
const START = [4, 9];

function LinearVisual({ kind, compact, modeSwitch }: VisualProps & { kind: Kind; modeSwitch?: ReactNode }) {
  const strings = useLocalized(dsaStrings);
  const extra = useLocalized(stackQueueStrings);
  // A deque has no captions of its own for the frame's title, so it reads the queue's.
  const t = kind === 'stack' ? strings.stack : strings.queue;
  const theme = useTheme();
  const tones = useTones();
  const [history, setHistory] = useState(() => startHistory(START));
  const [value, setValue] = useState(7);
  const frame = currentFrame(history);
  const operations = operationCount(history);

  const record = (outcome: LinearOutcome, op: OperationName) => setHistory(recordOutcome(history, outcome, op));
  const run = (op: LinearOp) => record(kind === 'stack' ? applyStackOp(frame.items, op, strings.stack) : applyQueueOp(frame.items, op, strings.queue), op.kind);
  const runDeque = (op: DequeOp) => record(applyDequeOp(frame.items, op, extra.deque), op.kind);

  const introduction = kind === 'deque' ? extra.deque.intro : t.intro;
  const caption = frame.caption ?? introduction;
  const failed = !frame.ok;
  const names: Record<string, string> = extra.names[kind];
  const lastName = frame.op === null ? null : (names[frame.op] ?? frame.op);

  const takenLabel = kind === 'deque' ? extra.deque.takenLabel : (t as typeof strings.stack).takenLabel;
  const label = kind === 'stack' ? strings.stack.lifoLabel : kind === 'queue' ? strings.queue.fifoLabel : extra.deque.bothLabel;
  const { items, marked, taken } = frame;

  const cellFor = (item: number, position: number, edge: string | null) => {
    const on = marked === position;
    return (
      <View key={`${position}-${item}`} accessible accessibilityLabel={edge ? `${item}, ${edge}` : String(item)} style={[styles.cell, { backgroundColor: on ? tones.violet.soft : theme.backgroundElement, borderColor: on || edge ? tones.violet.ink : theme.border }, on && styles.cellOn]}>
        <ThemedText type="statSmall" tabular style={{ color: on ? tones.violet.ink : theme.text }}>{item}</ThemedText>
        {edge ? <ThemedText type="caption" themeColor="primary">{edge}</ThemedText> : null}
      </View>
    );
  };

  const buttons =
    kind === 'deque' ? (
      <>
        <Button size="small" title={extra.deque.buttons.addFront} icon="add" onPress={() => runDeque({ kind: 'addFront', value })} />
        <Button size="small" title={extra.deque.buttons.addBack} icon="add" onPress={() => runDeque({ kind: 'addBack', value })} />
        <Button size="small" variant="secondary" title={extra.deque.buttons.removeFront} icon="remove" onPress={() => runDeque({ kind: 'removeFront' })} />
        <Button size="small" variant="secondary" title={extra.deque.buttons.removeBack} icon="remove" onPress={() => runDeque({ kind: 'removeBack' })} />
        <Button size="small" variant="outline" title={extra.deque.buttons.peekFront} icon="visibility" onPress={() => runDeque({ kind: 'peekFront' })} />
        <Button size="small" variant="outline" title={extra.deque.buttons.peekBack} icon="visibility" onPress={() => runDeque({ kind: 'peekBack' })} />
      </>
    ) : (
      <>
        <Button size="small" title={t.buttons.add} icon="add" onPress={() => run({ kind: 'add', value })} />
        <Button size="small" variant="secondary" title={t.buttons.remove} icon="remove" onPress={() => run({ kind: 'remove' })} />
        <Button size="small" variant="outline" title={t.buttons.peek} icon="visibility" onPress={() => run({ kind: 'peek' })} />
      </>
    );

  return (
    <VisualFrame
      title={t.title}
      description={kind === 'deque' ? `${t.description} ${extra.dequeDescription}` : t.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          {modeSwitch}
          <NumberAdjust label={kind === 'deque' ? extra.deque.valueLabel : t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
          <View style={styles.buttons}>{buttons}</View>
          <View style={styles.buttons}>
            <Button size="small" variant="secondary" title={extra.back} icon="arrow_back" accessibilityHint={extra.backHint} disabled={operations === 0} onPress={() => setHistory(undoLast(history))} />
            <Button size="small" variant="ghost" title={t.buttons.reset} icon="refresh" disabled={operations === 0} onPress={() => setHistory(resetHistory(history))} />
          </View>
        </View>
      }>
      <View style={styles.stage} accessible accessibilityLabel={kind === 'deque' ? extra.deque.listLabel(items) : (t as typeof strings.stack).listLabel(items)}>
        <View style={styles.tags}>
          <Tag text={label} tone={failed ? 'red' : 'violet'} outlined />
          <Tag text={extra.operations(operations)} tone="indigo" outlined />
        </View>
        {items.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">{kind === 'deque' ? extra.deque.emptyHint : (t as typeof strings.stack).emptyHint}</ThemedText>
        ) : kind === 'stack' ? (
          <View style={styles.column}>
            {[...items].reverse().map((item, reversed) => {
              const position = items.length - 1 - reversed;
              return cellFor(item, position, position === items.length - 1 ? strings.stack.topLabel : position === 0 ? strings.stack.bottomLabel : null);
            })}
          </View>
        ) : (
          <View style={styles.row}>{items.map((item, position) => cellFor(item, position, position === 0 ? strings.queue.frontLabel : position === items.length - 1 ? strings.queue.rearLabel : null))}</View>
        )}
        <View style={styles.takenRow}>
          <ThemedText type="caption" themeColor="textSecondary">{takenLabel}</ThemedText>
          <ThemedText type="codeInline" tabular>{taken.length === 0 ? t.none : taken.join(', ')}</ThemedText>
        </View>
        <View style={styles.note}>
          <ThemedText type="secondarySemiBold" accessibilityLiveRegion="polite">{lastName === null ? extra.noOperation : extra.lastOperation(lastName)}</ThemedText>
          {lastName !== null ? <ThemedText type="secondary" themeColor="textSecondary">{failed ? extra.refused : extra.complexity(lastName, kind)}</ThemedText> : null}
        </View>
      </View>
    </VisualFrame>
  );
}

export function StackVisual(props: VisualProps) {
  return <LinearVisual kind="stack" {...props} />;
}

/** The queue, with a switch to a deque (a queue open at both ends). Switching starts that structure fresh. */
export function QueueVisual(props: VisualProps) {
  const extra = useLocalized(stackQueueStrings);
  const [mode, setMode] = useState<'queue' | 'deque'>('queue');
  return <LinearVisual key={mode} kind={mode} {...props} modeSwitch={<ChipSelect label={extra.modeLabel} value={mode} onChange={setMode} options={[{ value: 'queue', label: extra.modes.queue }, { value: 'deque', label: extra.modes.deque }]} />} />;
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  column: { gap: 4, alignItems: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { minWidth: 72, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  cellOn: { borderWidth: 2.5 },
  takenRow: { gap: 2 },
  note: { gap: 2 },
});
