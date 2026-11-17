import { describe, expect, test } from '@jest/globals';

import { LEARNING_PATHS } from '../../content/catalog/paths';
import { buildCourseFacts } from '../catalog-facts';
import { makeCourse } from '../fixtures.test-helpers';
import { FLAT_RARITY, matchTarget } from './match';
import { INTEREST_TARGETS } from './profile-mapping';
import { EMPTY_FILTERS } from '../discovery/filters';
import { runDiscovery } from '../discovery/query';
import { recommendCourses } from './recommend';
import { buildDiscoverySections, MIN_RELEVANCE, shownCourseIds } from './sections';
import { signalsFrom } from './signals';
import { FACTS, finished, idsOf, profileOf, signalsFor } from './recommendations.test-helpers';

const NOW = '2026-11-20';
const sectionsFor = (...args: Parameters<typeof signalsFor>) => buildDiscoverySections(signalsFor(...args), FACTS, { now: NOW });

describe('the beginner interested in web development', () => {
  const sections = sectionsFor({ experience: 'complete-beginner', goals: ['from-scratch', 'frontend'], interests: ['html-css', 'javascript', 'react'] });

  test('the recommendations lead with the beginner course and Build a Website', () => {
    expect(idsOf(sections.recommended ?? [])).toEqual(expect.arrayContaining(['ai-coding-beginners', 'build-website-ai']));
    expect(sections.recommended).toHaveLength(6);
    expect((sections.recommended ?? []).every((entry) => entry.facts.level === 'beginner')).toBe(true);
  });

  test('the path is a roadmap with Build a Website shown but not ready, and a next course to take', () => {
    const path = sections.yourPath;
    expect(path).toBeDefined();
    const steps = new Map((path?.steps ?? []).map((step) => [step.facts.id, step]));
    expect(steps.get('build-website-ai')).toMatchObject({ state: 'upcoming', ready: false });
    expect(steps.get('build-website-ai')?.missingPrerequisites).toEqual(['ai-coding-beginners']);
    expect(steps.has('prompt-engineering-dev')).toBe(true);
    expect(path?.nextStep?.facts.id).toBe('ai-coding-beginners');
    expect(path?.nextStep?.ready).toBe(true);
    expect(path?.nextStep?.state).toBe('next');
    // Someone who has never coded gets the first-app path: it starts at Coding with AI for Complete Beginners.
    expect(path?.path.id).toBe('first-app');
    // Everything on the path, in the path's own order, nothing left out.
    expect(path?.steps.map((step) => step.facts.id)).toEqual(path?.path.courseIds);
  });

  test('"explore your interests" lists only courses that are about one of the chosen interests', () => {
    const interests = ['html-css', 'javascript', 'react'] as const;
    const explore = sections.exploreInterests ?? [];
    expect(explore.length).toBeGreaterThan(0);
    for (const entry of explore) expect(interests.some((interest) => matchTarget(entry.facts, INTEREST_TARGETS[interest], FLAT_RARITY).direct)).toBe(true);
  });
});

describe('a student keeps the whole catalog whatever they picked', () => {
  const profile = { experience: 'intermediate' as const, goals: ['frontend' as const, 'full-stack' as const], interests: ['react' as const, 'nextjs' as const, 'typescript' as const] };

  test('personalizing never filters the catalog: every course is still reachable', () => {
    const all = recommendCourses(signalsFor(profile), FACTS, { scope: 'everything' });
    expect(all).toHaveLength(FACTS.length);
    // Including the ones that have nothing to do with what they asked for.
    expect(idsOf(all)).toEqual(expect.arrayContaining(['freelancer', 'educator', 'ai-coding-security', 'build-mobile-app-ai']));
  });

  test('"Explore all" shows the full catalog, whatever they picked', () => {
    const explored = runDiscovery(FACTS, { text: '', filters: EMPTY_FILTERS, sort: 'recommended' }, { recommendedRank: new Map(recommendCourses(signalsFor(profile), FACTS, { scope: 'everything' }).map((entry, index) => [entry.facts.id, index])) });
    expect(explored.total).toBe(FACTS.length);
    expect(explored.results).toHaveLength(FACTS.length);
  });

  test('a learner with no goals or interests is recommended nothing (the home offers first steps instead)', () => {
    const open = sectionsFor({});
    expect(open.recommended).toBeUndefined();
    expect(open.yourPath).toBeUndefined();
    expect(open.exploreInterests).toBeUndefined();
  });
});

