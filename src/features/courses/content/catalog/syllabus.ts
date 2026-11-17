import { SYLLABUS_AI_1 } from './syllabus-ai-1';
import { SYLLABUS_AI_2 } from './syllabus-ai-2';
import { SYLLABUS_DSA } from './syllabus-dsa';
import { SYLLABUS_FOUNDATIONS } from './syllabus-foundations';
import { SYLLABUS_GENAI } from './syllabus-genai';
import { SYLLABUS_INTERNATIONAL_CLIENTS } from './syllabus-international-clients';
import { SYLLABUS_OOP } from './syllabus-oop';
import { SYLLABUS_PRODUCTIVITY } from './syllabus-productivity';
import { SYLLABUS_SOFT_SKILLS } from './syllabus-soft-skills';
import type { SyllabusEntry } from './syllabus-types';

export type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * The new courses of the AI-first catalog (2026-11-14), in catalog order: A AI coding fundamentals, B vibe coding and app building,
 * C AI coding tools, D AI-assisted development workflows, E advanced AI software engineering, F building and monetising software
 * with AI. The earlier plan of 54 language, framework and backend courses was dropped by the owner the same day (docs/content/AI_FIRST_AUDIT.md).
 */
export const CATALOG_SYLLABUS: readonly SyllabusEntry[] = [...SYLLABUS_AI_1, ...SYLLABUS_AI_2, ...SYLLABUS_FOUNDATIONS, ...SYLLABUS_DSA, ...SYLLABUS_OOP, ...SYLLABUS_SOFT_SKILLS, ...SYLLABUS_INTERNATIONAL_CLIENTS, ...SYLLABUS_GENAI, ...SYLLABUS_PRODUCTIVITY];

const byId = new Map(CATALOG_SYLLABUS.map((entry) => [entry.id, entry]));

export function getSyllabus(courseId: string): SyllabusEntry | undefined {
  return byId.get(courseId);
}

/** Fewest and most lessons a standard course may have. By length: a mini-course is 7 or fewer lessons, a masterclass 12 or more, anything between a plain course. */
export const STANDARD_MIN_LESSONS = 5;
export const STANDARD_MAX_LESSONS = 15;
/** A course made of modules (Programming Fundamentals) may be longer: a learner takes it module by module. */
export const MODULE_COURSE_MAX_LESSONS = 80;

/** The most lessons this course's syllabus may list. */
export function lessonLimitOf(entry: Pick<SyllabusEntry, 'modules'>): number {
  return entry.modules && entry.modules.length > 0 ? MODULE_COURSE_MAX_LESSONS : STANDARD_MAX_LESSONS;
}
export const MINI_MAX_LESSONS = 7;
export const MASTERCLASS_MIN_LESSONS = 12;
