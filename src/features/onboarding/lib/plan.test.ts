import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../../courses/content';
import { buildCourseFacts } from '../../courses/lib/catalog-facts';
import { fullCatalog } from '../../courses/lib/full-catalog.test-helpers';
import { buildPlan, rankCourses, scheduleFor, type PlanContext } from './plan';
import { EMPTY_PROFILE, type LearnerProfile } from './profile';

const profile = (patch: Partial<LearnerProfile>): LearnerProfile => ({ ...EMPTY_PROFILE, ...patch });

/** The final catalog: the real courses plus a stub for every one still to be written, so these tests describe the finished app. */
const CATALOG = fullCatalog();
const FACTS = new Map(buildCourseFacts(CATALOG).map((facts) => [facts.id, facts]));
const IDS = new Set(CATALOG.map((course) => course.id));
const facts = (id: string) => {
  const found = FACTS.get(id);
  if (!found) throw new Error(`no course ${id}`);
  return found;
};

const mineOwns = (...owned: string[]): PlanContext => ({
  owns: (id) => id === 'starter' || owned.includes(id),
  nextLesson: (id) => {
    const course = CATALOG.find((entry) => entry.id === id);
    const lesson = course?.lessons[0];
    return lesson ? { id: lesson.id, title: lesson.title, day: lesson.day } : null;
  },
  complete: () => false,
});

