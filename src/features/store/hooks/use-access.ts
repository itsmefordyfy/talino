import { getCourse } from '@/features/courses/content';
import { selectDevUnlockAll } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';

import { useCustomerInfo } from '../api/queries';
import { canOpenLesson, hasAllAccess, hasAnyPurchase, ownsCourse } from '../lib/access';

/** What the learner may open. Before the store answers (no cache, first launch), only the free course. */
export function useAccess() {
  const { data, isPending } = useCustomerInfo();
  // Development builds only (Settings → Developer → Unlock every lesson and project): every course counts as owned, for testing.
  const unlockAll = useAppSelector(selectDevUnlockAll);
  return {
    customer: data ?? null,
    known: !!data || !isPending,
    allAccess: hasAllAccess(data),
    anyPurchase: hasAnyPurchase(data),
    /** A lesson the learner can open: any lesson of a course they own, and the first lesson of every course. */
    canOpenLesson: (courseId: string, lessonId: string) => {
      const course = getCourse(courseId);
      return !!course && (unlockAll || canOpenLesson(data, course, lessonId));
    },
    owns: (courseId: string) => {
      const course = getCourse(courseId);
      return !!course && (unlockAll || ownsCourse(data, course));
    },
  };
}
