import type { SQLiteDatabase } from 'expo-sqlite';

import { newId, nowTimestamp } from '@/lib/id';

import { activityLanguage, CODE_KINDS, LOGIC_KINDS, type ActivityKind } from '../lib/kinds';
import { activityXp } from '../lib/xp';

export type ActivityRow = {
  activity_id: string;
  lesson_id: string;
  course_id: string;
  kind: string;
  solved: number;
  attempts: number;
  wrong: number;
  hints_used: number;
  xp: number;
  solved_at: string | null;
  last_attempt_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AttemptRow = {
  id: string;
  activity_id: string;
  lesson_id: string;
  course_id: string;
  kind: string;
  correct: number;
  hints_used: number;
  duration_ms: number | null;
  created_at: string;
};

export type AttemptInput = {
  activityId: string;
  lessonId: string;
  courseId: string;
  kind: ActivityKind;
  correct: boolean;
  /** Hints shown during this attempt. */
  hintsUsed: number;
  durationMs?: number;
};

export type AttemptResult = {
  /** XP this attempt paid: only the first correct attempt at an activity pays, and only once, ever. */
  xpEarned: number;
  /** This attempt solved the activity for the first time. */
  solvedNow: boolean;
  /** The activity had been solved before this attempt (a replay: nothing changes but the attempt count). */
  alreadySolved: boolean;
  row: ActivityRow;
};

const COLUMNS = 'activity_id, lesson_id, course_id, kind, solved, attempts, wrong, hints_used, xp, solved_at, last_attempt_at, created_at, updated_at';

const clampWhole = (value: number | undefined): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

/**
 * Records one try at an activity. Every try is logged in `challenge_attempts`; `activity_progress`
 * keeps the running totals and, on the **first correct try only**, `solved`, `solved_at` and the XP,
 * worked out from the hints and wrong tries *up to then*. After that the row's XP, wrong tries and
 * hints are frozen (a replay adds an attempt and nothing else), so XP can never be paid twice and a
 * replay cannot lower or raise it. Runs in one transaction.
 */
export async function recordAttempt(db: SQLiteDatabase, input: AttemptInput, now: string = nowTimestamp()): Promise<AttemptResult> {
  const hints = clampWhole(input.hintsUsed);
  const duration = input.durationMs === undefined ? null : clampWhole(input.durationMs);
  let result!: AttemptResult;
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO challenge_attempts (id, activity_id, lesson_id, course_id, kind, correct, hints_used, duration_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      newId(),
      input.activityId,
      input.lessonId,
      input.courseId,
      input.kind,
      input.correct ? 1 : 0,
      hints,
      duration,
      now,
    );
    const existing = await db.getFirstAsync<ActivityRow>(`SELECT ${COLUMNS} FROM activity_progress WHERE activity_id = ?`, input.activityId);
    if (!existing) {
      const xp = input.correct ? activityXp(input.kind, { hintsUsed: hints, wrong: 0 }) : 0;
      await db.runAsync(
        `INSERT INTO activity_progress (activity_id, lesson_id, course_id, kind, solved, attempts, wrong, hints_used, xp, solved_at, last_attempt_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`,
        input.activityId,
        input.lessonId,
        input.courseId,
        input.kind,
        input.correct ? 1 : 0,
        input.correct ? 0 : 1,
        hints,
        xp,
        input.correct ? now : null,
        now,
        now,
        now,
      );
      result = { xpEarned: xp, solvedNow: input.correct, alreadySolved: false, row: (await readOne(db, input.activityId))! };
      return;
    }
    if (existing.solved === 1) {
      await db.runAsync('UPDATE activity_progress SET attempts = attempts + 1, last_attempt_at = ?, updated_at = ? WHERE activity_id = ?', now, now, input.activityId);
      result = { xpEarned: 0, solvedNow: false, alreadySolved: true, row: (await readOne(db, input.activityId))! };
      return;
    }
    const totalHints = existing.hints_used + hints;
    if (input.correct) {
      const xp = activityXp(input.kind, { hintsUsed: totalHints, wrong: existing.wrong });
      await db.runAsync(
        'UPDATE activity_progress SET solved = 1, solved_at = ?, attempts = attempts + 1, hints_used = ?, xp = ?, last_attempt_at = ?, updated_at = ? WHERE activity_id = ? AND solved = 0',
        now,
        totalHints,
        xp,
        now,
        now,
        input.activityId,
      );
      result = { xpEarned: xp, solvedNow: true, alreadySolved: false, row: (await readOne(db, input.activityId))! };
    } else {
      await db.runAsync('UPDATE activity_progress SET attempts = attempts + 1, wrong = wrong + 1, hints_used = ?, last_attempt_at = ?, updated_at = ? WHERE activity_id = ?', totalHints, now, now, input.activityId);
      result = { xpEarned: 0, solvedNow: false, alreadySolved: false, row: (await readOne(db, input.activityId))! };
    }
  });
  return result;
}

