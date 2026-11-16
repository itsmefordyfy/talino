import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { application, at, goal, lesson, makeContext, nodeHash, rowsOf, seed, snapshotOf, tombstonesOf } from '../test-support';
import { clearLocalSnapshots, listLocalSnapshots } from './snapshots';
import { createManualBackup, deleteManualBackup, listManualBackups, readBackupFile } from './manual-backups';
import { latestSafetySnapshot, restoreWithSafety, undoLastRestore } from './restore-flow';
import { parseBackup } from '../lib/format';

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

describe('manual backup files', () => {
  test('create writes a checked file under manual-backups/, many allowed, named by date, newest first in the history', async () => {
    await seed(a, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(a);
    const first = await createManualBackup(ctx, '  Before my interview  ');
    ctx.clock.t += 5 * 60_000;
    const second = await createManualBackup(ctx);
    ctx.clock.t += 1000;
    const third = await createManualBackup(ctx);
    expect(first.file.uri).toMatch(/^mem:\/\/manual-backups\/talino-2026-11-\d{2}-\d{4}\.talino-backup$/);
    expect(first.header).toMatchObject({ label: 'Before my interview', appVersion: '1.0.0', platform: 'ios' });
    // Two in one minute get distinct names.
    expect(new Set([second.file.name, third.file.name]).size).toBe(2);
    const history = await listManualBackups(ctx);
    expect(history).toHaveLength(3);
    expect(history.map((entry) => entry.header?.createdAt)).toEqual([...history.map((entry) => entry.header?.createdAt)].sort().reverse());
    expect(history[history.length - 1].header?.label).toBe('Before my interview');
    expect(history[0].header?.counts.lessons).toBe(1);
    // Independent of the automatic backup: nothing in backups/, nothing uploaded.
    expect((await listLocalSnapshots(ctx)).automatic).toEqual([]);
    expect(ctx.provider.uploads).toEqual([]);
  });

  test('a damaged or foreign file shows as such and can be deleted; a good one reads back', async () => {
    await seed(a, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(a);
    await createManualBackup(ctx);
    await ctx.fs.write('manual-backups', 'broken.talino-backup', '{"format":"talino-backup","version":1');
    await ctx.fs.write('manual-backups', 'other.talino-backup', '{"hello":"world"}');
    const newer = await snapshotOf(a, { schemaVersion: 99 });
    await ctx.fs.write('manual-backups', 'newer.talino-backup', newer.text);
    await ctx.fs.write('manual-backups', 'notes.txt', 'ignored');
    const history = await listManualBackups(ctx);
    expect(history.map((entry) => [entry.file.name.replace(/^talino-.*\.talino-backup$/, 'good'), entry.problem]).sort()).toEqual(
      [['broken.talino-backup', 'corrupted'], ['good', null], ['newer.talino-backup', 'needs_newer_app'], ['other.talino-backup', 'not_a_backup']].sort(),
    );
    const broken = history.find((entry) => entry.file.name === 'broken.talino-backup');
    if (!broken) throw new Error('missing');
    await deleteManualBackup(ctx, broken);
    expect((await listManualBackups(ctx)).some((entry) => entry.file.name === 'broken.talino-backup')).toBe(false);
    const good = history.find((entry) => entry.header);
    expect(good && (await readBackupFile(ctx, good.file)).ok).toBe(true);
    expect(await readBackupFile(ctx, { uri: 'mem://nowhere' })).toEqual({ ok: false, reason: 'corrupted' });
  });
});

describe('restoring with a safety net', () => {
  test('a manual restore writes a safety snapshot first, can be undone, and keeps the last three', async () => {
    await seed(a, 'lesson_progress', [lesson('l1')]);
    await seed(a, 'applications', [application('mine')]);
    await seed(b, 'lesson_progress', [lesson('l1'), lesson('l2')]);
    await seed(b, 'applications', [application('theirs')]);
    const ctx = makeContext(a);
    const backup = (await parseBackup((await snapshotOf(b)).text, nodeHash)) as { ok: true; backup: Parameters<typeof restoreWithSafety>[1] };

    const before = { lessons: await rowsOf(a, 'lesson_progress'), apps: await rowsOf(a, 'applications') };
    const outcome = await restoreWithSafety(ctx, backup.backup, 'replace', 'manual');
    expect(outcome.safetyFile?.name).toMatch(/^before-restore-\d{14}\.talino-backup$/);
    expect((await rowsOf(a, 'applications')).map((row) => row.id)).toEqual(['theirs']);
    expect(ctx.changed.count).toBe(1);
    expect(ctx.runState.get().state.lastRestoreAt).not.toBeNull();
    expect(await latestSafetySnapshot(ctx)).not.toBeNull();

    expect(await undoLastRestore(ctx)).toEqual({ ok: true });
    expect(await rowsOf(a, 'lesson_progress')).toEqual(before.lessons);
    expect(await rowsOf(a, 'applications')).toEqual(before.apps);
    // The used safety copy is gone; there is nothing more to undo.
    expect(await latestSafetySnapshot(ctx)).toBeNull();
    expect(await undoLastRestore(ctx)).toEqual({ ok: false, reason: 'nothing_to_undo' });

    for (let i = 0; i < 5; i += 1) {
      ctx.clock.t += 2000;
      await restoreWithSafety(ctx, backup.backup, 'replace', 'manual');
    }
    expect((await listLocalSnapshots(ctx)).safety).toHaveLength(3);
  });

  test('undo brings back what a replace deleted, tombstones included', async () => {
    await seed(a, 'career_goals', [goal('g1', { updated_at: at(5) })]);
    await a.runAsync("DELETE FROM career_goals WHERE id = 'g1'");
    await seed(a, 'lesson_progress', [lesson('l1')]);
    await seed(b, 'lesson_progress', [lesson('other')]);
    const ctx = makeContext(a);
    const parsed = await parseBackup((await snapshotOf(b)).text, nodeHash);
    if (!parsed.ok) throw new Error('parse');
    const tombstonesBefore = await tombstonesOf(a);
    await restoreWithSafety(ctx, parsed.backup, 'replace', 'manual');
    expect(await tombstonesOf(a)).toEqual([]);
    await undoLastRestore(ctx);
    expect(await tombstonesOf(a)).toEqual(tombstonesBefore);
    expect((await rowsOf(a, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['l1']);
  });

  test('no safety copy when nothing would change, when the phone is empty, or for an automatic restore; a failed restore removes its own', async () => {
    await seed(a, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(a);
    const same = await parseBackup((await snapshotOf(a)).text, nodeHash);
    if (!same.ok) throw new Error('parse');
    expect((await restoreWithSafety(ctx, same.backup, 'merge', 'manual')).safetyFile).toBeNull();

    const empty = makeContext(b);
    const theirs = await parseBackup((await snapshotOf(a)).text, nodeHash);
    if (!theirs.ok) throw new Error('parse');
    expect((await restoreWithSafety(empty, theirs.backup, 'merge', 'manual')).safetyFile).toBeNull();

    await seed(b, 'applications', [application('x')]);
    const auto = await restoreWithSafety(empty, { ...theirs.backup, tables: { ...theirs.backup.tables, lesson_progress: [lesson('l9')] } }, 'merge', 'auto');
    expect(auto.safetyFile).toBeNull();

    // A failure inside the restore rolls the data back and leaves no safety copy behind.
    await seed(a, 'applications', [application('keep-me')]);
    const before = await rowsOf(a, 'applications');
    const failing = { afterStep: (step: string) => { if (step === 'income') throw new Error('disk full'); } };
    await expect(restoreWithSafety(ctx, { ...theirs.backup, tables: { ...theirs.backup.tables, lesson_progress: [lesson('l77')] } }, 'replace', 'manual', failing)).rejects.toThrow('disk full');
    expect((await listLocalSnapshots(ctx)).safety).toEqual([]);
    expect(await rowsOf(a, 'applications')).toEqual(before);
    expect((await rowsOf(a, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['l1']);
  });
});

describe('Delete all data and the snapshots', () => {
  test('removes the automatic and safety snapshots and the run memory, but not the learner’s own backup files', async () => {
    await seed(a, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(a);
    await ctx.fs.write('backups', 'talino-auto-20261113000000.talino-backup', 'x');
    await ctx.fs.write('backups', 'before-restore-20261113000000.talino-backup', 'x');
    await createManualBackup(ctx);
    ctx.runState.update({ lastSnapshotAt: '2026-11-13T12:00:00.000Z' });
    await clearLocalSnapshots(ctx);
    const left = [...ctx.fs.files.keys()];
    expect(left).toHaveLength(1);
    expect(left[0]).toContain('manual-backups');
    expect(ctx.runState.get().state.lastSnapshotAt).toBeNull();
  });
});
