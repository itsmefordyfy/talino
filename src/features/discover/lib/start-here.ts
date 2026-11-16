import type { CourseFacts } from '@/features/courses/lib/catalog-facts';
import { sortCourses } from '@/features/courses/lib/discovery/sort';

/**
 * Friendly first steps for a learner we know nothing about (or whose answers pointed at nothing in the catalog): the free
 * starter course first, then beginner courses with the fewest prerequisites and the shortest to finish. All from the
 * catalog's own facts; nothing is claimed about popularity. Courses already started or completed are left out.
 */
export function startHere(facts: readonly CourseFacts[], taken: { completed: ReadonlySet<string>; started: ReadonlyMap<string, unknown> }, limit = 6): CourseFacts[] {
  const open = facts.filter((fact) => fact.availability === 'available' && !taken.completed.has(fact.id) && !taken.started.has(fact.id));
  const friendly = sortCourses(
    open.filter((fact) => fact.level === 'beginner'),
    'beginner-friendly',
  );
  const starters = friendly.filter((fact) => fact.kind === 'starter');
  return [...starters, ...friendly.filter((fact) => fact.kind !== 'starter')].slice(0, limit);
}
