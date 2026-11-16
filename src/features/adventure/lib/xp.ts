import type { Language } from '@/lib/i18n';

import { LEVEL_TITLES_FIL } from './adventure-text';
import type { ActivityKind } from './kinds';

/**
 * XP in Talino is *derived*, never stored as a counter anyone can edit or lose: it is worked out from
 * the rows that already record real learning (lessons, quizzes, tasks, projects, badges, solved
 * activities). So a missed day cannot lower it, restoring a backup cannot double it, and every point
 * traces back to something the learner actually did.
 */
export const XP = {
  lesson: 20,
  /** On top of the lesson, when the quiz was answered perfectly. */
  perfectQuiz: 5,
  /** The hands-on laptop task of a lesson was ticked. */
  task: 5,
  project: 100,
  achievement: 25,
} as const;

/**
 * What a solved activity is worth before hints and wrong tries. Reading (tap-reveal) pays nothing:
 * XP is for doing, not for tapping through.
 */
export const ACTIVITY_BASE_XP: Record<ActivityKind, number> = {
  'tap-reveal': 0,
  'predict-output': 8,
  'fix-bug': 12,
  arrange: 10,
  'fill-blank': 8,
  match: 8,
  scenario: 8,
  'code-challenge': 15,
  'sql-challenge': 15,
};

export const HINT_COST = 0.15;
export const MIN_HINT_FRACTION = 0.4;
/** From this many wrong tries before solving, the payout is halved: guessing does not pay. */
export const GUESSING_WRONG_TRIES = 3;

export type ActivityEffort = { hintsUsed: number; wrong: number };

const whole = (value: number) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

/**
 * XP for solving an activity: each hint costs 15% of the base (never below 40% of it), three or more
 * wrong tries before the solve halve it, and a solved activity is never worth 0 (at least 1), except
 * kinds that pay nothing at all (reading). Pure; the repo applies it once, on the first correct try.
 */
export function activityXp(kind: ActivityKind, effort: ActivityEffort): number {
  const base = ACTIVITY_BASE_XP[kind] ?? 0;
  if (base <= 0) return 0;
  const hintFraction = Math.max(MIN_HINT_FRACTION, 1 - HINT_COST * whole(effort.hintsUsed));
  const guessFactor = whole(effort.wrong) >= GUESSING_WRONG_TRIES ? 0.5 : 1;
  return Math.max(1, Math.round(base * hintFraction * guessFactor));
}

/** The columns of the learning tables XP is derived from (a subset of the rows the repos read). */
export type XpLessonRow = { lesson_id: string; completed_at: string | null; quiz_correct: number | null; quiz_total: number | null; task_done: number };
export type XpProjectRow = { status: string };
export type XpActivityRow = { xp: number };

export type XpInputs = {
  lessonRows: readonly XpLessonRow[];
  projectRows: readonly XpProjectRow[];
  /** Achievements earned (the `badges` rows). */
  badgeCount: number;
  activityRows: readonly XpActivityRow[];
};

export type XpBreakdown = {
  lessons: number;
  quizBonus: number;
  tasks: number;
  projects: number;
  achievements: number;
  activities: number;
  total: number;
};

/** A lesson's quiz was answered perfectly and the lesson is done (a perfect score always passes). */
export function isPerfectQuiz(row: Pick<XpLessonRow, 'completed_at' | 'quiz_correct' | 'quiz_total'>): boolean {
  return row.completed_at != null && !!row.quiz_total && row.quiz_total > 0 && row.quiz_correct === row.quiz_total;
}

export function computeXp(input: XpInputs): XpBreakdown {
  const done = input.lessonRows.filter((row) => row.completed_at != null);
  const lessons = done.length * XP.lesson;
  const quizBonus = input.lessonRows.filter(isPerfectQuiz).length * XP.perfectQuiz;
  const tasks = input.lessonRows.filter((row) => row.task_done === 1).length * XP.task;
  const projects = input.projectRows.filter((row) => row.status === 'passed').length * XP.project;
  const achievements = Math.max(0, whole(input.badgeCount)) * XP.achievement;
  const activities = input.activityRows.reduce((sum, row) => sum + Math.max(0, whole(row.xp)), 0);
  return { lessons, quizBonus, tasks, projects, achievements, activities, total: lessons + quizBonus + tasks + projects + achievements + activities };
}

/** What one mission (lesson) earned, for the completion summary. Achievements are not per lesson. */
export type MissionXp = { lesson: number; quizBonus: number; task: number; activities: number; total: number };

export function missionXp(row: XpLessonRow | null | undefined, activityRows: readonly XpActivityRow[]): MissionXp {
  const lesson = row && row.completed_at != null ? XP.lesson : 0;
  const quizBonus = row && isPerfectQuiz(row) ? XP.perfectQuiz : 0;
  const task = row && row.task_done === 1 ? XP.task : 0;
  const activities = activityRows.reduce((sum, entry) => sum + Math.max(0, whole(entry.xp)), 0);
  return { lesson, quizBonus, task, activities, total: lesson + quizBonus + task + activities };
}

/**
 * Levels follow a gentle quadratic: reaching level n takes `100 * n * (n - 1) / 2` XP in total, so
 * the step from one level to the next grows by 100 each time (100, 200, 300 ...): 0 XP is level 1,
 * 100 level 2, 300 level 3, 600 level 4, 1000 level 5, 1500 level 6. A finished 20-lesson course is
 * about 700 to 900 XP (level 4 to 5), so a first course is a real milestone and later levels take
 * a few courses, never a grind.
 */
export function xpForLevel(level: number): number {
  const n = Math.max(1, Math.floor(level));
  return 50 * n * (n - 1);
}

export function levelFor(xp: number): number {
  const total = Number.isFinite(xp) && xp > 0 ? xp : 0;
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + total / 12.5)) / 2));
  // Guard against float rounding at the exact boundaries.
  while (xpForLevel(level + 1) <= total) level += 1;
  while (level > 1 && xpForLevel(level) > total) level -= 1;
  return level;
}

export type LevelProgress = {
  level: number;
  /** XP earned inside this level. */
  xpIntoLevel: number;
  /** XP this level spans (from its start to the next level's). */
  xpForLevel: number;
  xpToNext: number;
  /** 0 to 1. */
  fraction: number;
};

export function progressToNextLevel(xp: number): LevelProgress {
  const total = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
  const level = levelFor(total);
  const start = xpForLevel(level);
  const span = xpForLevel(level + 1) - start;
  const into = total - start;
  return { level, xpIntoLevel: into, xpForLevel: span, xpToNext: span - into, fraction: span === 0 ? 0 : into / span };
}

/** Warm titles, not childish; the last one is the title from level 10 on. */
export const LEVEL_TITLES = [
  'Curious Cub',
  'Eager Learner',
  'Bug Spotter',
  'Code Tinkerer',
  'Steady Builder',
  'Problem Solver',
  'Sharp Debugger',
  'Trusted Teammate',
  'Seasoned Maker',
  'Talino Mentor',
] as const;

export function levelTitle(level: number, language: Language = 'en'): string {
  const index = Math.min(LEVEL_TITLES.length, Math.max(1, Math.floor(level))) - 1;
  return (language === 'fil' ? LEVEL_TITLES_FIL : LEVEL_TITLES)[index];
}
