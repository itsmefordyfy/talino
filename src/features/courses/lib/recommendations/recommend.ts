import type { CourseFacts } from '../catalog-facts';
import { catalogIndex } from './catalog-index';
import { learnerExperience, scoreCourse, type CourseScore } from './score';
import type { LearnerSignals } from './signals';

export type Recommendation = CourseScore & { facts: CourseFacts };

export type RecommendOptions = {
  /**
   * `next` (default): what to take next: completed courses are left out, and so are courses already started (they belong
   * to "continue learning") unless `includeStarted` is set. `everything`: every course in the catalog, never filtered:
   * new ones first by score, then started ones, then completed ones.
   */
  scope?: 'next' | 'everything';
  /** With scope `next`, rank started courses too (the learning plan can start with the course the learner is already in). */
  includeStarted?: boolean;
  /** Keep only the first N after ranking; the ranking itself never drops a course. */
  limit?: number;
};

const STATUS_RANK = { new: 0, 'in-progress': 1, completed: 2 } as const;

/**
 * The whole catalog ranked for one learner, best first. Personalizes the order, never the choice: with
 * `scope: 'everything'` the result has exactly as many entries as the catalog has courses.
 */
export function recommendCourses(signals: LearnerSignals, facts: readonly CourseFacts[], options: RecommendOptions = {}): Recommendation[] {
  const index = catalogIndex(facts);
  const scope = options.scope ?? 'next';
  const scored = facts.map((course): Recommendation => ({ facts: course, ...scoreCourse(course, signals, index) }));
  const kept = scope === 'everything' ? scored : scored.filter((entry) => entry.status === 'new' || (entry.status === 'in-progress' && options.includeStarted === true));
  const ranked = kept.sort((a, b) => {
    if (scope === 'everything' && a.status !== b.status) return STATUS_RANK[a.status] - STATUS_RANK[b.status];
    return b.score - a.score || b.facts.foundation - a.facts.foundation || (index.order.get(a.facts.id) ?? 0) - (index.order.get(b.facts.id) ?? 0);
  });
  const experience = learnerExperience(signals, index);
  const ordered = foundationsFirst(ranked, experience === 'complete-beginner' || experience === 'beginner');
  return options.limit === undefined ? ordered : ordered.slice(0, Math.max(0, options.limit));
}

/**
 * For someone still learning the basics a course is never listed before the foundation it builds on: each unmet prerequisite
 * that is in the list (and in the same group: new, started or completed) is moved up to just before the course. Nothing is
 * removed and the rest of the order stays as scored; a more experienced learner is not reordered at all.
 */
function foundationsFirst(ranked: Recommendation[], beginner: boolean): Recommendation[] {
  if (!beginner) return ranked;
  const byId = new Map(ranked.map((entry) => [entry.facts.id, entry]));
  const placed = new Set<string>();
  const result: Recommendation[] = [];
  const place = (entry: Recommendation, visiting: Set<string>) => {
    if (placed.has(entry.facts.id) || visiting.has(entry.facts.id)) return;
    visiting.add(entry.facts.id);
    for (const id of entry.readiness.missing) {
      const prerequisite = byId.get(id);
      if (prerequisite && prerequisite.status === entry.status) place(prerequisite, visiting);
    }
    placed.add(entry.facts.id);
    result.push(entry);
  };
  for (const entry of ranked) place(entry, new Set());
  return result;
}
