import { describe, expect, test } from '@jest/globals';

import { journeyStrings } from '../strings';
import { AI_BUILDER_JOURNEY } from '../data/journey';
import { computeJourney } from './engine';
import { currentLine, headerLine, milestoneLine } from './tali-lines';
import { emptyFacts, finishLessons, newLearner, passProjects } from './test-helpers';

const text = journeyStrings.en;
const run = (facts = emptyFacts()) => computeJourney(AI_BUILDER_JOURNEY, facts, newLearner);

describe("Tali's lines follow the learner's real place", () => {
  test('a new learner is welcomed to the first milestone, by name', () => {
    const line = currentLine(run(), text.tali, 'Mika');
    expect(line.text).toContain('Mika');
    expect(line.text).toContain('Meet AI');
    expect(line.mood).toBe('happy');
  });

  test('"great job" only follows a milestone that is really done', () => {
    expect(currentLine(run(), text.tali, '').text).not.toMatch(/Great job/);
    const line = currentLine(run(passProjects(finishLessons(emptyFacts(), 'starter'), 'starter-p1')), text.tali, '');
    expect(line.text).toMatch(/Great job! You've completed "Meet AI"/);
    expect(line.mood).toBe('celebrating');
  });

  test('a milestone in progress reports the real steps', () => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set('starter', { ...courses.get('starter')!, lessonsDone: 3, started: true });
    const line = currentLine(run({ ...facts, courses }), text.tali, '');
    expect(line.text).toMatch(/Nice start on "Meet AI"/);
  });

  test('the header message grows with the progress and is honest at zero', () => {
    expect(headerLine(run(), text.header)).toBe(text.header.start);
  });

  test('a locked milestone names what stands directly in front of it', () => {
    const state = run();
    const locked = state.milestones.find((m) => m.id === 'prompting')!;
    expect(milestoneLine(state, locked, text.tali)?.text).toContain('How AI coding tools work');
  });
});
