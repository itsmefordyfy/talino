import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks one module of Programming Fundamentals while it is being written (its lessons live in `courses/programming-fundamentals/module-NN.ts`):
 * `CHECK_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/check-module`. The module's lessons are placed at their real days in a
 * course whose other lessons are stubs, and only the problems that name this module's lessons are reported; the whole-course checks run in
 * `check-one` once every module exists.
 */
const number = process.env.CHECK_MODULE;
const run = number ? describe : describe.skip;

run(`programming-fundamentals module ${number ?? '(none named)'}`, () => {
  test('follows every lesson rule', () => {
    const syllabus = getSyllabus('programming-fundamentals')!;
    const index = Number(number) - 1;
    const first = (syllabus.modules ?? []).slice(0, index).reduce((sum, module) => sum + module.topics.length, 0);
    const count = syllabus.modules?.[index]?.topics.length ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require(`./courses/programming-fundamentals/module-${String(number).padStart(2, '0')}`) as { lessons: Lesson[]; project: Project | null };
    expect(loaded.lessons).toHaveLength(count);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const skills = (require('./courses/programming-fundamentals/skills') as { SKILLS: Course['skills'] }).SKILLS;
    const stub = (position: number): Lesson => ({
      id: `programming-fundamentals-${String(position + 1).padStart(2, '0')}`,
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
      ? Array.from({ length: ordinal }, (_, position) => (position === ordinal - 1 ? loaded.project! : { id: `programming-fundamentals-p${position + 1}`, title: 'stub', summary: 'stub', outcome: 'stub', unlockAfterDay: 1, steps: [], submission: { kind: 'text', label: 'x', placeholder: 'x', hint: 'x' }, rubric: [] }))
      : [];
    const course: Course = {
      id: 'programming-fundamentals',
      kind: 'standard',
      title: syllabus.title,
      level: 'beginner',
      tagline: 'A tagline that is long enough to pass',
      description: 'A description long enough to pass the length check of the course rules for the course page.',
      finishLine: ['one', 'two'],
      objectives: ['Explain what a program is', 'Write steps in order', 'Read simple code'],
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
  });
});
