/**
 * The Pomodoro timer as a pure state machine. Time is always the wall clock (`endsAt`), never a counter that a render loop ticks, so a timer
 * stays right when the app is in the background or the phone is locked. Every function takes `now` (epoch milliseconds) so tests never wait.
 */

export type PomodoroSettings = { workMinutes: number; shortBreakMinutes: number; longBreakMinutes: number; roundsBeforeLong: number; autoStartNext: boolean };
export const DEFAULT_SETTINGS: PomodoroSettings = { workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, roundsBeforeLong: 4, autoStartNext: false };

/** The limits the settings are held to; a learner can customise the lengths but never to nonsense. */
export const SETTING_LIMITS = { workMinutes: [1, 120], shortBreakMinutes: [1, 30], longBreakMinutes: [5, 60], roundsBeforeLong: [2, 8] } as const;

const clampInt = (value: unknown, [min, max]: readonly [number, number], fallback: number): number => {
  const number = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.min(max, Math.max(min, number));
};

export function normalizeSettings(input: Partial<PomodoroSettings> | null | undefined): PomodoroSettings {
  const value = input ?? {};
  return {
    workMinutes: clampInt(value.workMinutes, SETTING_LIMITS.workMinutes, DEFAULT_SETTINGS.workMinutes),
    shortBreakMinutes: clampInt(value.shortBreakMinutes, SETTING_LIMITS.shortBreakMinutes, DEFAULT_SETTINGS.shortBreakMinutes),
    longBreakMinutes: clampInt(value.longBreakMinutes, SETTING_LIMITS.longBreakMinutes, DEFAULT_SETTINGS.longBreakMinutes),
    roundsBeforeLong: clampInt(value.roundsBeforeLong, SETTING_LIMITS.roundsBeforeLong, DEFAULT_SETTINGS.roundsBeforeLong),
    autoStartNext: value.autoStartNext === true,
  };
}

export type Phase = 'work' | 'short' | 'long';
export type TimerStatus = 'idle' | 'running' | 'paused';

export type TimerState = {
  phase: Phase;
  status: TimerStatus;
  /** Milliseconds left while idle or paused (kept at the phase length when idle). */
  remainingMs: number;
  /** Epoch milliseconds when the phase ends, while running. */
  endsAt: number | null;
  /** Epoch milliseconds when the phase first started (kept through pauses), for the session log. */
  startedAt: number | null;
  /** Work rounds finished since the last long break. */
  cycle: number;
};

/** A finished phase. Only a finished `work` phase is a focus session in the log. */
export type FinishedPhase = { phase: Phase; minutes: number; startedAt: number; endedAt: number };

const MINUTE = 60_000;
export const phaseMinutes = (phase: Phase, settings: PomodoroSettings): number => (phase === 'work' ? settings.workMinutes : phase === 'short' ? settings.shortBreakMinutes : settings.longBreakMinutes);
const phaseMs = (phase: Phase, settings: PomodoroSettings) => phaseMinutes(phase, settings) * MINUTE;

export const createTimer = (settings: PomodoroSettings): TimerState => ({ phase: 'work', status: 'idle', remainingMs: phaseMs('work', settings), endsAt: null, startedAt: null, cycle: 0 });

export const remainingMs = (timer: TimerState, now: number): number => (timer.status === 'running' && timer.endsAt !== null ? Math.max(0, timer.endsAt - now) : timer.remainingMs);

export function start(timer: TimerState, now: number): TimerState {
  if (timer.status === 'running') return timer;
  if (timer.status === 'paused') return resume(timer, now);
  return { ...timer, status: 'running', endsAt: now + timer.remainingMs, startedAt: now };
}

export function pause(timer: TimerState, now: number): TimerState {
  if (timer.status !== 'running') return timer;
  return { ...timer, status: 'paused', remainingMs: remainingMs(timer, now), endsAt: null };
}

export function resume(timer: TimerState, now: number): TimerState {
  if (timer.status !== 'paused') return timer;
  return { ...timer, status: 'running', endsAt: now + timer.remainingMs };
}

