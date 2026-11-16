import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevClaudeCodeCourse } from './ai-dev-claude-code';

test('ai-dev-claude-code follows every rule', () => {
  expect(allCourseProblems(aiDevClaudeCodeCourse)).toEqual([]);
});
