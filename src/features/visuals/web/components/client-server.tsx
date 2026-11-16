import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { buildClientServerSteps, CLIENT_SERVER_IDS, clientServerSpec, type ClientServerId } from '../lib/client-server';
import { webStrings } from '../strings';

export function ClientServerVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).clientServer;
  const [scenario, setScenario] = useState<ClientServerId>('page');
  const steps = stableSteps(s, scenario, () => buildClientServerSteps(scenario, s));
  const spec = stableValue(s, `spec-${scenario}`, () => clientServerSpec(scenario, s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.scenarioLabel} wrap value={scenario} onChange={setScenario} options={CLIENT_SERVER_IDS.map((id) => ({ value: id, label: s.scenarios[id] }))} />}
    />
  );
}
