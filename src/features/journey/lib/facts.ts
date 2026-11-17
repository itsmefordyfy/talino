import type { Course, CourseProgress } from '@/features/courses';

import type { CourseSnapshot, JourneyDefinition, JourneyFacts } from './types';

export type FactsInput = {
  /** Every lesson row (`lesson_id`, `course_id`, `completed_at`…): the learner's real progress. */
  lessonRows: readonly { course_id: string; completed_at: string | null }[];
  /** Ids of the projects whose review passed. */
  passedProjects: readonly string[];
  progressFor: (courseId: string) => CourseProgress | null;
  getCourse: (courseId: string) => Course | undefined;
  /** The course in the learner's language. */
  localize: (course: Course) => Course;
  /** The learner can open the course (a subscription, or the free starter; true before the store has answered). */
  owns: (courseId: string) => boolean;
  actions: JourneyFacts['actions'];
};

/**
 * What the journey engine is told about the learner, read from the progress rows and the catalog. Pure and nothing is stored: the same
 * rows (after a restart, a restore from a backup, or on another phone that holds the same rows) always give the same facts, and so the
 * same Home. Each course appears once however many milestones mention it.
 */
export function buildFacts(definition: JourneyDefinition, input: FactsInput): JourneyFacts {
  // When each course was last worked on: the latest lesson finished in it, to tell several started courses apart.
  const lastActive = new Map<string, string>();
  for (const row of input.lessonRows) {
    if (row.completed_at && row.completed_at > (lastActive.get(row.course_id) ?? '')) lastActive.set(row.course_id, row.completed_at);
  }
  const courses = new Map<string, CourseSnapshot>();
  const projectTitles = new Map<string, string>();
  const openProjects = new Set<string>();
  for (const stage of definition.stages) {
    for (const milestone of stage.milestones) {
      for (const step of milestone.steps) {
        if (step.kind === 'action') continue;
        const original = input.getCourse(step.courseId);
        const progress = input.progressFor(step.courseId);
        if (!original || !progress) continue;
        const shown = input.localize(original);
        if (!courses.has(step.courseId)) {
          courses.set(step.courseId, {
            title: shown.title,
            lessonsDone: progress.lessonsDone,
            lessonsTotal: progress.lessonsTotal,
            started: progress.started,
            complete: progress.complete,
            nextLessonId: progress.nextLesson?.id ?? null,
            nextLessonTitle: progress.nextLesson?.title ?? null,
            minutesLeft: original.lessons.filter((lesson) => progress.lessonState(lesson.id) !== 'done').reduce((sum, lesson) => sum + lesson.minutes, 0),
            owned: input.owns(step.courseId),
            quizAverage: progress.quizAverage,
            description: shown.description,
            nextLessonNumber: progress.nextLesson?.day ?? null,
            lastActiveAt: lastActive.get(step.courseId) ?? null,
          });
        }
        if (step.kind === 'build') {
          const project = shown.projects.find((entry) => entry.id === step.projectId) ?? original.projects.find((entry) => entry.id === step.projectId);
          if (project) {
            projectTitles.set(step.projectId, project.title);
            if (progress.projectOpen(step.projectId)) openProjects.add(step.projectId);
          }
        }
      }
    }
  }
  return { courses, projectTitles, passedProjects: new Set(input.passedProjects), openProjects, actions: input.actions };
}
