import { describe, expect, test } from '@jest/globals';

import { AI_AGENTS_TEACHING_INSTRUCTIONS, aiAgentsSuggestionKey, isAiAgentsLesson, isAiAgentsProject } from './ai-agents';

describe('the Building AI Agents coach context', () => {
  test('lesson and project ids are recognised only for this course, including three-digit days', () => {
    expect(isAiAgentsLesson('building-ai-agents-01')).toBe(true);
    expect(isAiAgentsLesson('building-ai-agents-99')).toBe(true);
    expect(isAiAgentsLesson('building-ai-agents-109')).toBe(true);
    expect(isAiAgentsLesson('ai-automation-business-54')).toBe(false);
    expect(isAiAgentsLesson('building-ai-agents-p3')).toBe(false);
    expect(isAiAgentsProject('building-ai-agents-p8')).toBe(true);
    expect(isAiAgentsProject('building-ai-agents-24')).toBe(false);
  });

  test('suggested questions have their own set in this course and none elsewhere', () => {
    expect(aiAgentsSuggestionKey({ kind: 'lesson', lessonId: 'building-ai-agents-101' }, 'lesson')).toBe('lesson-agent');
    expect(aiAgentsSuggestionKey({ kind: 'quiz', lessonId: 'building-ai-agents-05', questionId: null }, 'quiz')).toBe('quiz-agent');
    expect(aiAgentsSuggestionKey({ kind: 'activity', lessonId: 'building-ai-agents-05', activityId: 'x' }, 'activity')).toBe('activity-agent');
    expect(aiAgentsSuggestionKey({ kind: 'project', projectId: 'building-ai-agents-p1' }, 'project')).toBe('project-agent');
    expect(aiAgentsSuggestionKey({ kind: 'lesson', lessonId: 'developer-01' }, 'lesson')).toBeNull();
    expect(aiAgentsSuggestionKey(null, 'lesson')).toBeNull();
  });

  test('the instructions keep a person in charge, refuse secrets, never invent SDK facts and never write the learner\'s agent', () => {
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/Never write the learner's finished agent/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/Never ask for or accept an API key/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/Never invent what an SDK, a framework, a model or a vendor offers/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/untrusted data/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/where a person approves/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/unrestricted access/);
    expect(AI_AGENTS_TEACHING_INSTRUCTIONS).toMatch(/maximum steps/);
  });
});
