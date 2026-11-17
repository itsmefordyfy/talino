import type { Tone } from '@/constants/theme';

import type { JourneyLevelId } from './focus-ids';
import type { MapLayout } from './layout';
import { LEVEL_TONE } from './level-tones';

/** The stretch of the map that belongs to one level, washed in that level's tone behind its banner and courses. */
export type LevelZone = { top: number; bottom: number; tone: Tone };

/**
 * The map's levels as zones: the first reaches up to the top of the map, each later one begins at its banner, and each ends where the next
 * begins (the last at the map's bottom), so there is no gap and no overlap. Pure, so the wash always meets its banners.
 */
export function levelZones(layout: MapLayout, levels: readonly JourneyLevelId[]): LevelZone[] {
  const banners = layout.items.filter((item): item is Extract<MapLayout['items'][number], { kind: 'stage' }> => item.kind === 'stage');
  return levels.flatMap((level, index) => {
    const banner = banners[index];
    if (!banner) return [];
    const next = banners[index + 1];
    return [{ top: index === 0 ? 0 : banner.y, bottom: next ? next.y : layout.height, tone: LEVEL_TONE[level].tone }];
  });
}
