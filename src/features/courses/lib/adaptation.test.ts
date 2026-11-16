import { describe, expect, test } from '@jest/globals';

import type { Activity } from '../../activities/types';
import { COURSES } from '../content';
import { EXPERIENCE_LEVELS, type ExperienceLevel } from '../content/levels';
import type { Lesson, LessonBlock, Project } from '../content/types';
import { adaptLesson, adaptProject, cleanLevel, inheritLevels, levelCoverage, levelsInAudience, rubricFor, suggestNextLevel } from './adaptation';
import { lessonStructureProblems, splitLesson } from './lesson-structure';
import { betterScore, computeCourseProgress, quizPassed } from './progress';
import { makeCourse } from './fixtures.test-helpers';

const words = (count: number, tag = 'w') => Array.from({ length: count }, (_, index) => `${tag}${index}`).join(' ');
const activity = (id: string, audience?: Activity['audience']) => ({ id, kind: 'scenario', audience, title: id, prompt: 'p' }) as unknown as Activity;

/** One lesson with a plain-language block for newcomers, a depth block for advanced learners, a gentle and a hard question, an activity per side, and task extras. */
const newcomerBlock: LessonBlock = { type: 'paragraph', text: `NEWCOMER ${words(100)}`, audience: { max: 'beginner' } };
const depthBlock: LessonBlock = { type: 'paragraph', text: `DEPTH ${words(100)}`, audience: { min: 'advanced' } };
const intermediateBlock: LessonBlock = { type: 'tip', text: 'INTERMEDIATE ONLY', audience: { min: 'intermediate', max: 'intermediate' } };

const lesson: Lesson = {
  id: 'fx-01',
  day: 1,
  title: 'Fixture',
  summary: 'S',
  minutes: 15,
  skills: ['a'],
  intro: { objectives: ['Explain the idea', 'Write one example'], why: 'It lets you ship work you can trust and explain to others.' },
  body: [
    { type: 'paragraph', text: `SHARED ${words(150)}` },
    newcomerBlock,
    { type: 'heading', text: 'How it works' },
    { type: 'paragraph', text: words(130) },
    depthBlock,
    intermediateBlock,
    { type: 'activity', activity: activity('fx-01-scenario-1') },
    { type: 'activity', activity: activity('fx-01-match-2', { max: 'beginner' }) },
    { type: 'activity', activity: activity('fx-01-fix-3', { min: 'advanced' }) },
    { type: 'takeaways', items: ['One', 'Two', 'Three'] },
  ],
  quiz: [
    { id: 'fx-01-q1', prompt: 'Shared one', choices: ['a', 'b', 'c'], answer: 0, explanation: 'Because the lesson said so earlier on.' },
    { id: 'fx-01-q2', prompt: 'Shared two', choices: ['a', 'b', 'c'], answer: 1, explanation: 'Because the lesson said so earlier on.' },
    { id: 'fx-01-q3', prompt: 'Shared three', choices: ['a', 'b', 'c'], answer: 2, explanation: 'Because the lesson said so earlier on.' },
    { id: 'fx-01-q4', audience: { max: 'beginner' }, prompt: 'Gentle', choices: ['a', 'b', 'c'], answer: 0, explanation: 'Because the plain-language idea says so.' },
    { id: 'fx-01-q5', audience: { min: 'advanced' }, prompt: 'Realistic scenario', choices: ['a', 'b', 'c'], answer: 1, explanation: 'Because in a real codebase that is what happens.' },
  ],
  task: { title: 'Do it', steps: ['Shared step one', 'Shared step two'], minutes: 10 },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each line it made'] },
    { audience: { min: 'advanced' }, steps: ['Write a failing test first'] },
  ],
};

const project: Project = {
  id: 'fx-p1',
  title: 'P',
  summary: 'S',
  outcome: 'O',
  unlockAfterDay: 1,
  steps: [
    { id: 'fx-p1-s1', text: 'Shared build step' },
    { id: 'fx-p1-s2', text: 'Scaffolded step', audience: { max: 'beginner' } },
    { id: 'fx-p1-s3', text: 'Use an API and a database', audience: { min: 'intermediate' } },
    { id: 'fx-p1-s4', text: 'Review the agent diff', audience: { min: 'professional' } },
  ],
  submission: { kind: 'url', label: 'Link', placeholder: '', hint: '' },
  rubric: ['Works', 'Is explained', 'Is shared'],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['Says in plain words what each part does'] },
    { audience: { min: 'intermediate' }, items: ['Uses an API or a database'] },
    { audience: { min: 'advanced' }, items: ['Has tests and handles errors'] },
  ],
};

