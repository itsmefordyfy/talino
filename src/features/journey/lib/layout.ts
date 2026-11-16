/**
 * Where everything sits on the journey map, from the width available. Pure, so the zigzag, the spacing and the path's curves are tested
 * rather than guessed at on a phone. The map is one tall column: a banner for each stage, then its milestones as nodes that swing left
 * and right of the centre, with a curved path running through every node centre in order.
 */

export type LayoutItem =
  | { kind: 'stage'; stageIndex: number; y: number; height: number }
  /** `guideHeight` is the room kept above the node for Tali's guide card (only the learner's current node has any). */
  | { kind: 'node'; milestoneIndex: number; stageIndex: number; x: number; y: number; height: number; guideHeight: number };

export type MapLayout = {
  width: number;
  height: number;
  items: readonly LayoutItem[];
  /** Node centres in journey order, for the path. */
  points: readonly { x: number; y: number; milestoneIndex: number }[];
};

export const NODE_SIZE = 76;
export const CURRENT_NODE_SIZE = 92;
export const STAGE_HEIGHT = 132;
export const ROW_HEIGHT = 216;
/** Distance from a row's top to the centre of its node (the path runs through it), the same for the small and the large node. */
export const NODE_CENTER = 52;
/** Road left below the last node, running down into the destination card (which sits below the map, in the page's own flow). */
export const TAIL_HEIGHT = 64;
/** Room above the current node for Tali's guide card. */
export const GUIDE_HEIGHT = 124;
/** How far from the centre a node swings, as a share of the free width. */
const SWING = 0.28;

/** The horizontal swing of the n-th node of a stage: centre, right, centre, left, and round again (a gentle wave, never two in a row on one side). */
export function swingOf(position: number): -1 | 0 | 1 {
  return ([0, 1, 0, -1] as const)[position % 4]!;
}

export type LayoutStage = { milestoneCount: number; collapsed: boolean };

/** `guideAt`: the index of the milestone Tali stands above (the learner's current one), if any. */
export function layoutJourney(stages: readonly LayoutStage[], width: number, guideAt: number | null = null): MapLayout {
  const items: LayoutItem[] = [];
  const points: { x: number; y: number; milestoneIndex: number }[] = [];
  const centre = width / 2;
  const reach = Math.max(0, (width - CURRENT_NODE_SIZE) * SWING);
  let y = 12;
  let milestoneIndex = 0;
  stages.forEach((stage, stageIndex) => {
    items.push({ kind: 'stage', stageIndex, y, height: STAGE_HEIGHT });
    y += STAGE_HEIGHT;
    if (stage.collapsed) {
      milestoneIndex += stage.milestoneCount;
      return;
    }
    for (let n = 0; n < stage.milestoneCount; n += 1) {
      const x = centre + swingOf(n) * reach;
      const guideHeight = milestoneIndex === guideAt ? GUIDE_HEIGHT : 0;
      items.push({ kind: 'node', milestoneIndex, stageIndex, x, y, height: ROW_HEIGHT + guideHeight, guideHeight });
      points.push({ x, y: y + guideHeight + NODE_CENTER, milestoneIndex });
      milestoneIndex += 1;
      y += ROW_HEIGHT + guideHeight;
    }
  });
  return { width, height: y + TAIL_HEIGHT, items, points };
}

/** A smooth S-curve from one node centre to the next, as an SVG path (vertical tangents, so it flows like a road). */
export function curveBetween(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const mid = (from.y + to.y) / 2;
  return `M ${round(from.x)} ${round(from.y)} C ${round(from.x)} ${round(mid)}, ${round(to.x)} ${round(mid)}, ${round(to.x)} ${round(to.y)}`;
}

const round = (value: number) => Math.round(value * 10) / 10;
