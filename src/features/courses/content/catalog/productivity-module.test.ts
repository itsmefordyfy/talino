import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import type { Activity } from '../../../activities/types';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks Time Management and Productivity while it is written and once it is whole (lessons live in `courses/time-management-productivity/module-NN.ts`):
 *   CHECK_PROD_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/productivity-module     (one module, others stubbed)
 * With no variable the whole course runs, but only once every module has lessons. A module is checked for the shared lesson rules (`standardCourseProblems`), the
 * lesson parts below, the AI practice it must hold, and the interactive tools it must use (the matrix, the day planner, the timer, the prompt playground).
 */
const COURSE = 'time-management-productivity';
const HEADINGS = { situation: 'A real situation', concept: 'How it works', examples: 'Weak and strong examples', demo: 'AI in Action', ai: 'Try it with AI', next: 'Next steps' };

/** What each module must hold: the tools it teaches with, the graded planning activities, and the AI practice items (role-plays and message tasks). */
export const MODULE_REQUIREMENTS: Record<number, { visuals?: string[]; prioritize?: number; schedule?: number; practice?: number; project?: boolean }> = {
  1: { schedule: 1 },
  2: { visuals: ['ai-prompt-playground'] },
  3: { visuals: ['eisenhower-matrix'], prioritize: 2, practice: 1 },
  4: { visuals: ['daily-schedule-builder'], schedule: 2, practice: 1 },
  5: { visuals: ['pomodoro-timer'], practice: 1 },
  6: { visuals: ['pomodoro-timer'], schedule: 1, practice: 1 },
  7: { project: true },
  8: { visuals: ['ai-prompt-playground'], practice: 3, project: true },
  9: { prioritize: 1, schedule: 2, practice: 2, project: true },
  10: { visuals: ['ai-prompt-playground'], schedule: 1, practice: 1 },
};

const activitiesOf = (lessons: Lesson[]): Activity[] => lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity] : [])));

export function shapeProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  const at = (text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  const index = { situation: at(HEADINGS.situation), concept: at(HEADINGS.concept), examples: at(HEADINGS.examples), demo: at(HEADINGS.demo), ai: at(HEADINGS.ai), next: at(HEADINGS.next) };
  for (const key of Object.keys(HEADINGS) as (keyof typeof HEADINGS)[]) if (index[key] < 0) problems.push(`missing the heading "${HEADINGS[key]}"`);
  const order: (keyof typeof HEADINGS)[] = ['situation', 'concept', 'examples', 'demo', 'ai', 'next'];
  for (let i = 1; i < order.length; i += 1) {
    const before = index[order[i - 1]!];
    const after = index[order[i]!];
    if (before >= 0 && after >= 0 && after < before) problems.push(`"${HEADINGS[order[i]!]}" must come after "${HEADINGS[order[i - 1]!]}"`);
  }
  if (index.demo >= 0) {
    const slice = lesson.body.slice(index.demo, index.ai >= 0 ? index.ai : undefined);
    const mentions = slice.some((block) => ('text' in block && /illustration/i.test(block.text)) || (block.type === 'details' && (/illustration/i.test(block.summary) || block.body.some((line) => /illustration/i.test(line)))));
    if (!mentions) problems.push('"AI in Action" must say it is an illustration written by hand, not a live AI output');
  }
  if (index.ai >= 0 && !lesson.body.slice(index.ai).some((block) => block.type === 'prompt')) problems.push('"Try it with AI" needs a prompt block the learner can copy');
  if (index.next >= 0 && !lesson.body.slice(index.next).some((block) => block.type === 'list')) problems.push('"Next steps" needs a list of steps');
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  else if (index.next >= 0 && takeaways < index.next) problems.push('the takeaways must come last, after "Next steps"');
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a visual or a table');
  const kinds = new Set(activitiesOf([lesson]).map((activity) => activity.kind));
  if (kinds.size < 2) problems.push(`needs at least two activities of different kinds, has ${kinds.size} kind(s)`);
  if (lesson.body.some((block) => block.type === 'code')) problems.push('a productivity lesson has no code blocks');
  if (lesson.body.some((block) => block.type === 'version')) problems.push('no version notes: nothing here states a product fact (prices, plans, button tours)');
  if (lesson.minutes < 10 || lesson.minutes > 25) problems.push('minutes should be 10 to 25');
  return problems;
}

/** Every roleplay or message-review names a scenario or task of the right kind in the practice catalog. */
export function practiceProblems(lessons: Lesson[]): string[] {
  const problems: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { findPracticeItem } = require('../../../practice/catalog') as typeof import('../../../practice/catalog');
  for (const lesson of lessons) {
    for (const activity of activitiesOf([lesson])) {
      if (activity.kind !== 'roleplay' && activity.kind !== 'message-review') continue;
      const id = activity.kind === 'roleplay' ? activity.scenarioId : activity.taskId;
      const item = findPracticeItem(id);
      if (!item) problems.push(`${lesson.id}: ${activity.id} names ${id}, which is not in practice/scenarios/productivity`);
      else if (!id.startsWith('prod-')) problems.push(`${lesson.id}: ${id} should start with prod-`);
      else if (item.kind !== (activity.kind === 'roleplay' ? 'roleplay' : 'message')) problems.push(`${lesson.id}: ${activity.id} (${activity.kind}) names ${id}, which is a ${item.kind}`);
    }
  }
  return problems;
}

