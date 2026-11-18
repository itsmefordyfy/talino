/**
 * The trade-off matrix: options scored against weighted criteria. Everything here is pure (no storage, no React), so the rules the learner reads
 * ("too close to call", the warnings) are tested directly. The matrix organises the learner's own judgment; it never decides for them.
 */

export const MATRIX_LIMITS = {
  minOptions: 2,
  maxOptions: 4,
  minCriteria: 3,
  maxCriteria: 8,
  minRating: 1,
  maxRating: 5,
  /** The weight a new criterion starts with: the middle of the scale, so nothing is decided before the learner decides it. */
  neutralWeight: 3,
  maxName: 60,
  maxQuestion: 160,
  /** A margin under this (on the 1 to 5 scale) is too close to call. */
  closeMargin: 0.5,
} as const;

export type MatrixOption = { id: string; name: string };
export type MatrixCriterion = {
  id: string;
  name: string;
  /** How much the quality matters, 1 to 5. */
  weight: number;
  /** Score 1 to 5 by option id; an option with no entry has not been scored on this criterion yet. */
  scores: Record<string, number>;
};
export type MatrixState = { question: string; options: MatrixOption[]; criteria: MatrixCriterion[] };

const clampRating = (value: number) => Math.min(MATRIX_LIMITS.maxRating, Math.max(MATRIX_LIMITS.minRating, Math.round(value)));
const cleanName = (name: string) => name.trim().slice(0, MATRIX_LIMITS.maxName);

export function blankMatrix(): MatrixState {
  return {
    question: '',
    options: [
      { id: 'o1', name: 'Option 1' },
      { id: 'o2', name: 'Option 2' },
    ],
    criteria: [1, 2, 3].map((n) => ({ id: `c${n}`, name: `Quality ${n}`, weight: MATRIX_LIMITS.neutralWeight, scores: {} })),
  };
}

/* --------------------------------- scoring -------------------------------- */

export type OptionScore = {
  optionId: string;
  name: string;
  /** The weighted average of this option's scores on the 1 to 5 scale, or null when it has none yet. */
  average: number | null;
  scored: number;
  missing: number;
};

export type CloseCriterion = {
  criterionId: string;
  name: string;
  weight: number;
  higherOptionId: string;
  higherScore: number;
  lowerOptionId: string;
  lowerScore: number;
  difference: number;
};

export type MatrixWarning =
  | { code: 'same_weights' }
  | { code: 'few_differing'; count: number }
  | { code: 'unscored_option'; optionId: string }
  | { code: 'missing_scores'; count: number };

export type MatrixVerdict = 'not_ready' | 'leader' | 'too_close';

export type MatrixResult = {
  /** In the order the options are listed. */
  scores: OptionScore[];
  /** Options that have any score, best first (a tie keeps the listed order). */
  ranking: OptionScore[];
  /** The gap between the top two, to two decimals; null with fewer than two scored options. */
  margin: number | null;
  verdict: MatrixVerdict;
  /** Set only when the verdict is `leader`. */
  leaderId: string | null;
  /** Only when too close: where the top two differ most (weight times gap, biggest first), so the learner looks there instead of at a total. */
  closeCriteria: CloseCriterion[];
  warnings: MatrixWarning[];
};

const MAX_CLOSE_CRITERIA = 3;

