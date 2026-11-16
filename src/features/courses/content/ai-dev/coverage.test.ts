import { describe, expect, test } from '@jest/globals';

import { findLesson, getCourse } from '../index';
import { PATH_NEXT_STEPS, STACK_COVERAGE } from './syllabus';

describe('the owner’s stack topics are really taught in the path', () => {
  test.each(STACK_COVERAGE.map((row) => [row.topic, row] as const))('%s', (_topic, row) => {
    for (const lessonId of row.lessons) {
      const found = findLesson(lessonId);
      expect(found?.course.kind).toBe('path');
      const text = JSON.stringify(found?.lesson.body ?? []);
      expect(text).toMatch(row.pattern);
    }
  });

  test('every course a "go further" list names exists and is in the path', () => {
    for (const [from, targets] of Object.entries(PATH_NEXT_STEPS)) {
      expect(getCourse(from)).toBeDefined();
      for (const id of targets ?? []) expect(getCourse(id)?.kind).toBe('path');
    }
  });
});
