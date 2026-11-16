import { describe, expect, test } from '@jest/globals';

import { badgeDefinitions, earnedBadges, type BadgeStats } from './badges';
import { makeCourse } from './fixtures.test-helpers';
import { computeCourseProgress, type LessonRow } from './progress';

const starter = makeCourse('starter', 2, [], 'starter');
const dev = makeCourse('developer', 1, [1]);
const mini = makeCourse('mini-python-ai', 1, [], 'mini');
const courses = [starter, dev, mini];
const lesson = (id: string, courseId: string, correct = 3): LessonRow => ({ lesson_id: id, course_id: courseId, completed_at: 'x', quiz_correct: correct, quiz_total: 3, task_done: 1 });

function stats(overrides: Partial<BadgeStats> = {}): BadgeStats {
  return { courses, progress: courses.map((course) => computeCourseProgress(course, [], [])), bestStreak: 0, passedProjects: new Set(), applications: 0, interviews: 0, wins: 0, incomeEntries: 0, ...overrides };
}

describe('earnedBadges', () => {
  test('nothing done, nothing earned', () => {
    expect(earnedBadges(stats())).toEqual([]);
  });

  test('a first lesson with a perfect quiz', () => {
    const progress = courses.map((course) => computeCourseProgress(course, [lesson('starter-01', 'starter')], []));
    expect(earnedBadges(stats({ progress }))).toEqual(['first-lesson', 'perfect-quiz']);
  });

  test('streaks, projects and the career tracker', () => {
    const earned = earnedBadges(stats({ bestStreak: 30, passedProjects: new Set(['developer-p1']), applications: 2, interviews: 1, wins: 1, incomeEntries: 1 }));
    expect(earned).toEqual(expect.arrayContaining(['streak-7', 'streak-30', 'first-project', 'first-ai-app', 'first-application', 'first-interview', 'first-win', 'first-income']));
    expect(earned).not.toContain('first-proposal');
  });

  test('finishing every career course is Talino Master; a mini-course has its own badge', () => {
    const lessons = [lesson('developer-01', 'developer', 2), lesson('mini-python-ai-01', 'mini-python-ai', 2)];
    const passed = [{ project_id: 'developer-p1', course_id: 'developer', steps_done: '[]', submission: null, status: 'passed' as const, feedback: null, review_token: null, reviewed_at: null }];
    const progress = courses.map((course) => computeCourseProgress(course, lessons, passed));
    expect(earnedBadges(stats({ progress }))).toEqual(expect.arrayContaining(['course-complete', 'master', 'mini:mini-python-ai']));
  });

  test('practice activities earn Bug Hunter, Logic Master and Code Explorer', () => {
    expect(earnedBadges(stats({ fixBugSolved: 9, logicSolved: 9, codeLanguages: ['js'] }))).toEqual([]);
    expect(earnedBadges(stats({ fixBugSolved: 10 }))).toEqual(['bug-hunter']);
    expect(earnedBadges(stats({ logicSolved: 10 }))).toEqual(['logic-master']);
    expect(earnedBadges(stats({ codeLanguages: ['js', 'sql'] }))).toEqual(['code-explorer']);
    expect(earnedBadges(stats({ codeLanguages: ['js', 'js'] }))).toEqual([]);
  });

  test('the AI development path: a badge per course, AI Developer for all of them, and the capstone', () => {
    const intro = makeCourse('ai-dev-intro', 1, [], 'path');
    const advanced = makeCourse('ai-dev-advanced', 1, [1, 1], 'path');
    const pathCourses = [starter, dev, mini, intro, advanced];
    const passedRows = ['ai-dev-advanced-p1', 'ai-dev-advanced-p2'].map((id) => ({ project_id: id, course_id: 'ai-dev-advanced', steps_done: '[]', submission: null, status: 'passed' as const, feedback: null, review_token: null, reviewed_at: null }));
    const onlyIntro = pathCourses.map((course) => computeCourseProgress(course, [lesson('ai-dev-intro-01', 'ai-dev-intro', 2)], []));
    const one = earnedBadges(stats({ courses: pathCourses, progress: onlyIntro }));
    expect(one).toEqual(expect.arrayContaining(['path:ai-dev-intro']));
    expect(one).not.toContain('ai-developer');
    const both = pathCourses.map((course) => computeCourseProgress(course, [lesson('ai-dev-intro-01', 'ai-dev-intro', 2), lesson('ai-dev-advanced-01', 'ai-dev-advanced', 2)], passedRows));
    const all = earnedBadges(stats({ courses: pathCourses, progress: both, passedProjects: new Set(['ai-dev-advanced-p2']) }));
    expect(all).toEqual(expect.arrayContaining(['path:ai-dev-intro', 'path:ai-dev-advanced', 'ai-developer', 'ai-capstone']));
    // A path course is not a career course: it never counts toward Talino Master.
    expect(all).not.toContain('master');
    const ids = new Set(badgeDefinitions(pathCourses).map((badge) => badge.id));
    for (const id of all) expect(ids.has(id)).toBe(true);
  });

  test('no AI Developer badge while the path has no courses', () => {
    expect(earnedBadges(stats())).not.toContain('ai-developer');
  });

  test('the new badges are defined once, and no existing id was removed', () => {
    const ids = badgeDefinitions(courses).map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ['first-lesson', 'streak-7', 'streak-30', 'perfect-quiz', 'first-project', 'first-ai-app', 'first-proposal', 'starter-complete', 'course-complete', 'master', 'first-application', 'first-interview', 'first-win', 'first-income', 'mini:mini-python-ai', 'bug-hunter', 'logic-master', 'code-explorer']) expect(ids).toContain(id);
  });

  test('every earnable id has a definition', () => {
    const ids = new Set(badgeDefinitions(courses).map((badge) => badge.id));
    const all = earnedBadges(stats({ bestStreak: 40, passedProjects: new Set(['developer-p1', 'freelancer-p3']), applications: 1, interviews: 1, wins: 1, incomeEntries: 1, fixBugSolved: 10, logicSolved: 10, codeLanguages: ['js', 'sql'] }));
    for (const id of all) expect(ids.has(id)).toBe(true);
  });
});