export function scoreMatrix(state: MatrixState): MatrixResult {
  const scores: OptionScore[] = state.options.map((option) => {
    let weighted = 0;
    let weights = 0;
    let scored = 0;
    for (const criterion of state.criteria) {
      const score = criterion.scores[option.id];
      if (score === undefined) continue;
      weighted += criterion.weight * score;
      weights += criterion.weight;
      scored += 1;
    }
    return { optionId: option.id, name: option.name, average: scored > 0 && weights > 0 ? weighted / weights : null, scored, missing: state.criteria.length - scored };
  });

  const ranking = scores.filter((row) => row.average !== null).sort((a, b) => (b.average as number) - (a.average as number));
  const [first, second] = ranking;
  const rawMargin = first && second ? (first.average as number) - (second.average as number) : null;
  const margin = rawMargin === null ? null : Math.round(rawMargin * 100) / 100;
  // Judged on the unrounded gap (with a hair of room for floating point), so 0.496 is never rounded up into a winner.
  const verdict: MatrixVerdict = rawMargin === null ? 'not_ready' : rawMargin < MATRIX_LIMITS.closeMargin - 1e-9 ? 'too_close' : 'leader';

  const closeCriteria: CloseCriterion[] = [];
  if (verdict === 'too_close' && first && second) {
    for (const criterion of state.criteria) {
      const a = criterion.scores[first.optionId];
      const b = criterion.scores[second.optionId];
      if (a === undefined || b === undefined || a === b) continue;
      const aHigher = a > b;
      closeCriteria.push({
        criterionId: criterion.id,
        name: criterion.name,
        weight: criterion.weight,
        higherOptionId: aHigher ? first.optionId : second.optionId,
        higherScore: aHigher ? a : b,
        lowerOptionId: aHigher ? second.optionId : first.optionId,
        lowerScore: aHigher ? b : a,
        difference: Math.abs(a - b),
      });
    }
    closeCriteria.sort((x, y) => y.weight * y.difference - x.weight * x.difference);
    closeCriteria.length = Math.min(closeCriteria.length, MAX_CLOSE_CRITERIA);
  }

  return { scores, ranking, margin, verdict, leaderId: verdict === 'leader' && first ? first.optionId : null, closeCriteria, warnings: warningsFor(state, scores) };
}

function warningsFor(state: MatrixState, scores: OptionScore[]): MatrixWarning[] {
  const warnings: MatrixWarning[] = [];
  const firstWeight = state.criteria[0]?.weight;
  if (state.criteria.length > 1 && state.criteria.every((criterion) => criterion.weight === firstWeight)) warnings.push({ code: 'same_weights' });
  for (const row of scores) if (row.scored === 0) warnings.push({ code: 'unscored_option', optionId: row.optionId });
  const partial = scores.filter((row) => row.scored > 0).reduce((total, row) => total + row.missing, 0);
  if (partial > 0) warnings.push({ code: 'missing_scores', count: partial });
  // "Criteria that differ" only means something once two options have scores to compare.
  if (scores.filter((row) => row.scored > 0).length >= 2) {
    const differing = state.criteria.filter((criterion) => new Set(Object.values(criterion.scores)).size > 1 && Object.keys(criterion.scores).length > 1).length;
    if (differing < 3) warnings.push({ code: 'few_differing', count: differing });
  }
  return warnings;
}

/* --------------------------------- editing -------------------------------- */

const mapCriterion = (state: MatrixState, id: string, change: (criterion: MatrixCriterion) => MatrixCriterion): MatrixState => {
  if (!state.criteria.some((criterion) => criterion.id === id)) return state;
  return { ...state, criteria: state.criteria.map((criterion) => (criterion.id === id ? change(criterion) : criterion)) };
};

const nextId = (prefix: string, ids: readonly string[]) => {
  const highest = ids.reduce((top, id) => (id.startsWith(prefix) && /^\d+$/.test(id.slice(prefix.length)) ? Math.max(top, Number(id.slice(prefix.length))) : top), 0);
  return `${prefix}${highest + 1}`;
};

export const setQuestion = (state: MatrixState, question: string): MatrixState => ({ ...state, question: question.slice(0, MATRIX_LIMITS.maxQuestion) });

export const setWeight = (state: MatrixState, criterionId: string, weight: number): MatrixState => mapCriterion(state, criterionId, (criterion) => ({ ...criterion, weight: clampRating(weight) }));

/** `null` clears the score. An unknown criterion or option changes nothing. */
export function setScore(state: MatrixState, criterionId: string, optionId: string, score: number | null): MatrixState {
  if (!state.options.some((option) => option.id === optionId)) return state;
  return mapCriterion(state, criterionId, (criterion) => {
    const scores = { ...criterion.scores };
    if (score === null) delete scores[optionId];
    else scores[optionId] = clampRating(score);
    return { ...criterion, scores };
  });
}

export const renameOption = (state: MatrixState, optionId: string, name: string): MatrixState => ({
  ...state,
  options: state.options.map((option) => (option.id === optionId ? { ...option, name: name.slice(0, MATRIX_LIMITS.maxName) } : option)),
});

