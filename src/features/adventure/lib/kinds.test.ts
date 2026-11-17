import { describe, expect, test } from '@jest/globals';

import { ACTIVITY_KINDS as ACTIVITY_VIEW_KINDS } from '@/features/activities/types';

import { ACTIVITY_KINDS, activityLanguage, isActivityKind } from './kinds';

describe('activityLanguage', () => {
  test('sql challenges are sql; code challenges are js unless their id names a language', () => {
    expect(activityLanguage('sql-challenge', 'developer-07-a1')).toBe('sql');
    expect(activityLanguage('code-challenge', 'developer-07-a1')).toBe('js');
    expect(activityLanguage('code-challenge', 'developer-07-python-2')).toBe('python');
    expect(activityLanguage('code-challenge', 'x-01-py-1')).toBe('python');
    expect(activityLanguage('code-challenge', 'x-01-JavaScript-1')).toBe('js');
    expect(activityLanguage('code-challenge', 'x-01-typescript-1')).toBe('ts');
  });

  test('other kinds have no language, and an arbitrary id invents none', () => {
    expect(activityLanguage('fix-bug', 'x-01-python-1')).toBeNull();
    expect(activityLanguage('code-challenge', 'x-01-banana-1')).toBe('js');
  });

  test('isActivityKind', () => {
    expect(isActivityKind('fix-bug')).toBe(true);
    expect(isActivityKind('nope')).toBe(false);
    expect(isActivityKind(3)).toBe(false);
  });
});

describe('the game layer knows every kind the activity screens can draw', () => {
  // A kind missing here is silently never recorded: its completion would pay no XP and the lesson would never count it as solved.
  test('the two lists are the same', () => {
    expect([...ACTIVITY_KINDS].sort()).toEqual([...ACTIVITY_VIEW_KINDS].sort());
    for (const kind of ACTIVITY_VIEW_KINDS) expect(isActivityKind(kind)).toBe(true);
  });
});
