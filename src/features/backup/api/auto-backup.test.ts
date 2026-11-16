import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { CloudError } from '../cloud/types';
import { parseBackup } from '../lib/format';
import { lesson, makeContext, nodeHash, seed } from '../test-support';
import { runAutoBackup, UPLOAD_CONFIRM_MS } from './auto-backup';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const names = (ctx: ReturnType<typeof makeContext>, folder: string) => [...ctx.fs.files.keys()].filter((uri) => uri.startsWith(`mem://${folder}/`)).map((uri) => uri.split('/').pop());

describe('the automatic backup run', () => {
  test('iPhone: writes a snapshot, uploads it, waits for iCloud to confirm, and only then says synced', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db, { platform: 'ios', provider: { confirm: ['uploading', 'uploading', 'uploaded'] } });
    expect(await runAutoBackup(ctx)).toBe('synced');
    const [name] = names(ctx, 'backups');
    expect(name).toMatch(/^talino-auto-\d{14}\.talino-backup$/);
    expect(ctx.provider.uploads).toEqual([name]);
    const state = ctx.runState.get().state;
    expect(state.lastSnapshotAt).toBe('2026-11-13T12:00:00.000Z');
    expect(state.lastConfirmedAt).not.toBeNull();
    expect(state.lastError).toBeNull();
    expect(ctx.runState.get().running).toBe(false);
    // The uploaded file is the same checked file.
    const parsed = await parseBackup(ctx.provider.stored.get(name as string)?.text ?? '', nodeHash);
    expect(parsed.ok).toBe(true);
  });

  test('iCloud still uploading after the wait is "queued", never "synced"', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db, { provider: { confirm: ['uploading'] } });
    const startedAt = ctx.clock.t;
    expect(await runAutoBackup(ctx)).toBe('queued');
    expect(ctx.clock.t - startedAt).toBeGreaterThanOrEqual(UPLOAD_CONFIRM_MS);
    expect(ctx.runState.get().state).toMatchObject({ lastError: 'queued', lastConfirmedAt: null });
    expect(ctx.runState.get().state.lastSnapshotAt).not.toBeNull();
  });

  test('a full iCloud, a failure to upload and an offline upload are recorded with their reason, and a later run recovers', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db, { provider: { confirm: ['full'] } });
    expect(await runAutoBackup(ctx)).toBe('failed');
    expect(ctx.runState.get().state.lastError).toBe('full');
    ctx.provider.config.confirm = ['uploaded'];
    ctx.provider.config.uploadError = new CloudError('offline');
    expect(await runAutoBackup(ctx)).toBe('failed');
    expect(ctx.runState.get().state.lastError).toBe('offline');
    ctx.provider.config.uploadError = null;
    expect(await runAutoBackup(ctx)).toBe('synced');
    expect(ctx.runState.get().state).toMatchObject({ lastError: null, lastErrorAt: null });
  });

  test('keeps the newest three snapshots on the phone and the newest three in iCloud', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db);
    for (let i = 0; i < 5; i += 1) {
      ctx.clock.t += 60_000;
      expect(await runAutoBackup(ctx)).toBe('synced');
    }
    expect(names(ctx, 'backups')).toHaveLength(3);
    expect([...ctx.provider.stored.keys()].sort()).toEqual(names(ctx, 'backups').sort());
    expect(ctx.provider.removed).toHaveLength(2);
  });

  test('Android: the snapshot is written to backups/ and is "saved on phone"; nothing is uploaded or confirmed', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db, { platform: 'android' });
    expect(await runAutoBackup(ctx)).toBe('saved');
    expect(names(ctx, 'backups')).toHaveLength(1);
    expect(ctx.provider.uploads).toEqual([]);
    expect(ctx.runState.get().state).toMatchObject({ lastConfirmedAt: null, lastError: null });
    expect(ctx.runState.get().state.lastSnapshotAt).not.toBeNull();
  });

  test('iCloud signed out or missing: the snapshot stays on the phone and nothing is claimed', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    for (const status of ['signed_out', 'unavailable'] as const) {
      const ctx = makeContext(db, { provider: { status } });
      expect(await runAutoBackup(ctx)).toBe('saved');
      expect(ctx.provider.uploads).toEqual([]);
      expect(ctx.runState.get().state.lastConfirmedAt).toBeNull();
    }
  });

  test('an empty phone is never backed up (it would push real backups out of the newest three)', async () => {
    const ctx = makeContext(db);
    expect(await runAutoBackup(ctx)).toBe('empty');
    expect(ctx.fs.files.size).toBe(0);
    expect(ctx.provider.uploads).toEqual([]);
  });

  test('the switch off means nothing runs, except Back up now', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db, { settings: { autoBackup: false } });
    expect(await runAutoBackup(ctx)).toBe('disabled');
    expect(ctx.fs.files.size).toBe(0);
    expect(await runAutoBackup(ctx, { force: true })).toBe('synced');
  });

  test('a second call while one runs waits for it: one snapshot, one upload', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const ctx = makeContext(db);
    const [first, second] = await Promise.all([runAutoBackup(ctx), runAutoBackup(ctx)]);
    expect([first, second]).toEqual(['synced', 'synced']);
    expect(ctx.provider.uploads).toHaveLength(1);
  });

  test('a database failure is recorded as failed and the app carries on', async () => {
    const ctx = makeContext(db);
    await db.execAsync('DROP TABLE badges');
    expect(await runAutoBackup(ctx)).toBe('failed');
    expect(ctx.runState.get()).toMatchObject({ running: false, state: { lastError: 'failed' } });
  });
});
