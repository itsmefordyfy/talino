import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import type { Course } from '../types';

/**
 * Checks one course while it is being written: `CHECK_COURSE=react npx jest src/features/courses/content/catalog/check-one`.
 * Prints every problem in plain words; skipped when no course is named.
 */
const id = process.env.CHECK_COURSE;
const run = id ? describe : describe.skip;

run(`course ${id ?? '(none named)'}`, () => {
  test('follows every rule', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require(`./courses/${id}`) as Record<string, unknown>;
    const course = Object.values(loaded).find((value): value is Course => typeof value === 'object' && value !== null && 'lessons' in value);
    expect(course).toBeDefined();
    expect(standardCourseProblems(course as Course)).toEqual([]);
  });
});
