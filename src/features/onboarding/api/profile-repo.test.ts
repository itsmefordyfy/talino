import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { readProfile, saveProfile } from './profile-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('learner profile', () => {
  test('is empty until something is saved', async () => {
    expect(await readProfile(db)).toBeNull();
  });

  test('saves step by step and a closed app resumes where it stopped', async () => {
    await saveProfile(db, { experience: 'beginner', step: 2 });
    await saveProfile(db, { goals: ['frontend', 'ai'], step: 3 });
    const resumed = await readProfile(db);
    expect(resumed).toMatchObject({ experience: 'beginner', goals: ['frontend', 'ai'], step: 3, status: 'in_progress', completedAt: null });
  });

  test('there is only ever one profile', async () => {
    await saveProfile(db, { experience: 'beginner' });
    await saveProfile(db, { experience: 'advanced' });
    const rows = await db.getAllAsync('SELECT id FROM learner_profile');
    expect(rows).toHaveLength(1);
    expect((await readProfile(db))?.experience).toBe('advanced');
  });

  test('a patch changes only what it names', async () => {
    await saveProfile(db, { experience: 'intermediate', goals: ['ai'], styles: ['projects'], dailyMinutes: 30, days: [1, 3], timeOfDay: 'evening' });
    await saveProfile(db, { dailyMinutes: 15 });
    expect(await readProfile(db)).toMatchObject({ experience: 'intermediate', goals: ['ai'], styles: ['projects'], dailyMinutes: 15, days: [1, 3], timeOfDay: 'evening' });
  });

  test('cleans what it is given: unknown ids and out-of-range values never reach the table', async () => {
    await saveProfile(db, { experience: 'wizard' as never, goals: ['ai', 'nonsense', 'ai'] as never, dailyMinutes: 7, days: [1, 9, 1, -2, 0] as never });
    expect(await readProfile(db)).toMatchObject({ experience: null, goals: ['ai'], dailyMinutes: null, days: [0, 1] });
  });

  test('"not sure yet" stands alone and a specific pick replaces it', async () => {
    await saveProfile(db, { interests: ['not-sure'] });
    expect((await readProfile(db))?.interests).toEqual(['not-sure']);
    await saveProfile(db, { interests: ['not-sure', 'python'] });
    expect((await readProfile(db))?.interests).toEqual(['python']);
  });

  test('completing stamps the time once; editing later keeps it and the answers elsewhere', async () => {
    await saveProfile(db, { experience: 'beginner', goals: ['ai'], status: 'completed' });
    const first = await readProfile(db);
    expect(first?.status).toBe('completed');
    expect(first?.completedAt).not.toBeNull();
    await saveProfile(db, { goals: ['ai', 'frontend'] });
    const edited = await readProfile(db);
    expect(edited?.completedAt).toBe(first?.completedAt);
    expect(edited?.goals).toEqual(['ai', 'frontend']);
  });

  test('keeps the assessment result and the stored plan', async () => {
    await saveProfile(db, { assessment: { level: 'comfortable', correct: 5, total: 8, at: '2026-11-13T10:00:00.000Z' }, plan: { startCourseId: 'developer', nextCourseIds: ['experienced'], generatedAt: '2026-11-13T10:00:01.000Z' } });
    expect(await readProfile(db)).toMatchObject({ assessment: { level: 'comfortable', correct: 5, total: 8 }, plan: { startCourseId: 'developer', nextCourseIds: ['experienced'] } });
  });

  test('a row with damaged JSON reads as empty answers, never an error', async () => {
    await saveProfile(db, { experience: 'beginner' });
    await db.runAsync("UPDATE learner_profile SET goals = '{{bad', assessment = 'nope'");
    expect(await readProfile(db)).toMatchObject({ experience: 'beginner', goals: [], assessment: null });
  });
});
