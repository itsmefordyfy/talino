import { describe, expect, test } from '@jest/globals';

import { findVisual } from '../../../visuals';
import { parseMermaidSubset, validateDiagram } from '../../../visuals/diagrams';
import { layoutDiagram } from '../../../visuals/diagrams/layout';
import { computeCourseProgress, betterScore, quizPassed, type LessonRow, type ProjectRow } from '../../lib/progress';
import { standardCourseProblems } from '../../lib/standard-rules';
import { EXPERIENCE_LEVELS, inAudience } from '../levels';
import { ASSESSMENT_DAYS, buildCounts, shapeProblems } from './agents-module.test';
import { buildingAiAgentsCourse as course } from './courses/building-ai-agents';
import { AGENTS_MODULES, SYLLABUS_AGENTS } from './syllabus-agents';

/**
 * The whole of Building AI Agents, and the learner's journey through it with the app's own progress code: the catalog rules, the module and lesson counts, the required diagrams,
 * the version notes, the runnable coding exercises, the six-part 30-question assessment at every learner level, quiz scoring, lesson order, the project gates, and course completion.
 * (The per-module authoring checks are in `agents-module.test.ts`.)
 */
const REQUIRED_DIAGRAM_DAYS: Record<string, number[]> = {
  'basic agent architecture': [5, 8],
  'LLM and tool interaction': [25],
  'the tool-calling cycle': [26],
  'agent memory architecture': [35],
  'RAG-powered agent architecture': [43],
  'the ReAct workflow': [56],
  'multi-agent communication': [66],
  'coordinator and worker architecture': [67],
  'human-in-the-loop approval': [95],
  'production agent architecture': [101],
};

