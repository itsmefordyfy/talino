/**
 * What the release notes do on a launch, as a rule with no screens in it (so it is tested):
 * `mark`: record this version as seen without showing anything (a fresh install); `show`: open the notes (once the learner is on Home);
 * `wait`: not yet (another screen is up); `none`: already seen, or nothing to say.
 */
export type WhatsNewAction = 'none' | 'mark' | 'show' | 'wait';

export function whatsNewAction(input: { version: string; lastSeen: string | null; onboarded: boolean; hasNotes: boolean; pathname: string }): WhatsNewAction {
  const { version, lastSeen, onboarded, hasNotes, pathname } = input;
  if (version === '' || lastSeen === version) return 'none';
  // Not through the welcome yet: nothing is new to someone who has never opened the app (an older install that is mid-welcome sees the notes later).
  if (!onboarded) return lastSeen === null ? 'mark' : 'none';
  // A version with no notes writes nothing: a later build of the same version that has them must still show.
  if (!hasNotes) return 'none';
  return pathname === '/' ? 'show' : 'wait';
}
