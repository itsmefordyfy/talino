import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { ThemedText } from '@/components/themed-text';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { aiStrings } from '../strings';
import { buildLlmSteps, LLM_SCENARIOS, llmSpec, type LlmScenario } from '../lib/workflows';

export function LlmWorkflowVisual({ compact }: VisualProps) {
  const s = useLocalized(aiStrings).llmWorkflow;
  const [scenario, setScenario] = useState<LlmScenario>('ok');
  const steps = stableSteps(s, scenario, () => buildLlmSteps(scenario, s));
  const spec = stableValue(s, 'spec', () => llmSpec(s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.scenarioLabel} wrap value={scenario} onChange={setScenario} options={LLM_SCENARIOS.map((id) => ({ value: id, label: s.scenarios[id] }))} />}
      extra={
        <ThemedText type="caption" themeColor="textSecondary">
          {s.fixedNote}
        </ThemedText>
      }
    />
  );
}