const ids = (items: readonly { id: string }[]) => items.map((item) => item.id);
const texts = (blocks: readonly LessonBlock[]) => blocks.map((block) => ('text' in block ? block.text : block.type));

describe('the same lesson for all five learner profiles', () => {
  const view = (level: ExperienceLevel | null, showAll = false) => adaptLesson(lesson, level, showAll);

  test('complete beginners and beginners get the plain-language block and the gentle question, not the advanced ones', () => {
    for (const level of ['complete-beginner', 'beginner'] as const) {
      const adapted = view(level);
      expect(texts(adapted.body).some((text) => text.startsWith('NEWCOMER'))).toBe(true);
      expect(texts(adapted.body).some((text) => text.startsWith('DEPTH'))).toBe(false);
      expect(ids(adapted.quiz)).toEqual(['fx-01-q1', 'fx-01-q2', 'fx-01-q3', 'fx-01-q4']);
      expect(ids(adapted.activities)).toEqual(['fx-01-scenario-1', 'fx-01-match-2']);
      expect(adapted.taskSteps).toEqual(['Shared step one', 'Shared step two', 'Ask the AI to explain each line it made']);
    }
  });

  test('intermediate sees the shared lesson plus what is tagged for exactly intermediate', () => {
    const adapted = view('intermediate');
    expect(texts(adapted.body)).toContain('INTERMEDIATE ONLY');
    expect(texts(adapted.body).some((text) => text.startsWith('NEWCOMER') || text.startsWith('DEPTH'))).toBe(false);
    expect(ids(adapted.quiz)).toEqual(['fx-01-q1', 'fx-01-q2', 'fx-01-q3']);
    expect(ids(adapted.activities)).toEqual(['fx-01-scenario-1']);
    expect(adapted.taskSteps).toEqual(['Shared step one', 'Shared step two']);
  });

  test('advanced learners and professionals get the depth block and the realistic question, not the newcomer block', () => {
    for (const level of ['advanced', 'professional'] as const) {
      const adapted = view(level);
      expect(texts(adapted.body).some((text) => text.startsWith('DEPTH'))).toBe(true);
      expect(texts(adapted.body).some((text) => text.startsWith('NEWCOMER'))).toBe(false);
      expect(texts(adapted.body)).not.toContain('INTERMEDIATE ONLY');
      expect(ids(adapted.quiz)).toEqual(['fx-01-q1', 'fx-01-q2', 'fx-01-q3', 'fx-01-q5']);
      expect(ids(adapted.activities)).toEqual(['fx-01-scenario-1', 'fx-01-fix-3']);
      expect(adapted.taskSteps).toEqual(['Shared step one', 'Shared step two', 'Write a failing test first']);
    }
  });

  test('"Show everything" shows all of it, for any level', () => {
    for (const level of [...EXPERIENCE_LEVELS, null]) {
      const adapted = view(level, true);
      expect(adapted.body).toHaveLength(lesson.body.length);
      expect(ids(adapted.quiz)).toHaveLength(5);
      expect(adapted.activities).toHaveLength(3);
      expect(adapted.taskSteps).toHaveLength(4);
      expect(adapted.summary.hiddenCount).toBe(0);
      expect(adapted.summary.hasLevelContent).toBe(true);
    }
  });

  test('a learner with no level sees only the shared content, and is told something is hidden', () => {
    const adapted = view(null);
    expect(ids(adapted.quiz)).toEqual(['fx-01-q1', 'fx-01-q2', 'fx-01-q3']);
    expect(texts(adapted.body).some((text) => /^(NEWCOMER|DEPTH|INTERMEDIATE)/.test(text))).toBe(false);
    expect(adapted.summary.hiddenCount).toBeGreaterThan(0);
  });

  test('the summary counts what is hidden and knows when a lesson has no level content at all', () => {
    // For a beginner: the depth block, the intermediate tip, the advanced activity, the advanced question and the advanced task step.
    expect(view('beginner').summary).toEqual({ hiddenCount: 5, hasLevelContent: true });
    const plain: Lesson = { ...lesson, body: lesson.body.filter((block) => !block.audience && !(block.type === 'activity' && block.activity.audience)), quiz: lesson.quiz.filter((question) => !question.audience), taskExtra: undefined };
    expect(adaptLesson(plain, 'beginner').summary).toEqual({ hiddenCount: 0, hasLevelContent: false });
  });

  test('the shared teaching alone satisfies the lesson structure for everybody, and each level is asked 3 to 6 questions', () => {
    expect(lessonStructureProblems(lesson)).toEqual([]);
    const sharedWords = splitLesson(lesson.body.filter((block) => !block.audience)).learn;
    expect(sharedWords.length).toBeGreaterThan(0);
    for (const level of EXPERIENCE_LEVELS) {
      const asked = view(level).quiz.length;
      expect(asked).toBeGreaterThanOrEqual(3);
      expect(asked).toBeLessThanOrEqual(6);
    }
  });

  test('a learner is never asked nothing, even if every question was written for other levels', () => {
    const tagged: Lesson = { ...lesson, quiz: lesson.quiz.map((question) => ({ ...question, audience: { min: 'professional' } })) };
    expect(adaptLesson(tagged, 'beginner').quiz).toHaveLength(5);
  });
});