describe('the profiles from the brief', () => {
  test('1. a complete beginner with no experience starts from the very beginning, with the free course first', () => {
    const plan = buildPlan(profile({ experience: 'complete-beginner', goals: ['from-scratch'], dailyMinutes: 10 }), CATALOG);
    const start = facts(plan.startCourse.id);
    expect(plan.startCourse.id).toBe('ai-coding-beginners');
    expect(start.level).toBe('beginner');
    expect(start.category).toBe('ai-coding-fundamentals');
    expect(start.prerequisites).toEqual([]);
    // The first lesson of every course is free, so the plan starts in the course itself.
    expect(plan.startsWithFree).toBe(false);
    expect(plan.firstStep).toMatchObject({ kind: 'lesson', courseId: 'ai-coding-beginners', lessonId: 'ai-coding-beginners-01', free: true });
    expect(plan.schedule.lessonsPerWeek).toBeLessThan(7);
    expect(plan.nextCourses.every((course) => facts(course.id).level === 'beginner')).toBe(true);
  });

  test('2. a beginner interested in web development is led to coding with AI, then Build a Website, with the languages covered in context', () => {
    const plan = buildPlan(profile({ experience: 'beginner', goals: ['frontend', 'full-stack'], interests: ['html-css', 'javascript', 'react'] }), CATALOG);
    expect(plan.startCourse.id).toBe('ai-coding-beginners');
    expect([plan.startCourse.id, ...plan.nextCourses.map((course) => course.id)]).toEqual(expect.arrayContaining(['ai-coding-beginners', 'build-website-ai']));
    // HTML, CSS, JavaScript and React are not courses: they are covered where the AI-first courses use them.
    expect(plan.topics.map((topic) => topic.status)).toEqual(['related', 'related', 'related']);
    expect(plan.topics.every((topic) => topic.courseId !== null && IDS.has(topic.courseId))).toBe(true);
    expect(plan.topics.find((topic) => topic.interest === 'react')?.courseId).toBe('build-website-ai');
    // No language topic is ever "coming soon": nothing here asks the screen for a coming-soon card.
    expect(plan.topics.some((topic) => topic.status === 'soon')).toBe(false);
  });

  test('3. an intermediate web developer is not sent back to the basics: the full-stack course first, then the website course and what builds on it', () => {
    const plan = buildPlan(profile({ experience: 'intermediate', goals: ['frontend', 'improve-skills'], interests: ['typescript', 'react'] }), CATALOG);
    expect(plan.startCourse.id).toBe('build-fullstack-ai');
    expect(plan.nextCourses.map((course) => course.id)).toEqual(expect.arrayContaining(['build-website-ai']));
    expect(facts(plan.startCourse.id).level).not.toBe('beginner');
    expect(plan.topics.map((topic) => topic.status)).toEqual(['related', 'related']);
  });

  test('4. an aspiring mobile developer is led to Build a Mobile App with AI, and mobile is no longer "coming soon"', () => {
    const plan = buildPlan(profile({ experience: 'beginner', goals: ['mobile'], interests: ['react-native', 'expo', 'flutter'] }), CATALOG);
    expect([plan.startCourse.id, ...plan.nextCourses.map((course) => course.id)]).toContain('build-mobile-app-ai');
    expect(plan.comingSoonGoals).toEqual([]);
    expect(plan.topics.every((topic) => topic.status === 'related' && topic.courseId === 'build-mobile-app-ai')).toBe(true);
  });

  test('5. an intermediate learner interested in AI starts with the AI courses', () => {
    const plan = buildPlan(profile({ experience: 'intermediate', goals: ['ai'], interests: ['llm', 'rag', 'python', 'ml'] }), CATALOG);
    const aiCategories = ['advanced-ai-engineering', 'ai-coding-tools', 'ai-coding-fundamentals', 'vibe-coding'];
    expect(aiCategories).toContain(facts(plan.startCourse.id).category);
    expect(plan.nextCourses.every((course) => aiCategories.includes(facts(course.id).category))).toBe(true);
    expect([plan.startCourse.id, ...plan.nextCourses.map((course) => course.id)]).toEqual(expect.arrayContaining(['agentic-coding']));
    // Since 2026-11-18 the LLMs interest has a course of its own, How Large Language Models Work (it was ai-dev-intro before).
    expect(plan.topics.find((topic) => topic.interest === 'llm')).toMatchObject({ status: 'course', courseId: 'how-llms-work' });
    // RAG, Python and machine learning have no course of their own: they point at the courses that use them and say so.
    expect(plan.topics.find((topic) => topic.interest === 'rag')?.status).toBe('related');
    expect(plan.topics.find((topic) => topic.interest === 'python')).toMatchObject({ status: 'related', courseId: 'mini-python-ai' });
    expect(plan.topics.find((topic) => topic.interest === 'ml')?.status).toBe('related');
  });

  test('6. an experienced developer preparing for interviews gets advanced AI-engineering material, not the basics', () => {
    const plan = buildPlan(profile({ experience: 'professional', goals: ['interview-prep', 'improve-skills'] }), CATALOG);
    expect(facts(plan.startCourse.id).level).not.toBe('beginner');
    expect(['advanced-ai-engineering', 'ai-workflows', 'careers', 'ai-coding-tools']).toContain(facts(plan.startCourse.id).category);
    expect(plan.nextCourses.map((course) => course.id)).toEqual(expect.arrayContaining(['agentic-coding', 'context-engineering']));
    expect(plan.nextCourses.every((course) => facts(course.id).level !== 'beginner')).toBe(true);
  });

  test('7. a goal the catalog has no course for (game development) is coming soon, with the nearest beginner course', () => {
    const plan = buildPlan(profile({ experience: 'beginner', goals: ['game-dev'] }), CATALOG);
    expect(plan.comingSoonGoals).toEqual(['game-dev']);
    expect(facts(plan.startCourse.id).level).toBe('beginner');
    expect(['ai-coding-fundamentals', 'vibe-coding']).toContain(facts(plan.startCourse.id).category);
  });
});

