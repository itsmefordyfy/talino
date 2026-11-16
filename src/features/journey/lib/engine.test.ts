import { describe, expect, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { completedStageIds, computeJourney, isRequiredFor, startLevel } from './engine';
import { emptyFacts, finishLessons, newLearner, passProjects } from './test-helpers';
import type { JourneyDefinition, JourneyFacts, JourneyLearner } from './types';

const run = (facts: JourneyFacts = emptyFacts(), learner: JourneyLearner = newLearner, definition: JourneyDefinition = AI_BUILDER_JOURNEY) => computeJourney(definition, facts, learner);
const status = (state: ReturnType<typeof run>, id: string) => state.milestones.find((milestone) => milestone.id === id)?.status;
const milestone = (state: ReturnType<typeof run>, id: string) => state.milestones.find((entry) => entry.id === id)!;

describe('a new learner', () => {
  const state = run();

  test('starts at the first milestone of the Beginner level, with nothing done', () => {
    expect(state.current?.id).toBe('meet-ai');
    expect(state.currentStage?.id).toBe('beginner');
    expect(state.start).toEqual({ index: 0, level: 'beginner', reason: 'default' });
    expect(state.done).toBe(0);
    expect(state.fraction).toBe(0);
  });

  test('everything after the start is locked until its prerequisites are learned', () => {
    expect(status(state, 'how-ai-tools-work')).toBe('locked');
    expect(milestone(state, 'how-ai-tools-work').blockedBy).toEqual(['meet-ai']);
    expect(status(state, 'first-full-stack')).toBe('locked');
  });

  test('side steps are optional and never block the road', () => {
    expect(milestone(state, 'teach-with-ai').required).toBe(false);
    expect(milestone(state, 'for-working-developers').optional).toBe(true);
    // The first Intermediate milestone needs the last Beginner one, not the side steps beside it.
    expect(milestone(state, 'ai-code-editor').blockedBy).toEqual(['plan-first-app']);
  });
});

describe('progress comes only from real work', () => {
  test('lessons done are partial progress', () => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set('starter', { ...courses.get('starter')!, lessonsDone: 5, started: true });
    const meet = milestone(run({ ...facts, courses }), 'meet-ai');
    expect(meet.status).toBe('current');
    expect(meet.fraction).toBeCloseTo(0.25);
  });

  test('a finished course moves the learner on; its project stays open behind them, and completes the milestone when it passes', () => {
    const lessons = finishLessons(emptyFacts(), 'starter');
    const state = run(lessons);
    expect(status(state, 'meet-ai')).toBe('available');
    expect(milestone(state, 'meet-ai').learned).toBe(true);
    expect(state.current?.id).toBe('how-ai-tools-work');
    const passed = run(passProjects(lessons, 'starter-p1'));
    expect(status(passed, 'meet-ai')).toBe('done');
    expect(passed.current?.id).toBe('how-ai-tools-work');
  });

  test('everything after the current course is locked: the road, side steps and optional milestones alike', () => {
    const state = run(finishLessons(emptyFacts(), 'starter'));
    const current = state.current!;
    const ahead = state.milestones.filter((entry) => entry.index > current.index);
    expect(ahead.length).toBeGreaterThan(30);
    expect(ahead.filter((entry) => entry.status !== 'locked' && entry.status !== 'soon')).toEqual([]);
    // Each says what to finish first.
    for (const entry of ahead) expect(entry.blockedBy.length).toBeGreaterThan(0);
  });

  test('a course started out of order ahead of the learner stays locked until they get there', () => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set('build-fullstack-ai', { ...courses.get('build-fullstack-ai')!, lessonsDone: 6, started: true });
    expect(status(run({ ...facts, courses }), 'first-full-stack')).toBe('locked');
  });

  test('optional courses never block a milestone', () => {
    const facts = passProjects(finishLessons(emptyFacts(), 'ai-dev-intro'), 'ai-dev-intro-p1');
    const tools = milestone(run(facts), 'how-ai-tools-work');
    expect(tools.stepsTotal).toBe(2);
    expect(tools.status).toBe('done');
  });

  test('the portfolio milestone follows the real portfolio', () => {
    const work = milestone(run(emptyFacts({ actions: { portfolio: true, resume: false } })), 'show-your-work');
    expect(work.stepsDone).toBe(1);
    expect(work.steps.find((step) => step.action === 'resume')?.optional).toBe(true);
  });

  test('a real prerequisite further back is respected', () => {
    // Spec before you build needs Prompts that work as well as the agent tools.
    expect(milestone(run(), 'spec-first').def.requires).toEqual(['agent-tools', 'prompting']);
    // Starting at Intermediate, the skipped Beginner milestones stand aside: with both tool courses finished, the spec milestone is next.
    const facts = finishLessons(emptyFacts(), 'ai-dev-cursor', 'ai-dev-claude-code');
    const state = run(facts, { ...newLearner, chosenStart: 'intermediate' });
    expect(state.current?.id).toBe('spec-first');
    expect(status(state, 'first-full-stack')).toBe('locked');
    expect(milestone(state, 'first-full-stack').blockedBy).toContain('spec-first');
  });
});

