import { useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

import { readAppState, writeAppState } from '@/db/app-state';
import { useDbQuery } from '@/db/use-db-query';
import { useOnAppActive } from '@/hooks/use-on-app-active';
import { successFeedback, tapFeedback } from '@/lib/haptics';

import { listFocusSessions, readTimer, readTimerSettings, recordFocusSession, writeTimer, writeTimerSettings } from '../api/productivity-repo';
import {
  normalizeSettings,
  pause as pauseTimer,
  phaseMinutes,
  remainingMs,
  reset as resetTimer,
  skip as skipTimer,
  start as startTimer,
  summarizeSessions,
  tick,
  type FinishedPhase,
  type PomodoroSettings,
  type TimerState,
} from '../lib/pomodoro';
import { elapsedFraction, roundNumber } from '../lib/pomodoro-view';
import { useReadOnce } from './use-read-once';

/** How often the display catches up with the wall clock while a round runs. The timer itself never counts: it only reads the clock. */
export const TICK_MS = 250;
/** Phases that can end in one catch-up (a phone locked through several auto-started rounds); more than this is not a real day. */
const MAX_CATCH_UP = 24;
export const MAX_TASK_LENGTH = 120;
const TASK_KEY = 'productivity:timer-task';

export type PomodoroSaved = { settings: PomodoroSettings; timer: TimerState; task: string };
export type PomodoroNotice = 'focus' | 'break' | null;

export const FOCUS_LOG_QUERY_KEY = ['productivity', 'focus-sessions'] as const;

/** Everything the timer keeps on this phone: its settings, the timer as it was left, and the task line. */
export async function readPomodoroSaved(db: SQLiteDatabase): Promise<PomodoroSaved> {
  const settings = await readTimerSettings(db);
  const [timer, task] = await Promise.all([readTimer(db, settings), readAppState<unknown>(db, TASK_KEY)]);
  return { settings, timer, task: typeof task === 'string' ? task.slice(0, MAX_TASK_LENGTH) : '' };
}

/** The saved timer, read once when the tool opens (see `useReadOnce`). */
export const usePomodoroSaved = () => useReadOnce('pomodoro', readPomodoroSaved);
export const useFocusLog = () => useDbQuery(FOCUS_LOG_QUERY_KEY, (db) => listFocusSessions(db));

export type UsePomodoroOptions = {
  initial: PomodoroSaved;
  /** The clock, in epoch milliseconds. Tests pass their own so nothing waits. */
  now?: () => number;
};

/** The id a finished round is saved under: the same round reported twice (a tick and the app coming back) is saved once. */
export const focusSessionId = (finished: FinishedPhase): string => `pomodoro-${finished.startedAt}`;

/**
 * The focus timer's behaviour: wall-clock state kept in the database on every change, a display that follows the clock only while a round runs
 * (one interval, cleared when the round stops or the screen closes), a catch-up when the app returns to the front or the screen reopens, and
 * each finished focus round saved exactly once. The pure rules are in `lib/pomodoro.ts`; this connects them to the clock, the phone and the data.
 */
export function usePomodoro({ initial, now = Date.now }: UsePomodoroOptions) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  // The refs hold the truth between renders (a second tick in the same moment must see the first one's result); the state only draws it.
  const timerRef = useRef(initial.timer);
  const settingsRef = useRef(initial.settings);
  const taskRef = useRef(initial.task);
  const shownSecond = useRef(-1);
  const [timer, setTimerState] = useState(initial.timer);
  const [settings, setSettingsState] = useState(initial.settings);
  const [task, setTaskState] = useState(initial.task);
  const [clock, setClock] = useState(() => now());
  const [notice, setNotice] = useState<PomodoroNotice>(null);
  const [saveError, setSaveError] = useState(false);

  const persist = (write: Promise<unknown>) => {
    write.then(() => setSaveError(false)).catch(() => setSaveError(true));
  };

  const commit = (next: TimerState, at: number) => {
    timerRef.current = next;
    shownSecond.current = Math.ceil(remainingMs(next, at) / 1000);
    setTimerState(next);
    setClock(at);
    persist(writeTimer(db, next));
  };

  const record = (finished: FinishedPhase, taskText: string | null) => {
    persist(
      recordFocusSession(db, { id: focusSessionId(finished), startedAt: finished.startedAt, endedAt: finished.endedAt, minutes: finished.minutes, task: taskText }).then(() =>
        queryClient.invalidateQueries({ queryKey: FOCUS_LOG_QUERY_KEY }),
      ),
    );
  };

  /** Moves the timer on to `at`, finishing every phase that has run out. Safe to call twice in a row. */
  const advance = (at: number): boolean => {
    let current = timerRef.current;
    const finishedList: FinishedPhase[] = [];
    for (let guard = 0; guard < MAX_CATCH_UP; guard += 1) {
      const result = tick(current, settingsRef.current, at);
      if (!result.finished) break;
      current = result.timer;
      finishedList.push(result.finished);
    }
    if (finishedList.length === 0) return false;
    commit(current, at);
    let taskText: string | null = taskRef.current;
    for (const finished of finishedList) {
      if (finished.phase !== 'work') continue;
      record(finished, taskText);
      taskText = null; // one task line belongs to one round
    }
    const last = finishedList[finishedList.length - 1]!;
    setNotice(last.phase === 'work' ? 'focus' : 'break');
    if (finishedList.some((finished) => finished.phase === 'work')) successFeedback();
    else tapFeedback();
    return true;
  };

  /** The clock tick and the return to the front: catch up, and redraw only when the shown second changes. */
  const sync = () => {
    const at = now();
    if (advance(at)) return;
    const second = Math.ceil(remainingMs(timerRef.current, at) / 1000);
    if (second !== shownSecond.current) {
      shownSecond.current = second;
      setClock(at);
    }
  };
  const syncRef = useRef(sync);
  useEffect(() => {
    syncRef.current = sync;
  });

  // A round that ended while the screen was closed is finished (and saved once) as soon as it opens again.
  useEffect(() => {
    syncRef.current();
  }, []);

  useEffect(() => {
    if (timer.status !== 'running') return;
    const id = setInterval(() => syncRef.current(), TICK_MS);
    return () => clearInterval(id);
  }, [timer.status]);

  useOnAppActive(() => syncRef.current(), timer.status === 'running');

  const saveTask = () => persist(writeAppState(db, TASK_KEY, taskRef.current));

  const start = () => {
    const at = now();
    setNotice(null);
    commit(startTimer(timerRef.current, at), at);
    saveTask();
  };
  const pause = () => {
    const at = now();
    commit(pauseTimer(timerRef.current, at), at);
  };
  const reset = () => {
    const at = now();
    setNotice(null);
    commit(resetTimer(timerRef.current, settingsRef.current), at);
  };
  const skip = () => {
    const at = now();
    setNotice(null);
    commit(skipTimer(timerRef.current, settingsRef.current), at);
  };

  const setTask = (text: string) => {
    taskRef.current = text.slice(0, MAX_TASK_LENGTH);
    setTaskState(taskRef.current);
  };

  /** Changes the lengths, within the limits. An idle timer shows the new length at once; a running or paused round keeps the one it began with. */
  const updateSettings = (patch: Partial<PomodoroSettings>) => {
    const next = normalizeSettings({ ...settingsRef.current, ...patch });
    settingsRef.current = next;
    setSettingsState(next);
    persist(writeTimerSettings(db, next));
    const current = timerRef.current;
    if (current.status === 'idle') commit({ ...current, remainingMs: phaseMinutes(current.phase, next) * 60_000 }, now());
  };

  const log = useFocusLog();
  const entries = log.data ?? [];

  return {
    timer,
    settings,
    task,
    notice,
    saveError,
    remaining: remainingMs(timer, clock),
    fraction: elapsedFraction(timer, settings, clock),
    round: roundNumber(timer, settings),
    summary: summarizeSessions(entries, clock),
    log: { entries, isLoading: log.isLoading, isError: log.isError && log.data === undefined, retry: () => void log.refetch() },
    start,
    pause,
    resume: start,
    reset,
    skip,
    setTask,
    saveTask,
    updateSettings,
    dismissNotice: () => setNotice(null),
  };
}
