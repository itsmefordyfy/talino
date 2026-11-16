import { expect, test } from '@jest/globals';

import { allCourseProblems } from './check';
import { aiDevChatgptCourse } from './ai-dev-chatgpt';

test('ai-dev-chatgpt follows every rule', () => {
  expect(allCourseProblems(aiDevChatgptCourse)).toEqual([]);
});
