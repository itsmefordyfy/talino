/**
 * The context window illustration: a window of fixed size holds the newest messages, and the oldest drop out when it is full. The token sizes are
 * made-up round numbers for teaching, not what any real tokenizer counts, and the behaviour captions are hand-written illustrations.
 */

export type MessageKind = 'instruction' | 'short' | 'medium' | 'long' | 'reminder';

/** What the learner can add, and how many illustrative tokens each is. The instruction is only ever the first message. */
export const ADDABLE_KINDS = ['short', 'medium', 'long', 'reminder'] as const;
export type AddableKind = (typeof ADDABLE_KINDS)[number];

export const TOKENS: Record<MessageKind, number> = { instruction: 12, short: 8, medium: 16, long: 28, reminder: 12 };

export const MIN_WINDOW = 30;
export const MAX_WINDOW = 120;
export const WINDOW_STEP = 10;
export const START_WINDOW = 60;
/** The picture lists at most this many messages, so the list stays readable. */
export const MAX_MESSAGES = 14;

export type ContextMessage = {
  id: number;
  kind: MessageKind;
  /** Which text of the kind's pool it uses (the strings file holds the pool). */
  variant: number;
  tokens: number;
};

export type ContextState = { windowSize: number; messages: ContextMessage[]; nextId: number };

/** A fresh conversation: just the instruction that opens it. */
export function startState(windowSize = START_WINDOW): ContextState {
  return { windowSize: clampWindow(windowSize), messages: [{ id: 1, kind: 'instruction', variant: 0, tokens: TOKENS.instruction }], nextId: 2 };
}

export function clampWindow(size: number): number {
  const rounded = Math.round(size / WINDOW_STEP) * WINDOW_STEP;
  return Math.min(MAX_WINDOW, Math.max(MIN_WINDOW, rounded));
}

/** Adds a message at the end. Refused (same state) once the picture is full. */
export function addMessage(state: ContextState, kind: AddableKind, pool: number): ContextState {
  if (state.messages.length >= MAX_MESSAGES) return state;
  // The variant cycles through the kind's pool, so repeated adds show different words.
  const variant = state.messages.filter((message) => message.kind === kind).length % Math.max(1, pool);
  return { ...state, messages: [...state.messages, { id: state.nextId, kind, variant, tokens: TOKENS[kind] }], nextId: state.nextId + 1 };
}

export function setWindow(state: ContextState, size: number): ContextState {
  const windowSize = clampWindow(size);
  return windowSize === state.windowSize ? state : { ...state, windowSize };
}

export type WindowFit = {
  /** The newest messages that fit, oldest first. */
  inside: ContextMessage[];
  /** What dropped out, oldest first. Always the oldest messages: the window never skips one to keep an older one. */
  dropped: ContextMessage[];
  used: number;
  /** Tokens still free in the window. */
  free: number;
  /** An instruction (the opening one or a reminder) is still inside, so the AI can still "see" it. */
  instructionVisible: boolean;
};

/**
 * Fills the window from the newest message backwards and stops at the first one that no longer fits: the model sees a continuous recent stretch of the
 * conversation, never a gap. (The largest message, 28, is always smaller than the smallest window, 30, so a message alone always fits.)
 */
export function fitWindow(messages: readonly ContextMessage[], windowSize: number): WindowFit {
  let used = 0;
  let firstInside = messages.length;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (used + messages[index].tokens > windowSize) break;
    used += messages[index].tokens;
    firstInside = index;
  }
  const inside = messages.slice(firstInside);
  return {
    inside,
    dropped: messages.slice(0, firstInside),
    used,
    free: windowSize - used,
    instructionVisible: inside.some((message) => message.kind === 'instruction' || message.kind === 'reminder'),
  };
}

export type History = { states: ContextState[] };

export const startHistory = (windowSize?: number): History => ({ states: [startState(windowSize)] });
export const currentOf = (history: History): ContextState => history.states[history.states.length - 1];
/** Records a new state. An action that changed nothing (a refused add) is not a step, so Back never lands on a copy. */
export const pushState = (history: History, next: ContextState): History => (next === currentOf(history) ? history : { states: [...history.states, next] });
export const canGoBack = (history: History): boolean => history.states.length > 1;
export const goBack = (history: History): History => (canGoBack(history) ? { states: history.states.slice(0, -1) } : history);
/** Back to the start, keeping the window size the learner chose. */
export const resetHistory = (history: History): History => startHistory(currentOf(history).windowSize);

/** Which of the hand-written captions applies. */
export type Behaviour = 'full-instruction' | 'lost-instruction' | 'reminded';

export function behaviourOf(state: ContextState, fit: WindowFit): Behaviour {
  if (!fit.instructionVisible) return 'lost-instruction';
  return state.messages.some((message) => message.kind === 'reminder') && fit.dropped.some((message) => message.kind === 'instruction') ? 'reminded' : 'full-instruction';
}
