import { describe, expect, jest, test } from '@jest/globals';

import { conceptLabel, conceptOf } from './concepts';

// The courses index pulls in animated components Jest can't load; its content is all this needs.
jest.mock('@/features/courses', () => jest.requireActual('@/features/courses/content'));

describe('concepts', () => {
  test('an activity trains the skills of its lesson, namespaced by course', () => {
    expect(conceptOf({ lesson_id: 'developer-03', course_id: 'developer', kind: 'fix-bug' })).toEqual(['developer:ai-assisted-coding', 'developer:code-quality']);
  });

  test('an unknown lesson falls back to the kind', () => {
    expect(conceptOf({ lesson_id: 'ghost-01', course_id: 'ghost', kind: 'match' })).toEqual(['match']);
  });

  test('labels come from the course skills', () => {
    expect(conceptLabel('developer:code-quality')).toBe('Testing, debugging and Git');
    expect(conceptLabel('match')).toBe('match');
    expect(conceptLabel('ghost:thing')).toBe('thing');
  });
});
