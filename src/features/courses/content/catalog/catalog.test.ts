import { describe, expect, test } from '@jest/globals';

import { CATEGORY_IDS, LEARNING_GOAL_IDS } from '../types';
import { COURSES } from '../index';
import { CATALOG_SYLLABUS, STANDARD_MAX_LESSONS, STANDARD_MIN_LESSONS } from './syllabus';
import { COURSE_META } from './meta';
import { LEARNING_PATHS } from './paths';
import { getTechnology, TECHNOLOGIES } from './technologies';

const knownIds = new Set([...COURSES.map((course) => course.id), ...CATALOG_SYLLABUS.map((entry) => entry.id)]);

describe('the catalog syllabus', () => {
  test('has the 39 planned AI-first courses with unique ids and titles', () => {
    expect(CATALOG_SYLLABUS).toHaveLength(39);
    expect(new Set(CATALOG_SYLLABUS.map((entry) => entry.id)).size).toBe(39);
    expect(new Set(CATALOG_SYLLABUS.map((entry) => entry.title)).size).toBe(39);
  });

  test.each(CATALOG_SYLLABUS.map((entry) => [entry.id, entry] as const))('%s is well formed', (_id, entry) => {
    expect(entry.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(entry.topics.length).toBeGreaterThanOrEqual(STANDARD_MIN_LESSONS);
    expect(entry.topics.length).toBeLessThanOrEqual(STANDARD_MAX_LESSONS);
    expect(new Set(entry.topics).size).toBe(entry.topics.length);
    expect(CATEGORY_IDS).toContain(entry.category);
    for (const goal of entry.goals) expect(LEARNING_GOAL_IDS).toContain(goal);
    for (const technology of entry.technologies) expect(getTechnology(technology)).toBeDefined();
    for (const prerequisite of entry.prerequisites) {
      expect(knownIds.has(prerequisite)).toBe(true);
      expect(prerequisite).not.toBe(entry.id);
    }
    expect(entry.scope.length).toBeGreaterThan(40);
    expect(entry.tags.every((tag) => tag === tag.toLowerCase())).toBe(true);
  });

  test('titles do not repeat a course that already existed', () => {
    const existing = new Set(COURSES.filter((course) => course.kind !== 'standard').map((course) => course.title.toLowerCase()));
    for (const entry of CATALOG_SYLLABUS) expect(existing.has(entry.title.toLowerCase())).toBe(false);
  });

  test('prerequisites never form a cycle and always come earlier in the catalog or a path', () => {
    const order = new Map(CATALOG_SYLLABUS.map((entry, index) => [entry.id, index]));
    const prerequisites = new Map<string, string[]>([...CATALOG_SYLLABUS.map((entry) => [entry.id, entry.prerequisites] as const), ...Object.entries(COURSE_META).map(([id, meta]) => [id, meta.prerequisites] as const)]);
    const visiting = new Set<string>();
    const visit = (id: string) => {
      expect(visiting.has(id)).toBe(false);
      visiting.add(id);
      for (const next of prerequisites.get(id) ?? []) visit(next);
      visiting.delete(id);
    };
    for (const id of order.keys()) visit(id);
  });
});

describe('the technology vocabulary', () => {
  test('ids are unique and each one is used by some course or is a vocabulary word', () => {
    expect(new Set(TECHNOLOGIES.map((technology) => technology.id)).size).toBe(TECHNOLOGIES.length);
    for (const technology of TECHNOLOGIES) expect(technology.aliases.every((alias) => alias === alias.toLowerCase())).toBe(true);
  });
});

describe('course metadata', () => {
  test('every course in the catalog has its own metadata row', () => {
    for (const course of COURSES) expect(COURSE_META[course.id]).toBeDefined();
  });

  test.each(Object.entries(COURSE_META))('%s metadata is valid', (_id, meta) => {
    expect(CATEGORY_IDS).toContain(meta.category);
    for (const goal of meta.goals) expect(LEARNING_GOAL_IDS).toContain(goal);
    for (const technology of meta.technologies) expect(getTechnology(technology)).toBeDefined();
    for (const prerequisite of meta.prerequisites) expect(knownIds.has(prerequisite)).toBe(true);
    expect(meta.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('every category has at least one course', () => {
    const used = new Set(Object.values(COURSE_META).map((meta) => meta.category));
    for (const category of CATEGORY_IDS) expect(used.has(category)).toBe(true);
  });
});

describe('learning paths', () => {
  test('are unique, non-empty and name real courses once each', () => {
    expect(new Set(LEARNING_PATHS.map((path) => path.id)).size).toBe(LEARNING_PATHS.length);
    for (const path of LEARNING_PATHS) {
      expect(path.courseIds.length).toBeGreaterThanOrEqual(4);
      expect(new Set(path.courseIds).size).toBe(path.courseIds.length);
      for (const id of path.courseIds) expect(knownIds.has(id)).toBe(true);
      for (const goal of path.goals) expect(LEARNING_GOAL_IDS).toContain(goal);
    }
  });
});

describe('learning path order', () => {
  const prerequisitesOf = (id: string) => COURSE_META[id]?.prerequisites ?? [];
  test.each(LEARNING_PATHS.map((path) => [path.id, path] as const))('%s lists every prerequisite before the course that needs it', (_id, path) => {
    const assumed = new Set(path.assumes ?? []);
    const seen = new Set<string>();
    const problems: string[] = [];
    for (const id of path.courseIds) {
      for (const prerequisite of prerequisitesOf(id)) if (!seen.has(prerequisite) && !assumed.has(prerequisite)) problems.push(`${id} needs ${prerequisite}`);
      seen.add(id);
    }
    expect(problems).toEqual([]);
    for (const id of path.assumes ?? []) expect(knownIds.has(id)).toBe(true);
  });
  test('every course of the wider catalog is in at least one path', () => {
    const inPath = new Set(LEARNING_PATHS.flatMap((path) => path.courseIds));
    expect(CATALOG_SYLLABUS.filter((entry) => !inPath.has(entry.id)).map((entry) => entry.id)).toEqual([]);
  });
});

describe('the AI-first direction', () => {
  // The owner's rule (2026-11-14): no standalone course on a programming language, framework or backend technology.
  const FORBIDDEN_SUBJECTS = /^(javascript|typescript|python|react|react native|next\.?js|node\.?js|express|flutter|dart|html|css|tailwind|mongodb|postgresql|supabase|firebase|asp\.net|sql)\b/i;
  test('no syllabus course is about a language or framework as its subject', () => {
    for (const entry of CATALOG_SYLLABUS) expect(entry.title).not.toMatch(FORBIDDEN_SUBJECTS);
  });
  test('every course of the catalog has a title that is about building or using AI, or about shipping what you build', () => {
    expect(COURSES.filter((course) => FORBIDDEN_SUBJECTS.test(course.title)).map((course) => course.id)).toEqual([]);
  });
  test('the flagship path exists and starts with the free course', () => {
    const master = LEARNING_PATHS.find((path) => path.id === 'master-ai');
    expect(master?.courseIds[0]).toBe('starter');
  });
});

describe('completeness of the wider catalog', () => {
  test('every syllabus course has been written and registered', () => {
    const registered = new Set(COURSES.map((course) => course.id));
    expect(CATALOG_SYLLABUS.filter((entry) => !registered.has(entry.id)).map((entry) => entry.id)).toEqual([]);
  });

  test('no two standard courses share a long paragraph (copied teaching)', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const course of COURSES.filter((entry) => entry.kind === 'standard')) {
      for (const lesson of course.lessons) {
        for (const block of lesson.body) {
          if (block.type !== 'paragraph') continue;
          const key = block.text.toLowerCase().replace(/\s+/g, ' ').trim();
          if (key.split(' ').length < 25) continue;
          const first = seen.get(key);
          if (first && first !== lesson.id) duplicates.push(`${lesson.id} repeats a paragraph of ${first}`);
          else seen.set(key, lesson.id);
        }
      }
    }
    expect(duplicates).toEqual([]);
  });
});
