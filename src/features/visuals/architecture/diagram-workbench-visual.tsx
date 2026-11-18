import { DiagramWorkbench } from '@/features/architecture/workbench/diagram-workbench';
import { useLocalized } from '@/hooks/use-strings';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { architectureVisualStrings } from './strings';

/** The diagram workbench: Mermaid and C4 text drawn live, copied, saved on this phone and compared (the tool itself is in `features/architecture/workbench`). */
export function DiagramWorkbenchVisual({ compact }: VisualProps) {
  const v = useLocalized(architectureVisualStrings).workbench;
  return (
    <VisualFrame title={v.title} description={v.description} compact={compact}>
      <DiagramWorkbench />
    </VisualFrame>
  );
}
