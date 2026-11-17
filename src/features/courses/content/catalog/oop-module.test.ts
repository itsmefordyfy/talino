import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import { COURSES } from '../index';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Object-Oriented Programming (`object-oriented-programming`, docs/content/OOP_BRIEF.md). While a module is being written its lessons live in
 * `courses/object-oriented-programming/module-NN.ts`: `CHECK_OOP_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/oop-module`
 * places them at their real days in a course whose other lessons are stubs and reports only the problems that name this module's lessons, plus
 * the lesson-shape problems below. Once the course is registered the same shape check runs over every lesson and the module and project
 * counts are compared with the syllabus.
 */
const COURSE_ID = 'object-oriented-programming';
const HEADINGS = {
  analogy: 'A real-world picture',
  concept: 'How it works',
  code: 'See it in code',
  walkCode: 'Walk through the code',
  walkExample: 'Walk through an example',
  ai: 'Try it with AI',
};

/** The lesson shape of the OOP brief: the same ten parts as Programming Fundamentals, with code in every lesson that teaches an implementation. */
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

const number = process.env.CHECK_OOP_MODULE;
(number ? describe : describe.skip)(`${COURSE_ID} module ${number ?? '(none named)'}`, () => {
  test('follows every lesson rule and the lesson shape', () => {
    const syllabus = getSyllabus(COURSE_ID)!;
    const index = Number(number) - 1;
    const first = (syllabus.modules ?? []).slice(0, index).reduce((sum, module) => sum + module.topics.length, 0);
    const count = syllabus.modules?.[index]?.topics.length ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require(`./courses/${COURSE_ID}/module-${String(number).padStart(2, '0')}`) as { lessons: Lesson[]; project: Project | null };
    expect(loaded.lessons).toHaveLength(count);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const skills = (require(`./courses/${COURSE_ID}/skills`) as { SKILLS: Course['skills'] }).SKILLS;
    const stub = (position: number): Lesson => ({
      id: `${COURSE_ID}-${String(position + 1).padStart(2, '0')}`,
      day: position + 1,
      title: syllabus.topics[position]!,
      summary: 'stub',
      minutes: 10,
      skills: [],
      body: [],
      quiz: [],
      task: { title: 'stub', steps: [], minutes: 5 },
    });
    const lessons = syllabus.topics.map((_, position) => (position >= first && position < first + count ? loaded.lessons[position - first]! : stub(position)));
    const ordinal = loaded.project ? Number(/-p(\d+)$/.exec(loaded.project.id)?.[1] ?? 0) : 0;
    const projects: Project[] = loaded.project
      ? Array.from({ length: ordinal }, (_, position) => (position === ordinal - 1 ? loaded.project! : { id: `${COURSE_ID}-p${position + 1}`, title: 'stub', summary: 'stub', outcome: 'stub', unlockAfterDay: 1, steps: [], submission: { kind: 'text', label: 'x', placeholder: 'x', hint: 'x' }, rubric: [] }))
      : [];
    const course: Course = {
      id: COURSE_ID,
      kind: 'standard',
      title: syllabus.title,
      level: 'intermediate',
      tagline: 'A tagline that is long enough to pass',
      description: 'A description long enough to pass the length check of the course rules for the course page.',
      finishLine: ['one', 'two'],
      objectives: ['Explain what a class is', 'Write a class', 'Read object-oriented code'],
      audiences: ['career-changer'],
      skills,
      lessons,
      projects,
      icon: 'code',
      updated: '2026-11-16',
    };
    const mine = new Set([...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])]);
    const problems = standardCourseProblems(course).filter((problem) => [...mine].some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
    expect(problems).toEqual([]);
    expect(loaded.lessons.flatMap((lesson) => structureProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
  });
});

const registered = COURSES.find((entry) => entry.id === COURSE_ID);
(registered ? describe : describe.skip)(`${COURSE_ID} as registered`, () => {
  test('every lesson has the ten parts', () => {
    expect(registered!.lessons.flatMap((lesson) => structureProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
  });
  test('the modules, lessons and projects agree with the syllabus', () => {
    const syllabus = getSyllabus(COURSE_ID)!;
    expect(registered!.lessons.map((lesson) => lesson.title)).toEqual(syllabus.topics);
    expect(registered!.modules).toHaveLength(14);
    expect(registered!.projects).toHaveLength(12);
  });
  test('the learner is asked to explain, and AI is a partner', () => {
    expect(JSON.stringify(registered!.projects)).toMatch(/explain/i);
  });
});
