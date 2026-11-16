import { describe, expect, test } from '@jest/globals';

import { canUseManualBackup } from './access';
import { afterCheck, AUTO_RESTORE_DELAYS_MS, AUTO_RESTORE_KEEP_LOOKING_MS, AUTO_RESTORE_REPEAT_MS, autoRestoreDue, initialAutoRestore, nextLookDelay, parseAutoRestore, type AutoRestoreState } from './auto-restore';
import { autoBackupName, entriesToPrune, formatBytes, isBackupFileName, manualBackupName, namesToPrune, safetyBackupName, uriToPath } from './files';
import { EMPTY_RUN_STATE, parseRunState, type RunState } from './run-state';
import { createBackupScheduler, MAX_WAIT_MS, nextRunDelay, SETTLE_MS, type Timers } from './scheduler';
import { deriveStatus, statusKey, type StatusInput } from './status';

describe('who may use the backup file', () => {
  test('any purchase or All-Access; a plan not yet known never locks; nothing bought does', () => {
    expect(canUseManualBackup({ known: true, allAccess: true, anyPurchase: true })).toBe(true);
    expect(canUseManualBackup({ known: true, allAccess: false, anyPurchase: true })).toBe(true);
    expect(canUseManualBackup({ known: true, allAccess: true, anyPurchase: false })).toBe(true);
    expect(canUseManualBackup({ known: false, allAccess: false, anyPurchase: false })).toBe(true);
    expect(canUseManualBackup({ known: true, allAccess: false, anyPurchase: false })).toBe(false);
  });
});

