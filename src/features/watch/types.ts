/** The part of Listen the Watch can see and steer. `speaking` (the phone's own voice) reads as `playing` here. */
export type WatchListenState = 'loading' | 'playing' | 'paused';

/**
 * Everything the Watch shows, pushed by the phone as one small JSON object (`updateApplicationContext` plus a live message when the
 * Watch is reachable). `v` is the shape's version: the Watch app can lag behind the phone app, so a change that would break an old
 * Watch bumps it and the Watch says to update. Only figures the Today tab already shows: never answers, project text, résumé or
 * chat content.
 */
export type WatchSnapshot = {
  v: 1;
  /** Epoch ms when the phone built it, so the Watch can say how old what it shows is. */
  sentAt: number;
  /** The phone's local calendar day (`YYYY-MM-DD`), so the Watch can tell the streak is stale after midnight with the phone away. */
  day: string;
  streak: { current: number; best: number; doneToday: boolean };
  /** The last seven days, oldest first (the last one is today), each true when a lesson was finished that day. */
  week: { dots: boolean[]; done: number; target: number };
  /** The lesson Today leads with; null when everything is done or nothing is open. `day` is the lesson's day number in its course. */
  next: { course: string; lesson: string; day: number; started: boolean } | null;
  /** What the phone is reading aloud now; null when nothing is. */
  listen: { state: WatchListenState; lesson: string; course: string; canSkip: boolean } | null;
  /** Ids of the Watch's commands the phone has already handled (the last few dozen). */
  handled: string[];
};

/** What the Watch asks the phone to do. `id` is made by the Watch and stays the same on a retry, so a repeat never skips twice. */
export type WatchCommand =
  | { id: string; type: 'snapshot.request' }
  | { id: string; type: 'listen.play' }
  | { id: string; type: 'listen.pause' }
  | { id: string; type: 'listen.skip'; by: 1 | -1 };

export type WatchFailure = 'nothing_playing' | 'cannot_skip' | 'failed';

export type WatchResult = { ok: true } | { ok: false; reason: WatchFailure };
