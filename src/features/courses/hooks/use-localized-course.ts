import { useLanguage } from '@/hooks/use-strings';

import type { Course } from '../content/types';
import { courseHasLanguage, localizedCourse } from '../lib/localization';

/** The course in the chosen language (the English original when it isn't translated yet). */
export function useLocalizedCourse<T extends Pick<Course, 'id'>>(course: T): T;
export function useLocalizedCourse<T extends Pick<Course, 'id'>>(course: T | undefined): T | undefined;
export function useLocalizedCourse<T extends Pick<Course, 'id'>>(course: T | undefined): T | undefined {
  return localizedCourse(course, useLanguage());
}

/**
 * Whether the chosen language is a translation Talino lacks for this course: true only when the learner picked
 * another language and this course is still English. Screens use it to say so instead of silently mixing languages.
 */
export function useCourseNotTranslated(course: Pick<Course, 'id'> | undefined): boolean {
  const language = useLanguage();
  return course !== undefined && !courseHasLanguage(course.id, language);
}
