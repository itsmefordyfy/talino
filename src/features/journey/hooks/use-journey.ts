import { useDbQuery } from '@/db/use-db-query';
import { getCourse, localizedCourse, useLearning } from '@/features/courses';
import { useProfile } from '@/features/onboarding';
import { selectHomeCourse, selectJourneyFocus, selectJourneyStartLevel } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { useLanguage } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

import { readJourneyActions } from '../api/actions-repo';
import { AI_BUILDER_JOURNEY } from '../data/journey';
import { buildCoursePath } from '../lib/course-path';
import { computeJourney } from '../lib/engine';
import { buildFacts } from '../lib/facts';
import { focusFrom } from '../lib/focus';
import type { JourneyDefinition, JourneyLearner } from '../lib/types';

/**
 * The journey for this learner: the definition read against their real lessons, project reviews and portfolio. Derived on every
 * render from what is already on the phone, so there is nothing to save and nothing that can disagree with the courses. The learner's
 * place is therefore always where their progress says it is, and comes back exactly after a restart, a restore or a preference change.
 */
export function useJourney(definition: JourneyDefinition = AI_BUILDER_JOURNEY) {
  const learning = useLearning();
  const access = useAccess();
  const profile = useProfile();
  const chosen = useAppSelector(selectJourneyFocus);
  const chosenStart = useAppSelector(selectJourneyStartLevel);
  const homeCourse = useAppSelector(selectHomeCourse);
  const language = useLanguage();
  const actions = useDbQuery(['journey', 'actions'], readJourneyActions);

  // The saved answers too: until they are read the journey would be worked out for a learner who said nothing (the beginner level, no direction), and
  // Home would open at that place and then move.
  const isPending = learning.isPending || actions.isPending || profile.isPending;
  const isError = learning.isError || actions.isError;

  const facts = buildFacts(definition, {
    lessonRows: learning.data?.lessons ?? [],
    passedProjects: (learning.data?.projects ?? []).filter((row) => row.status === 'passed').map((row) => row.project_id),
    progressFor: learning.progressFor,
    getCourse,
    localize: (course) => localizedCourse(course, language),
    // Nothing is shown as locked behind a subscription before the store has answered.
    owns: (courseId) => !access.known || access.owns(courseId),
    actions: actions.data ?? { portfolio: false, resume: false },
  });
  const saved = profile.data ?? null;
  const learner: JourneyLearner = {
    experience: saved?.experience ?? null,
    assessment: saved?.assessment?.level ?? null,
    focus: focusFrom({ goals: saved?.goals ?? [], interests: saved?.interests ?? [] }, chosen),
    chosenStart,
  };
  const state = computeJourney(definition, facts, learner);
  // The same journey as courses: what Home draws and resumes from.
  const path = buildCoursePath(state, facts, { pickedCourseId: homeCourse?.id ?? null });

  return {
    definition,
    state,
    path,
    facts,
    learner,
    isPending,
    isError,
    refetch: () => {
      void learning.refetch();
      void actions.refetch();
    },
  };
}
