import { COURSE_INDEX_DATA } from './course-index.data';

/**
 * What the server routes need to know about a course: its id, kind and title, and its projects' ids and titles. The full catalog
 * (every lesson, quiz and activity) is about ten megabytes of text, and each server route is bundled on its own, so a route that
 * imported it made the whole hosted server too big for Cloudflare's limit. A route that only checks an id or prints a title reads
 * this instead. `course-index.data.ts` is generated from the catalog and `course-index.test.ts` fails when they differ.
 */
export type CourseIndexEntry = { id: string; kind: string; title: string; projects: { id: string; title: string }[] };

export const COURSE_INDEX: readonly CourseIndexEntry[] = COURSE_INDEX_DATA;

const byId = new Map(COURSE_INDEX.map((course) => [course.id, course]));

export function getCourseIndex(id: string): CourseIndexEntry | undefined {
  return byId.get(id);
}

export const CAREER_COURSE_INDEX = COURSE_INDEX.filter((course) => course.kind === 'career');
