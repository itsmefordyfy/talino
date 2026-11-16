import { SYLLABUS_AI_1 } from './syllabus-ai-1';
import { SYLLABUS_AI_2 } from './syllabus-ai-2';
import type { SyllabusEntry } from './syllabus-types';

export type { SyllabusEntry } from './syllabus-types';

/**
 * The new courses of the AI-first catalog (2026-11-14), in catalog order: A AI coding fundamentals, B vibe coding and app building,
 * C AI coding tools, D AI-assisted development workflows, E advanced AI software engineering, F building and monetising software
 * with AI. The earlier plan of 54 language, framework and backend courses was dropped by the owner the same day (docs/content/AI_FIRST_AUDIT.md).
 */
export const CATALOG_SYLLABUS: readonly SyllabusEntry[] = [...SYLLABUS_AI_1, ...SYLLABUS_AI_2];

const byId = new Map(CATALOG_SYLLABUS.map((entry) => [entry.id, entry]));

export function getSyllabus(courseId: string): SyllabusEntry | undefined {
  return byId.get(courseId);
}

/** Fewest and most lessons a standard course may have. By length: a mini-course is 7 or fewer lessons, a masterclass 12 or more, anything between a plain course. */
export const STANDARD_MIN_LESSONS = 5;
export const STANDARD_MAX_LESSONS = 15;
export const MINI_MAX_LESSONS = 7;
export const MASTERCLASS_MIN_LESSONS = 12;
