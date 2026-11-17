import { describe, expect, test } from '@jest/globals';

import { courseOfLessonId, isCodeTeachingLesson, suggestionKey } from './code-course';
import { DSA_TEACHING_INSTRUCTIONS, isDsaLesson } from './dsa-course';

describe('code-teaching courses', () => {
  test('a lesson id names its course', () => {
    expect(courseOfLessonId('programming-fundamentals-07')).toBe('programming-fundamentals');
    expect(courseOfLessonId('ai-coding-beginners-12')).toBe('ai-coding-beginners');
  });

  test('only Programming Fundamentals is a code-teaching course', () => {
    expect(isCodeTeachingLesson('programming-fundamentals-31')).toBe(true);
    expect(isCodeTeachingLesson('ai-coding-beginners-01')).toBe(false);
    expect(isCodeTeachingLesson('programming-fundamentals-extra-01')).toBe(false);
  });

  test('suggestions switch to the code set for its lessons, quiz questions and exercises only', () => {
    expect(suggestionKey({ kind: 'lesson', lessonId: 'programming-fundamentals-02' }, 'lesson')).toBe('lesson-code');
    expect(suggestionKey({ kind: 'quiz', lessonId: 'programming-fundamentals-02', questionId: null }, 'quiz')).toBe('quiz-code');
    expect(suggestionKey({ kind: 'activity', lessonId: 'programming-fundamentals-02', activityId: 'programming-fundamentals-02-match-1' }, 'activity')).toBe('activity-code');
    expect(suggestionKey({ kind: 'lesson', lessonId: 'starter-01' }, 'lesson')).toBe('lesson');
    expect(suggestionKey({ kind: 'project', projectId: 'programming-fundamentals-p1' }, 'project')).toBe('project');
    expect(suggestionKey(null, 'lesson')).toBe('lesson');
  });

  test('the Data Structures and Algorithms course has its own suggestions and is not a "code" course', () => {
    expect(isCodeTeachingLesson('data-structures-algorithms-05')).toBe(false);
    expect(suggestionKey({ kind: 'lesson', lessonId: 'data-structures-algorithms-05' }, 'lesson')).toBe('lesson-dsa');
    expect(suggestionKey({ kind: 'quiz', lessonId: 'data-structures-algorithms-05', questionId: null }, 'quiz')).toBe('quiz-dsa');
    expect(suggestionKey({ kind: 'activity', lessonId: 'data-structures-algorithms-05', activityId: 'data-structures-algorithms-05-match-1' }, 'activity')).toBe('activity-dsa');
    expect(suggestionKey({ kind: 'project', projectId: 'data-structures-algorithms-p1' }, 'project')).toBe('project');
  });

  test('Tali is told to count operations and to hint, not to solve', () => {
    expect(isDsaLesson('data-structures-algorithms-72')).toBe(true);
    expect(isDsaLesson('data-structures-algorithms-extra-01')).toBe(false);
    expect(DSA_TEACHING_INSTRUCTIONS).toMatch(/counting the operations/);
    expect(DSA_TEACHING_INSTRUCTIONS).toMatch(/never give the finished answer first/);
  });
});
