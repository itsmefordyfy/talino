/**
 * Talino's highest certificate: the AI Builder Journey on Home finished at every level, Beginner, Intermediate, Advanced and
 * Expert (owner, 2026-11-16: "a new certificate that certifies finishing all courses from beginner, intermediate, advanced,
 * expert level … considered as expert in AI … the highest certificate, unique from the other normal certificates").
 *
 * Earned only when the journey is complete AND each of the four levels is complete. A learner who started higher up has the
 * earlier levels' untouched milestones skipped (the journey can then reach its end without them), but a skipped level is not a
 * finished one, so the certificate waits until those are done too. Optional side steps (freelance, teaching…) are never required.
 */
export const JOURNEY_CERTIFICATE_ID = 'ai-journey';
export const JOURNEY_CERTIFICATE_TITLE = 'Certified AI Expert';
export const JOURNEY_CERTIFICATE_PROGRAM = 'Talino AI Builder Journey';

export const JOURNEY_CERTIFICATE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type JourneyCertificateLevel = (typeof JOURNEY_CERTIFICATE_LEVELS)[number];

export const JOURNEY_LEVEL_NAMES: Readonly<Record<JourneyCertificateLevel, string>> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };

/** What the rule reads from the journey's state (`JourneyState`): its completion and each level's. */
export type JourneyCertificateInput = {
  complete: boolean;
  stages: readonly { level: string; complete: boolean; done: number; total: number }[];
};

export type JourneyCertificateLevelState = { level: JourneyCertificateLevel; name: string; complete: boolean; done: number; total: number };

export type JourneyCertificateStatus = {
  levels: JourneyCertificateLevelState[];
  levelsComplete: number;
  earned: boolean;
};

export function journeyCertificateStatus(input: JourneyCertificateInput): JourneyCertificateStatus {
  const levels = JOURNEY_CERTIFICATE_LEVELS.map((level): JourneyCertificateLevelState => {
    const stage = input.stages.find((entry) => entry.level === level);
    return { level, name: JOURNEY_LEVEL_NAMES[level], complete: !!stage?.complete, done: stage?.done ?? 0, total: stage?.total ?? 0 };
  });
  const levelsComplete = levels.filter((level) => level.complete).length;
  return { levels, levelsComplete, earned: input.complete && levelsComplete === levels.length };
}
