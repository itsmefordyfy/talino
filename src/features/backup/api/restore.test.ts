import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { initialSettingsState } from '@/features/settings/settings-slice';

import { canonicalJson, parseBackup } from '../lib/format';
import { TABLE_NAMES } from '../lib/schema';
import { activity, application, at, badge, certificate, day, goal, income, learnerProfile, lesson, nodeHash, parsedSnapshot, project, resumeItem, rowsOf, seed, snapshotOf, tombstonesOf } from '../test-support';
import { hasOwnLearningData } from './local-rows';
import { previewRestore, restoreFromBackup, type RestoreOptions } from './restore';

type Db = Awaited<ReturnType<typeof createTestDatabase>>;
let a: Db;
let b: Db;
beforeEach(async () => {
  a = await createTestDatabase();
  b = await createTestDatabase();
});
afterEach(() => {
  a.close();
  b.close();
});

const merge = (over: Partial<RestoreOptions> = {}): RestoreOptions => ({ mode: 'merge', settings: { local: initialSettingsState, usedInstall: false }, ...over });
const replace = (over: Partial<RestoreOptions> = {}): RestoreOptions => ({ ...merge(), mode: 'replace', ...over });

async function everything(db: Db): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  for (const name of TABLE_NAMES) out[name] = await rowsOf(db, name);
  out.deleted_rows = await tombstonesOf(db);
  return out;
}

