import { describe, expect, test } from '@jest/globals';

import { MATRIX_LIMITS, parseMatrixState, scoreMatrix } from './tradeoff';
import { TRADEOFF_PRESETS } from './tradeoff-presets';

describe('trade-off presets', () => {
  test('there is a blank start and the three TindaTrack comparisons', () => {
    expect(TRADEOFF_PRESETS.map((preset) => preset.id)).toEqual(['blank', 'style', 'database', 'api']);
  });

  test.each(TRADEOFF_PRESETS.map((preset) => [preset.id, preset] as const))('%s is a valid matrix with nothing decided: neutral weights and no scores', (_id, preset) => {
    const state = preset.build();
    expect(parseMatrixState(state)).toEqual(state);
    expect(state.options.length).toBeGreaterThanOrEqual(MATRIX_LIMITS.minOptions);
    expect(state.options.length).toBeLessThanOrEqual(MATRIX_LIMITS.maxOptions);
    expect(state.criteria.length).toBeGreaterThanOrEqual(MATRIX_LIMITS.minCriteria);
    expect(state.criteria.length).toBeLessThanOrEqual(MATRIX_LIMITS.maxCriteria);
    expect(state.criteria.every((criterion) => criterion.weight === MATRIX_LIMITS.neutralWeight && Object.keys(criterion.scores).length === 0)).toBe(true);
    const result = scoreMatrix(state);
    expect(result.verdict).toBe('not_ready');
    expect(result.leaderId).toBeNull();
  });

  test('the comparisons name the options the lessons compare', () => {
    const names = (id: string) => TRADEOFF_PRESETS.find((preset) => preset.id === id)!.build().options.map((option) => option.name);
    expect(names('style')).toEqual(['Single monolith', 'Modular monolith', 'Microservices']);
    expect(names('database')).toHaveLength(2);
    expect(names('api')).toEqual(['REST', 'GraphQL']);
  });
});
