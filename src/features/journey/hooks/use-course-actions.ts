import { router } from 'expo-router';
import { useOpenLesson } from '@/features/courses';

import type { PathNode } from '../lib/course-path';

/**
 * What tapping a course does on Home. A course on the map shows its lesson timeline at once, with no transition (owner, 2026-11-16): `show` is
 * how the screen puts a course on Home, so the course's lessons open in place, never on another page.
 * The milestone with no course (portfolio, résumé) opens its details sheet as before. Lessons open through `useOpenLesson`, which sends a
 * learner without access to the paywall.
 */
export function useCourseActions(show: (courseId: string) => void) {
  const openLesson = useOpenLesson();

  const openMilestone = (node: PathNode) => router.push({ pathname: '/journey/[id]', params: { id: node.milestoneId } });

  /** Puts a course on Home: a course on the map, the resume card's See lessons, the suggested next course. The milestone with no course opens its sheet. */
  const showCourse = (node: PathNode) => {
    if (node.kind === 'action' || !node.courseId) openMilestone(node);
    else show(node.courseId);
  };

  return { showCourse, openLesson };
}
