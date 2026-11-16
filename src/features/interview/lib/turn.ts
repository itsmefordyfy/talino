/**
 * One turn of the interviewer, as the model must return it (Gemini's response schema). Returning the reply together with what
 * kind of turn it was and the running notes is what lets the app show real progress and keep a long interview in context without
 * guessing from prose: `kind` says whether a main question, a follow-up or the closing was just said, and `notes` is the
 * model's own compact memory of the candidate's answers, sent back with the next turn after the older messages are dropped.
 */

export const TURN_KINDS = ['opening', 'question', 'follow_up', 'comment', 'closing'] as const;
export type TurnKind = (typeof TURN_KINDS)[number];

export const TURN_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    kind: { type: 'STRING', enum: [...TURN_KINDS] },
    topic: { type: 'STRING' },
    notes: { type: 'STRING' },
  },
  required: ['reply', 'kind', 'topic', 'notes'],
} as const;

export type InterviewTurn = { reply: string; kind: TurnKind; topic: string; notes: string };

export const MAX_REPLY_CHARS = 1500;
export const MAX_TOPIC_CHARS = 60;
export const MAX_NOTES_CHARS = 2400;

/** A main question moves the progress bar; follow-ups, comments and the closing don't. */
export const countsAsQuestion = (kind: TurnKind | string | null | undefined): boolean => kind === 'opening' || kind === 'question';

const asText = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/**
 * The model's JSON, checked for shape; null when it isn't a usable turn. The first turn is always the opening, whatever the model
 * labelled it. An empty `notes` keeps what the interview already knew, so a model that forgets the field never wipes its memory.
 */
export function parseTurn(text: string, options: { opening: boolean; previousNotes: string }): InterviewTurn | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null) return null;
  const value = raw as Record<string, unknown>;
  const reply = asText(value.reply, MAX_REPLY_CHARS);
  if (!reply) return null;
  const labelled = (TURN_KINDS as readonly string[]).includes(value.kind as string) ? (value.kind as TurnKind) : 'comment';
  const kind: TurnKind = options.opening ? 'opening' : labelled === 'opening' ? 'question' : labelled;
  const notes = asText(value.notes, MAX_NOTES_CHARS) || options.previousNotes.slice(0, MAX_NOTES_CHARS);
  return { reply, kind, topic: asText(value.topic, MAX_TOPIC_CHARS), notes };
}

/** What is stored with each interviewer message (the app reads it back for progress and the "follow-ups in a row" count). */
export type StoredTurn = { role: 'user' | 'assistant'; kind: TurnKind | null };

/** Main questions asked so far, from the saved messages. */
export const questionsAsked = (messages: readonly StoredTurn[]): number => messages.filter((message) => message.role === 'assistant' && countsAsQuestion(message.kind)).length;

/** Answers the learner has given. */
export const answersGiven = (messages: readonly { role: 'user' | 'assistant' }[]): number => messages.filter((message) => message.role === 'user').length;

/** Follow-ups the interviewer has asked since its last main question, so it moves on after two. */
export function followUpsInARow(messages: readonly StoredTurn[]): number {
  let count = 0;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== 'assistant') continue;
    if (message.kind === 'follow_up') count += 1;
    else break;
  }
  return count;
}

/** Whether the interviewer has said goodbye (the interview is over and the evaluation is next). */
export const hasClosed = (messages: readonly StoredTurn[]): boolean => messages.some((message) => message.role === 'assistant' && message.kind === 'closing');

/** The most messages sent to the model with a turn; the notes carry the rest. */
export const MAX_SENT_MESSAGES = 14;
/** The most answers one interview takes (cost): after this the app asks the learner to finish. */
export const MAX_ANSWERS = 40;
