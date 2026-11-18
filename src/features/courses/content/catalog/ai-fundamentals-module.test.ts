import { describe, expect, test } from '@jest/globals';

import { computeCourseProgress, quizPassed, type LessonRow, type ProjectRow } from '../../lib/progress';
import { standardCourseProblems } from '../../lib/standard-rules';
import { inAudience, EXPERIENCE_LEVELS } from '../levels';
import type { Activity } from '../../../activities/types';
import type { Course, Lesson, Project } from '../types';
import { getSyllabus } from './syllabus';

/**
 * Checks AI Fundamentals for Everyone while it is written and once it is whole (lessons live in `courses/ai-fundamentals-everyone/module-NN.ts`):
 *   CHECK_AIF_MODULE=3 npx jest --no-watchman src/features/courses/content/catalog/ai-fundamentals-module     (one module, others stubbed)
 * With no variable the whole course runs, but only once every module has lessons. Modules 1 to 7 are teaching lessons with a fixed shape; module 8 is the
 * final assessment (four lessons of five questions each for every learner = 20), the challenge, the reflection and the completion lesson.
 */
const COURSE = 'ai-fundamentals-everyone';
const HEADINGS = { everyday: 'In everyday life', concept: 'How it works', examples: 'Real-world examples', use: 'Putting it to use', ai: 'Try it with AI' };
const TEACHING_MODULES = [1, 2, 3, 4, 5, 6, 7];
/** Lesson days of the four assessment parts. Each learner, at every level, is asked exactly five questions in each: twenty in all. */
export const ASSESSMENT_DAYS = [37, 38, 39, 40];

const activitiesOf = (lessons: Lesson[]): Activity[] => lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity] : [])));
/** The kinds this course uses: the ones that need no code, no live model and no practice-catalog item. */
const ALLOWED_KINDS = new Set(['scenario', 'match', 'tap-reveal', 'arrange', 'fill-blank']);

export function shapeProblems(lesson: Lesson, teaching: boolean): string[] {
  const problems: string[] = [];
  if (lesson.body[0]?.type !== 'paragraph') problems.push('must open with a paragraph');
  if (lesson.body.some((block) => block.type === 'code')) problems.push('this course has no code blocks');
  if (lesson.body.some((block) => block.type === 'version')) problems.push('no version notes: name no plan, price or feature list; send the learner to the tool’s own page');
  const takeaways = lesson.body.findIndex((block) => block.type === 'takeaways');
  if (takeaways < 0) problems.push('no takeaways');
  const kinds = new Set(activitiesOf([lesson]).map((activity) => activity.kind));
  for (const kind of kinds) if (!ALLOWED_KINDS.has(kind)) problems.push(`activity kind ${kind} is not used in this course (use scenario, match, tap-reveal, arrange, fill-blank)`);
  if (!lesson.body.some((block) => block.type === 'diagram' || block.type === 'visual' || block.type === 'table')) problems.push('needs a diagram, a table or a visual');
  if (!teaching) return problems;

  const at = (text: string) => lesson.body.findIndex((block) => block.type === 'heading' && block.text.trim() === text);
  const index = { everyday: at(HEADINGS.everyday), concept: at(HEADINGS.concept), examples: at(HEADINGS.examples), use: at(HEADINGS.use), ai: at(HEADINGS.ai) };
  const order: (keyof typeof HEADINGS)[] = ['everyday', 'concept', 'examples', 'use', 'ai'];
  for (const key of order) if (index[key] < 0) problems.push(`missing the heading "${HEADINGS[key]}"`);
  for (let i = 1; i < order.length; i += 1) {
    const before = index[order[i - 1]!];
    const after = index[order[i]!];
    if (before >= 0 && after >= 0 && after < before) problems.push(`"${HEADINGS[order[i]!]}" must come after "${HEADINGS[order[i - 1]!]}"`);
  }
  if (index.ai >= 0 && !lesson.body.slice(index.ai).some((block) => block.type === 'prompt')) problems.push('"Try it with AI" needs a prompt block the learner can copy');
  if (takeaways >= 0 && index.ai >= 0 && takeaways < index.ai) problems.push('the takeaways must come last, after "Try it with AI"');
  if (kinds.size < 2) problems.push(`needs at least two activities of different kinds, has ${kinds.size} kind(s)`);
  if (lesson.minutes < 12 || lesson.minutes > 30) problems.push('minutes should be 12 to 30');
  return problems;
}

