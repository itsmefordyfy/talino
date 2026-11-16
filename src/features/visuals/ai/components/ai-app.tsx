import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { aiStrings } from '../strings';
import { APP_SCENARIOS, appSpec, buildAppSteps, type AppScenario } from '../lib/workflows';

export function AiAppVisual({ compact }: VisualProps) {
  const s = useLocalized(aiStrings).appWorkflow;
  const [scenario, setScenario] = useState<AppScenario>('server');
  const steps = stableSteps(s, scenario, () => buildAppSteps(scenario, s));
  const spec = stableValue(s, `spec-${scenario}`, () => appSpec(scenario, s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.scenarioLabel} wrap value={scenario} onChange={setScenario} options={APP_SCENARIOS.map((id) => ({ value: id, label: s.scenarios[id] }))} />}
    />
  );
}
