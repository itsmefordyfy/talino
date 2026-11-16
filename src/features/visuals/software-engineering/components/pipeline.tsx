import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { stableSteps } from '../../diagrams';
import { StepControls } from '../../components/step-controls';
import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { buildPipelineRun, STAGES, type Check, type StageStatus } from '../lib/pipeline';
import { softwareStrings, type SoftwareStrings } from '../strings';

const LOOK: Record<StageStatus, { icon: IconName; color: ThemeColor }> = {
  pending: { icon: 'radio_button_unchecked', color: 'textSecondary' },
  running: { icon: 'hourglass_top', color: 'primary' },
  passed: { icon: 'check_circle', color: 'statusOk' },
  failed: { icon: 'cancel', color: 'danger' },
  skipped: { icon: 'block', color: 'textSecondary' },
};

function captionFor(event: string, stage: string | null, words: SoftwareStrings['pipeline']): string {
  const name = stage ? words.stages[stage as keyof typeof words.stages] : '';
  switch (event) {
    case 'start':
      return words.events.start;
    case 'running':
      return words.events.running(name, words.explain[stage as keyof typeof words.explain]);
    case 'passed':
      return words.events.passed(name);
    case 'failed':
      return words.events.failed(name);
    case 'stopped':
      return words.events.stopped;
    default:
      return words.events.live;
  }
}

/** A commit travelling through build, test and deploy; the learner chooses whether build and tests pass. A failure stops the run. */
export function PipelineVisual({ compact }: VisualProps) {
  const s = useLocalized(softwareStrings).pipeline;
  const theme = useTheme();
  const [build, setBuild] = useState<Check>('pass');
  const [test, setTest] = useState<Check>('pass');
  const steps = stableSteps(s, `${build}:${test}`, () => buildPipelineRun({ build, test }));
  const stepper = useStepper(steps, { intervalMs: 1100 });
  const step = stepper.step;
  const options = [
    { value: 'pass' as const, label: s.passes },
    { value: 'fail' as const, label: s.fails },
  ];

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={captionFor(step.event, step.stage, s)}
      controls={
        <View style={styles.stack}>
          <View style={styles.choice}>
            <ThemedText type="secondarySemiBold">{s.buildLabel}</ThemedText>
            <SegmentedControl accessibilityLabel={s.buildLabel} options={options} value={build} onChange={setBuild} />
          </View>
          <View style={styles.choice}>
            <ThemedText type="secondarySemiBold">{s.testLabel}</ThemedText>
            <SegmentedControl accessibilityLabel={s.testLabel} options={options} value={test} onChange={setTest} />
          </View>
          <StepControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stack}>
        {STAGES.map((stage) => {
          const status = step.statuses[stage];
          const look = LOOK[status];
          const active = step.stage === stage;
          return (
            <View
              key={stage}
              accessible
              accessibilityLabel={`${s.stages[stage]}: ${s.status[status]}`}
              style={[styles.stage, { borderColor: active ? theme.primary : theme.border, backgroundColor: theme.backgroundElement, borderWidth: active ? 2 : 1 }]}>
              <Icon name={look.icon} size={22} color={look.color} />
              <ThemedText type="bodySemiBold" style={styles.stageName}>
                {s.stages[stage]}
              </ThemedText>
              <ThemedText type="secondarySemiBold" themeColor={look.color}>
                {s.status[status]}
              </ThemedText>
            </View>
          );
        })}
        <ThemedText type="caption" themeColor="textSecondary">
          {s.simplified}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  choice: { gap: Spacing.one },
  stage: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: 48, paddingHorizontal: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  stageName: { flex: 1 },
});
