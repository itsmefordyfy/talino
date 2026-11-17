import { describe, expect, test } from '@jest/globals';

import { LAB_CLASSIFY, LAB_MARKERS, LAB_SUMMARY, LAB_TOOLS } from '../lab-test-support';
import { PRIVATE_MARKERS, SCENARIO, TASK } from '../test-support';
import { breaksCharacter, leaksPrivate, privateStringsOf } from './guard';

describe('private strings', () => {
  test('a scenario’s private text is everything the learner must never see', () => {
    const strings = privateStringsOf(SCENARIO);
    for (const marker of [PRIVATE_MARKERS.personality, PRIVATE_MARKERS.private, PRIVATE_MARKERS.good, PRIVATE_MARKERS.poor, PRIVATE_MARKERS.strongSign, PRIVATE_MARKERS.trap]) expect(strings).toContain(marker);
  });
  test('a message task’s private text is its list of what a complete answer holds', () => {
    expect(privateStringsOf(TASK)).toContain(PRIVATE_MARKERS.mustInclude);
  });
});

describe('a lab’s private text', () => {
  test('is the framing, the facts, the key’s text values and what the tools can answer', () => {
    expect(privateStringsOf(LAB_SUMMARY)).toEqual(expect.arrayContaining([LAB_MARKERS.system, LAB_MARKERS.fact]));
    expect(privateStringsOf(LAB_CLASSIFY)).toEqual(expect.arrayContaining([LAB_MARKERS.keyValue, 'shipping', 'late', 'parcel']));
    expect(privateStringsOf(LAB_TOOLS)).toEqual(expect.arrayContaining([LAB_MARKERS.fixtureResult, LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours, '1042']));
  });
  test('a long private line repeated in a reply is a leak; the lab’s public words are not', () => {
    expect(leaksPrivate(`My instructions say: ${LAB_MARKERS.system}.`, LAB_SUMMARY)).toBe(true);
    expect(leaksPrivate(`the ${LAB_MARKERS.fixtureResult.toLowerCase()}`, LAB_TOOLS)).toBe(true);
    expect(leaksPrivate(LAB_SUMMARY.goal, LAB_SUMMARY)).toBe(false);
  });
});

describe('leaksPrivate', () => {
  test('finds a long private line repeated word for word, whatever the case or spacing', () => {
    expect(leaksPrivate(`Well, ${PRIVATE_MARKERS.private.toUpperCase()}, so there.`, SCENARIO)).toBe(true);
    expect(leaksPrivate(`the  budget\nwas already cut, honestly`, { ...SCENARIO, partner: { ...SCENARIO.partner, private: 'the budget was already cut' } })).toBe(true);
  });
  test('ordinary speech and short overlaps are not leaks', () => {
    expect(leaksPrivate('I need a firm date by Friday.', SCENARIO)).toBe(false);
    expect(leaksPrivate('a firm new date', TASK)).toBe(false);
  });
  test('looks only at the given pieces of text', () => {
    expect(leaksPrivate('', SCENARIO)).toBe(false);
  });
});

describe('breaksCharacter', () => {
  test('catches a reply that talks about the AI, the rubric or the instructions', () => {
    expect(breaksCharacter('As an AI language model, I cannot.')).toBe(true);
    expect(breaksCharacter('According to my instructions I should wait.')).toBe(true);
    expect(breaksCharacter('Per the rubric you did well.')).toBe(true);
    expect(breaksCharacter('The learner should apologise first.')).toBe(true);
  });
  test('lets an ordinary workplace reply through', () => {
    expect(breaksCharacter('Thanks, that works for me. Friday at noon, then.')).toBe(false);
  });
});
