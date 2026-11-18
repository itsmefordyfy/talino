import { describe, expect, test } from '@jest/globals';

import { standardCourseProblems } from '../../lib/standard-rules';
import type { Activity } from '../../../activities/types';
import { EXPERIENCE_LEVELS, inAudience } from '../levels';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks AI Automation for Business and Everyday Work while it is written and once it is whole (lessons live in `courses/ai-automation-business/module-NN.ts`):
 *   CHECK_AUTO_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/ai-automation-module     (one module, others stubbed)
 * With no variable the whole course runs, but only once every module has lessons. Modules 1 to 10 are checked for the shared lesson rules (`standardCourseProblems`),
 * the lesson parts below, the diagrams and workflow-builder activities each must hold, and its project; module 11 for its assessment parts and the project lesson.
 */
const COURSE = 'ai-automation-business';
const HEADINGS = { situation: 'A real situation', concept: 'How it works', example: 'Worked example', demo: 'AI in Action', ai: 'Try it yourself', next: 'Next steps' };
/** The last lessons of the course: five assessment parts (days 78 to 82) and the final project guide (day 83). */
export const ASSESSMENT_DAYS = [78, 79, 80, 81, 82];
export const PROJECT_LESSON_DAY = 83;
const PROJECT_HEADINGS = ['Choose your problem', 'Document your workflow', 'Show it with a diagram', 'Check your design', 'If you cannot use a paid platform'];

/** What each module must hold: diagram blocks, workflow-builder activities (rule-checked, in `features/activities`) and a project. */
export const MODULE_REQUIREMENTS: Record<number, { diagrams: number; workflowBuilders: number; project: boolean }> = {
  1: { diagrams: 3, workflowBuilders: 1, project: false },
  2: { diagrams: 3, workflowBuilders: 2, project: false },
  3: { diagrams: 2, workflowBuilders: 2, project: true },
  4: { diagrams: 2, workflowBuilders: 2, project: true },
  5: { diagrams: 2, workflowBuilders: 2, project: true },
  6: { diagrams: 2, workflowBuilders: 2, project: true },
  7: { diagrams: 3, workflowBuilders: 1, project: false },
  8: { diagrams: 4, workflowBuilders: 3, project: true },
  9: { diagrams: 2, workflowBuilders: 2, project: true },
  10: { diagrams: 2, workflowBuilders: 2, project: false },
  11: { diagrams: 1, workflowBuilders: 1, project: true },
};

const activitiesOf = (lessons: Lesson[]): Activity[] => lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity] : [])));
const headingIndex = (lesson: Lesson, text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);

/** The shape of a teaching lesson (days 1 to 77). */
export function teachingShapeProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  const index = { situation: headingIndex(lesson, HEADINGS.situation), concept: headingIndex(lesson, HEADINGS.concept), example: headingIndex(lesson, HEADINGS.example), demo: headingIndex(lesson, HEADINGS.demo), ai: headingIndex(lesson, HEADINGS.ai), next: headingIndex(lesson, HEADINGS.next) };
  for (const key of Object.keys(HEADINGS) as (keyof typeof HEADINGS)[]) if (index[key] < 0) problems.push(`missing the heading "${HEADINGS[key]}"`);
  const order: (keyof typeof HEADINGS)[] = ['situation', 'concept', 'example', 'demo', 'ai', 'next'];
  for (let i = 1; i < order.length; i += 1) {
    const before = index[order[i - 1]!];
    const after = index[order[i]!];
    if (before >= 0 && after >= 0 && after < before) problems.push(`"${HEADINGS[order[i]!]}" must come after "${HEADINGS[order[i - 1]!]}"`);
  }
  // "AI in Action" is a hand-written illustration: a `demo` block (always badged Illustration by the app), or text that says so.
  if (index.demo >= 0) {
    const slice = lesson.body.slice(index.demo, index.ai >= 0 ? index.ai : undefined);
    if (!slice.some((block) => block.type === 'demo')) problems.push('"AI in Action" needs a demo block (prompt, an illustrated answer, what to notice)');
  }
  if (index.example >= 0) {
    const slice = lesson.body.slice(index.example, index.demo >= 0 ? index.demo : undefined);
    if (!slice.some((block) => block.type === 'list' || block.type === 'code' || block.type === 'table' || block.type === 'diagram')) problems.push('"Worked example" needs its sample input or its steps (a list, a code block of sample data, a table or a diagram)');
  }
  if (index.ai >= 0 && !lesson.body.slice(index.ai).some((block) => block.type === 'prompt')) problems.push('"Try it yourself" needs a prompt block the learner can copy');
  if (index.next >= 0 && !lesson.body.slice(index.next).some((block) => block.type === 'list')) problems.push('"Next steps" needs a list of steps');
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  else if (index.next >= 0 && takeaways < index.next) problems.push('the takeaways must come last, after "Next steps"');
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a visual or a table');
  const kinds = new Set(activitiesOf([lesson]).map((activity) => activity.kind));
  if (kinds.size < 1) problems.push('needs at least one activity');
  if (lesson.body.some((block) => block.type === 'version')) problems.push('no version notes: nothing here states a product fact (prices, plans, button tours)');
  const forbidden = activitiesOf([lesson]).filter((activity) => ['predict-output', 'fix-bug', 'code-challenge', 'sql-challenge', 'roleplay', 'message-review', 'prompt-lab', 'planning'].includes(activity.kind));
  if (forbidden.length > 0) problems.push(`activity kind not used in this course: ${forbidden.map((activity) => activity.kind).join(', ')}`);
  if (lesson.minutes < 10 || lesson.minutes > 16) problems.push('minutes should be 10 to 16');
  return problems;
}

