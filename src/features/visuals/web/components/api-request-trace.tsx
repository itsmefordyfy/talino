import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { API_SCENARIO_IDS, apiTraceSpec, buildApiTrace, type ApiScenarioId } from '../lib/api-trace';
import { webStrings } from '../strings';

/** A request followed stage by stage; the learner picks the scenario (a read, a create, a 404, a bad request). */
export function ApiRequestTraceVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).apiTrace;
  const [scenario, setScenario] = useState<ApiScenarioId>('get-user');
  const steps = stableSteps(s, scenario, () => buildApiTrace(scenario, s));
  const spec = stableValue(s, 'spec', () => apiTraceSpec(s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.scenarioLabel} wrap value={scenario} onChange={setScenario} options={API_SCENARIO_IDS.map((id) => ({ value: id, label: s.scenarios[id].label }))} />}
    />
  );
}
