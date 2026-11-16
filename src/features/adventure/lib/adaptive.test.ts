import { describe, expect, test } from '@jest/globals';

import { adaptiveSummary, baseGuidance, guidanceFor, isStruggle, masteryScore, recommendFor, shiftGuidance, type ActivityLike, type AttemptLike } from './adaptive';

let clock = 0;
const at = () => new Date(Date.UTC(2026, 10, 1, 0, 0, clock++)).toISOString();
const attempt = (activity: string, kind: string, correct: boolean, hints = 0, overrides: Partial<AttemptLike> = {}): AttemptLike => ({ activity_id: activity, lesson_id: 'dev-01', course_id: 'dev', kind, correct: correct ? 1 : 0, hints_used: hints, created_at: at(), ...overrides });
const row = (activity: string, kind: string, solved: boolean, wrong = 0, hints = 0): ActivityLike => ({ activity_id: activity, lesson_id: 'dev-01', course_id: 'dev', kind, solved: solved ? 1 : 0, attempts: wrong + 1, wrong, hints_used: hints });

describe('baseGuidance', () => {
  test('from the declared experience', () => {
    expect(baseGuidance('complete-beginner')).toBe('guided');
    expect(baseGuidance('beginner')).toBe('guided');
    expect(baseGuidance('intermediate')).toBe('standard');
    expect(baseGuidance('advanced')).toBe('independent');
    expect(baseGuidance('professional')).toBe('independent');
    expect(baseGuidance(null)).toBe('standard');
    expect(baseGuidance('something-else')).toBe('standard');
  });

  test('shiftGuidance stays within the three levels', () => {
    expect(shiftGuidance('guided', -1)).toBe('guided');
    expect(shiftGuidance('independent', 1)).toBe('independent');
    expect(shiftGuidance('standard', 1)).toBe('independent');
    expect(shiftGuidance('standard', -1)).toBe('guided');
    expect(shiftGuidance('independent', -1)).toBe('standard');
  });
});