describe('the next level waits for the current course', () => {
  const beginner = AI_BUILDER_JOURNEY.stages[0]!;
  const intermediate = AI_BUILDER_JOURNEY.stages[1]!;
  const firstNext = intermediate.milestones[0]!;
  const lastRequired = [...beginner.milestones].reverse().find((entry) => isRequiredFor(entry, []))!;
  const coursesOf = (entry: typeof lastRequired) => entry.steps.flatMap((step) => (step.kind === 'learn' && !step.optional ? [step.courseId] : []));
  const allBeginnerCourses = beginner.milestones.flatMap((entry) => (isRequiredFor(entry, []) ? coursesOf(entry) : []));

  test('every Beginner course but the last one finished: the Intermediate level stays locked', () => {
    const lastCourse = coursesOf(lastRequired).at(-1)!;
    const facts = finishLessons(emptyFacts(), ...allBeginnerCourses.filter((id) => id !== lastCourse));
    const state = run(facts);
    expect(status(state, firstNext.id)).toBe('locked');
    expect(milestone(state, firstNext.id).blockedBy).toContain(lastRequired.id);
  });

  test('the last Beginner course finished: the Intermediate level opens', () => {
    const state = run(finishLessons(emptyFacts(), ...allBeginnerCourses));
    expect(status(state, firstNext.id)).not.toBe('locked');
  });
});

describe('the starting level', () => {
  test('follows the experience the learner gave, never higher than Advanced on its own', () => {
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'beginner' }).level).toBe('beginner');
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'intermediate' }).level).toBe('intermediate');
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'advanced' }).level).toBe('advanced');
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'professional' })).toEqual({ index: 2, level: 'advanced', reason: 'experience' });
  });

  test('the skill check moves it: "new" one level earlier, "strong" at least Intermediate', () => {
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'advanced', assessment: 'new' }).level).toBe('intermediate');
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'beginner', assessment: 'strong' })).toEqual({ index: 1, level: 'intermediate', reason: 'assessment' });
  });

  test('a course finished well at a higher level shows the learner can start there', () => {
    const facts = finishLessons(emptyFacts(), 'agentic-coding');
    const courses = new Map(facts.courses);
    courses.set('agentic-coding', { ...courses.get('agentic-coding')!, quizAverage: 0.9 });
    expect(startLevel(AI_BUILDER_JOURNEY, { ...facts, courses }, newLearner)).toEqual({ index: 2, level: 'advanced', reason: 'completed' });
    // A poor quiz average is not evidence.
    expect(startLevel(AI_BUILDER_JOURNEY, facts, newLearner).level).toBe('beginner');
  });

  test("the learner's own choice wins, in either direction", () => {
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, experience: 'professional', chosenStart: 'beginner' })).toEqual({ index: 0, level: 'beginner', reason: 'chosen' });
    expect(startLevel(AI_BUILDER_JOURNEY, emptyFacts(), { ...newLearner, chosenStart: 'expert' }).level).toBe('expert');
  });

  test('earlier levels are skipped, not hidden or counted, and the learner starts at the first milestone of their level', () => {
    const state = run(emptyFacts(), { ...newLearner, experience: 'intermediate' });
    expect(status(state, 'meet-ai')).toBe('skipped');
    expect(milestone(state, 'meet-ai').required).toBe(false);
    expect(state.current?.id).toBe('ai-code-editor');
    expect(state.currentStage?.id).toBe('intermediate');
  });

  test('a skipped milestone the learner did begin is shown as it really is', () => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.set('starter', { ...courses.get('starter')!, lessonsDone: 2, started: true });
    expect(status(run({ ...facts, courses }, { ...newLearner, experience: 'professional' }), 'meet-ai')).not.toBe('skipped');
  });

  test('changing the start or direction never changes what was done', () => {
    const facts = passProjects(finishLessons(emptyFacts(), 'starter', 'ai-dev-intro'), 'starter-p1', 'ai-dev-intro-p1');
    for (const learner of [newLearner, { ...newLearner, chosenStart: 'expert' as const, focus: ['mobile' as const] }]) {
      const state = run(facts, learner);
      expect(status(state, 'meet-ai')).toBe('done');
      expect(status(state, 'how-ai-tools-work')).toBe('done');
    }
  });
});

