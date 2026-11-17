import { defineStrings } from '@/lib/i18n';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  badge: 'Illustration',
  disclaimer: 'A hand-written example, not a real model\'s output.',
  youAsk: 'You ask',
  answer: 'An AI might answer',
  notice: 'What to notice',
  label: (title: string) => `AI in Action, an illustration: ${title}`,
  copyPrompt: (title: string) => `Copy the example prompt: ${title}`,
};

export const demoStrings = defineStrings({ en, fil: en });