describe('adaptiveSummary', () => {
  test('no history: the declared level, no recommendation', () => {
    const summary = adaptiveSummary([], [], 'intermediate');
    expect(summary).toMatchObject({ base: 'standard', guidance: 'standard', recommendation: null, concepts: [], struggling: [], focus: null });
  });

  test('three struggles among the last five give more guidance and a recommendation', () => {
    const attempts = [attempt('a1', 'fix-bug', true), attempt('a2', 'fix-bug', false), attempt('a3', 'fix-bug', false), attempt('a4', 'fix-bug', true, 2), attempt('a5', 'fix-bug', true)];
    const summary = adaptiveSummary([row('a1', 'fix-bug', true), row('a2', 'fix-bug', true, 1), row('a3', 'fix-bug', true, 1), row('a4', 'fix-bug', true, 0, 2), row('a5', 'fix-bug', true)], attempts, 'intermediate');
    const concept = summary.concepts.find((entry) => entry.concept === 'fix-bug');
    expect(concept?.recentStruggles).toBe(3);
    expect(concept?.guidance).toBe('guided');
    expect(adaptiveSummary([], attempts, 'advanced').concepts[0].guidance).toBe('standard');
    expect(concept?.recommendation).toBe('smaller-practice');
    expect(summary.struggling).toEqual(['fix-bug']);
    expect(summary.focus).toEqual({ concept: 'fix-bug', recommendation: 'smaller-practice' });
    expect(summary.guidance).toBe('guided');
  });

  test('two struggles are not enough', () => {
    const attempts = [attempt('a1', 'match', false), attempt('a2', 'match', false), attempt('a3', 'match', true), attempt('a4', 'match', true)];
    expect(adaptiveSummary([], attempts, 'intermediate').guidance).toBe('standard');
  });

  test('old struggles fall out of the recent window', () => {
    const attempts = [attempt('a1', 'match', false), attempt('a2', 'match', false), attempt('a3', 'match', false), attempt('a4', 'match', true), attempt('a5', 'match', true), attempt('a6', 'match', true), attempt('a7', 'match', true)];
    expect(adaptiveSummary([], attempts, 'intermediate').concepts[0].recentStruggles).toBe(1);
  });

  test('a streak of clean solves lowers guidance and suggests a harder challenge', () => {
    const attempts = ['a1', 'a2', 'a3', 'a4'].map((id) => attempt(id, 'predict-output', true));
    const summary = adaptiveSummary([], attempts, 'beginner');
    expect(summary.base).toBe('guided');
    expect(summary.guidance).toBe('standard');
    const standard = adaptiveSummary([], attempts, 'intermediate');
    expect(standard.guidance).toBe('independent');
    expect(standard.recommendation).toBe('harder-challenge');
    expect(adaptiveSummary([], attempts, 'advanced').guidance).toBe('independent');
  });

  test('a hint or a wrong try breaks the clean streak; replays of a solved activity are ignored', () => {
    const broken = [attempt('a1', 'match', true), attempt('a2', 'match', true), attempt('a3', 'match', true, 1), attempt('a4', 'match', true), attempt('a5', 'match', true)];
    expect(adaptiveSummary([], broken, 'intermediate').guidance).toBe('standard');
    const replays = [attempt('a1', 'match', true), attempt('a1', 'match', true), attempt('a1', 'match', true), attempt('a1', 'match', true)];
    expect(adaptiveSummary([], replays, 'intermediate').guidance).toBe('standard');
  });

  test('speed is never judged: duration changes nothing', () => {
    const slow = [attempt('a1', 'fix-bug', true, 0, { duration_ms: 900_000 } as Partial<AttemptLike>), attempt('a2', 'fix-bug', true), attempt('a3', 'fix-bug', true), attempt('a4', 'fix-bug', true)];
    const fast = slow.map((entry) => ({ ...entry, duration_ms: 1 }));
    expect(adaptiveSummary([], slow, 'intermediate')).toEqual(adaptiveSummary([], fast, 'intermediate'));
  });

  test('the recommendation follows the kind of the struggle', () => {
    expect(recommendFor('code-challenge')).toBe('smaller-practice');
    expect(recommendFor('sql-challenge')).toBe('smaller-practice');
    expect(recommendFor('predict-output')).toBe('visual');
    expect(recommendFor('arrange')).toBe('visual');
    expect(recommendFor('scenario')).toBe('simpler-explanation');
    expect(recommendFor('fill-blank')).toBe('simpler-explanation');
  });

  test('struggles on one concept do not change another', () => {
    const attempts = [attempt('a1', 'fix-bug', false), attempt('a2', 'fix-bug', false), attempt('a3', 'fix-bug', false), attempt('b1', 'match', true), attempt('b2', 'match', true)];
    const summary = adaptiveSummary([], attempts, 'intermediate');
    expect(guidanceFor(summary, 'fix-bug')).toBe('guided');
    expect(guidanceFor(summary, 'match')).toBe('standard');
    expect(guidanceFor(summary, 'unknown-concept')).toBe(summary.guidance);
  });

  test('a concept mapper groups attempts by skill instead of kind, and reading is ignored', () => {
    const attempts = [attempt('a1', 'fix-bug', false), attempt('a2', 'match', false), attempt('a3', 'scenario', false), attempt('a4', 'tap-reveal', false)];
    const summary = adaptiveSummary([], attempts, 'intermediate', () => ['dev:testing']);
    expect(summary.concepts).toHaveLength(1);
    expect(summary.concepts[0]).toMatchObject({ concept: 'dev:testing', attempts: 3, recentStruggles: 3 });
  });

  test('mastery rewards care and consistency, not speed', () => {
    expect(masteryScore([])).toBe(0);
    expect(masteryScore([row('a', 'match', true), row('b', 'match', true)])).toBe(1);
    expect(masteryScore([row('a', 'match', true, 3, 3)])).toBe(0.5);
    expect(masteryScore([row('a', 'match', false)])).toBe(0.15);
    // Improving over time scores higher than declining.
    const improving = masteryScore([row('a', 'match', false), row('b', 'match', true, 1), row('c', 'match', true)]);
    const declining = masteryScore([row('a', 'match', true), row('b', 'match', true, 1), row('c', 'match', false)]);
    expect(improving).toBeGreaterThan(declining);
  });

  test('bands', () => {
    const rows = [row('a', 'match', true), row('b', 'match', true), row('c', 'match', true)];
    expect(adaptiveSummary(rows, [], 'intermediate').concepts[0].band).toBe('confident');
    expect(adaptiveSummary(rows.slice(0, 1), [], 'intermediate').concepts[0].band).toBe('learning');
    expect(adaptiveSummary([row('a', 'match', false), row('b', 'match', false), row('c', 'match', false)], [], 'intermediate').concepts[0].band).toBe('learning');
  });

  test('isStruggle', () => {
    expect(isStruggle({ correct: 0, hints_used: 0 })).toBe(true);
    expect(isStruggle({ correct: 1, hints_used: 2 })).toBe(true);
    expect(isStruggle({ correct: 1, hints_used: 1 })).toBe(false);
  });
});
