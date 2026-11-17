/** Time-of-day helpers for the day planner. A time is whole minutes since midnight; a day is 0 to 1440. */

export const MINUTES_PER_DAY = 1440;
/** The planner moves in quarter-hours, as a calendar does. */
export const STEP = 15;

export const clampMinutes = (value: number, min = 0, max = MINUTES_PER_DAY): number => Math.min(max, Math.max(min, Math.round(value)));
export const snap = (minutes: number, step = STEP): number => Math.round(minutes / step) * step;

/** "09:30" or "9:30" to 570. Returns null for anything that is not a valid 24-hour time. */
export function parseClock(text: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours <= 24 && minutes < 60 && hours * 60 + minutes <= MINUTES_PER_DAY ? hours * 60 + minutes : null;
}

/** 570 to "9:30 AM" (or "09:30" in 24-hour mode). */
export function formatClock(minutes: number, hour12 = true): string {
  const total = clampMinutes(minutes);
  const hours = Math.floor(total / 60) % 24;
  const mins = total % 60;
  if (!hour12) return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  const suffix = hours < 12 ? 'AM' : 'PM';
  const shown = hours % 12 === 0 ? 12 : hours % 12;
  return `${shown}:${String(mins).padStart(2, '0')} ${suffix}`;
}

/** 90 to "1 h 30 min", 45 to "45 min", 120 to "2 h". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins} min`;
  return mins === 0 ? `${hours} h` : `${hours} h ${mins} min`;
}

/** m:ss for a countdown, from milliseconds (rounded up, so the timer never shows 0:00 while time is left). */
export function formatCountdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
