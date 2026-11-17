import { defineStrings } from '@/lib/i18n';

import type { BaseKey, CheckId, ClarityLevel, PartId } from './lib/prompt-anatomy';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'Prompt anatomy: the parts of a good prompt',
  summary: 'Switch the parts of a prompt on and off and see how clear it is and how the answer might change.',
  description:
    'An illustration for one example: a bakery owner who wants to tell regular customers about an early closing. A prompt has six parts: role, context, task, format, limits and an example. Switch each part on or off, then read the prompt it builds, a clarity checklist, and a hand-written note on how the kind of answer might change. The notes are illustrations written for teaching, not output from a real model.',
  topics: ['prompt', 'prompt engineering', 'prompt parts', 'role', 'context', 'task', 'format', 'constraints', 'few-shot', 'clear prompt', 'writing prompts', 'vague prompt'],
  illustration: 'Illustration: the notes about the answer are hand-written examples of the kind of change, not output from a real model. Real answers vary.',
  scenarioTitle: 'The situation',
  scenario: 'A bakery owner wants to tell regular customers that the shop closes early this Friday. Switch the parts of the prompt on and off.',
  partsLabel: 'Parts of the prompt',
  parts: {
    role: { label: 'Role', text: 'You are a friendly assistant who helps a small bakery write to its customers.' },
    context: { label: 'Context', text: 'The bakery closes at 2 pm this Friday for a family event. The message is for regular customers who usually visit after work.' },
    task: { label: 'Task', text: 'Write a message telling them about the early closing.' },
    format: { label: 'Format', text: 'Make it a short text message with a friendly greeting and one line about when we reopen.' },
    constraints: { label: 'Limits', text: 'Keep it under 40 words. Do not promise discounts.' },
    example: { label: 'Example', text: 'Here is an example of our style: "Hi neighbours! Fresh pandesal is ready from 6 am. See you soon!"' },
  } satisfies Record<PartId, { label: string; text: string }>,
  partOn: 'on',
  partOff: 'off',
  toggleLabel: (label: string) => `Include ${label} in the prompt`,
  promptTitle: 'The prompt you built',
  promptEmpty: 'The prompt is empty. Switch a part on.',
  promptLines: (labels: readonly string[]) => (labels.length === 0 ? 'The prompt is empty.' : `The prompt has ${labels.length} ${labels.length === 1 ? 'part' : 'parts'}: ${labels.join(', ')}.`),
  checklistTitle: 'Clarity checklist',
  checks: {
    task: { label: 'The task is stated', missing: 'With no task, the AI has nothing to do, so it has to guess what you want.' },
    audience: { label: 'The audience is named', missing: 'Without the audience, the AI has to guess who will read the message, so the tone and the facts may be wrong.' },
    format: { label: 'The format is named', missing: 'Without a format, the AI picks one for you: it might write an email when you wanted a short text message.' },
    limits: { label: 'Limits are stated', missing: 'Without limits, the length and what it may promise are up to the AI.' },
    role: { label: 'A role is set', missing: 'Without a role, the voice is generic. A role is optional but sets the tone.' },
    example: { label: 'An example is given', missing: 'Without an example, the AI cannot copy your style. An example is optional but very effective.' },
  } satisfies Record<CheckId, { label: string; missing: string }>,
  yes: 'Yes',
  missing: 'Missing',
  checkRow: (label: string, passed: boolean, why: string) => (passed ? `${label}: yes` : `${label}: missing. ${why}`),
  scoreLabel: (passed: number, total: number) => `${passed} of ${total} checks`,
  levels: { vague: 'Vague', fair: 'Getting clearer', strong: 'Clear' } satisfies Record<ClarityLevel, string>,
  levelCaption: (level: string, passed: number, total: number) => `${level}: ${passed} of ${total} checks pass.`,
  answersTitle: 'How the answer might change',
  answers: {
    label: 'Illustration, not a real answer',
    base: {
      'no-task': 'With no task there is nothing to do. The AI would probably ask what you want, or guess and write something unrelated.',
      '000': 'A generic message that could be for any shop. It may be long and formal, and it has to guess the time, the reason and what you want people to do.',
      '100': 'It mentions Friday, the 2 pm closing and the family event, but the length and layout are a guess: it might come out as a long email when you wanted a text message.',
      '010': 'The layout is right (a short text message) but the AI does not know the details, so it may invent a time or leave a blank like [time].',
      '001': 'It is short and makes no promises, but it is vague: no time, no reason and no sense of who it is for.',
      '110': 'The right facts in the right layout. The length may drift past what you wanted, and it might add a discount you never offered.',
      '101': 'The right facts, short, and no promises, but the layout is a guess: an email, a post or a text message.',
      '011': 'A short text message with no discounts, but the details may be invented or left blank.',
      '111': 'A short text message with the right facts, no promises and a friendly tone: the kind of answer the prompt was written to get.',
    } satisfies Record<BaseKey | 'no-task', string>,
    role: 'The voice sounds like a bakery that knows its customers.',
    example: 'The wording copies the style of your example: warm, short, with a greeting.',
  },
  allOn: 'Turn all on',
  reset: 'Reset',
};

export const promptAnatomyStrings = defineStrings({ en, fil: en });
export type PromptAnatomyText = typeof en;
