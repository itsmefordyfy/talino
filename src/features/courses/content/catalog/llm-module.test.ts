import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import { EXPERIENCE_LEVELS, inAudience } from '../levels';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks one module of How Large Language Models Work while it is written (its lessons live in `courses/how-llms-work/module-NN.ts`):
 * `CHECK_LLM_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/llm-module`. The module's lessons are placed at their real days in a course whose other lessons
 * are stubs, and only the problems that name this module's lessons are reported, plus the lesson shape. The whole-course checks run in `check-one` once every module exists.
 *
 * Modules 1 to 10 teach: opening paragraph, "A real situation", "How it works" (with a diagram, a visual or a table), "A worked example", "In the real world", a block that separates
 * what is established from what varies between models, takeaways, then activities, quiz and task. Module 11 is the review, the five-part assessment (25 questions) and the challenge.
 * No code anywhere (the course needs no programming).
 */
const COURSE = 'how-llms-work';
const HEADINGS = { situation: 'A real situation', concept: 'How it works', example: 'A worked example', world: 'In the real world', further: 'Go further' };
/** The assessment lessons of module 11 (days 71 to 75): five questions each, 25 in all, the same five for every learner level. */
export const ASSESSMENT_DAYS = [71, 72, 73, 74, 75] as const;

export function shapeProblems(lesson: Lesson, day: number): string[] {
  const problems: string[] = [];
  const kinds = new Set(lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity.kind] : [])));
  for (const block of lesson.body) if (block.type === 'code') problems.push('no code blocks: this course needs no programming');
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  if (day >= 70) {
    // Module 11: the review, the assessment parts, the challenge and the reflection have their own shape (rules below), not the teaching shape.
    if ((ASSESSMENT_DAYS as readonly number[]).includes(day)) {
      for (const level of EXPERIENCE_LEVELS) {
        const asked = lesson.quiz.filter((question) => inAudience(question.audience, level)).length;
        if (asked !== 5) problems.push(`assessment part: ${level} is asked ${asked} questions, must be exactly 5 (25 over the five parts)`);
      }
      for (const question of lesson.quiz) if (question.choices.length !== 4) problems.push(`${question.id}: assessment questions have exactly four choices`);
    }
    if (kinds.size < 1) problems.push('needs at least one activity');
    return problems;
  }
  const at = (text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);
  const [situation, concept, example, world, further] = [at(HEADINGS.situation), at(HEADINGS.concept), at(HEADINGS.example), at(HEADINGS.world), at(HEADINGS.further)];
  for (const [key, index] of [['situation', situation], ['concept', concept], ['example', example], ['world', world]] as const) if (index < 0) problems.push(`missing the heading "${HEADINGS[key]}"`);
  const order = [situation, concept, example, world];
  if (order.every((index) => index >= 0) && order.some((index, position) => position > 0 && index < order[position - 1]!)) problems.push('the headings must run: A real situation, How it works, A worked example, In the real world');
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a visual or a table');
  if (concept >= 0 && !lesson.body.some((block, index) => index > concept && (block.type === 'diagram' || block.type === 'visual' || block.type === 'table') && (world < 0 || index < world))) problems.push('the diagram, visual or table belongs under "How it works" or "A worked example"');
  // Established principles versus details that vary between models (owner's content standard).
  if (!lesson.body.some((block) => block.type === 'details' && /varies|vary|differ|depends|settled|established/i.test(block.summary))) problems.push('needs a "details" block (summary mentions what is established and what varies between models)');
  if (takeaways >= 0 && world >= 0 && takeaways < world) problems.push('the takeaways must come after "In the real world"');
  if (further >= 0 && takeaways >= 0 && further < takeaways) problems.push('"Go further" is the last part: it comes after the takeaways');
  if (kinds.size < 2) problems.push(`needs at least two activities of different kinds, has ${kinds.size} kind(s)`);
  return problems;
}

const number = process.env.CHECK_LLM_MODULE;
const run = number ? describe : describe.skip;

run(`${COURSE} module ${number ?? '(none named)'}`, () => {
  test('follows every lesson rule and has the lesson parts', () => {
    const syllabus = getSyllabus(COURSE)!;
    const index = Number(number) - 1;
    const first = (syllabus.modules ?? []).slice(0, index).reduce((sum, module) => sum + module.topics.length, 0);
    const count = syllabus.modules?.[index]?.topics.length ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require(`./courses/${COURSE}/module-${String(number).padStart(2, '0')}`) as { lessons: Lesson[]; project: Project | null };
    expect(loaded.lessons).toHaveLength(count);
    expect(loaded.lessons.map((lesson) => lesson.id)).toEqual(loaded.lessons.map((_, i) => `${COURSE}-${String(first + i + 1).padStart(2, '0')}`));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const skills = (require(`./courses/${COURSE}/skills`) as { SKILLS: Course['skills'] }).SKILLS;
    const stub = (position: number): Lesson => ({
      id: `${COURSE}-${String(position + 1).padStart(2, '0')}`,
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
    const projects: Project[] = loaded.project ? [loaded.project] : [];
    const course: Course = {
      id: COURSE,
      kind: 'standard',
      title: syllabus.title,
      level: 'intermediate',
      tagline: 'A tagline that is long enough to pass',
      description: 'A description long enough to pass the length check of the course rules for the course page.',
      finishLine: ['one', 'two'],
      objectives: ['Explain what an LLM is', 'Compare two ideas', 'Choose a method'],
      audiences: ['career-changer'],
      skills,
      lessons,
      projects,
      icon: 'psychology',
      updated: '2026-11-18',
    };
    const mine = new Set([...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])]);
    const problems = standardCourseProblems(course).filter((problem) => [...mine].some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
    const shape = loaded.lessons.flatMap((lesson) => shapeProblems(lesson, lesson.day).map((problem) => `${lesson.id}: ${problem}`));
    expect([...problems, ...shape]).toEqual([]);
  });
});
