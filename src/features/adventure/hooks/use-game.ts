import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { COURSES, getCourse, useLearning } from '@/features/courses/data';
import { useLearnerLevel } from '@/features/onboarding';
import { useLanguage } from '@/hooks/use-strings';

import { activityBadgeStats, readActivityProgress, readAttempts, recordAttempt, type ActivityBadgeStats, type ActivityRow, type AttemptInput, type AttemptResult } from '../api/activity-repo';
import { adaptiveSummary, type AdaptiveSummary } from '../lib/adaptive';
import { conceptOf } from '../lib/concepts';
import { displayTitle, earnedTitles, type ProfileTitle } from '../lib/unlocks';
import { buildWorld, type World } from '../lib/world';
import { computeXp, levelFor, levelTitle, missionXp, progressToNextLevel, type LevelProgress, type MissionXp, type XpActivityRow, type XpBreakdown, type XpLessonRow, type XpProjectRow } from '../lib/xp';

export const activitiesKey = ['adventure', 'activities'] as const;
export const attemptsKey = ['adventure', 'attempts'] as const;
/** Adaptive guidance only needs recent history. */
const ATTEMPT_HISTORY = 120;

export type Game = {
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
  /** Total XP, derived from the learning rows (never stored, never lowered by a missed day). */
  xp: number;
  xpBreakdown: XpBreakdown;
  level: number;
  levelTitle: string;
  progressToNext: LevelProgress;
  streak: { current: number; best: number; doneToday: boolean };
  /** Ids of the achievements earned. */
  achievements: string[];
  /** The best earned profile title, else the level's. */
  title: string;
  titles: ProfileTitle[];
  activityRows: ActivityRow[];
  /** Counts for `earnedBadges` (spread into its stats). */
  badgeStats: ActivityBadgeStats;
  adaptive: AdaptiveSummary;
  /** Every course as a world. */
  worlds: World[];
  worldFor: (courseId: string) => World | null;
  /** XP earned inside one course's world (lessons, quizzes, tasks, projects and practice of that course). */
  worldXp: (courseId: string) => number;
  recordAttempt: (input: AttemptInput) => Promise<AttemptResult>;
  isRecording: boolean;
};

/** The game layer in one read: XP, level, achievements, streak, activity progress and the worlds. */
export function useGame(): Game {
  const language = useLanguage();
  const learning = useLearning();
  const activities = useDbQuery(activitiesKey, (db) => readActivityProgress(db));
  const attempts = useDbQuery(attemptsKey, (db) => readAttempts(db, { limit: ATTEMPT_HISTORY }));
  // Guidance starts from the level lessons adapt to (the chosen level, as a saved skill check may have raised it).
  const learner = useLearnerLevel();
  const record = useRecordAttempt();

  const activityRows = activities.data ?? [];
  const lessonRows = learning.data?.lessons ?? [];
  const projectRows = learning.data?.projects ?? [];
  const badges = learning.badges;
  const xpBreakdown = computeXp({ lessonRows, projectRows, badgeCount: badges.length, activityRows });
  const xp = xpBreakdown.total;
  const level = levelFor(xp);
  const achievements = badges.map((badge) => badge.badge_id);
  const passed = new Set(projectRows.filter((row) => row.status === 'passed').map((row) => row.project_id));
  const worlds = COURSES.map((course) => {
    const progress = learning.progressFor(course.id);
    return progress ? buildWorld(course, progress, passed) : null;
  }).filter((world): world is World => world !== null);
  const byCourse = new Map(worlds.map((world) => [world.courseId, world]));

  return {
    isPending: learning.isPending || activities.isPending || attempts.isPending,
    isError: learning.isError || activities.isError || attempts.isError,
    refetch: () => {
      void learning.refetch();
      void activities.refetch();
      void attempts.refetch();
    },
    xp,
    xpBreakdown,
    level,
    levelTitle: levelTitle(level, language),
    progressToNext: progressToNextLevel(xp),
    streak: learning.streak,
    achievements,
    title: displayTitle(levelTitle(level, language), achievements, language),
    titles: earnedTitles(achievements, language),
    activityRows,
    badgeStats: activityBadgeStats(activityRows),
    adaptive: adaptiveSummary(activityRows, attempts.data ?? [], learner.level, conceptOf),
    worlds,
    worldFor: (courseId) => byCourse.get(courseId) ?? null,
    worldXp: (courseId) => worldXpFor(courseId, lessonRows, projectRows, activityRows),
    recordAttempt: record.mutateAsync,
    isRecording: record.isPending,
  };
}

/** Records one try at an activity. Resolves with the XP it paid (0 unless it was the first correct try). */
export function useRecordAttempt() {
  return useDbMutation((db, input: AttemptInput) => recordAttempt(db, input));
}

/** One course as a world, with the learner's real progress. Null until the learning tables load or when the course does not exist. */
export function useWorld(courseId: string): { world: World | null; xp: number; isPending: boolean } {
  const learning = useLearning();
  const activities = useDbQuery(activitiesKey, (db) => readActivityProgress(db));
  const course = getCourse(courseId);
  const progress = learning.progressFor(courseId);
  const isPending = learning.isPending || activities.isPending;
  if (!course || !progress) return { world: null, xp: 0, isPending };
  const lessonRows = learning.data?.lessons ?? [];
  const projectRows = learning.data?.projects ?? [];
  const passed = new Set(projectRows.filter((row) => row.status === 'passed').map((row) => row.project_id));
  return { world: buildWorld(course, progress, passed), xp: worldXpFor(courseId, lessonRows, projectRows, activities.data ?? []), isPending };
}

/** XP of one world: the same derivation as the total, over that course's rows only (achievements belong to the learner, not a world). */
function worldXpFor(courseId: string, lessonRows: readonly (XpLessonRow & { course_id: string })[], projectRows: readonly (XpProjectRow & { course_id: string })[], activityRows: readonly (XpActivityRow & { course_id: string })[]): number {
  return computeXp({
    lessonRows: lessonRows.filter((row) => row.course_id === courseId),
    projectRows: projectRows.filter((row) => row.course_id === courseId),
    badgeCount: 0,
    activityRows: activityRows.filter((row) => row.course_id === courseId),
  }).total;
}

/** What one finished mission earned (for the completion summary). */
export function useMissionXp(lessonId: string): { xp: MissionXp; isPending: boolean } {
  const learning = useLearning();
  const activities = useDbQuery(activitiesKey, (db) => readActivityProgress(db));
  const row = learning.lessonRow(lessonId);
  const mine = (activities.data ?? []).filter((entry) => entry.lesson_id === lessonId);
  return { xp: missionXp(row, mine), isPending: learning.isPending || activities.isPending };
}
