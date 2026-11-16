import { describe, expect, test } from '@jest/globals';

import { activityLanguage, isActivityKind } from './kinds';

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