/** A fresh work round, with the current settings. */
export const reset = (_timer: TimerState, settings: PomodoroSettings): TimerState => createTimer(settings);

const nextPhase = (timer: TimerState, settings: PomodoroSettings, finishedWork: boolean): { phase: Phase; cycle: number } => {
  if (timer.phase === 'work') {
    const cycle = finishedWork ? timer.cycle + 1 : timer.cycle;
    return { phase: finishedWork && cycle % settings.roundsBeforeLong === 0 ? 'long' : 'short', cycle };
  }
  return { phase: 'work', cycle: timer.phase === 'long' ? 0 : timer.cycle };
};

/** Moves to the next phase without finishing this one: nothing is logged, and a skipped work round does not count toward the long break. */
export function skip(timer: TimerState, settings: PomodoroSettings): TimerState {
  const { phase, cycle } = nextPhase(timer, settings, false);
  return { phase, status: 'idle', remainingMs: phaseMs(phase, settings), endsAt: null, startedAt: null, cycle };
}

/** Call on a clock tick and whenever the app returns to the foreground. When a running phase has run out, returns it as `finished` and moves on. */
export function tick(timer: TimerState, settings: PomodoroSettings, now: number): { timer: TimerState; finished: FinishedPhase | null } {
  if (timer.status !== 'running' || timer.endsAt === null || now < timer.endsAt) return { timer, finished: null };
  const endedAt = timer.endsAt;
  const minutes = phaseMinutes(timer.phase, settings);
  const finished: FinishedPhase = { phase: timer.phase, minutes, startedAt: timer.startedAt ?? endedAt - minutes * MINUTE, endedAt };
  const { phase, cycle } = nextPhase(timer, settings, true);
  const length = phaseMs(phase, settings);
  const next: TimerState = settings.autoStartNext
    ? { phase, status: 'running', remainingMs: length, endsAt: endedAt + length, startedAt: endedAt, cycle }
    : { phase, status: 'idle', remainingMs: length, endsAt: null, startedAt: null, cycle };
  return { timer: next, finished };
}

const PHASES: readonly string[] = ['work', 'short', 'long'];
const STATUSES: readonly string[] = ['idle', 'running', 'paused'];
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** Reads a saved timer back, falling back to a fresh one for anything that is not a well-formed timer (saved data is untrusted). */
export function reviveTimer(raw: unknown, settings: PomodoroSettings): TimerState {
  if (typeof raw !== 'object' || raw === null) return createTimer(settings);
  const value = raw as Record<string, unknown>;
  const valid =
    typeof value.phase === 'string' && PHASES.includes(value.phase) &&
    typeof value.status === 'string' && STATUSES.includes(value.status) &&
    isNumber(value.remainingMs) && value.remainingMs >= 0 &&
    (value.endsAt === null || isNumber(value.endsAt)) &&
    (value.startedAt === null || isNumber(value.startedAt)) &&
    isNumber(value.cycle) && Number.isInteger(value.cycle) && value.cycle >= 0 &&
    (value.status !== 'running' || isNumber(value.endsAt));
  return valid ? (value as unknown as TimerState) : createTimer(settings);
}

export type FocusSession = { startedAt: number; endedAt: number; minutes: number };
type Tally = { sessions: number; minutes: number };

const startOfDay = (time: number) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

/** Completed focus sessions today (this phone's calendar day), in the last seven days including today, and in all. */
export function summarizeSessions(sessions: readonly FocusSession[], now: number): { today: Tally; week: Tally; total: Tally } {
  const today = startOfDay(now);
  const weekStart = new Date(new Date(today).getFullYear(), new Date(today).getMonth(), new Date(today).getDate() - 6).getTime();
  const tally = (list: readonly FocusSession[]): Tally => ({ sessions: list.length, minutes: list.reduce((sum, session) => sum + session.minutes, 0) });
  return {
    today: tally(sessions.filter((session) => startOfDay(session.endedAt) === today)),
    week: tally(sessions.filter((session) => session.endedAt >= weekStart && session.endedAt <= now)),
    total: tally(sessions),
  };
}
