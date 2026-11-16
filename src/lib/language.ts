/**
 * The languages Talino speaks, with no native imports so server routes (`app/api/*+api.ts`) can use them too.
 * `fil` is the code the phone, Apple and Google use for Filipino; learners see it as "Tagalog". The tone and
 * glossary for Tagalog are in `docs/i18n/tagalog-style-guide.md`.
 */
export const LANGUAGES = ['en', 'fil'] as const;
export type Language = (typeof LANGUAGES)[number];

/** What an unknown or missing language on a request means (an older app build sends none): English, as it always was. */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * The language a learner starts in. Talino is Filipino-first (owner's call, 2026-11-14): everyone starts in Tagalog, whatever
 * the phone's language, and can switch to English on the welcome screen or in Settings. A saved choice always wins.
 */
export const APP_DEFAULT_LANGUAGE: Language = 'fil';

/**
 * Whether learners can use Tagalog. **Off for now** (owner, 2026-11-15: "disable and hide Tagalog for now and focus on English"): only 2 of
 * 55 courses have a Tagalog version. While it is off, the app is English everywhere (screens, Tali, dates, narration), the language pickers
 * are hidden, and a learner's saved choice is kept untouched, so turning this back on gives everyone the language they had chosen. The
 * translations, the parity tests and `docs/i18n/` stay as they are.
 */
export const TAGALOG_ENABLED = false;

/** The languages a learner can pick (a picker with one language is not shown). */
export const SHOWN_LANGUAGES: readonly Language[] = TAGALOG_ENABLED ? LANGUAGES : ['en'];

/** The language the app is really in for a saved choice: the choice itself, or English when it is a language that is switched off. */
export function shownLanguage(saved: Language): Language {
  return SHOWN_LANGUAGES.includes(saved) ? saved : 'en';
}

/** Each language in its own words (the picker shows these, so a learner can find theirs). */
export const LANGUAGE_LABELS: Record<Language, string> = { en: 'English', fil: 'Tagalog' };

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/** What a request says, checked: anything that isn't a known language is English. */
export function languageOf(value: unknown): Language {
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

/** Maps a phone language code to one Talino has: Filipino and Tagalog (`fil`, `tl`) are `fil`. */
export function languageFromCode(code: string | null | undefined): Language | null {
  const lower = code?.toLowerCase();
  if (lower === 'fil' || lower === 'tl') return 'fil';
  if (lower === 'en') return 'en';
  return null;
}

/** The locale tag to format dates and numbers in (`undefined` follows the phone for English). */
export function localeFor(language: Language): string | undefined {
  return language === 'fil' ? 'fil-PH' : undefined;
}