describe('merging a backup', () => {
  test('two phones ahead on different lessons end with both, and restoring never adds XP-bearing rows twice', async () => {
    await seed(a, 'lesson_progress', [1, 2, 3, 4, 5].map((n) => lesson(`l${n}`)));
    await seed(a, 'activity_progress', [activity('a1', { solved: 1, xp: 10, solved_at: at(6) })]);
    await seed(b, 'lesson_progress', [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => lesson(`l${n}`, n > 5 ? { completed_at: at(8) } : {})));
    await seed(b, 'activity_progress', [activity('a1', { solved: 1, xp: 10, solved_at: at(7) }), activity('a2', { solved: 1, xp: 5, solved_at: at(8) })]);

    const fromB = await parsedSnapshot(b, { profileId: 'phone-b' });
    const result = await restoreFromBackup(a, fromB, merge({ settings: { local: initialSettingsState, usedInstall: true } }));

    expect((await rowsOf(a, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9']);
    const activities = await rowsOf(a, 'activity_progress');
    expect(activities.map((row) => [row.activity_id, row.xp, row.solved_at])).toEqual([['a1', 10, at(6)], ['a2', 5, at(8)]]);
    expect(result.summary).toMatchObject({ newRows: 5, updatedRows: 0 });

    // The other direction: phone B gets nothing new from phone A's older, smaller state.
    const fromA = await parsedSnapshot(a, { profileId: 'phone-a' });
    const before = await everything(b);
    await restoreFromBackup(b, fromA, merge());
    const after = await everything(b);
    expect(after.lesson_progress).toEqual(before.lesson_progress);
    // Phone A's earlier solve of a1 is the one both now agree on.
    expect((after.activity_progress as { activity_id: string; solved_at: string }[]).find((row) => row.activity_id === 'a1')?.solved_at).toBe(at(6));
  });

  test('restoring the same file twice changes nothing the second time', async () => {
    await seed(b, 'lesson_progress', [lesson('l1'), lesson('l2', { completed_at: null, quiz_correct: null, quiz_total: null })]);
    await seed(b, 'project_progress', [project('p1', { status: 'passed', steps_done: '["x"]' })]);
    await seed(b, 'applications', [application('app1')]);
    await seed(b, 'income', [income('i1', { application_id: 'app1' })]);
    await seed(b, 'badges', [badge('b1')]);
    await seed(a, 'lesson_progress', [lesson('l2', { completed_at: at(7), quiz_correct: 3, quiz_total: 5 })]);
    const backup = await parsedSnapshot(b);

    const first = await restoreFromBackup(a, backup, merge());
    const afterFirst = await everything(a);
    const second = await restoreFromBackup(a, backup, merge());
    expect(await everything(a)).toEqual(afterFirst);
    expect(second.summary).toMatchObject({ newRows: 0, updatedRows: 0, removedRows: 0 });
    expect(first.summary.newRows + first.summary.updatedRows).toBeGreaterThan(0);
    // Restoring a phone's own snapshot onto itself is a no-op too.
    const own = await parsedSnapshot(a);
    await restoreFromBackup(a, own, merge());
    expect(await everything(a)).toEqual(afterFirst);
  });

  test('never duplicates rows: identical data restores to the same rows', async () => {
    for (const db of [a, b]) {
      await seed(db, 'lesson_progress', [lesson('l1')]);
      await seed(db, 'certificates', [certificate(db === a ? 'c-a' : 'c-b', 'dev')]);
      await seed(db, 'learning_days', [day('2026-11-01')]);
    }
    await restoreFromBackup(a, await parsedSnapshot(b), merge());
    expect(await rowsOf(a, 'lesson_progress')).toHaveLength(1);
    expect(await rowsOf(a, 'certificates')).toHaveLength(1);
    expect((await rowsOf(a, 'certificates'))[0].id).toBe('c-a');
    expect(await rowsOf(a, 'learning_days')).toHaveLength(1);
  });

  test('a project is never moved back and its review token stays this phone’s', async () => {
    await a.runAsync("INSERT INTO project_progress (project_id, course_id, steps_done, status, review_token, created_at, updated_at) VALUES ('p1', 'dev', '[]', 'passed', 'LOCAL-TOKEN', ?, ?)", [at(6), at(6)]);
    await seed(b, 'project_progress', [project('p1', { status: 'submitted', updated_at: at(9), submission: 'https://x.dev' }), project('p2', { status: 'passed' })]);
    await b.runAsync("UPDATE project_progress SET review_token = 'REMOTE-TOKEN'");
    const backup = await parsedSnapshot(b);
    expect(JSON.stringify(backup)).not.toContain('REMOTE-TOKEN');
    await restoreFromBackup(a, backup, merge());
    const rows = await a.getAllAsync<{ project_id: string; status: string; review_token: string | null; submission: string | null }>('SELECT project_id, status, review_token, submission FROM project_progress ORDER BY project_id');
    expect(rows).toEqual([
      { project_id: 'p1', status: 'passed', review_token: 'LOCAL-TOKEN', submission: 'https://x.dev' },
      { project_id: 'p2', status: 'passed', review_token: null, submission: null },
    ]);
  });

  test('an income entry whose application is not on this phone is restored unlinked, not rejected', async () => {
    await seed(b, 'applications', [application('gone')]);
    await seed(b, 'income', [income('i1', { application_id: 'gone' })]);
    const backup = await parsedSnapshot(b);
    backup.tables.applications = [];
    await restoreFromBackup(a, backup, merge());
    expect((await rowsOf(a, 'income'))[0]).toMatchObject({ id: 'i1', application_id: null });
  });
});

describe('what the learner deleted stays deleted', () => {
  test('an old backup never brings back a deleted application, goal or résumé item', async () => {
    await seed(a, 'applications', [application('a1'), application('a2')]);
    await seed(a, 'career_goals', [goal('g1')]);
    await seed(a, 'resume_items', [resumeItem('r1')]);
    const old = await parsedSnapshot(a);
    await a.runAsync("DELETE FROM applications WHERE id = 'a1'");
    await a.runAsync("DELETE FROM career_goals WHERE id = 'g1'");
    await a.runAsync("DELETE FROM resume_items WHERE id = 'r1'");
    const afterDelete = await everything(a);

    const result = await restoreFromBackup(a, old, merge({ settings: { local: initialSettingsState, usedInstall: true } }));
    expect((await rowsOf(a, 'applications')).map((row) => row.id)).toEqual(['a2']);
    expect(await rowsOf(a, 'career_goals')).toEqual([]);
    expect(await rowsOf(a, 'resume_items')).toEqual([]);
    expect(await everything(a)).toEqual(afterDelete);
    expect(result.summary.keptLocal).toBeGreaterThanOrEqual(3);
  });

  test('a row edited after its deletion is kept, and its tombstone is dropped', async () => {
    await seed(a, 'applications', [application('a1', { title: 'Old title', updated_at: at(5) })]);
    await a.runAsync("DELETE FROM applications WHERE id = 'a1'");
    // The deletion is noted "now"; a backup holding the row edited later (another phone's newer edit) revives it.
    const future = new Date(Date.now() + 86_400_000).toISOString();
    await seed(b, 'applications', [application('a1', { title: 'Edited later', updated_at: future })]);
    await restoreFromBackup(a, await parsedSnapshot(b), merge());
    expect(await rowsOf(a, 'applications')).toMatchObject([{ id: 'a1', title: 'Edited later' }]);
    expect(await tombstonesOf(a)).toEqual([]);
  });

  test('the backup’s deletions reach another phone, with the backup’s time, and are remembered', async () => {
    await seed(a, 'career_goals', [goal('g1', { updated_at: at(5) }), goal('g2', { updated_at: at(5) })]);
    await seed(b, 'career_goals', [goal('g1', { updated_at: at(5) }), goal('g2', { updated_at: at(5) })]);
    await b.runAsync("DELETE FROM career_goals WHERE id = 'g1'");
    const backup = await parsedSnapshot(b);
    const result = await restoreFromBackup(a, backup, merge({ settings: { local: initialSettingsState, usedInstall: true } }));
    expect((await rowsOf(a, 'career_goals')).map((row) => row.id)).toEqual(['g2']);
    expect(result.summary.removedRows).toBe(1);
    expect(await tombstonesOf(a)).toEqual(backup.tombstones);
    // And the old file can't bring it back later either.
    const stale = await parsedSnapshot(a);
    expect(stale.tombstones).toHaveLength(1);
  });

  test('a goal edited here after the backup’s deletion survives', async () => {
    await seed(a, 'career_goals', [goal('g1', { updated_at: new Date(Date.now() + 86_400_000).toISOString() })]);
    await seed(b, 'career_goals', [goal('g1')]);
    await b.runAsync("DELETE FROM career_goals WHERE id = 'g1'");
    await restoreFromBackup(a, await parsedSnapshot(b), merge());
    expect(await rowsOf(a, 'career_goals')).toHaveLength(1);
    expect(await tombstonesOf(a)).toEqual([]);
  });
});

describe('replace mode', () => {
  test('makes the backed-up data the backup’s, clears this phone’s tombstones first and reports what would be lost', async () => {
    await seed(a, 'lesson_progress', [lesson('local-only'), lesson('both', { quiz_correct: 1, quiz_total: 5 })]);
    await seed(a, 'applications', [application('mine'), application('deleted')]);
    await a.runAsync("DELETE FROM applications WHERE id = 'deleted'");
    await seed(b, 'lesson_progress', [lesson('both', { quiz_correct: 5, quiz_total: 5 }), lesson('theirs')]);
    await seed(b, 'applications', [application('theirs-app')]);
    const backup = await parsedSnapshot(b);

    const preview = await previewRestore(a, backup, { mode: 'replace' });
    expect(preview.wouldReplace).toEqual({ localRows: 3, lostRows: 2 });
    expect(await rowsOf(a, 'lesson_progress')).toHaveLength(2);

    const result = await restoreFromBackup(a, backup, replace());
    expect((await rowsOf(a, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['both', 'theirs']);
    expect(await rowsOf(a, 'lesson_progress')).toEqual(await rowsOf(b, 'lesson_progress'));
    expect((await rowsOf(a, 'applications')).map((row) => row.id)).toEqual(['theirs-app']);
    // The wipe's own deletes left no tombstones: the phone's record of deletions is the backup's.
    expect(await tombstonesOf(a)).toEqual(backup.tombstones);
    expect(result.mode).toBe('replace');
    expect(preview.newRows).toBe(result.summary.newRows);
  });

  test('is all or nothing: a failure part-way rolls the wipe and every write back', async () => {
    await seed(a, 'lesson_progress', [lesson('mine')]);
    await seed(a, 'applications', [application('a1')]);
    await a.runAsync("DELETE FROM applications WHERE id = 'a1'");
    await seed(b, 'lesson_progress', [lesson('theirs')]);
    await seed(b, 'applications', [application('b1')]);
    await seed(b, 'income', [income('i1')]);
    const backup = await parsedSnapshot(b);
    const before = await everything(a);

    await expect(
      restoreFromBackup(a, backup, replace({ hooks: { afterStep: (step) => { if (step === 'income') throw new Error('disk full'); } } })),
    ).rejects.toThrow('disk full');
    expect(await everything(a)).toEqual(before);

    // The same restore without the failure then works, and a failed merge leaves the phone as it was too.
    await expect(restoreFromBackup(a, backup, merge({ hooks: { afterStep: (step) => { if (step === 'tombstones') throw new Error('late failure'); } } }))).rejects.toThrow('late failure');
    expect(await everything(a)).toEqual(before);
    await restoreFromBackup(a, backup, replace());
    expect((await rowsOf(a, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['theirs']);
  });
});

describe('the preview', () => {
  test('writes nothing and says exactly what the restore then does', async () => {
    await seed(a, 'lesson_progress', [lesson('l1', { completed_at: null, quiz_correct: null, quiz_total: null }), lesson('l2')]);
    await seed(a, 'applications', [application('a1', { updated_at: at(9) })]);
    await seed(b, 'lesson_progress', [lesson('l1'), lesson('l2'), lesson('l3')]);
    await seed(b, 'applications', [application('a1', { updated_at: at(6) })]);
    await seed(b, 'badges', [badge('b1')]);
    const backup = await parsedSnapshot(b, { profileId: 'phone-b' });
    const before = await everything(a);

    const preview = await previewRestore(a, backup, { profileId: 'phone-a' });
    expect(await everything(a)).toEqual(before);
    expect(preview).toMatchObject({ mode: 'merge', createdAt: backup.createdAt, appVersion: '1.0.0', platform: 'ios', sameProfile: false, nothingToRestore: false });
    expect((await previewRestore(a, backup, { profileId: 'phone-b' })).sameProfile).toBe(true);

    const result = await restoreFromBackup(a, backup, merge());
    expect(result.summary).toEqual({ newRows: preview.newRows, updatedRows: preview.updatedRows, keptLocal: preview.keptLocal, unchanged: preview.unchanged, removedRows: preview.removedRows, byTable: preview.byTable });
    expect(preview).toMatchObject({ newRows: 2, updatedRows: 1, keptLocal: 1, unchanged: 1 });
    expect(preview.byTable.lesson_progress).toMatchObject({ newRows: 1, updatedRows: 1, unchanged: 1 });

    expect((await previewRestore(a, backup)).nothingToRestore).toBe(true);
  });
});

describe('settings after a restore', () => {
  test('a fresh install takes the backup’s settings and skips the welcome; a used one only fills defaults', async () => {
    await seed(b, 'lesson_progress', [lesson('l1')]);
    const backup = await parsedSnapshot(b, { settings: { learnerName: 'Ada', appearance: 'dark', dailyMinutes: 15, onboarded: true, goal: 'builder' } });

    const fresh = await restoreFromBackup(a, backup, merge());
    expect(fresh.settings).toMatchObject({ learnerName: 'Ada', appearance: 'dark', dailyMinutes: 15, goal: 'builder', onboarded: true });

    const used = await restoreFromBackup(b, backup, merge({ settings: { local: { ...initialSettingsState, learnerName: 'Grace', appearance: 'light', onboarded: true }, usedInstall: true } }));
    expect(used.settings).toEqual({ dailyMinutes: 15, goal: 'builder' });

    const replaced = await restoreFromBackup(b, backup, replace({ settings: { local: { ...initialSettingsState, learnerName: 'Grace', onboarded: true }, usedInstall: true } }));
    expect(replaced.settings).toMatchObject({ learnerName: 'Ada', appearance: 'dark' });
  });

  test('restored progress turns the welcome off even when the file says otherwise, and nothing changes when nothing differs', async () => {
    await seed(b, 'lesson_progress', [lesson('l1')]);
    const backup = await parsedSnapshot(b, { settings: { onboarded: false } });
    expect((await restoreFromBackup(a, backup, merge())).settings).toEqual({ onboarded: true });
    const empty = await parsedSnapshot(await createTestDatabase(), {});
    expect((await restoreFromBackup(a, empty, merge())).settings).toBeNull();
  });

  test('a file’s hostile settings never reach the result', async () => {
    const { text } = await snapshotOf(b);
    const raw = JSON.parse(text) as { settings: Record<string, unknown>; tables: Record<string, unknown> };
    raw.settings = { language: 'xx', appearance: 'neon', autoBackup: false, learnerName: '<script>', speechRate: 'fast' };
    // Re-sign through the parser's own hash so only the settings check is under test.
    const body = { format: 'talino-backup', version: 1, app: 'talino', schemaVersion: 4, createdAt: at(6), platform: 'ios', profileId: 'p', settings: raw.settings, tables: raw.tables };
    const signed = JSON.stringify({ ...body, appVersion: '1', checksum: `sha256:${await nodeHash(canonicalJson(body))}` });
    const parsed = await parseBackup(signed, nodeHash);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const result = await restoreFromBackup(a, parsed.backup, merge());
    expect(result.settings).toEqual({ learnerName: '<script>' });
  });
});

describe('own data', () => {
  test('a half-done welcome is not progress; a learning row is', async () => {
    expect(await hasOwnLearningData(a)).toBe(false);
    await seed(a, 'learner_profile', [learnerProfile({ status: 'in_progress' })]);
    expect(await hasOwnLearningData(a)).toBe(false);
    await seed(a, 'badges', [badge('b1')]);
    expect(await hasOwnLearningData(a)).toBe(true);
  });

  test('a finished profile in a backup beats the half-done one a fresh install started meanwhile', async () => {
    await seed(a, 'learner_profile', [learnerProfile({ status: 'in_progress', step: 1, updated_at: at(12) })]);
    await seed(b, 'learner_profile', [learnerProfile({ status: 'completed', step: 7, completed_at: at(6), updated_at: at(6) })]);
    await restoreFromBackup(a, await parsedSnapshot(b), merge());
    expect((await rowsOf(a, 'learner_profile'))[0]).toMatchObject({ status: 'completed', step: 7 });
  });
});