describe('the project for the five levels', () => {
  test('the steps and the rubric differ per level: shared first, then the extras for the level', () => {
    const byLevel = Object.fromEntries(EXPERIENCE_LEVELS.map((level) => [level, adaptProject(project, level)]));
    expect(ids(byLevel['complete-beginner'].steps)).toEqual(['fx-p1-s1', 'fx-p1-s2']);
    expect(ids(byLevel.intermediate.steps)).toEqual(['fx-p1-s1', 'fx-p1-s3']);
    expect(ids(byLevel.professional.steps)).toEqual(['fx-p1-s1', 'fx-p1-s3', 'fx-p1-s4']);
    expect(byLevel['complete-beginner'].rubric).toEqual(['Works', 'Is explained', 'Is shared', 'Says in plain words what each part does']);
    expect(byLevel.intermediate.rubric).toEqual(['Works', 'Is explained', 'Is shared', 'Uses an API or a database']);
    expect(byLevel.professional.rubric).toEqual(['Works', 'Is explained', 'Is shared', 'Uses an API or a database', 'Has tests and handles errors']);
    expect(new Set(EXPERIENCE_LEVELS.map((level) => byLevel[level].rubric.join('|'))).size).toBeGreaterThan(2);
  });

  test('every level keeps all the shared criteria, so a pass is possible at every level', () => {
    for (const level of EXPERIENCE_LEVELS) expect(rubricFor(project, level).slice(0, project.rubric.length)).toEqual(project.rubric);
    expect(rubricFor(project, null)).toEqual(project.rubric);
  });

  test('Show everything adds every extra; a project with no extras is the same for everyone', () => {
    expect(adaptProject(project, 'beginner', true).rubric).toHaveLength(6);
    const plain = { steps: [{ id: 'a-p1-s1', text: 'x' }], rubric: ['one', 'two', 'three'] };
    for (const level of EXPERIENCE_LEVELS) expect(adaptProject(plain, level)).toMatchObject({ rubric: plain.rubric, summary: { hiddenCount: 0, hasLevelContent: false } });
  });

  test('a translated project inherits the levels from the original by step id', () => {
    const translated: Project = { ...project, rubricExtra: undefined, steps: project.steps.map((step) => ({ ...step, audience: undefined, text: `fil ${step.text}` })) };
    const merged = inheritLevels(translated, project);
    expect(ids(adaptProject(merged, 'complete-beginner').steps)).toEqual(['fx-p1-s1', 'fx-p1-s2']);
    expect(adaptProject(merged, 'professional').rubric).toHaveLength(5);
    expect(inheritLevels(project, project)).toBe(project);
  });
});

