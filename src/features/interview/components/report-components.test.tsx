import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

import { CATEGORY_IDS, compareReports, parseReport, type InterviewReport } from '../lib/report';
import { interviewStrings } from '../strings';
import { AnswerCard } from './answer-card';
import { CategoryBars } from './category-bars';
import { AnswerBubble, InterviewerBubble } from './message-bubbles';
import { ScoreHero } from './score-hero';

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle' }));
// The courses index pulls in the store and RevenueCat's native SDK; the ring is its own, already built component: here it just shows its label.
jest.mock('@/features/courses', () => {
  // A mock factory can't use a top-level import (it is hoisted above them).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return { ProgressRing: ({ label }: { label?: string }) => <Text>{label}</Text> };
});

const strings = interviewStrings.en;
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(' '));

const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});
async function render(element: React.ReactElement) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(<Provider store={store}>{element}</Provider>);
  });
  return textOf(renderer.container);
}

const report = (score: number): InterviewReport =>
  parseReport(
    JSON.stringify({
      summary: 'You explained your project well, but the sync answer was thin.',
      categories: CATEGORY_IDS.map((id) => ({ id, score, feedback: `Feedback for ${id}.` })),
      answers: [{ turn: 1, question: 'How did you handle sync?', score: 2, why: 'You did not say what happens on a conflict.', improvedKind: 'answer', improved: 'I keep the newest edit [add your real rule].' }],
      skills: [],
      nextSteps: [],
    }),
    { answerCount: 1, courseIds: new Set() },
  ) as InterviewReport;

describe('the score', () => {
  test.each([
    [92, 'Excellent'],
    [75, 'Good'],
    [55, 'Getting there'],
    [30, 'Needs improvement'],
  ])('%i reads as "%s", in words as well as colour', async (score, label) => {
    const data = report(score);
    const rating = strings.ratings[data.rating];
    const text = await render(<ScoreHero score={data.overall} rating={data.rating} ratingLabel={rating.label} ratingLine={rating.line} outOf={strings.outOf} summary={data.summary} />);
    expect(text).toContain(label);
    expect(text).toContain(String(score));
    expect(text).toContain('out of 100');
    expect(text).toContain('the sync answer was thin');
  });
});

describe('the categories', () => {
  test('every category shows its score and the reason for it, and confidence says what it is read from', async () => {
    const data = report(70);
    const text = await render(<CategoryBars categories={data.categories} labels={strings.categories} comparison={null} deltaLabel={strings.deltaLabel} confidenceNote={strings.confidenceNote} />);
    for (const id of CATEGORY_IDS) {
      expect(text).toContain(strings.categories[id].label);
      expect(text).toContain(`Feedback for ${id}.`);
    }
    expect(text).toContain('does not measure how confident you would sound when speaking');
  });

  test('against an earlier attempt each category that moved shows by how much', async () => {
    const before = report(60);
    const after = report(75);
    const text = await render(<CategoryBars categories={after.categories} labels={strings.categories} comparison={compareReports(before, after)} deltaLabel={strings.deltaLabel} confidenceNote={strings.confidenceNote} />);
    expect(text).toContain('+15');
  });
});

describe('an answer reviewed', () => {
  const entry = report(60).answers[0];
  const cardStrings = { answerNumber: strings.answerNumber, answerScore: strings.answerScore, verdicts: strings.verdicts, whyLabel: strings.whyLabel, yourAnswer: strings.yourAnswer, betterAnswer: strings.betterAnswer, betterNote: strings.betterNote, outlineLabel: strings.outlineLabel, outlineNote: strings.outlineNote };

  test('shows the question, the verdict and why, the learner’s own words and a stronger version side by side', async () => {
    const text = await render(<AnswerCard entry={entry} original="It syncs when online." strings={cardStrings} />);
    expect(text).toContain('Answer 1');
    expect(text).toContain('Weak');
    expect(text).toContain('2/5');
    expect(text).toContain('How did you handle sync?');
    expect(text).toContain('You did not say what happens on a conflict.');
    expect(text).toContain('It syncs when online.');
    expect(text).toContain('I keep the newest edit [add your real rule].');
    expect(text).toContain('only from what you said');
  });

  test('an outline is never presented as a stronger answer of the learner’s own', async () => {
    const outline = { ...entry, improvedKind: 'outline' as const, improved: 'Start with [a real situation].' };
    const text = await render(<AnswerCard entry={outline} original="I don't know." strings={cardStrings} />);
    expect(text).toContain('An outline to build your own answer');
    expect(text).toContain('this is a structure, not an answer');
    expect(text).not.toContain('A stronger answer');
  });

  test('the summary version leaves out the long comparison', async () => {
    const text = await render(<AnswerCard entry={entry} original="It syncs when online." strings={cardStrings} compact />);
    expect(text).toContain('You did not say what happens on a conflict.');
    expect(text).not.toContain('It syncs when online.');
    expect(text).not.toContain('A stronger answer');
  });
});

describe('the conversation', () => {
  test('the interviewer speaks in plain text and the learner’s answer is shown as written', async () => {
    const text = await render(
      <>
        <InterviewerBubble companion="tala" text="How did you handle data sync offline?" />
        <AnswerBubble text="I used a sync queue." />
      </>,
    );
    expect(text).toContain('How did you handle data sync offline?');
    expect(text).toContain('I used a sync queue.');
  });
});
