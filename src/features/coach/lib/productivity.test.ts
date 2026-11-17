import { describe, expect, test } from '@jest/globals';

import { PLANNING_SAMPLES } from '@/features/productivity/lib/samples';

import { describePlanningActivity, isProductivityLesson, isProductivityProject, PRODUCTIVITY_TEACHING_INSTRUCTIONS, productivitySuggestionKey } from './productivity';

describe('the productivity coach context', () => {
  test('lesson and project ids are recognised only for this course', () => {
    expect(isProductivityLesson('time-management-productivity-07')).toBe(true);
    expect(isProductivityLesson('soft-skills-workplace-07')).toBe(false);
    expect(isProductivityProject('time-management-productivity-p2')).toBe(true);
    expect(isProductivityProject('time-management-productivity-07')).toBe(false);
  });

  test('suggested questions have their own set in this course and none elsewhere', () => {
    expect(productivitySuggestionKey({ kind: 'lesson', lessonId: 'time-management-productivity-01' }, 'lesson')).toBe('lesson-prod');
    expect(productivitySuggestionKey({ kind: 'activity', lessonId: 'time-management-productivity-01', activityId: 'x' }, 'activity')).toBe('activity-prod');
    expect(productivitySuggestionKey({ kind: 'project', projectId: 'time-management-productivity-p1' }, 'project')).toBe('project-prod');
    expect(productivitySuggestionKey({ kind: 'lesson', lessonId: 'developer-01' }, 'lesson')).toBeNull();
    expect(productivitySuggestionKey(null, 'lesson')).toBeNull();
  });

  test('the instructions refuse to claim knowledge of the learner and to push overwork', () => {
    expect(PRODUCTIVITY_TEACHING_INSTRUCTIONS).toMatch(/cannot see their calendar/);
    expect(PRODUCTIVITY_TEACHING_INSTRUCTIONS).toMatch(/never claim to know how they usually behave/);
    expect(PRODUCTIVITY_TEACHING_INSTRUCTIONS).toMatch(/Never encourage overwork/);
    expect(PRODUCTIVITY_TEACHING_INSTRUCTIONS).toMatch(/doctor or counsellor/);
  });

  test('a sorting exercise is described by its tasks only, never by the answer or the reasons', () => {
    const sort = PLANNING_SAMPLES.find((sample) => sample.challenge.mode === 'prioritize')!;
    const text = describePlanningActivity(sort)!;
    expect(text).toContain('Send the invoice that is due at 5 PM');
    if (sort.challenge.mode === 'prioritize') for (const task of sort.challenge.tasks) expect(text).not.toContain(task.why);
    expect(text).not.toMatch(/expected|alsoAcceptable/);
  });

  test('a day-planning exercise shows the rules the screen shows, and never the reference plan', () => {
    const day = PLANNING_SAMPLES.find((sample) => sample.challenge.mode === 'schedule')!;
    const text = describePlanningActivity(day)!;
    expect(text).toContain('8:00 AM to 4:00 PM');
    expect(text).toContain('Finish the client report: about 2 h');
    expect(text).toContain('must be done today');
    expect(text).toMatch(/at most 2 h of work without a break/);
    expect(text).not.toMatch(/defer|solution|okActions/);
  });

  test('other activities are not described as planning', () => {
    expect(describePlanningActivity({ kind: 'scenario' })).toBeNull();
  });
});
