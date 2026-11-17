import type { Language } from '@/lib/language';

import { findLesson } from '../content';
import { courseHasLanguage, localizedFound } from '../lib/localization';
import { lessonOutline, lessonScript } from '../lib/plain-text';
import { hashSegments, lessonSegments, type SpeechSegment } from '../lib/speech-segments';
import { startListening, type ListenSession } from './listen-controller';
import { saveListenPosition } from './listen-position';

/** One lesson as it is spoken, found by its id (the Apple Watch asks for lessons it has only the id of). */
export type SpokenLesson = { lessonId: string; title: string; course: string; language: Language; segments: readonly SpeechSegment[] };

/** The lesson in the language it is really shown in (an untranslated course stays English) cut into the sentences Listen says, or null when there is no such lesson. */
export function spokenLesson(lessonId: string, language: Language): SpokenLesson | null {
  const found = localizedFound(findLesson(lessonId), language);
  if (!found) return null;
  const spoken: Language = language !== 'en' && !courseHasLanguage(found.course.id, language) ? 'en' : language;
  return { lessonId: found.lesson.id, title: found.lesson.title, course: found.course.title, language: spoken, segments: lessonSegments(found.lesson, spoken) };
}

/**
 * Starts Listen on a lesson by its id, from the beginning or from sentence `segment` (the Apple Watch handing the voice back to the
 * phone part-way through). Returns false when there is no such lesson. The place goes through the saved-position store, which
 * checks it against the lesson's words, so a recording seeks to the sentence's own time.
 */
export function startLessonListening(input: { lessonId: string; language: Language; rate: number; online: boolean; voice: string; segment?: number }): boolean {
  const found = localizedFound(findLesson(input.lessonId), input.language);
  const spoken = spokenLesson(input.lessonId, input.language);
  if (!found || !spoken) return false;
  const session: ListenSession = {
    lessonId: found.lesson.id,
    lessonTitle: found.lesson.title,
    courseTitle: found.course.title,
    outline: lessonOutline(found.lesson, spoken.language),
    script: lessonScript(found.lesson, spoken.language),
    segments: spoken.segments,
    voiceLanguage: spoken.language === 'fil' ? 'fil-PH' : undefined,
  };
  // The last sentence is not a place to carry on from (the saved-place rule), so the one before it is the furthest back-handoff goes.
  const at = Math.min(Math.max(0, Math.floor(input.segment ?? 0)), Math.max(0, spoken.segments.length - 2));
  if (at > 0) saveListenPosition(input.lessonId, input.voice, { segment: at, time: 0, hash: hashSegments(spoken.segments) });
  startListening(session, { rate: input.rate, online: input.online, voice: input.voice, from: at > 0 ? 'saved' : 'start' });
  return true;
}
