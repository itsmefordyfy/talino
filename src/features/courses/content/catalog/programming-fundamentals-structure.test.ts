import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../index';
import type { Lesson } from '../types';
import { getSyllabus } from './syllabus';

/**
 * The owner's ten-part lesson shape for Programming Fundamentals (docs/content/PROGRAMMING_FUNDAMENTALS_BRIEF.md), on top of the catalog's own
 * rules: every lesson has the same headings in the same order, an AI-assisted exercise with a copyable prompt, at least two activities of
 * different kinds, a picture (diagram, visual or table), and a quiz.
 */
const HEADINGS = {
  analogy: 'A real-world picture',
  concept: 'How it works',
  code: 'See it in code',
  walkCode: 'Walk through the code',
  walkExample: 'Walk through an example',
  ai: 'Try it with AI',
};

export function structureProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  const at = (text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  const analogy = at(HEADINGS.analogy);
  const concept = at(HEADINGS.concept);
  const ai = at(HEADINGS.ai);
  const code = at(HEADINGS.code);
  const walkCode = at(HEADINGS.walkCode);
  const walkExample = at(HEADINGS.walkExample);
  if (analogy < 0) problems.push(`missing the heading "${HEADINGS.analogy}"`);
  if (concept < 0) problems.push(`missing the heading "${HEADINGS.concept}"`);
  if (ai < 0) problems.push(`missing the heading "${HEADINGS.ai}"`);
  const codeWalk = code >= 0 && walkCode > code;
  if (!codeWalk && walkExample < 0) problems.push(`needs "${HEADINGS.code}" then "${HEADINGS.walkCode}", or "${HEADINGS.walkExample}"`);
  if (analogy >= 0 && concept >= 0 && analogy > concept) problems.push('the analogy comes before "How it works"');
  const walk = codeWalk ? walkCode : walkExample;
  if (concept >= 0 && walk >= 0 && walk < concept) problems.push('the walkthrough comes after "How it works"');
  if (ai >= 0 && walk >= 0 && ai < walk) problems.push('"Try it with AI" comes after the walkthrough');
  if (ai >= 0 && !lesson.body.slice(ai).some((block) => block.type === 'prompt')) problems.push('"Try it with AI" needs a prompt block the learner can copy');
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  else if (ai >= 0 && takeaways < ai) problems.push('the takeaways must come after "Try it with AI"');
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a visual or a table');
  const kinds = new Set(lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity.kind] : [])));
  if (kinds.size < 2) problems.push(`needs at least two activities of different kinds, has ${kinds.size} kind(s)`);
  if (lesson.body.some((block) => block.type === 'code' && block.language === 'javascript') && !codeWalk) problems.push('JavaScript code needs "See it in code" then "Walk through the code"');
  return problems;
}

const module = process.env.CHECK_MODULE_STRUCTURE;
(module ? describe : describe.skip)(`programming-fundamentals module ${module ?? '(none named)'} structure`, () => {
  test('every lesson has the ten parts', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require(`./courses/programming-fundamentals/module-${String(module).padStart(2, '0')}`) as { lessons: Lesson[] };
    expect(loaded.lessons.flatMap((lesson) => structureProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
  });
});

const course = COURSES.find((entry) => entry.id === 'programming-fundamentals');
(course ? describe : describe.skip)('programming-fundamentals as registered', () => {
  test('every lesson has the ten parts', () => {
    expect(course!.lessons.flatMap((lesson) => structureProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
  });
  test('the modules and the lesson list agree with the syllabus', () => {
    const syllabus = getSyllabus('programming-fundamentals')!;
    expect(course!.lessons.map((lesson) => lesson.title)).toEqual(syllabus.topics);
    expect(course!.modules).toHaveLength(12);
    expect(course!.projects).toHaveLength(11);
  });
  test('the learner is asked to explain, and AI is a partner', () => {
    const text = JSON.stringify(course!.projects);
    expect(text).toMatch(/explain/i);
  });
});
