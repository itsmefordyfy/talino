import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { StepControls } from '../../components/step-controls';
import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import type { DiagramSpec } from '../types';
import { DiagramView } from './diagram-view';
import { PayloadBox, type Payload } from './payload-box';

/** One stage of a stepped explanation drawn on a diagram. */
export type StagedStep = {
  /** The sentence shown (and announced) under the picture for this stage. */
  caption: string;
  /** Diagram node ids that are active in this stage. */
  nodes?: readonly string[];
  /** Positions of the edges (or sequence messages) that are active in this stage. */
  edges?: readonly number[];
  payloads?: readonly Payload[];
};

export type StagedVisualProps = {
  title: string;
  description: string;
  spec: DiagramSpec;
  /** Must keep its identity while its inputs stay the same (see `stableSteps`), or the stepper restarts. */
  steps: readonly StagedStep[];
  compact?: boolean;
  /** Choices that change the scenario, drawn above the step buttons. */
  options?: ReactNode;
  /** Extra content under the payloads. */
  extra?: ReactNode;
  intervalMs?: number;
};

/**
 * A diagram, a list of stages and Back / Play / Next / Reset: the shape most "how it flows" visuals share.
 * The active nodes and arrows are emphasized (the rest dimmed), the stage's payloads are shown under the
 * picture and its caption is announced.
 */
export function StagedVisual({ title, description, spec, steps, compact = false, options, extra, intervalMs = 1500 }: StagedVisualProps) {
  const stepper = useStepper(steps, { intervalMs });
  const step = stepper.step;
  return (
    <VisualFrame
      title={title}
      description={description}
      compact={compact}
      caption={step?.caption}
      controls={
        <View style={styles.controls}>
          {options}
          <StepControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stage}>
        <DiagramView spec={spec} highlightNodes={step?.nodes} highlightEdges={step?.edges} hideHint />
        {step?.payloads?.map((payload, index) => <PayloadBox key={`${stepper.index}-${index}`} {...payload} />)}
        {extra}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stage: { gap: Spacing.two + 2 },
  controls: { gap: Spacing.three },
});
