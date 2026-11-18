import { describe, expect, test } from '@jest/globals';

import { findVisual } from '../../../visuals';
import { parseMermaidSubset, validateDiagram } from '../../../visuals/diagrams';
import { layoutDiagram } from '../../../visuals/diagrams/layout';
import { computeCourseProgress, betterScore, quizPassed, type LessonRow, type ProjectRow } from '../../lib/progress';
import { standardCourseProblems } from '../../lib/standard-rules';
import { EXPERIENCE_LEVELS, inAudience } from '../levels';
import { howLlmsWorkCourse as course } from './courses/how-llms-work';
import { ASSESSMENT_DAYS, shapeProblems } from './llm-module.test';
import { LLM_MODULES, SYLLABUS_LLM } from './syllabus-llm';

/**
 * The whole of How Large Language Models Work, and the learner's journey through it with the app's own progress code: the catalog rules, the module and lesson counts, the
 * five-part 25-question assessment at every learner level, quiz scoring, lesson order, the project gate, and course completion. (The per-module authoring checks are in
 * `llm-module.test.ts`.)
 */
describe('How Large Language Models Work', () => {
  test('meets every rule of a catalog course', () => {
    expect(standardCourseProblems(course)).toEqual([]);
  });

  test('has the eleven modules and every lesson of the brief, in order', () => {
    expect(course.modules).toHaveLength(11);
    expect(course.lessons).toHaveLength(77);
    expect(course.lessons.map((lesson) => lesson.title)).toEqual(SYLLABUS_LLM[0]!.topics);
    expect(LLM_MODULES.map((module) => module.topics.length)).toEqual([5, 6, 6, 7, 7, 8, 8, 8, 6, 8, 8]);
    for (const module of course.modules ?? []) {
      const inModule = course.lessons.filter((lesson) => lesson.day >= module.firstDay && lesson.day <= module.lastDay);
      expect(inModule.length).toBe(module.lastDay - module.firstDay + 1);
    }
  });

  test('every lesson has the parts the brief names, and no code', () => {
    const problems = course.lessons.flatMap((lesson) => shapeProblems(lesson, lesson.day).map((problem) => `${lesson.id}: ${problem}`));
    expect(problems).toEqual([]);
    for (const lesson of course.lessons) {
      expect(lesson.intro?.objectives.length).toBeGreaterThanOrEqual(2);
      expect(lesson.summary.length).toBeGreaterThan(20);
      expect(lesson.task.steps.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('every visual the lessons use exists', () => {
    const ids = course.lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'visual' ? [block.id] : [])));
    expect(ids.length).toBeGreaterThan(10);
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

  test('the final assessment is 25 four-choice questions, exactly 25 for every learner level', () => {
    const parts = course.lessons.filter((lesson) => (ASSESSMENT_DAYS as readonly number[]).includes(lesson.day));
    expect(parts).toHaveLength(5);
    for (const level of EXPERIENCE_LEVELS) {
      const asked = parts.flatMap((part) => part.quiz.filter((question) => inAudience(question.audience, level)));
      expect(asked).toHaveLength(25);
      for (const question of asked) {
        expect(question.choices).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(4);
        expect(question.explanation.length).toBeGreaterThan(30);
      }
    }
    // The four shared questions per part are the same for everyone, so the assessment compares like with like.
    for (const part of parts) expect(part.quiz.filter((question) => !question.audience)).toHaveLength(4);
  });

  test('assessment scoring: 3 of 5 passes, 2 of 5 does not, and the better attempt is kept', () => {
    expect(quizPassed(3, 5)).toBe(true);
    expect(quizPassed(2, 5)).toBe(false);
    expect(betterScore({ correct: 2, total: 5 }, { correct: 4, total: 5 })).toEqual({ correct: 4, total: 5 });
    expect(betterScore({ correct: 4, total: 5 }, { correct: 3, total: 5 })).toEqual({ correct: 4, total: 5 });
  });

  test('the practical challenge is the course project and opens after the challenge lesson', () => {
    expect(course.projects).toHaveLength(1);
    const project = course.projects[0]!;
    expect(project.id).toBe('how-llms-work-p1');
    expect(project.unlockAfterDay).toBe(76);
    expect(project.steps.length).toBeGreaterThanOrEqual(6);
    expect(project.submission.kind).toBe('text');
    expect(project.rubric.length).toBeGreaterThanOrEqual(3);
    const text = JSON.stringify(project).toLowerCase();
    for (const needed of ['problem', 'input', 'output', 'hallucination', 'verify']) expect(text).toContain(needed);
  });

  test('a learner moves through it in order and completes it only with every lesson and the project passed', () => {
    const lessonRow = (lesson: (typeof course.lessons)[number], done: boolean): LessonRow => ({ lesson_id: lesson.id, course_id: course.id, completed_at: done ? '2026-11-18T00:00:00Z' : null, quiz_correct: done ? 4 : null, quiz_total: done ? 5 : null, task_done: done ? 1 : 0 });
    const project = course.projects[0]!;
    const projectRow = (status: ProjectRow['status']): ProjectRow => ({ project_id: project.id, course_id: course.id, steps_done: '[]', submission: 'work', status, feedback: null, review_token: null, reviewed_at: null });

    const fresh = computeCourseProgress(course, [], []);
    expect(fresh.started).toBe(false);
    expect(fresh.nextLesson?.id).toBe('how-llms-work-01');
    expect(fresh.lessonState('how-llms-work-02')).toBe('locked');
    expect(fresh.projectOpen(project.id)).toBe(false);

    const firstFive = course.lessons.slice(0, 5).map((lesson) => lessonRow(lesson, true));
    const partway = computeCourseProgress(course, firstFive, []);
    expect(partway.started).toBe(true);
    expect(partway.lessonsDone).toBe(5);
    expect(partway.nextLesson?.id).toBe('how-llms-work-06');
    expect(partway.lessonState('how-llms-work-06')).toBe('next');
    expect(partway.lessonState('how-llms-work-01')).toBe('done');
    expect(partway.skills.find((skill) => skill.id === 'llm-foundations')?.fraction).toBe(1);

    const through76 = course.lessons.slice(0, 76).map((lesson) => lessonRow(lesson, true));
    expect(computeCourseProgress(course, through76, []).projectOpen(project.id)).toBe(true);

    const all = course.lessons.map((lesson) => lessonRow(lesson, true));
    expect(computeCourseProgress(course, all, []).complete).toBe(false);
    expect(computeCourseProgress(course, all, [projectRow('submitted')]).complete).toBe(false);
    const finished = computeCourseProgress(course, all, [projectRow('passed')]);
    expect(finished.complete).toBe(true);
    expect(finished.fraction).toBe(1);
  });
});
