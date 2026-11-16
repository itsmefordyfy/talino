import { describe, expect, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { computeJourney } from './engine';
import { parsePosition, placeToOpen, signatureOf } from './position';
import { emptyFacts, finishLessons, newLearner } from './test-helpers';

const run = (facts = emptyFacts()) => computeJourney(AI_BUILDER_JOURNEY, facts, newLearner);

describe('restoring the place on the map', () => {
  test('the same progress returns to the exact spot', () => {
    const signature = signatureOf(run());
    expect(placeToOpen({ y: 840, signature }, signature, 300)).toBe(840);
  });

  test('progress that moved on takes the learner to their new current step', () => {
    const before = signatureOf(run());
    const after = signatureOf(run(finishLessons(emptyFacts(), 'starter')));
    expect(after).not.toBe(before);
    expect(placeToOpen({ y: 840, signature: before }, after, 520)).toBe(520);
  });

  test('with nothing saved it opens on the current step, and nowhere if there is none', () => {
    expect(placeToOpen(null, 'x', 410)).toBe(410);
    expect(placeToOpen(null, 'x', -20)).toBe(0);
    expect(placeToOpen(null, 'x', null)).toBeNull();
  });

  test('the signature changes with each step finished', () => {
    const a = signatureOf(run());
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set('starter', { ...courses.get('starter')!, lessonsDone: 10, lessonsTotal: 10, started: true });
    expect(signatureOf(run({ ...facts, courses }))).not.toBe(a);
  });

  test('a saved value is read back only if it is whole', () => {
    expect(parsePosition(JSON.stringify({ y: 12, signature: 's' }))).toEqual({ y: 12, signature: 's' });
    expect(parsePosition('nope')).toBeNull();
    expect(parsePosition(JSON.stringify({ y: -3, signature: 's' }))).toBeNull();
    expect(parsePosition(JSON.stringify({ y: 'a', signature: 's' }))).toBeNull();
    expect(parsePosition(null)).toBeNull();
  });
});
