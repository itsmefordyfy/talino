import type { Language } from '@/lib/i18n';

import { PROFILE_TITLES_FIL } from './adventure-text';

const toSet = (value: ReadonlySet<string> | readonly string[]): ReadonlySet<string> => (value instanceof Set ? value : new Set(value as readonly string[]));

/**
 * Profile titles earned from achievements, shown under the learner's name. The level title
 * (`levelTitle`) is always there; these are extras, listed best first.
 */
export type ProfileTitle = { id: string; title: string; achievementId: string };

export const PROFILE_TITLES: readonly ProfileTitle[] = [
  { id: 'talino-master', title: 'Talino Master', achievementId: 'master' },
  { id: 'graduate', title: 'Graduate', achievementId: 'course-complete' },
  { id: 'consistency-champion', title: 'Consistency Champion', achievementId: 'streak-7' },
  { id: 'code-explorer', title: 'Code Explorer', achievementId: 'code-explorer' },
  { id: 'logic-master', title: 'Logic Master', achievementId: 'logic-master' },
  { id: 'bug-hunter', title: 'Bug Hunter', achievementId: 'bug-hunter' },
  { id: 'project-builder', title: 'Project Builder', achievementId: 'first-project' },
  { id: 'ai-builder', title: 'AI Builder', achievementId: 'first-ai-app' },
];

export function earnedTitles(achievements: ReadonlySet<string> | readonly string[], language: Language = 'en'): ProfileTitle[] {
  const set = toSet(achievements);
  return PROFILE_TITLES.filter((entry) => set.has(entry.achievementId)).map((entry) => (language === 'fil' ? { ...entry, title: PROFILE_TITLES_FIL[entry.id] ?? entry.title } : entry));
}

/** The title to show: the best earned one, else the level's. */
export function displayTitle(levelTitle: string, achievements: ReadonlySet<string> | readonly string[], language: Language = 'en'): string {
  return earnedTitles(achievements, language)[0]?.title ?? levelTitle;
}