describe('audiences and untrusted levels', () => {
  test('levelsInAudience lists the covered levels and cleanLevel accepts only the five ids', () => {
    expect(levelsInAudience({ max: 'beginner' })).toEqual(['complete-beginner', 'beginner']);
    expect(levelsInAudience({ min: 'advanced' })).toEqual(['advanced', 'professional']);
    expect(levelsInAudience(undefined)).toEqual([...EXPERIENCE_LEVELS]);
    expect(cleanLevel('professional')).toBe('professional');
    for (const bad of ['wizard', '', 3, null, undefined, {}, ['beginner']]) expect(cleanLevel(bad)).toBeNull();
  });
});

describe('levelCoverage', () => {
  test('counts the tagged pieces each level is given', () => {
    const course = { lessons: [lesson], projects: [project] };
    const coverage = levelCoverage(course);
    expect(coverage['complete-beginner']).toEqual({ blocks: 1, questions: 1, activities: 1, steps: 1 + 1, rubric: 1, total: 1 + 1 + 1 + 2 + 1 });
    expect(coverage.intermediate).toEqual({ blocks: 1, questions: 0, activities: 0, steps: 1, rubric: 1, total: 3 });
    expect(coverage.professional).toEqual({ blocks: 1, questions: 1, activities: 1, steps: 1 + 2, rubric: 2, total: 1 + 1 + 1 + 3 + 2 });
    expect(levelCoverage({ lessons: [{ ...lesson, body: [lesson.body[0]], quiz: [], taskExtra: undefined }], projects: [] })['beginner'].total).toBe(0);
  });

  test('reports how adapted every course in the catalog is (never fails)', () => {
    const rows = COURSES.map((course) => ({ id: course.id, coverage: levelCoverage(course) }));
    const adapted = rows.filter((row) => EXPERIENCE_LEVELS.some((level) => row.coverage[level].total > 0));
    const perLevel = EXPERIENCE_LEVELS.map((level) => `${level}: ${rows.reduce((sum, row) => sum + row.coverage[level].total, 0)}`).join(', ');
    // A report, not a rule: the number of courses carrying level pieces, and the pieces each level is given across the catalog.
    console.info(`Level coverage: ${adapted.length} of ${rows.length} courses carry level-specific pieces. Pieces given per level across the catalog: ${perLevel}.`);
    expect(rows).toHaveLength(COURSES.length);
  });
});

