import type { CourseFacts } from '@/features/courses/lib/catalog-facts';
import { sortCourses } from '@/features/courses/lib/discovery/sort';
import { fitsLevel, levelFit } from '@/features/courses/lib/recommendations';
import { EXPERIENCE_LEVELS, type ExperienceLevel } from '@/features/onboarding/lib/options';

/**
 * Friendly first steps for a learner we know nothing about (or whose answers pointed at nothing in the catalog): the free
 * starter course first, then beginner courses with the fewest prerequisites and the shortest to finish. All from the
 * catalog's own facts; nothing is claimed about popularity. Courses already started or completed are left out. For a learner who said
 * they are intermediate or more (`experience`), the basics are not what they are offered: the courses at their own level come first, the
 * ones with the fewest prerequisites and the shortest among them.
 */
export function startHere(facts: readonly CourseFacts[], taken: { completed: ReadonlySet<string>; started: ReadonlyMap<string, unknown>; experience?: ExperienceLevel | null }, limit = 6): CourseFacts[] {
  const open = facts.filter((fact) => fact.availability === 'available' && !taken.completed.has(fact.id) && !taken.started.has(fact.id));
  const experience = taken.experience ?? 'complete-beginner';
  if (EXPERIENCE_LEVELS.indexOf(experience) >= 2) {
    const atTheirLevel = open.filter((fact) => fitsLevel(experience, fact.level));
    return [...atTheirLevel].sort((a, b) => levelFit(experience, b.level) - levelFit(experience, a.level) || a.prerequisites.length - b.prerequisites.length || a.minutes - b.minutes).slice(0, limit);
  }
  const friendly = sortCourses(
    open.filter((fact) => fact.level === 'beginner'),
    'beginner-friendly',
  );
  const starters = friendly.filter((fact) => fact.kind === 'starter');
  return [...starters, ...friendly.filter((fact) => fact.kind !== 'starter')].slice(0, limit);
}
