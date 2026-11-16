import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import type { LessonRow, ProjectRow, ProjectStatus } from '../lib/progress';
import { betterScore, quizPassed } from '../lib/progress';

export async function readLessonRows(db: SQLiteDatabase): Promise<LessonRow[]> {
  return db.getAllAsync<LessonRow>('SELECT lesson_id, course_id, completed_at, quiz_correct, quiz_total, task_done FROM lesson_progress');
}

export async function readProjectRows(db: SQLiteDatabase): Promise<ProjectRow[]> {
  return db.getAllAsync<ProjectRow>('SELECT project_id, course_id, steps_done, submission, status, feedback, review_token, reviewed_at FROM project_progress');
}

export async function readLearningDays(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ day: string }>('SELECT day FROM learning_days ORDER BY day');
  return rows.map((row) => row.day);
}

export type QuizResult = { lessonId: string; courseId: string; correct: number; total: number; day: string };

/**
 * Saves a quiz attempt. The best score (by fraction of the questions asked) is kept; the lesson completes the first time a quiz passes
 * (and that day joins the streak). Returns whether this attempt completed the lesson.
 */
export async function saveQuizResult(db: SQLiteDatabase, result: QuizResult): Promise<{ completedNow: boolean; passed: boolean }> {
  const passed = quizPassed(result.correct, result.total);
  const now = nowTimestamp();
  let completedNow = false;
  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ completed_at: string | null; quiz_correct: number | null; quiz_total: number | null }>('SELECT completed_at, quiz_correct, quiz_total FROM lesson_progress WHERE lesson_id = ?', result.lessonId);
    if (!existing) {
      await db.runAsync(
        'INSERT INTO lesson_progress (lesson_id, course_id, completed_at, quiz_correct, quiz_total, task_done, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
        result.lessonId,
        result.courseId,
        passed ? now : null,
        result.correct,
        result.total,
        now,
        now,
      );
      completedNow = passed;
    } else {
      // The best score is the best FRACTION of the questions asked, kept with the total it was asked out of: the quiz is made of the
      // learner's own level's questions, so changing level later can change its length. Completion is never undone (COALESCE below).
      const best = betterScore({ correct: existing.quiz_correct, total: existing.quiz_total }, result);
      completedNow = passed && existing.completed_at === null;
      await db.runAsync(
        'UPDATE lesson_progress SET quiz_correct = ?, quiz_total = ?, completed_at = COALESCE(completed_at, ?), updated_at = ? WHERE lesson_id = ?',
        best.correct,
        best.total,
        passed ? now : null,
        now,
        result.lessonId,
      );
    }
    if (completedNow) {
      await db.runAsync('INSERT INTO learning_days (day, lessons, created_at) VALUES (?, 1, ?) ON CONFLICT(day) DO UPDATE SET lessons = lessons + 1', result.day, now);
    }
  });
  return { completedNow, passed };
}

export async function setTaskDone(db: SQLiteDatabase, lessonId: string, courseId: string, done: boolean): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, course_id, task_done, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET task_done = excluded.task_done, updated_at = excluded.updated_at`,
    lessonId,
    courseId,
    done ? 1 : 0,
    now,
    now,
  );
}

async function ensureProject(db: SQLiteDatabase, projectId: string, courseId: string): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync('INSERT OR IGNORE INTO project_progress (project_id, course_id, created_at, updated_at) VALUES (?, ?, ?, ?)', projectId, courseId, now, now);
}

export async function setProjectSteps(db: SQLiteDatabase, projectId: string, courseId: string, steps: string[]): Promise<void> {
  await ensureProject(db, projectId, courseId);
  await db.runAsync('UPDATE project_progress SET steps_done = ?, updated_at = ? WHERE project_id = ?', JSON.stringify(steps), nowTimestamp(), projectId);
}

/** A draft of the submission, kept while the learner types (a passed project keeps its reviewed text). */
export async function saveSubmissionDraft(db: SQLiteDatabase, projectId: string, courseId: string, submission: string): Promise<void> {
  await ensureProject(db, projectId, courseId);
  await db.runAsync("UPDATE project_progress SET submission = ?, updated_at = ? WHERE project_id = ? AND status != 'passed'", submission, nowTimestamp(), projectId);
}

export type ReviewOutcome = { status: Extract<ProjectStatus, 'passed' | 'needs_work'>; feedback: string; token: string | null; submission: string };

export async function saveReview(db: SQLiteDatabase, projectId: string, courseId: string, outcome: ReviewOutcome): Promise<void> {
  await ensureProject(db, projectId, courseId);
  const now = nowTimestamp();
  await db.runAsync(
    'UPDATE project_progress SET status = ?, feedback = ?, review_token = ?, submission = ?, reviewed_at = ?, updated_at = ? WHERE project_id = ?',
    outcome.status,
    outcome.feedback,
    outcome.token,
    outcome.submission,
    now,
    now,
    projectId,
  );
}

export type BadgeRow = { badge_id: string; earned_at: string; seen: number };

export async function readBadges(db: SQLiteDatabase): Promise<BadgeRow[]> {
  return db.getAllAsync<BadgeRow>('SELECT badge_id, earned_at, seen FROM badges ORDER BY earned_at');
}

/** Records badges not earned before; returns the new ones (for the celebration). */
export async function awardBadges(db: SQLiteDatabase, ids: readonly string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const have = new Set((await readBadges(db)).map((row) => row.badge_id));
  const fresh = ids.filter((id) => !have.has(id));
  const now = nowTimestamp();
  for (const id of fresh) await db.runAsync('INSERT OR IGNORE INTO badges (badge_id, earned_at, seen) VALUES (?, ?, 0)', id, now);
  return fresh;
}

export async function markBadgesSeen(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('UPDATE badges SET seen = 1 WHERE seen = 0');
}
