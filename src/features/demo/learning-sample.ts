import type { SQLiteDatabase } from 'expo-sqlite';

import { COURSES, computeCourseProgress, earnedBadges, type Course } from '@/features/courses/data';
import { computeStreak } from '@/features/courses/lib/streak';
import { addDays, toISODate } from '@/lib/dates';
import { demoId } from '@/lib/demo';

import { SAMPLE_NAME } from './career-sample';

/**
 * What the learning sample added, so that turning the switch off removes exactly that and nothing the learner earned themselves
 * (a sample lesson has the real lesson's id, so it can't be told apart by a `demo-` prefix like the career rows).
 */
export type LearningSampleLog = {
  lessons: string[];
  projects: string[];
  certificates: string[];
  badges: string[];
  /** Lessons the sample added to each day of the streak, taken back off when it is removed. */
  days: Record<string, number>;
};

export const emptyLearningLog = (): LearningSampleLog => ({ lessons: [], projects: [], certificates: [], badges: [], days: {} });

/** The courses the sample works through, and how far: the starter finished (with its project and certificate), a career course past halfway, a path course begun. */
function plan(): { course: Course; fraction: number; project: boolean }[] {
  const starter = COURSES.find((course) => course.kind === 'starter');
  const career = COURSES.find((course) => course.kind === 'career');
  const path = COURSES.find((course) => course.kind === 'path');
  const picks: { course: Course | undefined; fraction: number; project: boolean }[] = [
    { course: starter, fraction: 1, project: true },
    { course: career, fraction: 0.6, project: false },
    { course: path, fraction: 0.3, project: false },
  ];
  return picks.flatMap((pick) => (pick.course ? [{ course: pick.course, fraction: pick.fraction, project: pick.project }] : []));
}

/**
 * Gives Home, Courses and Profile something to show: lessons finished over the last two weeks (a streak up to today), a finished
 * course with its passed project and certificate, a course in progress, and the badges that earns. Rows that already exist
 * (the learner's own) are left as they are and not logged. The caller wraps it in a transaction.
 */
