import { describe, expect, test } from '@jest/globals';

import { addCriterion, addOption, blankMatrix, MATRIX_LIMITS, parseMatrixState, removeCriterion, removeOption, renameCriterion, renameOption, scoreMatrix, setScore, setWeight, type MatrixState } from './tradeoff';

/** Three criteria, two options; `scores[c][o]` is optional. */
function matrix(weights: number[], scores: (number | null)[][]): MatrixState {
  return {
    question: '',
    options: [
      { id: 'o1', name: 'A' },
      { id: 'o2', name: 'B' },
    ],
    criteria: weights.map((weight, index) => ({
      id: `c${index + 1}`,
      name: `Criterion ${index + 1}`,
      weight,
      scores: Object.fromEntries((scores[index] ?? []).flatMap((score, optionIndex) => (score === null ? [] : [[`o${optionIndex + 1}`, score]]))),
    })),
  };
}

describe('scoreMatrix', () => {
  test('an option score is the weighted average on the 1 to 5 scale', () => {
    const result = scoreMatrix(matrix([5, 1, 1], [[5, 1], [1, 5], [1, 5]]));
    expect(result.scores[0]!.average).toBeCloseTo((5 * 5 + 1 + 1) / 7);
    expect(result.scores[1]!.average).toBeCloseTo((5 + 5 + 5) / 7);
  });

  test('ranks the options and names a leader when the margin is half a point or more', () => {
    const result = scoreMatrix(matrix([3, 3, 3], [[5, 3], [4, 3], [5, 3]]));
    expect(result.verdict).toBe('leader');
    expect(result.leaderId).toBe('o1');
    expect(result.ranking.map((row) => row.optionId)).toEqual(['o1', 'o2']);
    expect(result.margin).toBeCloseTo(1.67, 2);
    expect(result.closeCriteria).toEqual([]);
  });

  test('a margin of exactly 0.5 names a leader; under 0.5 is too close to call', () => {
    expect(scoreMatrix(matrix([3, 3, 3], [[4, 3], [4, 3], [4, 3]])).verdict).toBe('leader'); // 4 vs 3: 1.0
    const closeResult = scoreMatrix(matrix([1, 1, 1, 1], [[4, 3], [3, 3], [3, 3], [3, 3]]));
    expect(closeResult.verdict).toBe('too_close');
    expect(closeResult.leaderId).toBeNull();
    const exact = scoreMatrix(matrix([1, 1], [[4, 3], [3, 3]]));
    expect(exact.margin).toBe(0.5);
    expect(exact.verdict).toBe('leader');
  });

  test('when too close, the criteria where the top two differ most are named, heaviest difference first, and no winner is declared', () => {
    const result = scoreMatrix(matrix([5, 2, 1], [[4, 3], [2, 4], [3, 3]]));
    // A: (20+4+3)/8 = 3.375; B: (15+8+3)/8 = 3.25
    expect(result.verdict).toBe('too_close');
    expect(result.leaderId).toBeNull();
    expect(result.closeCriteria.map((row) => row.criterionId)).toEqual(['c1', 'c2']);
    expect(result.closeCriteria[0]).toMatchObject({ weight: 5, higherOptionId: 'o1', higherScore: 4, lowerScore: 3 });
    expect(result.closeCriteria[1]).toMatchObject({ higherOptionId: 'o2' });
  });

  test('a tie is too close and an identical pair of options differ nowhere', () => {
    const result = scoreMatrix(matrix([3, 3, 3], [[3, 3], [4, 4], [2, 2]]));
    expect(result.margin).toBe(0);
    expect(result.verdict).toBe('too_close');
    expect(result.closeCriteria).toEqual([]);
  });

  test('is not ready until two options have scores; an unscored option has no average and is not ranked', () => {
    const empty = scoreMatrix(matrix([3, 3, 3], [[], [], []]));
    expect(empty.verdict).toBe('not_ready');
    expect(empty.scores.map((row) => row.average)).toEqual([null, null]);
    const onlyA = scoreMatrix(matrix([3, 3, 3], [[4], [4], [4]]));
    expect(onlyA.verdict).toBe('not_ready');
    expect(onlyA.ranking.map((row) => row.optionId)).toEqual(['o1']);
    expect(onlyA.margin).toBeNull();
  });

  test('warns when every weight is the same, when an option has no scores, and when fewer than three criteria differ', () => {
    const result = scoreMatrix(matrix([3, 3, 3], [[4], [4], [4]]));
    expect(result.warnings.map((w) => w.code)).toEqual(expect.arrayContaining(['same_weights', 'unscored_option']));
    expect(result.warnings.find((w) => w.code === 'unscored_option')).toMatchObject({ optionId: 'o2' });

    const few = scoreMatrix(matrix([1, 2, 3], [[4, 2], [3, 3], [3, 3]]));
    expect(few.warnings.map((w) => w.code)).toContain('few_differing');
    expect(few.warnings.map((w) => w.code)).not.toContain('same_weights');

    const fine = scoreMatrix(matrix([1, 2, 3], [[4, 2], [3, 5], [1, 3]]));
    expect(fine.warnings).toEqual([]);
  });

  test('does not say criteria fail to differ before two options have scores, and notes scores that are missing', () => {
    expect(scoreMatrix(matrix([1, 2, 3], [[], [], []])).warnings.map((w) => w.code)).toEqual(['unscored_option', 'unscored_option']);
    const partial = scoreMatrix(matrix([1, 2, 3], [[4, 2], [3, 5], [1]]));
    expect(partial.warnings.map((w) => w.code)).toContain('missing_scores');
  });

  test('three and four options rank in order and the margin is between the top two', () => {
    const state = addOption(addOption(matrix([1, 2, 3], [[5, 3], [5, 3], [5, 3]]), 'C'), 'D');
    const withScores = ['c1', 'c2', 'c3'].reduce((current, id) => setScore(setScore(current, id, 'o3', 4), id, 'o4', 1), state);
    const result = scoreMatrix(withScores);
    expect(result.ranking.map((row) => row.optionId)).toEqual(['o1', 'o3', 'o2', 'o4']);
    expect(result.margin).toBeCloseTo(1);
  });
});

