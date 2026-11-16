/**
 * The answers onboarding offers, as stable ids (stored in the learner profile). Their words live in
 * `strings.ts`, so a label can change or be translated without touching saved data.
 */

import { EXPERIENCE_LEVELS, type ExperienceLevel } from '../../courses/content/levels';

// The five levels live in one place (courses/content/levels.ts) because lessons adapt to them too.
export { EXPERIENCE_LEVELS, type ExperienceLevel };

/** The goals asked in onboarding (multiple choice). The last two keep the freelance and teaching paths the app was built around. */
export const GOAL_IDS = [
  'from-scratch',
  'software-engineer',
  'frontend',
  'backend',
  'full-stack',
  'mobile',
  'ai',
  'data-science',
  'game-dev',
  'improve-skills',
  'interview-prep',
  'build-startup',
  'explore-cs',
  'freelance',
  'teach',
] as const;
export type GoalId = (typeof GOAL_IDS)[number];

export const NOT_SURE = 'not-sure';

export const INTEREST_GROUPS = [
  { id: 'languages', interests: ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'swift', 'kotlin', 'sql'] },
  { id: 'web', interests: ['html-css', 'react', 'nextjs', 'nodejs', 'express', 'backend', 'apis', 'databases'] },
  { id: 'mobile', interests: ['react-native', 'expo', 'flutter', 'ios', 'android'] },
  { id: 'ai', interests: ['ai', 'ai-coding', 'genai', 'ml', 'llm', 'ai-apps', 'rag'] },
  { id: 'cs', interests: ['dsa', 'oop', 'architecture', 'system-design', 'db-management', 'networking', 'cybersecurity'] },
] as const;
export type InterestGroupId = (typeof INTEREST_GROUPS)[number]['id'];
export type InterestId = (typeof INTEREST_GROUPS)[number]['interests'][number] | typeof NOT_SURE;
export const INTEREST_IDS: readonly InterestId[] = [...INTEREST_GROUPS.flatMap((group) => group.interests), NOT_SURE];

export const STYLE_IDS = ['short-lessons', 'step-by-step', 'interactive', 'projects', 'video', 'reading', 'quizzes', 'ai-guided'] as const;
export type StyleId = (typeof STYLE_IDS)[number];

export const DAILY_MINUTE_CHOICES = [5, 10, 15, 30, 45, 60] as const;
export type DailyMinutes = (typeof DAILY_MINUTE_CHOICES)[number];

export const TIMES_OF_DAY = ['morning', 'afternoon', 'evening'] as const;
export type TimeOfDay = (typeof TIMES_OF_DAY)[number];

/** Weekly lesson targets offered in the schedule step. */
export const WEEKLY_GOAL_CHOICES = [2, 3, 5, 7] as const;

/** Days of the week as 0 (Sunday) to 6 (Saturday), the order `Date.getDay()` uses. */
export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0] as const;
