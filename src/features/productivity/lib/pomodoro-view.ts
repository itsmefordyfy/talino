import { phaseMinutes, remainingMs, type PomodoroSettings, type TimerState } from './pomodoro';

/** The round the screen names ("Round 2 of 4"): the one being worked on, or, in a break, the one just finished. Always 1 to `roundsBeforeLong`. */
export function roundNumber(timer: TimerState, settings: PomodoroSettings): number {
  const total = settings.roundsBeforeLong;
  const raw = timer.phase === 'work' ? (timer.cycle % total) + 1 : timer.cycle === 0 ? 1 : ((timer.cycle - 1) % total) + 1;
  return Math.min(total, Math.max(1, raw));
}

/** How much of the current phase has passed, 0 to 1, for the ring. An idle phase is 0 and a finished one 1. */
export function elapsedFraction(timer: TimerState, settings: PomodoroSettings, now: number): number {
  const length = phaseMinutes(timer.phase, settings) * 60_000;
  if (length <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - remainingMs(timer, now) / length));
}