describe('directions', () => {
  test('mobile milestones are required with no stated direction, optional for a learner heading elsewhere', () => {
    expect(milestone(run(), 'app-on-your-phone').required).toBe(true);
    expect(milestone(run(emptyFacts(), { ...newLearner, focus: ['web'] }), 'app-on-your-phone').required).toBe(false);
    expect(milestone(run(emptyFacts(), { ...newLearner, focus: ['mobile'] }), 'ship-to-app-stores').required).toBe(true);
  });

  test('a side step becomes part of the road for its own audience', () => {
    expect(milestone(run(emptyFacts(), { ...newLearner, focus: ['freelance'] }), 'earn-with-ai-services').required).toBe(true);
    expect(milestone(run(emptyFacts(), { ...newLearner, focus: ['teach'] }), 'teach-with-ai').required).toBe(true);
    expect(milestone(run(emptyFacts(), { ...newLearner, focus: ['teach'] }), 'for-working-developers').required).toBe(false);
  });

  test('isRequiredFor follows the rules', () => {
    const [first] = AI_BUILDER_JOURNEY.stages[0]!.milestones;
    expect(isRequiredFor(first!, ['ai'])).toBe(true);
    expect(isRequiredFor({ ...first!, side: true }, [])).toBe(false);
    expect(isRequiredFor({ ...first!, side: true, audience: ['teach'] }, ['teach'])).toBe(true);
  });
});

describe('the next action', () => {
  test('points at the next lesson of the course', () => {
    expect(run().current?.next).toEqual({ type: 'lesson', lessonId: 'starter-01', courseId: 'starter', title: 'First lesson' });
  });

  test('a finished course with its project still to pass leads straight to the challenge', () => {
    expect(milestone(run(finishLessons(emptyFacts(), 'starter')), 'meet-ai').next).toEqual({ type: 'project', projectId: 'starter-p1', title: 'Project starter-p1' });
  });

  test('minutes left add up the counting lessons only', () => {
    expect(milestone(run(), 'ai-assistant-for-code').minutesLeft).toBe(200);
  });
});

describe('finishing', () => {
  test('every required milestone done completes the journey and all four levels', () => {
    const courseIds: string[] = [];
    const projectIds: string[] = [];
    for (const stage of AI_BUILDER_JOURNEY.stages) for (const m of stage.milestones) for (const step of m.steps) {
      if (step.kind === 'learn') courseIds.push(step.courseId);
      if (step.kind === 'build') projectIds.push(step.projectId);
    }
    const all = { ...passProjects(finishLessons(emptyFacts(), ...courseIds), ...projectIds), actions: { portfolio: true, resume: true } };
    const state = run(all, newLearner);
    expect(state.complete).toBe(true);
    expect(state.fraction).toBe(1);
    expect(state.current).toBeNull();
    expect(completedStageIds(state)).toEqual(['beginner', 'intermediate', 'advanced', 'expert']);
  });

  test('progress stays between zero and one', () => {
    for (const fraction of [run().fraction, run(finishLessons(emptyFacts(), 'starter')).fraction]) {
      expect(fraction).toBeGreaterThanOrEqual(0);
      expect(fraction).toBeLessThanOrEqual(1);
    }
  });
});

describe('missing content', () => {
  test('a course not in the app is coming soon and never blocks', () => {
    const facts = emptyFacts();
    const courses = new Map(facts.courses);
    courses.delete('starter');
    const state = run({ ...facts, courses });
    expect(status(state, 'meet-ai')).toBe('soon');
    expect(state.current?.id).toBe('how-ai-tools-work');
  });
});
