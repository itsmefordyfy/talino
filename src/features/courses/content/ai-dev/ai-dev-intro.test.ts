import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevIntroCourse } from './ai-dev-intro';

test('ai-dev-intro follows every rule', () => {
  expect(allCourseProblems(aiDevIntroCourse)).toEqual([]);
});
