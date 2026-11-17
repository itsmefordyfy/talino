import { describe, expect, test } from '@jest/globals';

import { addMessage, behaviourOf, canGoBack, clampWindow, currentOf, fitWindow, goBack, MAX_MESSAGES, MAX_WINDOW, MIN_WINDOW, pushState, resetHistory, setWindow, startHistory, startState, TOKENS, type AddableKind, type ContextState } from './context-window';

const POOL = 3;
const add = (state: ContextState, ...kinds: AddableKind[]) => kinds.reduce((current, kind) => addMessage(current, kind, POOL), state);

describe('the window', () => {
  test('starts with only the opening instruction, which fits', () => {
    const state = startState();
    expect(state.messages.map((message) => message.kind)).toEqual(['instruction']);
    const fit = fitWindow(state.messages, state.windowSize);
    expect(fit).toMatchObject({ used: TOKENS.instruction, free: state.windowSize - TOKENS.instruction, instructionVisible: true });
    expect(fit.dropped).toEqual([]);
  });

  test('fills with the newest messages and the oldest drop out when it is full', () => {
    // 12 (instruction) + 28 + 28 = 68 > 60: the instruction is the first to go.
    const state = add(startState(60), 'long', 'long');
    const fit = fitWindow(state.messages, state.windowSize);
    expect(fit.inside.map((message) => message.kind)).toEqual(['long', 'long']);
    expect(fit.dropped.map((message) => message.kind)).toEqual(['instruction']);
    expect(fit.used).toBe(56);
    expect(fit.free).toBe(4);
    expect(fit.instructionVisible).toBe(false);
  });

  test('never skips a message to keep an older one: what is inside is one recent stretch', () => {
    // newest first: 28 fits, 8 would fit in the gap left (60-28=32 -> 8 ok), so check a case where a big one blocks smaller older ones.
    const state = add(startState(30), 'short', 'long');
    const fit = fitWindow(state.messages, state.windowSize);
    // long (28) fits alone; the short (8) before it does not fit beside it, and the instruction (12) before that must not be kept instead.
    expect(fit.inside.map((message) => message.kind)).toEqual(['long']);
    expect(fit.dropped.map((message) => message.kind)).toEqual(['instruction', 'short']);
    expect(fit.inside.length + fit.dropped.length).toBe(state.messages.length);
  });

  test('the largest message always fits the smallest window by itself', () => {
    expect(Math.max(...Object.values(TOKENS))).toBeLessThan(MIN_WINDOW);
    for (const kind of ['short', 'medium', 'long', 'reminder'] as const) {
      const fit = fitWindow(add(startState(MIN_WINDOW), kind).messages, MIN_WINDOW);
      expect(fit.inside[fit.inside.length - 1].kind).toBe(kind);
    }
  });

  test('a bigger window keeps more; a smaller one drops more, and used never exceeds the size', () => {
    const state = add(startState(60), 'medium', 'medium', 'short', 'long');
    let previous = -1;
    for (const size of [30, 40, 60, 90, 120]) {
      const fit = fitWindow(state.messages, size);
      expect(fit.used).toBeLessThanOrEqual(size);
      expect(fit.inside.length).toBeGreaterThanOrEqual(previous);
      previous = fit.inside.length;
    }
    expect(fitWindow(state.messages, 120).dropped).toEqual([]);
  });

  test('window sizes snap to the step and stay in range', () => {
    expect(clampWindow(0)).toBe(MIN_WINDOW);
    expect(clampWindow(1000)).toBe(MAX_WINDOW);
    expect(clampWindow(64)).toBe(60);
    expect(clampWindow(66)).toBe(70);
    expect(setWindow(startState(60), 62)).toEqual(startState(60));
  });

  test('messages get distinct ids and cycle through their text pool', () => {
    const state = add(startState(), 'short', 'short', 'short', 'short');
    expect(state.messages.map((message) => message.id)).toEqual([1, 2, 3, 4, 5]);
    expect(state.messages.filter((message) => message.kind === 'short').map((message) => message.variant)).toEqual([0, 1, 2, 0]);
  });

  test('the picture holds a fixed number of messages and refuses more without changing', () => {
    let state = startState();
    for (let index = 0; index < MAX_MESSAGES + 3; index += 1) state = addMessage(state, 'short', POOL);
    expect(state.messages).toHaveLength(MAX_MESSAGES);
    expect(addMessage(state, 'long', POOL)).toBe(state);
  });
});

describe('the behaviour caption', () => {
  test('sees the instruction, loses it, or gets it back from a reminder', () => {
    const a = add(startState(60), 'short');
    expect(behaviourOf(a, fitWindow(a.messages, a.windowSize))).toBe('full-instruction');
    const b = add(startState(60), 'long', 'long');
    expect(behaviourOf(b, fitWindow(b.messages, b.windowSize))).toBe('lost-instruction');
    const c = add(startState(60), 'long', 'long', 'reminder');
    const fit = fitWindow(c.messages, c.windowSize);
    expect(fit.instructionVisible).toBe(true);
    expect(behaviourOf(c, fit)).toBe('reminded');
  });
});

describe('history', () => {
  test('back undoes the last change and reset keeps the chosen window size', () => {
    let history = startHistory(60);
    expect(canGoBack(history)).toBe(false);
    history = pushState(history, add(currentOf(history), 'short'));
    history = pushState(history, setWindow(currentOf(history), 90));
    expect(currentOf(history).windowSize).toBe(90);
    history = goBack(history);
    expect(currentOf(history).windowSize).toBe(60);
    expect(currentOf(history).messages).toHaveLength(2);
    history = goBack(history);
    expect(goBack(history)).toBe(history);
    history = pushState(history, setWindow(currentOf(history), 90));
    history = pushState(history, add(currentOf(history), 'long'));
    expect(currentOf(resetHistory(history)).windowSize).toBe(90);
    expect(currentOf(resetHistory(history)).messages).toHaveLength(1);
  });

  test('a refused or unchanged action is not a step', () => {
    let history = startHistory();
    history = pushState(history, setWindow(currentOf(history), 60));
    expect(history.states).toHaveLength(1);
  });
});
