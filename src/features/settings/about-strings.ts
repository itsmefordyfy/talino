import { defineStrings } from '@/lib/i18n';

/** Settings → About rows added with Rate Talino and Send feedback. English only for now (owner, 2026-11-15: no Filipino text); `fil` copies it. */
const en = {
  rate: 'Rate Talino',
  rateHint: 'Tell other learners what you think',
  facebook: 'Follow Talino on Facebook',
};

export const aboutStrings = defineStrings({ en, fil: en });
