import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { AUTH_OUTCOMES, authSpec, buildAuthSteps, type AuthOutcome } from '../lib/auth-flow';
import { webStrings } from '../strings';

export function AuthFlowVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).auth;
  const [outcome, setOutcome] = useState<AuthOutcome>('granted');
  const steps = stableSteps(s, outcome, () => buildAuthSteps(outcome, s));
  const spec = stableValue(s, `spec-${outcome}`, () => authSpec(outcome, s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.scenarioLabel} wrap value={outcome} onChange={setOutcome} options={AUTH_OUTCOMES.map((id) => ({ value: id, label: s.outcomes[id] }))} />}
    />
  );
}
