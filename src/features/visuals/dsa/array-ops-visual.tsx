import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import { Legend, NumberAdjust, PlayControls, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { appendSteps, deleteAtSteps, idleStep, insertAtSteps, makeArray, MAX_LENGTH, MIN_START, searchSteps, traverseSteps, valuesOf, type ArrayStep } from './array-ops';
import { arrayOpsStrings } from './array-ops-strings';

const START_SIZE = 6;
const CELL = 40;

export function ArrayOpsVisual({ compact }: VisualProps) {
  const t = useLocalized(arrayOpsStrings);
  const theme = useTheme();
  const tones = useTones();
  const [size, setSize] = useState(START_SIZE);
  const [trace, setTrace] = useState<ArrayStep[]>(() => [idleStep(makeArray(START_SIZE), arrayOpsStrings.en.intro(START_SIZE))]);
  const [value, setValue] = useState(17);
  const [index, setIndex] = useState(2);
  const stepper = useStepper(trace, { intervalMs: 900 });
  const step = stepper.step;
  // Operations always start from where the last one ended, so insert, then delete, then search build on each other.
  const settled = valuesOf(trace[trace.length - 1] ?? step);
  const run = (build: (values: readonly number[]) => ArrayStep[]) => setTrace(build(settled));
  const restart = (count: number) => {
    setTrace([idleStep(makeArray(count), t.intro(makeArray(count).length))]);
  };

  const cellLook = (position: number): { tone: Tone; strong: boolean; mark: string } => {
    if (step.found === position) return { tone: 'mint', strong: true, mark: '✓' };
    if (step.writing === position) return { tone: step.fresh === position ? 'violet' : 'red', strong: true, mark: step.fresh === position ? '+' : 'W' };
    if (step.reading === position) return { tone: 'amber', strong: true, mark: 'R' };
    if (step.doomed === position) return { tone: 'red', strong: true, mark: '✕' };
    return { tone: 'neutral', strong: false, mark: ' ' };
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <View style={styles.adjusts}>
            <NumberAdjust label={t.valueLabel} value={value} min={1} max={99} onChange={setValue} />
            <NumberAdjust label={t.indexLabel} value={index} min={0} max={MAX_LENGTH} onChange={setIndex} />
            <NumberAdjust
              label={t.sizeLabel}
              value={size}
              min={MIN_START}
              max={MAX_LENGTH}
              onChange={(next) => {
                setSize(next);
                restart(next);
              }}
            />
          </View>
          <View style={styles.buttons}>
            <Button size="small" title={t.buttons.insert} onPress={() => run((values) => insertAtSteps(values, index, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.append} onPress={() => run((values) => appendSteps(values, value, t))} />
            <Button size="small" variant="secondary" title={t.buttons.delete} onPress={() => run((values) => deleteAtSteps(values, index, t))} />
            <Button size="small" variant="secondary" title={t.buttons.traverse} onPress={() => run((values) => traverseSteps(values, t))} />
            <Button size="small" variant="outline" title={t.buttons.search} onPress={() => run((values) => searchSteps(values, value, t))} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={() => restart(size)} />
          </View>
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.cells} accessible accessibilityLabel={t.arrayLabel(valuesOf(step))}>
          {step.cells.map((cell, position) => {
            const { tone, strong, mark } = cellLook(position);
            const colors = tones[tone];
            const spare = cell === null;
            return (
              <View key={position} style={styles.cellColumn}>
                <ThemedText type="caption" themeColor="textSecondary" tabular>{position}</ThemedText>
                <View style={[styles.cell, { backgroundColor: spare && !strong ? 'transparent' : colors.soft, borderColor: strong ? colors.ink : theme.border }, strong && styles.cellStrong, spare && !strong && styles.spare]}>
                  <ThemedText type="secondarySemiBold" tabular style={{ color: colors.ink }}>{cell === null ? '' : cell}</ThemedText>
                </View>
                <ThemedText type="caption" style={{ color: colors.ink }}>{mark}</ThemedText>
              </View>
            );
          })}
        </View>
        <View style={styles.counters}>
          <Tag text={`${t.operationLabel}: ${step.operation ? t.operationNames[step.operation] : t.noOperation}`} tone={step.refused ? 'red' : 'indigo'} outlined />
          <Tag text={t.reads(step.reads)} tone="amber" mono />
          <Tag text={t.writes(step.writes)} tone="red" mono />
          <Tag text={t.total(step.reads + step.writes)} tone="violet" mono outlined />
        </View>
        <View style={styles.complexity}>
          <ThemedText type="caption" themeColor="textSecondary">{t.complexityLabel}</ThemedText>
          <ThemedText type="secondarySemiBold">
            {step.complexity ? t.complexityNotes[step.complexity] : t.complexityIdle}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{compact ? t.legendNote : `${t.legendNote} ${t.readByIndex}`}</ThemedText>
        <Legend
          items={[
            { label: t.legend.read, tone: 'amber', marker: 'R' },
            { label: t.legend.written, tone: 'red', marker: 'W' },
            { label: t.legend.fresh, tone: 'violet', marker: '+' },
            { label: t.legend.found, tone: 'mint', marker: '✓' },
            { label: t.legend.removed, tone: 'red', marker: '✕' },
          ]}
        />
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.three },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, rowGap: Spacing.two },
  cellColumn: { alignItems: 'center', gap: Spacing.half, minWidth: CELL },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  cellStrong: { borderWidth: 2.5 },
  spare: { borderStyle: 'dashed' },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  complexity: { gap: Spacing.half },
});
