import { router } from 'expo-router';

import { openPaywall, useAccess } from '@/features/store';

import { findLesson } from '../content';

/**
 * Opens a lesson, or the paywall when it isn't the learner's to open (a course they don't have: all but its free first lesson): a Continue or Start button must never land on a "you don't have
 * this course" page (owner, 2026-11-15; the app is subscription based now). While the store hasn't answered yet the lesson opens as
 * before, so a subscriber on a cold start is never sent to the paywall by mistake.
 */
export function useOpenLesson(): (lessonId: string) => void {
  const access = useAccess();
  return (lessonId: string) => {
    const courseId = findLesson(lessonId)?.course.id;
    if (courseId && access.known && !access.canOpenLesson(courseId, lessonId)) {
      void openPaywall('courses');
      return;
    }
    router.push({ pathname: '/lesson/[id]', params: { id: lessonId } });
  };
}