export const renameCriterion = (state: MatrixState, criterionId: string, name: string): MatrixState => mapCriterion(state, criterionId, (criterion) => ({ ...criterion, name: name.slice(0, MATRIX_LIMITS.maxName) }));

export function addOption(state: MatrixState, name: string): MatrixState {
  if (state.options.length >= MATRIX_LIMITS.maxOptions) return state;
  const id = nextId('o', state.options.map((option) => option.id));
  return { ...state, options: [...state.options, { id, name: cleanName(name) || `Option ${state.options.length + 1}` }] };
}

export function removeOption(state: MatrixState, optionId: string): MatrixState {
  if (state.options.length <= MATRIX_LIMITS.minOptions || !state.options.some((option) => option.id === optionId)) return state;
  return {
    ...state,
    options: state.options.filter((option) => option.id !== optionId),
    criteria: state.criteria.map((criterion) => {
      const scores = { ...criterion.scores };
      delete scores[optionId];
      return { ...criterion, scores };
    }),
  };
}

export function addCriterion(state: MatrixState, name: string): MatrixState {
  if (state.criteria.length >= MATRIX_LIMITS.maxCriteria) return state;
  const id = nextId('c', state.criteria.map((criterion) => criterion.id));
  return { ...state, criteria: [...state.criteria, { id, name: cleanName(name) || `Quality ${state.criteria.length + 1}`, weight: MATRIX_LIMITS.neutralWeight, scores: {} }] };
}

export function removeCriterion(state: MatrixState, criterionId: string): MatrixState {
  if (state.criteria.length <= MATRIX_LIMITS.minCriteria || !state.criteria.some((criterion) => criterion.id === criterionId)) return state;
  return { ...state, criteria: state.criteria.filter((criterion) => criterion.id !== criterionId) };
}

/* --------------------------------- reading -------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const ID = /^[A-Za-z0-9_-]{1,32}$/;

/**
 * Reads a saved matrix (an object or its JSON text) defensively: a saved row can be old, edited or damaged. Weights and scores are clamped into 1 to 5,
 * a bad weight becomes the neutral one, unknown scores and duplicate ids are dropped, extra options and criteria are cut, a blank name gets a plain one.
 * Fewer than two options or three criteria is not a matrix, so it returns null and the tool starts a fresh one.
 */
export function parseMatrixState(input: unknown): MatrixState | null {
  let value = input;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!isRecord(value) || !Array.isArray(value.options) || !Array.isArray(value.criteria)) return null;

  const options: MatrixOption[] = [];
  for (const raw of value.options) {
    if (!isRecord(raw) || typeof raw.id !== 'string' || !ID.test(raw.id) || options.some((option) => option.id === raw.id)) continue;
    if (options.length >= MATRIX_LIMITS.maxOptions) break;
    options.push({ id: raw.id, name: typeof raw.name === 'string' && raw.name.trim() ? cleanName(raw.name) : `Option ${options.length + 1}` });
  }
  if (options.length < MATRIX_LIMITS.minOptions) return null;

  const criteria: MatrixCriterion[] = [];
  for (const raw of value.criteria) {
    if (!isRecord(raw) || typeof raw.id !== 'string' || !ID.test(raw.id) || criteria.some((criterion) => criterion.id === raw.id)) continue;
    if (criteria.length >= MATRIX_LIMITS.maxCriteria) break;
    const scores: Record<string, number> = {};
    if (isRecord(raw.scores)) {
      for (const option of options) {
        const score = raw.scores[option.id];
        if (typeof score === 'number' && Number.isFinite(score)) scores[option.id] = clampRating(score);
      }
    }
    criteria.push({
      id: raw.id,
      name: typeof raw.name === 'string' && raw.name.trim() ? cleanName(raw.name) : `Quality ${criteria.length + 1}`,
      weight: typeof raw.weight === 'number' && Number.isFinite(raw.weight) ? clampRating(raw.weight) : MATRIX_LIMITS.neutralWeight,
      scores,
    });
  }
  if (criteria.length < MATRIX_LIMITS.minCriteria) return null;

  return { question: typeof value.question === 'string' ? value.question.slice(0, MATRIX_LIMITS.maxQuestion) : '', options, criteria };
}

export const serializeMatrix = (state: MatrixState): string => JSON.stringify(state);
