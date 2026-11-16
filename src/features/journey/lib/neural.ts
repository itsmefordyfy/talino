/**
 * The neural look of the journey map, as pure geometry so it is tested and identical on every render: a field of faint neurons and
 * synapses behind the map (`neuralMesh`), the short dendrites that tie each milestone into that field (`nearestPoints`), the extra
 * synapses between milestones that depend on one further back (`crossLinks`), and the length of a curve (for the travelling signal).
 * Nothing here is random at run time: the same width and height always give the same picture.
 */

export type MeshPoint = { x: number; y: number; r: number; bright: boolean };
export type Mesh = { points: readonly MeshPoint[]; edges: readonly (readonly [number, number])[] };
export type Avoid = { x: number; y: number; radius: number };

/** A small deterministic random sequence (mulberry32). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A field of neurons on a jittered grid (about one per `cell` square), each joined to up to two of its nearest neighbours. Points
 * that would sit on a milestone (`avoid`) are left out, so the field never crowds the real nodes.
 */
export function neuralMesh(width: number, height: number, options: { cell?: number; seed?: number; avoid?: readonly Avoid[] } = {}): Mesh {
  const cell = options.cell ?? 96;
  const random = seeded(options.seed ?? 7);
  const avoid = options.avoid ?? [];
  if (width <= 0 || height <= 0) return { points: [], edges: [] };
  const columns = Math.max(1, Math.round(width / cell));
  const rows = Math.max(1, Math.ceil(height / cell));
  const cellWidth = width / columns;
  const points: MeshPoint[] = [];
  const grid = new Map<string, number[]>();
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const keep = random() < 0.82;
      const x = (column + 0.15 + random() * 0.7) * cellWidth;
      const y = (row + 0.15 + random() * 0.7) * cell;
      const r = 1.4 + random() * 1.8;
      const bright = random() < 0.12;
      if (!keep || y > height) continue;
      if (avoid.some((spot) => Math.hypot(spot.x - x, spot.y - y) < spot.radius)) continue;
      const index = points.length;
      points.push({ x, y, r, bright });
      const key = `${column}:${row}`;
      grid.set(key, [...(grid.get(key) ?? []), index]);
    }
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const reach = cell * 1.7;
  points.forEach((point, index) => {
    const column = Math.floor(point.x / cellWidth);
    const row = Math.floor(point.y / cell);
    const near: { other: number; distance: number }[] = [];
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        for (const other of grid.get(`${column + dc}:${row + dr}`) ?? []) {
          if (other === index) continue;
          const distance = Math.hypot(points[other]!.x - point.x, points[other]!.y - point.y);
          if (distance <= reach) near.push({ other, distance });
        }
      }
    }
    near.sort((a, b) => a.distance - b.distance);
    for (const { other } of near.slice(0, 2)) {
      const key = index < other ? `${index}-${other}` : `${other}-${index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([index, other]);
    }
  });
  return { points, edges };
}

/** The indices of the `count` field neurons nearest to `at` and within `maxDistance`, nearest first: a milestone's dendrites. */
export function nearestPoints(mesh: Mesh, at: { x: number; y: number }, count: number, maxDistance: number): number[] {
  return mesh.points
    .map((point, index) => ({ index, distance: Math.hypot(point.x - at.x, point.y - at.y) }))
    .filter((entry) => entry.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.index);
}

/**
 * Extra synapses: a milestone that depends on one further back than the milestone just before it is wired to that one too, so the
 * map shows the real structure of the journey (a challenge beside the road, two courses feeding a capstone). Pairs of journey indexes.
 */
export function crossLinks(milestones: readonly { id: string; requires?: readonly string[] }[]): [number, number][] {
  const indexOf = new Map(milestones.map((milestone, index) => [milestone.id, index]));
  const links: [number, number][] = [];
  milestones.forEach((milestone, index) => {
    for (const id of milestone.requires ?? []) {
      const from = indexOf.get(id);
      if (from !== undefined && from < index - 1) links.push([from, index]);
    }
  });
  return links;
}

/** A curve that bows outwards (away from the map's centre line) between two far-apart nodes, so a cross link reads as its own synapse rather than lying on the main one. Kept inside the map. */
export function arcBetween(from: { x: number; y: number }, to: { x: number; y: number }, bow: number, width: number): string {
  const midY = (from.y + to.y) / 2;
  const middle = (from.x + to.x) / 2;
  const outwards = middle >= width / 2 ? 1 : -1;
  const cx = Math.min(width - 12, Math.max(12, middle + outwards * bow));
  return `M ${round(from.x)} ${round(from.y)} Q ${round(cx)} ${round(midY)}, ${round(to.x)} ${round(to.y)}`;
}

/** Points along the S-curve `curveBetween` draws (its two ends included), for something that travels along it. */
export function curvePoints(from: { x: number; y: number }, to: { x: number; y: number }, count: number): { x: number; y: number }[] {
  const mid = (from.y + to.y) / 2;
  return Array.from({ length: Math.max(2, count) }, (_, i) => {
    const t = i / (Math.max(2, count) - 1);
    const u = 1 - t;
    return {
      x: u * u * u * from.x + 3 * u * u * t * from.x + 3 * u * t * t * to.x + t * t * t * to.x,
      y: u * u * u * from.y + 3 * u * u * t * mid + 3 * u * t * t * mid + t * t * t * to.y,
    };
  });
}

/** The length of the S-curve `curveBetween` draws between two points, by sampling (good to about a percent). */
export function curveLength(from: { x: number; y: number }, to: { x: number; y: number }): number {
  const mid = (from.y + to.y) / 2;
  const at = (t: number) => {
    const u = 1 - t;
    // Control points: (from.x, mid) and (to.x, mid).
    const x = u * u * u * from.x + 3 * u * u * t * from.x + 3 * u * t * t * to.x + t * t * t * to.x;
    const y = u * u * u * from.y + 3 * u * u * t * mid + 3 * u * t * t * mid + t * t * t * to.y;
    return { x, y };
  };
  let length = 0;
  let previous = at(0);
  for (let i = 1; i <= 24; i += 1) {
    const next = at(i / 24);
    length += Math.hypot(next.x - previous.x, next.y - previous.y);
    previous = next;
  }
  return length;
}

const round = (value: number) => Math.round(value * 10) / 10;
