import { describe, expect, test } from '@jest/globals';

import { journeyStrings } from '../strings';
import { AI_BUILDER_JOURNEY } from '../data/journey';
import { buildCoursePath } from './course-path';
import { computeJourney } from './engine';
import { courseLine, currentLine, headerLine, headerMood, milestoneLine } from './tali-lines';
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

  test("Tali's header pose follows the same stages as the message", () => {
    const at = (fraction: number, complete = false) => headerMood({ ...run(), fraction, complete });
    expect(headerMood(run())).toBe('excited');
    expect(at(0.1)).toBe('encouraging');
    expect(at(0.5)).toBe('determined');
    expect(at(0.8)).toBe('confident');
    expect(at(1, true)).toBe('celebrating');
  });

  test('a locked milestone names what stands directly in front of it', () => {
    const state = run();
    const locked = state.milestones.find((m) => m.id === 'prompting')!;
    expect(milestoneLine(state, locked, text.tali)?.text).toContain('How AI coding tools work');
  });
});

describe("Tali's lines on the course map follow the learner's real course", () => {
  const path = (facts = emptyFacts()) => buildCoursePath(run(facts), facts);
  const partial = (courseId: string, done: number, total = 10) => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set(courseId, { ...courses.get(courseId)!, lessonsDone: done, lessonsTotal: total, started: done > 0, title: 'Meet AI course' });
    return { ...facts, courses };
  };

  test('a new learner is welcomed to their first course, by name', () => {
    const facts = emptyFacts();
    const line = courseLine(path(facts), run(facts), text.tali, 'Mika');
    expect(line.text).toContain('Mika');
    expect(line.text).toContain('Course starter');
    expect(line.mood).toBe('happy');
  });

  test('part way through a course she says how many lessons are done in it', () => {
    const facts = partial('starter', 4, 12);
    const line = courseLine(path(facts), run(facts), text.tali, 'Mika');
    expect(line.text).toContain('4 of 12 lessons');
    expect(line.text).toContain('Meet AI course');
    expect(line.mood).toBe('encouraging');
  });

  test('"great job" only follows a course that is really finished', () => {
    const facts = finishLessons(emptyFacts(), 'starter');
    const line = courseLine(path(facts), run(facts), text.tali, 'Mika');
    expect(line.text).toContain('Great job');
    expect(line.text).toContain('Course starter');
    expect(line.mood).toBe('celebrating');
  });

  test('she is closer to the finish line once the journey is complete', () => {
    const everything = emptyFacts();
    const courses = new Map(everything.courses);
    for (const [id, course] of courses) courses.set(id, { ...course, lessonsDone: course.lessonsTotal, started: true, nextLessonId: null });
    const facts = passProjects({ ...everything, courses, actions: { portfolio: true, resume: true } }, ...everything.projectTitles.keys());
    const line = courseLine(path(facts), run(facts), text.tali, 'Mika');
    expect(line.mood).toBe('celebrating');
    expect(line.text).toBe(text.tali.allDone);
  });
});
