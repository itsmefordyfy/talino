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
  listen: { state: WatchListenState; lesson: string; course: string; canSkip: boolean; /** The sentence being said, to show on the wrist; null when the voice can't say which. */ sentence: string | null; /** Its place (from 1) and the lesson's sentence count; 0 and 0 when unknown. */ index: number; count: number } | null;
  /** Ids of the Watch's commands the phone has already handled (the last few dozen). */
  handled: string[];
};

/**
 * A lesson sent to the Watch so it can speak and show it itself (owner, 2026-11-16: choose whether the voice plays on the iPhone or on the
 * Apple Watch). `sentences` are exactly what Listen says, in order; `segment` is the one to start with; `language` picks the voice.
 */
export type WatchLesson = { lessonId: string; title: string; course: string; language: string; sentences: string[]; /** For each sentence, its place among the lesson's spoken segments on the phone (empty ones are left out), so handing back resumes at the right one. */ at: number[]; /** The sentence to start with (an index into `sentences`). */ segment: number };

/** What the Watch asks the phone to do. `id` is made by the Watch and stays the same on a retry, so a repeat never skips twice. */
export type WatchCommand =
  | { id: string; type: 'snapshot.request' }
  | { id: string; type: 'listen.play' }
  | { id: string; type: 'listen.pause' }
  | { id: string; type: 'listen.skip'; by: 1 | -1 }
  /** Read the lesson Home leads with on the iPhone. */
  | { id: string; type: 'listen.start' }
  /** Hand the voice to the Watch: the phone stops and sends the lesson (what it was reading from where it was, else the next lesson from the start). */
  | { id: string; type: 'listen.toWatch' }
  /** Hand the voice back: the phone reads `lessonId` from sentence `segment`. */
  | { id: string; type: 'listen.resume'; lessonId: string; segment: number };

export type WatchFailure = 'nothing_playing' | 'cannot_skip' | 'no_lesson' | 'failed';

export type WatchResult = { ok: true; lesson?: WatchLesson } | { ok: false; reason: WatchFailure };
