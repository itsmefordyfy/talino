import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { readProfile, saveProfile } from '@/features/onboarding/api/profile-repo';
import { computeCourseProgress } from '../lib/progress';
import { makeCourse } from '../lib/fixtures.test-helpers';
import { awardBadges, readBadges, readLearningDays, readLessonRows, readProjectRows, saveQuizResult, saveReview, saveSubmissionDraft, setProjectSteps, setTaskDone } from './progress-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('saveQuizResult', () => {
  test('a failed first try records the score but not the lesson', async () => {
    const result = await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 1, total: 4, day: '2026-11-13' });
    expect(result).toEqual({ completedNow: false, passed: false });
    const [row] = await readLessonRows(db);
    expect(row.completed_at).toBeNull();
    expect(await readLearningDays(db)).toEqual([]);
  });

  test('a pass completes it once, keeps the best score and marks the day', async () => {
    await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 1, total: 4, day: '2026-11-13' });
    expect((await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 4, total: 4, day: '2026-11-13' })).completedNow).toBe(true);
    expect((await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 3, total: 4, day: '2026-11-14' })).completedNow).toBe(false);
    const [row] = await readLessonRows(db);
    expect(row.quiz_correct).toBe(4);
    expect(row.completed_at).not.toBeNull();
    expect(await readLearningDays(db)).toEqual(['2026-11-13']);
  });

  test('the task check is kept alongside', async () => {
    await setTaskDone(db, 'starter-02', 'starter', true);
    await saveQuizResult(db, { lessonId: 'starter-02', courseId: 'starter', correct: 3, total: 3, day: '2026-11-13' });
    const [row] = await readLessonRows(db);
    expect(row.task_done).toBe(1);
    expect(row.completed_at).not.toBeNull();
  });
});

describe('projects', () => {
  test('steps, a draft, then a review; a passed submission is not overwritten by a later draft', async () => {
    await setProjectSteps(db, 'starter-p1', 'starter', ['starter-p1-s1']);
    await saveSubmissionDraft(db, 'starter-p1', 'starter', 'https://example.com/a');
    await saveReview(db, 'starter-p1', 'starter', { status: 'passed', feedback: 'Nice', token: 'tok', submission: 'https://example.com/a' });
    await saveSubmissionDraft(db, 'starter-p1', 'starter', 'https://example.com/b');
    const [row] = await readProjectRows(db);
    expect(row).toMatchObject({ status: 'passed', submission: 'https://example.com/a', review_token: 'tok', steps_done: '["starter-p1-s1"]' });
  });
});

describe('awardBadges', () => {
  test('returns only new badges and keeps the first date', async () => {
    expect(await awardBadges(db, ['first-lesson'])).toEqual(['first-lesson']);
    expect(await awardBadges(db, ['first-lesson', 'perfect-quiz'])).toEqual(['perfect-quiz']);
    expect((await readBadges(db)).map((row) => row.badge_id)).toEqual(expect.arrayContaining(['first-lesson', 'perfect-quiz']));
  });
});

describe('changing level never touches progress', () => {
  const course = makeCourse('starter', 3);
  const progress = async () => computeCourseProgress(course, await readLessonRows(db), await readProjectRows(db));

  test('a finished lesson stays finished and its best score is kept when the level changes and the quiz gets longer or shorter', async () => {
    await saveProfile(db, { experience: 'beginner', goals: ['ai'] });
    // A beginner is asked 4 questions and gets 4 right.
    await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 4, total: 4, day: '2026-11-13' });
    await setTaskDone(db, 'starter-01', 'starter', true);
    const before = await readLessonRows(db);
    const stateBefore = await progress();

    // The learner moves up to professional: nothing in progress is read or written by that.
    await saveProfile(db, { experience: 'professional', assessment: null });
    expect((await readProfile(db))?.experience).toBe('professional');
    expect(await readLessonRows(db)).toEqual(before);
    expect((await progress()).lessonState('starter-01')).toBe('done');

    // Retaking at the new level: 6 questions, 3 right (50%) is not a pass, but it neither un-finishes the lesson nor lowers the best score.
    const failed = await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 3, total: 6, day: '2026-11-14' });
    expect(failed).toEqual({ completedNow: false, passed: false });
    const [row] = await readLessonRows(db);
    expect(row).toMatchObject({ completed_at: before[0].completed_at, quiz_correct: 4, quiz_total: 4, task_done: 1 });
    expect((await progress()).lessonsDone).toBe(stateBefore.lessonsDone);
    expect((await progress()).quizAverage).toBe(1);
  });

  test('the stored best score always means a fraction of the questions asked', async () => {
    await saveQuizResult(db, { lessonId: 'starter-02', courseId: 'starter', correct: 3, total: 4, day: '2026-11-13' });
    // 5 of 6 (83%) beats 3 of 4 (75%) and is kept as the pair it was asked as.
    await saveQuizResult(db, { lessonId: 'starter-02', courseId: 'starter', correct: 5, total: 6, day: '2026-11-13' });
    expect((await readLessonRows(db)).find((r) => r.lesson_id === 'starter-02')).toMatchObject({ quiz_correct: 5, quiz_total: 6 });
    // 4 of 6 (67%) is worse: the pair stays together, never 5 out of 4 or 4 out of 6.
    await saveQuizResult(db, { lessonId: 'starter-02', courseId: 'starter', correct: 4, total: 6, day: '2026-11-13' });
    expect((await readLessonRows(db)).find((r) => r.lesson_id === 'starter-02')).toMatchObject({ quiz_correct: 5, quiz_total: 6 });
  });

  test('a lesson passes at 60% of the questions the learner was asked, whichever level asked them', async () => {
    expect((await saveQuizResult(db, { lessonId: 'starter-03', courseId: 'starter', correct: 3, total: 5, day: '2026-11-13' })).passed).toBe(true);
    expect((await saveQuizResult(db, { lessonId: 'starter-01', courseId: 'starter', correct: 3, total: 6, day: '2026-11-13' })).passed).toBe(false);
  });

  test('choosing a level replaces an older skill-check result, so an explicit choice wins', async () => {
    await saveProfile(db, { experience: 'beginner', assessment: { level: 'strong', correct: 7, total: 8, at: '2026-11-01T00:00:00Z' } });
    expect((await readProfile(db))?.assessment?.level).toBe('strong');
    await saveProfile(db, { experience: 'intermediate', assessment: null });
    expect((await readProfile(db))?.assessment).toBeNull();
  });
});