describe('sections omit themselves when they have nothing relevant', () => {
  test('a brand new learner has no continue section, no path, nothing recommended', () => {
    const sections = sectionsFor({});
    expect(sections.continueLearning).toBeUndefined();
    expect(Object.keys(sections)).not.toContain('recommended');
  });

  test('no interests means no "explore your interests"', () => {
    expect(sectionsFor({ experience: 'beginner', goals: ['ai'] }).exploreInterests).toBeUndefined();
    expect(sectionsFor({ experience: 'beginner', goals: ['ai'], interests: ['not-sure'] }).exploreInterests).toBeUndefined();
  });

  test('a goal with nothing about it in a tiny catalog leaves recommended and the path out rather than padding them', () => {
    const tiny = buildCourseFacts([makeCourse('only-one', 5, [], 'standard')]);
    const sections = buildDiscoverySections(signalsFrom(profileOf({ experience: 'beginner', goals: ['mobile'], interests: ['flutter'] }), [], { facts: tiny }), tiny, { now: NOW });
    expect(sections.recommended).toBeUndefined();
    expect(sections.yourPath).toBeUndefined();
    expect(sections.exploreInterests).toBeUndefined();
  });

  test('there is no popular section: Talino has no enrollment data', () => {
    expect(Object.keys(sectionsFor({ experience: 'beginner', goals: ['ai'], interests: ['llm'] }))).not.toContain('popular');
  });
});

describe('continue learning', () => {
  const progress = [
    { courseId: 'prompt-engineering-dev', fraction: 0.5, complete: false, started: true, quizAverage: null, lessonsDone: 4 },
    { courseId: 'ai-coding-beginners', fraction: 0.2, complete: false, started: true, quizAverage: null, lessonsDone: 2 },
    ...finished('starter'),
    ...finished('understanding-ai-code'),
  ];
  const signals = signalsFor({ experience: 'complete-beginner', goals: ['from-scratch', 'frontend'], interests: ['javascript'] }, progress, {
    lastActivityAt: { 'prompt-engineering-dev': '2026-11-10T09:00:00Z', 'ai-coding-beginners': '2026-11-12T09:00:00Z' },
  });
  const sections = buildDiscoverySections(signals, FACTS, { now: NOW });

  test('lists started, unfinished courses, most recent first, never a completed one', () => {
    expect(idsOf(sections.continueLearning ?? [])).toEqual(['ai-coding-beginners', 'prompt-engineering-dev']);
    expect(sections.continueLearning?.[0].fraction).toBe(0.2);
  });

  test('a started course is for "continue", not "recommended"; a completed one is never recommended', () => {
    const everywhere = [...idsOf(sections.recommended ?? []), ...idsOf(sections.exploreInterests ?? []), ...idsOf(sections.recentlyAdded ?? [])];
    for (const id of ['ai-coding-beginners', 'prompt-engineering-dev', 'starter', 'understanding-ai-code']) expect(everywhere).not.toContain(id);
  });

  test('the path marks a completed course done and a started one current', () => {
    expect(sections.yourPath?.path.id).toBe('first-app');
    const states = new Map((sections.yourPath?.steps ?? []).map((step) => [step.facts.id, step.state]));
    expect(states.get('understanding-ai-code')).toBe('done');
    expect(states.get('ai-coding-beginners')).toBe('current');
    expect(states.get('prompt-engineering-dev')).toBe('current');
    expect(sections.yourPath?.done).toBe(1);
  });
});

