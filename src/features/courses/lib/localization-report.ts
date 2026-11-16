import type { Language } from '@/lib/language';

import type { Course } from '../content/types';
import { textProblems, translatableStrings } from './localization-parity';
import { SPEECH_PHRASES } from './speech-phrases';
import { lessonSegments } from './speech-segments';

/**
 * How complete a language is across the catalog, course by course and lesson by lesson, including what Listen would actually say in
 * that language. Pure: `npm run i18n:queue` writes it to `docs/i18n/LOCALIZATION_REPORT.md`, and a test keeps its counts honest.
 *
 * - **full**: a translation is registered and none of its text reads as English (`textProblems`), narration included.
 * - **partial**: a translation is registered, but some of its text (or what Listen says) still reads as English or as stiff Filipino.
 * - **english**: no translation; in that language the course is shown, labelled "English lang muna", and read aloud in English.
 */
export type CourseStatus = 'full' | 'partial' | 'english';

export type LessonReport = {
  id: string;
  title: string;
  /** The lesson exists in the language (its course has a registered translation). */
  translated: boolean;
  /** Text fields of the lesson that still read as English or too formal (0 when not translated: nothing was attempted). */
  textProblems: number;
  /** Sentences Listen would say in English while the learner has chosen this language (every sentence when the course is untranslated). */
  englishNarration: number;
  /** All the sentences Listen says for the lesson. */
  narration: number;
  quizQuestions: number;
};

export type CourseReport = {
  id: string;
  title: string;
  kind: Course['kind'];
  status: CourseStatus;
  lessons: LessonReport[];
  projects: number;
  /** Words of English prose (lessons, quizzes, activities, projects) a translation has to carry. */
  words: number;
  /** Text problems outside the lessons (course page, projects). */
  courseTextProblems: number;
};

export type LocalizationReport = {
  language: Language;
  courses: CourseReport[];
  totals: { courses: number; lessons: number; projects: number; quizQuestions: number; full: number; partial: number; english: number; lessonsMissing: number; lessonsWithEnglishNarration: number; words: number; wordsWaiting: number };
};

const wordCount = (course: Course) => translatableStrings(course).reduce((total, entry) => total + entry.text.split(/\s+/).filter(Boolean).length, 0);

/** Listen's own English lines ("Key takeaways.") that must never be said in another language. */
const ENGLISH_LINES = (() => {
  const en = SPEECH_PHRASES.en;
  return [en.tip === SPEECH_PHRASES.fil.tip ? null : en.tip, en.warning, en.prompt, en.takeaways, en.table, en.diagram, en.toolComparison, en.objectives, en.why, 'There is a ', 'Checked on '].filter((line): line is string => !!line);
})();

function sentenceIsEnglish(text: string): boolean {
  if (ENGLISH_LINES.some((line) => text.startsWith(line))) return true;
  return textProblems(text, '').some((problem) => problem.includes('untranslated'));
}

export function localizationReport(english: readonly Course[], translations: Readonly<Record<string, Course>>, language: Language): LocalizationReport {
  const courses = english.map((course): CourseReport => {
    const translated = translations[course.id];
    const lessons = course.lessons.map((lesson): LessonReport => {
      const shown = translated?.lessons.find((entry) => entry.id === lesson.id);
      const segments = shown ? lessonSegments(shown, language) : lessonSegments(lesson, 'en');
      return {
        id: lesson.id,
        title: shown?.title ?? lesson.title,
        translated: !!shown,
        textProblems: shown ? translatableStrings(shown).flatMap(({ path, text }) => textProblems(text, path)).length : 0,
        englishNarration: shown ? segments.filter((segment) => sentenceIsEnglish(segment.text)).length : segments.length,
        narration: segments.length,
        quizQuestions: lesson.quiz.length,
      };
    });
    const { lessons: _lessons, ...rest } = translated ?? ({} as Partial<Course>);
    const courseTextProblems = translated ? translatableStrings({ ...rest, lessons: [] }).flatMap(({ path, text }) => textProblems(text, path)).length : 0;
    const clean = lessons.every((lesson) => lesson.translated && lesson.textProblems === 0 && lesson.englishNarration === 0) && courseTextProblems === 0;
    return {
      id: course.id,
      title: translated?.title ?? course.title,
      kind: course.kind,
      status: !translated ? 'english' : clean ? 'full' : 'partial',
      lessons,
      projects: course.projects.length,
      words: wordCount(course),
      courseTextProblems,
    };
  });
  const allLessons = courses.flatMap((course) => course.lessons);
  return {
    language,
    courses,
    totals: {
      courses: courses.length,
      lessons: allLessons.length,
      projects: courses.reduce((sum, course) => sum + course.projects, 0),
      quizQuestions: allLessons.reduce((sum, lesson) => sum + lesson.quizQuestions, 0),
      full: courses.filter((course) => course.status === 'full').length,
      partial: courses.filter((course) => course.status === 'partial').length,
      english: courses.filter((course) => course.status === 'english').length,
      lessonsMissing: allLessons.filter((lesson) => !lesson.translated).length,
      lessonsWithEnglishNarration: allLessons.filter((lesson) => lesson.englishNarration > 0).length,
      words: courses.reduce((sum, course) => sum + course.words, 0),
      wordsWaiting: courses.filter((course) => course.status === 'english').reduce((sum, course) => sum + course.words, 0),
    },
  };
}
