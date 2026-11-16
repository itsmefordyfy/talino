import type { DiagramKind, NodeShape } from '../types';

export type Point = { x: number; y: number };

export type Curve = 'ortho-v' | 'ortho-h' | 'smooth-v' | 'smooth-h' | 'polyline' | 'rounded';

export type Marker = 'none' | 'arrow' | 'triangle' | 'diamond' | 'diamond-filled';

export type LayoutLine = {
  text: string;
  /** Relative to the node's top-left corner; `y` is the middle of the line. */
  x: number;
  y: number;
  kind: 'title' | 'text' | 'stereotype' | 'member' | 'key' | 'divider';
  align: 'center' | 'left';
};

export type LayoutNode = {
  id: string;
  /** Position in the spec's list. */
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** `card` is a class or entity box with divider lines. */
  shape: NodeShape | 'card';
  lines: LayoutLine[];
  group?: string;
};

export type LayoutLabel = { lines: string[]; x: number; y: number; width: number; height: number };

export type LayoutEdge = {
  /** Position in the spec's list of edges, messages, relations or relationships. */
  index: number;
  from: string;
  to: string;
  points: Point[];
  /**
   * `ortho-v` / `ortho-h`: straight lines with right-angle bends (rounded slightly), leaving and arriving along the main axis, the
   * clearest for flowcharts on a phone; `smooth-v` / `smooth-h`: S-curves; `polyline`: straight segments point to point; `rounded`: straight
   * segments through every point with slightly rounded corners (a flowchart's routed lines, whose bends are already in the points).
   */
  curve: Curve;
  label?: LayoutLabel;
  dashed: boolean;
  markerStart: Marker;
  markerEnd: Marker;
  /** Small texts at the two ends (an ER relationship's "1" and "0..n"). */
  startText?: { text: string; x: number; y: number };
  endText?: { text: string; x: number; y: number };
};

export type Lifeline = { id: string; x: number; y1: number; y2: number };

export type DiagramLayout = {
  kind: DiagramKind;
  /** The width the drawing needs; wider than the room offered means `needsScroll`. */
  width: number;
  height: number;
  needsScroll: boolean;
  /** Smallest text size used, in points (never below 12). */
  fontSize: number;
  direction: 'TD' | 'LR' | null;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  lifelines: Lifeline[];
};

export const MIN_FONT = 12;
export const NODE_FONT = 13;
export const LABEL_FONT = 12;
export const LINE_HEIGHT = 17;
