/**
 * The five learner experience levels, in one place. They describe how much PROGRAMMING the learner has done, not how
 * well they know AI tools: a professional developer can be new to Claude Code, and a complete beginner can already use
 * ChatGPT. Onboarding asks for one (`onboarding/lib/options`), lessons adapt to it (`Audience` on a block, a quiz
 * question, an activity or a project step), and the recommendations read it. Nothing here ever locks a course: a
 * learner can switch level, take the skill check, or choose "Show everything" at any time, and progress is kept.
 *
 * This file imports nothing, so content, activities and onboarding can all depend on it without cycles.
 */

export const EXPERIENCE_LEVELS = ['complete-beginner', 'beginner', 'intermediate', 'advanced', 'professional'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/** What each level means, in the learner's own words (shown in onboarding, settings and the lesson's level note). */
export const EXPERIENCE_SUMMARY: Record<ExperienceLevel, { label: string; description: string }> = {
  'complete-beginner': { label: 'Complete Beginner', description: 'I have never written code.' },
  beginner: { label: 'Beginner', description: 'I know a few programming basics.' },
  intermediate: { label: 'Intermediate', description: 'I have built small projects.' },
  advanced: { label: 'Advanced', description: 'I already have development experience.' },
  professional: { label: 'Professional', description: 'I work as a software developer.' },
};

/**
 * Which learner levels a piece of content is written for, as an inclusive range on the five-step scale. No range, or an
 * empty one, means everybody. `{ max: 'beginner' }` is for complete beginners and beginners (a plain-language
 * explanation); `{ min: 'advanced' }` is for advanced learners and professionals (a production concern, a harder
 * question); `{ min: 'intermediate', max: 'intermediate' }` is for exactly one level.
 */
export type Audience = { min?: ExperienceLevel; max?: ExperienceLevel };

export function levelIndex(level: ExperienceLevel): number {
  return EXPERIENCE_LEVELS.indexOf(level);
}

/** True when `level` is inside the audience (or the content has none). A learner whose level is unknown sees the shared content only. */
export function inAudience(audience: Audience | undefined, level: ExperienceLevel | null | undefined): boolean {
  if (!audience || (!audience.min && !audience.max)) return true;
  if (!level) return false;
  const at = levelIndex(level);
  return at >= (audience.min ? levelIndex(audience.min) : 0) && at <= (audience.max ? levelIndex(audience.max) : EXPERIENCE_LEVELS.length - 1);
}

/** Keeps the items for this level. `showAll` is the learner's "Show everything" choice: nothing is ever withheld for good. */
export function forLevel<T extends { audience?: Audience }>(items: readonly T[], level: ExperienceLevel | null | undefined, showAll = false): T[] {
  return showAll ? [...items] : items.filter((item) => inAudience(item.audience, level));
}

/** True when some item is hidden for this level, so the screen knows to offer "Show everything". */
export function hasLevelContent(items: readonly { audience?: Audience }[], level: ExperienceLevel | null | undefined): boolean {
  return items.some((item) => !inAudience(item.audience, level));
}

/** The three course difficulty tiers (catalog filters, course cards) as a range of learner levels who are well served by them. */
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

const SUITS: Record<CourseDifficulty, [ExperienceLevel, ExperienceLevel]> = {
  beginner: ['complete-beginner', 'beginner'],
  intermediate: ['beginner', 'intermediate'],
  advanced: ['advanced', 'professional'],
};

/** The learner levels a course of this difficulty is aimed at (advice shown on cards, never a restriction). */
export function levelsSuitedTo(difficulty: CourseDifficulty): ExperienceLevel[] {
  const [from, to] = SUITS[difficulty];
  return EXPERIENCE_LEVELS.slice(levelIndex(from), levelIndex(to) + 1);
}

/** The course difficulty tier that matches a learner level best (used to order a path and to pick what to suggest). */
export function difficultyFor(level: ExperienceLevel): CourseDifficulty {
  if (level === 'complete-beginner' || level === 'beginner') return 'beginner';
  return level === 'intermediate' ? 'intermediate' : 'advanced';
}
