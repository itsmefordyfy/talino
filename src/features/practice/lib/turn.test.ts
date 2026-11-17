import { describe, expect, test } from '@jest/globals';

import { PRIVATE_MARKERS, SCENARIO } from '../test-support';
import { TURN_SCHEMA, parseTurn, readPartnerTurn } from './turn';

const json = (value: unknown) => JSON.stringify(value);
const options = (turn = 1) => ({ scenario: SCENARIO, turn });

describe('parseTurn', () => {
  test('a short in-character reply is a turn that goes on', () => {
    expect(parseTurn(json({ reply: 'Friday is too late for me.', end: false }), options())).toEqual({ reply: 'Friday is too late for me.', end: false });
  });

  test('an end flag from the partner is kept', () => {
    expect(parseTurn(json({ reply: 'Fine, Friday it is. Thanks.', end: true }), options(2))).toEqual({ reply: 'Fine, Friday it is. Thanks.', end: true });
  });

  test('the last allowed turn always ends, whatever the model said', () => {
    expect(parseTurn(json({ reply: 'Okay.', end: false }), options(SCENARIO.maxTurns))?.end).toBe(true);
  });

  test('a missing or odd end flag means the conversation goes on', () => {
    expect(parseTurn(json({ reply: 'Go on.' }), options())?.end).toBe(false);
    expect(parseTurn(json({ reply: 'Go on.', end: 'yes' }), options())?.end).toBe(false);
  });

  test('trims, drops surrounding quotes and caps a long reply', () => {
    expect(parseTurn(json({ reply: '  "Right, tell me more."  ', end: false }), options())?.reply).toBe('Right, tell me more.');
    expect(parseTurn(json({ reply: 'x'.repeat(5000), end: false }), options())?.reply).toHaveLength(1500);
  });

  test('unreadable, empty or wrongly shaped replies are not turns', () => {
    expect(parseTurn('not json', options())).toBeNull();
    expect(parseTurn(json(null), options())).toBeNull();
    expect(parseTurn(json([]), options())).toBeNull();
    expect(parseTurn(json({ reply: '   ', end: false }), options())).toBeNull();
    expect(parseTurn(json({ reply: 12, end: false }), options())).toBeNull();
  });

  test('a reply that recites the private brief or steps out of the role is refused', () => {
    expect(parseTurn(json({ reply: `Honestly, ${PRIVATE_MARKERS.private}.`, end: false }), options())).toBeNull();
    expect(parseTurn(json({ reply: 'The rubric says you should apologise.', end: false }), options())).toBeNull();
  });

  test('the schema asks for exactly the two fields', () => {
    expect(TURN_SCHEMA.required).toEqual(['reply', 'end']);
  });
});

describe('readPartnerTurn', () => {
  test('reads a turn the route sent, and nothing damaged', () => {
    expect(readPartnerTurn({ reply: ' Go on. ', end: true })).toEqual({ reply: 'Go on.', end: true });
    expect(readPartnerTurn({ reply: 'Hm.' })).toEqual({ reply: 'Hm.', end: false });
    expect(readPartnerTurn({ reply: '', end: false })).toBeNull();
    expect(readPartnerTurn(null)).toBeNull();
    expect(readPartnerTurn('Go on.')).toBeNull();
    expect(readPartnerTurn([])).toBeNull();
  });
});
