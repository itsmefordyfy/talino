import type { DiagramSpec, FlowSpec } from '../types';
import { layoutClass, layoutEr } from './grid';
import { layoutLayered } from './layered';
import { layoutSequence } from './sequence';
import type { DiagramLayout } from './types';

export type { DiagramLayout, LayoutEdge, LayoutNode, LayoutLine, LayoutLabel, Lifeline, Marker, Point } from './types';
export { wrapText } from './text';

/** A phone held upright is narrower than this: flow diagrams then always run top to bottom. */
export const PORTRAIT_MAX_WIDTH = 480;

const TD_WIDTHS = [160, 140, 120, 104, 92, 84, 76];
const LR_WIDTHS = [150, 130, 112, 96, 84, 76];

function layoutFlow(spec: FlowSpec, width: number): DiagramLayout {
  const preferred = spec.direction ?? 'LR';
  const directions: ('TD' | 'LR')[] = width < PORTRAIT_MAX_WIDTH ? ['TD'] : preferred === 'TD' ? ['TD', 'LR'] : ['LR', 'TD'];
  let narrowest: DiagramLayout | null = null;
  for (const direction of directions) {
    for (const maxNodeWidth of direction === 'TD' ? TD_WIDTHS : LR_WIDTHS) {
      const layout = layoutLayered(spec, { direction, maxNodeWidth, ...(direction === 'TD' ? { fit: width - 16 } : {}) });
      if (layout.width <= width) return layout;
      if (narrowest === null || layout.width < narrowest.width) narrowest = layout;
    }
  }
  // Nothing fits: the narrowest drawing, wider than the room, so the view scrolls sideways.
  return { ...(narrowest as DiagramLayout), needsScroll: true };
}

/**
 * Lays a valid spec out for `width` points of room. Flow and architecture diagrams are layered (top to
 * bottom on a narrow screen), sequence diagrams use lifelines, class and ER diagrams a grid. The result
 * is plain coordinates; `needsScroll` is true only when the drawing could not be made to fit.
 */
export function layoutDiagram(spec: DiagramSpec, width: number): DiagramLayout {
  const room = Math.max(160, Math.floor(width));
  let layout: DiagramLayout;
  switch (spec.kind) {
    case 'flow':
    case 'architecture':
      layout = layoutFlow(spec, room);
      break;
    case 'sequence':
      layout = layoutSequence(spec, room);
      break;
    case 'class':
      layout = layoutClass(spec, room);
      break;
    case 'er':
      layout = layoutEr(spec, room);
      break;
  }
  return layout.width > room ? { ...layout, needsScroll: true } : layout;
}