describe('your learning path', () => {
  const pathFor = (...args: Parameters<typeof signalsFor>) => sectionsFor(...args).yourPath;

  test('someone with no code experience who wants an app gets "Build Your First App with AI", starting at the beginner course', () => {
    for (const goals of [['from-scratch', 'build-startup'], ['from-scratch', 'frontend'], ['from-scratch']] as const) {
      const path = pathFor({ experience: 'complete-beginner', goals: [...goals] });
      expect(path?.path.id).toBe('first-app');
      expect(path?.nextStep?.facts.id).toBe('ai-coding-beginners');
    }
  });

  test('a learner who wants to learn AI development gets the flagship path, which starts with the free course', () => {
    for (const patch of [
      { experience: 'complete-beginner' as const, goals: ['ai' as const] },
      { experience: 'beginner' as const, goals: ['ai' as const, 'software-engineer' as const] },
      { experience: 'intermediate' as const, goals: ['ai' as const, 'software-engineer' as const] },
    ]) {
      const path = pathFor(patch);
      expect(path?.path.id).toBe('master-ai');
      expect(path?.steps[0].facts.id).toBe('starter');
    }
    expect(pathFor({ experience: 'beginner', goals: ['ai', 'software-engineer'] })?.nextStep?.facts.id).toBe('starter');
  });

  test('an experienced developer gets the agentic engineer path, and starts at agentic coding, not at the basics', () => {
    const path = pathFor({ experience: 'professional', goals: ['improve-skills', 'interview-prep'] });
    expect(path?.path.id).toBe('agentic-engineer');
    expect(path?.nextStep?.facts.id).toBe('agentic-coding');
  });

  test('a web-minded intermediate learner gets the idea-to-launch path through the full-stack course and deployment', () => {
    const path = pathFor({ experience: 'intermediate', goals: ['frontend', 'full-stack'], interests: ['react', 'nextjs', 'typescript'] });
    expect(path?.path.id).toBe('idea-to-launch');
    expect(path?.steps.map((step) => step.facts.id)).toEqual(expect.arrayContaining(['build-website-ai', 'build-fullstack-ai', 'ai-deployment']));
  });

  test('every path course exists in the final catalog, so a path never has a gap', () => {
    const all = new Set(FACTS.map((facts) => facts.id));
    for (const path of LEARNING_PATHS) for (const id of path.courseIds) expect(all.has(id)).toBe(true);
    const plan = pathFor({ experience: 'complete-beginner', goals: ['from-scratch'] });
    expect(plan?.steps).toHaveLength(plan?.path.courseIds.length ?? -1);
  });
});

describe('recently added', () => {
  const profile = { experience: 'beginner' as const, goals: ['software-engineer' as const] };

  test('the launch catalog is never "recently added": every learner meets it on day one', () => {
    for (const now of ['2026-11-14', '2026-11-20', '2026-12-01']) {
      expect(buildDiscoverySections(signalsFor(profile), FACTS, { now }).recentlyAdded).toBeUndefined();
    }
  });

  test('with new courses of different dates, only the ones inside the window appear', () => {
    const base = FACTS.map((facts) => facts.course);
    const fresh = { ...makeCourse('fresh-course', 5, [], 'standard'), title: 'Fresh React Course' };
    const facts = buildCourseFacts([...base, fresh]);
    const withDate = facts.map((entry) => (entry.id === 'fresh-course' ? { ...entry, published: '2026-12-10', goals: ['become-developer' as const], category: 'vibe-coding' as const } : { ...entry, published: '2026-01-01' }));
    const sections = buildDiscoverySections(signalsFrom(profileOf(profile), [], { facts: withDate }), withDate, { now: '2026-12-20' });
    expect(idsOf(sections.recentlyAdded ?? [])).toEqual(['fresh-course']);
    expect(buildDiscoverySections(signalsFrom(profileOf(profile), [], { facts: withDate }), withDate, { now: '2027-02-01' }).recentlyAdded).toBeUndefined();
    // Nothing from the future, and the window is 30 days.
    expect(buildDiscoverySections(signalsFrom(profileOf(profile), [], { facts: withDate }), withDate, { now: '2026-12-09' }).recentlyAdded).toBeUndefined();
    expect(idsOf(buildDiscoverySections(signalsFrom(profileOf(profile), [], { facts: withDate }), withDate, { now: '2027-01-09' }).recentlyAdded ?? [])).toEqual(['fresh-course']);
  });
});

describe('improve your skills', () => {
  const quiz = (courseId: string, quizAverage: number) => ({ courseId, fraction: 0.5, complete: false, started: true, quizAverage, lessonsDone: 4 });

  test('appears only after quizzes, for the categories under 70%, weakest first, never a finished course', () => {
    expect(sectionsFor({ experience: 'beginner' }).improveSkills).toBeUndefined();
    const weakCategory = FACTS.find((fact) => fact.id === 'ai-dev-intro')?.category;
    const sections = sectionsFor({ experience: 'beginner', goals: ['ai'] }, [quiz('ai-dev-intro', 0.4), ...finished('starter')]);
    const improve = sections.improveSkills ?? [];
    expect(improve.length).toBeGreaterThan(0);
    for (const entry of improve) {
      expect(entry.facts.category).toBe(weakCategory);
      expect(entry.quizAverage).toBeLessThan(0.7);
      expect(entry.facts.id).not.toBe('starter');
    }
  });

  test('good quiz results ask for no extra practice', () => {
    expect(sectionsFor({ experience: 'beginner' }, [quiz('ai-dev-intro', 0.9)]).improveSkills).toBeUndefined();
  });
});

