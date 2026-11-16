import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import type { SQLiteDatabase } from 'expo-sqlite';

import { createTestDatabase } from '@/db/testing/node-database';
import { readLessonRows, readProjectRows, saveQuizResult } from '@/features/courses/api/progress-repo';
import { COURSES } from '@/features/courses/content';
import { catalogFacts } from '@/features/courses/lib/catalog-facts';
import { computeCourseProgress } from '@/features/courses/lib/progress';
import { buildDiscoverySections, pickLearningPath, signalsFrom } from '@/features/courses/lib/recommendations';
import { FACTS, signalsFor } from '@/features/courses/lib/recommendations/recommendations.test-helpers';
import { readProfile, saveProfile } from '@/features/onboarding/api/profile-repo';
import { EMPTY_PROFILE } from '@/features/onboarding/lib/profile';

import { lastActivityByCourse, signalsKey } from './learner';
import { startHere } from './start-here';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

/** What the app does after a profile is saved: re-read the profile and the progress, build the signals, build the sections (the same calls the hooks make). */
async function discoveryNow(explored: Record<string, number> = {}) {
  const profile = (await readProfile(db)) ?? EMPTY_PROFILE;
  const lessons = await readLessonRows(db);
  const projects = await readProjectRows(db);
  const progress = COURSES.map((course) => computeCourseProgress(course, lessons, projects));
  const signals = signalsFrom(profile, progress, { facts: catalogFacts(), lastActivityAt: lastActivityByCourse(lessons), exploredTechnologies: explored });
  const sections = buildDiscoverySections(signals, catalogFacts());
  // What the Discover home leads with: the engine's picks, else the friendly first steps.
  const picks = (sections.recommended ?? []).length > 0 ? sections.recommended!.map((entry) => ({ facts: entry.facts, entry })) : startHere(catalogFacts(), signals).map((facts) => ({ facts, entry: null }));
  return { signals, sections, key: signalsKey(signals), picks };
}

/** Every table except the learner profile, as plain rows: a profile change must leave all of it exactly as it was. */
async function everythingButProfile(database: SQLiteDatabase) {
  const tables = await database.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != 'learner_profile' ORDER BY name");
  const dump: Record<string, unknown[]> = {};
  for (const { name } of tables) dump[name] = await database.getAllAsync(`SELECT * FROM ${name}`);
  return dump;
}

async function passLesson(courseId: string, lessonId: string) {
  await saveQuizResult(db, { lessonId, courseId, correct: 4, total: 5, day: '2026-11-14' });
}

