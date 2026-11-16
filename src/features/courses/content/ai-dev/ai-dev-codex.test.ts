import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevCodexCourse } from './ai-dev-codex';

test('ai-dev-codex follows every rule', () => {
  expect(allCourseProblems(aiDevCodexCourse)).toEqual([]);
});
