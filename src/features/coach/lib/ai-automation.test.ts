import { describe, expect, test } from '@jest/globals';

import { AI_AUTOMATION_TEACHING_INSTRUCTIONS, aiAutomationSuggestionKey, isAiAutomationLesson, isAiAutomationProject } from './ai-automation';

describe('the AI automation coach context', () => {
  test('lesson and project ids are recognised only for this course', () => {
    expect(isAiAutomationLesson('ai-automation-business-54')).toBe(true);
    expect(isAiAutomationLesson('time-management-productivity-07')).toBe(false);
    expect(isAiAutomationProject('ai-automation-business-p5')).toBe(true);
    expect(isAiAutomationProject('ai-automation-business-54')).toBe(false);
  });

  test('suggested questions have their own set in this course and none elsewhere', () => {
    expect(aiAutomationSuggestionKey({ kind: 'lesson', lessonId: 'ai-automation-business-01' }, 'lesson')).toBe('lesson-auto');
    expect(aiAutomationSuggestionKey({ kind: 'quiz', lessonId: 'ai-automation-business-01', questionId: null }, 'quiz')).toBe('quiz-auto');
    expect(aiAutomationSuggestionKey({ kind: 'activity', lessonId: 'ai-automation-business-01', activityId: 'x' }, 'activity')).toBe('activity-auto');
    expect(aiAutomationSuggestionKey({ kind: 'project', projectId: 'ai-automation-business-p1' }, 'project')).toBe('project-auto');
    expect(aiAutomationSuggestionKey({ kind: 'lesson', lessonId: 'developer-01' }, 'lesson')).toBeNull();
    expect(aiAutomationSuggestionKey(null, 'lesson')).toBeNull();
  });

  test('the instructions keep a person in charge, refuse secrets and do not pretend the app runs automations', () => {
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/does not connect to Zapier, Make, n8n/);
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/always need a person to approve/);
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/Never ask for or accept a password, an API key/);
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/Never invent what a tool or platform can do/);
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/Never write the finished workflow/);
    expect(AI_AUTOMATION_TEACHING_INSTRUCTIONS).toMatch(/Never promise income/);
  });
});