describe('changing the learning profile', () => {
  test('refreshes the picks and the suggested path at once, and the signals key changes with every answer', async () => {
    await saveProfile(db, { experience: 'intermediate', goals: ['frontend'], interests: ['react', 'javascript'], status: 'completed' });
    const web = await discoveryNow();

    await saveProfile(db, { goals: ['mobile'], interests: ['react-native', 'expo'] });
    const mobile = await discoveryNow();

    expect(mobile.key).not.toBe(web.key);
    expect(mobile.picks.map((pick) => pick.facts.id)).not.toEqual(web.picks.map((pick) => pick.facts.id));
  });

  test('the suggested path is rebuilt from the new answers (against the full final catalog)', () => {
    const web = pickLearningPath(signalsFor({ experience: 'intermediate', goals: ['frontend'], interests: ['react', 'javascript'] }), FACTS);
    const ai = pickLearningPath(signalsFor({ experience: 'intermediate', goals: ['ai'], interests: ['llm', 'rag'] }), FACTS);
    expect(web).not.toBeNull();
    expect(ai).not.toBeNull();
    expect(ai!.path.id).not.toBe(web!.path.id);
  });

  test('each field of the profile changes the key: experience, goals, interests, styles, daily minutes', async () => {
    await saveProfile(db, { experience: 'beginner', goals: ['ai'], interests: ['llm'], styles: ['projects'], dailyMinutes: 15, status: 'completed' });
    const keys = [(await discoveryNow()).key];
    for (const patch of [{ experience: 'professional' as const }, { goals: ['backend' as const] }, { interests: ['python' as const] }, { styles: ['video' as const] }, { dailyMinutes: 60 }]) {
      await saveProfile(db, patch);
      keys.push((await discoveryNow()).key);
    }
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('changing the level goes through the same save and refreshes the picks', async () => {
    await saveProfile(db, { experience: 'complete-beginner', goals: ['from-scratch'], status: 'completed' });
    const before = await discoveryNow();
    await saveProfile(db, { experience: 'professional', assessment: null });
    const after = await discoveryNow();
    expect(after.key).not.toBe(before.key);
  });

  test('completed courses, started progress, badges and every other saved record are untouched, and the learner keeps what they have done', async () => {
    const career = COURSES.find((course) => course.kind === 'career')!;
    const mini = COURSES.find((course) => course.kind === 'mini')!;
    // A finished mini-course (every lesson, every project) and one lesson into a career course.
    for (const lesson of mini.lessons) await passLesson(mini.id, lesson.id);
    for (const project of mini.projects) {
      await db.runAsync(`INSERT INTO project_progress (project_id, course_id, status, created_at, updated_at) VALUES (?, ?, 'passed', '2026-11-14T00:00:00Z', '2026-11-14T00:00:00Z')`, project.id, mini.id);
    }
    await passLesson(career.id, career.lessons[0].id);

    await saveProfile(db, { experience: 'beginner', goals: ['frontend'], interests: ['react'], status: 'completed' });
    const explored = { react: 3 };
    const before = await discoveryNow(explored);
    const rowsBefore = await everythingButProfile(db);

    // Everything the Learning profile screen can change, one answer at a time.
    for (const patch of [{ interests: ['python' as const] }, { goals: ['ai' as const, 'freelance' as const] }, { experience: 'professional' as const, assessment: null }, { styles: ['projects' as const] }, { dailyMinutes: 45 }]) {
      await saveProfile(db, patch);
    }
    expect(await everythingButProfile(db)).toEqual(rowsBefore);

    const after = await discoveryNow(explored);
    expect(after.key).not.toBe(before.key);
    // What the learner finished is still finished and is never recommended again; what they started is still in "continue".
    expect(after.signals.completed.has(mini.id)).toBe(true);
    expect(after.sections.recommended?.map((entry) => entry.facts.id) ?? []).not.toContain(mini.id);
    expect(after.sections.continueLearning?.map((item) => item.facts.id)).toContain(career.id);
    expect(after.signals.started.get(career.id)?.fraction).toBe(before.signals.started.get(career.id)?.fraction);
    // What they explored is the same signal.
    expect(after.signals.exploredTechnologies).toEqual(explored);
  });

  test('the same profile and progress always give the same picks (nothing random, nothing stale)', async () => {
    await saveProfile(db, { experience: 'intermediate', goals: ['ai'], interests: ['llm'], status: 'completed' });
    const a = await discoveryNow();
    const b = await discoveryNow();
    expect(b.key).toBe(a.key);
    expect(b.picks.map((pick) => pick.facts.id)).toEqual(a.picks.map((pick) => pick.facts.id));
  });

  test('someone who skipped the welcome (no profile row at all) still gets picks: friendly first steps, never an empty dashboard', async () => {
    const result = await discoveryNow();
    expect(result.picks.length).toBeGreaterThan(0);
    expect(result.picks.every((pick) => pick.entry === null)).toBe(true);
    // Answering later turns the first steps into real, reasoned picks.
    await saveProfile(db, { experience: 'beginner', goals: ['mobile'], interests: ['react-native'], status: 'completed' });
    const answered = await discoveryNow();
    expect(answered.picks.some((pick) => pick.entry !== null)).toBe(true);
  });
});
