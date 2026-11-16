import { describe, expect, test } from '@jest/globals';

import type { Activity } from '../../activities/types';
import type { Lesson, LessonBlock } from '../content/types';
import { LESSON_STAGES, MIN_TEACHING_WORDS, lessonStructureProblems, splitLesson, teachingWords } from './lesson-structure';

const words = (count: number) => Array.from({ length: count }, (_, index) => `word${index}`).join(' ');
const activity = { id: 'x-01-a', kind: 'scenario' } as unknown as Activity;

const goodBody: LessonBlock[] = [
  { type: 'paragraph', text: words(120) },
  { type: 'heading', text: 'How it works' },
  { type: 'paragraph', text: words(100) },
  { type: 'code', language: 'js', code: 'const a = 1;' },
  { type: 'activity', activity },
  { type: 'paragraph', text: words(60) },
  { type: 'takeaways', items: ['One', 'Two', 'Three'] },
];

const lesson = (patch: Partial<Lesson> = {}): Lesson => ({
  id: 'x-01',
  day: 1,
  title: 'T',
  summary: 'S',
  minutes: 15,
  skills: ['a'],
  intro: { objectives: ['Explain the idea', 'Write one example'], why: 'It lets you ship work you can trust and explain to others.' },
  body: goodBody,
  quiz: [1, 2, 3].map((n) => ({ id: `x-01-q${n}`, prompt: 'P', choices: ['a', 'b', 'c'], answer: 0, explanation: 'Because that is what the lesson said earlier.' })),
  task: { title: 'Do', steps: ['one'], minutes: 10 },
  ...patch,
});

describe('splitLesson', () => {
  test('takes every activity out of the teaching, keeping the rest in order', () => {
    const { learn, activities } = splitLesson(goodBody);
    expect(activities).toEqual([activity]);
    expect(learn.map((block) => block.type)).toEqual(['paragraph', 'heading', 'paragraph', 'code', 'paragraph', 'takeaways']);
  });

  test('moves takeaways to the end of the teaching even when an author put something after them', () => {
    const { learn } = splitLesson([{ type: 'takeaways', items: ['a', 'b'] }, { type: 'paragraph', text: 'later' }]);
    expect(learn.map((block) => block.type)).toEqual(['paragraph', 'takeaways']);
  });
});

describe('teachingWords', () => {
  test('counts explanations, not prompts or activities', () => {
    expect(teachingWords([{ type: 'paragraph', text: 'one two three' }, { type: 'prompt', text: words(50) }, { type: 'activity', activity }])).toBe(3);
  });
  test('counts list items, tips, tables and details', () => {
    expect(teachingWords([{ type: 'list', items: ['a b', 'c'] }, { type: 'tip', text: 'd e' }, { type: 'details', summary: 'f', body: ['g h'] }, { type: 'table', headers: ['i'], rows: [['j k']] }])).toBe(3 + 2 + 3 + 2);
  });
});

describe('lessonStructureProblems', () => {
  test('a well-formed lesson has none', () => {
    expect(lessonStructureProblems(lesson())).toEqual([]);
  });

  test('requires an introduction with objectives and a reason', () => {
    expect(lessonStructureProblems(lesson({ intro: undefined }))).toContain('missing intro');
    expect(lessonStructureProblems(lesson({ intro: { objectives: ['Only one'], why: 'It lets you ship work you can trust.' } })).join()).toMatch(/objectives/);
    expect(lessonStructureProblems(lesson({ intro: { objectives: ['Explain a', 'Write b'], why: 'Short.' } })).join()).toMatch(/why/);
  });

  test('requires real teaching before any quiz or exercise', () => {
    const thin = lesson({ body: [{ type: 'paragraph', text: 'Short.' }, { type: 'activity', activity }, { type: 'takeaways', items: ['a', 'b'] }] });
    expect(lessonStructureProblems(thin).join()).toMatch(new RegExp(`${MIN_TEACHING_WORDS}`));
  });

  test('requires takeaways, and one set only', () => {
    const none = lesson({ body: goodBody.filter((block) => block.type !== 'takeaways') });
    expect(lessonStructureProblems(none)).toContain('missing takeaways');
    const two = lesson({ body: [...goodBody, { type: 'takeaways', items: ['a', 'b'] }] });
    expect(lessonStructureProblems(two)).toContain('more than one takeaways block');
  });

  test('the lesson opens with an explanation, not an exercise', () => {
    const cold = lesson({ body: [{ type: 'activity', activity }, ...goodBody.filter((block) => block.type !== 'activity')] });
    expect(lessonStructureProblems(cold)).toEqual([]); // drawn after the quiz anyway…
    expect(lessonStructureProblems(lesson({ body: [{ type: 'code', language: 'js', code: 'x' }, ...goodBody] }))).toContain('teaching must open with a paragraph');
  });

  test('every quiz answer is explained', () => {
    const bad = lesson({ quiz: [{ id: 'x-01-q1', prompt: 'P', choices: ['a', 'b', 'c'], answer: 0, explanation: '' }, ...lesson().quiz.slice(1)] });
    expect(lessonStructureProblems(bad).join()).toMatch(/explanation/);
  });
});

describe('stages', () => {
  test('teach, then check, then practise, then complete, in that order', () => {
    expect(LESSON_STAGES).toEqual(['learn', 'quiz', 'practice', 'complete']);
  });
});
