import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { readApplications, readGoals, readIncome, saveApplication, saveIncome } from '@/features/career/api/career-repo';
import { goalProgress } from '@/features/career/lib/goal-progress';
import { planCareerReminders } from '@/features/career/lib/reminder-plan';
import { COURSES } from '@/features/courses/data';
import { readBadges, readLearningDays, readLessonRows } from '@/features/courses/api/progress-repo';
import { computeStreak } from '@/features/courses/lib/streak';
import { listDocuments } from '@/features/resume/api/document-repo';
import { readProfile, saveProfile } from '@/features/resume/api/resume-repo';
import { readLocalTables } from '@/features/backup/api/local-rows';
import { deleteAllData } from '@/features/settings/api/reset';

import { isDemoOn, removeDemoData, seedDemoData } from './demo-data';

const NOW = new Date(2026, 10, 15, 10, 0);
const TODAY = '2026-11-15';
const NOBODY = { name: '', goal: null } as const;

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('demo data: Career', () => {
  test('fills Career: 12 applications in every stage, 10 income entries, 3 goals, 2 résumés for Ford', async () => {
    expect(await seedDemoData(db, NOW, NOBODY)).toEqual({ name: 'Ford', goal: 'builder' });
    const apps = await readApplications(db);
    expect(apps).toHaveLength(12);
    const count = (stage: string) => apps.filter((row) => row.stage === stage).length;
    expect([count('saved'), count('applied'), count('interview'), count('offer'), count('won'), count('closed')]).toEqual([2, 3, 2, 1, 2, 2]);

    const income = await readIncome(db);
    expect(income).toHaveLength(10);
    expect(income.filter((row) => row.currency === 'USD')).toHaveLength(2);

    const goals = await readGoals(db);
    const fractions = goals.map((goal) => goalProgress(goal, { applications: apps, income }).fraction);
    expect(new Set(fractions).size).toBe(3);

    const documents = await listDocuments(db);
    expect(documents).toHaveLength(2);
    expect(documents.every((doc) => doc.content.name === 'Ford' && doc.content.location === 'Naga City, Philippines')).toBe(true);
  });

  test('has something to do now: an interview within two days and follow-ups due', async () => {
    await seedDemoData(db, NOW, NOBODY);
    const apps = await readApplications(db);
    const soon = apps.filter((row) => row.interview_at && new Date(row.interview_at).getTime() > NOW.getTime() && new Date(row.interview_at).getTime() - NOW.getTime() <= 48 * 3_600_000);
    expect(soon).toHaveLength(1);
    expect(apps.filter((row) => ['saved', 'applied', 'interview', 'offer'].includes(row.stage) && row.follow_up_on && row.follow_up_on <= TODAY).length).toBeGreaterThanOrEqual(2);
  });
});

describe('demo data: learning, profile and portfolio', () => {
  test('gives Home a streak up to today, a finished course with its project and certificate, and a course in progress', async () => {
    await seedDemoData(db, NOW, NOBODY);
    const days = await readLearningDays(db);
    expect(computeStreak(days, TODAY).current).toBeGreaterThanOrEqual(10);

    const starter = COURSES.find((course) => course.kind === 'starter')!;
    const lessons = await readLessonRows(db);
    expect(starter.lessons.every((lesson) => lessons.some((row) => row.lesson_id === lesson.id && row.completed_at !== null))).toBe(true);
    const career = COURSES.find((course) => course.kind === 'career')!;
    const done = lessons.filter((row) => row.course_id === career.id).length;
    expect(done).toBeGreaterThan(0);
    expect(done).toBeLessThan(career.lessons.length);

    expect(await db.getFirstAsync("SELECT 1 FROM project_progress WHERE status = 'passed'")).not.toBeNull();
    expect(await db.getFirstAsync('SELECT 1 FROM certificates WHERE learner_name = ?', 'Ford')).not.toBeNull();
    const badges = await readBadges(db);
    expect(badges.length).toBeGreaterThan(0);
    // Already seen, so the sample doesn't open a celebration for each one.
    expect(badges.every((badge) => badge.seen === 1)).toBe(true);
  });

  test('fills the résumé profile and the portfolio', async () => {
    await seedDemoData(db, NOW, NOBODY);
    expect((await readProfile(db))?.headline).toBe('Frontend Developer');
    const projects = await db.getAllAsync<{ id: string }>('SELECT id FROM portfolio_projects ORDER BY sort');
    expect(projects.map((row) => row.id)).toEqual(['demo-project-queue', 'demo-project-cafe']);
  });
});

