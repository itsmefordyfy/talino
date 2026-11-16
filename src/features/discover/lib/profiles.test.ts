import { describe, expect, test } from '@jest/globals';

import { LEARNING_PATHS } from '@/features/courses/content/catalog';
import { EMPTY_FILTERS } from '@/features/courses/lib/discovery/filters';
import { runDiscovery } from '@/features/courses/lib/discovery/query';
import { SORT_OPTIONS } from '@/features/courses/lib/discovery/sort';
import { buildDiscoverySections, recommendCourses } from '@/features/courses/lib/recommendations';
import { FACTS, finished, idsOf, profileOf, signalsFor } from '@/features/courses/lib/recommendations/recommendations.test-helpers';
import type { LearnerProfile } from '@/features/onboarding/lib/profile';

import { discoverStrings } from '../strings';
import { pathSummaries } from './browse';
import { isPersonalized, lastActivityByCourse, memoByKey, signalsKey } from './learner';
import { reasonLine } from './reasons';
import { startHere } from './start-here';

const PROFILES: Record<string, Partial<LearnerProfile>> = {
  'complete beginner': { experience: 'complete-beginner', goals: ['from-scratch'] },
  'web developer': { experience: 'intermediate', goals: ['frontend'], interests: ['react', 'javascript', 'html-css'] },
  'mobile developer': { experience: 'beginner', goals: ['mobile'], interests: ['react-native', 'expo'] },
  'AI enthusiast': { experience: 'intermediate', goals: ['ai'], interests: ['ai-coding', 'llm', 'rag'] },
  'experienced engineer': { experience: 'professional', goals: ['improve-skills', 'interview-prep'], interests: ['architecture', 'system-design'] },
  'someone exploring': { interests: ['not-sure'] },
};

const rankOf = (patch: Partial<LearnerProfile>) => new Map(recommendCourses(signalsFor(patch), FACTS, { scope: 'everything' }).map((entry, index) => [entry.facts.id, index]));

describe('personalize the experience, not the limitations', () => {
  for (const [name, patch] of Object.entries(PROFILES)) {
    test(`${name}: with no search and no filter, every sort shows the entire catalog`, () => {
      const recommendedRank = rankOf(patch);
      for (const option of SORT_OPTIONS) {
        const result = runDiscovery(FACTS, { text: '', filters: EMPTY_FILTERS, sort: option.key }, { recommendedRank });
        expect(result.total).toBe(FACTS.length);
        expect(new Set(idsOf(result.results.map((facts) => ({ facts })))).size).toBe(FACTS.length);
      }
    });

    test(`${name}: the recommended ranking is a permutation of the whole catalog`, () => {
      const rank = rankOf(patch);
      expect(rank.size).toBe(FACTS.length);
      expect([...rank.values()].sort((a, b) => a - b)).toEqual(FACTS.map((_, index) => index));
    });

    test(`${name}: a search finds any course whatever the answers were`, () => {
      const target = FACTS.find((facts) => facts.id === 'build-mobile-app-ai') ?? FACTS[FACTS.length - 1];
      const result = runDiscovery(FACTS, { text: target.course.title, filters: EMPTY_FILTERS, sort: 'recommended' }, { recommendedRank: rankOf(patch) });
      expect(result.results.map((facts) => facts.id)).toContain(target.id);
    });
  }

  test('the personalised sections differ between profiles', () => {
    const picks = Object.entries(PROFILES).map(([name, patch]) => [name, idsOf(buildDiscoverySections(signalsFor(patch), FACTS).recommended ?? [])] as const);
    const byName = new Map(picks);
    // Different people, different picks: no two of the clearly different profiles share the same list.
    const distinct = new Set(picks.map(([, ids]) => ids.join('|')));
    expect(distinct.size).toBeGreaterThanOrEqual(4);
    expect(byName.get('web developer')).not.toEqual(byName.get('mobile developer'));
    expect(byName.get('AI enthusiast')).not.toEqual(byName.get('experienced engineer'));
    expect(byName.get('complete beginner')).not.toEqual(byName.get('experienced engineer'));
  });

  test('a mobile developer is recommended the mobile course; a web developer the web ones', () => {
    const mobile = idsOf(buildDiscoverySections(signalsFor(PROFILES['mobile developer']), FACTS).recommended ?? []);
    const web = idsOf(buildDiscoverySections(signalsFor(PROFILES['web developer']), FACTS).recommended ?? []);
    expect(mobile).toContain('build-mobile-app-ai');
    expect(web).toEqual(expect.arrayContaining(['build-website-ai', 'build-fullstack-ai']));
    expect(web).not.toContain('build-mobile-app-ai');
  });

  test('progress changes the picks, but never the catalog', () => {
    const before = idsOf(buildDiscoverySections(signalsFor(PROFILES['web developer']), FACTS).recommended ?? []);
    const done = signalsFor(PROFILES['web developer'], finished(...before.slice(0, 2)));
    const after = idsOf(buildDiscoverySections(done, FACTS).recommended ?? []);
    expect(after).not.toContain(before[0]);
    const result = runDiscovery(FACTS, { text: '', filters: EMPTY_FILTERS, sort: 'recommended' }, { recommendedRank: new Map(recommendCourses(done, FACTS, { scope: 'everything' }).map((entry, index) => [entry.facts.id, index])) });
    expect(result.total).toBe(FACTS.length);
  });
});

