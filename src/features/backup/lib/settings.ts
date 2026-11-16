import { hydrateSettingsState, initialSettingsState, type SettingsState } from '@/features/settings/settings-slice';

/**
 * The settings a backup carries: the learner's own choices. Never the phone's state (`autoBackup`), a
 * purchase, the device id, a store id or any address with a key: none of those is in the settings slice,
 * and this list is the only door a setting can go through.
 */
export const BACKED_UP_SETTINGS = [
  'language',
  'appearance',
  'learnerName',
  'goal',
  'onboarded',
  'focusCourseId',
  'dailyReminder',
  'dailyReminderTime',
  'companion',
  'reminderDays',
  'dailyMinutes',
  'journeyFocus',
  'journeyStartLevel',
  'careerReminders',
  'speechRate',
] as const satisfies readonly (keyof SettingsState)[];

export type BackedUpSettingKey = (typeof BACKED_UP_SETTINGS)[number];
export type BackedUpSettings = Partial<Pick<SettingsState, BackedUpSettingKey>>;

export function settingsForBackup(settings: SettingsState): BackedUpSettings {
  const picked: BackedUpSettings = {};
  for (const key of BACKED_UP_SETTINGS) Object.assign(picked, { [key]: settings[key] });
  return picked;
}

/**
 * The settings in a file, checked: only whitelisted keys, each through the slice's own `hydrateSettingsState`
 * (the same checking a saved setting gets on load), so a value of the wrong kind becomes the default instead
 * of reaching the app. Nothing outside the whitelist survives, whatever the file holds.
 */
export function cleanBackedUpSettings(raw: unknown): BackedUpSettings {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const present = BACKED_UP_SETTINGS.filter((key) => Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined);
  const picked = Object.fromEntries(present.map((key) => [key, source[key]]));
  const checked = hydrateSettingsState(picked as Partial<SettingsState>);
  const clean: BackedUpSettings = {};
  for (const key of present) Object.assign(clean, { [key]: checked[key] });
  return clean;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export type SettingsRestoreContext = {
  /** `replace` takes every backed-up setting; `merge` is the safe default. */
  mode: 'merge' | 'replace';
  /** This install already has its own progress or has finished its welcome: a merge then only fills what is still at its default. */
  usedInstall: boolean;
  /** The restore brought learning data in: the welcome is behind the learner, whatever the file's own flag says. */
  learningRestored: boolean;
};

/**
 * The settings to apply after a restore (null when nothing changes). A fresh install takes them all (so
 * the language, look, reminders and name come back); a used one, in a merge, only fills values that are
 * still at their defaults and never overwrites a choice made on this phone. `onboarded` is turned on
 * whenever progress came back, so a restored learner skips the welcome.
 */
export function settingsToApply(local: SettingsState, backed: BackedUpSettings, context: SettingsRestoreContext): Partial<SettingsState> | null {
  const next: Partial<SettingsState> = {};
  const fillOnlyDefaults = context.mode === 'merge' && context.usedInstall;
  for (const key of BACKED_UP_SETTINGS) {
    if (!(key in backed) || key === 'onboarded') continue;
    const value = backed[key];
    if (same(value, local[key])) continue;
    if (fillOnlyDefaults && !same(local[key], initialSettingsState[key])) continue;
    Object.assign(next, { [key]: value });
  }
  const onboarded = local.onboarded || backed.onboarded === true || context.learningRestored;
  if (onboarded && !local.onboarded) next.onboarded = true;
  // Replace puts back exactly what the backup says, a not-yet-finished welcome included.
  if (context.mode === 'replace' && backed.onboarded === false && !context.learningRestored) next.onboarded = false;
  return Object.keys(next).length > 0 ? next : null;
}
