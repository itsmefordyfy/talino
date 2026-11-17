import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { companionOf, DEFAULT_COMPANION, type CompanionId } from '@/features/companion/lib/companions';
import { cleanJourneyFocus, cleanJourneyLevel, type JourneyFocusId, type JourneyLevelId } from '@/features/journey/lib/focus-ids';
import { cleanHomeCourse, type HomeCourseChoice } from '@/features/journey/lib/home-course';
import type { AudienceId } from '@/features/courses/content/types';
import type { AppearancePreference } from '@/lib/appearance';
import { detectLanguage, LANGUAGES, type Language } from '@/lib/i18n';
import { APP_DEFAULT_LANGUAGE, shownLanguage } from '@/lib/language';

export type ReminderTime = { hour: number; minute: number };

export type SettingsState = {
  language: Language;
  appearance: AppearancePreference;
  /** What the learner told us in the welcome: shown on the certificate, résumé and portfolio. */
  learnerName: string;
  /** Their goal from the welcome (one of the five audiences); recommends a course. */
  goal: AudienceId | null;
  /** The welcome is behind them. */
  onboarded: boolean;
  /** The course Today leads with; null before one is chosen (the starter course then). */
  focusCourseId: string | null;
  /** The daily lesson reminder, at the learner's chosen time. */
  dailyReminder: boolean;
  dailyReminderTime: ReminderTime;
  /**
   * Which coach the learner chose in the welcome: Tali (the young man, a male voice) or Tala (the young woman, a female voice).
   * It sets the picture, the name wherever the app says it, and the voice Listen reads in.
   */
  companion: CompanionId;
  /** The days the daily reminder fires (0 Sunday … 6 Saturday); empty means every day. From the learning profile's schedule. */
  reminderDays: number[];
  /** Minutes the learner gives a day, shown in the reminder's words; null until chosen. */
  dailyMinutes: number | null;
  /** Where the learner chose to head on the learning journey (milestones for other directions become optional); null follows what the welcome learned. Never touches progress. */
  journeyFocus: JourneyFocusId[] | null;
  /** The journey level the learner chose to start at; null works it out from their experience and progress. Never touches progress. */
  journeyStartLevel: JourneyLevelId | null;
  /** The course the learner picked for Home's lesson timeline, and when; null follows their progress. Phone-only (a backup never carries it), and never touches progress. */
  homeCourse: HomeCourseChoice | null;
  /** Career tracker follow-up and interview reminders. */
  careerReminders: boolean;
  /** Lesson audio speed for the read-aloud (0.8–1.2). */
  speechRate: number;
  /** Development builds only: every lesson and project opens without finishing the ones before (for testing). Always false in a release build. */
  devUnlockAll: boolean;
  /**
   * Keep an automatic backup of the learner's progress (features/backup). On by default. This is the phone's own
   * choice, so a backup never carries it.
   */
  autoBackup: boolean;
  /** The version whose release notes were last shown (or passed over on a fresh install), so each update's notes show once. Phone-only: a backup never carries it. */
  notesSeen: string | null;
};

const AUDIENCES: AudienceId[] = ['fresh-grad', 'experienced-dev', 'career-changer', 'educator', 'builder'];

export const initialSettingsState: SettingsState = {
  language: APP_DEFAULT_LANGUAGE,
  appearance: 'system',
  learnerName: '',
  goal: null,
  onboarded: false,
  focusCourseId: null,
  dailyReminder: true,
  dailyReminderTime: { hour: 19, minute: 0 },
  companion: DEFAULT_COMPANION,
  reminderDays: [],
  dailyMinutes: null,
  journeyFocus: null,
  journeyStartLevel: null,
  homeCourse: null,
  careerReminders: true,
  speechRate: 1,
  devUnlockAll: false,
  autoBackup: true,
  notesSeen: null,
};

export function firstLaunchSettingsState(): SettingsState {
  return { ...initialSettingsState, language: detectLanguage() };
}

export const NAME_MAX = 60;

