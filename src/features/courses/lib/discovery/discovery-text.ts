import type { Language } from '@/lib/i18n';

import type { CourseType, DurationBucket } from '../catalog-facts';
import type { FilterDimension } from './filters';
import type { SortKey } from './sort';

/**
 * Tagalog (`fil`) wording of the discovery controls whose English lives in `filters.ts` and `sort.ts`: the filter
 * dimension names, course types, durations and the sort options. Voice and glossary: `docs/i18n/tagalog-style-guide.md`.
 */
// Partial: Tagalog wording is no longer added (owner, 2026-11-15); a missing key shows the English one.
export const DIMENSION_LABELS_FIL: Partial<Record<FilterDimension, string>> = {
  categories: 'Category',
  levels: 'Level',
  types: 'Uri ng course',
  technologies: 'Technology',
  goals: 'Goal',
  durations: 'Tagal',
};

export const COURSE_TYPE_LABELS_FIL: Record<CourseType, string> = {
  free: 'Libre',
  career: 'Career Course',
  'learning-path': 'Learning Path',
  masterclass: 'Masterclass',
  course: 'Course',
  mini: 'Mini-Course',
};

export const DURATION_LABELS_FIL: Record<DurationBucket, string> = {
  'under-1h': 'Wala pang 1 oras',
  '1-3h': '1–3 oras',
  '3-5h': '3–5 oras',
  'over-5h': 'Mahigit 5 oras',
};

export const SORT_TEXT_FIL: Partial<Record<SortKey, { label: string; description: string }>> = {
  recommended: { label: 'Inirerekomenda', description: 'Mauuna ang mga course na bagay sa mga goal mo; kapag may hinahanap ka, mauuna ang pinakatugma.' },
  newest: { label: 'Pinakabago', description: 'Mauuna ang mga pinakabagong idinagdag na course.' },
  shortest: { label: 'Pinakamaikli', description: 'Mauuna ang may pinakakaunting minuto ng lesson.' },
  longest: { label: 'Pinakamahaba', description: 'Mauuna ang may pinakamaraming minuto ng lesson.' },
  'beginner-friendly': { label: 'Pang-beginner', description: 'Mauuna ang beginner level, tapos ang mga course na pinakakaunti ang prerequisite, tapos ang mas maikli.' },
};

/** Looks `key` up in a Tagalog table for `fil`, or returns the English one. */
export function pick<K extends string>(language: Language, english: Record<K, string>, fil: Partial<Record<K, string>>, key: K): string {
  return (language === 'fil' ? fil[key] : undefined) ?? english[key] ?? key;
}