/** A hand-turned clock: timers fire when `advance` passes them. */
function fakeTimers() {
  let now = 1_000_000;
  let next = 1;
  const pending = new Map<number, { at: number; callback: () => void }>();
  const timers: Timers = {
    now: () => now,
    setTimeout: (callback, ms) => {
      const id = next++;
      pending.set(id, { at: now + ms, callback });
      return id;
    },
    clearTimeout: (handle) => void pending.delete(handle as number),
  };
  const advance = async (ms: number) => {
    const target = now + ms;
    for (;;) {
      const due = [...pending.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      pending.delete(due[0]);
      now = due[1].at;
      due[1].callback();
      await Promise.resolve();
      await Promise.resolve();
    }
    now = target;
  };
  return { timers, advance, pending: () => pending.size };
}

describe('when an automatic backup runs', () => {
  test('waits for the changes to settle, but never longer than a minute from the first', () => {
    expect(nextRunDelay({ now: 0, firstChange: 0, lastChange: 0 })).toBe(SETTLE_MS);
    expect(nextRunDelay({ now: 10_000, firstChange: 0, lastChange: 10_000 })).toBe(SETTLE_MS);
    expect(nextRunDelay({ now: 50_000, firstChange: 0, lastChange: 50_000 })).toBe(MAX_WAIT_MS - 50_000);
    expect(nextRunDelay({ now: 90_000, firstChange: 0, lastChange: 90_000 })).toBe(0);
  });

  test('a burst of edits is one run, and edits that never stop still run within a minute', async () => {
    const clock = fakeTimers();
    let runs = 0;
    const scheduler = createBackupScheduler({ run: async () => void (runs += 1), timers: clock.timers });
    scheduler.markChanged();
    await clock.advance(10_000);
    scheduler.markChanged();
    await clock.advance(10_000);
    expect(runs).toBe(0);
    await clock.advance(5_001);
    expect(runs).toBe(1);

    // Edits every ten seconds never settle, yet the minute's limit still runs a backup.
    for (let i = 0; i < 6; i += 1) {
      scheduler.markChanged();
      await clock.advance(10_000);
    }
    expect(runs).toBe(2);
    scheduler.dispose();
  });

  test('one run at a time: a change during a run schedules another after it', async () => {
    const clock = fakeTimers();
    let release: () => void = () => undefined;
    let runs = 0;
    const scheduler = createBackupScheduler({
      run: () =>
        new Promise<void>((resolve) => {
          runs += 1;
          release = resolve;
        }),
      timers: clock.timers,
    });
    scheduler.markChanged();
    await clock.advance(SETTLE_MS);
    expect(runs).toBe(1);
    expect(scheduler.running).toBe(true);
    scheduler.markChanged();
    await clock.advance(SETTLE_MS * 2);
    expect(runs).toBe(1);
    release();
    await clock.advance(0);
    await clock.advance(SETTLE_MS);
    expect(runs).toBe(2);
    release();
    scheduler.dispose();
  });

  test('going to the background runs a waiting backup at once; with nothing waiting it does nothing; a failing run does not stop later ones', async () => {
    const clock = fakeTimers();
    let runs = 0;
    const scheduler = createBackupScheduler({
      run: async () => {
        runs += 1;
        throw new Error('boom');
      },
      timers: clock.timers,
    });
    scheduler.flush();
    expect(runs).toBe(0);
    scheduler.markChanged();
    scheduler.flush();
    await clock.advance(0);
    expect(runs).toBe(1);
    expect(scheduler.waiting).toBe(false);
    scheduler.markChanged();
    await clock.advance(SETTLE_MS);
    expect(runs).toBe(2);
    scheduler.dispose();
    scheduler.markChanged();
    await clock.advance(MAX_WAIT_MS * 2);
    expect(runs).toBe(2);
  });
});

const base: StatusInput = { platform: 'ios', enabled: true, running: false, cloud: 'available', state: EMPTY_RUN_STATE };
const withState = (state: Partial<RunState>, over: Partial<StatusInput> = {}): StatusInput => ({ ...base, ...over, state: { ...EMPTY_RUN_STATE, ...state } });

describe('the status the screen shows', () => {
  test('iPhone says synced only once iCloud confirmed, and waiting while it hasn’t', () => {
    expect(deriveStatus(base)).toEqual({ status: 'none_yet' });
    expect(deriveStatus(withState({ lastSnapshotAt: '2026-11-13T10:00:00.000Z' }))).toEqual({ status: 'backing_up', reason: 'queued' });
    expect(deriveStatus(withState({ lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastConfirmedAt: '2026-11-13T10:00:30.000Z' }))).toEqual({ status: 'synced' });
    expect(deriveStatus(withState({ lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastError: 'queued', lastErrorAt: '2026-11-13T10:01:00.000Z' }))).toEqual({ status: 'backing_up', reason: 'queued' });
  });

  test('Android never claims a cloud backup: the most it says is "saved on this phone"', () => {
    const android = (state: Partial<RunState>) => deriveStatus(withState(state, { platform: 'android', cloud: null }));
    expect(android({})).toEqual({ status: 'none_yet' });
    expect(android({ lastSnapshotAt: '2026-11-13T10:00:00.000Z' })).toEqual({ status: 'saved_on_phone' });
    // Even a (never recorded) confirmation can't turn it into synced.
    expect(android({ lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastConfirmedAt: '2026-11-13T10:00:30.000Z' }).status).toBe('saved_on_phone');
    expect(android({ lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastError: 'failed', lastErrorAt: '2026-11-13T11:00:00.000Z' })).toEqual({ status: 'failed', reason: 'failed' });
  });

  test('off, signed out, unavailable, failed, running and restored', () => {
    expect(deriveStatus(withState({}, { enabled: false }))).toEqual({ status: 'disabled', reason: 'user_off' });
    expect(deriveStatus(withState({}, { cloud: 'signed_out' }))).toEqual({ status: 'disabled', reason: 'signed_out' });
    expect(deriveStatus(withState({}, { cloud: 'unavailable' }))).toEqual({ status: 'unavailable' });
    expect(deriveStatus(withState({}, { platform: 'web', cloud: null }))).toEqual({ status: 'unavailable' });
    expect(deriveStatus(withState({ lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastConfirmedAt: '2026-11-13T10:00:30.000Z' }, { running: true }))).toEqual({ status: 'backing_up' });
    expect(deriveStatus(withState({ lastConfirmedAt: '2026-11-13T10:00:30.000Z', lastSnapshotAt: '2026-11-13T10:00:00.000Z', lastError: 'full', lastErrorAt: '2026-11-13T11:00:00.000Z' }))).toEqual({ status: 'failed', reason: 'full' });
    // An old error followed by a later confirmed backup is not shown.
    expect(deriveStatus(withState({ lastConfirmedAt: '2026-11-13T12:00:00.000Z', lastSnapshotAt: '2026-11-13T11:59:00.000Z', lastError: 'full', lastErrorAt: '2026-11-13T11:00:00.000Z' }))).toEqual({ status: 'synced' });
    expect(deriveStatus(withState({ lastRestoreAt: '2026-11-13T13:00:00.000Z', lastSnapshotAt: '2026-11-13T12:00:00.000Z', lastConfirmedAt: '2026-11-13T12:00:10.000Z' }))).toEqual({ status: 'restore_completed' });
    expect(deriveStatus(withState({ lastRestoreAt: '2026-11-13T13:00:00.000Z', lastSnapshotAt: '2026-11-13T14:00:00.000Z', lastConfirmedAt: '2026-11-13T14:00:10.000Z' }))).toEqual({ status: 'synced' });
  });

  test('every status maps to words, and a failure reason picks its own', () => {
    expect(statusKey({ status: 'failed', reason: 'full' }, 'ios')).toBe('failed_full');
    expect(statusKey({ status: 'failed', reason: 'queued' }, 'ios')).toBe('failed_failed');
    expect(statusKey({ status: 'failed', reason: 'signed_out' }, 'ios')).toBe('disabled_signed_out');
    expect(statusKey({ status: 'unavailable' }, 'ios')).toBe('unavailable_ios');
    expect(statusKey({ status: 'unavailable' }, 'android')).toBe('unavailable_other');
    expect(statusKey({ status: 'backing_up', reason: 'queued' }, 'ios')).toBe('backing_up_queued');
    expect(statusKey({ status: 'saved_on_phone' }, 'android')).toBe('saved_on_phone');
  });

  test('the remembered state is read defensively', () => {
    expect(parseRunState(null)).toEqual(EMPTY_RUN_STATE);
    expect(parseRunState('not json')).toEqual(EMPTY_RUN_STATE);
    expect(parseRunState(JSON.stringify({ lastError: 'made-up', lastErrorAt: '2026-11-13T10:00:00.000Z', lastSnapshotAt: 5 }))).toEqual(EMPTY_RUN_STATE);
    expect(parseRunState(JSON.stringify({ lastError: 'full', lastErrorAt: '2026-11-13T10:00:00.000Z' }))).toMatchObject({ lastError: 'full', lastErrorAt: '2026-11-13T10:00:00.000Z' });
  });
});

describe('file names and retention', () => {
  test('automatic names sort by time; the newest three stay', () => {
    const names = [1, 2, 3, 4, 5].map((n) => autoBackupName(new Date(Date.UTC(2026, 10, 13, 12, n, 0))));
    expect(names[0]).toBe('talino-auto-20261113120100.talino-backup');
    expect(namesToPrune(names, 3)).toEqual([names[1], names[0]]);
    expect(namesToPrune(names.slice(0, 2), 3)).toEqual([]);
    expect(safetyBackupName(new Date(Date.UTC(2026, 10, 13, 12, 1, 5)))).toBe('before-restore-20261113120105.talino-backup');
  });

  test('cloud retention goes by modified time, whatever order the provider lists', () => {
    const entries = [
      { name: 'b', modified: '2026-11-13T10:00:00.000Z' },
      { name: 'd', modified: '2026-11-13T12:00:00.000Z' },
      { name: 'a', modified: '2026-11-13T09:00:00.000Z' },
      { name: 'c', modified: '2026-11-13T11:00:00.000Z' },
    ];
    expect(entriesToPrune(entries, 3).map((entry) => entry.name)).toEqual(['a']);
    expect(entriesToPrune(entries, 10)).toEqual([]);
  });

  test('manual names are in local time and never collide', () => {
    const date = new Date(2026, 10, 13, 14, 5);
    expect(manualBackupName(date, [])).toBe('talino-2026-11-13-1405.talino-backup');
    expect(manualBackupName(date, ['talino-2026-11-13-1405.talino-backup'])).toBe('talino-2026-11-13-1405-2.talino-backup');
    expect(manualBackupName(date, ['talino-2026-11-13-1405.talino-backup', 'talino-2026-11-13-1405-2.talino-backup'])).toBe('talino-2026-11-13-1405-3.talino-backup');
  });

  test('small helpers', () => {
    expect(isBackupFileName('a.talino-backup')).toBe(true);
    expect(isBackupFileName('a.TALINO-BACKUP')).toBe(true);
    expect(isBackupFileName('a.json')).toBe(false);
    expect(uriToPath('file:///var/mobile/My%20Files/x.talino-backup')).toBe('/var/mobile/My Files/x.talino-backup');
    expect(uriToPath('/plain/path')).toBe('/plain/path');
    expect(uriToPath('file://%E0%A4%A')).toBe('%E0%A4%A');
    expect([formatBytes(12), formatBytes(2048), formatBytes(340 * 1024), formatBytes(1.5 * 1024 * 1024)]).toEqual(['12 B', '2.0 KB', '340 KB', '1.5 MB']);
  });
});

describe('the fresh-install restore state machine', () => {
  const start = '2026-11-13T12:00:00.000Z';
  const later = (ms: number) => new Date(Date.parse(start) + ms).toISOString();
  const pending = (): AutoRestoreState => initialAutoRestore(true, start);

  test('only a fresh install looks', () => {
    expect(autoRestoreDue(initialAutoRestore(true, start))).toBe(true);
    expect(autoRestoreDue(initialAutoRestore(false, start))).toBe(false);
    expect(autoRestoreDue(null)).toBe(false);
  });

  test('a restore, an unreadable backup, a newer app’s backup or progress of its own ends it at once', () => {
    for (const [outcome, status] of [['restored', 'restored'], ['unreadable', 'unreadable'], ['needs_newer_app', 'needs_newer_app'], ['has_data', 'none']] as const) {
      expect(afterCheck(pending(), outcome, start).status).toBe(status);
    }
  });

  test('anything else keeps looking for a week, then settles on what it found', () => {
    let state = afterCheck(pending(), 'none_found', start);
    expect(state).toMatchObject({ status: 'pending', checks: 1, firstAt: start });
    state = afterCheck(state, 'failed', later(AUTO_RESTORE_KEEP_LOOKING_MS - 1000));
    expect(state.status).toBe('pending');
    expect(afterCheck(state, 'none_found', later(AUTO_RESTORE_KEEP_LOOKING_MS + 1000)).status).toBe('none');
    expect(afterCheck(state, 'needs_account', later(AUTO_RESTORE_KEEP_LOOKING_MS + 1000)).status).toBe('needs_account');
    expect(afterCheck(state, 'failed', later(AUTO_RESTORE_KEEP_LOOKING_MS + 1000)).status).toBe('failed');
  });

  test('looks come soon, then as iCloud catches up, then every couple of minutes', () => {
    expect([0, 1, 2].map(nextLookDelay)).toEqual([...AUTO_RESTORE_DELAYS_MS]);
    expect(nextLookDelay(3)).toBe(AUTO_RESTORE_REPEAT_MS);
    expect(nextLookDelay(50)).toBe(AUTO_RESTORE_REPEAT_MS);
  });

  test('the saved state is read defensively', () => {
    expect(parseAutoRestore(null)).toBeNull();
    expect(parseAutoRestore('nope')).toBeNull();
    expect(parseAutoRestore(JSON.stringify({ status: 'sideways', checks: 1 }))).toBeNull();
    expect(parseAutoRestore(JSON.stringify(pending()))).toEqual(pending());
  });
});
