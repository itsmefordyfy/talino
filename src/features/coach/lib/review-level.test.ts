import { describe, expect, test } from '@jest/globals';

import { EXPERIENCE_LEVELS } from '@/features/courses/content/levels';
import type { Project } from '@/features/courses/content/types';

import { buildReviewPrompt, parseReview, reviewRubric } from './review';

const original: Project = {
  id: 'fx-p1',
  title: 'A small site',
  summary: 'Build a page.',
  outcome: 'A page you can show.',
  unlockAfterDay: 1,
  steps: [{ id: 'fx-p1-s1', text: 'Build it' }],
  submission: { kind: 'url', label: 'Link', placeholder: '', hint: '' },
  rubric: ['It loads', 'It is explained', 'It is shared'],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['Plain words for each part'] },
    { audience: { min: 'advanced' }, items: ['Tests and error handling'] },
  ],
};

describe('the review checks the rubric the learner was shown', () => {
  test('shared criteria plus the extras for the level, built from the project, in every level', () => {
    expect(reviewRubric(original, original, 'beginner')).toEqual(['It loads', 'It is explained', 'It is shared', 'Plain words for each part']);
    expect(reviewRubric(original, original, 'intermediate')).toEqual(original.rubric);
    expect(reviewRubric(original, original, 'professional')).toEqual([...original.rubric, 'Tests and error handling']);
    for (const level of EXPERIENCE_LEVELS) expect(reviewRubric(original, original, level).slice(0, 3)).toEqual(original.rubric);
  });

  test('no level (an older app, or a skipped onboarding) is the shared rubric, which every level can meet', () => {
    expect(reviewRubric(original, original, null)).toEqual(original.rubric);
  });

  test('a translated project keeps its own wording and the original’s extras', () => {
    const translated: Project = { ...original, rubric: ['Nag-load', 'May paliwanag', 'Naibahagi'], rubricExtra: undefined };
    expect(reviewRubric(original, translated, 'professional')).toEqual(['Nag-load', 'May paliwanag', 'Naibahagi', 'Tests and error handling']);
  });

  test('the prompt lists exactly those criteria and says which level they are for', () => {
    const rubric = reviewRubric(original, original, 'complete-beginner');
    const prompt = buildReviewPrompt(original, 'AI Basics', 'en', rubric, 'complete-beginner');
    expect(prompt).toContain('4. Plain words for each part');
    expect(prompt).not.toContain('Tests and error handling');
    expect(prompt).toContain('Complete Beginner');
    expect(prompt).toContain('judge only against them');
    // Without a level the prompt is what it was.
    expect(buildReviewPrompt(original, 'AI Basics')).not.toContain('programming level');
    expect(buildReviewPrompt(original, 'AI Basics')).toContain('3. It is shared');
  });

  test('a pass needs every criterion of that level checked and met', () => {
    const rubric = reviewRubric(original, original, 'professional');
    const checks = (met: boolean[]) => JSON.stringify({ verdict: 'pass', summary: 'ok', checks: rubric.map((criterion, index) => ({ criterion, met: met[index] ?? true, note: '' })), nextSteps: [] });
    expect(parseReview(checks([]), rubric)?.verdict).toBe('pass');
    expect(parseReview(checks([true, true, true, false]), rubric)?.verdict).toBe('needs_work');
    // The shared rubric alone would not have noticed the missing extra check.
    const short = JSON.stringify({ verdict: 'pass', summary: 'ok', checks: original.rubric.map((criterion) => ({ criterion, met: true, note: '' })), nextSteps: [] });
    expect(parseReview(short, rubric)?.verdict).toBe('needs_work');
    expect(parseReview(short, original.rubric)?.verdict).toBe('pass');
  });
});
