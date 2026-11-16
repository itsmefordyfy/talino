import { APP_DEFAULT_LANGUAGE, DEFAULT_LANGUAGE, localeFor, shownLanguage, type Language } from './language';

export { APP_DEFAULT_LANGUAGE, DEFAULT_LANGUAGE, isLanguage, LANGUAGE_LABELS, LANGUAGES, languageFromCode, languageOf, localeFor, SHOWN_LANGUAGES, shownLanguage, TAGALOG_ENABLED, type Language } from './language';

/**
 * Interface languages: English and Tagalog (`fil`). Every string sits in a table per feature (`defineStrings`), so a
 * language is one more key there. Server code imports `./language` instead (no native imports there).
 */

/** The language a fresh install starts in: Tagalog, the app's primary language, whatever the phone says (see `APP_DEFAULT_LANGUAGE`). */
export function detectLanguage(): Language {
  return APP_DEFAULT_LANGUAGE;
}

let activeLanguage: Language = DEFAULT_LANGUAGE;

/** Set from the store on every change, so date and time formatting follows the learner's language even outside React. */
export function setActiveLanguage(language: Language): void {
  // A saved language that is switched off (`TAGALOG_ENABLED`) formats dates in English, like the rest of the app.
  activeLanguage = shownLanguage(language);
}

/** The locale dates and times are drawn in right now: Tagalog when chosen, the phone's own otherwise. */
export function activeLocale(): string | undefined {
  return localeFor(activeLanguage);
}

/** A feature's strings in every language: `defineStrings({ en: {...}, fil: {...} })`. Both must have the same shape. */
export function defineStrings<T>(table: { en: T; fil: T }): Readonly<Record<Language, T>> {
  return table;
}
