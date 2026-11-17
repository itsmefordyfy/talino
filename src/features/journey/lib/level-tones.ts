import { LevelTones, type Tone } from '@/constants/theme';

import type { JourneyLevelId } from './focus-ids';

/**
 * Each level's own color (`LevelTones` in the theme: Beginner mint, Intermediate blue, Advanced violet, Expert gold), shared by a level's
 * banner, the map's background and its courses, so the page behind a level, its banner and its nodes are all the same color. `solid`:
 * Expert's badge is filled rather than tinted, the mark of the top level.
 */
export const LEVEL_TONE: Readonly<Record<JourneyLevelId, { tone: Tone; solid: boolean }>> = {
  beginner: { tone: LevelTones.beginner, solid: false },
  intermediate: { tone: LevelTones.intermediate, solid: false },
  advanced: { tone: LevelTones.advanced, solid: false },
  expert: { tone: LevelTones.expert, solid: true },
};
