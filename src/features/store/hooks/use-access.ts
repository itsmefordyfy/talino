import { getCourse } from '@/features/courses/content';
import { selectDevUnlockAll } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';

import { useCustomerInfo } from '../api/queries';
import { hasAllAccess, hasAnyPurchase, ownsCourse } from '../lib/access';

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
    owns: (courseId: string) => {
      const course = getCourse(courseId);
      return !!course && (unlockAll || ownsCourse(data, course));
    },
  };
}