describe('isPersonalized', () => {
  test('false for no answers or only "not sure"; true for an experience, a goal or a real interest', () => {
    expect(isPersonalized(null)).toBe(false);
    expect(isPersonalized(profileOf({}))).toBe(false);
    expect(isPersonalized(profileOf(PROFILES['someone exploring']))).toBe(false);
    expect(isPersonalized(profileOf({ experience: 'beginner' }))).toBe(true);
    expect(isPersonalized(profileOf({ goals: ['mobile'] }))).toBe(true);
    expect(isPersonalized(profileOf({ interests: ['react'] }))).toBe(true);
  });
});

describe('startHere', () => {
  const none = { completed: new Set<string>(), started: new Map<string, unknown>() };
  test('the free starter comes first, then beginner courses, never more than the limit', () => {
    const list = startHere(FACTS, none, 6);
    expect(list.length).toBeGreaterThan(0);
    expect(list.length).toBeLessThanOrEqual(6);
    expect(list[0].kind).toBe('starter');
    expect(list.every((facts) => facts.level === 'beginner')).toBe(true);
  });
  test('leaves out what the learner has started or finished', () => {
    const list = startHere(FACTS, { completed: new Set(['starter']), started: new Map([[FACTS[1].id, {}]]) });
    expect(list.map((facts) => facts.id)).not.toContain(FACTS[1].id);
    expect(list.map((facts) => facts.id)).not.toContain('starter');
  });
});

describe('signalsKey and memoByKey', () => {
  test('the same signals give the same key; progress, answers or exploring change it', () => {
    const base = PROFILES['web developer'];
    expect(signalsKey(signalsFor(base))).toBe(signalsKey(signalsFor({ ...base })));
    expect(signalsKey(signalsFor(base))).not.toBe(signalsKey(signalsFor({ ...base, goals: ['backend'] })));
    expect(signalsKey(signalsFor(base))).not.toBe(signalsKey(signalsFor(base, finished('html-css'))));
    expect(signalsKey(signalsFor(base))).not.toBe(signalsKey(signalsFor(base, [], { exploredTechnologies: { react: 2 } })));
  });
  test('the order answers were given in does not matter', () => {
    expect(signalsKey(signalsFor({ goals: ['frontend', 'mobile'] }))).toBe(signalsKey(signalsFor({ goals: ['mobile', 'frontend'] })));
  });
  test('computes once per key', () => {
    const memo = memoByKey<number>();
    let calls = 0;
    const make = () => ++calls;
    expect([memo('a', make), memo('a', make), memo('b', make), memo('b', make)]).toEqual([1, 1, 2, 2]);
  });
});

describe('lastActivityByCourse', () => {
  test('keeps the latest completion time per course and ignores unfinished lessons', () => {
    expect(
      lastActivityByCourse([
        { course_id: 'a', completed_at: '2026-01-02T10:00:00Z' },
        { course_id: 'a', completed_at: '2026-01-05T10:00:00Z' },
        { course_id: 'b', completed_at: null },
      ]),
    ).toEqual({ a: '2026-01-05T10:00:00Z' });
  });
});

describe('reasonLine', () => {
  const strings = discoverStrings.en.reasons;
  const lookups = { courseTitle: (id: string) => (id === 'javascript' ? 'JavaScript' : undefined), interestLabel: (id: string) => id, technologyLabel: (id: string) => id, categoryLabel: (id: string) => id };
  test('says the strongest reason in words', () => {
    expect(reasonLine([{ kind: 'goal', goal: 'software-engineer' }], strings, lookups)).toBe('Because you want to become a software engineer');
    expect(reasonLine([{ kind: 'next-after', courseId: 'javascript' }], strings, lookups)).toBe('Next after JavaScript');
    expect(reasonLine([{ kind: 'prepares-for', courseId: 'javascript' }], strings, lookups)).toBe('Prepares you for JavaScript');
  });
  test('skips a reason about a course that is not in the catalog and uses the next one; nothing at all gives null', () => {
    expect(reasonLine([{ kind: 'next-after', courseId: 'gone' }, { kind: 'foundation' }], strings, lookups)).toBe(strings.foundation);
    expect(reasonLine([{ kind: 'next-after', courseId: 'gone' }], strings, lookups)).toBeNull();
    expect(reasonLine([], strings, lookups)).toBeNull();
  });
  test('real recommendations carry a reason in words for a learner with goals', () => {
    const recommended = buildDiscoverySections(signalsFor(PROFILES['web developer']), FACTS).recommended ?? [];
    expect(recommended.length).toBeGreaterThan(0);
    const said = recommended.filter((entry) => reasonLine(entry.reasons, strings, { ...lookups, courseTitle: (id) => id }) !== null);
    expect(said.length).toBe(recommended.length);
  });
});

describe('browse helpers', () => {
  test('path summaries count only published courses and the learner\'s completed ones', () => {
    const first = LEARNING_PATHS[0];
    const some = FACTS.filter((facts) => first.courseIds.includes(facts.id));
    const done = new Set(some.slice(0, 1).map((facts) => facts.id));
    const summary = pathSummaries(LEARNING_PATHS, FACTS, done).find((entry) => entry.path.id === first.id);
    expect(summary?.count).toBe(some.length);
    expect(summary?.done).toBe(done.size);
    expect(pathSummaries(LEARNING_PATHS, [], new Set())).toEqual([]);
  });
});
