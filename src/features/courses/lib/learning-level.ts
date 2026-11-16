// Deep imports on purpose: the journey's data file and its id list hold no code (type-only imports), so reading them here makes no
// require cycle, while the journey's index pulls in screens that import this feature back.
import { AI_BUILDER_JOURNEY } from '@/features/journey/data/journey';
import { JOURNEY_LEVELS, type JourneyLevelId } from '@/features/journey/lib/focus-ids';
import type { JourneyDefinition } from '@/features/journey/lib/types';

import type { Course, CourseLevel } from '../content/types';

/**
 * Talino's four learning levels, as a COURSE's difficulty (never the learner's own experience, which is `ExperienceLevel`).
 *
 * The level of a course is where the learning journey places it (`features/journey/data/journey.ts`): that placement came from a
 * lesson-by-lesson audit of what each course assumes and which courses it needs first (docs/content/JOURNEY_LEVELS.md), not from
 * titles. Home and Discover therefore always agree on a course's level, and a course added to the journey gets its level everywhere.
 * A course the journey does not place yet (the journey's own test fails then) falls back to the catalog's three-level `level`.
 */
export type LearningLevel = JourneyLevelId;
export const LEARNING_LEVELS: readonly LearningLevel[] = JOURNEY_LEVELS;

export const LEARNING_LEVEL_INDEX: Readonly<Record<LearningLevel, number>> = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };

/** The name and the one-line "who it is for" of each level, as Discover shows them. */
export const LEARNING_LEVEL_TEXT: Readonly<Record<LearningLevel, { label: string; description: string; icon: string }>> = {
  beginner: { label: 'Beginner', description: 'AI fundamentals, prompting and your first AI-built projects.', icon: 'school' },
  intermediate: { label: 'Intermediate', description: 'Build working apps and practical AI-assisted development skills.', icon: 'construction' },
  advanced: { label: 'Advanced', description: 'AI agents, integrations, advanced engineering and complex apps.', icon: 'psychology' },
  expert: { label: 'Expert', description: 'Production-grade AI systems, launching products and scaling them.', icon: 'rocket_launch' },
};

const FALLBACK: Readonly<Record<CourseLevel, LearningLevel>> = { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' };

/** Course id → level, read from where each course's `learn` step sits in the journey. */
export function placementFrom(journey: JourneyDefinition): Map<string, LearningLevel> {
  const placement = new Map<string, LearningLevel>();
  for (const stage of journey.stages) {
    for (const milestone of stage.milestones) {
      for (const step of milestone.steps) {
        if (step.kind === 'learn' && !placement.has(step.courseId)) placement.set(step.courseId, stage.level);
      }
    }
  }
  return placement;
}

let journeyPlacement: Map<string, LearningLevel> | null = null;

/** The level of one course: its place in the journey, else its catalog level. */
export function learningLevelOf(course: Pick<Course, 'id' | 'level'>, placement: ReadonlyMap<string, LearningLevel> = (journeyPlacement ??= placementFrom(AI_BUILDER_JOURNEY))): LearningLevel {
  return placement.get(course.id) ?? FALLBACK[course.level ?? 'beginner'];
}

export function isLearningLevel(value: unknown): value is LearningLevel {
  return typeof value === 'string' && (LEARNING_LEVELS as readonly string[]).includes(value);
}

/** One level up, or null at Expert. */
export function nextLearningLevel(level: LearningLevel): LearningLevel | null {
  return LEARNING_LEVELS[LEARNING_LEVEL_INDEX[level] + 1] ?? null;
}