export async function insertLearningSample(db: SQLiteDatabase, now: Date): Promise<LearningSampleLog> {
  const log = emptyLearningLog();
  const today = toISODate(now);
  const worked = plan();
  const queue = worked.flatMap(({ course, fraction }) => course.lessons.slice(0, Math.max(1, Math.round(course.lessons.length * fraction))).map((lesson) => ({ course, lesson })));
  const span = Math.min(queue.length, 14);

  for (const [index, { course, lesson }] of queue.entries()) {
    // Spread over the last `span` days, oldest first, so every one of them has a lesson and the streak runs up to today.
    const daysAgo = queue.length === 1 ? 0 : Math.round(((queue.length - 1 - index) * (span - 1)) / (queue.length - 1));
    const day = addDays(today, -daysAgo);
    const at = new Date(now.getTime() - daysAgo * 86_400_000 - 3_600_000).toISOString();
    const inserted = await db.runAsync(
      'INSERT OR IGNORE INTO lesson_progress (lesson_id, course_id, completed_at, quiz_correct, quiz_total, task_done, created_at, updated_at) VALUES (?, ?, ?, 4, 5, 1, ?, ?)',
      lesson.id,
      course.id,
      at,
      at,
      at,
    );
    if (inserted.changes === 0) continue;
    log.lessons.push(lesson.id);
    await db.runAsync('INSERT INTO learning_days (day, lessons, created_at) VALUES (?, 1, ?) ON CONFLICT(day) DO UPDATE SET lessons = lessons + 1', day, at);
    log.days[day] = (log.days[day] ?? 0) + 1;
  }

  for (const { course, project } of worked) {
    if (!project) continue;
    for (const entry of course.projects) {
      const at = new Date(now.getTime() - 86_400_000).toISOString();
      const inserted = await db.runAsync(
        "INSERT OR IGNORE INTO project_progress (project_id, course_id, steps_done, submission, status, feedback, reviewed_at, created_at, updated_at) VALUES (?, ?, '[]', ?, 'passed', ?, ?, ?, ?)",
        entry.id,
        course.id,
        'Finished and shared.',
        'Clear, complete and well explained. Nice work.',
        at,
        at,
        at,
      );
      if (inserted.changes === 1) log.projects.push(entry.id);
    }
    // A `demo-` id, so a backup leaves the certificate out and removing it is exact.
    const certificate = demoId(`certificate-${course.id}`);
    const issued = new Date(now.getTime() - 86_400_000).toISOString();
    const inserted = await db.runAsync('INSERT OR IGNORE INTO certificates (id, course_id, learner_name, issued_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', certificate, course.id, SAMPLE_NAME, issued, issued, issued);
    if (inserted.changes === 1) log.certificates.push(certificate);
  }

  // The badges this progress earns, already seen, so the sample doesn't open a celebration for each one.
  const lessonRows = await db.getAllAsync<{ lesson_id: string; course_id: string; completed_at: string | null; quiz_correct: number | null; quiz_total: number | null; task_done: number; created_at: string; updated_at: string }>('SELECT * FROM lesson_progress');
  const projectRows = await db.getAllAsync<{ project_id: string; course_id: string; steps_done: string; submission: string | null; status: string; feedback: string | null; review_token: string | null; reviewed_at: string | null; created_at: string; updated_at: string }>('SELECT * FROM project_progress');
  const days = (await db.getAllAsync<{ day: string }>('SELECT day FROM learning_days')).map((row) => row.day);
  const counts = await db.getFirstAsync<{ applications: number; interviews: number; wins: number; income: number }>(
    `SELECT (SELECT COUNT(*) FROM applications WHERE stage != 'saved') AS applications,
            (SELECT COUNT(*) FROM applications WHERE stage IN ('interview', 'offer', 'won') OR interview_at IS NOT NULL) AS interviews,
            (SELECT COUNT(*) FROM applications WHERE stage IN ('offer', 'won')) AS wins,
            (SELECT COUNT(*) FROM income) AS income`,
  );
  const ids = earnedBadges({
    courses: COURSES,
    progress: COURSES.map((course) => computeCourseProgress(course, lessonRows, projectRows as Parameters<typeof computeCourseProgress>[2])),
    bestStreak: computeStreak(days, today).best,
    passedProjects: new Set(projectRows.filter((row) => row.status === 'passed').map((row) => row.project_id)),
    applications: counts?.applications ?? 0,
    interviews: counts?.interviews ?? 0,
    wins: counts?.wins ?? 0,
    incomeEntries: counts?.income ?? 0,
  });
  for (const id of ids) {
    const inserted = await db.runAsync('INSERT OR IGNORE INTO badges (badge_id, earned_at, seen) VALUES (?, ?, 1)', id, now.toISOString());
    if (inserted.changes === 1) log.badges.push(id);
  }
  return log;
}

/** Takes back exactly what `insertLearningSample` logged. */
export async function deleteLearningSample(db: SQLiteDatabase, log: LearningSampleLog): Promise<void> {
  for (const id of log.lessons) await db.runAsync('DELETE FROM lesson_progress WHERE lesson_id = ?', id);
  for (const id of log.projects) await db.runAsync('DELETE FROM project_progress WHERE project_id = ?', id);
  for (const id of log.certificates) await db.runAsync('DELETE FROM certificates WHERE id = ?', id);
  for (const id of log.badges) await db.runAsync('DELETE FROM badges WHERE badge_id = ?', id);
  for (const [day, count] of Object.entries(log.days)) {
    await db.runAsync('UPDATE learning_days SET lessons = lessons - ? WHERE day = ?', count, day);
    await db.runAsync('DELETE FROM learning_days WHERE day = ? AND lessons <= 0', day);
  }
}
