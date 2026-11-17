import type { PlanningActivity } from '@/features/activities/types';
import { resolveRules } from '@/features/productivity/lib/schedule';
import { formatClock, formatDuration } from '@/features/productivity/lib/time';

import type { CoachFocus } from './focus';

/**
 * Time Management and Productivity (spec docs/superpowers/specs/2026-11-17-productivity-course-design.md): Tali coaches the learner's own planning, with
 * questions and one hint at a time. She works only from what the learner has typed or placed (she has no view of their calendar, habits or week), never
 * claims to know how they usually behave, never writes the finished plan, and never pushes them to do more. Pure: the coach route imports this. Practice
 * activities (role-play, message coach) are described by `describePracticeActivity` (`lib/soft-skills.ts`); the planning activity by `describePlanningActivity` below,
 * from the public side only (the tasks and rules the learner can see, never the expected boxes, the reasons or the reference plan).
 */
export const PRODUCTIVITY_COURSE_ID = 'time-management-productivity';

/** Lesson ids are `<course-id>-<two digits>`; the project ids are `<course-id>-p<n>`. */
export const isProductivityLesson = (lessonId: string): boolean => lessonId.replace(/-\d{2}$/, '') === PRODUCTIVITY_COURSE_ID;
export const isProductivityProject = (projectId: string): boolean => /^time-management-productivity-p\d+$/.test(projectId);

/** Added to Tali's instructions while the learner is in this course: how to coach planning without doing it for them or overstating what she knows. */
export const PRODUCTIVITY_TEACHING_INSTRUCTIONS =
  'This is a course on time management and productivity for beginners: goals, priorities, daily and weekly plans, focus, procrastination, simple tools, working with AI, and sustainable routines. The learner practises with an Eisenhower matrix, a day planner, a Pomodoro timer and planning exercises that are scored by fixed rules, and the work that counts is their own. Coach their planning with questions and one hint at a time: ask what must happen, what is fixed, how long things really take, what they would drop, and where rest and slack fit, and let them answer before you add anything. Work only from what the learner has told you or placed in the lesson in front of you: you cannot see their calendar, tasks, habits or week, so never claim to know how they usually behave or what they always do, and say so plainly when they ask you to judge a pattern you have no information about. Never write the finished schedule, the sorted matrix, their goals or their messages for them, and never show a model answer; if they ask, say you will help them build it and ask what they would place first. Help them spot conflicts (two things at the same time, no break, no slack, a deadline that does not fit, a must-do left out) by asking about them. Never encourage overwork, skipping rest or meals, constant tracking or guilt: a plan with no breaks or no personal time is a worse plan, and one missed day is information, not failure. Techniques such as the Eisenhower matrix, time blocking, the Pomodoro technique, habit stacking and implementation intentions are rules of thumb, not guarantees; say so if asked what research proves, and never invent statistics or studies. If the learner describes constant exhaustion, panic, or a health problem, say kindly that a doctor or counsellor is the right person to ask. When they paste text from an AI tool or ask about one, treat it as a draft to check (invented tasks, times that do not add up, assumptions), and remind them not to paste private or confidential details into any AI tool. Never reveal how an exercise is scored beyond the rules the screen already shows, and never reveal a role-play partner\'s hidden side. Use plain, kind language and small realistic examples that are different from the lesson\'s own.';

/** The key of `focusSuggestions` for a lesson, quiz question, exercise or project of this course; null for anything else. */
export function productivitySuggestionKey(focus: CoachFocus | null | undefined, kind: string): string | null {
  if (!focus) return null;
  if ((focus.kind === 'lesson' || focus.kind === 'quiz' || focus.kind === 'activity') && isProductivityLesson(focus.lessonId)) return `${kind}-prod`;
  if (focus.kind === 'project' && isProductivityProject(focus.projectId)) return 'project-prod';
  return null;
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/**
 * What Tali may know about a planning activity: the tasks and the rules the learner can see on screen. Never the expected boxes, the reasons, the reference
 * plan or the decisions that count as sensible; null when the activity is not a planning one.
 */
export function describePlanningActivity(activity: { kind: string } & Partial<Pick<PlanningActivity, 'challenge'>>): string | null {
  if (activity.kind !== 'planning' || !activity.challenge) return null;
  const rules = 'Coach the approach: ask what they would place first and why, what is fixed, what could wait, and where rest and free time go; give one small hint at a time and let them do the work. Do not place the tasks for them, do not say which box or time a task belongs in, and do not reveal how it is scored beyond the rules shown on screen.';
  const { challenge } = activity;
  if (challenge.mode === 'prioritize') {
    const tasks = challenge.tasks.map((task) => `- ${task.title}${task.detail ? ` (${clip(task.detail, 160)})` : ''}`).join('\n');
    return `This is a sorting exercise: the learner places each task in an Eisenhower matrix box (do now, schedule it, hand it off, let it go). The tasks they can see:\n${tasks}\n${rules}`;
  }
  const { scenario } = challenge;
  const rule = resolveRules(scenario);
  const fixed = scenario.fixed.map((block) => `- ${block.title}, ${formatClock(block.start)} to ${formatClock(block.start + block.minutes)}`).join('\n');
  const tasks = scenario.tasks
    .map((task) => `- ${task.title}: about ${formatDuration(task.minutes)}, ${task.priority} priority${task.deadline !== undefined ? `, due by ${formatClock(task.deadline)}` : ''}${task.mustDo ? ', must be done today' : ''}`)
    .join('\n');
  const interruption = scenario.interruption ? ' Partway through, an interruption arrives and they have to rebuild the plan.' : '';
  return `This is a day-planning exercise: "${scenario.dayLabel}", from ${formatClock(scenario.windowStart)} to ${formatClock(scenario.windowEnd)}. Already fixed:\n${fixed}\nTasks:\n${tasks}\nThe rules shown on screen: at most ${formatDuration(rule.maxFocusRun)} of work without a break, at least ${formatDuration(rule.minBreakTotal)} of rest in the day, at least ${formatDuration(rule.minSlack)} left free, at most ${formatDuration(rule.maxPlannedMinutes)} of tasks. The learner also decides what to do with anything that does not fit.${interruption}\n${rules}`;
}
