import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { CloudError } from '../cloud/types';
import { AUTO_RESTORE_KEEP_LOOKING_MS } from '../lib/auto-restore';
import { application, badge, learnerProfile, lesson, makeContext, rowsOf, seed, snapshotOf, type TestContext } from '../test-support';
import { checkForBackup, startAutoRestore } from './auto-restore';

type Db = Awaited<ReturnType<typeof createTestDatabase>>;
let old: Db;
let fresh: Db;
beforeEach(async () => {
  old = await createTestDatabase();
  fresh = await createTestDatabase();
  await seed(old, 'lesson_progress', [1, 2, 3].map((n) => lesson(`l${n}`)));
  await seed(old, 'applications', [application('a1')]);
});
afterEach(() => {
  old.close();
  fresh.close();
});

/** Puts the old phone's backup where the new phone will find it (iCloud, or the folder Android restored). */
async function putBackup(ctx: TestContext, where: 'icloud' | 'folder', at = Date.UTC(2026, 10, 12)) {
  const { text } = await snapshotOf(old, { profileId: 'old-phone', now: new Date(at) });
  const name = `talino-auto-20261112000000.talino-backup`;
  if (where === 'icloud') ctx.provider.stored.set(name, { text, modified: new Date(at).toISOString() });
  else await ctx.fs.write('backups', name, text);
}

describe('automatic restore on a fresh install', () => {
  test('iPhone: finds the newest backup in iCloud and merges it in; the welcome is skipped and it is idempotent', async () => {
    const ctx = makeContext(fresh, { platform: 'ios' });
    await putBackup(ctx, 'icloud');
    expect(await startAutoRestore(ctx)).toBe(true);
    const result = await checkForBackup(ctx);
    expect(result).toMatchObject({ outcome: 'restored', due: false });
    expect((await rowsOf(fresh, 'lesson_progress')).map((row) => row.lesson_id)).toEqual(['l1', 'l2', 'l3']);
    expect(await rowsOf(fresh, 'applications')).toHaveLength(1);
    expect(ctx.applied[0]).toMatchObject({ onboarded: true });
    expect(ctx.changed.count).toBe(1);
    expect(ctx.runState.get().state.lastRestoreAt).not.toBeNull();
    expect(ctx.autoRestore.get()?.status).toBe('restored');
    // No safety copy for a fresh phone (nothing to lose), and a second look does nothing.
    expect([...ctx.fs.files.keys()].some((uri) => uri.includes('before-restore'))).toBe(false);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'none_found', due: false });
    expect(await rowsOf(fresh, 'lesson_progress')).toHaveLength(3);
  });

  test('Android: merges the snapshot the system restored into backups/ at launch', async () => {
    const ctx = makeContext(fresh, { platform: 'android' });
    await putBackup(ctx, 'folder');
    expect(await startAutoRestore(ctx)).toBe(true);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'restored' });
    expect(await rowsOf(fresh, 'lesson_progress')).toHaveLength(3);
    expect(ctx.provider.uploads).toEqual([]);
  });

  test('keeps looking while nothing is there, stops after a week, and a later backup is still found within it', async () => {
    const ctx = makeContext(fresh);
    expect(await startAutoRestore(ctx)).toBe(true);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'none_found', due: true });
    ctx.clock.t += 3 * 86_400_000;
    await putBackup(ctx, 'icloud', ctx.clock.t);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'restored', due: false });

    const quiet = makeContext(await createTestDatabase());
    await startAutoRestore(quiet);
    expect((await checkForBackup(quiet)).due).toBe(true);
    quiet.clock.t += AUTO_RESTORE_KEEP_LOOKING_MS + 1000;
    expect(await checkForBackup(quiet)).toMatchObject({ outcome: 'none_found', due: false });
    expect(quiet.autoRestore.get()?.status).toBe('none');
  });

  test('signed out of iCloud is not final within the week; offline is a failed look to repeat', async () => {
    const ctx = makeContext(fresh, { provider: { status: 'signed_out' } });
    await startAutoRestore(ctx);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'needs_account', due: true });
    ctx.provider.config.status = 'available';
    ctx.provider.config.listError = new CloudError('offline');
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'failed', due: true });
    ctx.provider.config.listError = null;
    await putBackup(ctx, 'icloud');
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'restored' });
  });

  test('skips a damaged newest backup for the next good one; all unusable ends the looking with a reason', async () => {
    const ctx = makeContext(fresh);
    await putBackup(ctx, 'icloud');
    ctx.provider.stored.set('talino-auto-20261113000000.talino-backup', { text: '{"format": "talino-backup", broken', modified: new Date(Date.UTC(2026, 10, 13)).toISOString() });
    await startAutoRestore(ctx);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'restored' });

    const damaged = makeContext(await createTestDatabase());
    damaged.provider.stored.set('x.talino-backup', { text: 'garbage', modified: new Date().toISOString() });
    await startAutoRestore(damaged);
    expect(await checkForBackup(damaged)).toMatchObject({ outcome: 'unreadable', due: false });
    expect(damaged.autoRestore.get()?.status).toBe('unreadable');
  });

  test('a backup from a newer app ends the looking with its own status', async () => {
    const ctx = makeContext(fresh);
    const { text } = await snapshotOf(old, { schemaVersion: 99 });
    ctx.provider.stored.set('talino-auto-1.talino-backup', { text, modified: new Date().toISOString() });
    await startAutoRestore(ctx);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'needs_newer_app', due: false });
    expect(ctx.autoRestore.get()?.status).toBe('needs_newer_app');
  });

  test('an install that already has progress never looks, and a phone that gains progress stops looking', async () => {
    const used = makeContext(old);
    await putBackup(used, 'icloud');
    expect(await startAutoRestore(used)).toBe(false);
    expect(await checkForBackup(used)).toMatchObject({ outcome: 'none_found', due: false });
    expect(used.autoRestore.get()?.status).toBe('none');

    const ctx = makeContext(fresh);
    await startAutoRestore(ctx);
    await seed(fresh, 'badges', [badge('first-lesson')]);
    await putBackup(ctx, 'icloud');
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'has_data', due: false });
    expect(await rowsOf(fresh, 'lesson_progress')).toEqual([]);
  });

  test('a half-done welcome does not count as progress, and the finished one from the backup wins', async () => {
    await seed(fresh, 'learner_profile', [learnerProfile({ status: 'in_progress', step: 2, updated_at: '2026-11-20T10:00:00.000Z' })]);
    await seed(old, 'learner_profile', [learnerProfile({ status: 'completed', step: 7, completed_at: '2026-11-06T10:00:00.000Z', updated_at: '2026-11-06T10:00:00.000Z' })]);
    const ctx = makeContext(fresh);
    await putBackup(ctx, 'icloud');
    expect(await startAutoRestore(ctx)).toBe(true);
    expect(await checkForBackup(ctx)).toMatchObject({ outcome: 'restored' });
    expect((await rowsOf(fresh, 'learner_profile'))[0]).toMatchObject({ status: 'completed', step: 7 });
  });

  test('two looks at once are one look', async () => {
    const ctx = makeContext(fresh);
    await putBackup(ctx, 'icloud');
    await startAutoRestore(ctx);
    const [a, b] = await Promise.all([checkForBackup(ctx), checkForBackup(ctx)]);
    expect(a).toBe(b);
    expect(ctx.changed.count).toBe(1);
  });
});
