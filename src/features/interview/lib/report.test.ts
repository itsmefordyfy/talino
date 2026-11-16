import { describe, expect, test } from '@jest/globals';

import { CATEGORY_IDS, compareReports, parseReport, questionsToPractise, ratingFor, readStoredReport, strongestAnswers, trendOf, verdictFor, weakestAnswers, type InterviewReport } from './report';

const courseIds = new Set(['developer', 'freelancer']);
const options = { answerCount: 4, courseIds };

const categories = (score: number | ((index: number) => number) = 80) => CATEGORY_IDS.map((id, index) => ({ id, score: typeof score === 'function' ? score(index) : score, feedback: `Because of ${id}.` }));
const answer = (turn: number, score: number, extra: Record<string, unknown> = {}) => ({ turn, question: `Question ${turn}`, score, why: `Reason ${turn}.`, improvedKind: 'answer', improved: `Better ${turn}.`, ...extra });
const raw = (overrides: Record<string, unknown> = {}) => JSON.stringify({ summary: 'A solid start.', categories: categories(), answers: [answer(1, 5), answer(2, 2)], skills: [{ skill: 'Offline data', why: 'Sync was vague.', courseId: 'developer' }], nextSteps: ['Practise STAR.'], ...overrides });

describe('rating and verdict', () => {
  test('the rating bands', () => {
    expect(ratingFor(100)).toBe('excellent');
    expect(ratingFor(85)).toBe('excellent');
    expect(ratingFor(84)).toBe('good');
    expect(ratingFor(70)).toBe('good');
    expect(ratingFor(69)).toBe('fair');
    expect(ratingFor(50)).toBe('fair');
    expect(ratingFor(49)).toBe('needs_improvement');
    expect(ratingFor(0)).toBe('needs_improvement');
  });

  test('an answer is strong from 4, fine at 3 and weak below', () => {
    expect([5, 4, 3, 2, 1].map(verdictFor)).toEqual(['strong', 'strong', 'ok', 'weak', 'weak']);
  });
});

describe('parseReport', () => {
  test('a good report passes, with the overall as the average of the categories', () => {
    const report = parseReport(raw({ categories: categories((index) => (index % 2 === 0 ? 90 : 60)) }), options);
    expect(report).not.toBeNull();
    const scores = CATEGORY_IDS.map((_, index) => (index % 2 === 0 ? 90 : 60));
    expect(report?.overall).toBe(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
    expect(report?.rating).toBe(ratingFor(report?.overall ?? 0));
    expect(report?.categories).toHaveLength(CATEGORY_IDS.length);
  });

  test('a verdict the model reports never overrides the score', () => {
    const report = parseReport(raw({ answers: [answer(1, 5, { verdict: 'weak' }), answer(2, 1, { verdict: 'strong' })] }), options);
    expect(report?.answers.map((entry) => entry.verdict)).toEqual(['strong', 'weak']);
  });

  test('an improved answer is only called one when the model says it is built from the learner’s words; anything else is an outline', () => {
    const report = parseReport(raw({ answers: [answer(1, 4), answer(2, 1, { improvedKind: 'outline' }), answer(3, 2, { improvedKind: undefined }), answer(4, 2, { improvedKind: 'story' })] }), options);
    expect(report?.answers.map((entry) => entry.improvedKind)).toEqual(['answer', 'outline', 'outline', 'outline']);
  });

  test('scores are rounded and kept inside their range', () => {
    const report = parseReport(raw({ categories: categories(140), answers: [answer(1, 9), answer(2, -3)] }), options);
    expect(report?.categories.every((category) => category.score === 100)).toBe(true);
    expect(report?.answers.map((entry) => entry.score)).toEqual([5, 1]);
  });

  test('too few categories, no summary or no usable answer feedback is refused', () => {
    expect(parseReport(raw({ categories: categories().slice(0, 4) }), options)).toBeNull();
    expect(parseReport(raw({ summary: ' ' }), options)).toBeNull();
    expect(parseReport(raw({ answers: [] }), options)).toBeNull();
    expect(parseReport('nope', options)).toBeNull();
  });

  test('an answer with no reason, a bad number or a duplicate is dropped', () => {
    const report = parseReport(raw({ answers: [answer(1, 4, { why: ' ' }), answer(2, 3), answer(2, 5), answer(9, 3), answer(0, 3)] }), options);
    expect(report?.answers.map((entry) => entry.turn)).toEqual([2]);
    expect(report?.answers[0].score).toBe(3);
  });

  test('duplicate or unknown categories are ignored', () => {
    const list = [...categories(), { id: 'relevance', score: 5, feedback: 'again' }, { id: 'charisma', score: 99, feedback: 'x' }];
    const report = parseReport(raw({ categories: list }), options);
    expect(report?.categories).toHaveLength(CATEGORY_IDS.length);
    expect(report?.categories.find((category) => category.id === 'relevance')?.score).toBe(80);
  });

  test('a course the app does not have is dropped, the skill stays', () => {
    const report = parseReport(raw({ skills: [{ skill: 'Kubernetes', why: 'x', courseId: 'made-up-course' }, { skill: 'Pricing', why: 'y', courseId: 'freelancer' }, { skill: ' ', why: 'z', courseId: 'developer' }] }), options);
    expect(report?.skills).toEqual([
      { skill: 'Kubernetes', why: 'x', courseId: null },
      { skill: 'Pricing', why: 'y', courseId: 'freelancer' },
    ]);
  });
});

const sample = (): InterviewReport => parseReport(raw({ answers: [answer(1, 5), answer(2, 2), answer(3, 1), answer(4, 4)] }), options) as InterviewReport;

describe('reading a report', () => {
  test('strongest first by score, weakest first by score', () => {
    expect(strongestAnswers(sample()).map((entry) => entry.turn)).toEqual([1, 4]);
    expect(weakestAnswers(sample()).map((entry) => entry.turn)).toEqual([3, 2]);
  });

  test('questions to practise are the weak answers', () => {
    expect(questionsToPractise(sample())).toEqual(['Question 3', 'Question 2']);
  });

  test('comparing attempts gives the change overall and per category', () => {
    const before = parseReport(raw({ categories: categories(60) }), options) as InterviewReport;
    const after = parseReport(raw({ categories: categories(75).slice(0, 6) }), options) as InterviewReport;
    const comparison = compareReports(before, after);
    expect(comparison.overall).toBe(15);
    expect(comparison.categories).toHaveLength(6);
    expect(comparison.categories.every((entry) => entry.delta === 15)).toBe(true);
  });

  test('the trend needs two attempts', () => {
    expect(trendOf([])).toBeNull();
    expect(trendOf([70])).toBeNull();
    expect(trendOf([60, 72])).toBe(12);
    expect(trendOf([80, 90, 85])).toBe(-5);
  });

  test('a stored report reads back, a damaged one does not', () => {
    const stored = JSON.stringify(sample());
    expect(readStoredReport(stored)?.overall).toBe(sample().overall);
    expect(readStoredReport('{broken')).toBeNull();
    expect(readStoredReport('{"overall":"x"}')).toBeNull();
    expect(readStoredReport(null)).toBeNull();
  });
});
