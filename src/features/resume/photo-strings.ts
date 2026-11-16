import { defineStrings } from '@/lib/i18n';

const en = {
  pageToggle: 'Show my photo on my page',
  pageHint: 'Your picture appears at the top of your public page. Turn it off any time and update the page.',
  pageNone: 'Add a profile picture in Profile, under Edit profile, to show it on your page.',
  docTitle: 'Photo',
  docToggle: 'Show my photo',
  docHint: 'Puts your profile picture in the header. Many hiring systems ignore photos, so leave it off when you apply through one. Photos are common on résumés in some countries and expected in others.',
  docNone: 'Add a profile picture in Profile, under Edit profile, to use it here.',
  title: 'Profile picture',
  footer: 'A clear headshot works best. It is saved on this phone and in your backup, and it shows on your profile.',
  add: 'Add a photo',
  change: 'Change photo',
  remove: 'Remove photo',
  saving: 'Saving…',
  saveFailed: "The picture couldn't be saved. Try again.",
  tooBig: "That picture couldn't be made small enough. Try a different one.",
  failed: "The photo couldn't be opened. Try again.",
  unavailable: 'Picking a photo needs the latest version of Talino. Update the app and try again.',
};

/** The profile picture's words. English only for now: the Filipino table repeats it. */
export const photoStrings = defineStrings({ en, fil: en });
