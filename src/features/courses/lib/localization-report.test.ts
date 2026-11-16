import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../content';
import { FIL_COURSES } from '../content/fil';
import type { Course } from '../content/types';
import { localizationReport } from './localization-report';

const english = COURSES.find((course) => course.id === 'starter') as Course;
const tagalog = FIL_COURSES.starter;

describe('localizationReport', () => {
  test('a course with no translation is English: every lesson missing and every sentence of its narration English', () => {
    const report = localizationReport([english], {}, 'fil');
    expect(report.courses[0].status).toBe('english');
    expect(report.totals.lessonsMissing).toBe(english.lessons.length);
    for (const lesson of report.courses[0].lessons) expect(lesson.englishNarration).toBe(lesson.narration);
    expect(report.totals.wordsWaiting).toBe(report.totals.words);
  });

  test('a clean translation is full, with no lesson missing and nothing read in English', () => {
    const report = localizationReport([english], { starter: tagalog }, 'fil');
    expect(report.courses[0].status).toBe('full');
    expect(report.courses[0].title).toBe(tagalog.title);
    expect(report.totals.lessonsMissing).toBe(0);
    expect(report.totals.lessonsWithEnglishNarration).toBe(0);
  });

  test('a translation with a paragraph left in English is partial, and the lesson says how much of its narration is English', () => {
    const lesson = structuredClone(tagalog.lessons[0]);
    const at = lesson.body.findIndex((block) => block.type === 'paragraph' && !block.audience);
    lesson.body[at] = { type: 'paragraph', text: 'This paragraph was left in English and you can hear that the voice reads it in English for the learner.' };
    const report = localizationReport([english], { starter: { ...tagalog, lessons: [lesson, ...tagalog.lessons.slice(1)] } }, 'fil');
    expect(report.courses[0].status).toBe('partial');
    expect(report.courses[0].lessons[0].textProblems).toBeGreaterThan(0);
    expect(report.courses[0].lessons[0].englishNarration).toBeGreaterThan(0);
  });

  test('the whole catalog adds up', () => {
    const report = localizationReport(COURSES, FIL_COURSES, 'fil');
    expect(report.totals.courses).toBe(COURSES.length);
    expect(report.totals.full + report.totals.partial + report.totals.english).toBe(COURSES.length);
    expect(report.totals.lessons).toBe(COURSES.reduce((sum, course) => sum + course.lessons.length, 0));
  });
});
