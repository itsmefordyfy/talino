import type { IconName } from '@/components/ui/icon';

import type { whatsNewStrings } from '../strings';

/** The words of one note, in `whatsNewStrings.en.items`. */
export type ReleaseNoteId = keyof (typeof whatsNewStrings)['en']['items'];

export type ReleaseNote = { id: ReleaseNoteId; icon: IconName };

/**
 * What each version added, for the sheet shown once after an update (and from Settings → About). A new version adds its entry
 * here and its words under `items` in `../strings.ts`; a version with no entry shows nothing, and the release scripts refuse a
 * new version without one. Keyed by the app's version ("1.0"), not its build.
 */
export const RELEASE_NOTES: Readonly<Record<string, readonly ReleaseNote[]>> = {
  '1.0': [
    { id: 'aiJourney', icon: 'route' },
    { id: 'programmingFundamentals', icon: 'psychology' },
    { id: 'dataStructuresAlgorithms', icon: 'account_tree' },
    { id: 'generativeAi', icon: 'auto_awesome' },
    { id: 'softSkills', icon: 'groups' },
    { id: 'internationalClients', icon: 'public' },
    { id: 'timeProductivity', icon: 'schedule' },
    { id: 'aiDevelopment', icon: 'code' },
    { id: 'betterCourses', icon: 'auto_awesome' },
    { id: 'coach', icon: 'record_voice_over' },
    { id: 'career', icon: 'work' },
    { id: 'ipad', icon: 'tablet_mac' },
    { id: 'backup', icon: 'cloud_sync' },
  ],
};

/** The notes for a version, or an empty list when it has none to announce. */
export function notesFor(version: string): readonly ReleaseNote[] {
  return RELEASE_NOTES[version] ?? [];
}

/** "1.10" after "1.9": versions compared part by part as numbers. */
export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

/**
 * What the What's new sheet shows: this version's notes, else the newest notes there are (a build whose version has none, such
 * as a development build, still shows what is new rather than an empty sheet).
 */
export function notesToShow(version: string): { version: string; notes: readonly ReleaseNote[] } {
  const own = notesFor(version);
  if (own.length > 0) return { version, notes: own };
  const newest = Object.keys(RELEASE_NOTES).sort(compareVersions).at(-1);
  return newest ? { version: newest, notes: RELEASE_NOTES[newest] } : { version, notes: [] };
}
