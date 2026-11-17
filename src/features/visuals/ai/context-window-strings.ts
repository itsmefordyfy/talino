import { defineStrings } from '@/lib/i18n';

import type { AddableKind, Behaviour, MessageKind } from './lib/context-window';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'The context window: what an AI can see',
  summary: 'Add messages to a conversation and watch the oldest ones fall out of a fixed-size window.',
  description:
    'An illustration of a context window with made-up numbers. A window of fixed size holds the newest messages of a conversation. Add short, medium and long messages and watch the window fill; when it is full the oldest messages drop out, including the instruction at the very start, and the example reply changes. Use the window size buttons to make it bigger or smaller, Back to undo, and Reset to start again. Token sizes and replies are hand-written examples, not from a real model.',
  topics: ['context window', 'context length', 'tokens', 'memory', 'forgetting', 'long conversation', 'system prompt', 'instructions', 'truncation', 'how ai works'],
  illustration: 'Illustration with made-up token sizes and hand-written replies. This is not a real model, and real windows are much larger.',
  windowLabel: 'Window size (tokens)',
  addLabel: 'Add to the conversation',
  add: { short: 'Short message', medium: 'Medium message', long: 'Long document', reminder: 'Remind it of the instruction' } satisfies Record<AddableKind, string>,
  tokensOf: (n: number) => `${n} tokens`,
  back: 'Back',
  reset: 'Reset',
  windowTitle: 'The conversation',
  usedLabel: (used: number, size: number) => `Window: ${used} of ${size} tokens used`,
  messagesLabel: (n: number) => `Messages: ${n}`,
  droppedLabel: (n: number, tokens: number) => `Dropped: ${n} (${tokens} tokens)`,
  insideStatus: 'In the window',
  droppedStatus: 'Dropped: the AI cannot see this',
  kindNames: { instruction: 'Instruction', short: 'You', medium: 'You', long: 'You pasted', reminder: 'You reminded it' } satisfies Record<MessageKind, string>,
  texts: {
    instruction: ['Always answer in short, friendly sentences.'],
    short: ['What is a token?', 'Thanks, that helps.', 'Can you say it another way?'],
    medium: ['I run a small bakery and I want to write a note to my customers about our new opening hours.', 'Last week a customer asked about gluten-free bread. Can you suggest what I could say?', 'My sister and I are planning a birthday party for twenty guests next month.'],
    long: ['[A long article about coffee farming that you pasted in for the AI to summarise.]', '[Pages of meeting notes that you pasted in so the AI can find the action items.]', '[A long price list with dozens of products and their sizes.]'],
    reminder: ['Reminder: always answer in short, friendly sentences.'],
  } satisfies Record<MessageKind, string[]>,
  meterLabel: (used: number, size: number, dropped: number) => `The window holds ${used} of ${size} tokens. ${plural(dropped, 'message')} dropped out.`,
  behaviourTitle: 'What the AI would do now (illustration)',
  behaviours: {
    'full-instruction': {
      note: 'The instruction is still inside the window, so the AI can follow it.',
      reply: '"Sure! A token is a small piece of text. Short and simple."',
    },
    'lost-instruction': {
      note: 'The instruction has fallen out of the window. The AI cannot see it any more, so it may stop following it.',
      reply: '"Certainly. A token is the basic unit into which a language model divides text before processing it, and the number of tokens determines how much text fits in the context window."',
    },
    reminded: {
      note: 'The first instruction dropped out, but the reminder is inside the window, so the AI can follow it again.',
      reply: '"Sure! A token is a small piece of text. Short and simple."',
    },
  } satisfies Record<Behaviour, { note: string; reply: string }>,
  replyLabel: 'Example reply',
  ideaTitle: 'What to take from this',
  idea: 'The AI only works from what is inside the window. If something important (a rule, a name, a number) scrolls out, say it again, or start a new chat with a short summary.',
  full: (max: number) => `The picture holds ${max} messages, so no more can be added. Use Back or Reset.`,
  messageLabel: (n: number, name: string, text: string, tokens: number, inside: boolean) => `Message ${n}, ${name}, ${tokens} tokens, ${inside ? 'in the window' : 'dropped, the AI cannot see it'}: ${text}`,
};

export const contextWindowStrings = defineStrings({ en, fil: en });
export type ContextWindowText = typeof en;
