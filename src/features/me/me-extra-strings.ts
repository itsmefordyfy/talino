import { defineStrings } from '@/lib/i18n';

const en = {
  editProfile: 'Edit profile',
  earnedOf: (earned: number, total: number) => `${earned} of ${total} earned`,
  // The badge sheet (a tap on a badge, 2026-11-16).
  badgeEarnedOn: (date: string) => `Earned ${date}`,
  badgeNotYet: 'Not earned yet',
  badgeHowToEarn: 'How to earn it',
  badgeEarnedHow: 'What earned it',
  badgeNotFound: 'This badge is no longer in Talino.',
  badgeOpen: (title: string) => `${title}, show details`,
};

/** The profile card's newer words. English only for now: the Filipino table repeats it. */
export const meExtraStrings = defineStrings({ en, fil: en });
