import { describe, expect, test } from '@jest/globals';

import { levelsSuitedTo } from './levels';

describe('levelsSuitedTo', () => {
  test('follows the difficulty tier by default', () => {
    expect(levelsSuitedTo('beginner')).toEqual(['complete-beginner', 'beginner']);
    expect(levelsSuitedTo('intermediate')).toEqual(['beginner', 'intermediate']);
    expect(levelsSuitedTo('intermediate', 'some-other-course')).toEqual(['beginner', 'intermediate']);
  });

  test('Data Structures and Algorithms is advised for complete beginners through intermediate', () => {
    expect(levelsSuitedTo('intermediate', 'data-structures-algorithms')).toEqual(['complete-beginner', 'beginner', 'intermediate']);
  });
});