describe('suggestNextLevel', () => {
  const done = (difficulty: 'beginner' | 'intermediate' | 'advanced', quizAverage: number | null = 0.9) => ({ difficulty, quizAverage });

  test('two completed courses in the tier with a quiz average of 80% or more suggest ONE step up', () => {
    const result = suggestNextLevel({ level: 'complete-beginner', completed: [done('beginner', 0.8), done('beginner', 0.9)] });
    expect(result).toMatchObject({ to: 'beginner', reasons: [{ kind: 'courses', count: 2, tier: 'beginner', average: 0.85 }] });
    // Never two steps, whatever the evidence.
    expect(suggestNextLevel({ level: 'complete-beginner', completed: [done('advanced'), done('advanced'), done('advanced'), done('advanced'), done('intermediate')] })?.to).toBe('beginner');
  });

  test('no suggestion on thin evidence: one course, a low average, or no quiz taken', () => {
    expect(suggestNextLevel({ level: 'complete-beginner', completed: [done('beginner')] })).toBeNull();
    expect(suggestNextLevel({ level: 'complete-beginner', completed: [done('beginner', 0.7), done('beginner', 0.75)] })).toBeNull();
    expect(suggestNextLevel({ level: 'complete-beginner', completed: [done('beginner', null), done('beginner')] })).toBeNull();
    expect(suggestNextLevel({ level: 'beginner', completed: [] })).toBeNull();
  });

  test('accepting a suggestion does not make the next one appear at once', () => {
    const twoBeginner = [done('beginner'), done('beginner')];
    expect(suggestNextLevel({ level: 'complete-beginner', completed: twoBeginner })?.to).toBe('beginner');
    expect(suggestNextLevel({ level: 'beginner', completed: twoBeginner })).toBeNull();
    const twoIntermediate = [done('intermediate'), done('intermediate')];
    expect(suggestNextLevel({ level: 'beginner', completed: twoIntermediate })?.to).toBe('intermediate');
    expect(suggestNextLevel({ level: 'intermediate', completed: twoIntermediate })).toBeNull();
    expect(suggestNextLevel({ level: 'beginner', completed: [done('beginner'), done('beginner'), done('beginner'), done('beginner')] })?.to).toBe('intermediate');
    expect(suggestNextLevel({ level: 'intermediate', completed: [done('advanced'), done('advanced')] })?.to).toBe('advanced');
  });

  test('a skill check that shows more suggests one step up, with its own reason', () => {
    expect(suggestNextLevel({ level: 'beginner', completed: [], skillCheck: 'strong' })).toEqual({ to: 'intermediate', reasons: [{ kind: 'skill-check', result: 'strong' }] });
    expect(suggestNextLevel({ level: 'intermediate', completed: [], skillCheck: 'comfortable' })).toBeNull();
    expect(suggestNextLevel({ level: 'beginner', completed: [done('beginner'), done('beginner'), done('beginner'), done('beginner')], skillCheck: 'strong' })?.reasons).toHaveLength(2);
  });

  test('never moves down, never suggests professional from scores, and says nothing without a level', () => {
    expect(suggestNextLevel({ level: 'advanced', completed: [done('advanced'), done('advanced'), done('advanced')], skillCheck: 'strong' })).toBeNull();
    expect(suggestNextLevel({ level: 'professional', completed: [done('advanced'), done('advanced')], skillCheck: 'new' })).toBeNull();
    expect(suggestNextLevel({ level: 'advanced', completed: [], skillCheck: 'new' })).toBeNull();
    expect(suggestNextLevel({ level: null, completed: [done('beginner'), done('beginner')] })).toBeNull();
  });
});

describe('quiz scoring stays fair when the questions asked change', () => {
  test('a stored score is a pair; the better FRACTION wins, ties keep the stored one', () => {
    expect(betterScore(null, { correct: 3, total: 4 })).toEqual({ correct: 3, total: 4 });
    expect(betterScore({ correct: 3, total: 4 }, { correct: 5, total: 6 })).toEqual({ correct: 5, total: 6 });
    expect(betterScore({ correct: 4, total: 4 }, { correct: 5, total: 6 })).toEqual({ correct: 4, total: 4 });
    expect(betterScore({ correct: 3, total: 4 }, { correct: 6, total: 8 })).toEqual({ correct: 3, total: 4 });
    expect(betterScore({ correct: null, total: null }, { correct: 1, total: 4 })).toEqual({ correct: 1, total: 4 });
    expect(betterScore({ correct: 0, total: 0 }, { correct: 2, total: 5 })).toEqual({ correct: 2, total: 5 });
  });

  test('completion is computed on the questions THIS learner was asked: 60% of what was asked', () => {
    // A professional is asked 4 (3 shared + 1 hard): 3 right is 75% and passes; 2 right is 50% and doesn't.
    const asked = adaptLesson(lesson, 'professional').quiz.length;
    expect(asked).toBe(4);
    expect(quizPassed(3, asked)).toBe(true);
    expect(quizPassed(2, asked)).toBe(false);
    // The same count of right answers is judged differently against a different number asked, which is the point.
    expect(quizPassed(3, 5)).toBe(true);
    expect(quizPassed(3, 6)).toBe(false);
    expect(quizPassed(0, 0)).toBe(false);
  });

  test('changing level never un-finishes a lesson: completion reads the stored completion, not the questions', () => {
    const course = makeCourse('fx', 2);
    const rows = [{ lesson_id: 'fx-01', course_id: 'fx', completed_at: '2026-11-14T10:00:00Z', quiz_correct: 3, quiz_total: 3, task_done: 0 }];
    const before = computeCourseProgress(course, rows, []);
    // Level has no input here at all: the same rows give the same progress at every level.
    const after = computeCourseProgress(course, rows, []);
    expect(after.lessonState('fx-01')).toBe('done');
    expect(after.lessonsDone).toBe(before.lessonsDone);
    expect(after.quizAverage).toBe(before.quizAverage);
  });
});