async function readOne(db: SQLiteDatabase, activityId: string): Promise<ActivityRow | null> {
  return db.getFirstAsync<ActivityRow>(`SELECT ${COLUMNS} FROM activity_progress WHERE activity_id = ?`, activityId);
}

export async function readActivityProgress(db: SQLiteDatabase, filter: { courseId?: string; lessonId?: string } = {}): Promise<ActivityRow[]> {
  if (filter.lessonId) return db.getAllAsync<ActivityRow>(`SELECT ${COLUMNS} FROM activity_progress WHERE lesson_id = ? ORDER BY created_at, activity_id`, filter.lessonId);
  if (filter.courseId) return db.getAllAsync<ActivityRow>(`SELECT ${COLUMNS} FROM activity_progress WHERE course_id = ? ORDER BY created_at, activity_id`, filter.courseId);
  return db.getAllAsync<ActivityRow>(`SELECT ${COLUMNS} FROM activity_progress ORDER BY created_at, activity_id`);
}

/** Attempts, oldest first. `limit` keeps the newest N (adaptive guidance only needs recent history). */
export async function readAttempts(db: SQLiteDatabase, filter: { courseId?: string; activityId?: string; limit?: number } = {}): Promise<AttemptRow[]> {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (filter.courseId) {
    where.push('course_id = ?');
    params.push(filter.courseId);
  }
  if (filter.activityId) {
    where.push('activity_id = ?');
    params.push(filter.activityId);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const limit = filter.limit && filter.limit > 0 ? Math.floor(filter.limit) : null;
  const rows = await db.getAllAsync<AttemptRow>(
    `SELECT id, activity_id, lesson_id, course_id, kind, correct, hints_used, duration_ms, created_at FROM challenge_attempts ${clause} ORDER BY created_at DESC, rowid DESC${limit ? ' LIMIT ' + limit : ''}`,
    ...params,
  );
  return rows.reverse();
}

/** The numbers the three activity achievements need, from the solved activities. */
export type ActivityBadgeStats = { fixBugSolved: number; logicSolved: number; codeLanguages: string[] };

export function activityBadgeStats(rows: readonly Pick<ActivityRow, 'activity_id' | 'kind' | 'solved'>[]): ActivityBadgeStats {
  const solved = rows.filter((row) => row.solved === 1);
  const languages = new Set<string>();
  for (const row of solved) {
    if (CODE_KINDS.has(row.kind as ActivityKind)) {
      const language = activityLanguage(row.kind, row.activity_id);
      if (language) languages.add(language);
    }
  }
  return {
    fixBugSolved: solved.filter((row) => row.kind === 'fix-bug').length,
    logicSolved: solved.filter((row) => LOGIC_KINDS.has(row.kind as ActivityKind)).length,
    codeLanguages: [...languages].sort(),
  };
}
