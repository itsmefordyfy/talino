import { describe, expect, test } from '@jest/globals';

import { buildFlow, FLOW_CANDIDATE_SCORES, FLOW_STEP_IDS, FLOW_TOKEN_COUNT, FLOW_TOKEN_IDS } from './llm-transformer';

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

describe('the transformer schematic', () => {
  const flow = buildFlow();

  test('has seven steps and five tokens with different ids', () => {
    expect(FLOW_STEP_IDS).toHaveLength(7);
    expect(FLOW_TOKEN_COUNT).toBe(5);
    expect(new Set(FLOW_TOKEN_IDS).size).toBe(5);
  });

  test('every stage keeps one vector of three numbers per token, all finite', () => {
    for (const stage of [flow.embeddings, flow.positions, flow.withPosition, flow.attended, flow.processed]) {
      expect(stage).toHaveLength(FLOW_TOKEN_COUNT);
      for (const vector of stage) {
        expect(vector).toHaveLength(3);
        expect(vector.every(Number.isFinite)).toBe(true);
      }
    }
  });

  test('adding the position really adds the numbers', () => {
    flow.withPosition.forEach((vector, token) => vector.forEach((value, dimension) => expect(value).toBeCloseTo(flow.embeddings[token][dimension] + flow.positions[token][dimension], 10)));
  });

  test('attention weights add up to 1, only look at the tokens up to the current one, and the last token favours "cat"', () => {
    flow.attentionWeights.forEach((weights, token) => {
      expect(weights).toHaveLength(token + 1);
      expect(sum(weights)).toBeCloseTo(1, 10);
    });
    const last = flow.attentionWeights[FLOW_TOKEN_COUNT - 1];
    expect(last.indexOf(Math.max(...last))).toBe(1);
  });

  test('the first token attends only to itself, so attention leaves its vector alone; later tokens are a weighted mix', () => {
    flow.attended[0].forEach((value, dimension) => expect(value).toBeCloseTo(flow.withPosition[0][dimension], 10));
    const last = flow.attentionWeights[4];
    const expected = [0, 1, 2].map((dimension) => last.reduce((total, weight, source) => total + weight * flow.withPosition[source][dimension], 0));
    flow.attended[4].forEach((value, dimension) => expect(value).toBeCloseTo(expected[dimension], 10));
  });

  test('the feed-forward step only adds non-negative amounts to each number', () => {
    flow.processed.forEach((vector, token) => vector.forEach((value, dimension) => expect(value).toBeGreaterThanOrEqual(flow.attended[token][dimension] - 1e-12)));
  });

  test('the four candidates add up to 1, follow their scores and the most likely is picked', () => {
    expect(flow.candidateProbabilities).toHaveLength(4);
    expect(sum(flow.candidateProbabilities)).toBeCloseTo(1, 10);
    for (let i = 1; i < 4; i += 1) {
      expect(FLOW_CANDIDATE_SCORES[i]).toBeLessThan(FLOW_CANDIDATE_SCORES[i - 1]);
      expect(flow.candidateProbabilities[i]).toBeLessThan(flow.candidateProbabilities[i - 1]);
    }
    expect(flow.pickedCandidate).toBe(0);
  });

  test('is deterministic', () => {
    expect(buildFlow()).toEqual(flow);
  });
});
