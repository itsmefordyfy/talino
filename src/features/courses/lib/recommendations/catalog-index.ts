import type { LearningGoalId } from '../../content/types';
import type { CourseFacts } from '../catalog-facts';
import type { Rarity } from './match';

/**
 * A catalog's facts arranged for scoring: lookups by id, the order, how rare each goal and technology is, and each
 * course's chain of prerequisites. Built once per catalog (cached on the facts array), so scoring many courses is cheap.
 */
export type CatalogIndex = {
  facts: readonly CourseFacts[];
  byId: ReadonlyMap<string, CourseFacts>;
  order: ReadonlyMap<string, number>;
  rarity: Rarity;
  /** Every prerequisite of a course, direct ones first then the ones behind them, only ids that exist in the catalog. */
  prerequisiteChain: (courseId: string) => string[];
  /** Every course that has this one anywhere in its chain of prerequisites. */
  dependentsOf: (courseId: string) => readonly string[];
};

/** A technology listed by more than this share of the catalog is a tool courses use everywhere, not a topic (see `match.ts`). */
const COMMON_TOOL_SHARE = 0.25;

const cache = new WeakMap<readonly CourseFacts[], CatalogIndex>();

export function catalogIndex(facts: readonly CourseFacts[]): CatalogIndex {
  const cached = cache.get(facts);
  if (cached) return cached;

  const byId = new Map(facts.map((course) => [course.id, course]));
  const order = new Map(facts.map((course, index) => [course.id, index]));
  const total = Math.max(1, facts.length);
  const goalCount = new Map<LearningGoalId, number>();
  const technologyCount = new Map<string, number>();
  for (const course of facts) {
    for (const goal of new Set(course.goals)) goalCount.set(goal, (goalCount.get(goal) ?? 0) + 1);
    for (const technology of new Set(course.technologies)) technologyCount.set(technology, (technologyCount.get(technology) ?? 0) + 1);
  }
  const rarity: Rarity = {
    goal: (goal) => 1 - (goalCount.get(goal) ?? 0) / total,
    technology: (technology) => 1 - (technologyCount.get(technology) ?? 0) / total,
    commonTool: (technology) => (technologyCount.get(technology) ?? 0) / total > COMMON_TOOL_SHARE,
  };

  const chains = new Map<string, string[]>();
  const prerequisiteChain = (courseId: string): string[] => {
    const known = chains.get(courseId);
    if (known) return known;
    const direct = (byId.get(courseId)?.prerequisites ?? []).filter((id) => byId.has(id) && id !== courseId);
    const chain = [...direct];
    const seen = new Set<string>([courseId, ...direct]);
    // Breadth first, with a seen set, so a cycle in the metadata can never loop forever.
    for (let index = 0; index < chain.length; index += 1) {
      for (const next of byId.get(chain[index])?.prerequisites ?? []) {
        if (byId.has(next) && !seen.has(next)) {
          seen.add(next);
          chain.push(next);
        }
      }
    }
    chains.set(courseId, chain);
    return chain;
  };

  let dependents: Map<string, string[]> | null = null;
  const dependentsOf = (courseId: string): readonly string[] => {
    if (!dependents) {
      dependents = new Map();
      for (const course of facts) for (const id of prerequisiteChain(course.id)) dependents.set(id, [...(dependents.get(id) ?? []), course.id]);
    }
    return dependents.get(courseId) ?? [];
  };

  const index: CatalogIndex = { facts, byId, order, rarity, prerequisiteChain, dependentsOf };
  cache.set(facts, index);
  return index;
}