describe('editing a matrix', () => {
  test('a blank matrix has two options and three criteria with the middle weight and no scores', () => {
    const blank = blankMatrix();
    expect(blank.options).toHaveLength(2);
    expect(blank.criteria).toHaveLength(3);
    expect(blank.criteria.every((criterion) => criterion.weight === 3 && Object.keys(criterion.scores).length === 0)).toBe(true);
  });

  test('weights and scores stay between 1 and 5, a score can be cleared, and unknown ids change nothing', () => {
    let state = blankMatrix();
    state = setWeight(state, 'c1', 9);
    expect(state.criteria[0]!.weight).toBe(5);
    state = setWeight(state, 'c1', 0);
    expect(state.criteria[0]!.weight).toBe(1);
    state = setScore(state, 'c1', 'o1', 7);
    expect(state.criteria[0]!.scores.o1).toBe(5);
    state = setScore(state, 'c1', 'o1', null);
    expect(state.criteria[0]!.scores).toEqual({});
    expect(setScore(state, 'nope', 'o1', 3)).toBe(state);
    expect(setScore(state, 'c1', 'nope', 3)).toBe(state);
    expect(setWeight(state, 'nope', 3)).toBe(state);
  });

  test('options stay between two and four and removing one drops its scores', () => {
    let state = setScore(blankMatrix(), 'c1', 'o2', 4);
    expect(removeOption(state, 'o2')).toBe(state); // only two
    state = addOption(state, 'C');
    state = addOption(state, 'D');
    expect(addOption(state, 'E')).toBe(state);
    expect(state.options.map((option) => option.id)).toEqual(['o1', 'o2', 'o3', 'o4']);
    state = removeOption(state, 'o2');
    expect(state.options.map((option) => option.id)).toEqual(['o1', 'o3', 'o4']);
    expect(state.criteria[0]!.scores).toEqual({});
    // an id of a removed option is never reused for a different option while the old one's scores could linger
    expect(addOption(state, 'E').options.at(-1)!.id).toBe('o5');
  });

  test('criteria stay between three and eight', () => {
    let state = blankMatrix();
    expect(removeCriterion(state, 'c1')).toBe(state);
    while (state.criteria.length < MATRIX_LIMITS.maxCriteria) state = addCriterion(state, `Extra ${state.criteria.length}`);
    expect(addCriterion(state, 'Too many')).toBe(state);
    state = removeCriterion(state, 'c2');
    expect(state.criteria).toHaveLength(MATRIX_LIMITS.maxCriteria - 1);
    expect(addCriterion(state, 'New').criteria.at(-1)!.weight).toBe(3);
  });

  test('names are trimmed to their limits', () => {
    let state = renameOption(blankMatrix(), 'o1', `  ${'x'.repeat(200)}  `);
    expect(state.options[0]!.name).toHaveLength(MATRIX_LIMITS.maxName);
    state = renameCriterion(state, 'c1', 'Speed');
    expect(state.criteria[0]!.name).toBe('Speed');
  });
});

describe('parseMatrixState', () => {
  const valid = JSON.parse(JSON.stringify(matrix([1, 2, 3], [[4, 2], [3, 5], [1, 3]]))) as unknown;

  test('reads a saved matrix back', () => {
    expect(parseMatrixState(valid)).toEqual(valid);
    expect(parseMatrixState(JSON.stringify(valid))).toEqual(valid);
  });

  test('refuses anything that is not a matrix with two options and three criteria', () => {
    for (const bad of [null, undefined, 4, 'x', [], {}, { options: [], criteria: [] }, '{not json', { options: [{ id: 'a', name: 'A' }], criteria: [] }]) expect(parseMatrixState(bad)).toBeNull();
    const twoCriteria = { ...(valid as MatrixState), criteria: (valid as MatrixState).criteria.slice(0, 2) };
    expect(parseMatrixState(twoCriteria)).toBeNull();
  });

  test('repairs what it can: clamps weights and scores, drops unknown scores, duplicate ids, extra options and criteria, and blank names', () => {
    const messy = {
      question: 5,
      options: [
        { id: 'o1', name: ' A ' },
        { id: 'o1', name: 'dup' },
        { id: 'o2', name: '' },
        { id: 'o3', name: 'C' },
        { id: 'o4', name: 'D' },
        { id: 'o5', name: 'E' },
      ],
      criteria: Array.from({ length: 10 }, (_, index) => ({ id: `c${index}`, name: `N${index}`, weight: index === 0 ? 99 : index === 1 ? 'x' : 2.6, scores: { o1: 9, o2: 'no', o3: 2.4, ghost: 3 } })),
    };
    const state = parseMatrixState(messy)!;
    expect(state.question).toBe('');
    expect(state.options.map((option) => option.id)).toEqual(['o1', 'o2', 'o3', 'o4']);
    expect(state.options.map((option) => option.name)).toEqual(['A', 'Option 2', 'C', 'D']);
    expect(state.criteria).toHaveLength(MATRIX_LIMITS.maxCriteria);
    expect(state.criteria[0]!.weight).toBe(5);
    expect(state.criteria[1]!.weight).toBe(3);
    expect(state.criteria[2]!.weight).toBe(3);
    expect(state.criteria[0]!.scores).toEqual({ o1: 5, o3: 2 });
  });
});
