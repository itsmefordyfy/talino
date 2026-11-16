import type { Language } from '@/lib/i18n';

import { CATEGORIES, LEARNING_GOALS } from '../../content/catalog/categories';
import { categoryLabel, goalLabel } from '../../content/catalog/catalog-text';
import { getTechnology } from '../../content/catalog/technologies';
import type { CategoryId, LearningGoalId } from '../../content/types';
import { type CourseAccess, type CourseFacts, type CourseType, type DurationBucket } from '../catalog-facts';
import { LEARNING_LEVEL_TEXT, type LearningLevel } from '../learning-level';
import { COURSE_TYPE_LABELS_FIL, DIMENSION_LABELS_FIL, DURATION_LABELS_FIL, pick } from './discovery-text';

/** Where the learner stands with a course, for the "Progress" filter. */
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';
export const PROGRESS_STATUSES: readonly ProgressStatus[] = ['not-started', 'in-progress', 'completed'];

/**
 * The catalog filters. Within one dimension the chosen values are alternatives (OR: "Beginner or Intermediate");
 * across dimensions they all have to hold (AND: "Web and Beginner"). A dimension with nothing chosen does not filter.
 */
export type CatalogFilters = {
  categories: CategoryId[];
  /** The four learning levels (a course's difficulty, never the learner's experience). */
  levels: LearningLevel[];
  /** AI tools: the technologies of the `ai` group (Claude, ChatGPT, Cursor, app builders…). */
  tools: string[];
  types: CourseType[];
  access: CourseAccess[];
  progress: ProgressStatus[];
  /** Every other technology id from `content/catalog/technologies`. */
  technologies: string[];
  goals: LearningGoalId[];
  durations: DurationBucket[];
};

export type FilterDimension = keyof CatalogFilters;
export type FilterValue<D extends FilterDimension> = CatalogFilters[D][number];

/**
 * What a filter needs to know beyond the catalog: the learner's own progress. Without it every course counts as not started,
 * so a pure catalog query (a test, a server) still works.
 */
export type FilterContext = { progressOf?: (courseId: string) => ProgressStatus };

export const EMPTY_FILTERS: CatalogFilters = { categories: [], levels: [], tools: [], types: [], access: [], progress: [], technologies: [], goals: [], durations: [] };

/** In the order a filter sheet would list them. */
export const FILTER_DIMENSIONS: readonly FilterDimension[] = ['categories', 'levels', 'tools', 'types', 'access', 'progress', 'technologies', 'goals', 'durations'];

export const DIMENSION_LABELS: Record<FilterDimension, string> = {
  categories: 'Category',
  levels: 'Level',
  tools: 'AI tools',
  types: 'Course type',
  access: 'Access',
  progress: 'Progress',
  technologies: 'Technology',
  goals: 'Goal',
  durations: 'Duration',
};

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  free: 'Free',
  career: 'Career Course',
  'learning-path': 'Learning Path',
  masterclass: 'Masterclass',
  course: 'Course',
  mini: 'Mini-Course',
};

export const DURATION_LABELS: Record<DurationBucket, string> = {
  'under-1h': 'Under 1 hour',
  '1-3h': '1–3 hours',
  '3-5h': '3–5 hours',
  'over-5h': 'More than 5 hours',
};

export const ACCESS_LABELS: Record<CourseAccess, string> = { free: 'Free', pro: 'Pro' };

export const PROGRESS_LABELS: Record<ProgressStatus, string> = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed' };

/** The four learning levels' names (English only: Tagalog wording is no longer added). */
export const LEVEL_LABELS: Record<LearningLevel, string> = {
  beginner: LEARNING_LEVEL_TEXT.beginner.label,
  intermediate: LEARNING_LEVEL_TEXT.intermediate.label,
  advanced: LEARNING_LEVEL_TEXT.advanced.label,
  expert: LEARNING_LEVEL_TEXT.expert.label,
};

/** Whether a technology is an AI tool (the `tools` filter) rather than a general technology. */
export function isAiTool(id: string): boolean {
  return getTechnology(id)?.group === 'ai';
}

/** The names below in the learner's language (`language` defaults to English, which the constants above also hold). */
export const dimensionLabel = (dimension: FilterDimension, language: Language = 'en') => pick(language, DIMENSION_LABELS, DIMENSION_LABELS_FIL, dimension);
export const courseTypeLabel = (type: CourseType, language: Language = 'en') => pick(language, COURSE_TYPE_LABELS, COURSE_TYPE_LABELS_FIL, type);
export const durationLabel = (bucket: DurationBucket, language: Language = 'en') => pick(language, DURATION_LABELS, DURATION_LABELS_FIL, bucket);
export const learningLevelLabel = (level: LearningLevel) => LEVEL_LABELS[level] ?? level;

export const CATEGORY_LABELS: Record<CategoryId, string> = Object.fromEntries(CATEGORIES.map((category) => [category.id, category.label])) as Record<CategoryId, string>;

