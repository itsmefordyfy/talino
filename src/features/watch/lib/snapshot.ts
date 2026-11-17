import { addDays, type ISODate } from '@/lib/dates';

import type { WatchListenState, WatchSnapshot } from '../types';

/** The part of the listener the snapshot reads (the app's `ListenSnapshot`, narrowed so this file stays pure). */
export type ListenInput = {
  state: 'idle' | 'loading' | 'playing' | 'paused' | 'speaking';
  title: string | null;
  course: string | null;
  canSkip: boolean;
  /** The sentence being said and its place, from the lesson's spoken sentences; null / 0 when the voice can't say which. */
  sentence: string | null;
  index: number;
  count: number;
};

export type SnapshotInput = {
  now: number;
  today: ISODate;
  streak: { current: number; best: number; doneToday: boolean };
  /** Days with at least one finished lesson (any order, duplicates allowed). */
  days: readonly ISODate[];
  lessonsThisWeek: number;
  /** The lessons-a-week target from the learner's plan. */
  target: number;
  next: { course: string; lesson: string; day: number; started: boolean } | null;
  listen: ListenInput;
  /** Ids of the Watch's commands already handled (the result ledger's). */
  handled: string[];
};

const LISTEN_STATE: Record<Exclude<ListenInput['state'], 'idle'>, WatchListenState> = { loading: 'loading', playing: 'playing', speaking: 'playing', paused: 'paused' };

/** The last seven days, oldest first, each true when a lesson was finished that day. */
export function weekDots(days: readonly ISODate[], today: ISODate): boolean[] {
  const set = new Set(days);
  return Array.from({ length: 7 }, (_, index) => set.has(addDays(today, index - 6)));
}

export function toWatchSnapshot(input: SnapshotInput): WatchSnapshot {
  const { listen } = input;
  return {
    v: 1,
    sentAt: input.now,
    day: input.today,
    streak: { current: input.streak.current, best: input.streak.best, doneToday: input.streak.doneToday },
    week: { dots: weekDots(input.days, input.today), done: input.lessonsThisWeek, target: Math.max(1, input.target) },
    next: input.next,
    listen: listen.state === 'idle' ? null : { state: LISTEN_STATE[listen.state], lesson: listen.title ?? '', course: listen.course ?? '', canSkip: listen.canSkip, sentence: listen.sentence, index: listen.index, count: listen.count },
    handled: input.handled,
  };
}
