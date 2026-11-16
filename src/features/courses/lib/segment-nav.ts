import type { SpeechSegment } from './speech-segments';

/** Where each paragraph begins: the first segment, and every segment after one that ends with the long pause (a label and its text stay together). */
export function paragraphStarts(segments: readonly Pick<SpeechSegment, 'pause'>[]): number[] {
  const starts: number[] = [];
  segments.forEach((segment, index) => {
    if (index === 0 || segments[index - 1].pause === 'paragraph') starts.push(index);
  });
  return starts;
}

/**
 * Where "previous" and "next" go. By sentence: one on or back (back replays the current sentence first when the learner is already a few
 * seconds into it, `restart`, like a music player's previous button). By paragraph: the start of the next paragraph; back goes to the
 * start of this one, then the one before. Always inside the lesson; an unknown position counts as the start.
 */
export function targetSegment(segments: readonly Pick<SpeechSegment, 'pause'>[], current: number | null, direction: 1 | -1, by: 'sentence' | 'paragraph', options: { restart?: boolean } = {}): number {
  const last = segments.length - 1;
  if (last < 0) return 0;
  const at = current === null ? 0 : Math.min(Math.max(0, current), last);
  if (by === 'sentence') {
    if (direction === 1) return Math.min(last, at + 1);
    return options.restart ? at : Math.max(0, at - 1);
  }
  const starts = paragraphStarts(segments);
  if (direction === 1) return starts.find((start) => start > at) ?? at;
  const own = [...starts].reverse().find((start) => start <= at) ?? 0;
  if (own < at || options.restart) return own;
  return [...starts].reverse().find((start) => start < own) ?? 0;
}
