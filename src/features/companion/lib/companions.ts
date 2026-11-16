/**
 * Talino has two coaches and the learner picks one in the welcome (owner's request, 2026-11-14): Tali, the young man from
 * the first character sheet, and Tala, the young woman from the second. They are one character in two versions: the same
 * poses, the same words, the same job. What changes is the picture, the name and the voice, because "changing the gender
 * changes the voice": Tali speaks in Kokoro v1's `am_puck` (US English, male), Tala in `af_heart` (US English, female). The lessons' recordings
 * and the Hear samples use them; chat answers and lessons with no recording are read by the phone's own voice (owner, 2026-11-15: Gemini text to
 * speech was dropped for Kokoro, `am_puck` for Tali; before that Tali was Gemini's `Achird` and, in the first Kokoro run, `am_michael`).
 *
 * Pure: no React, no native modules, so tests and the server can import it.
 */
export const COMPANION_IDS = ['tali', 'tala'] as const;
export type CompanionId = (typeof COMPANION_IDS)[number];

export const DEFAULT_COMPANION: CompanionId = 'tali';

export type Companion = {
  id: CompanionId;
  /** What the coach is called wherever the app says her or his name. */
  name: string;
  /** The Kokoro voice id (`am_puck`): the folder this coach's lesson recordings are hosted under and saved on the phone as (`<voice>-<lesson>.m4a`). */
  voice: string;
};

export const COMPANIONS: Readonly<Record<CompanionId, Companion>> = {
  tali: { id: 'tali', name: 'Tali', voice: 'am_puck' },
  tala: { id: 'tala', name: 'Tala', voice: 'af_heart' },
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
