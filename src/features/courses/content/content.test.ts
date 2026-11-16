import { describe, expect, test } from '@jest/globals';

import { lessonStructureProblems } from '../lib/lesson-structure';
import { standardCourseProblems } from '../lib/standard-rules';
import { allCourseProblems } from './ai-dev/check';
import { AI_DEV_SYLLABUS } from './ai-dev/syllabus';
import { getSyllabus } from './catalog/syllabus';
import { COURSES } from './index';

/** The content rules from the writers' brief, checked for every course so a later edit can't break them. */
describe('course content', () => {
  const allIds = new Set<string>();
  const unique = (id: string) => {
    expect(allIds.has(id)).toBe(false);
    allIds.add(id);
  };

  test.each(COURSES.map((course) => [course.id, course] as const))('%s follows the rules', (_id, course) => {
    unique(course.id);
    // A path course is sized by its syllabus (one lesson per topic) and meets the path's own rules too.
    const syllabus = AI_DEV_SYLLABUS.find((entry) => entry.id === course.id);
    const expectedLessons = course.kind === 'starter' ? 7 : course.kind === 'mini' ? 5 : course.kind === 'path' ? (syllabus?.topics.length ?? -1) : course.kind === 'standard' ? (getSyllabus(course.id)?.topics.length ?? -1) : 20;
    if (course.kind === 'path') expect(allCourseProblems(course)).toEqual([]);
    if (course.kind === 'standard') expect(standardCourseProblems(course)).toEqual([]);
    expect(course.lessons).toHaveLength(expectedLessons);
    const skillIds = new Set(course.skills.map((skill) => skill.id));
    expect(skillIds.size).toBe(course.skills.length);
    expect(course.projects.length).toBeGreaterThanOrEqual(1);
    if (course.kind === 'career') expect(course.coachRole).toBeDefined();

    course.lessons.forEach((lesson, index) => {
      unique(lesson.id);
      expect(lesson.day).toBe(index + 1);
      expect(lesson.id).toBe(`${course.id}-${String(lesson.day).padStart(2, '0')}`);
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(3);
      // A lesson may carry extra questions tagged for a level; what any one learner is asked (3 to 6) is checked by lessonStructureProblems below.
      expect(lesson.quiz.length).toBeLessThanOrEqual(9);
      expect(lesson.body.length).toBeGreaterThan(0);
      expect(lesson.skills.length).toBeGreaterThan(0);
      for (const skill of lesson.skills) expect(skillIds.has(skill)).toBe(true);
      for (const question of lesson.quiz) {
        unique(question.id);
        expect(question.id.startsWith(`${lesson.id}-q`)).toBe(true);
        expect(question.choices.length).toBeGreaterThanOrEqual(3);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.choices.length);
      }
      expect(lesson.task.steps.length).toBeGreaterThan(0);
    });

    // Teach first: an intro, enough explanation, takeaways, and explained quiz answers (lib/lesson-structure.ts).
    expect(course.lessons.flatMap((lesson) => lessonStructureProblems(lesson).map((problem) => `${lesson.id}: ${problem}`))).toEqual([]);

    for (const skill of course.skills) expect(course.lessons.some((lesson) => lesson.skills.includes(skill.id))).toBe(true);

    course.projects.forEach((project, index) => {
      unique(project.id);
      expect(project.id).toBe(`${course.id}-p${index + 1}`);
      expect(project.unlockAfterDay).toBeGreaterThanOrEqual(1);
      expect(project.unlockAfterDay).toBeLessThanOrEqual(course.lessons.length);
      expect(project.rubric.length).toBeGreaterThanOrEqual(3);
      for (const step of project.steps) unique(step.id);
    });
  });
});