/** Each assessment part asks every learner exactly five questions, all with four choices and an explanation. */
export function assessmentProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  for (const level of EXPERIENCE_LEVELS) {
    const asked = lesson.quiz.filter((question) => inAudience(question.audience, level));
    if (asked.length !== 5) problems.push(`${level} would be asked ${asked.length} questions, the assessment part needs exactly 5`);
  }
  for (const question of lesson.quiz) {
    if (question.choices.length !== 4) problems.push(`${question.id} must have exactly four choices`);
    if (question.explanation.trim().length < 60) problems.push(`${question.id} needs a real explanation of why the answer is right`);
  }
  return problems;
}

export function projectProblems(module: number, project: Project | null): string[] {
  const needs = module === 5 || module === 8;
  if (needs && !project) return [`module ${module} must have a project`];
  if (!needs && project) return [`module ${module} has a project it should not have`];
  return [];
}

const moduleNumber = process.env.CHECK_AIF_MODULE;

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
    objectives: ['Explain what a model is', 'Compare two tools', 'Choose a safe habit'],
    audiences: ['career-changer'],
    skills,
    lessons,
    projects,
    icon: 'psychology',
    updated: '2026-11-18',
  };
  return { course, mine: [...loaded.lessons.map((lesson) => lesson.id), ...(loaded.project ? [loaded.project.id] : [])], lessons: loaded.lessons, project: loaded.project };
}

