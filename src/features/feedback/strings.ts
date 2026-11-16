import { defineStrings } from '@/lib/i18n';

/** Settings → Send feedback. English only for now (owner, 2026-11-15: no Filipino text); `fil` copies it. */
const en = {
  title: 'Send feedback',
  rowHint: 'Report a bug or share an idea',
  intro: 'Tell us what’s working, what isn’t, or what you’d love to see. Your message opens in your mail app, so you can check it before it’s sent.',
  type: 'Type',
  kinds: { bug: 'Bug report', feature: 'Feature request', improvement: 'Improvement', other: 'Other' },
  message: 'Your feedback',
  placeholders: {
    bug: 'What happened, and what did you expect? Steps to repeat it help a lot.',
    feature: 'What would you like Talino to do?',
    improvement: 'What could work better, and how?',
    other: 'Anything you’d like us to know.',
  },
  charactersLeft: (n: number) => (n === 1 ? '1 character left' : `${n} characters left`),
  messageMissing: 'Write a few words first.',
  messageLong: (max: number) => `Keep it under ${max} characters.`,
  photos: 'Screenshots or photos (optional)',
  addPhotos: 'Add screenshots or photos',
  addMorePhotos: (count: number, max: number) => `Add screenshots or photos (${count} of ${max})`,
  photoLabel: (n: number) => `Photo ${n}`,
  removePhoto: (n: number) => `Remove photo ${n}`,
  maxPhotos: (max: number) => `${max} photos is the most one message can take.`,
  cantAttachTitle: 'Photos can’t be attached here',
  cantAttachNoMail: 'Your phone’s Mail app isn’t set up, so Talino can’t attach the photos. Open your mail app without them? You can attach them there.',
  cantAttachOld: 'This version of Talino can’t attach photos yet. Open your mail app without them? You can attach them there.',
  openMail: 'Open mail app',
  whatsSent: (email: string) => `Sent to ${email} from your mail app, with the app version and your phone model, to help track down bugs. Photos you add are attached to the email, so check them before you send. Your progress, chats, résumé and career tracker are not included.`,
  submit: 'Write email',
  cancel: 'Cancel',
  close: 'Close',
  done: 'Done',
  handedToMail: 'Your feedback is in your mail app. If you sent it, thank you!',
  noMailTitle: 'No mail app found',
  noMail: (email: string) => `Send your feedback to ${email}.`,
};

export const feedbackStrings = defineStrings({ en, fil: en });
