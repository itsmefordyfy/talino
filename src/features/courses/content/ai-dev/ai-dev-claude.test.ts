import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevClaudeCourse } from './ai-dev-claude';

test('ai-dev-claude follows every rule', () => {
  expect(allCourseProblems(aiDevClaudeCourse)).toEqual([]);
});
