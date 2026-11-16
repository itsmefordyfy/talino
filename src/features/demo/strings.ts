import { defineStrings } from '@/lib/i18n';

/** Settings → Developer (development builds only). English only (owner's standing rule: no Filipino text), so `fil` copies it. */
const en = {
  demoData: 'Demo data',
  demoDataDetail: 'Development builds only. Fills the whole app with Ford’s sample from Naga City, Philippines: Home’s journey and streak, courses, badges and a certificate, Career, résumés, the profile and the portfolio. Your own data isn’t changed; turning it off removes only the sample and puts your name back.',
};

export const demoStrings = defineStrings({ en, fil: en });
