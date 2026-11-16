import type { SequenceSpec } from '../types';
import { normalize } from './layered';
import { LABEL_FONT, LINE_HEIGHT, NODE_FONT, type DiagramLayout, type LayoutEdge, type LayoutLine, type LayoutNode } from './types';
import { CHAR_WIDTH, wrapText } from './text';

const MIN_COLUMN = 72;
const MAX_COLUMN = 150;
const SIDE = 0;
/** The margin `normalize` adds on each side. */
const MARGIN = 8;

/**
 * Sequence diagram: one column per participant with its lifeline, one row per message. A column is at
 * least 72 pt wide; when the participants do not fit the room, the drawing is wider and `needsScroll` says so.
 */
export function layoutSequence(spec: SequenceSpec, width: number): DiagramLayout {
  const count = spec.participants.length;
  const column = Math.max(MIN_COLUMN, Math.min(MAX_COLUMN, (width - 2 * MARGIN) / count));
  const boxWidth = column - 6;
  const centerX = (i: number) => SIDE + column * (i + 0.5);
  const index = new Map(spec.participants.map((participant, i) => [participant.id, i] as const));
  const glyph = NODE_FONT * CHAR_WIDTH;

  const heads = spec.participants.map((participant) => wrapText(participant.label, (boxWidth - 12) / glyph));
  const headHeight = Math.max(36, Math.max(...heads.map((lines) => lines.length)) * LINE_HEIGHT + 14);
  const nodes: LayoutNode[] = spec.participants.map((participant, i) => {
    const lines: LayoutLine[] = heads[i].map((text, k) => ({
      text,
      x: boxWidth / 2,
      y: (headHeight - heads[i].length * LINE_HEIGHT) / 2 + k * LINE_HEIGHT + LINE_HEIGHT / 2,
      kind: 'text',
      align: 'center',
    }));
    return { id: participant.id, index: i, x: centerX(i) - boxWidth / 2, y: 0, width: boxWidth, height: headHeight, shape: participant.shape ?? 'rounded', lines };
  });

  const edges: LayoutEdge[] = [];
  let y = headHeight + 22;
  const labelGlyph = LABEL_FONT * CHAR_WIDTH;
  spec.messages.forEach((message, i) => {
    const a = index.get(message.from) ?? 0;
    const b = index.get(message.to) ?? 0;
    const self = a === b;
    const span = self ? column - 24 : Math.abs(centerX(b) - centerX(a)) - 12;
    const lines = wrapText(message.label, Math.max(span, column - 16) / labelGlyph);
    const labelHeight = lines.length * 15 + 2;
    const arrowY = y + labelHeight + 6;
    const x1 = centerX(a);
    const x2 = centerX(b);
    const labelWidth = Math.ceil(Math.max(...lines.map((line) => line.length)) * labelGlyph) + 8;
    const points = self
      ? [
          { x: x1, y: arrowY },
          { x: x1 + 24, y: arrowY },
          { x: x1 + 24, y: arrowY + 16 },
          { x: x1, y: arrowY + 16 },
        ]
      : [
          { x: x1, y: arrowY },
          { x: x2, y: arrowY },
        ];
    edges.push({
      index: i,
      from: message.from,
      to: message.to,
      points,
      curve: 'polyline',
      label: { lines, x: self ? x1 + 28 + labelWidth / 2 : (x1 + x2) / 2, y: y + labelHeight / 2, width: labelWidth, height: labelHeight },
      dashed: message.dashed === true,
      markerStart: 'none',
      markerEnd: 'arrow',
    });
    y = arrowY + (self ? 16 : 0) + 18;
  });

  const lifelines = spec.participants.map((participant, i) => ({ id: participant.id, x: centerX(i), y1: headHeight, y2: y }));
  const layout = normalize({ kind: 'sequence', width: 0, height: 0, needsScroll: false, fontSize: LABEL_FONT, direction: null, nodes, edges, lifelines });
  return layout;
}
