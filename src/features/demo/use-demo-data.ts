import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import type { AudienceId } from '@/features/courses/data';
import { goalChanged, learnerNameChanged, selectGoal, selectLearnerName } from '@/features/settings/settings-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { isDemoOn, removeDemoData, seedDemoData } from './demo-data';

type Change = { on: boolean; name: string; goal: AudienceId | null };

/**
 * The Developer group's "Demo data" switch: on fills the whole app with Ford's sample (Home, Courses, Profile, Career, résumés, the
 * portfolio) and names the learner Ford; off removes just that and puts the name and goal back. Development builds only.
 */
export function useDemoData() {
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectLearnerName);
  const goal = useAppSelector(selectGoal);
  const state = useDbQuery(['demo-data'], isDemoOn);
  // `notify: false`: demo rows must not start a backup.
  const toggle = useDbMutation<Change, { name: string; goal: AudienceId | null } | null>((db, change) => (change.on ? seedDemoData(db, new Date(), { name: change.name, goal: change.goal }) : removeDemoData(db)), { notify: false });

  return {
    on: state.data === true,
    toggling: toggle.isPending,
    setOn: (on: boolean) => {
      if (!__DEV__ || toggle.isPending) return;
      void toggle.mutateAsync({ on, name, goal }).then((result) => {
        if (!result) return;
        dispatch(learnerNameChanged(result.name));
        dispatch(goalChanged(result.goal));
      });
    },
  };
}