if (moduleNumber) {
  describe(`${COURSE} module ${moduleNumber}`, () => {
    test('follows every lesson rule and has the lesson parts', () => {
      const number = Number(moduleNumber);
      const { course, mine, lessons, project } = courseWithModule(number - 1);
      const problems = standardCourseProblems(course).filter((problem) => mine.some((id) => problem.includes(id)) || /quiz answers|longest choice/.test(problem));
      const shape = lessons.flatMap((lesson) => shapeProblems(lesson, TEACHING_MODULES.includes(number)).map((problem) => `${lesson.id}: ${problem}`));
      const assessment = lessons.filter((lesson) => ASSESSMENT_DAYS.includes(lesson.day)).flatMap((lesson) => assessmentProblems(lesson).map((problem) => `${lesson.id}: ${problem}`));
      expect([...problems, ...shape, ...assessment, ...projectProblems(number, project)]).toEqual([]);
    });
  });
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { aiFundamentalsEveryoneCourse: course } = require(`./courses/${COURSE}`) as { aiFundamentalsEveryoneCourse: Course };
  const whole = course.lessons.length === getSyllabus(COURSE)!.topics.length;
  (whole ? describe : describe.skip)(`${COURSE} (the whole course)`, () => {
    test('meets every course rule', () => {
      expect(standardCourseProblems(course)).toEqual([]);
    });
    test('every lesson has the lesson parts', () => {
      const teachingDays = new Set(course.modules!.filter((_, i) => TEACHING_MODULES.includes(i + 1)).flatMap((module) => Array.from({ length: module.lastDay - module.firstDay + 1 }, (_, k) => module.firstDay + k)));
      expect(course.lessons.flatMap((lesson) => shapeProblems(lesson, teachingDays.has(lesson.day)).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
    });
    test('the four assessment parts hold the 20 questions, five for every learner at every level', () => {
      const parts = course.lessons.filter((lesson) => ASSESSMENT_DAYS.includes(lesson.day));
      expect(parts).toHaveLength(4);
      expect(parts.flatMap((lesson) => assessmentProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);
      for (const level of EXPERIENCE_LEVELS) expect(parts.reduce((sum, lesson) => sum + lesson.quiz.filter((question) => inAudience(question.audience, level)).length, 0)).toBe(20);
    });
    test('the practical challenge is the last project and opens after the assessment', () => {
      const last = course.projects[course.projects.length - 1]!;
      expect(last.unlockAfterDay).toBe(40);
      expect(course.projects.map((project) => project.id)).toEqual([`${COURSE}-p1`, `${COURSE}-p2`]);
    });
    test('a learner moves through it in order and completes it only with every lesson and both projects passed', () => {
      const row = (lessonId: string, done: boolean): LessonRow => ({ lesson_id: lessonId, course_id: COURSE, completed_at: done ? '2026-11-18' : null, quiz_correct: done ? 4 : null, quiz_total: done ? 5 : null, task_done: 0 });
      const project = (projectId: string, status: ProjectRow['status']): ProjectRow => ({ project_id: projectId, course_id: COURSE, steps_done: '[]', submission: null, status, feedback: null, review_token: null, reviewed_at: null });
      const none = computeCourseProgress(course, [], []);
      expect(none.started).toBe(false);
      expect(none.lessonsTotal).toBe(43);
      expect(none.nextLesson?.id).toBe(`${COURSE}-01`);
      expect(none.projectOpen(`${COURSE}-p1`)).toBe(false);
      expect(none.projectOpen(`${COURSE}-p2`)).toBe(false);
      const upTo = (day: number) => course.lessons.map((lesson) => row(lesson.id, lesson.day <= day));
      const first = computeCourseProgress(course, upTo(1), []);
      expect(first.nextLesson?.id).toBe(`${COURSE}-02`);
      expect(first.lessonState(`${COURSE}-01`)).toBe('done');
      expect(first.lessonState(`${COURSE}-02`)).toBe('next');
      expect(computeCourseProgress(course, upTo(24), []).projectOpen(`${COURSE}-p1`)).toBe(false);
      expect(computeCourseProgress(course, upTo(25), []).projectOpen(`${COURSE}-p1`)).toBe(true);
      expect(computeCourseProgress(course, upTo(39), []).projectOpen(`${COURSE}-p2`)).toBe(false);
      expect(computeCourseProgress(course, upTo(40), []).projectOpen(`${COURSE}-p2`)).toBe(true);
      const allLessons = upTo(43);
      expect(computeCourseProgress(course, allLessons, []).complete).toBe(false);
      expect(computeCourseProgress(course, allLessons, [project(`${COURSE}-p1`, 'passed')]).complete).toBe(false);
      expect(computeCourseProgress(course, allLessons, [project(`${COURSE}-p1`, 'passed'), project(`${COURSE}-p2`, 'needs_work')]).complete).toBe(false);
      expect(computeCourseProgress(course, upTo(42), [project(`${COURSE}-p1`, 'passed'), project(`${COURSE}-p2`, 'passed')]).complete).toBe(false);
      const done = computeCourseProgress(course, allLessons, [project(`${COURSE}-p1`, 'passed'), project(`${COURSE}-p2`, 'passed')]);
      expect(done.complete).toBe(true);
      expect(done.nextLesson).toBeNull();
      expect(done.fraction).toBe(1);
    });
    test('every assessment part passes with 3 of 5 and fails with 2 of 5, whichever level the learner is', () => {
      for (const level of EXPERIENCE_LEVELS) for (const day of ASSESSMENT_DAYS) {
        const asked = course.lessons[day - 1]!.quiz.filter((question) => inAudience(question.audience, level)).length;
        expect(asked).toBe(5);
        expect(quizPassed(3, asked)).toBe(true);
        expect(quizPassed(2, asked)).toBe(false);
      }
    });
    test('every lesson’s quiz questions are asked at each level in numbers the app allows, with one correct answer inside the choices', () => {
      for (const lesson of course.lessons) {
        for (const level of EXPERIENCE_LEVELS) {
          const asked = lesson.quiz.filter((question) => inAudience(question.audience, level));
          expect(asked.length).toBeGreaterThanOrEqual(3);
          expect(asked.length).toBeLessThanOrEqual(6);
        }
        for (const question of lesson.quiz) expect(question.answer).toBeLessThan(question.choices.length);
      }
    });
    test('the lessons total about 8 to 13 hours', () => {
      const hours = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) / 60;
      expect(hours).toBeGreaterThanOrEqual(8);
      expect(hours).toBeLessThanOrEqual(13);
    });
  });
  test('the course skeleton is wired', () => {
    expect(course.id).toBe(COURSE);
    expect(course.modules).toHaveLength(8);
    expect(getSyllabus(COURSE)!.topics).toHaveLength(43);
  });
}
