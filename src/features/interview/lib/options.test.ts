import { describe, expect, test } from '@jest/globals';

import { canStart, DEFAULT_SETUP, interviewProgress, MAX_JOB_DESCRIPTION_CHARS, MAX_PRACTISE_QUESTIONS, plannedQuestions, sanitizeSetup } from './options';

describe('sanitizeSetup', () => {
  test('nothing usable gives the defaults', () => {
    expect(sanitizeSetup(undefined)).toEqual(DEFAULT_SETUP);
    expect(sanitizeSetup('x')).toEqual(DEFAULT_SETUP);
    expect(sanitizeSetup({ type: 'astrology', level: 5, style: null })).toEqual(DEFAULT_SETUP);
  });

  test('known ids pass, unknown ones fall back one by one', () => {
    const setup = sanitizeSetup({ position: '  React   Native Dev ', type: 'react-native', level: 'senior', difficulty: 'hard', style: 'strict', length: 'full', useProfile: false });
    expect(setup).toMatchObject({ position: 'React Native Dev', type: 'react-native', level: 'senior', difficulty: 'hard', style: 'strict', length: 'full', useProfile: false });
    expect(sanitizeSetup({ type: 'technical', style: 'rude' })).toMatchObject({ type: 'technical', style: 'realistic' });
  });

  test('the interviewer and the language are checked, and an unknown one is the default', () => {
    expect(sanitizeSetup({ companion: 'tala', language: 'fil' })).toMatchObject({ companion: 'tala', language: 'fil' });
    expect(sanitizeSetup({ companion: 'robot', language: 'klingon' })).toMatchObject({ companion: 'tali', language: 'en' });
  });

  test('a job description keeps its line breaks and is capped', () => {
    const text = `Role\n\n\n\nMust know React.\n${'x'.repeat(MAX_JOB_DESCRIPTION_CHARS)}`;
    const cleaned = sanitizeSetup({ jobDescription: text }).jobDescription;
    expect(cleaned.startsWith('Role\n\nMust know React.')).toBe(true);
    expect(cleaned.length).toBeLessThanOrEqual(MAX_JOB_DESCRIPTION_CHARS);
  });

  test('practice questions are trimmed, limited and must be text', () => {
    const many = Array.from({ length: 9 }, (_, index) => ` Question ${index} `);
    const practise = sanitizeSetup({ practise: [...many, 4, null, ''] }).practise;
    expect(practise).toHaveLength(MAX_PRACTISE_QUESTIONS);
    expect(practise[0]).toBe('Question 0');
  });
});

describe('starting and planning', () => {
  test('a position of two letters or more can start', () => {
    expect(canStart(DEFAULT_SETUP)).toBe(false);
    expect(canStart({ ...DEFAULT_SETUP, position: ' a ' })).toBe(false);
    expect(canStart({ ...DEFAULT_SETUP, position: 'QA' })).toBe(true);
  });

  test('each length plans its own number of main questions', () => {
    expect(plannedQuestions({ length: 'quick' })).toBe(4);
    expect(plannedQuestions({ length: 'standard' })).toBe(7);
    expect(plannedQuestions({ length: 'full' })).toBe(10);
  });
});

describe('interviewProgress', () => {
  test('is the share of main questions asked, never above 1', () => {
    expect(interviewProgress(0, 7)).toBe(0);
    expect(interviewProgress(3, 6)).toBe(0.5);
    expect(interviewProgress(9, 7)).toBe(1);
  });

  test('a finished interview is full and bad numbers are zero', () => {
    expect(interviewProgress(2, 7, true)).toBe(1);
    expect(interviewProgress(2, 0)).toBe(0);
    expect(interviewProgress(Number.NaN, 7)).toBe(0);
    expect(interviewProgress(-3, 7)).toBe(0);
  });
});
