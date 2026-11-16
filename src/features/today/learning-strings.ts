import { defineStrings } from '@/lib/i18n';

/** The learner's own-learning blocks on Today (other courses under way, the path they are on, the first lesson). Nothing here recommends a course. */
export const learningStrings = defineStrings({
  en: {
    alsoInProgress: 'Also in progress',
    continueCourse: 'Continue',
    continueCourseA11y: (title: string) => `Continue ${title}`,
    startCourse: 'Start course',
    startCourseA11y: (title: string) => `Start ${title}`,
    firstLessonTitle: 'Start your first lesson',
    firstLessonBody: (course: string) => `A short lesson from ${course}. Just a few minutes, and your streak begins.`,
    firstLessonButton: 'Start lesson',
    firstLessonA11y: (course: string) => `Start your first lesson, from ${course}`,
  },
  fil: {
    alsoInProgress: 'Ginagawa mo rin',
    continueCourse: 'Continue',
    continueCourseA11y: (title: string) => `Ituloy ang ${title}`,
    startCourse: 'Start course',
    startCourseA11y: (title: string) => `Simulan ang ${title}`,
    firstLessonTitle: 'Simulan ang unang lesson mo',
    firstLessonBody: (course: string) => `Maikling lesson mula sa ${course}. Ilang minuto lang, at magsisimula na ang streak mo.`,
    firstLessonButton: 'Start lesson',
    firstLessonA11y: (course: string) => `Simulan ang unang lesson mo, mula sa ${course}`,
  },
});
