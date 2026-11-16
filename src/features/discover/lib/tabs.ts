import { CATEGORY_IDS, type CategoryId } from '@/features/courses/content/types';
import type { CourseFacts } from '@/features/courses/lib/catalog-facts';
import { LEARNING_LEVELS, type LearningLevel } from '@/features/courses/lib/learning-level';

import type { DiscoverTab } from '../discover-slice';

/** The category tabs, in the catalog's order. */
export const CATEGORY_TABS: readonly CategoryId[] = CATEGORY_IDS;

/** Every course of one category, in catalog order. A course has exactly one category, so it is under exactly one category tab. */
export function categoryCourses(facts: readonly CourseFacts[], category: CategoryId): CourseFacts[] {
  return facts.filter((fact) => fact.category === category);
}

export type TabCounts = { all: number; byCategory: Record<CategoryId, number> };

/** The number on each tab: all courses, and the courses of each category (zero when a category has none yet). */
export function tabCounts(facts: readonly CourseFacts[]): TabCounts {
  const byCategory = Object.fromEntries(CATEGORY_TABS.map((category) => [category, 0])) as Record<CategoryId, number>;
  for (const fact of facts) byCategory[fact.category] = (byCategory[fact.category] ?? 0) + 1;
  return { all: facts.length, byCategory };
}

/**
 * The courses a tab is about, for narrowing and counting. A search covers the whole catalog whatever the tab (so a learner
 * is never stopped from finding a course in another category); For you and All are the whole catalog too.
 */
export function scopeFacts(facts: readonly CourseFacts[], tab: DiscoverTab | null, searchText: string): readonly CourseFacts[] {
  if (searchText.trim() !== '' || tab === null || tab === 'for-you' || tab === 'all') return facts;
  return categoryCourses(facts, tab);
}

export type LevelGroup = { level: LearningLevel; courses: CourseFacts[] };

/** Courses grouped by learning level, Beginner to Expert. Inside a group the order given is kept (the learner's sort); an empty level is left out. */
export function groupByLevel(courses: readonly CourseFacts[]): LevelGroup[] {
  return LEARNING_LEVELS.map((level) => ({ level, courses: courses.filter((course) => course.learningLevel === level) })).filter((group) => group.courses.length > 0);
}

export type ListItem = { type: 'header'; key: string; level: LearningLevel; count: number } | { type: 'row'; key: string; cells: (CourseFacts | null)[] };

function chunk(courses: readonly CourseFacts[], columns: number, keyPrefix: string): ListItem[] {
  const rows: ListItem[] = [];
  for (let start = 0; start < courses.length; start += columns) {
    const cells: (CourseFacts | null)[] = courses.slice(start, start + columns);
    // Empty cells keep a last, lone card the width of the others.
    while (cells.length < columns) cells.push(null);
    rows.push({ type: 'row', key: `${keyPrefix}:${start}`, cells });
  }
  return rows;
}

/** The list a results screen draws: rows of `columns` cards, with a title row per difficulty when the courses are grouped. */
export function buildRows(courses: readonly CourseFacts[], columns: number, grouped: boolean): ListItem[] {
  if (!grouped) return chunk(courses, columns, 'all');
  return groupByLevel(courses).flatMap((group) => [{ type: 'header', key: `header:${group.level}`, level: group.level, count: group.courses.length } as ListItem, ...chunk(group.courses, columns, group.level)]);
}
