import { useDbQuery } from '@/db/use-db-query';
import { getCourse, localizedCourse, localizedProject, useLearning } from '@/features/courses';
import { useProfile } from '@/features/onboarding';
import { selectJourneyFocus, selectJourneyStartLevel } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { useLanguage } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

import { readJourneyActions } from '../api/actions-repo';
import { AI_BUILDER_JOURNEY } from '../data/journey';
import { computeJourney } from '../lib/engine';
import { focusFrom } from '../lib/focus';
import type { CourseSnapshot, JourneyDefinition, JourneyFacts, JourneyLearner } from '../lib/types';

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
  const language = useLanguage();
  const actions = useDbQuery(['journey', 'actions'], readJourneyActions);

  const isPending = learning.isPending || actions.isPending;
  const isError = learning.isError || actions.isError;

  const courses = new Map<string, CourseSnapshot>();
  const projectTitles = new Map<string, string>();
  const openProjects = new Set<string>();
  for (const stage of definition.stages) {
    for (const milestone of stage.milestones) {
      for (const step of milestone.steps) {
        if (step.kind === 'action') continue;
        const course = getCourse(step.courseId);
        const progress = learning.progressFor(step.courseId);
        if (!course || !progress) continue;
        if (!courses.has(step.courseId)) {
          const shown = localizedCourse(course, language);
          courses.set(step.courseId, {
            title: shown.title,
            lessonsDone: progress.lessonsDone,
            lessonsTotal: progress.lessonsTotal,
            started: progress.started,
            complete: progress.complete,
            nextLessonId: progress.nextLesson?.id ?? null,
            nextLessonTitle: progress.nextLesson?.title ?? null,
            minutesLeft: course.lessons.filter((lesson) => progress.lessonState(lesson.id) !== 'done').reduce((sum, lesson) => sum + lesson.minutes, 0),
            // Nothing is shown as locked behind a subscription before the store has answered.
            owned: !access.known || access.owns(step.courseId),
            quizAverage: progress.quizAverage,
          });
        }
        if (step.kind === 'build') {
          const project = course.projects.find((entry) => entry.id === step.projectId);
          if (project) {
            projectTitles.set(step.projectId, localizedProject(course, project, language).title);
            if (progress.projectOpen(step.projectId)) openProjects.add(step.projectId);
          }
        }
      }
    }
  }

  const facts: JourneyFacts = {
    courses,
    projectTitles,
    passedProjects: new Set((learning.data?.projects ?? []).filter((row) => row.status === 'passed').map((row) => row.project_id)),
    openProjects,
    actions: actions.data ?? { portfolio: false, resume: false },
  };
  const saved = profile.data ?? null;
  const learner: JourneyLearner = {
    experience: saved?.experience ?? null,
    assessment: saved?.assessment?.level ?? null,
    focus: focusFrom({ goals: saved?.goals ?? [], interests: saved?.interests ?? [] }, chosen),
    chosenStart,
  };
  const state = computeJourney(definition, facts, learner);

  return {
    definition,
    state,
    learner,
    isPending,
    isError,
    refetch: () => {
      void learning.refetch();
      void actions.refetch();
    },
  };
}
