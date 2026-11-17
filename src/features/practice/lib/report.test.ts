import { describe, expect, test } from '@jest/globals';

import { LEARNER_LINES, PRIVATE_MARKERS, SCENARIO } from '../test-support';
import { REPORT_SCHEMA, parseReport, readStoredReport, tooShortReport } from './report';

const good = (overrides: Record<string, unknown> = {}) => ({
  summary: 'You owned the delay and gave a clear date, but the close was thin.',
  criteria: [
    { id: 'clarity', score: 80, reason: 'The new date was specific.' },
    { id: 'tone', score: 70, reason: 'Warm and professional.' },
    { id: 'accountability', score: 60, reason: 'You apologised, then explained at length.' },
  ],
  strengths: [{ quote: 'I can send you the full draft by Friday at noon', point: 'A concrete date with a time.' }],
  growth: [{ quote: 'did not tell you sooner', point: 'Say what you will do to stop it happening again.' }],
  nextStep: 'End by confirming what you will send tomorrow evening.',
  tooShort: false,
  ...overrides,
});
const parse = (value: unknown, lines: readonly string[] = LEARNER_LINES) => parseReport(JSON.stringify(value), { scenario: SCENARIO, learnerLines: lines });

describe('parseReport', () => {
  test('a good debrief: the overall is the average of the criteria and the rating follows it', () => {
    const report = parse(good());
    expect(report).toMatchObject({ kind: 'roleplay', tooShort: false, overall: 70, rating: 'good', nextStep: 'End by confirming what you will send tomorrow evening.' });
    expect(report?.criteria.map((criterion) => criterion.id)).toEqual(['clarity', 'tone', 'accountability']);
    expect(report?.strengths).toHaveLength(1);
    expect(report?.growth).toHaveLength(1);
  });

  test('only the criteria the scenario names are scored', () => {
    const extra = good();
    extra.criteria.push({ id: 'grammar', score: 5, reason: 'Not named by this scenario.' });
    expect(parse(extra)?.criteria.map((criterion) => criterion.id)).toEqual(['clarity', 'tone', 'accountability']);
    expect(parse(good({ criteria: good().criteria.slice(0, 2) }))).toBeNull();
  });

  test('a quote that is not in the learner’s own words rejects the whole debrief', () => {
    expect(parse(good({ strengths: [{ quote: 'I take full responsibility for this', point: 'Owned it.' }] }))).toBeNull();
    expect(parse(good({ growth: [{ quote: 'I never said this', point: 'x' }] }))).toBeNull();
  });

  test('a quote can use an ellipsis between two things the learner really said', () => {
    expect(parse(good({ growth: [{ quote: 'I am sorry … did not tell you sooner', point: 'Cut the explanation.' }] }))).not.toBeNull();
  });

  test('needs a growth area, a next step and a summary; strengths may be empty for a rough attempt', () => {
    expect(parse(good({ growth: [] }))).toBeNull();
    expect(parse(good({ nextStep: ' ' }))).toBeNull();
    expect(parse(good({ summary: '' }))).toBeNull();
    expect(parse(good({ strengths: [] }))?.strengths).toEqual([]);
  });

  test('every strength and growth area needs both its quote and its point', () => {
    expect(parse(good({ strengths: [{ quote: 'I can send you the full draft by Friday at noon', point: '' }] }))).toBeNull();
    expect(parse(good({ strengths: [{ point: 'No quote.' }] }))).toBeNull();
  });

  test('at most three of each, so the debrief stays readable', () => {
    const many = Array.from({ length: 6 }, () => ({ quote: 'I can send you the full draft by Friday at noon', point: 'Yes.' }));
    expect(parse(good({ strengths: many }))?.strengths).toHaveLength(3);
  });

  test('too little to judge: no scores, no quotes, an honest summary', () => {
    const report = parse(good({ tooShort: true, summary: 'There was too little to judge.' }));
    expect(report).toMatchObject({ kind: 'roleplay', tooShort: true, overall: null, rating: null, criteria: [], strengths: [], growth: [], summary: 'There was too little to judge.' });
    expect(parse({ tooShort: true, summary: '' })).toBeNull();
  });

  test('a debrief that recites the private brief is refused', () => {
    expect(parse(good({ summary: `Dana's problem was that ${PRIVATE_MARKERS.private} and you missed it.` }))).toBeNull();
    expect(parse(good({ criteria: [{ id: 'clarity', score: 80, reason: PRIVATE_MARKERS.strongSign }, ...good().criteria.slice(1)] }))).toBeNull();
    expect(parse(good({ nextStep: `Try to avoid: ${PRIVATE_MARKERS.trap}` }))).toBeNull();
  });

  test('unreadable or wrongly shaped replies are not reports', () => {
    expect(parseReport('nope', { scenario: SCENARIO, learnerLines: LEARNER_LINES })).toBeNull();
    expect(parse(null)).toBeNull();
    expect(parse([])).toBeNull();
  });

  test('unknown fields the model adds are not passed on', () => {
    const report = parse(good({ idealAnswer: 'Say this exactly.', rubric: ['x'] }));
    expect(JSON.stringify(report)).not.toContain('idealAnswer');
    expect(JSON.stringify(report)).not.toContain('rubric');
  });
});

describe('the report schema and the local too-short report', () => {
  test('asks for every field it later requires', () => {
    expect(REPORT_SCHEMA.required).toEqual(['summary', 'criteria', 'strengths', 'growth', 'nextStep', 'tooShort']);
  });
  test('a too-short report made on the server carries the given sentence and no scores', () => {
    expect(tooShortReport('Say more next time.')).toEqual({ kind: 'roleplay', tooShort: true, overall: null, rating: null, summary: 'Say more next time.', criteria: [], strengths: [], growth: [], nextStep: '' });
  });
});

describe('readStoredReport', () => {
  test('reads back what was saved, and nothing damaged', () => {
    const report = parse(good());
    expect(readStoredReport(JSON.stringify(report))).toEqual(report);
    expect(readStoredReport(JSON.stringify(tooShortReport('Short.')))).toMatchObject({ tooShort: true });
    expect(readStoredReport(null)).toBeNull();
    expect(readStoredReport('{')).toBeNull();
    expect(readStoredReport(JSON.stringify({ kind: 'roleplay' }))).toBeNull();
    expect(readStoredReport(JSON.stringify({ kind: 'message-review', overall: 70 }))).toBeNull();
  });
});
