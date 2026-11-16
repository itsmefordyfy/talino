import type { LearningPathDef } from '@/features/courses/content/catalog/paths';
import type { CourseFacts } from '@/features/courses/lib/catalog-facts';
import { LEARNING_LEVELS, LEARNING_LEVEL_INDEX, LEARNING_LEVEL_TEXT, type LearningLevel } from '@/features/courses/lib/learning-level';

export type PathSummary = {
  path: LearningPathDef;
  /** Its courses that exist in the catalog. */
  count: number;
  done: number;
  /** Total lesson minutes of those courses. */
  minutes: number;
  /** The easiest and hardest learning level among its courses ("Beginner → Advanced"). */
  fromLevel: LearningLevel;
  toLevel: LearningLevel;
};

/** Each path with what is computed from its real courses: how many, how many done, how long, and the levels it spans. */
export function pathSummaries(paths: readonly LearningPathDef[], facts: readonly CourseFacts[], completed: ReadonlySet<string>): PathSummary[] {
  const byId = new Map(facts.map((fact) => [fact.id, fact]));
  return paths
    .map((path): PathSummary | null => {
      const courses = path.courseIds.map((id) => byId.get(id)).filter((fact): fact is CourseFacts => !!fact);
      if (courses.length === 0) return null;
      const levels = courses.map((fact) => LEARNING_LEVEL_INDEX[fact.learningLevel]);
      return {
        path,
        count: courses.length,
        done: courses.filter((fact) => completed.has(fact.id)).length,
        minutes: courses.reduce((sum, fact) => sum + fact.minutes, 0),
        fromLevel: LEARNING_LEVELS[Math.min(...levels)],
        toLevel: LEARNING_LEVELS[Math.max(...levels)],
      };
    })
    .filter((summary): summary is PathSummary => summary !== null);
}

/** The prerequisites a path takes for granted that exist in the catalog (shown as "Before you start"). */
export function pathAssumes(path: LearningPathDef, facts: readonly CourseFacts[]): CourseFacts[] {
  const byId = new Map(facts.map((fact) => [fact.id, fact]));
  return (path.assumes ?? []).map((id) => byId.get(id)).filter((fact): fact is CourseFacts => !!fact);
}

export type LevelBrowseEntry = { level: LearningLevel; label: string; description: string; icon: string; count: number };

/** The four learning levels for "Browse by level", each with how many published courses it holds. */
export function levelBrowse(facts: readonly CourseFacts[]): LevelBrowseEntry[] {
  return LEARNING_LEVELS.map((level) => ({ level, ...LEARNING_LEVEL_TEXT[level], count: facts.filter((fact) => fact.learningLevel === level).length }));
}

/** A course this short counts as a short course even when it is not a mini-course. */
export const SHORT_MINUTES = 90;

/** "Short courses and mini-courses": the mini-courses and anything under 90 minutes, shortest first. */
export function shortCourses(facts: readonly CourseFacts[]): CourseFacts[] {
  return facts.filter((fact) => fact.availability === 'available' && (fact.kind === 'mini' || fact.minutes < SHORT_MINUTES)).sort((a, b) => a.minutes - b.minutes);
}
