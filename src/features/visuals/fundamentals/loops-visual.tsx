import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { buildLoopSteps, conditionOf, iterationCount, loopSource, loopValues, type LoopKind } from './loops';
import { CodeListing, NumberAdjust, PlayControls, Tag } from './parts';
import { fundamentalsStrings } from './strings';

export function LoopsVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).loops;
  const theme = useTheme();
  const tones = useTones();
  const [kind, setKind] = useState<LoopKind>('for');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(6);
  const [step, setStep] = useState(1);
  const input = { kind, start, end, step };
  const steps = buildLoopSteps(input, t);
  const stepper = useStepper(steps, { intervalMs: 700 });
  const current = stepper.step;
  const all = iterationCount(input);
  const values = new Set(loopValues(input));
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  const cells = Array.from({ length: Math.min(high - low + 1, 32) }, (_, index) => low + index);
  const seen = new Set(loopValues(input).slice(0, current.finished));
  const here = current.i;

  // A step of 0 would never move: skip over it when the learner nudges across zero.
  const changeStep = (next: number) => setStep(next === 0 ? (next > step ? 1 : -1) : next);

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={`${current.caption}`}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.kindLabel} value={kind} onChange={setKind} options={[{ value: 'for', label: t.kinds.for }, { value: 'while', label: t.kinds.while }]} />
          <View style={styles.adjusts}>
            <NumberAdjust label={t.startLabel} value={start} min={-10} max={10} onChange={setStart} />
            <NumberAdjust label={t.endLabel} value={end} min={-10} max={20} onChange={setEnd} />
            <NumberAdjust label={t.stepLabel} value={step} min={-5} max={5} onChange={changeStep} />
          </View>
          <PlayControls stepper={stepper} />
          <ThemedText type="caption" themeColor="textSecondary">
            {t.simplifiedNote}
          </ThemedText>
        </View>
      }>
      <View style={styles.stage}>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.trackLabel}
        </ThemedText>
        <View style={styles.track}>
          {cells.map((cell) => {
            const isHere = here === cell && current.i !== null;
            const wasHere = seen.has(cell) && !isHere;
            const tone = isHere ? tones.violet : wasHere ? tones.mint : tones.neutral;
            return (
              <View key={cell} accessible accessibilityLabel={`${cell}, ${isHere ? t.pointerNow : wasHere ? t.visited : t.skipped}`} style={[styles.cell, { backgroundColor: tone.soft, borderColor: isHere ? tones.violet.ink : theme.border }, isHere && styles.cellNow, !values.has(cell) && styles.dim]}>
                <ThemedText type="caption" style={{ color: tones.violet.ink }}>
                  {isHere ? '▼' : ' '}
                </ThemedText>
                <ThemedText type="secondarySemiBold" tabular style={{ color: tone.ink }}>
                  {cell}
                </ThemedText>
                <ThemedText type="caption" style={{ color: tones.mint.ink }}>
                  {wasHere ? '✓' : ' '}
                </ThemedText>
              </View>
            );
          })}
        </View>
        <View style={styles.state}>
          <Tag text={`${t.iLabel} = ${current.i ?? '–'}`} mono tone="violet" outlined />
          <Tag text={`${t.totalLabel} = ${current.total}`} mono tone="indigo" outlined />
          <Tag text={`${conditionOf({ end, step })}: ${current.condition === null ? t.conditionStates.none : current.condition ? t.conditionStates.true : t.conditionStates.false}`} mono tone={current.condition === null ? 'neutral' : current.condition ? 'mint' : 'red'} outlined={current.condition !== null} />
        </View>
        <ThemedText type="cardTitle" tabular accessibilityLiveRegion="polite">
          {t.iterationsLabel(current.finished, all)}
        </ThemedText>
        <CodeListing lines={loopSource(input)} active={current.lines} />
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  adjusts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  stage: { gap: Spacing.two },
  track: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { minWidth: 34, alignItems: 'center', paddingHorizontal: 4, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1 },
  cellNow: { borderWidth: 2 },
  dim: { opacity: 0.45 },
  state: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