export function cleanName(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX).trim() : '';
}

function cleanTime(value: unknown): ReminderTime {
  const time = value as Partial<ReminderTime> | null;
  const hour = Number(time?.hour);
  const minute = Number(time?.minute);
  return Number.isInteger(hour) && hour >= 0 && hour < 24 && Number.isInteger(minute) && minute >= 0 && minute < 60
    ? { hour, minute }
    : initialSettingsState.dailyReminderTime;
}

export function cleanDays(value: unknown): number[] {
  return Array.isArray(value) ? [...new Set(value.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b) : [];
}

/** Saved settings checked on load: an unknown value falls back to its default. */
export function hydrateSettingsState(saved: Partial<SettingsState>): SettingsState {
  const merged = { ...initialSettingsState, ...saved };
  const rate = Number(merged.speechRate);
  return {
    ...merged,
    language: LANGUAGES.includes(merged.language) ? merged.language : APP_DEFAULT_LANGUAGE,
    appearance: merged.appearance === 'light' || merged.appearance === 'dark' ? merged.appearance : 'system',
    learnerName: cleanName(merged.learnerName),
    goal: AUDIENCES.includes(merged.goal as AudienceId) ? merged.goal : null,
    onboarded: merged.onboarded === true,
    focusCourseId: typeof merged.focusCourseId === 'string' ? merged.focusCourseId : null,
    dailyReminder: merged.dailyReminder !== false,
    dailyReminderTime: cleanTime(merged.dailyReminderTime),
    companion: companionOf(merged.companion).id,
    reminderDays: cleanDays(merged.reminderDays),
    dailyMinutes: Number.isFinite(Number(merged.dailyMinutes)) && Number(merged.dailyMinutes) > 0 ? Math.min(120, Math.round(Number(merged.dailyMinutes))) : null,
    journeyFocus: cleanJourneyFocus(merged.journeyFocus),
    journeyStartLevel: cleanJourneyLevel(merged.journeyStartLevel),
    homeCourse: cleanHomeCourse(merged.homeCourse),
    careerReminders: merged.careerReminders !== false,
    speechRate: Number.isFinite(rate) ? Math.min(1.2, Math.max(0.8, rate)) : 1,
    devUnlockAll: __DEV__ && merged.devUnlockAll === true,
    autoBackup: merged.autoBackup !== false,
    notesSeen: typeof merged.notesSeen === 'string' && merged.notesSeen !== '' ? merged.notesSeen : null,
  };
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    languageChanged(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    appearanceChanged(state, action: PayloadAction<AppearancePreference>) {
      state.appearance = action.payload;
    },
    learnerNameChanged(state, action: PayloadAction<string>) {
      state.learnerName = cleanName(action.payload);
    },
    goalChanged(state, action: PayloadAction<AudienceId | null>) {
      state.goal = action.payload;
    },
    onboardingFinished(state) {
      state.onboarded = true;
    },
    focusCourseChanged(state, action: PayloadAction<string | null>) {
      state.focusCourseId = action.payload;
    },
    dailyReminderToggled(state, action: PayloadAction<boolean>) {
      state.dailyReminder = action.payload;
    },
    dailyReminderTimeChanged(state, action: PayloadAction<ReminderTime>) {
      state.dailyReminderTime = cleanTime(action.payload);
    },
    companionChanged(state, action: PayloadAction<CompanionId>) {
      state.companion = companionOf(action.payload).id;
    },
    reminderDaysChanged(state, action: PayloadAction<number[]>) {
      state.reminderDays = cleanDays(action.payload);
    },
    dailyMinutesChanged(state, action: PayloadAction<number | null>) {
      state.dailyMinutes = action.payload === null ? null : Math.min(120, Math.max(1, Math.round(action.payload)));
    },
    journeyFocusChanged(state, action: PayloadAction<JourneyFocusId[] | null>) {
      state.journeyFocus = cleanJourneyFocus(action.payload);
    },
    journeyStartLevelChanged(state, action: PayloadAction<JourneyLevelId | null>) {
      state.journeyStartLevel = cleanJourneyLevel(action.payload);
    },
    /** The learner picked a course for Home (the switcher, a course on the map, the suggested next course). The time is the pick's own, so later work can outrank it. */
    homeCourseChosen(state, action: PayloadAction<string>) {
      state.homeCourse = cleanHomeCourse({ id: action.payload, at: new Date().toISOString() });
    },
    careerRemindersToggled(state, action: PayloadAction<boolean>) {
      state.careerReminders = action.payload;
    },
    devUnlockAllToggled(state, action: PayloadAction<boolean>) {
      state.devUnlockAll = __DEV__ && action.payload;
    },
    speechRateChanged(state, action: PayloadAction<number>) {
      state.speechRate = Math.min(1.2, Math.max(0.8, action.payload));
    },
    autoBackupToggled(state, action: PayloadAction<boolean>) {
      state.autoBackup = action.payload;
    },
    whatsNewSeen(state, action: PayloadAction<string>) {
      state.notesSeen = action.payload;
    },
    /** A restore brought settings over (features/backup): each is checked again here, so a hostile file can't set anything odd. */
    settingsRestored(state, action: PayloadAction<Partial<SettingsState>>) {
      return hydrateSettingsState({ ...state, ...action.payload });
    },
    /** After Delete all data: back to the welcome, keeping the language and look. */
    settingsReset(state) {
      return { ...initialSettingsState, language: state.language, appearance: state.appearance, autoBackup: state.autoBackup, notesSeen: state.notesSeen };
    },
  },
});

