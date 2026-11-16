import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import type { Tone } from '@/constants/theme';
import type { Language } from '@/lib/i18n';

import type { Course } from '../content/types';
import { BADGE_COPY_FIL, courseBadgeDescription } from './badge-strings';
import type { CourseProgress } from './progress';

export type BadgeDefinition = {
  id: string;
  title: string;
  /** How it is earned, shown on the badge (and on locked ones, as the goal). */
  description: string;
  icon: MaterialSymbolName;
  tone: Tone;
};

/**
 * One badge per stage of the learning journey, and one for reaching its end (`features/journey`; a journey test keeps these ids in step
 * with the stages). Earned only when every milestone the learner needs in that stage is really done.
 */
export const JOURNEY_STAGE_BADGES: readonly { stageId: string; title: string; description: string; icon: MaterialSymbolName }[] = [
  { stageId: 'beginner', title: 'Beginner level', description: 'Finish every milestone you need in the Beginner level.', icon: 'school' },
  { stageId: 'intermediate', title: 'Intermediate level', description: 'Finish every milestone you need in the Intermediate level.', icon: 'build' },
  { stageId: 'advanced', title: 'Advanced level', description: 'Finish every milestone you need in the Advanced level.', icon: 'hub' },
  { stageId: 'expert', title: 'Expert level', description: 'Finish every milestone you need in the Expert level.', icon: 'workspace_premium' },
];
export const JOURNEY_COMPLETE_BADGE = 'journey:complete';

/** Projects that count as "your first AI app" (a working app or tool that calls an AI model). */
export const AI_APP_PROJECTS = new Set(['developer-p1', 'developer-p2', 'mini-python-ai-p1', 'mini-ai-engineering-p1']);
/** The AI development path's capstone: a complete application built through an AI-assisted workflow. */
export const AI_CAPSTONE_PROJECT = 'ai-dev-advanced-p2';
/** The project that is a sent client proposal. */
export const PROPOSAL_PROJECTS = new Set(['freelancer-p3']);

/** Activities to solve for Bug Hunter (fix-bug) and Logic Master (predict-output, arrange, scenario). */
export const BUG_HUNTER_TARGET = 10;
export const LOGIC_MASTER_TARGET = 10;
/** Code Explorer: solved code or SQL activities in this many different languages. */
export const CODE_EXPLORER_LANGUAGES = 2;

/**
 * The milestone badges from the business plan, plus the career tracker's and one per mini-course. `language` picks the
 * words (English by default); ids, icons and tones never change, so stored and synced badges keep working.
 */
export function badgeDefinitions(courses: readonly Course[], language: Language = 'en'): BadgeDefinition[] {
  const fixed: BadgeDefinition[] = [
    { id: 'first-lesson', title: 'First lesson', description: 'Finish your first lesson.', icon: 'flag', tone: 'indigo' },
    { id: 'streak-7', title: '7-day streak', description: 'Learn 7 days in a row.', icon: 'local_fire_department', tone: 'amber' },
    { id: 'streak-30', title: '30-day streak', description: 'Learn 30 days in a row.', icon: 'whatshot', tone: 'amber' },
    { id: 'perfect-quiz', title: 'Perfect quiz', description: 'Answer every question in a quiz right.', icon: 'military_tech', tone: 'violet' },
    { id: 'first-project', title: 'First project shipped', description: 'Pass the review of a project.', icon: 'rocket_launch', tone: 'teal' },
    { id: 'first-ai-app', title: 'First AI app', description: 'Ship a project that calls an AI model.', icon: 'smart_toy', tone: 'violet' },
    { id: 'first-proposal', title: 'First client proposal', description: 'Send your first proposal and pass its review.', icon: 'send', tone: 'teal' },
    { id: 'starter-complete', title: 'AI basics', description: 'Finish AI Basics for Tech.', icon: 'auto_awesome', tone: 'indigo' },
    { id: 'course-complete', title: 'Course complete', description: 'Finish a career course, certificate and all.', icon: 'workspace_premium', tone: 'amber' },
    { id: 'master', title: 'Talino Master', description: 'Finish every career course.', icon: 'emoji_events', tone: 'amber' },
    { id: 'first-application', title: 'In the game', description: 'Add your first job application or proposal to the tracker.', icon: 'work', tone: 'sky' },
    { id: 'first-interview', title: 'First interview', description: 'Reach the interview stage.', icon: 'record_voice_over', tone: 'sky' },
    { id: 'first-win', title: 'Hired or won', description: 'Get an offer or win a client.', icon: 'celebration', tone: 'mint' },
    { id: 'first-income', title: 'First earnings', description: 'Log your first freelance income.', icon: 'payments', tone: 'mint' },
    // The game layer's achievements (features/adventure counts the solved activities). "First Steps",
    // "Project Builder" and "Consistency Champion" already exist as first-lesson, first-project and streak-7.
    { id: 'bug-hunter', title: 'Bug Hunter', description: `Find and fix ${BUG_HUNTER_TARGET} bugs in practice activities.`, icon: 'bug_report', tone: 'teal' },
    { id: 'logic-master', title: 'Logic Master', description: `Solve ${LOGIC_MASTER_TARGET} logic activities: predict the output, put steps in order, work through a scenario.`, icon: 'psychology', tone: 'violet' },
    { id: 'code-explorer', title: 'Code Explorer', description: `Solve code or SQL challenges in ${CODE_EXPLORER_LANGUAGES} different languages.`, icon: 'travel_explore', tone: 'indigo' },
  ];
  const journey: BadgeDefinition[] = [
    ...JOURNEY_STAGE_BADGES.map((badge): BadgeDefinition => ({ id: `journey:${badge.stageId}`, title: badge.title, description: badge.description, icon: badge.icon, tone: 'violet' })),
    { id: JOURNEY_COMPLETE_BADGE, title: 'AI-powered builder', description: 'Reach the end of the learning journey.', icon: 'emoji_events', tone: 'amber' },
  ];
  const minis = courses
    .filter((course) => course.kind === 'mini')
    .map((course): BadgeDefinition => ({ id: `mini:${course.id}`, title: course.title, description: courseBadgeDescription('mini', course.title, language), icon: course.icon as MaterialSymbolName, tone: 'violet' }));
  const pathCourses = courses.filter((course) => course.kind === 'path');
  const path: BadgeDefinition[] = pathCourses.length
    ? [
        { id: 'ai-developer', title: 'AI Developer', description: 'Finish every course in the AI-Assisted Development path.', icon: 'smart_toy', tone: 'violet' },
        { id: 'ai-capstone', title: 'Capstone shipped', description: 'Build a complete application with an AI-assisted workflow and pass its review.', icon: 'rocket_launch', tone: 'amber' },
        ...pathCourses.map((course): BadgeDefinition => ({ id: `path:${course.id}`, title: course.title, description: courseBadgeDescription('path', course.title, language), icon: course.icon as MaterialSymbolName, tone: 'sky' })),
      ]
    : [];
  return [...fixed, ...journey, ...minis, ...path].map((badge) => localizeBadge(badge, language));
}

