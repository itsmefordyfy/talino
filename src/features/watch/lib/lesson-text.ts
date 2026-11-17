import type { WatchLesson } from '../types';

/** One sentence is never longer than this on the wrist (the longest spoken sentences are a couple of hundred characters). */
const MAX_SENTENCE = 500;
/** A lesson's whole text sent to the Watch in one reply: a lesson is a few kilobytes, this stops a freak one from overflowing the message. */
const MAX_TOTAL = 90_000;

export type LessonTextInput = { lessonId: string; title: string; course: string; language: string; segments: readonly { text: string }[]; segment: number };

/**
 * A lesson as the Watch speaks and shows it: its spoken sentences in order, and where to start. Empty sentences are dropped (the
 * start moves with them), a too-long one is cut, and the total is capped, so one reply always fits. Null when nothing is left to say.
 */
export function lessonForWatch(input: LessonTextInput): WatchLesson | null {
  const sentences: string[] = [];
  const at: number[] = [];
  let start = 0;
  let total = 0;
  for (const [index, segment] of input.segments.entries()) {
    const text = segment.text.replace(/\s+/g, ' ').trim().slice(0, MAX_SENTENCE);
    if (text === '') continue;
    if (total + text.length > MAX_TOTAL) break;
    if (index <= input.segment) start = sentences.length;
    sentences.push(text);
    at.push(index);
    total += text.length;
  }
  if (sentences.length === 0) return null;
  return { lessonId: input.lessonId, title: input.title, course: input.course, language: input.language, sentences, at, segment: Math.min(start, sentences.length - 1) };
}
