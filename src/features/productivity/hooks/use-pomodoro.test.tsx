import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, useEffect } from 'react';
import { AppState } from 'react-native';
import { createRoot } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';

import * as repo from '../api/productivity-repo';
import { listFocusSessions, readTimer, readTimerSettings, recordFocusSession } from '../api/productivity-repo';
import { DEFAULT_SETTINGS, createTimer, type PomodoroSettings, type TimerState } from '../lib/pomodoro';
import { focusSessionId, TICK_MS, usePomodoro } from './use-pomodoro';

let mockDb: Awaited<ReturnType<typeof createTestDatabase>>;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));
const mockSuccess = jest.fn();
const mockTap = jest.fn();
jest.mock('@/lib/haptics', () => ({ successFeedback: () => mockSuccess(), tapFeedback: () => mockTap() }));
jest.mock('@/lib/id', () => ({ newId: () => 'id', nowTimestamp: () => new Date().toISOString() }));

const T0 = Date.UTC(2026, 10, 17, 9, 0, 0);
const MIN = 60_000;

let clock = T0;
let api: ReturnType<typeof usePomodoro>;
let renderer: ReturnType<typeof createRoot>;
let appStateHandler: ((state: string) => void) | null = null;
let removeCount = 0;

function Harness({ initial }: { initial: { settings: PomodoroSettings; timer: TimerState; task: string } }) {
  const result = usePomodoro({ initial, now: () => clock });
  useEffect(() => {
    api = result;
  });
  return null;
}

async function mount(partial: Partial<{ settings: PomodoroSettings; timer: TimerState; task: string }> = {}) {
  const settings = partial.settings ?? DEFAULT_SETTINGS;
  const initial = { settings, timer: partial.timer ?? createTimer(settings), task: partial.task ?? '' };
  renderer = createRoot();
  await act(async () => {
    renderer.render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } })}>
        <Harness initial={initial} />
      </QueryClientProvider>,
    );
  });
}

/** Moves the injected clock and lets the running interval (or the app coming back) notice. */
async function advance(ms: number) {
  clock += ms;
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}
const call = async (action: () => void) => {
  await act(async () => action());
};

beforeEach(async () => {
  jest.useFakeTimers();
  clock = T0;
  mockSuccess.mockClear();
  mockTap.mockClear();
  appStateHandler = null;
  removeCount = 0;
  jest.spyOn(AppState, 'addEventListener').mockImplementation(((_type: string, handler: (state: string) => void) => {
    appStateHandler = handler;
    return { remove: () => (removeCount += 1) };
  }) as never);
  mockDb = await createTestDatabase();
});
afterEach(async () => {
  await act(async () => renderer.unmount());
  jest.useRealTimers();
  jest.restoreAllMocks();
  mockDb.close();
});

describe('the timer follows the wall clock', () => {
  test('start counts down, saves the timer, and pause freezes it', async () => {
    await mount();
    expect(api.timer.status).toBe('idle');
    expect(api.remaining).toBe(25 * MIN);
    await call(() => api.start());
    expect(api.timer.status).toBe('running');
    await advance(5 * MIN);
    expect(api.remaining).toBe(20 * MIN);
    expect((await readTimer(mockDb, DEFAULT_SETTINGS)).status).toBe('running');
    await call(() => api.pause());
    await advance(10 * MIN);
    expect(api.timer.status).toBe('paused');
    expect(api.remaining).toBe(20 * MIN);
    expect((await readTimer(mockDb, DEFAULT_SETTINGS)).status).toBe('paused');
  });

  test('resume carries on from where the pause left it', async () => {
    await mount();
    await call(() => api.start());
    await advance(5 * MIN);
    await call(() => api.pause());
    await advance(30 * MIN);
    await call(() => api.resume());
    await advance(MIN);
    expect(api.remaining).toBe(19 * MIN);
    expect(api.timer.status).toBe('running');
    await advance(19 * MIN);
    expect(api.timer.phase).toBe('short');
    expect(api.timer.status).toBe('idle');
  });

  test('the display redraws about once a second, not on every tick', async () => {
    await mount();
    await call(() => api.start());
    const shown = api.remaining;
    await advance(TICK_MS);
    expect(api.remaining).toBe(shown); // same second: nothing re-read
    await advance(1000);
    expect(api.remaining).toBeLessThan(shown);
  });
});

