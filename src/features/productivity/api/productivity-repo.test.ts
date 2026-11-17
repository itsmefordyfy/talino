import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { deleteAllData } from '@/features/settings/api/reset';

import { DEFAULT_SETTINGS, createTimer, start } from '../lib/pomodoro';
import { EMPTY_DAY, EMPTY_MATRIX } from '../lib/state';
import {
  listFocusSessions,
  readDayState,
  readMatrixState,
  readPromptDraft,
  readTimer,
  readTimerSettings,
  recordFocusSession,
  writeDayState,
  writeMatrixState,
  writePromptDraft,
  writeTimer,
  writeTimerSettings,
} from './productivity-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const T0 = Date.UTC(2026, 10, 17, 9, 0, 0);

describe('tool state', () => {
  test('a fresh install reads empty tools', async () => {
    expect(await readMatrixState(db)).toEqual(EMPTY_MATRIX);
    expect(await readDayState(db)).toEqual(EMPTY_DAY);
    expect(await readTimerSettings(db)).toEqual(DEFAULT_SETTINGS);
    expect(await readPromptDraft(db, 'daily-planning')).toBeNull();
  });

  test('the matrix comes back as it was left', async () => {
    const state = { tasks: [{ id: 't1', title: 'Send the invoice' }, { id: 't2', title: 'Plan the course' }], placements: { t1: 'do' as const, t2: 'plan' as const } };
    await writeMatrixState(db, state);
    expect(await readMatrixState(db)).toEqual(state);
  });

  test('the day plan comes back as it was left', async () => {
    const state = {
      windowStart: 480,
      windowEnd: 1080,
      tasks: [{ id: 'a', title: 'Report', minutes: 90, priority: 'high' as const }],
      blocks: [{ id: 'b1', kind: 'task' as const, taskId: 'a', title: 'Report', start: 540, minutes: 90 }, { id: 'b2', kind: 'break' as const, title: 'Break', start: 630, minutes: 15 }],
    };
    await writeDayState(db, state);
    expect(await readDayState(db)).toEqual(state);
  });

  test('damaged saved state falls back to empty instead of crashing', async () => {
    await db.runAsync("INSERT INTO app_state (key, value, updated_at) VALUES ('productivity:matrix', 'not json', 'x')");
    await db.runAsync("INSERT INTO app_state (key, value, updated_at) VALUES ('productivity:day', '{\"tasks\": 5}', 'x')");
    expect(await readMatrixState(db)).toEqual(EMPTY_MATRIX);
    expect(await readDayState(db)).toEqual(EMPTY_DAY);
  });

  test('a running timer is saved with its clock and survives a restart', async () => {
    const running = start(createTimer(DEFAULT_SETTINGS), T0);
    await writeTimer(db, running);
    expect(await readTimer(db, DEFAULT_SETTINGS)).toEqual(running);
  });

  test('custom session lengths are kept and clamped', async () => {
    await writeTimerSettings(db, { ...DEFAULT_SETTINGS, workMinutes: 50, longBreakMinutes: 500 });
    expect(await readTimerSettings(db)).toMatchObject({ workMinutes: 50, longBreakMinutes: 60 });
  });

  test('a prompt draft is kept per template and capped', async () => {
    await writePromptDraft(db, 'daily-planning', 'Act as a coach.');
    await writePromptDraft(db, 'weekly-planning', 'x'.repeat(10_000));
    expect(await readPromptDraft(db, 'daily-planning')).toBe('Act as a coach.');
    expect((await readPromptDraft(db, 'weekly-planning'))?.length).toBe(6000);
  });
});

describe('focus sessions', () => {
  test('a finished round is saved once, however many times it is reported', async () => {
    const input = { id: 'fs-1', startedAt: T0, endedAt: T0 + 25 * 60_000, minutes: 25, task: '  Write the outline  ' };
    expect(await recordFocusSession(db, input)).toBe(true);
    expect(await recordFocusSession(db, input)).toBe(false);
    const list = await listFocusSessions(db);
    expect(list).toEqual([{ id: 'fs-1', startedAt: T0, endedAt: T0 + 25 * 60_000, minutes: 25, task: 'Write the outline' }]);
  });

  test('the newest round comes first', async () => {
    await recordFocusSession(db, { id: 'fs-1', startedAt: T0, endedAt: T0 + 25 * 60_000, minutes: 25 });
    await recordFocusSession(db, { id: 'fs-2', startedAt: T0 + 3_600_000, endedAt: T0 + 3_600_000 + 50 * 60_000, minutes: 50 });
    expect((await listFocusSessions(db)).map((entry) => entry.id)).toEqual(['fs-2', 'fs-1']);
  });

  test('deleting all data clears the tools and the focus log', async () => {
    await recordFocusSession(db, { id: 'fs-1', startedAt: T0, endedAt: T0 + 25 * 60_000, minutes: 25 });
    await writeMatrixState(db, { tasks: [{ id: 't1', title: 'x' }], placements: {} });
    await deleteAllData(db);
    expect(await listFocusSessions(db)).toEqual([]);
    expect(await readMatrixState(db)).toEqual(EMPTY_MATRIX);
  });
});
