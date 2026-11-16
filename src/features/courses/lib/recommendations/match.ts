import type { CategoryId, CourseLevel, LearningGoalId } from '../../content/types';
import type { CourseFacts } from '../catalog-facts';

/**
 * A "target" is what a learner answer (a goal or an interest) points at, written in catalog attributes: never course ids.
 * It is matched against any course's facts, so a course added tomorrow with the right metadata is found without a code change.
 */
export type TopicTarget = {
  /** Catalog learning goals (`CourseMeta.goals`) this answer serves. */
  goals?: readonly LearningGoalId[];
  /** Categories a course of this topic sits in. */
  categories?: readonly CategoryId[];
  /** Technology ids (`technologies.ts`) that a course dedicated to the topic teaches. Earlier in a course's list means more central. */
  technologies?: readonly string[];
  /** Words a course dedicated to the topic carries in its tags or title. */
  tags?: readonly string[];
  /** The nearest things, for topics the catalog has no course of its own for yet: matched at a lower weight, and never called "dedicated". */
  near?: { categories?: readonly CategoryId[]; technologies?: readonly string[]; tags?: readonly string[] };
};

export const LEVEL_INDEX: Record<CourseLevel, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/** How central a technology is to a course, by its place in the course's technology list (the first is the one the course is about). */
const POSITION_WEIGHT = [1, 0.75, 0.5, 0.35];
export const positionWeight = (position: number): number => POSITION_WEIGHT[position] ?? 0.2;

/** A technology placed in the first two spots of a course's list counts as "the course teaches it", not "it mentions it". */
const DEDICATED_POSITIONS = 2;

const GOAL_WEIGHT = 3;
const CATEGORY_WEIGHT = 2;
const TECHNOLOGY_WEIGHT = 2.6;
const TAG_WEIGHT = 1.6;
const NEAR_FACTOR = 0.3;

/** How rare each goal / technology is across the catalog, 0 (everywhere) to 1 (one course): a hit on a rare one says more. */
export type Rarity = {
  goal: (goal: LearningGoalId) => number;
  technology: (technology: string) => number;
};
export const FLAT_RARITY: Rarity = { goal: () => 0.6, technology: () => 0.6 };

function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()} `;
}

const haystacks = new WeakMap<CourseFacts, { tags: string[]; title: string }>();
function haystackOf(facts: CourseFacts): { tags: string[]; title: string } {
  let found = haystacks.get(facts);
  if (!found) {
    found = { tags: facts.tags.map(normalize), title: normalize(`${facts.course.title} ${facts.id.replace(/-/g, ' ')}`) };
    haystacks.set(facts, found);
  }
  return found;
}

/** Whether the course's tags or title say this word or phrase (whole words, so "java" never matches "javascript"). */
export function mentions(facts: CourseFacts, phrase: string): boolean {
  const wanted = normalize(phrase);
  const { tags, title } = haystackOf(facts);
  return title.includes(wanted) || tags.some((tag) => tag.includes(wanted));
}

export type TargetMatch = {
  /** Everything added up. */
  total: number;
  /** A dedicated technology or tag matched (not just a category or a near topic): this course is about the topic. */
  direct: boolean;
  /** Only the nearest-topic parts matched. */
  nearOnly: boolean;
};

const NO_MATCH: TargetMatch = { total: 0, direct: false, nearOnly: false };

function technologyPart(facts: CourseFacts, technologies: readonly string[] | undefined, rarity: Rarity): { sum: number; dedicated: boolean } {
  let sum = 0;
  let dedicated = false;
  for (const technology of technologies ?? []) {
    const position = facts.technologies.indexOf(technology);
    if (position < 0) continue;
    sum += positionWeight(position) * (0.5 + 0.5 * rarity.technology(technology));
    if (position < DEDICATED_POSITIONS) dedicated = true;
  }
  return { sum: Math.min(sum, 1.6), dedicated };
}

function tagPart(facts: CourseFacts, tags: readonly string[] | undefined): number {
  let hits = 0;
  for (const tag of tags ?? []) if (mentions(facts, tag)) hits += 1;
  return hits;
}

/** How strongly one course matches one target; 0 when nothing does. */
export function matchTarget(facts: CourseFacts, target: TopicTarget, rarity: Rarity): TargetMatch {
  let total = 0;
  const goalHits = (target.goals ?? []).filter((goal) => facts.goals.includes(goal));
  if (goalHits.length > 0) total += GOAL_WEIGHT * Math.min(1, goalHits.reduce((sum, goal) => sum + rarity.goal(goal), 0));
  if (target.categories?.includes(facts.category)) total += CATEGORY_WEIGHT;
  const technology = technologyPart(facts, target.technologies, rarity);
  total += TECHNOLOGY_WEIGHT * technology.sum;
  const tagHits = tagPart(facts, target.tags);
  total += TAG_WEIGHT * Math.min(tagHits, 3);
  const direct = technology.dedicated || tagHits > 0;

  let near = 0;
  if (target.near) {
    if (target.near.categories?.includes(facts.category)) near += CATEGORY_WEIGHT;
    near += TECHNOLOGY_WEIGHT * technologyPart(facts, target.near.technologies, rarity).sum;
    near += TAG_WEIGHT * Math.min(tagPart(facts, target.near.tags), 3);
  }
  total += NEAR_FACTOR * near;
  if (total === 0) return NO_MATCH;
  return { total, direct, nearOnly: !direct && near > 0 && goalHits.length === 0 && !target.categories?.includes(facts.category) };
}
