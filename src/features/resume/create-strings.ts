import { defineStrings } from '@/lib/i18n';

const en = {
  tailorTitle: 'Tailor it to a job',
  tailorBody: 'Optional. Paste a job post and Tali matches your résumé to it.',
  recommendedFor: (name: string) => `Recommended for you: ${name}`,
  templateOther: 'Pick another look any time. You can change it later too.',
};

/** The last step's newer words. English only for now: the Filipino table repeats it. */
export const createStrings = defineStrings({ en, fil: en });
