import { COURSES } from '../content';
import { CATALOG_SYLLABUS } from '../content/catalog/syllabus';
import type { Course } from '../content/types';

/**
 * The whole planned catalog for tests: every real course plus a light stub for each syllabus course that has not been written
 * yet (its real title, level and lesson count, 15 minutes a lesson, one project). Discovery and recommendation tests run against
 * this, so they exercise the final catalog's shape and keep passing as the real lessons replace the stubs.
 */
export function fullCatalog(): Course[] {
  const have = new Set(COURSES.map((course) => course.id));
  const stubs = CATALOG_SYLLABUS.filter((entry) => !have.has(entry.id)).map(
    (entry): Course => ({
      id: entry.id,
      kind: 'standard',
      title: entry.title,
      level: entry.level,
      tagline: `Stub for ${entry.title}`,
      description: entry.scope,
      finishLine: [`Finish ${entry.title}`],
      audiences: ['fresh-grad'],
      skills: [{ id: 'stub', label: entry.title }],
      lessons: entry.topics.map((topic, index) => ({
        id: `${entry.id}-${String(index + 1).padStart(2, '0')}`,
        day: index + 1,
        title: topic,
        summary: topic,
        minutes: 15,
        skills: ['stub'],
        body: [],
        quiz: [],
        task: { title: 'Stub', steps: ['Stub'], minutes: 5 },
      })),
      projects: [{ id: `${entry.id}-p1`, title: 'Stub', summary: 'Stub', outcome: 'Stub', unlockAfterDay: entry.topics.length, steps: [], submission: { kind: 'text', label: 'Stub', placeholder: 'Stub', hint: 'Stub' }, rubric: ['a', 'b', 'c'] }],
      icon: 'school',
      updated: '2026-11-14',
    }),
  );
  // Real courses first, then the stubs in syllabus order, so the real course keeps its catalog position once written.
  const real = new Map(COURSES.map((course) => [course.id, course]));
  const order = [...COURSES.filter((course) => course.kind !== 'standard'), ...CATALOG_SYLLABUS.map((entry) => real.get(entry.id) ?? stubs.find((stub) => stub.id === entry.id)).filter((course): course is Course => !!course)];
  return order;
}
