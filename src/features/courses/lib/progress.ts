import type { Course, Lesson } from '../content/types';

/** A quiz passes at 60% or better (Claude's call, 2026-11-13); a failed quiz can be taken again at once. */
export const QUIZ_PASS_RATIO = 0.6;

export function quizPassed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= QUIZ_PASS_RATIO - 1e-9;
}

export type QuizScore = { correct: number; total: number };

/**
 * The better of the stored score and a new attempt, by the FRACTION of the questions asked. A lesson's quiz is made of the questions for the
 * learner's level, so its length can differ from one attempt to the next (the learner changed level, or chose Show everything); a score is
 * therefore always kept as a pair, never as a bare count (4 of 4 is better than 5 of 6, and 5 of 6 is better than 3 of 4). On a tie the stored
 * score stays.
 */
export function betterScore(stored: { correct: number | null; total: number | null } | null, attempt: QuizScore): QuizScore {
  if (!stored || !stored.total || stored.total <= 0 || stored.correct === null) return attempt;
  // Cross-multiplied, so no rounding decides it.
  return attempt.correct * stored.total > stored.correct * attempt.total ? attempt : { correct: stored.correct, total: stored.total };
}

export type LessonRow = {
  lesson_id: string;
  course_id: string;
  completed_at: string | null;
  quiz_correct: number | null;
  quiz_total: number | null;
  task_done: number;
};

export type ProjectStatus = 'open' | 'submitted' | 'passed' | 'needs_work';

export type ProjectRow = {
  project_id: string;
  course_id: string;
  steps_done: string;
  submission: string | null;
  status: ProjectStatus;
  feedback: string | null;
  review_token: string | null;
  reviewed_at: string | null;
};

export type LessonState = 'done' | 'next' | 'locked';

export type SkillLevel = { id: string; label: string; fraction: number };

export type CourseProgress = {
  courseId: string;
  lessonsDone: number;
  lessonsTotal: number;
  projectsPassed: number;
  projectsTotal: number;
  /** Correct answers over questions answered, across the course's best quiz attempts; null before any quiz. */
  quizAverage: number | null;
  perfectQuizzes: number;
  /** Lessons and projects together, 0 to 1. */
  fraction: number;
  /** The first lesson not done yet; null when all are. */
  nextLesson: Lesson | null;
  /** Every lesson's quiz passed and every project passed review: the certificate is earned. */
  complete: boolean;
  started: boolean;
  skills: SkillLevel[];
  lessonState: (lessonId: string) => LessonState;
  /** A project opens once the lesson day it follows is done. */
  projectOpen: (projectId: string) => boolean;
};

export function computeCourseProgress(course: Course, lessonRows: readonly LessonRow[], projectRows: readonly ProjectRow[]): CourseProgress {
  const lessons = new Map(lessonRows.filter((row) => row.course_id === course.id).map((row) => [row.lesson_id, row]));
  const projects = new Map(projectRows.filter((row) => row.course_id === course.id).map((row) => [row.project_id, row]));
  const done = (lesson: Lesson) => lessons.get(lesson.id)?.completed_at != null;

  const lessonsDone = course.lessons.filter(done).length;
  const projectsPassed = course.projects.filter((project) => projects.get(project.id)?.status === 'passed').length;
  let correct = 0;
  let total = 0;
  let perfectQuizzes = 0;
  for (const row of lessons.values()) {
    if (row.quiz_total && row.quiz_total > 0) {
      correct += row.quiz_correct ?? 0;
      total += row.quiz_total;
      if (row.quiz_correct === row.quiz_total) perfectQuizzes += 1;
    }
  }
  const nextLesson = course.lessons.find((lesson) => !done(lesson)) ?? null;
  const units = course.lessons.length + course.projects.length;
  const skills = course.skills.map((skill) => {
    const tagged = course.lessons.filter((lesson) => lesson.skills.includes(skill.id));
    const learned = tagged.filter(done).length;
    return { id: skill.id, label: skill.label, fraction: tagged.length === 0 ? 0 : learned / tagged.length };
  });

  const daysDone = new Set(course.lessons.filter(done).map((lesson) => lesson.day));
  return {
    courseId: course.id,
    lessonsDone,
    lessonsTotal: course.lessons.length,
    projectsPassed,
    projectsTotal: course.projects.length,
    quizAverage: total === 0 ? null : correct / total,
    perfectQuizzes,
    fraction: units === 0 ? 0 : (lessonsDone + projectsPassed) / units,
    nextLesson,
    complete: lessonsDone === course.lessons.length && projectsPassed === course.projects.length && course.lessons.length > 0,
    started: lessons.size > 0 || projects.size > 0,
    skills,
    lessonState: (lessonId) => {
      const lesson = course.lessons.find((entry) => entry.id === lessonId);
      if (!lesson) return 'locked';
      if (done(lesson)) return 'done';
      // Lessons open in order, with no wait between them: a learner may do several in a day.
      return nextLesson?.id === lesson.id ? 'next' : 'locked';
    },
    projectOpen: (projectId) => {
      const project = course.projects.find((entry) => entry.id === projectId);
      if (!project) return false;
      for (let day = 1; day <= project.unlockAfterDay; day += 1) {
        if (course.lessons.some((lesson) => lesson.day === day) && !daysDone.has(day)) return false;
      }
      return true;
    },
  };
}

/** The steps a project row has ticked, read defensively (the column is JSON). */
export function parseStepsDone(value: string | null | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}
