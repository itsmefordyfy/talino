import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { ThemedText } from '@/components/themed-text';
import { useLocalized } from '@/hooks/use-strings';

import { stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { architectureSpec, buildPathSteps, PATH_IDS, type PathId } from '../lib/architecture';
import { softwareStrings } from '../strings';

export function ArchitectureVisual({ compact }: VisualProps) {
  const s = useLocalized(softwareStrings).architecture;
  const [path, setPath] = useState<PathId>('login');
  const steps = stableSteps(s, path, () => buildPathSteps(path, s.hops));
  const spec = stableValue(s, 'spec', () => architectureSpec({ title: s.title, summary: s.summary, components: s.components, groups: s.groups }));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      options={<ChipSelect label={s.pathLabel} wrap value={path} onChange={setPath} options={PATH_IDS.map((id) => ({ value: id, label: s.paths[id] }))} />}
      extra={
        <ThemedText type="caption" themeColor="textSecondary">
          {s.simplified}
        </ThemedText>
      }
    />
  );
}
