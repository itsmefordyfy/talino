import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { useLanguage } from '@/hooks/use-strings';
import { selectDevUnlockAll } from '@/features/settings/settings-slice';
import { todayISO } from '@/lib/dates';
import { useAppSelector } from '@/store/hooks';

import { awardBadges, markBadgesSeen, readBadges, readLearningDays, readLessonRows, readProjectRows, saveQuizResult, saveReview, saveSubmissionDraft, setProjectSteps, setTaskDone, type QuizResult, type ReviewOutcome } from '../api/progress-repo';
import { COURSES } from '../content';
import { localizedCourse } from '../lib/localization';
import { computeCourseProgress, type CourseProgress } from '../lib/progress';
import { computeStreak } from '../lib/streak';

export const learningKey = ['learning'] as const;

/** Every course's progress, the streak and the badges, from one read of the learning tables. */
export function useLearning() {
  const query = useDbQuery(learningKey, async (db) => {
    const [lessons, projects, days, badges] = await Promise.all([readLessonRows(db), readProjectRows(db), readLearningDays(db), readBadges(db)]);
    return { lessons, projects, days, badges };
  });
  const data = query.data;
  const unlockAll = useAppSelector(selectDevUnlockAll);
  // Skill labels and the next lesson's title come from the course in the learner's language; ids (and so progress) are the same in every language.
  const language = useLanguage();
  const computed: CourseProgress[] = data ? COURSES.map((course) => computeCourseProgress(localizedCourse(course, language), data.lessons, data.projects)) : [];
  // Development builds only (Settings → Developer): every lesson and project opens, so any screen can be tested without finishing the days
  // before it. Progress itself is untouched: done stays done, nothing is written, and turning it off locks them again.
  const progress: CourseProgress[] = unlockAll ? computed.map(unlockEverything) : computed;
  const byCourse = new Map(progress.map((entry) => [entry.courseId, entry]));
  return {
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    data,
    progress,
    progressFor: (courseId: string) => byCourse.get(courseId) ?? null,
    lessonRow: (lessonId: string) => data?.lessons.find((row) => row.lesson_id === lessonId) ?? null,
    projectRow: (projectId: string) => data?.projects.find((row) => row.project_id === projectId) ?? null,
    streak: computeStreak(data?.days ?? [], todayISO()),
    badges: data?.badges ?? [],
  };
}

function unlockEverything(progress: CourseProgress): CourseProgress {
  return {
    ...progress,
    lessonState: (lessonId) => {
      const state = progress.lessonState(lessonId);
      return state === 'locked' ? 'next' : state;
    },
    projectOpen: () => true,
  };
}

export function useSaveQuiz() {
  return useDbMutation((db, result: Omit<QuizResult, 'day'>) => saveQuizResult(db, { ...result, day: todayISO() }));
}

export function useSetTaskDone() {
  return useDbMutation((db, { lessonId, courseId, done }: { lessonId: string; courseId: string; done: boolean }) => setTaskDone(db, lessonId, courseId, done));
}

export function useSetProjectSteps() {
  return useDbMutation((db, { projectId, courseId, steps }: { projectId: string; courseId: string; steps: string[] }) => setProjectSteps(db, projectId, courseId, steps));
}

export function useSaveSubmissionDraft() {
  return useDbMutation((db, { projectId, courseId, submission }: { projectId: string; courseId: string; submission: string }) => saveSubmissionDraft(db, projectId, courseId, submission));
}

export function useSaveReview() {
  return useDbMutation((db, { projectId, courseId, outcome }: { projectId: string; courseId: string; outcome: ReviewOutcome }) => saveReview(db, projectId, courseId, outcome));
}

export function useAwardBadges() {
  return useDbMutation((db, ids: string[]) => awardBadges(db, ids));
}

export function useMarkBadgesSeen() {
  return useDbMutation((db) => markBadgesSeen(db), { notify: false });
}
