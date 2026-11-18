import { defineStrings } from '@/lib/i18n';

// Owner rule (2026-11-15): no Filipino is written. The `fil` table is the same English text, a placeholder and not a translation; it is listed in
// ENGLISH_ONLY of strings-parity.test.ts. Every sentence in the Architecture Assistant launcher lives here, never in a component.
// (The request types' own labels and sentences are in `lib/assistant-prompt.ts`.)
const en = {
  intro: 'Describe your application, choose what you want from the assistant, and open Tali with a prompt you can read and change before you send it.',

  loadError: 'Your last description could not be loaded.',
  retry: 'Try again',
  saveError: 'Your description could not be kept on this phone. It will be lost if you leave.',

  descriptionLabel: 'Describe your application',
  descriptionHint: 'What it does, who uses it, how many, and what matters most. A few lines are enough.',
  descriptionPlaceholder: 'For example: TindaTrack lets small shop owners record sales and stock from a phone. About 2,000 shops use it and each must only see its own data.',
  counter: (used: number, max: number) => `${used} of ${max} characters`,
  constraintsLabel: 'Constraints (optional)',
  constraintsHint: 'Team size, deadline, budget, rules, systems you must keep.',
  constraintsPlaceholder: 'For example: two developers, no one on call at night, must run on what we already pay for.',
  knownsLabel: 'Already decided or measured (optional)',
  knownsHint: 'So the assistant does not guess it.',
  knownsPlaceholder: 'For example: we already use PostgreSQL; peak load is about 20 requests a second.',
  requestLabel: 'What do you want?',

  expectTitle: 'What you will get, and what you will not',
  willTitle: 'You will get',
  will: [
    'A draft: the assistant lists its assumptions, the information it is missing, and its reasoning.',
    'The simplest design that meets what you wrote, and what each alternative would cost.',
    'Questions that show where your description is thin.',
  ],
  wontTitle: 'You will not get',
  wont: [
    'A guarantee. Its answers are drafts to check against your real requirements, and they can be wrong.',
    'A decision. You decide, and you can record it in the decision record builder.',
    'Real numbers, prices or limits for your system. It cannot know them.',
  ],
  noLiveCall: 'Nothing is sent when you open the assistant. The prompt appears in the chat box, and a message is sent only when you press send.',

  openButton: 'Open the assistant',
  openNeeds: 'Describe your application first',
  previewTitle: 'The prompt that will be prefilled',
  previewNote: 'You can change it in the chat before you send it.',
  reminderLead: 'Before you send',
  problemLabel: (message: string) => `Reminder. ${message}`,
  description: 'Describe an application, pick one of nine requests, and open Tali with a prompt prefilled from your own words. The assistant states its assumptions and the information it is missing, and its answers are drafts, not guarantees.',
};

export const assistantStrings = defineStrings({ en, fil: en });