/** What the module must contain (tools, graded planning, AI practice, a project). */
export function requirementProblems(module: number, lessons: Lesson[], project: Project | null): string[] {
  const need = MODULE_REQUIREMENTS[module] ?? {};
  const problems: string[] = [];
  const visuals = new Set(lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'visual' ? [block.id] : []))));
  for (const id of need.visuals ?? []) if (!visuals.has(id)) problems.push(`module ${module} must use the visual ${id}`);
  const planning = activitiesOf(lessons).filter((activity) => activity.kind === 'planning');
  const count = (mode: string) => planning.filter((activity) => activity.kind === 'planning' && activity.challenge.mode === mode).length;
  if (count('prioritize') < (need.prioritize ?? 0)) problems.push(`module ${module} needs at least ${need.prioritize} planning (prioritize) activities, has ${count('prioritize')}`);
  if (count('schedule') < (need.schedule ?? 0)) problems.push(`module ${module} needs at least ${need.schedule} planning (schedule) activities, has ${count('schedule')}`);
  const practice = activitiesOf(lessons).filter((activity) => activity.kind === 'roleplay' || activity.kind === 'message-review').length;
  if (practice < (need.practice ?? 0)) problems.push(`module ${module} needs at least ${need.practice} role-play or message-review activities, has ${practice}`);
  if (need.project && !project) problems.push(`module ${module} must have a project`);
  if (!need.project && project) problems.push(`module ${module} has a project it should not have`);
  return problems;
}

const moduleNumber = process.env.CHECK_PROD_MODULE;

/** The module's lessons placed at their real days in a course whose other lessons are stubs. */
function courseWithModule(index: number): { course: Course; mine: string[]; lessons: Lesson[]; project: Project | null } {
  const syllabus = getSyllabus(COURSE)!;
  const first = (syllabus.modules ?? []).slice(0, index).reduce((sum, module) => sum + module.topics.length, 0);
  const count = syllabus.modules?.[index]?.topics.length ?? 0;
  const pad = String(index + 1).padStart(2, '0');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const loaded = require(`./courses/${COURSE}/module-${pad}`) as { lessons: Lesson[]; project: Project | null };
  expect(loaded.lessons).toHaveLength(count);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const skills = (require(`./courses/${COURSE}/skills`) as { SKILLS: Course['skills'] }).SKILLS;
  const stub = (position: number): Lesson => ({ id: `${COURSE}-${String(position + 1).padStart(2, '0')}`, day: position + 1, title: syllabus.topics[position]!, summary: 'stub', minutes: 10, skills: [], body: [], quiz: [], task: { title: 'stub', steps: [], minutes: 5 } });
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
    objectives: ['Explain what a priority is', 'Compare two plans', 'Choose a schedule'],
    audiences: ['career-changer'],
    skills,
    lessons,
    projects,
    icon: 'schedule',
    updated: '2026-11-17',
  };
  return { course, mine: [...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])], lessons: loaded.lessons, project: loaded.project };
}

if (moduleNumber) {
  describe(`${COURSE} module ${moduleNumber}`, () => {
    test('follows every lesson rule, has the lesson parts, the tools and the AI practice it needs', () => {
      const index = Number(moduleNumber) - 1;
      const { course, mine, lessons, project } = courseWithModule(index);
      const problems = standardCourseProblems(course).filter((problem) => mine.some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
      const shape = lessons.flatMap((lesson) => shapeProblems(lesson).map((problem) => `${lesson.id}: ${problem}`));
      expect([...problems, ...shape, ...practiceProblems(lessons), ...requirementProblems(Number(moduleNumber), lessons, project)]).toEqual([]);
    });
  });
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { timeManagementProductivityCourse: course } = require(`./courses/${COURSE}`) as { timeManagementProductivityCourse: Course };
  const whole = course.lessons.length === getSyllabus(COURSE)!.topics.length;
  (whole ? describe : describe.skip)(`${COURSE} (the whole course)`, () => {
    test('meets every course rule', () => {
      expect(standardCourseProblems(course)).toEqual([]);
    });
    test('every lesson has the lesson parts', () => {
      expect(course.lessons.flatMap((lesson) => shapeProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
    });
    test('every role-play and message review names a real practice item', () => {
      expect(practiceProblems(course.lessons)).toEqual([]);
    });
    test('every module holds its tools, planning activities, AI practice and project', () => {
      const syllabus = getSyllabus(COURSE)!;
      const problems: string[] = [];
      let first = 0;
      (syllabus.modules ?? []).forEach((module, index) => {
        const lessons = course.lessons.slice(first, first + module.topics.length);
        const last = lessons[lessons.length - 1]!;
        const project = course.projects.find((candidate) => candidate.unlockAfterDay === last.day) ?? null;
        problems.push(...requirementProblems(index + 1, lessons, project));
        first += module.topics.length;
      });
      expect(problems).toEqual([]);
    });
    test('the lessons total about 8 to 12 hours', () => {
      const hours = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) / 60;
      expect(hours).toBeGreaterThanOrEqual(8);
      expect(hours).toBeLessThanOrEqual(12);
    });
  });
  test('the course skeleton is wired', () => {
    expect(course.id).toBe(COURSE);
    expect(course.modules).toHaveLength(10);
    expect(getSyllabus(COURSE)!.topics).toHaveLength(43);
  });
}
