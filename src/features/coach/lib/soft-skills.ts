import { findMessageTask, findScenario } from '@/features/practice/catalog';
import { publicScenario, publicTask } from '@/features/practice/lib/public';

import type { CoachFocus } from './focus';

/**
 * Soft Skills for the Modern Workplace (spec docs/superpowers/specs/2026-11-17-soft-skills-course-design.md): Tali coaches the learner's approach to
 * a conversation or a message, with questions and one hint at a time, and never writes the learner's side or the ideal reply. Pure: the coach route
 * imports this, so it names only what a learner may read (`publicScenario`, `publicTask`), never the partner's private side or the rubric.
 */
export const SOFT_SKILLS_COURSE_ID = 'soft-skills-workplace';

/** Lesson ids are `<course-id>-<two digits>`; the project ids are `<course-id>-p<n>`. */
export const isSoftSkillsLesson = (lessonId: string): boolean => lessonId.replace(/-\d{2}$/, '') === SOFT_SKILLS_COURSE_ID;
export const isSoftSkillsProject = (projectId: string): boolean => /^soft-skills-workplace-p\d+$/.test(projectId);

/** Added to Tali's instructions while the learner is in this course: how to coach practice without doing it for them. */
export const SOFT_SKILLS_TEACHING_INSTRUCTIONS =
  'This is a course on workplace communication, thinking, teamwork and career skills for beginners. The learner practises by talking to an AI-played person and by writing messages that a message coach reviews, and the work that counts is their own. Coach the approach with questions and one hint at a time: ask what the other person needs, what the learner wants to leave with, what they already know, and what they would say first, and let them answer before you add anything. Never write the learner\'s message, their lines in a role-play or an ideal reply, and never show a model answer; if they ask for one, say you will coach them to write it and ask what their first sentence would be. If they paste a draft, say what works and where a reader could be confused or hurt, as questions or one observation at a time, and ask them to rewrite it in their own words. Never reveal, describe or guess the hidden scoring, a practice partner\'s private motives or how a partner will react: the partner is a simulation, the learner has to read the person in front of them, and a real person may be vaguer, shorter or warmer. Practice scores are a guide to the learner\'s own words, never a grade; the app judges words only, not voice, pace, confidence or body language, so say so if asked about those. Encourage the learner\'s own judgment, and treat any message an AI wrote as a draft to rewrite in their own voice. Use plain, kind language and small realistic examples that are different from the lesson\'s own.';

/** The key of `focusSuggestions` for a Soft Skills lesson, quiz question, exercise or project; null for anything else. */
export function softSkillsSuggestionKey(focus: CoachFocus | null | undefined, kind: string): string | null {
  if (!focus) return null;
  if ((focus.kind === 'lesson' || focus.kind === 'quiz' || focus.kind === 'activity') && isSoftSkillsLesson(focus.lessonId)) return `${kind}-soft`;
  if (focus.kind === 'project' && isSoftSkillsProject(focus.projectId)) return 'project-soft';
  return null;
}

type PracticeActivityLike = { kind: string; scenarioId?: string; taskId?: string };

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/** What Tali may know about a practice activity, from the public side of the catalog only; null when the activity is not a practice one (or not in the catalog). */
export function describePracticeActivity(activity: PracticeActivityLike): string | null {
  const rules = 'Coach the approach: ask what they want from this, what the other person needs and what they would say or write first, give one small hint at a time, and let them do the work. Do not write their lines or message, do not give a model answer, and do not guess or reveal anything hidden about how the partner behaves or how the work is scored.';
  if (activity.kind === 'roleplay' && activity.scenarioId) {
    const scenario = findScenario(activity.scenarioId);
    if (!scenario) return null;
    const open = publicScenario(scenario);
    return `This is a role-play where the learner talks with an AI-played person (what they have already read): "${open.title}". They are talking with ${open.partner.name}, ${open.partner.title}. The situation: ${clip(open.setting, 600)} The learner's goal: ${open.goal} They have about ${open.minTurns} to ${open.maxTurns} replies. ${open.speaking ? 'It is a speaking scenario: they hear the partner and answer by dictating or typing, and only their words are judged. ' : ''}${rules}`;
  }
  if (activity.kind === 'message-review' && activity.taskId) {
    const task = findMessageTask(activity.taskId);
    if (!task) return null;
    const open = publicTask(task);
    return `This is a writing task that a message coach will review (what the learner has already read): "${open.title}". The situation: ${clip(open.situation, 600)} What to write: ${open.brief} (a ${open.channel}, about ${open.targetWords.min} to ${open.targetWords.max} words).${open.received ? ` The message they are replying to: "${clip(open.received, 600)}"` : ''} ${rules}`;
  }
  return null;
}