describe('prepare for your next level', () => {
  test('lists courses one learning level up, ready ones first, never one already shown above', () => {
    const signals = signalsFor({ experience: 'beginner', goals: ['ai'] }, finished('starter', 'ai-coding-beginners'));
    const sections = buildDiscoverySections(signals, FACTS, { now: NOW, learnerLevel: 'beginner' });
    expect(sections.nextLevel?.level).toBe('intermediate');
    const courses = sections.nextLevel?.courses ?? [];
    expect(courses.length).toBeGreaterThan(0);
    expect(courses.every((entry) => entry.facts.learningLevel === 'intermediate')).toBe(true);
    const ready = courses.map((entry) => entry.readiness.ready);
    expect(ready).toEqual([...ready].sort((a, b) => Number(b) - Number(a)));
    const ids = shownCourseIds(sections);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('no level known, or already Expert: no section', () => {
    expect(sectionsFor({ experience: 'beginner' }).nextLevel).toBeUndefined();
    expect(buildDiscoverySections(signalsFor({ experience: 'professional' }), FACTS, { now: NOW, learnerLevel: 'expert' }).nextLevel).toBeUndefined();
  });
});

describe('no course is shown twice on the same screen', () => {
  const learners = [
    signalsFor({ experience: 'complete-beginner', goals: ['from-scratch', 'frontend'], interests: ['html-css', 'javascript', 'react'] }),
    signalsFor({ experience: 'intermediate', goals: ['frontend', 'full-stack'], interests: ['react', 'nextjs', 'typescript'] }),
    signalsFor({ experience: 'beginner', goals: ['mobile'], interests: ['react-native', 'expo', 'flutter'] }),
    signalsFor({ experience: 'beginner', goals: ['ai', 'software-engineer'] }),
    signalsFor({ experience: 'intermediate', goals: ['ai'], interests: ['genai', 'rag', 'llm', 'ai-apps'] }),
    signalsFor({ experience: 'professional', goals: ['improve-skills', 'interview-prep'] }),
    signalsFor({ experience: 'beginner', goals: ['freelance', 'teach'] }, [{ courseId: 'freelancer', fraction: 0.3, complete: false, started: true, quizAverage: null, lessonsDone: 3 }, ...finished('starter')]),
    signalsFor({}),
  ];

  test.each(learners.map((signals, index) => [index, signals] as const))('learner %i', (_, signals) => {
    const sections = buildDiscoverySections(signals, FACTS, { now: NOW });
    const ids = shownCourseIds(sections);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of signals.completed) expect(ids).not.toContain(id);
    // The path lists every course in order; each one shown above says so.
    for (const step of sections.yourPath?.steps ?? []) {
      if (step.listedAbove) expect(['continueLearning', 'recommended']).toContain(step.listedAbove);
    }
  });
});

describe('evolution', () => {
  const profile = { experience: 'complete-beginner' as const, goals: ['frontend' as const, 'full-stack' as const] };

  test('finishing the beginner course and Build a Website moves the path forward and changes what is recommended', () => {
    const before = sectionsFor(profile);
    const after = sectionsFor(profile, finished('ai-coding-beginners', 'build-website-ai'));
    expect(idsOf(after.recommended ?? [])).not.toEqual(idsOf(before.recommended ?? []));
    expect(idsOf(after.recommended ?? [])).toEqual(expect.arrayContaining(['build-fullstack-ai']));
    expect(after.yourPath?.done).toBeGreaterThan(before.yourPath?.done ?? 0);
    const fullstackStep = after.yourPath?.steps.find((step) => step.facts.id === 'build-fullstack-ai');
    expect(fullstackStep?.ready).toBe(true);
    expect(before.yourPath?.steps.find((step) => step.facts.id === 'build-fullstack-ai')?.ready).toBe(false);
  });

  test('changing interests changes the output while completed and started progress is untouched', () => {
    const progress = [...finished('ai-coding-beginners'), { courseId: 'prompt-engineering-dev', fraction: 0.5, complete: false, started: true, quizAverage: null, lessonsDone: 3 }];
    const web = sectionsFor({ experience: 'beginner', goals: ['software-engineer'], interests: ['react'] }, progress);
    const data = sectionsFor({ experience: 'beginner', goals: ['software-engineer'], interests: ['python', 'sql'] }, progress);
    expect(idsOf(web.recommended ?? [])).not.toEqual(idsOf(data.recommended ?? []));
    expect(idsOf(web.continueLearning ?? [])).toEqual(['prompt-engineering-dev']);
    expect(idsOf(data.continueLearning ?? [])).toEqual(['prompt-engineering-dev']);
    expect(web.continueLearning?.[0].fraction).toBe(0.5);
    for (const sections of [web, data]) expect(shownCourseIds(sections)).not.toContain('ai-coding-beginners');
  });
});

describe('For you shows only what is about the learner\'s goals and interests (owner, 2026-11-17)', () => {
  const quiz = (courseId: string, quizAverage: number) => ({ courseId, fraction: 0.5, complete: false, started: true, quizAverage, lessonsDone: 4 });
  const profiles = {
    'web beginner': { experience: 'complete-beginner' as const, goals: ['from-scratch' as const, 'frontend' as const], interests: ['html-css' as const, 'javascript' as const] },
    'mobile': { experience: 'beginner' as const, goals: ['mobile' as const], interests: ['flutter' as const, 'ios' as const] },
    'data': { experience: 'intermediate' as const, goals: ['data-science' as const], interests: ['python' as const, 'ml' as const, 'sql' as const] },
    'generative AI': { experience: 'beginner' as const, goals: ['ai' as const], interests: ['genai' as const, 'llm' as const] },
    'game development (no course of its own)': { experience: 'beginner' as const, goals: ['game-dev' as const], interests: [] },
  };

  for (const [name, profile] of Object.entries(profiles)) {
    test(`${name}: every course in every personal section is about what they asked for`, () => {
      const signals = signalsFor(profile, [quiz('ai-dev-intro', 0.4), ...finished('starter')]);
      const sections = buildDiscoverySections(signals, FACTS, { now: NOW, learnerLevel: 'beginner' });
      const relevanceOf = new Map(recommendCourses(signals, FACTS, { scope: 'everything' }).map((entry) => [entry.facts.id, entry.relevance]));
      const lists = { recommended: sections.recommended, exploreInterests: sections.exploreInterests, nextLevel: sections.nextLevel?.courses, improveSkills: sections.improveSkills };
      for (const [section, list] of Object.entries(lists)) {
        for (const entry of list ?? []) expect([name, section, entry.facts.id, (relevanceOf.get(entry.facts.id) ?? 0) >= MIN_RELEVANCE]).toEqual([name, section, entry.facts.id, true]);
      }
    });
  }

  test('a generative AI learner is not sent to time management or soft skills', () => {
    const sections = buildDiscoverySections(signalsFor(profiles['generative AI']), FACTS, { now: NOW, learnerLevel: 'beginner' });
    const shown = shownCourseIds(sections);
    expect(shown).not.toContain('time-management-productivity');
    expect(shown).not.toContain('soft-skills-workplace');
    expect(shown).toContain('generative-ai-applications');
  });

  test('there is no "discover something new" block of categories the learner did not pick', () => {
    expect('discoverNew' in buildDiscoverySections(signalsFor(profiles['web beginner']), FACTS, { now: NOW })).toBe(false);
  });

  test('what they merely opened does not recommend a course: a game-development learner who browsed LLM courses is not sent to them', () => {
    const signals = signalsFor(profiles['game development (no course of its own)'], [], { exploredTechnologies: { llm: 6, chatgpt: 4 } });
    const sections = buildDiscoverySections(signals, FACTS, { now: NOW, learnerLevel: 'beginner' });
    expect(sections.recommended).toBeUndefined();
    expect(sections.exploreInterests).toBeUndefined();
  });

  test('a learning path is offered only when it is about their goals or interests, not because of progress already made', () => {
    const signals = signalsFor(profiles['game development (no course of its own)'], [...finished('starter', 'ai-coding-beginners')]);
    expect(buildDiscoverySections(signals, FACTS, { now: NOW, learnerLevel: 'beginner' }).yourPath).toBeUndefined();
  });

  test('someone who named nothing still gets what their own activity points at', () => {
    const signals = signalsFor({}, [], { exploredTechnologies: { cursor: 6, 'claude-code': 4 } });
    const sections = buildDiscoverySections(signals, FACTS, { now: NOW });
    expect((sections.recommended ?? []).length).toBeGreaterThan(0);
  });
});
