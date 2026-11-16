import type { Language } from '@/lib/i18n';

import { FIL_COURSES } from '../content/fil';
import type { Course, Lesson, Project } from '../content/types';

/** The courses that exist in each language besides English (English has all of them). */
const TRANSLATIONS: Partial<Record<Language, Readonly<Record<string, Course>>>> = { fil: FIL_COURSES };

/** True when a course can be read in `language`: English always, another language only if it was translated. */
export function courseHasLanguage(courseId: string, language: Language): boolean {
  return language === 'en' || TRANSLATIONS[language]?.[courseId] !== undefined;
}

/**
 * The course in the learner's language, or the English original when it hasn't been translated (never a mix). Takes
 * anything with a course's id (the plan's `CatalogCourse` is a slice of one) and gives back the same kind of thing.
 */
export function localizedCourse<T extends Pick<Course, 'id'>>(course: T, language: Language): T;
export function localizedCourse<T extends Pick<Course, 'id'>>(course: T | undefined, language: Language): T | undefined;
export function localizedCourse<T extends Pick<Course, 'id'>>(course: T | undefined, language: Language): T | undefined {
  if (!course || language === 'en') return course;
  return (TRANSLATIONS[language]?.[course.id] as T | undefined) ?? course;
}

export function localizedLesson(course: Course, lesson: Lesson, language: Language): Lesson {
  return localizedCourse(course, language).lessons.find((candidate) => candidate.id === lesson.id) ?? lesson;
}

export function localizedProject(course: Course, project: Project, language: Language): Project {
  return localizedCourse(course, language).projects.find((candidate) => candidate.id === project.id) ?? project;
}

/** Ids of the courses translated into `language`, for lists and tests. */
export function translatedCourseIds(language: Language): string[] {
  return Object.keys(TRANSLATIONS[language] ?? {});
}

/** A found lesson (or project) with its course, both in the learner's language, so a screen reads one consistent pair. */
export function localizedFound<T extends { course: Course; lesson: Lesson } | undefined>(found: T, language: Language): T {
  if (!found || language === 'en') return found;
  const course = localizedCourse(found.course, language);
  return { course, lesson: localizedLesson(found.course, found.lesson, language) } as T;
}