describe('a finished focus round', () => {
  test('is saved exactly once even when the clock tick and the return to the app both report it', async () => {
    const record = jest.spyOn(repo, 'recordFocusSession');
    await mount({ task: 'Write the report' });
    await call(() => api.start());
    clock += 25 * MIN;
    // Both paths run in the same moment, as when the phone wakes: the app comes back and the interval fires.
    await act(async () => {
      appStateHandler?.('active');
      appStateHandler?.('active');
      jest.advanceTimersByTime(TICK_MS * 2);
    });
    const saved = await listFocusSessions(mockDb);
    expect(record).toHaveBeenCalledTimes(1); // the hook itself reports the round once, not only the database ignoring a repeat
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ id: `pomodoro-${T0}`, minutes: 25, task: 'Write the report', startedAt: T0, endedAt: T0 + 25 * MIN });
    expect(mockSuccess).toHaveBeenCalledTimes(1);
    expect(api.notice).toBe('focus');
    expect(api.timer.phase).toBe('short');
    expect(api.summary.today.sessions).toBe(1);
    expect(api.log.entries).toHaveLength(1);
  });

  test('reporting the same finished round again does not save it twice', async () => {
    await mount();
    await call(() => api.start());
    await advance(25 * MIN);
    const finished = { phase: 'work' as const, minutes: 25, startedAt: T0, endedAt: T0 + 25 * MIN };
    expect(focusSessionId(finished)).toBe(`pomodoro-${T0}`);
    await recordFocusSession(mockDb, { id: focusSessionId(finished), ...finished });
    expect(await listFocusSessions(mockDb)).toHaveLength(1);
  });

  test('a finished break is not a focus session, and says the break is over', async () => {
    await mount({ timer: { ...createTimer(DEFAULT_SETTINGS), phase: 'short', remainingMs: 5 * MIN, cycle: 1 } });
    await call(() => api.start());
    await advance(5 * MIN);
    expect(await listFocusSessions(mockDb)).toHaveLength(0);
    expect(api.notice).toBe('break');
    expect(api.timer.phase).toBe('work');
  });

  test('a skipped round is not counted', async () => {
    await mount();
    await call(() => api.start());
    await advance(10 * MIN);
    await call(() => api.skip());
    expect(api.timer.phase).toBe('short');
    expect(await listFocusSessions(mockDb)).toHaveLength(0);
  });

  test('with auto-start, rounds that ended while the phone was locked are all caught up, each saved once', async () => {
    const settings = { ...DEFAULT_SETTINGS, workMinutes: 10, shortBreakMinutes: 5, autoStartNext: true };
    await mount({ settings });
    await call(() => api.start());
    // 10 focus + 5 break + 10 focus + 5 break + 3 into the third round.
    await advance(33 * MIN);
    const saved = await listFocusSessions(mockDb);
    expect(saved.map((entry) => entry.startedAt).sort()).toEqual([T0, T0 + 15 * MIN]);
    expect(api.timer.phase).toBe('work');
    expect(api.timer.status).toBe('running');
    expect(api.remaining).toBe(7 * MIN);
  });
});

describe('restoring a saved timer', () => {
  test('a running timer keeps counting from its end time', async () => {
    const saved: TimerState = { phase: 'work', status: 'running', remainingMs: 25 * MIN, endsAt: T0 + 7 * MIN, startedAt: T0 - 18 * MIN, cycle: 0 };
    await mount({ timer: saved });
    expect(api.remaining).toBe(7 * MIN);
    await advance(2 * MIN);
    expect(api.remaining).toBe(5 * MIN);
  });

  test('a round that ended while the screen was closed is finished and saved when it opens', async () => {
    const saved: TimerState = { phase: 'work', status: 'running', remainingMs: 25 * MIN, endsAt: T0 - 2 * MIN, startedAt: T0 - 27 * MIN, cycle: 0 };
    await mount({ timer: saved, task: 'Plan the week' });
    const rows = await listFocusSessions(mockDb);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ task: 'Plan the week', startedAt: T0 - 27 * MIN, endedAt: T0 - 2 * MIN });
    expect(api.timer.phase).toBe('short');
    expect(api.notice).toBe('focus');
  });

  test('a paused timer stays paused with its time', async () => {
    const saved: TimerState = { phase: 'work', status: 'paused', remainingMs: 12 * MIN, endsAt: null, startedAt: T0 - 13 * MIN, cycle: 2 };
    await mount({ timer: saved });
    await advance(60 * MIN);
    expect(api.timer.status).toBe('paused');
    expect(api.remaining).toBe(12 * MIN);
    expect(api.round).toBe(3);
  });
});

describe('timers never leak', () => {
  test('the interval runs only while a round is running, and the app listener is removed with it', async () => {
    // Count the intervals this tool starts and stops (the query client's own housekeeping timers are not its business).
    const active = new Set<unknown>();
    const realSet = global.setInterval;
    const realClear = global.clearInterval;
    jest.spyOn(global, 'setInterval').mockImplementation(((handler: () => void, ms?: number) => {
      const id = realSet(handler, ms);
      active.add(id);
      return id;
    }) as never);
    jest.spyOn(global, 'clearInterval').mockImplementation(((id: never) => {
      active.delete(id);
      realClear(id);
    }) as never);

    await mount();
    expect(active.size).toBe(0);
    await call(() => api.start());
    expect(active.size).toBe(1);
    await call(() => api.pause());
    expect(active.size).toBe(0);
    await call(() => api.resume());
    expect(active.size).toBe(1);
    await act(async () => renderer.unmount());
    expect(active.size).toBe(0);
    expect(removeCount).toBeGreaterThan(0);
    renderer = createRoot(); // so afterEach has something to unmount
  });
});

describe('settings', () => {
  test('are kept within the limits and saved, and an idle timer shows the new length', async () => {
    await mount();
    await call(() => api.updateSettings({ workMinutes: 50, roundsBeforeLong: 99 }));
    expect(api.settings.workMinutes).toBe(50);
    expect(api.settings.roundsBeforeLong).toBe(8);
    expect(api.remaining).toBe(50 * MIN);
    expect((await readTimerSettings(mockDb)).workMinutes).toBe(50);
    expect((await readTimer(mockDb, api.settings)).remainingMs).toBe(50 * MIN);
  });

  test('a round under way keeps the length it began with', async () => {
    await mount();
    await call(() => api.start());
    await call(() => api.updateSettings({ workMinutes: 50 }));
    expect(api.remaining).toBe(25 * MIN);
  });

  test('reset goes back to a fresh round with the current settings', async () => {
    await mount();
    await call(() => api.updateSettings({ workMinutes: 30 }));
    await call(() => api.start());
    await advance(4 * MIN);
    await call(() => api.reset());
    expect(api.timer.status).toBe('idle');
    expect(api.remaining).toBe(30 * MIN);
  });
});
