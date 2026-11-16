import { describe, expect, test } from '@jest/globals';

import type { Course, Lesson, LessonBlock } from '../content/types';
import { isOfficialSource, pathCourseProblems, versionBlocks } from './path-rules';

const version = (patch: Partial<Extract<LessonBlock, { type: 'version' }>> = {}): LessonBlock => ({ type: 'version', text: 'Plan mode is toggled with Shift+Tab.', checked: '2026-11-14', sources: [{ label: 'Docs', url: 'https://docs.claude.com/en/docs/claude-code/overview' }], ...patch });

const lesson = (n: number, extra: LessonBlock[] = [version()]): Lesson => ({
  id: `ai-dev-intro-${String(n).padStart(2, '0')}`,
  day: n,
  title: `L${n}`,
  summary: 'S',
  minutes: 15,
  skills: ['s'],
  body: [{ type: 'paragraph', text: 'x' }, ...extra, { type: 'activity', activity: { id: `ai-dev-intro-0${n}-a`, kind: 'scenario' } as never }, { type: 'takeaways', items: ['a', 'b'] }],
  quiz: [],
  task: { title: 't', steps: ['s'], minutes: 10 },
});

const course = (patch: Partial<Course> = {}): Course => ({
  id: 'ai-dev-intro',
  kind: 'path',
  title: 'T',
  tagline: 't',
  description: 'd',
  finishLine: ['f'],
  audiences: ['fresh-grad'],
  skills: [{ id: 's', label: 'S' }],
  lessons: [1, 2, 3, 4, 5, 6, 7].map((n) => lesson(n)),
  projects: [{ id: 'ai-dev-intro-p1', title: 'P', summary: 's', outcome: 'o', unlockAfterDay: 7, steps: [], submission: { kind: 'url', label: 'l', placeholder: 'p', hint: 'h' }, rubric: ['a', 'b', 'c'] }],
  icon: 'smart_toy',
  updated: '2026-11-14',
  level: 'beginner',
  path: { id: 'ai-dev', order: 1 },
  ...patch,
});

const today = new Date('2026-11-14T12:00:00Z');

describe('official sources', () => {
  test('accepts the vendors’ documentation sites and refuses everything else', () => {
    expect(isOfficialSource('https://docs.claude.com/en/docs/claude-code/overview')).toBe(true);
    expect(isOfficialSource('https://code.claude.com/docs/en/overview')).toBe(true);
    expect(isOfficialSource('https://developers.openai.com/codex')).toBe(true);
    expect(isOfficialSource('https://docs.cursor.com/agent/overview')).toBe(true);
    expect(isOfficialSource('https://docs.github.com/en/copilot')).toBe(true);
    expect(isOfficialSource('https://ai.google.dev/gemini-api/docs')).toBe(true);
    expect(isOfficialSource('https://medium.com/some-post')).toBe(false);
    expect(isOfficialSource('http://docs.claude.com/x')).toBe(false);
    expect(isOfficialSource('https://docs.claude.com.evil.example/x')).toBe(false);
  });
});

describe('pathCourseProblems', () => {
  test('a course that follows its syllabus has none', () => {
    expect(pathCourseProblems(course(), today)).toEqual([]);
  });

  test('the lesson count, level and order come from the syllabus', () => {
    expect(pathCourseProblems(course({ lessons: course().lessons.slice(0, 6) }), today).join()).toMatch(/7 lessons/);
    expect(pathCourseProblems(course({ level: 'advanced' }), today).join()).toMatch(/level/);
    expect(pathCourseProblems(course({ path: { id: 'ai-dev', order: 3 } }), today).join()).toMatch(/order/);
    expect(pathCourseProblems(course({ id: 'ai-dev-nope' }), today).join()).toMatch(/syllabus/);
  });

  test('every lesson practises something', () => {
    const quiet = course({ lessons: course().lessons.map((entry) => ({ ...entry, body: entry.body.filter((block) => block.type !== 'activity') })) });
    expect(pathCourseProblems(quiet, today).join()).toMatch(/no activity/);
  });

  test('tool facts carry a date that is not in the future and an official source', () => {
    expect(pathCourseProblems(course({ lessons: course().lessons.map((entry, index) => (index === 0 ? lesson(1, [version({ checked: '2027-01-01' })]) : entry)) }), today).join()).toMatch(/future/);
    expect(pathCourseProblems(course({ lessons: course().lessons.map((entry, index) => (index === 0 ? lesson(1, [version({ checked: '14 Nov' })]) : entry)) }), today).join()).toMatch(/date/);
    expect(pathCourseProblems(course({ lessons: course().lessons.map((entry, index) => (index === 0 ? lesson(1, [version({ sources: [{ label: 'Blog', url: 'https://medium.com/x' }] })]) : entry)) }), today).join()).toMatch(/official/);
  });

  test('a date one day ahead of UTC is fine (an author east of UTC), two days ahead is not', () => {
    const lateEvening = new Date('2026-11-13T20:00:00Z'); // already 14 November in Manila
    expect(pathCourseProblems(course(), lateEvening)).toEqual([]);
    expect(pathCourseProblems(course({ lessons: course().lessons.map((entry, index) => (index === 0 ? lesson(1, [version({ checked: '2026-11-15' })]) : entry)) }), lateEvening).join()).toMatch(/future/);
  });

  test('a tool course needs a version note in every lesson', () => {
    const toolCourse = (lessons: Lesson[]) =>
      course({ id: 'ai-dev-cursor', level: 'intermediate', path: { id: 'ai-dev', order: 5 }, lessons: lessons.map((entry, index) => ({ ...entry, id: `ai-dev-cursor-${String(index + 1).padStart(2, '0')}` })) });
    const thirteen = Array.from({ length: 13 }, (_, index) => lesson(index + 1));
    expect(pathCourseProblems(toolCourse(thirteen), today)).toEqual([]);
    expect(pathCourseProblems(toolCourse(thirteen.map((entry, index) => (index === 2 ? lesson(3, []) : entry))), today).join()).toMatch(/ai-dev-cursor-03.*version/);
  });

  test('versionBlocks finds the notes', () => {
    expect(versionBlocks(course().lessons[0])).toHaveLength(1);
  });
});