describe('plan rules', () => {
  const EXPERIENCES = ['complete-beginner', 'beginner', 'intermediate', 'advanced', 'professional'] as const;
  const GOALS = ['from-scratch', 'software-engineer', 'frontend', 'backend', 'full-stack', 'mobile', 'ai', 'data-science', 'game-dev', 'improve-skills', 'interview-prep', 'build-startup', 'explore-cs', 'freelance', 'teach'] as const;

  test.each([
    ['the final catalog', CATALOG],
    ['the courses written so far', COURSES],
  ])('only recommends courses that exist in %s, and the first step is a real lesson', (_, catalog) => {
    const ids = new Set(catalog.map((course) => course.id));
    for (const experience of EXPERIENCES) {
      for (const goal of GOALS) {
        const plan = buildPlan(profile({ experience, goals: [goal], interests: ['react', 'rag', 'java', 'networking', 'flutter'] }), catalog);
        for (const id of [plan.startCourse.id, plan.firstStep.courseId, ...plan.nextCourses.map((course) => course.id), ...plan.topics.flatMap((topic) => (topic.courseId ? [topic.courseId] : []))]) expect(ids.has(id)).toBe(true);
        if (plan.firstStep.kind === 'lesson') {
          const step = plan.firstStep;
          expect(catalog.find((course) => course.id === step.courseId)?.lessons.some((lesson) => lesson.id === step.lessonId)).toBe(true);
        }
      }
    }
  });

  test('the course the learner picked starts the plan; a paid pick still begins with the free course', () => {
    const base = profile({ experience: 'beginner', goals: ['freelance'] });
    expect(buildPlan(base, CATALOG).startCourse.id).toBe('freelancer');
    const picked = buildPlan(base, CATALOG, mineOwns(), { preferredStartId: 'educator' });
    expect(picked.startCourse.id).toBe('educator');
    expect(picked.nextCourses.some((course) => course.id === 'educator')).toBe(false);
    expect(picked.startsWithFree).toBe(false);
    expect(picked.firstStep).toMatchObject({ courseId: 'educator', lessonId: 'educator-01', free: true });
    // Its free first lesson already done and the course not bought: on with the free starter course.
    const afterTaste = buildPlan(base, CATALOG, { ...mineOwns(), nextLesson: (id) => (id === 'educator' ? { id: 'educator-02', title: 'Lesson 2', day: 2 } : mineOwns().nextLesson(id)) }, { preferredStartId: 'educator' });
    expect(afterTaste.startsWithFree).toBe(true);
    expect(afterTaste.firstStep).toMatchObject({ courseId: 'starter', free: true });
    // Owned, it is the first step; an id that is not in the catalog, or finished, is ignored.
    expect(buildPlan(base, CATALOG, mineOwns('educator'), { preferredStartId: 'educator' }).firstStep).toMatchObject({ courseId: 'educator' });
    expect(buildPlan(base, CATALOG, mineOwns(), { preferredStartId: 'no-such-course' }).startCourse.id).toBe('freelancer');
    expect(buildPlan(base, CATALOG, { ...mineOwns(), complete: (id) => id === 'educator' }, { preferredStartId: 'educator' }).startCourse.id).toBe('freelancer');
  });

  test('freelance and teaching goals keep their own courses', () => {
    expect(buildPlan(profile({ experience: 'beginner', goals: ['freelance'] }), CATALOG).startCourse.id).toBe('freelancer');
    expect(buildPlan(profile({ experience: 'professional', goals: ['teach'] }), CATALOG).startCourse.id).toBe('educator');
  });

  test('a learner who owns the starting course begins in it, not in the free course', () => {
    const answers = profile({ experience: 'beginner', goals: ['full-stack'] });
    const start = buildPlan(answers, CATALOG).startCourse.id;
    const plan = buildPlan(answers, CATALOG, mineOwns(start));
    expect(plan.startsWithFree).toBe(false);
    expect(plan.firstStep).toMatchObject({ kind: 'lesson', courseId: start, lessonId: `${start}-01` });
  });

  test('a finished starting course moves the plan on to the next one, and a finished course is never suggested again', () => {
    const answers = profile({ experience: 'beginner', goals: ['full-stack'] });
    const start = buildPlan(answers, CATALOG).startCourse.id;
    const done: PlanContext = { ...mineOwns(start), complete: (id) => id === start };
    const plan = buildPlan(answers, CATALOG, done);
    expect(plan.startCourse.id).not.toBe(start);
    expect(plan.nextCourses.map((course) => course.id)).not.toContain(start);
  });

  test('a course the learner has begun can still be where the plan starts', () => {
    const answers = profile({ experience: 'complete-beginner', goals: ['from-scratch'] });
    const start = buildPlan(answers, CATALOG).startCourse.id;
    const context: PlanContext = { ...mineOwns(start), progress: [{ courseId: start, fraction: 0.4, complete: false, started: true, quizAverage: null, lessonsDone: 3 }] };
    expect(buildPlan(answers, CATALOG, context).startCourse.id).toBe(start);
  });

  test('completed courses change what comes next: after the beginner course and Build a Website the plan reaches for the full-stack course', () => {
    const answers = profile({ experience: 'complete-beginner', goals: ['frontend', 'full-stack'] });
    const context: PlanContext = { ...mineOwns(), complete: (id) => ['ai-coding-beginners', 'build-website-ai'].includes(id) };
    const plan = buildPlan(answers, CATALOG, context);
    expect([plan.startCourse.id, ...plan.nextCourses.map((course) => course.id)]).toEqual(expect.arrayContaining(['build-fullstack-ai']));
    expect(plan.nextCourses.map((course) => course.id)).not.toContain('build-website-ai');
  });

  test('a good skill check raises the starting point; a changed answer changes the plan without losing anything', () => {
    const base = profile({ experience: 'complete-beginner', goals: ['software-engineer'] });
    const raised = profile({ ...base, assessment: { level: 'strong', correct: 6, total: 8, at: '2026-11-13' } });
    expect(buildPlan(base, CATALOG).experience).toBe('complete-beginner');
    expect(buildPlan(raised, CATALOG).experience).toBe('advanced');
    expect(facts(buildPlan(raised, CATALOG).startCourse.id).level).not.toBe('beginner');
    expect(buildPlan(profile({ ...base, goals: ['teach'] }), CATALOG).startCourse.id).toBe('educator');
  });

  test('the reasons name the goals and interests that match the starting course', () => {
    const plan = buildPlan(profile({ experience: 'intermediate', goals: ['frontend'], interests: ['react'] }), CATALOG);
    expect(plan.startCourse.id).toBe('build-website-ai');
    expect(plan.reasons).toEqual(expect.arrayContaining([{ kind: 'experience', level: 'intermediate' }, { kind: 'goal', goal: 'frontend' }, { kind: 'interest', interest: 'react' }]));
  });

  test('"not sure yet" is fine: the plan follows the goals', () => {
    const plan = buildPlan(profile({ experience: 'beginner', goals: ['explore-cs'], interests: ['not-sure'] }), CATALOG);
    expect(plan.topics).toEqual([]);
    expect(IDS.has(plan.startCourse.id)).toBe(true);
  });

  test('with nothing answered yet it still returns a valid plan', () => {
    expect(IDS.has(buildPlan(EMPTY_PROFILE, CATALOG).startCourse.id)).toBe(true);
  });

  test('ranking lists every course exactly once, so nothing is hidden by the answers', () => {
    const ranked = rankCourses(profile({ experience: 'beginner', goals: ['mobile'] }), CATALOG);
    expect(ranked).toHaveLength(CATALOG.length);
    expect(new Set(ranked.map((entry) => entry.id))).toEqual(IDS);
  });
});

describe('schedule', () => {
  test('short sessions are not penalized: five minutes a day is a real, slower plan', () => {
    const slow = scheduleFor({ dailyMinutes: 5, days: [], timeOfDay: null, weeklyGoal: null }, 20);
    const fast = scheduleFor({ dailyMinutes: 30, days: [], timeOfDay: null, weeklyGoal: null }, 20);
    expect(slow.lessonsPerWeek).toBeGreaterThanOrEqual(1);
    expect(slow.weeksToFinish).toBeGreaterThan(fast.weeksToFinish);
  });

  test('uses the chosen days and an explicit weekly goal', () => {
    const plan = scheduleFor({ dailyMinutes: 15, days: [1, 3, 5], timeOfDay: 'evening', weeklyGoal: 2 }, 20);
    expect(plan).toMatchObject({ daysPerWeek: 3, lessonsPerWeek: 2, timeOfDay: 'evening', weeksToFinish: 10 });
  });
});