export const GOAL_LABELS: Record<LearningGoalId, string> = Object.fromEntries(LEARNING_GOALS.map((goal) => [goal.id, goal.label])) as Record<LearningGoalId, string>;

/** A technology's display name; an id nobody described yet shows as written. */
export function technologyLabel(id: string): string {
  return getTechnology(id)?.label ?? id;
}

/** The label of any filter value, for chips and option rows, in the learner's language (English by default). */
export function filterLabel<D extends FilterDimension>(dimension: D, value: FilterValue<D>, language: Language = 'en'): string {
  const key = value as string;
  switch (dimension) {
    case 'categories':
      return categoryLabel(key as CategoryId, language);
    case 'levels':
      return learningLevelLabel(key as LearningLevel);
    case 'types':
      return courseTypeLabel(key as CourseType, language);
    case 'access':
      return ACCESS_LABELS[key as CourseAccess] ?? key;
    case 'progress':
      return PROGRESS_LABELS[key as ProgressStatus] ?? key;
    case 'tools':
    case 'technologies':
      return technologyLabel(key);
    case 'goals':
      return goalLabel(key as LearningGoalId, language);
    case 'durations':
      return durationLabel(key as DurationBucket, language);
    default:
      return key;
  }
}

/** The values of one dimension that a course has (a course can have several types, technologies and goals). */
export function valuesOf(fact: CourseFacts, dimension: FilterDimension, context: FilterContext = {}): readonly string[] {
  switch (dimension) {
    case 'categories':
      return [fact.category];
    case 'levels':
      return [fact.learningLevel];
    case 'tools':
      return fact.technologies.filter(isAiTool);
    case 'types':
      return fact.types;
    case 'access':
      return [fact.access];
    case 'progress':
      return [context.progressOf?.(fact.id) ?? 'not-started'];
    case 'technologies':
      return fact.technologies.filter((id) => !isAiTool(id));
    case 'goals':
      return fact.goals;
    case 'durations':
      return [fact.durationBucket];
  }
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return FILTER_DIMENSIONS.some((dimension) => (filters[dimension]?.length ?? 0) > 0);
}

export function activeFilterCount(filters: CatalogFilters): number {
  return FILTER_DIMENSIONS.reduce((sum, dimension) => sum + (filters[dimension]?.length ?? 0), 0);
}

/** Whether one course passes the filters. */
export function matchesFilters(fact: CourseFacts, filters: CatalogFilters, context: FilterContext = {}): boolean {
  for (const dimension of FILTER_DIMENSIONS) {
    // `?? []`: a filter object saved before a dimension existed has no entry for it.
    const wanted: readonly string[] = filters[dimension] ?? [];
    if (wanted.length === 0) continue;
    const have = valuesOf(fact, dimension, context);
    if (!wanted.some((value) => have.includes(value))) return false;
  }
  return true;
}

/** The courses that pass the filters, in the order given. */
export function applyFilters(facts: readonly CourseFacts[], filters: CatalogFilters, context: FilterContext = {}): CourseFacts[] {
  return hasActiveFilters(filters) ? facts.filter((fact) => matchesFilters(fact, filters, context)) : [...facts];
}

/** Adds the value when it is not chosen, removes it when it is. Never mutates. */
export function toggleFilterValue<D extends FilterDimension>(filters: CatalogFilters, dimension: D, value: FilterValue<D>): CatalogFilters {
  const current = (filters[dimension] ?? []) as FilterValue<D>[];
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  return { ...filters, [dimension]: next } as CatalogFilters;
}

/** Removes one chosen value (a chip's close button); a value that was not chosen changes nothing. */
export function removeFilter<D extends FilterDimension>(filters: CatalogFilters, dimension: D, value: FilterValue<D>): CatalogFilters {
  const current = (filters[dimension] ?? []) as FilterValue<D>[];
  if (!current.includes(value)) return filters;
  return { ...filters, [dimension]: current.filter((item) => item !== value) } as CatalogFilters;
}

/** Empties one dimension ("Clear" inside a filter section). */
export function clearDimension(filters: CatalogFilters, dimension: FilterDimension): CatalogFilters {
  return (filters[dimension]?.length ?? 0) === 0 ? filters : ({ ...filters, [dimension]: [] } as CatalogFilters);
}

export type ActiveFilter = { dimension: FilterDimension; value: string; label: string };

/** One chip per chosen value, in dimension order then the order the learner chose them. */
export function activeFilterList(filters: CatalogFilters, language: Language = 'en'): ActiveFilter[] {
  const list: ActiveFilter[] = [];
  for (const dimension of FILTER_DIMENSIONS) {
    for (const value of (filters[dimension] ?? []) as readonly string[]) {
      list.push({ dimension, value, label: filterLabel(dimension, value as never, language) });
    }
  }
  return list;
}
