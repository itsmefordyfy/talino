/**
 * The directions a learner can lean towards, which decide which milestones are required for them and which are optional. Kept in its own
 * file with no imports so settings can validate a saved choice without depending on the rest of the journey.
 */
export const JOURNEY_FOCUS_IDS = ['web', 'ai', 'mobile', 'freelance', 'hired', 'teach'] as const;
export type JourneyFocusId = (typeof JOURNEY_FOCUS_IDS)[number];

export function cleanJourneyFocus(value: unknown): JourneyFocusId[] | null {
  if (!Array.isArray(value)) return null;
  const picked = JOURNEY_FOCUS_IDS.filter((id) => value.includes(id));
  return picked.length > 0 ? picked : null;
}

/** The journey's four levels, in order. A course's level is how much it assumes about building with AI, never the learner's own programming experience. */
export const JOURNEY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type JourneyLevelId = (typeof JOURNEY_LEVELS)[number];

export function cleanJourneyLevel(value: unknown): JourneyLevelId | null {
  return typeof value === 'string' && (JOURNEY_LEVELS as readonly string[]).includes(value) ? (value as JourneyLevelId) : null;
}
