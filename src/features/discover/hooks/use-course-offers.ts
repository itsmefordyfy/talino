import { useLearning, type CourseProgress } from '@/features/courses';
import { useAccess } from '@/features/store';

export type CourseOffer = { owned: boolean; progress: CourseProgress | null };

/** What a course card needs to say about a course beyond the course itself: whether the learner has it, and their progress (never a price). */
export function useCourseOffers(): { offerFor: (courseId: string) => CourseOffer; allAccess: boolean } {
  const learning = useLearning();
  const access = useAccess();
  return {
    allAccess: access.allAccess,
    offerFor: (courseId) => ({ owned: access.owns(courseId), progress: learning.progressFor(courseId) }),
  };
}
