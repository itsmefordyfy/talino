import { describe, expect, test } from '@jest/globals';

import { firstLaunchSettingsState, hydrateSettingsState, initialSettingsState, selectLanguage, settingsReset, settingsSlice, languageChanged } from '@/features/settings/settings-slice';
import { settingsForBackup, cleanBackedUpSettings } from '@/features/backup/lib/settings';

import { activeLocale, setActiveLanguage } from './i18n';
import { APP_DEFAULT_LANGUAGE, DEFAULT_LANGUAGE, isLanguage, languageFromCode, languageOf, LANGUAGES, localeFor, SHOWN_LANGUAGES, shownLanguage, TAGALOG_ENABLED } from './language';

describe('language codes', () => {
  test('Filipino and Tagalog phones start in Tagalog, English in English, anything else is unknown', () => {
    expect(languageFromCode('fil')).toBe('fil');
    expect(languageFromCode('tl')).toBe('fil');
    expect(languageFromCode('FIL')).toBe('fil');
    expect(languageFromCode('en')).toBe('en');
    expect(languageFromCode('de')).toBeNull();
    expect(languageFromCode(null)).toBeNull();
  });

  test('a request or saved value that is not a language is English', () => {
    expect(LANGUAGES).toEqual(['en', 'fil']);
    expect(isLanguage('fil')).toBe(true);
    expect(isLanguage('klingon')).toBe(false);
    expect(languageOf('fil')).toBe('fil');
    expect(languageOf('klingon')).toBe('en');
    expect(languageOf(undefined)).toBe('en');
  });

  test('Tagalog formats dates in the Philippines’ own style, English follows the phone', () => {
    expect(localeFor('fil')).toBe('fil-PH');
    expect(localeFor('en')).toBeUndefined();
  });
});

describe('Tagalog first', () => {
  test('a learner starts in Tagalog whatever the phone says, while a request with no language stays English for older app builds', () => {
    expect(APP_DEFAULT_LANGUAGE).toBe('fil');
    expect(initialSettingsState.language).toBe('fil');
    expect(firstLaunchSettingsState().language).toBe('fil');
    expect(DEFAULT_LANGUAGE).toBe('en');
    expect(languageOf(undefined)).toBe('en');
  });

  test('a saved English choice is kept, so nobody who chose English is switched', () => {
    expect(hydrateSettingsState({ language: 'en' }).language).toBe('en');
  });
});

describe('the chosen language is kept', () => {
  test('a saved choice loads as saved, an unknown one as the app default (Tagalog)', () => {
    expect(hydrateSettingsState({ language: 'fil' }).language).toBe('fil');
    expect(hydrateSettingsState({ language: 'xx' as never }).language).toBe('fil');
  });

  test('changing language changes nothing else (progress lives in the database, settings keep the rest)', () => {
    const before = { ...initialSettingsState, learnerName: 'Ana', goal: 'builder' as const, onboarded: true, focusCourseId: 'starter' };
    const after = settingsSlice.reducer(before, languageChanged('fil'));
    expect(after).toEqual({ ...before, language: 'fil' });
  });

  test('deleting all data keeps the language the learner chose', () => {
    const after = settingsSlice.reducer({ ...initialSettingsState, language: 'fil', onboarded: true }, settingsReset());
    expect(after.language).toBe('fil');
    expect(after.onboarded).toBe(false);
  });

  test('a backup carries the language, so it comes back on another phone after a restore', () => {
    const saved = settingsForBackup({ ...initialSettingsState, language: 'fil' });
    expect(saved.language).toBe('fil');
    expect(cleanBackedUpSettings(saved).language).toBe('fil');
    expect(cleanBackedUpSettings({ language: 'klingon' }).language).toBe('fil');
  });
});

describe('while Tagalog is switched off (owner, 2026-11-15: English only for now)', () => {
  test('the app is English whatever was saved, and the saved choice is kept for when Tagalog comes back', () => {
    expect(TAGALOG_ENABLED).toBe(false);
    expect(SHOWN_LANGUAGES).toEqual(['en']);
    expect(shownLanguage('fil')).toBe('en');
    expect(shownLanguage('en')).toBe('en');
    expect(selectLanguage({ settings: { ...initialSettingsState, language: 'fil' } })).toBe('en');
    expect(hydrateSettingsState({ language: 'fil' }).language).toBe('fil');
    setActiveLanguage('fil');
    expect(activeLocale()).toBeUndefined();
  });
});
