import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks one module of Finding International Clients while it is written (its lessons live in `courses/international-clients/module-NN.ts`):
 * `CHECK_INTL_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/intl-clients-module`. The module's lessons are placed at their real days in a
 * course whose other lessons are stubs, and only the problems that name this module's lessons are reported, plus the lesson shape and the AI practice.
 * The whole-course checks run in `check-one` once every module exists.
 */
const COURSE = 'international-clients';
const HEADINGS = { situation: 'A real situation', concept: 'How it works', steps: 'Practical steps', examples: 'Weak and strong examples', ai: 'AI in Action' };

export function shapeProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  const at = (text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  const situation = at(HEADINGS.situation);
  const concept = at(HEADINGS.concept);
  const steps = at(HEADINGS.steps);
  const examples = at(HEADINGS.examples);
  const ai = at(HEADINGS.ai);
  for (const [key, index] of [['situation', situation], ['concept', concept], ['steps', steps], ['examples', examples], ['ai', ai]] as const) if (index < 0) problems.push(`missing the heading "${HEADINGS[key]}"`);
  if (situation >= 0 && concept >= 0 && situation > concept) problems.push('"A real situation" comes before "How it works"');
  if (concept >= 0 && examples >= 0 && examples < concept) problems.push('"Weak and strong examples" comes after "How it works"');
  if (concept >= 0 && steps >= 0 && steps < concept) problems.push('"Practical steps" comes after "How it works"');
  if (steps >= 0 && !lesson.body.slice(steps, examples > steps ? examples : undefined).some((block) => block.type === 'list')) problems.push('"Practical steps" needs a list of steps');
  if (examples >= 0 && ai >= 0 && ai < examples) problems.push('"AI in Action" comes after the examples');
  if (ai >= 0 && !lesson.body.slice(ai).some((block) => block.type === 'prompt')) problems.push('"AI in Action" needs a prompt block the learner can copy');
  // The Prompt Playground part: why the prompt works, how to improve it, and an illustration of a helpful reply that says it is not a real model output.
  if (ai >= 0) {
    const after = lesson.body.slice(ai);
    const details = after.flatMap((block) => (block.type === 'details' ? [block.summary.trim().toLowerCase()] : []));
    if (!details.some((summary) => summary.startsWith('why this prompt works'))) problems.push('"AI in Action" needs a details block "Why this prompt works"');
    if (!details.some((summary) => summary.startsWith('how to make it better'))) problems.push('"AI in Action" needs a details block "How to make it better"');
    const illustration = after.find((block) => block.type === 'details' && /illustration/i.test(block.summary));
    if (!illustration) problems.push('"AI in Action" needs a details block whose title says it is an illustration (a helpful reply we wrote, not a real model output)');
    if (after.some((block) => block.type === 'paragraph' && /\b(chatgpt|gemini|claude)\b[^.]{0,40}\b(said|replied|answered|generated)\b/i.test(block.text))) problems.push('do not present an illustration as something a real AI said');
  }
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  else if (ai >= 0 && takeaways < ai) problems.push('the takeaways must come after "AI in Action"');
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a visual or a table');
  const kinds = new Set(lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity.kind] : [])));
  if (kinds.size < 2) problems.push(`needs at least two activities of different kinds, has ${kinds.size} kind(s)`);
  if (lesson.body.some((block) => block.type === 'code')) problems.push('a client-acquisition lesson has no code blocks');
  return problems;
}

/** Every module has at least one AI practice activity (role-play or message review), and each one names a scenario or task that exists. */
export function practiceProblems(lessons: Lesson[]): string[] {
  const problems: string[] = [];
  let found = 0;
  for (const lesson of lessons) {
    for (const block of lesson.body) {
      if (block.type !== 'activity') continue;
      const activity = block.activity;
      if (activity.kind !== 'roleplay' && activity.kind !== 'message-review') continue;
      found += 1;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { findPracticeItem } = require('../../../practice/catalog') as typeof import('../../../practice/catalog');
      const id = activity.kind === 'roleplay' ? activity.scenarioId : activity.taskId;
      const item = findPracticeItem(id);
      if (!item) problems.push(`${lesson.id}: ${activity.id} names ${id}, which is not in practice/scenarios`);
      else if (item.kind !== (activity.kind === 'roleplay' ? 'roleplay' : 'message')) problems.push(`${lesson.id}: ${activity.id} (${activity.kind}) names ${id}, which is a ${item.kind}`);
    }
  }
  if (found === 0) problems.push('the module has no roleplay or message-review activity');
  return problems;
}

const number = process.env.CHECK_INTL_MODULE;
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
    const ordinal = loaded.project ? Number(/-p(\d+)$/.exec(loaded.project.id)?.[1] ?? 0) : 0;
    const projects: Project[] = loaded.project
      ? Array.from({ length: ordinal }, (_, position) => (position === ordinal - 1 ? loaded.project! : { id: `${COURSE}-p${position + 1}`, title: 'stub', summary: 'stub', outcome: 'stub', unlockAfterDay: 1, steps: [], submission: { kind: 'text', label: 'x', placeholder: 'x', hint: 'x' }, rubric: [] }))
      : [];
    const course: Course = {
      id: COURSE,
      kind: 'standard',
      title: syllabus.title,
      level: 'beginner',
      tagline: 'A tagline that is long enough to pass',
      description: 'A description long enough to pass the length check of the course rules for the course page.',
      finishLine: ['one', 'two'],
      objectives: ['Explain what a data structure is', 'Compare two solutions', 'Choose a structure'],
      audiences: ['career-changer'],
      skills,
      lessons,
      projects,
      icon: 'code',
      updated: '2026-11-16',
    };
    const mine = new Set([...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])]);
    const problems = standardCourseProblems(course).filter((problem) => [...mine].some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
    const shape = loaded.lessons.flatMap((lesson) => shapeProblems(lesson).map((problem) => `${lesson.id}: ${problem}`));
    expect([...problems, ...shape, ...practiceProblems(loaded.lessons)]).toEqual([]);
  });
});
