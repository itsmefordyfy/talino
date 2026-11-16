import type { Curve, Marker, Point } from './types';

/** The three corners of an arrow head whose tip is `tip`, pointing away from `from`. */
export function arrowHead(tip: Point, from: Point, size = 9, spread = 0.45): [Point, Point, Point] {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
  const left = angle + Math.PI - spread;
  const right = angle + Math.PI + spread;
  return [tip, { x: tip.x + size * Math.cos(left), y: tip.y + size * Math.sin(left) }, { x: tip.x + size * Math.cos(right), y: tip.y + size * Math.sin(right) }];
}

/** A diamond whose far corner touches `tip`, pointing along the line away from `from`. */
export function diamondHead(tip: Point, from: Point, length = 14, half = 5): Point[] {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const mid = { x: tip.x - (ux * length) / 2, y: tip.y - (uy * length) / 2 };
  const back = { x: tip.x - ux * length, y: tip.y - uy * length };
  return [tip, { x: mid.x - uy * half, y: mid.y + ux * half }, back, { x: mid.x + uy * half, y: mid.y - ux * half }];
}

export function pointsAttr(points: readonly Point[]): string {
  return points.map((point) => `${round(point.x)},${round(point.y)}`).join(' ');
}

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/** The head polygon for a marker at `tip` (null for none). `open` markers are drawn as a polyline instead of a fill. */
export function markerPoints(marker: Marker, tip: Point, from: Point): { points: Point[]; filled: boolean; open: boolean } | null {
  switch (marker) {
    case 'none':
      return null;
    case 'arrow':
      return { points: arrowHead(tip, from), filled: true, open: false };
    case 'triangle':
      return { points: arrowHead(tip, from, 12, 0.5), filled: false, open: false };
    case 'diamond':
      return { points: diamondHead(tip, from), filled: false, open: false };
    case 'diamond-filled':
      return { points: diamondHead(tip, from), filled: true, open: false };
  }
}

/** Corner radius of a right-angle bend, kept small so lines stay easy to follow. */
const BEND = 8;

/**
 * Right-angle route from `a` to `b` along the main axis (vertical for `v`): out along the axis to the middle, across, then in along the
 * axis, with slightly rounded corners. A route already in line is one straight segment.
 */
function orthoSegment(a: Point, b: Point, vertical: boolean): string {
  const across = vertical ? b.x - a.x : b.y - a.y;
  if (Math.abs(across) < 1) return ` L${round(b.x)} ${round(b.y)}`;
  const mid = vertical ? (a.y + b.y) / 2 : (a.x + b.x) / 2;
  const along = vertical ? b.y - a.y : b.x - a.x;
  const r = Math.max(0, Math.min(BEND, Math.abs(across) / 2, Math.abs(along) / 2));
  const sAcross = Math.sign(across);
  const sAlong = Math.sign(along) || 1;
  if (vertical) {
    return (
      ` L${round(a.x)} ${round(mid - sAlong * r)} Q${round(a.x)} ${round(mid)} ${round(a.x + sAcross * r)} ${round(mid)}` +
      ` L${round(b.x - sAcross * r)} ${round(mid)} Q${round(b.x)} ${round(mid)} ${round(b.x)} ${round(mid + sAlong * r)} L${round(b.x)} ${round(b.y)}`
    );
  }
  return (
    ` L${round(mid - sAlong * r)} ${round(a.y)} Q${round(mid)} ${round(a.y)} ${round(mid)} ${round(a.y + sAcross * r)}` +
    ` L${round(mid)} ${round(b.y - sAcross * r)} Q${round(mid)} ${round(b.y)} ${round(mid + sAlong * r)} ${round(b.y)} L${round(b.x)} ${round(b.y)}`
  );
}

/** An SVG path through `points`: right-angle routes, S-curves whose tangents run along the main axis (vertical for `v`), or straight segments. */
export function pathData(points: readonly Point[], curve: Curve): string {
  if (points.length === 0) return '';
  const first = points[0];
  let path = `M${round(first.x)} ${round(first.y)}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    if (curve === 'rounded') {
      // Stop short of each corner and round it, so a line that turns twice reads as one line, not three.
      const c = points[i + 1];
      if (c === undefined) {
        path += ` L${round(b.x)} ${round(b.y)}`;
        continue;
      }
      const inLength = Math.hypot(b.x - a.x, b.y - a.y);
      const outLength = Math.hypot(c.x - b.x, c.y - b.y);
      const r = Math.min(BEND, inLength / 2, outLength / 2);
      if (r < 0.5 || inLength === 0 || outLength === 0) {
        path += ` L${round(b.x)} ${round(b.y)}`;
        continue;
      }
      const before = { x: b.x - ((b.x - a.x) / inLength) * r, y: b.y - ((b.y - a.y) / inLength) * r };
      const after = { x: b.x + ((c.x - b.x) / outLength) * r, y: b.y + ((c.y - b.y) / outLength) * r };
      path += ` L${round(before.x)} ${round(before.y)} Q${round(b.x)} ${round(b.y)} ${round(after.x)} ${round(after.y)}`;
    } else if (curve === 'ortho-v' || curve === 'ortho-h') {
      path += orthoSegment(a, b, curve === 'ortho-v');
    } else if (curve === 'smooth-v') {
      const mid = (a.y + b.y) / 2;
      path += ` C${round(a.x)} ${round(mid)} ${round(b.x)} ${round(mid)} ${round(b.x)} ${round(b.y)}`;
    } else if (curve === 'smooth-h') {
      const mid = (a.x + b.x) / 2;
      path += ` C${round(mid)} ${round(a.y)} ${round(mid)} ${round(b.y)} ${round(b.x)} ${round(b.y)}`;
    } else {
      path += ` L${round(b.x)} ${round(b.y)}`;
    }
  }
  return path;
}

/** Where the arrow head should point from: the direction the curve arrives at `end`. */
export function arrivalFrom(points: readonly Point[], curve: Curve, atEnd: boolean): Point {
  const end = atEnd ? points[points.length - 1] : points[0];
  const neighbor = atEnd ? points[points.length - 2] : points[1];
  if (curve === 'smooth-v' || curve === 'ortho-v') return { x: end.x, y: end.y + (neighbor.y <= end.y ? -1 : 1) };
  if (curve === 'smooth-h' || curve === 'ortho-h') return { x: end.x + (neighbor.x <= end.x ? -1 : 1), y: end.y };
  return neighbor;
}
