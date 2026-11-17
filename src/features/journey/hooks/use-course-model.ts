import { getCourse, useLocalizedCourse } from '@/features/courses';
import type { useLearning } from '@/features/courses';
import { useAccess } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';

import { courseToContinueAfter, type PathNode } from '../lib/course-path';
import { buildTimeline, type CourseTimeline } from '../lib/timeline';
import { journeyStrings } from '../strings';
import type { useJourney } from './use-journey';

type Journey = ReturnType<typeof useJourney>;
type Learning = ReturnType<typeof useLearning>;
type LocalizedCourse = NonNullable<ReturnType<typeof getCourse>>;

export type CourseModel = {
  node: PathNode;
  course: LocalizedCourse;
  timeline: CourseTimeline;
  owned: boolean;
  /** "Level 1 of 4 · Beginner". */
  levelLine: string;
  /** Where the journey goes once this course is done (never this course itself). */
  next: PathNode | null;
};

/**
 * Everything Home's course view draws for one course, from the learner's real lessons: the lesson timeline (completed, current, upcoming,
 * locked), the level, what unlocks it, what comes after it, and Tali's line. Null when there is no such course on the journey, so a stale
 * pick can never show a made-up one. Derived on every render, so finishing a lesson updates it at once.
 */
export function useCourseModel(journey: Journey, learning: Learning, node: PathNode | null): CourseModel | null {
  const text = useLocalized(journeyStrings);
  const access = useAccess();
  const course = useLocalizedCourse(node?.courseId ? getCourse(node.courseId) : undefined);
  if (!node?.courseId || !course) return null;

  const { path, state } = journey;
  const progress = learning.progressFor(node.courseId);
  const owned = !access.known || access.owns(node.courseId);
  const timeline = buildTimeline({
    lessons: course.lessons.map((lesson) => ({ id: lesson.id, day: lesson.day, title: lesson.title, summary: lesson.summary, minutes: lesson.minutes })),
    lessonState: (lessonId) => progress?.lessonState(lessonId) ?? 'locked',
    projects: course.projects.map((project) => ({ id: project.id, title: project.title, passed: learning.projectRow(project.id)?.status === 'passed', open: !!progress?.projectOpen(project.id) })),
    owned,
  });
  const stage = state.stages[node.stageIndex];
  return {
    node,
    course,
    timeline,
    owned,
    levelLine: stage ? text.course.levelLine(stage.index + 1, state.stages.length, stage.def.title) : course.tagline,
    next: courseToContinueAfter(path, node.key),
  };
}