function localizeBadge(badge: BadgeDefinition, language: Language): BadgeDefinition {
  const copy = language === 'fil' ? BADGE_COPY_FIL[badge.id]?.({ bugs: BUG_HUNTER_TARGET, logic: LOGIC_MASTER_TARGET, languages: CODE_EXPLORER_LANGUAGES }) : undefined;
  return copy ? { ...badge, ...copy } : badge;
}

export type BadgeStats = {
  courses: readonly Course[];
  progress: readonly CourseProgress[];
  bestStreak: number;
  passedProjects: ReadonlySet<string>;
  applications: number;
  interviews: number;
  wins: number;
  incomeEntries: number;
  /** From the solved practice activities (`activityBadgeStats` in features/adventure); absent means none. */
  fixBugSolved?: number;
  logicSolved?: number;
  /** The distinct languages of solved code and SQL activities. */
  codeLanguages?: readonly string[];
  /** The learning journey's stages that are really complete (`completedStageIds`), and whether the whole journey is. Absent means none. */
  journeyStagesDone?: readonly string[];
  journeyComplete?: boolean;
};

/** Every badge the stats have earned (already-earned ones included; the repo keeps the first date). */
export function earnedBadges(stats: BadgeStats): string[] {
  const earned: string[] = [];
  const byId = new Map(stats.progress.map((entry) => [entry.courseId, entry]));
  const complete = (id: string) => byId.get(id)?.complete === true;
  const careers = stats.courses.filter((course) => course.kind === 'career');
  const passed = [...stats.passedProjects];

  if (stats.progress.some((entry) => entry.lessonsDone > 0)) earned.push('first-lesson');
  if (stats.bestStreak >= 7) earned.push('streak-7');
  if (stats.bestStreak >= 30) earned.push('streak-30');
  if (stats.progress.some((entry) => entry.perfectQuizzes > 0)) earned.push('perfect-quiz');
  if (passed.length > 0) earned.push('first-project');
  if (passed.some((id) => AI_APP_PROJECTS.has(id))) earned.push('first-ai-app');
  if (passed.some((id) => PROPOSAL_PROJECTS.has(id))) earned.push('first-proposal');
  if (complete('starter')) earned.push('starter-complete');
  if (careers.some((course) => complete(course.id))) earned.push('course-complete');
  if (careers.length > 0 && careers.every((course) => complete(course.id))) earned.push('master');
  if (stats.applications > 0) earned.push('first-application');
  if (stats.interviews > 0) earned.push('first-interview');
  if (stats.wins > 0) earned.push('first-win');
  if (stats.incomeEntries > 0) earned.push('first-income');
  if ((stats.fixBugSolved ?? 0) >= BUG_HUNTER_TARGET) earned.push('bug-hunter');
  if ((stats.logicSolved ?? 0) >= LOGIC_MASTER_TARGET) earned.push('logic-master');
  if (new Set(stats.codeLanguages ?? []).size >= CODE_EXPLORER_LANGUAGES) earned.push('code-explorer');
  for (const course of stats.courses) if (course.kind === 'mini' && complete(course.id)) earned.push(`mini:${course.id}`);
  const pathCourses = stats.courses.filter((course) => course.kind === 'path');
  for (const course of pathCourses) if (complete(course.id)) earned.push(`path:${course.id}`);
  if (pathCourses.length > 0 && pathCourses.every((course) => complete(course.id))) earned.push('ai-developer');
  if (passed.includes(AI_CAPSTONE_PROJECT)) earned.push('ai-capstone');
  for (const stageId of stats.journeyStagesDone ?? []) if (JOURNEY_STAGE_BADGES.some((badge) => badge.stageId === stageId)) earned.push(`journey:${stageId}`);
  if (stats.journeyComplete) earned.push(JOURNEY_COMPLETE_BADGE);
  return earned;
}
