import { router } from 'expo-router';

import { openPaywall, useAccess } from '@/features/store';

import { findLesson } from '../content';

/**
 * Opens a lesson, or the paywall when its course isn't the learner's: a Continue or Start button must never land on a "you don't have
 * this course" page (owner, 2026-11-15; the app is subscription based now). While the store hasn't answered yet the lesson opens as
 * before, so a subscriber on a cold start is never sent to the paywall by mistake.
 */
export function useOpenLesson(): (lessonId: string) => void {
  const access = useAccess();
  return (lessonId: string) => {
    const courseId = findLesson(lessonId)?.course.id;
    if (courseId && access.known && !access.owns(courseId)) {
      void openPaywall('courses');
      return;
    }
    router.push({ pathname: '/lesson/[id]', params: { id: lessonId } });
  };
}
