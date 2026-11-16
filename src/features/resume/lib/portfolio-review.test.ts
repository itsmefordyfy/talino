import { describe, expect, test } from '@jest/globals';

import { cleanReviewInput, parseReview, reviewUserText } from './portfolio-review';

const body = {
  headline: 'Junior Developer',
  about: 'I build websites with React.',
  skills: ['React', 'TypeScript'],
  resume: { name: 'Ana', experience: [{ id: 'e1', title: 'Web Developer', organization: 'Pili Studio', bullets: ['Built five client websites in React'] }] },
  goal: 'First developer job',
  level: 'graduate',
  linkLabels: ['GitHub'],
  certificates: 1,
  hasPhoto: false,
  projects: [
    { id: 'p1', title: 'Queue App', role: 'Solo developer', tech: ['Expo'], summary: 'A queue app.', description: '', shots: 0, hasLink: false },
    { id: 'p2', title: 'Recipe App', role: 'Developer', tech: ['React'], summary: '', description: 'Turns kitchen items into dinner ideas.', shots: 3, hasLink: true },
  ],
};
const input = () => {
  const cleaned = cleanReviewInput(body);
  if (!cleaned) throw new Error('input should be valid');
  return cleaned;
};
const reply = (value: unknown) => JSON.stringify(value);

describe('cleanReviewInput', () => {
  test('keeps the portfolio state and the learner’s facts; nothing to review is refused', () => {
    const cleaned = input();
    expect(cleaned.projects.map((project) => [project.id, project.shots, project.hasLink])).toEqual([['p1', 0, false], ['p2', 3, true]]);
    expect(reviewUserText(cleaned)).toContain('Current project order: p1, p2.');
    expect(cleanReviewInput({ projects: [], resume: {} })).toBeNull();
  });
});

describe('parseReview', () => {
  const good = {
    verdict: 'A solid start. The next step is showing your work with screenshots.',
    missing: [{ area: 'screenshots', advice: 'Add screenshots to Queue App.' }, { area: 'nonsense', advice: 'Something else.' }],
    suggestions: [
      { kind: 'project_summary', id: 'p2', after: 'A recipe app that turns kitchen items into dinner ideas.', reason: 'Says what it does.' },
      { kind: 'about', after: 'I build client websites with React and TypeScript.', reason: 'Names your stack.' },
    ],
    headlineOptions: ['Junior web developer · React', 'Junior Developer'],
    order: { ids: ['p2', 'p1'], reason: 'The recipe app has screenshots and a live link.' },
    layout: 'Lead with your projects and screenshots.',
    questions: ['How many people use the queue app?'],
  };

  test('keeps wording inside the facts, an order that names every project once, and unknown areas as other', () => {
    const review = parseReview(reply(good), input());
    expect(review?.suggestions.map((item) => item.kind)).toEqual(['project_summary', 'about']);
    expect(review?.order?.ids).toEqual(['p2', 'p1']);
    expect(review?.missing.map((item) => item.area)).toEqual(['screenshots', 'other']);
    // The headline the learner already has is not offered back.
    expect(review?.headlineOptions).toEqual(['Junior web developer · React']);
  });

  test('drops suggestions that invent a figure or name, point at someone else’s project or change nothing', () => {
    const review = parseReview(
      reply({
        ...good,
        suggestions: [
          { kind: 'about', after: 'I built apps used by 5000 people at Google.', reason: 'x' },
          { kind: 'project_summary', id: 'ghost', after: 'A queue app.', reason: 'x' },
          { kind: 'project_summary', id: 'p1', after: 'A queue app.', reason: 'same as today' },
          { kind: 'headline', after: 'Junior web developer', reason: 'ok' },
        ],
      }),
      input(),
    );
    expect(review?.suggestions.map((item) => item.kind)).toEqual(['headline']);
  });

  test('an order that skips a project, repeats today’s, or has a single project is not offered', () => {
    expect(parseReview(reply({ ...good, order: { ids: ['p2'], reason: 'x' } }), input())?.order).toBeNull();
    expect(parseReview(reply({ ...good, order: { ids: ['p1', 'p2'], reason: 'x' } }), input())?.order).toBeNull();
  });

  test('no verdict, or not JSON, is null', () => {
    expect(parseReview('nope', input())).toBeNull();
    expect(parseReview(reply({ ...good, verdict: '' }), input())).toBeNull();
  });
});
