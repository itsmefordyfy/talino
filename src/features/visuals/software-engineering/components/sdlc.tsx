import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { buildSdlcSteps, sdlcSpec } from '../lib/sdlc';
import { softwareStrings } from '../strings';

type Scenario = 'clean' | 'bug';

export function SdlcVisual({ compact }: VisualProps) {
  const s = useLocalized(softwareStrings).sdlc;
  const [scenario, setScenario] = useState<Scenario>('clean');
  const steps = stableSteps(s, scenario, () => buildSdlcSteps(scenario === 'bug', s));
  const spec = stableValue(s, 'spec', () => sdlcSpec(s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      intervalMs={2200}
      options={<ChipSelect label={s.scenarioLabel} wrap value={scenario} onChange={setScenario} options={[{ value: 'clean', label: s.scenarios.clean }, { value: 'bug', label: s.scenarios.bug }]} />}
    />
  );
}