describe('the switch', () => {
  test('turning it on twice adds nothing more; the state follows the database', async () => {
    expect(await isDemoOn(db)).toBe(false);
    await seedDemoData(db, NOW, NOBODY);
    expect(await seedDemoData(db, NOW, NOBODY)).toBeNull();
    expect(await readApplications(db)).toHaveLength(12);
    expect(await isDemoOn(db)).toBe(true);
    await deleteAllData(db);
    expect(await isDemoOn(db)).toBe(false);
  });

  test('turning it off removes only the sample: the learner’s own rows, profile, streak days and name come back as they were', async () => {
    // What the learner had before: one application, one income, a profile, a lesson done today, a badge.
    await saveApplication(db, { id: 'real-1', kind: 'job', title: 'Real job', company: 'Real Co', link: null, source: null, stage: 'applied', appliedOn: null, followUpOn: null, interviewAt: null, pay: null, notes: null });
    await saveIncome(db, { id: 'real-income', client: 'Real Co', amountMinor: 100_00, currency: 'PHP', receivedOn: '2026-11-10', applicationId: 'real-1', note: null });
    await saveProfile(db, { headline: 'My own headline', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: 'Mine', career_goal: '', level: '' });
    const realLesson = COURSES.find((course) => course.kind === 'career')!.lessons[0].id;
    await db.runAsync("INSERT INTO lesson_progress (lesson_id, course_id, completed_at, quiz_correct, quiz_total, task_done, created_at, updated_at) VALUES (?, 'x', '2026-11-15T01:00:00.000Z', 5, 5, 1, 'a', 'a')", realLesson);
    await db.runAsync("INSERT INTO learning_days (day, lessons, created_at) VALUES ('2026-11-15', 1, 'a')");
    await db.runAsync("INSERT INTO badges (badge_id, earned_at, seen) VALUES ('my-badge', 'a', 1)");

    await seedDemoData(db, NOW, { name: 'Mika', goal: 'fresh-grad' });
    expect(await removeDemoData(db)).toEqual({ name: 'Mika', goal: 'fresh-grad' });

    expect((await readApplications(db)).map((row) => row.id)).toEqual(['real-1']);
    expect((await readIncome(db))[0]).toMatchObject({ id: 'real-income', application_id: 'real-1' });
    expect(await readGoals(db)).toHaveLength(0);
    expect(await listDocuments(db)).toHaveLength(0);
    expect(await db.getFirstAsync('SELECT 1 FROM portfolio_projects')).toBeNull();
    expect(await db.getFirstAsync("SELECT 1 FROM deleted_rows WHERE row_id LIKE 'demo-%'")).toBeNull();
    expect(await readProfile(db)).toMatchObject({ headline: 'My own headline', summary: 'Mine' });
    expect((await readLessonRows(db)).map((row) => row.lesson_id)).toEqual([realLesson]);
    expect(await readLearningDays(db)).toEqual(['2026-11-15']);
    expect(await db.getFirstAsync<{ lessons: number }>("SELECT lessons FROM learning_days WHERE day = '2026-11-15'")).toEqual({ lessons: 1 });
    expect((await readBadges(db)).map((row) => row.badge_id)).toEqual(['my-badge']);
    expect(await db.getFirstAsync('SELECT 1 FROM certificates')).toBeNull();
    expect(await isDemoOn(db)).toBe(false);
  });

  test('with no profile before, off leaves none; off when it was never on does nothing', async () => {
    expect(await removeDemoData(db)).toBeNull();
    await seedDemoData(db, NOW, NOBODY);
    await removeDemoData(db);
    expect(await readProfile(db)).toBeNull();
    expect(await readLessonRows(db)).toHaveLength(0);
  });

  test('the career rows are never backed up or reminded', async () => {
    await seedDemoData(db, NOW, NOBODY);
    const tables = await readLocalTables(db);
    expect(Object.values(tables).flat().some((row) => String(row.id ?? '').startsWith('demo-'))).toBe(false);
    const copy = new Proxy({}, { get: () => () => 'x' }) as Parameters<typeof planCareerReminders>[2];
    expect(planCareerReminders(await readApplications(db), NOW, copy)).toEqual([]);
  });
});
