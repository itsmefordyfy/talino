import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../index';
import type { Lesson } from '../types';
import { lessonScript } from '../../lib/plain-text';

/**
 * A length report for the OOP course while its lessons are being trimmed: `OOP_LENGTH=1 npx jest --no-watchman .../oop-length` prints, per lesson,
 * the words Listen would speak (`lessonScript`: what a learner hears, and what a Kokoro recording costs). `OOP_LENGTH_MAX=900` makes it fail for
 * any lesson over that many spoken words, and `OOP_LENGTH_MODULE=4` narrows the report to one module's days.
 */
const COURSE_ID = 'object-oriented-programming';
const spoken = (lesson: Lesson) => {
  const script = lessonScript(lesson);
  return (typeof script === 'string' ? script : JSON.stringify(script)).split(/\s+/).filter(Boolean).length;
};

(process.env.OOP_LENGTH ? describe : describe.skip)(`${COURSE_ID} length`, () => {
  test('spoken words per lesson', () => {
    const course = COURSES.find((entry) => entry.id === COURSE_ID)!;
    const module = process.env.OOP_LENGTH_MODULE ? course.modules?.[Number(process.env.OOP_LENGTH_MODULE) - 1] : undefined;
    const lessons = course.lessons.filter((lesson) => !module || (lesson.day >= module.firstDay && lesson.day <= module.lastDay));
    const rows = lessons.map((lesson) => ({ id: lesson.id, day: lesson.day, words: spoken(lesson) }));
    const total = rows.reduce((sum, row) => sum + row.words, 0);
    console.log(`${rows.map((row) => `${row.day}:${row.words}`).join(' ')}\ntotal ${total} words, ${Math.round(total / lessons.length)} per lesson`);
    const max = Number(process.env.OOP_LENGTH_MAX ?? 0);
    if (max) expect(rows.filter((row) => row.words > max).map((row) => `${row.id} (${row.words})`)).toEqual([]);
  });
});
