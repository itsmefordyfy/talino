import { describe, expect, test } from '@jest/globals';

import { DIAGRAM_REVIEW_QUESTION, MATRIX_REVIEW_QUESTION, matrixAsText, MAX_PROMPT_WORK_CHARS, reviewDiagramPrompt, reviewMatrixPrompt } from './tali-prompts';
import { blankMatrix, setScore } from './tradeoff';

describe('Tali review prompts', () => {
  test('the diagram prompt carries the learner source and the review question', () => {
    const prompt = reviewDiagramPrompt('flowchart TD\r\n  A --> B\r\n');
    expect(prompt).toContain('flowchart TD\n  A --> B');
    expect(prompt).not.toContain('\r');
    expect(prompt.endsWith(DIAGRAM_REVIEW_QUESTION)).toBe(true);
    expect(DIAGRAM_REVIEW_QUESTION).toBe('Review this diagram: what assumptions does it make, what is missing, and what would you ask me?');
  });

  test('a long source is clipped and says so; an empty one asks the question alone', () => {
    const long = reviewDiagramPrompt(`flowchart TD\n${'  A --> B\n'.repeat(500)}`);
    expect(long.length).toBeLessThan(MAX_PROMPT_WORK_CHARS + 400);
    expect(long).toContain('(clipped)');
    expect(long.endsWith(DIAGRAM_REVIEW_QUESTION)).toBe(true);
    expect(reviewDiagramPrompt('   \n')).toBe(DIAGRAM_REVIEW_QUESTION);
  });

  test('the matrix prompt lists options, weights and scores, saying what has not been scored', () => {
    let state = blankMatrix();
    state = { ...state, question: 'Monolith or microservices?' };
    state = setScore(state, 'c1', 'o1', 4);
    const text = matrixAsText(state);
    expect(text).toContain('Decision: Monolith or microservices?');
    expect(text).toContain('Options: Option 1; Option 2');
    expect(text).toContain('- Quality 1 (weight 3): Option 1 4, Option 2 not scored');
    const prompt = reviewMatrixPrompt(state);
    expect(prompt).toContain(text);
    expect(prompt.endsWith(MATRIX_REVIEW_QUESTION)).toBe(true);
  });
});
