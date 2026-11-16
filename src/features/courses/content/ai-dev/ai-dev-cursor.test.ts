import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevCursorCourse } from './ai-dev-cursor';

test('ai-dev-cursor follows every rule', () => {
  expect(allCourseProblems(aiDevCursorCourse)).toEqual([]);
});
