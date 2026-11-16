import { describe, expect, test } from '@jest/globals';

import { bracketBlanks, fillTemplate, hintFor, PLACEHOLDER_HINTS, PRIVATE_PLACEHOLDERS } from './fill';

describe('fillTemplate', () => {
  test('known placeholders are filled, spaces inside braces allowed', () => {
    expect(fillTemplate('Hi, I’m {{name}}, {{ headline }}.', { name: 'Ana', headline: 'a developer' })).toEqual({ text: 'Hi, I’m Ana, a developer.', blanks: [] });
  });

  test('a known placeholder with no value shows its hint in brackets', () => {
    const filled = fillTemplate('See {{portfolioLink}} and {{portfolioLink}}', { portfolioLink: '  ' });
    expect(filled.text).toBe(`See [${PLACEHOLDER_HINTS.portfolioLink}] and [${PLACEHOLDER_HINTS.portfolioLink}]`);
    expect(filled.blanks).toEqual([PLACEHOLDER_HINTS.portfolioLink]);
  });

  test('unknown placeholders stay visible for the learner to complete', () => {
    const filled = fillTemplate('Dear {{hiringManager}}, the {{role}} role at {{company}}', { name: 'Ana' });
    expect(filled.text).toBe('Dear [hiring manager], the [role] role at [company]');
    expect(filled.blanks).toEqual(['hiring manager', 'role', 'company']);
  });

  test('text without placeholders is unchanged; single braces are left alone', () => {
    expect(fillTemplate('{not one} plain', {}).text).toBe('{not one} plain');
  });
});

describe('hintFor', () => {
  test('camelCase and snake_case read as words', () => {
    expect(hintFor('topicDiscussed')).toBe('topic discussed');
    expect(hintFor('client_name')).toBe('client name');
  });
});

describe('what stays private for the AI', () => {
  test('kept tokens are left as they are, everything else is filled', () => {
    const filled = fillTemplate('Hi {{clientName}}, I’m {{name}}. Skills: {{skills}}. {{ portfolioLink }}', { name: 'Ana Cruz', skills: 'React', portfolioLink: 'https://ana.example' }, undefined, PRIVATE_PLACEHOLDERS);
    expect(filled.text).toBe('Hi [client name], I’m {{name}}. Skills: React. {{portfolioLink}}');
    expect(filled.text).not.toContain('Ana Cruz');
    expect(filled.blanks).toEqual(['client name']);
  });

  test('the name and both links are what is kept', () => {
    expect([...PRIVATE_PLACEHOLDERS].sort()).toEqual(['name', 'portfolioLink', 'topProjectLink']);
  });

  test('filling a draft afterwards puts the values back and turns a made-up token into a blank', () => {
    const back = fillTemplate('Thanks, {{name}}! See {{portfolioLink}} or {{madeUp}}', { name: 'Ana', portfolioLink: null });
    expect(back.text).toBe('Thanks, Ana! See [link to your portfolio] or [made up]');
  });
});

describe('bracketBlanks', () => {
  test('lists each bracket once, in order, and ignores other brackets', () => {
    expect(bracketBlanks('Hi [client name], the [price] and [client name]. [x] is too short.')).toEqual(['client name', 'price']);
    expect(bracketBlanks('nothing to fill')).toEqual([]);
  });
});
