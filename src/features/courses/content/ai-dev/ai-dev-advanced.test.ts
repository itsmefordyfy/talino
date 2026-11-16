import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevAdvancedCourse } from './ai-dev-advanced';

test('ai-dev-advanced follows every rule', () => {
  expect(allCourseProblems(aiDevAdvancedCourse)).toEqual([]);
});
