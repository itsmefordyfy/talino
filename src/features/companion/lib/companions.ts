/**
 * Talino has two coaches and the learner picks one in the welcome (owner's request, 2026-11-14): Tali, the young man from
 * the first character sheet, and Tala, the young woman from the second. They are one character in two versions: the same
 * poses, the same words, the same job. What changes is the picture, the name and the voice, because "changing the gender
 * changes the voice": each coach has a voice per recording engine (`LESSON_VOICES`): Gemini's `achird` (Tali, male) and `sulafat` (Tala, female), or
 * Kokoro v1's `am_puck` and `af_heart` (US English). `LESSON_VOICE_ENGINE` says which set the lessons' recordings use; chat answers and lessons
 * with no recording are read by the phone's own voice. History: Kokoro replaced Gemini on 2026-11-15; on 2026-11-17 the owner
 * tried Gemini again for one lesson, then chose Kokoro. The Gemini voices stay listed so switching engines is this one constant.
 *
 * Pure: no React, no native modules, so tests and the server can import it.
 */
export const COMPANION_IDS = ['tali', 'tala'] as const;
export type CompanionId = (typeof COMPANION_IDS)[number];

export const DEFAULT_COMPANION: CompanionId = 'tali';

/** Which engine's recordings the lessons play. Flip to 'kokoro' to go back to the Kokoro set: nothing else changes (both sets are hosted by folder name). */
export type LessonVoiceEngine = 'gemini' | 'kokoro';
export const LESSON_VOICE_ENGINE: LessonVoiceEngine = 'kokoro';

/** The folder each coach's recordings live under, per engine (`<origin>/<folder>/<lesson>.m4a`, saved on the phone as `<folder>-<lesson>.m4a`). */
export const LESSON_VOICES: Readonly<Record<CompanionId, Record<LessonVoiceEngine, string>>> = {
  tali: { gemini: 'achird', kokoro: 'am_puck' },
  tala: { gemini: 'sulafat', kokoro: 'af_heart' },
};

export type Companion = {
  id: CompanionId;
  /** What the coach is called wherever the app says her or his name. */
  name: string;
  /** The voice id of the selected engine (`achird` for Gemini, `am_puck` for Kokoro): the folder this coach's lesson recordings are hosted under and saved on the phone as (`<voice>-<lesson>.m4a`). */
  voice: string;
};

export const COMPANIONS: Readonly<Record<CompanionId, Companion>> = {
  tali: { id: 'tali', name: 'Tali', voice: LESSON_VOICES.tali[LESSON_VOICE_ENGINE] },
  tala: { id: 'tala', name: 'Tala', voice: LESSON_VOICES.tala[LESSON_VOICE_ENGINE] },
};

export function isCompanionId(value: unknown): value is CompanionId {
  return typeof value === 'string' && (COMPANION_IDS as readonly string[]).includes(value);
}

/** A saved or restored value checked: anything unknown is the default coach. */
export function companionOf(value: unknown): Companion {
  return COMPANIONS[isCompanionId(value) ? value : DEFAULT_COMPANION];
}

const TALI_WORD = /\bTali\b/g;

/** One string with the coach's name swapped in. Tali's own strings are returned as they are. */
export function nameText(text: string, companion: CompanionId): string {
  return companion === DEFAULT_COMPANION ? text : text.replace(TALI_WORD, COMPANIONS[companion].name);
}

function swap(value: unknown, companion: CompanionId): unknown {
  if (typeof value === 'string') return nameText(value, companion);
  if (typeof value === 'function') {
    const call = value as (...args: unknown[]) => unknown;
    return (...args: unknown[]) => swap(call(...args), companion);
  }
  if (Array.isArray(value)) return value.map((item) => swap(item, companion));
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, swap(item, companion)]));
  }
  return value;
}

const cache = new WeakMap<object, Partial<Record<CompanionId, unknown>>>();

/**
 * A feature's string table with the coach's name swapped in (strings, nested objects and lists, and what string functions
 * return). Done once per table and coach, then reused, so reading strings stays as cheap as before. For Tali it is the table itself.
 */
export function withCompanionName<T>(table: T, companion: CompanionId): T {
  if (companion === DEFAULT_COMPANION || !table || typeof table !== 'object') return table;
  const done = cache.get(table) ?? {};
  if (!(companion in done)) {
    done[companion] = swap(table, companion);
    cache.set(table, done);
  }
  return done[companion] as T;
}
