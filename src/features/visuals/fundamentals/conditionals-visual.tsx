import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { useStepper } from '../components/use-stepper';
import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { buildConditionalSteps, CONDITIONAL_PROGRAMS, conditionalSource, conditionText } from './conditionals';
import { Arrow, CodeListing, NumberAdjust, PlayControls, Tag } from './parts';
import { fundamentalsStrings } from './strings';

export function ConditionalsVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).conditionals;
  const theme = useTheme();
  const tones = useTones();
  const [programIndex, setProgramIndex] = useState(0);
  const program = CONDITIONAL_PROGRAMS[programIndex] ?? CONDITIONAL_PROGRAMS[0]!;
  const [value, setValue] = useState(program.start);
  const steps = buildConditionalSteps(program, value, t);
  const stepper = useStepper(steps, { intervalMs: 1100 });
  const step = stepper.step;

  const chooseProgram = (id: string) => {
    const index = CONDITIONAL_PROGRAMS.findIndex((entry) => entry.id === id);
    const next = CONDITIONAL_PROGRAMS[index];
    if (!next) return;
    setProgramIndex(index);
    setValue(next.start);
  };

  const stateTone = (state: 'pending' | 'false' | 'true'): Tone => (state === 'true' ? 'mint' : state === 'false' ? 'red' : 'neutral');
  const marker = (state: 'pending' | 'false' | 'true') => (state === 'true' ? '✓' : state === 'false' ? '✗' : '…');

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={step.caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.programLabel} value={program.id} onChange={chooseProgram} options={CONDITIONAL_PROGRAMS.map((entry) => ({ value: entry.id, label: t.programNames[entry.id] }))} />
          <NumberAdjust label={t.valueLabel(program.variable)} value={value} min={program.min} max={program.max} onChange={setValue} />
          <ChipSelect label={t.samplesLabel} value={String(value)} onChange={(sample) => setValue(Number(sample))} options={program.samples.map((sample) => ({ value: String(sample), label: String(sample) }))} />
          <PlayControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.chart}>
          {program.branches.map((branch, index) => {
            const state = step.tried[index] ?? 'pending';
            const taken = step.taken === index;
            const ink = tones[stateTone(state)].ink;
            return (
              <View key={branch.threshold} style={styles.branch}>
                <View style={styles.decisionRow}>
                  <View accessible accessibilityLabel={`${conditionText(program, branch)}, ${t.states[state]}`} style={[styles.decision, { backgroundColor: tones[stateTone(state)].soft, borderColor: ink }, state === 'pending' && styles.dim]}>
                    <ThemedText type="codeInline" style={{ color: ink }}>{`${conditionText(program, branch)} ?`}</ThemedText>
                    <ThemedText type="caption" style={{ color: ink }}>{`${marker(state)} ${t.states[state]}`}</ThemedText>
                  </View>
                  <Arrow direction="right" label={t.yes} />
                  <Tag text={`${program.assigns} = ${branch.result}`} mono tone={taken ? 'mint' : 'neutral'} outlined={taken} dim={step.taken !== null && !taken} marker={taken ? '▶' : undefined} />
                </View>
                <Arrow label={t.no} />
              </View>
            );
          })}
          <View style={styles.decisionRow}>
            <Tag text={`${t.elseLabel}: ${program.assigns} = ${program.otherwise}`} mono tone={step.taken === program.branches.length ? 'mint' : 'neutral'} outlined={step.taken === program.branches.length} dim={step.taken !== null && step.taken !== program.branches.length} marker={step.taken === program.branches.length ? '▶' : undefined} />
          </View>
        </View>
        <View style={[styles.code, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText type="caption" themeColor="textSecondary">{t.codeLabel}</ThemedText>
          <CodeListing lines={conditionalSource(program)} active={step.lines} />
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  stage: { gap: Spacing.three },
  chart: { gap: 0 },
  branch: { gap: 0 },
  decisionRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  decision: { gap: 2, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.large, borderCurve: 'continuous', borderWidth: 2 },
  dim: { opacity: 0.7 },
  code: { gap: Spacing.one, padding: Spacing.two, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
});