/** An assessment part: a recap that teaches, an activity, and questions so that every level answers exactly five (3 shared, 2 for the level). */
export function assessmentShapeProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  if (headingIndex(lesson, 'What this part covers') < 0) problems.push('missing the heading "What this part covers"');
  if (!lesson.body.some((block) => block.type === 'table' || block.type === 'diagram')) problems.push('the recap needs a table or a diagram');
  if (!lesson.body.some((block) => block.type === 'activity')) problems.push('needs an activity');
  for (const level of EXPERIENCE_LEVELS) {
    const asked = lesson.quiz.filter((question) => inAudience(question.audience, level)).length;
    if (asked !== 5) problems.push(`${level} is asked ${asked} questions; an assessment part asks exactly 5`);
  }
  if (lesson.quiz.filter((question) => !question.audience).length !== 3) problems.push('an assessment part has exactly 3 shared questions');
  if (lesson.quiz.some((question) => question.choices.length !== 4)) problems.push('every assessment question has exactly four choices');
  if (lesson.minutes < 10 || lesson.minutes > 16) problems.push('minutes should be 10 to 16');
  return problems;
}

/** The final project lesson: guidance for documenting a workflow design, with the headings that structure it. */
export function projectLessonProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  for (const heading of PROJECT_HEADINGS) if (headingIndex(lesson, heading) < 0) problems.push(`missing the heading "${heading}"`);
  if (!lesson.body.some((block) => block.type === 'diagram')) problems.push('needs a diagram');
  if (!lesson.body.some((block) => block.type === 'prompt')) problems.push('needs a prompt block');
  if (!lesson.body.some((block) => block.type === 'activity')) problems.push('needs an activity');
  if (lesson.minutes < 10 || lesson.minutes > 30) problems.push('minutes should be 10 to 30');
  return problems;
}

export function shapeProblems(lesson: Lesson): string[] {
  if (ASSESSMENT_DAYS.includes(lesson.day)) return assessmentShapeProblems(lesson);
  if (lesson.day === PROJECT_LESSON_DAY) return projectLessonProblems(lesson);
  return teachingShapeProblems(lesson);
}

/** What the module must contain (diagrams, workflow builders, a project). */
export function requirementProblems(module: number, lessons: Lesson[], project: Project | null): string[] {
  const need = MODULE_REQUIREMENTS[module]!;
  const problems: string[] = [];
  const diagrams = lessons.reduce((sum, lesson) => sum + lesson.body.filter((block) => block.type === 'diagram').length, 0);
  if (diagrams < need.diagrams) problems.push(`module ${module} needs at least ${need.diagrams} diagram blocks, has ${diagrams}`);
  const builders = activitiesOf(lessons).filter((activity) => activity.kind === 'workflow-builder').length;
  if (builders < need.workflowBuilders) problems.push(`module ${module} needs at least ${need.workflowBuilders} workflow-builder activities, has ${builders}`);
  if (need.project && !project) problems.push(`module ${module} must have a project`);
  if (!need.project && project) problems.push(`module ${module} has a project it should not have`);
  return problems;
}

const moduleNumber = process.env.CHECK_AUTO_MODULE;

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
    objectives: ['Explain what a trigger is', 'Compare two workflows', 'Choose a platform'],
    audiences: ['career-changer'],
    skills,
    lessons,
    projects,
    icon: 'account_tree',
    updated: '2026-11-18',
  };
  return { course, mine: [...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])], lessons: loaded.lessons, project: loaded.project };
}

if (moduleNumber) {
  describe(`${COURSE} module ${moduleNumber}`, () => {
    test('follows every lesson rule, has the lesson parts, the diagrams and the workflow builders it needs', () => {
      const index = Number(moduleNumber) - 1;
      const { course, mine, lessons, project } = courseWithModule(index);
      const problems = standardCourseProblems(course).filter((problem) => mine.some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
      const shape = lessons.flatMap((lesson) => shapeProblems(lesson).map((problem) => `${lesson.id}: ${problem}`));
      expect([...problems, ...shape, ...requirementProblems(Number(moduleNumber), lessons, project)]).toEqual([]);
    });
  });
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { aiAutomationBusinessCourse: course } = require(`./courses/${COURSE}`) as { aiAutomationBusinessCourse: Course };
  const whole = course.lessons.length === getSyllabus(COURSE)!.topics.length;
  (whole ? describe : describe.skip)(`${COURSE} (the whole course)`, () => {
    test('meets every course rule', () => {
      expect(standardCourseProblems(course)).toEqual([]);
    });
    test('every lesson has its parts', () => {
      expect(course.lessons.flatMap((lesson) => shapeProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
    });
    test('every module holds its diagrams, workflow builders and project', () => {
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
    test('the final assessment is 25 questions per learner, five in each of five parts', () => {
      const parts = course.lessons.filter((lesson) => ASSESSMENT_DAYS.includes(lesson.day));
      expect(parts).toHaveLength(5);
      for (const level of EXPERIENCE_LEVELS) {
        expect(parts.reduce((sum, lesson) => sum + lesson.quiz.filter((question) => inAudience(question.audience, level)).length, 0)).toBe(25);
      }
    });
    test('the lessons total about 12 to 20 hours', () => {
      const hours = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) / 60;
      expect(hours).toBeGreaterThanOrEqual(12);
      expect(hours).toBeLessThanOrEqual(20);
    });
  });
  test('the course skeleton is wired', () => {
    expect(course.id).toBe(COURSE);
    expect(course.modules).toHaveLength(11);
    expect(getSyllabus(COURSE)!.topics).toHaveLength(83);
  });
}