describe('Building AI Agents', () => {
  test('meets every rule of a catalog course', () => {
    expect(standardCourseProblems(course)).toEqual([]);
  });

  test('has the twelve modules and every lesson of the brief, in order', () => {
    expect(course.modules).toHaveLength(12);
    expect(course.lessons).toHaveLength(109);
    expect(course.lessons.map((lesson) => lesson.title)).toEqual(SYLLABUS_AGENTS[0]!.topics);
    expect(AGENTS_MODULES.map((module) => module.topics.length)).toEqual([7, 8, 9, 9, 9, 10, 10, 10, 9, 8, 12, 8]);
    for (const module of course.modules ?? []) {
      const inModule = course.lessons.filter((lesson) => lesson.day >= module.firstDay && lesson.day <= module.lastDay);
      expect(inModule.length).toBe(module.lastDay - module.firstDay + 1);
    }
  });

  test('every lesson has the parts the brief names', () => {
    const problems = course.lessons.flatMap((lesson) => shapeProblems(lesson, lesson.day).map((problem) => `${lesson.id}: ${problem}`));
    expect(problems).toEqual([]);
    for (const lesson of course.lessons) {
      expect(lesson.intro?.objectives.length).toBeGreaterThanOrEqual(2);
      expect(lesson.summary.length).toBeGreaterThan(20);
      expect(lesson.task.steps.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('the course is technical: code in the right languages, real build lessons, runnable coding exercises, no live-model activities, no keys', () => {
    const languages = new Set(course.lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'code' ? [block.language.toLowerCase()] : []))));
    for (const language of ['python', 'typescript', 'sql', 'bash', 'json']) expect(languages.has(language)).toBe(true);
    const counts = buildCounts(course.lessons);
    expect(counts.build).toBeGreaterThanOrEqual(70);
    expect(counts.coding).toBeGreaterThanOrEqual(45);
    const kinds = new Set(course.lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'activity' ? [block.activity.kind] : []))));
    for (const forbidden of ['prompt-lab', 'roleplay', 'message-review', 'planning', 'sql-challenge']) expect(kinds.has(forbidden as never)).toBe(false);
    for (const needed of ['code-challenge', 'fix-bug', 'predict-output', 'workflow-builder', 'scenario', 'match', 'arrange', 'tap-reveal']) expect(kinds.has(needed as never)).toBe(true);
    const text = JSON.stringify(course.lessons);
    expect(text).not.toMatch(/sk-[A-Za-z0-9]{16,}|sk-ant-[A-Za-z0-9_-]{8,}|AIza[0-9A-Za-z_-]{20,}/);
    // The first project and the capstone name the no-key path the brief promises.
    expect(JSON.stringify(course.projects[0]).toLowerCase()).toContain('scripted');
  });

  test('the course is fast-moving, so most lessons carry a dated, officially sourced version note', () => {
    const withNotes = course.lessons.filter((lesson) => lesson.body.some((block) => block.type === 'version')).length;
    expect(withNotes).toBeGreaterThanOrEqual(Math.ceil(course.lessons.length * 0.6));
    expect(course.lessons.some((lesson) => lesson.body.some((block) => block.type === 'version' && block.checked === '2026-11-18'))).toBe(true);
  });

  test('every visual the lessons use exists', () => {
    const ids = course.lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'visual' ? [block.id] : [])));
    expect(ids.length).toBeGreaterThan(8);
    for (const id of new Set(ids)) expect(findVisual(id)).not.toBeNull();
  });

  test('every diagram is valid and fits a phone-width lesson card (no sideways scrolling, which drew a blank panel)', () => {
    const problems: string[] = [];
    for (const lesson of course.lessons) {
      for (const block of lesson.body) {
        if (block.type !== 'diagram') continue;
        const result = block.format === 'json' ? validateDiagram(block.source) : parseMermaidSubset(block.source as string);
        if (!result.ok) problems.push(`${lesson.id}: invalid diagram`);
        else if (layoutDiagram(result.spec, 340).needsScroll) problems.push(`${lesson.id}: a diagram is wider than 340 pt`);
      }
    }
    expect(problems).toEqual([]);
  });

  test('the ten diagrams the brief asks for are in the lessons that teach them', () => {
    const missing: string[] = [];
    for (const [name, days] of Object.entries(REQUIRED_DIAGRAM_DAYS)) {
      for (const day of days) {
        const lesson = course.lessons[day - 1]!;
        if (!lesson.body.some((block) => block.type === 'diagram')) missing.push(`${name}: lesson ${day} has no diagram`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('the final assessment is 30 four-choice questions, exactly 30 for every learner level', () => {
    const parts = course.lessons.filter((lesson) => (ASSESSMENT_DAYS as readonly number[]).includes(lesson.day));
    expect(parts).toHaveLength(6);
    for (const level of EXPERIENCE_LEVELS) {
      const asked = parts.flatMap((part) => part.quiz.filter((question) => inAudience(question.audience, level)));
      expect(asked).toHaveLength(30);
      for (const question of asked) {
        expect(question.choices).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(4);
        expect(question.explanation.length).toBeGreaterThan(30);
      }
    }
    for (const part of parts) expect(part.quiz.filter((question) => !question.audience)).toHaveLength(4);
  });

  test('assessment scoring: 3 of 5 passes, 2 of 5 does not, and the better attempt is kept', () => {
    expect(quizPassed(3, 5)).toBe(true);
    expect(quizPassed(2, 5)).toBe(false);
    expect(betterScore({ correct: 2, total: 5 }, { correct: 4, total: 5 })).toEqual({ correct: 4, total: 5 });
    expect(betterScore({ correct: 4, total: 5 }, { correct: 3, total: 5 })).toEqual({ correct: 4, total: 5 });
  });

  test('the eight projects open after their module and the capstone documents both ways to finish', () => {
    expect(course.projects.map((project) => project.id)).toEqual(Array.from({ length: 8 }, (_, i) => `building-ai-agents-p${i + 1}`));
    expect(course.projects.map((project) => project.unlockAfterDay)).toEqual([24, 33, 42, 52, 62, 72, 89, 109]);
    for (const project of course.projects) {
      expect(project.submission.kind).toBe('text');
      expect(project.steps.length).toBeGreaterThanOrEqual(8);
      expect(project.rubric.length).toBeGreaterThanOrEqual(4);
      expect(project.steps.some((step) => step.audience)).toBe(true);
    }
    const capstone = JSON.stringify(course.projects[7]).toLowerCase();
    for (const needed of ['architecture', 'workflow', 'two tools', 'memory', 'security', 'test', 'reflection', 'without', 'paid api']) expect(capstone).toContain(needed);
  });

  test('a learner moves through it in order and completes it only with every lesson and every project passed', () => {
    const lessonRow = (lesson: (typeof course.lessons)[number], done: boolean): LessonRow => ({ lesson_id: lesson.id, course_id: course.id, completed_at: done ? '2026-11-18T00:00:00Z' : null, quiz_correct: done ? 4 : null, quiz_total: done ? 5 : null, task_done: done ? 1 : 0 });
    const projectRow = (id: string, status: ProjectRow['status']): ProjectRow => ({ project_id: id, course_id: course.id, steps_done: '[]', submission: 'work', status, feedback: null, review_token: null, reviewed_at: null });

    const fresh = computeCourseProgress(course, [], []);
    expect(fresh.started).toBe(false);
    expect(fresh.nextLesson?.id).toBe('building-ai-agents-01');
    expect(fresh.lessonState('building-ai-agents-02')).toBe('locked');
    expect(fresh.projectOpen('building-ai-agents-p1')).toBe(false);

    const firstSeven = course.lessons.slice(0, 7).map((lesson) => lessonRow(lesson, true));
    const partway = computeCourseProgress(course, firstSeven, []);
    expect(partway.started).toBe(true);
    expect(partway.lessonsDone).toBe(7);
    expect(partway.nextLesson?.id).toBe('building-ai-agents-08');
    expect(partway.lessonState('building-ai-agents-08')).toBe('next');
    expect(partway.lessonState('building-ai-agents-01')).toBe('done');
    expect(partway.skills.find((skill) => skill.id === 'agent-foundations')?.fraction).toBeGreaterThan(0);

    const through24 = course.lessons.slice(0, 24).map((lesson) => lessonRow(lesson, true));
    expect(computeCourseProgress(course, through24, []).projectOpen('building-ai-agents-p1')).toBe(true);
    expect(computeCourseProgress(course, through24, []).projectOpen('building-ai-agents-p2')).toBe(false);

    const all = course.lessons.map((lesson) => lessonRow(lesson, true));
    const everyProject = (status: ProjectRow['status']) => course.projects.map((project) => projectRow(project.id, status));
    expect(computeCourseProgress(course, all, []).complete).toBe(false);
    expect(computeCourseProgress(course, all, everyProject('submitted')).complete).toBe(false);
    expect(computeCourseProgress(course, all, everyProject('passed').slice(0, 7)).complete).toBe(false);
    const finished = computeCourseProgress(course, all, everyProject('passed'));
    expect(finished.complete).toBe(true);
    expect(finished.fraction).toBe(1);
  });
});
