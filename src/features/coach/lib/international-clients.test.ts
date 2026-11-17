import { describe, expect, test } from '@jest/globals';

import { COURSES } from '@/features/courses/content';
import { findMessageTask, findScenario } from '@/features/practice/catalog';

import { suggestionKey } from './code-course';
import { describeFocus, sanitizeFocus, type CoachFocus } from './focus';
import { INTERNATIONAL_CLIENTS_COURSE_ID, INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS, internationalClientsSuggestionKey, isInternationalClientsLesson, isInternationalClientsProject } from './international-clients';
import { describePracticeActivity } from './soft-skills';

const course = COURSES.find((entry) => entry.id === INTERNATIONAL_CLIENTS_COURSE_ID)!;
const practiceActivities = course.lessons.flatMap((lesson) => lesson.body.flatMap((block) => (block.type === 'activity' && (block.activity.kind === 'roleplay' || block.activity.kind === 'message-review') ? [{ lesson, activity: block.activity }] : [])));

describe('Finding International Clients lessons are recognised by their id', () => {
  test('lesson and project ids', () => {
    expect(isInternationalClientsLesson('international-clients-04')).toBe(true);
    expect(isInternationalClientsLesson('international-clients-extra-04')).toBe(false);
    expect(isInternationalClientsLesson('programming-fundamentals-04')).toBe(false);
    expect(isInternationalClientsProject('international-clients-p2')).toBe(true);
    expect(isInternationalClientsProject('international-clients-04')).toBe(false);
  });

  test('the course is in the catalog and has practice items', () => {
    expect(course).toBeDefined();
    expect(practiceActivities.length).toBeGreaterThan(10);
  });
});

describe('suggested questions', () => {
  const lessonId = practiceActivities[0].lesson.id;
  test('the lesson, quiz question, exercise and project each get the Finding International Clients set', () => {
    expect(suggestionKey({ kind: 'lesson', lessonId }, 'lesson')).toBe('lesson-intl');
    expect(suggestionKey({ kind: 'quiz', lessonId, questionId: null }, 'quiz')).toBe('quiz-intl');
    expect(suggestionKey({ kind: 'activity', lessonId, activityId: practiceActivities[0].activity.id }, 'activity')).toBe('activity-intl');
    expect(suggestionKey({ kind: 'project', projectId: 'international-clients-p1' }, 'project')).toBe('project-intl');
  });
  test('other courses are unchanged', () => {
    expect(internationalClientsSuggestionKey({ kind: 'lesson', lessonId: 'programming-fundamentals-02' }, 'lesson')).toBeNull();
    expect(suggestionKey({ kind: 'lesson', lessonId: 'programming-fundamentals-02' }, 'lesson')).toBe('lesson-code');
    expect(suggestionKey(null, 'lesson')).toBe('lesson');
  });
});

describe('what Tali is told about a practice activity', () => {
  const asFocus = (entry: (typeof practiceActivities)[number]): CoachFocus => ({ kind: 'activity', lessonId: entry.lesson.id, activityId: entry.activity.id });

  test('the server accepts the focus of every role-play and message task', () => {
    for (const entry of practiceActivities) expect(sanitizeFocus(asFocus(entry))).toEqual(asFocus(entry));
  });

  test('a role-play names the title, the partner and the goal, and a message task the brief', () => {
    const roleplay = practiceActivities.find((entry) => entry.activity.kind === 'roleplay')!;
    const scenario = findScenario((roleplay.activity as { scenarioId: string }).scenarioId)!;
    const lines = describeFocus(asFocus(roleplay)).join('\n');
    expect(lines).toContain(scenario.title);
    expect(lines).toContain(scenario.partner.name);
    expect(lines).toContain(scenario.goal);

    const message = practiceActivities.find((entry) => entry.activity.kind === 'message-review')!;
    const task = findMessageTask((message.activity as { taskId: string }).taskId)!;
    const text = describeFocus(asFocus(message)).join('\n');
    expect(text).toContain(task.title);
    expect(text).toContain(task.brief);
  });

  test('nothing private ever reaches Tali: not the partner’s side, the rubric, the traps, what a complete answer holds, or the explanation', () => {
    for (const entry of practiceActivities) {
      const text = describeFocus(asFocus(entry)).join('\n');
      const { activity } = entry;
      // A private phrase may legitimately also be said in the text the learner reads (the brief, the prompt, a hint); only what comes from the private side alone must be absent.
      const shown = (...parts: (string | undefined)[]) => [activity.prompt, ...activity.hints, ...parts].join(' ');
      if (activity.kind === 'roleplay') {
        const scenario = findScenario(activity.scenarioId)!;
        const visible = shown(scenario.title, scenario.setting, scenario.goal, scenario.partner.title, scenario.opening);
        for (const secret of [scenario.partner.personality, scenario.partner.private, scenario.partner.reactions.good, scenario.partner.reactions.poor, ...scenario.strongSigns, ...scenario.traps]) if (!visible.includes(secret)) expect(text).not.toContain(secret);
      } else if (activity.kind === 'message-review') {
        const task = findMessageTask(activity.taskId)!;
        const visible = shown(task.title, task.situation, task.brief, task.received);
        for (const secret of task.mustInclude) if (!visible.includes(secret)) expect(text).not.toContain(secret);
      }
      // The explanation describes a strong answer; Tali coaches toward it without being handed it.
      expect(text).not.toContain(activity.explanation);
      expect(text).not.toContain('For your eyes only');
    }
  });

  test('the instructions say to coach with questions, never write the learner’s part, never invent experience or promise clients, and never reveal a hidden rubric', () => {
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/one hint at a time/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/Never write their headline, profile, proposal, outreach message or negotiation lines/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/Never invent or exaggerate their skills, experience, clients, reviews, testimonials, results or numbers/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/Never promise or imply that any step will win clients/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/cannot see live job listings/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/Never reveal, describe or guess the hidden side of a practice partner/);
    expect(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS).toMatch(/Taglish/);
  });

  test('every Finding International Clients lesson, quiz question, exercise and project carries them; other courses do not', () => {
    const lessonId = practiceActivities[0].lesson.id;
    for (const focus of [{ kind: 'lesson', lessonId }, { kind: 'quiz', lessonId, questionId: null }, asFocus(practiceActivities[0]), { kind: 'project', projectId: 'international-clients-p1' }] as CoachFocus[]) {
      expect(describeFocus(focus).join('\n')).toContain(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS);
    }
    const other = COURSES.find((entry) => entry.id !== INTERNATIONAL_CLIENTS_COURSE_ID && entry.id !== 'soft-skills-workplace')!;
    expect(describeFocus({ kind: 'lesson', lessonId: other.lessons[0].id }).join('\n')).not.toContain(INTERNATIONAL_CLIENTS_TEACHING_INSTRUCTIONS);
  });

  test('an unknown scenario or an ordinary activity gives nothing extra', () => {
    expect(describePracticeActivity({ kind: 'roleplay', scenarioId: 'no-such-scenario' })).toBeNull();
    expect(describePracticeActivity({ kind: 'message-review', taskId: 'nope' })).toBeNull();
    expect(describePracticeActivity({ kind: 'scenario' })).toBeNull();
  });
});
