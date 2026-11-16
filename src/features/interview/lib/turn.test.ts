import { describe, expect, test } from '@jest/globals';

import { answersGiven, countsAsQuestion, followUpsInARow, hasClosed, parseTurn, questionsAsked, type StoredTurn } from './turn';

const json = (value: unknown) => JSON.stringify(value);
const a = (kind: StoredTurn['kind']): StoredTurn => ({ role: 'assistant', kind });
const u: StoredTurn = { role: 'user', kind: null };

describe('parseTurn', () => {
  test('a good turn passes', () => {
    const turn = parseTurn(json({ reply: ' How did you handle sync? ', kind: 'follow_up', topic: 'Offline sync', notes: 'Q1 offline-first: strong.' }), { opening: false, previousNotes: '' });
    expect(turn).toEqual({ reply: 'How did you handle sync?', kind: 'follow_up', topic: 'Offline sync', notes: 'Q1 offline-first: strong.' });
  });

  test('not JSON, not an object or no reply is refused', () => {
    expect(parseTurn('hello', { opening: false, previousNotes: '' })).toBeNull();
    expect(parseTurn('[]', { opening: false, previousNotes: '' })).toBeNull();
    expect(parseTurn(json({ reply: '  ', kind: 'question' }), { opening: false, previousNotes: '' })).toBeNull();
  });

  test('the first turn is always the opening, and a later "opening" is a question', () => {
    expect(parseTurn(json({ reply: 'Hi', kind: 'question' }), { opening: true, previousNotes: '' })?.kind).toBe('opening');
    expect(parseTurn(json({ reply: 'Next', kind: 'opening' }), { opening: false, previousNotes: '' })?.kind).toBe('question');
  });

  test('an unknown kind is a comment, so it never moves the progress', () => {
    expect(parseTurn(json({ reply: 'Hm', kind: 'ponder' }), { opening: false, previousNotes: '' })?.kind).toBe('comment');
  });

  test('empty notes keep what the interview already knew', () => {
    expect(parseTurn(json({ reply: 'Ok', kind: 'comment', notes: '' }), { opening: false, previousNotes: 'earlier notes' })?.notes).toBe('earlier notes');
  });
});

describe('counting a conversation', () => {
  test('only the opening and main questions count', () => {
    expect(countsAsQuestion('opening')).toBe(true);
    expect(countsAsQuestion('question')).toBe(true);
    expect(countsAsQuestion('follow_up')).toBe(false);
    expect(countsAsQuestion('comment')).toBe(false);
    expect(countsAsQuestion('closing')).toBe(false);
    expect(countsAsQuestion(null)).toBe(false);
  });

  test('questions asked and answers given', () => {
    const messages = [a('opening'), u, a('follow_up'), u, a('question'), u, a('comment')];
    expect(questionsAsked(messages)).toBe(2);
    expect(answersGiven(messages)).toBe(3);
  });

  test('follow-ups in a row restart at every main question', () => {
    expect(followUpsInARow([a('opening'), u, a('follow_up'), u, a('follow_up')])).toBe(2);
    expect(followUpsInARow([a('opening'), u, a('follow_up'), u, a('question')])).toBe(0);
    expect(followUpsInARow([a('question'), u])).toBe(0);
  });

  test('the closing ends the interview', () => {
    expect(hasClosed([a('opening'), u, a('closing')])).toBe(true);
    expect(hasClosed([a('opening'), u, a('question')])).toBe(false);
  });
});
