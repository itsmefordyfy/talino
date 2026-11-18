import { TradeoffMatrix } from '@/features/architecture/workbench/tradeoff-matrix';
import { useLocalized } from '@/hooks/use-strings';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { architectureVisualStrings } from './strings';

/** The trade-off matrix: weighted scoring with a "too close to call" rule, kept on this phone (the tool itself is in `features/architecture/workbench`). */
export function TradeoffMatrixVisual({ compact }: VisualProps) {
  const v = useLocalized(architectureVisualStrings).tradeoff;
  return (
    <VisualFrame title={v.title} description={v.description} compact={compact}>
      <TradeoffMatrix />
    </VisualFrame>
  );
}
