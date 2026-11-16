/**
 * The exact timing of a recording: when each sentence starts and ends. It is made while the recording is (scripts/audio/generate.py
 * synthesises one sentence at a time and knows how long each one is) and sits next to it as `<lessonId>.timing.json`:
 *
 *   { "v": 1, "hash": "<hash of the words>", "duration": 123.4, "segments": [[start, end], ...], "words": [[t, t, ...], ...] }
 *
 * Times are seconds into the recording, one pair per segment of `lessonSegments`, in order. `words` is optional: for each segment, the
 * second at which the voice reaches each of its words (the whitespace-separated words of the segment's text, in order), taken from
 * Kokoro's own phoneme durations (scripts/audio/word-timings.py). A recording without it is followed by sentence, with the words inside
 * a sentence placed by an estimate (`word-progress.ts`). The hash is of the words (`hashSegments`),
 * so a recording made from older text of a lesson never lights up the wrong sentences. Pure: the player and the tests share it.
 */
import { lessonAudioUrl } from './lesson-audio';

export type ListenTiming = {
  hash: string;
  /** Length of the recording the times were measured on, in seconds. */
  duration: number;
  segments: readonly (readonly [number, number])[];
  /** Per segment, when each of its words starts (seconds into the recording); absent for a recording timed by sentence only. */
  words?: readonly (readonly number[])[];
};

/** How far a recording may differ in length from the one the times were measured on (AAC pads the ends a little). */
const DURATION_TOLERANCE = 1.5;
const MAX_SEGMENTS = 5000;
const MAX_WORDS = 1000;

/** A timing file from its JSON, or null when it is anything else: wrong version, out of order, past the end, not numbers. */
export function parseTiming(value: unknown): ListenTiming | null {
  if (!value || typeof value !== 'object') return null;
  const file = value as { v?: unknown; hash?: unknown; duration?: unknown; segments?: unknown; words?: unknown };
  if (file.v !== 1 || typeof file.hash !== 'string' || !/^[0-9a-f]{8}$/.test(file.hash)) return null;
  if (typeof file.duration !== 'number' || !Number.isFinite(file.duration) || file.duration <= 0) return null;
  if (!Array.isArray(file.segments) || file.segments.length === 0 || file.segments.length > MAX_SEGMENTS) return null;
  const duration = file.duration;
  const segments: [number, number][] = [];
  let previous = 0;
  for (const pair of file.segments) {
    if (!Array.isArray(pair) || pair.length !== 2) return null;
    const [start, end] = pair as unknown[];
    if (typeof start !== 'number' || typeof end !== 'number' || !Number.isFinite(start) || !Number.isFinite(end)) return null;
    if (start < previous || end < start || end > duration + 0.5) return null;
    segments.push([start, end]);
    previous = start;
  }
  const words = parseWords(file.words, segments, duration);
  return words ? { hash: file.hash, duration, segments, words } : { hash: file.hash, duration, segments };
}

/** The per-word start times when they are well formed (one list per segment, numbers in order inside the recording), else undefined: the sentence timing alone is still good. */
function parseWords(value: unknown, segments: readonly (readonly [number, number])[], duration: number): number[][] | undefined {
  if (!Array.isArray(value) || value.length !== segments.length) return undefined;
  const lists: number[][] = [];
  for (const list of value) {
    if (!Array.isArray(list) || list.length > MAX_WORDS) return undefined;
    let previous = 0;
    for (const time of list) {
      if (typeof time !== 'number' || !Number.isFinite(time) || time < previous || time > duration + 0.5) return undefined;
      previous = time;
    }
    lists.push(list as number[]);
  }
  return lists;
}

/** True when these times describe these words (and, once the player knows it, a recording of about this length). */
export function timingMatches(timing: ListenTiming, now: { hash: string; count: number; audioDuration?: number }): boolean {
  if (timing.hash !== now.hash || timing.segments.length !== now.count) return false;
  if (now.audioDuration && now.audioDuration > 0 && Math.abs(now.audioDuration - timing.duration) > DURATION_TOLERANCE) return false;
  return true;
}

/**
 * The segment being spoken at `seconds`: the last one whose start has been reached. Through the pause after a sentence it stays on that
 * sentence, so the highlight never blinks off between two of them.
 */
export function segmentAtTime(timing: Pick<ListenTiming, 'segments'>, seconds: number): number {
  const { segments } = timing;
  if (!Number.isFinite(seconds) || segments.length === 0) return 0;
  let low = 0;
  let high = segments.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (segments[middle][0] <= seconds) low = middle;
    else high = middle - 1;
  }
  return low;
}

/**
 * The word being spoken at `seconds` inside segment `segment`: the index of the last word whose start has been reached, 0 before the
 * first, or null when this recording has no word times for that segment (then the words are estimated instead).
 */
export function wordAtTime(timing: Pick<ListenTiming, 'words'>, segment: number, seconds: number): number | null {
  const starts = timing.words?.[segment];
  if (!starts || starts.length === 0 || !Number.isFinite(seconds)) return null;
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (starts[middle] <= seconds) low = middle;
    else high = middle - 1;
  }
  return low;
}

/** Where a recording's timing file is: next to the recording, on the same trusted host. */
export function timingUrl(origin: string | undefined, lessonId: string, options: { development?: boolean; voice?: string } = {}): string | null {
  const url = lessonAudioUrl(origin, lessonId, options);
  return url ? url.replace(/\.m4a$/, '.timing.json') : null;
}

export type SavedPosition = { segment: number; time: number; hash: string };

/**
 * Where Listen carries on for a lesson that was listened to before: the saved place when the lesson still says the same words and the
 * learner was neither at the very start nor on the last sentence; otherwise null (start from the beginning). `segmentStart` is when that
 * sentence begins in a recording: the learner hears it from its first word, not from the middle.
 */
export function resumePoint(saved: SavedPosition | null, now: { hash: string; count: number; segmentStart?: number }): { segment: number; time: number } | null {
  if (!saved || saved.hash !== now.hash) return null;
  if (!Number.isFinite(saved.segment) || !Number.isFinite(saved.time)) return null;
  // Worth carrying on from: past the first sentence or the first few seconds (a recording without timing only knows seconds), and not on the last sentence.
  if (saved.segment < 1 && saved.time < 8) return null;
  if (saved.segment >= 1 && saved.segment >= now.count - 1) return null;
  return { segment: saved.segment, time: now.segmentStart ?? saved.time };
}