export const {
  languageChanged,
  appearanceChanged,
  learnerNameChanged,
  goalChanged,
  onboardingFinished,
  focusCourseChanged,
  dailyReminderToggled,
  dailyReminderTimeChanged,
  reminderDaysChanged,
  companionChanged,
  dailyMinutesChanged,
  journeyFocusChanged,
  journeyStartLevelChanged,
  homeCourseChosen,
  careerRemindersToggled,
  speechRateChanged,
  devUnlockAllToggled,
  autoBackupToggled,
  settingsRestored,
  whatsNewSeen,
  settingsReset,
} = settingsSlice.actions;

type WithSettings = { settings: SettingsState };

/** The language the app is in: the learner's choice, or English while that language is switched off (`TAGALOG_ENABLED`; the choice itself is kept). */
export const selectLanguage = (state: WithSettings) => shownLanguage(state.settings.language);
export const selectAppearance = (state: WithSettings) => state.settings.appearance;
export const selectLearnerName = (state: WithSettings) => state.settings.learnerName;
export const selectGoal = (state: WithSettings) => state.settings.goal;
export const selectOnboarded = (state: WithSettings) => state.settings.onboarded;
export const selectFocusCourseId = (state: WithSettings) => state.settings.focusCourseId;
export const selectCompanion = (state: WithSettings) => state.settings.companion;
export const selectDailyReminder = (state: WithSettings) => state.settings.dailyReminder;
export const selectDailyReminderTime = (state: WithSettings) => state.settings.dailyReminderTime;
export const selectReminderDays = (state: WithSettings) => state.settings.reminderDays;
export const selectDailyMinutes = (state: WithSettings) => state.settings.dailyMinutes;
export const selectJourneyFocus = (state: WithSettings) => state.settings.journeyFocus;
export const selectJourneyStartLevel = (state: WithSettings) => state.settings.journeyStartLevel;
export const selectHomeCourse = (state: WithSettings) => state.settings.homeCourse;
export const selectCareerReminders = (state: WithSettings) => state.settings.careerReminders;
export const selectSpeechRate = (state: WithSettings) => state.settings.speechRate;
/** True only in a development build with the Developer switch on. */
export const selectDevUnlockAll = (state: WithSettings) => __DEV__ && state.settings.devUnlockAll;
export const selectAutoBackup = (state: WithSettings) => state.settings.autoBackup;
export const selectNotesSeen = (state: WithSettings) => state.settings.notesSeen;
