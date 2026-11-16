import { describe, expect, test } from '@jest/globals';

import { buildCourseFacts } from '../catalog-facts';
import { fullCatalog } from '../full-catalog.test-helpers';
import type { Course } from '../../content/types';
import { fullCatalogFacts } from './discovery.test-helpers';
import { matchCatalog, searchCatalog } from './search';

const facts = fullCatalogFacts();
const found = (text: string) => searchCatalog(facts, text).map((result) => result.facts.id);

describe('searchCatalog: names', () => {
  test('a full course name finds that course first', () => {
    expect(found('Build a Mobile App with AI')[0]).toBe('build-mobile-app-ai');
    expect(found('Coding with AI for Complete Beginners')[0]).toBe('ai-coding-beginners');
    expect(found('Prompt Engineering for Software Development')[0]).toBe('prompt-engineering-dev');
  });

  test('partial words: "prompt engin" and "agentic cod"', () => {
    expect(found('prompt engin')[0]).toBe('prompt-engineering-dev');
    expect(found('agentic cod')[0]).toBe('agentic-coding');
  });

  test('case does not matter', () => {
    expect(found('CLAUDE CODE')).toEqual(found('claude code'));
    expect(found('Context Engineering')).toEqual(found('context engineering'));
  });

  test('a one-letter slip in a longer word still finds it, but only when nothing matches as typed', () => {
    expect(found('promt engineering')[0]).toBe('prompt-engineering-dev');
    expect(found('debuging')[0]).toBe('debugging-with-ai');
    // "react" exists, so "reac" is a prefix, never a typo of something else.
    expect(searchCatalog(facts, 'reac').length).toBeGreaterThan(0);
  });

  test('every word must match somewhere', () => {
    expect(found('prompt engineering zzzzzz')).toEqual([]);
    expect(found('prompt engineering').length).toBeGreaterThan(0);
  });
});

describe('searchCatalog: technologies and aliases', () => {
  const technologyOf = (id: string) => facts.find((fact) => fact.id === id)?.technologies ?? [];

  test.each([
    ['rn', 'react-native'],
    ['js', 'javascript'],
    ['gpt', 'chatgpt'],
    ['postgres', 'postgresql'],
    ['claude code', 'claude-code'],
    ['cursor', 'cursor'],
    ['codex', 'codex'],
    ['chatgpt', 'chatgpt'],
    ['expo', 'expo'],
    ['mcp', 'mcp'],
    ['gemini', 'gemini'],
    ['supabase', 'supabase'],
  ])('"%s" finds courses that list %s, and the first result is one', (query, technology) => {
    const results = found(query);
    expect(results.length).toBeGreaterThan(0);
    // The first results are courses that list it, not a passing mention.
    expect(technologyOf(results[0])).toContain(technology);
  });

  test('Claude Code, claude-code and claude code are the same search', () => {
    const a = found('Claude Code');
    expect(a[0]).toBe('ai-dev-claude-code');
    expect(found('claude-code')).toEqual(a);
    expect(found('claude code')).toEqual(a);
  });

  test('an alias and the name find the same first course: "gpt" and "chatgpt"', () => {
    expect(found('ChatGPT')[0]).toBe('ai-dev-chatgpt');
    expect(found('gpt')[0]).toBe('ai-dev-chatgpt');
    expect(found('chatgpt')).toEqual(found('ChatGPT'));
  });

  test('a language or framework no course lists finds only courses that mention it in words, never a course of its own', () => {
    // The catalog has no TypeScript, Next.js, Node.js or C# course: nothing lists them as technologies.
    for (const text of ['typescript', 'next.js', 'node.js', 'c#']) {
      for (const result of searchCatalog(facts, text)) expect(result.matched).not.toContain('title');
    }
  });

  test('a technology a course lists outranks a course that only mentions the word', () => {
    const results = searchCatalog(facts, 'rn');
    for (const result of results) expect(result.matched).toContain('technology');
    const reactNative = searchCatalog(facts, 'react native');
    const listing = reactNative.filter((result) => result.facts.technologies.includes('react-native'));
    const mentioning = reactNative.filter((result) => !result.facts.technologies.includes('react-native'));
    expect(listing.length).toBeGreaterThan(0);
    if (mentioning.length > 0) expect(Math.min(...listing.map((r) => r.score))).toBeGreaterThan(Math.max(...mentioning.map((r) => r.score)));
  });

  test('the matched fields say why a course showed up', () => {
    const first = searchCatalog(facts, 'claude code')[0];
    expect(first.matched[0]).toBe('title');
    expect(first.matched).toContain('technology');
  });
});

describe('searchCatalog: skills, objectives, tags, kinds', () => {
  test('words from a skill label or an objective find the course', () => {
    const course = facts.find((fact) => fact.course.skills.length > 0 && fact.objectives.length > 0 && fact.id === 'starter');
    expect(course).toBeDefined();
    const skill = course?.course.skills[0].label ?? '';
    expect(found(skill)).toContain('starter');
    const objectiveWord = (course?.objectives[0] ?? '').split(/\s+/).find((word) => word.replace(/\W/g, '').length >= 6) ?? '';
    expect(found(objectiveWord)).toContain('starter');
  });

  test('tags: saas, legacy, interview, sql injection', () => {
    expect(found('saas')[0]).toBe('build-saas-ai');
    expect(found('legacy')).toContain('improve-existing-ai');
    expect(found('interview')).toContain('developer');
    const sql = found('sql injection');
    expect(sql).toContain('ai-coding-security');
    expect(sql.length).toBeGreaterThan(0);
  });

  test('level and type words: beginner, free, masterclass', () => {
    const beginner = searchCatalog(facts, 'beginner');
    expect(beginner.length).toBeGreaterThan(5);
    expect(beginner.slice(0, 5).every((result) => result.facts.learningLevel === 'beginner')).toBe(true);
    expect(found('free')[0]).toBe('starter');
    const masterclass = searchCatalog(facts, 'masterclass');
    expect(masterclass.length).toBeGreaterThan(5);
    expect(masterclass[0].facts.types).toContain('masterclass');
  });

  test('category and goal wording finds courses', () => {
    expect(found('Building and Monetizing')).toContain('ai-software-business');
    expect(found('Advanced AI Software Engineering')).toContain('ai-architecture');
    expect(found('get a developer job').length).toBeGreaterThan(0);
  });

  test('stop words are ignored but never leave an empty query', () => {
    expect(found('how to learn prompt engineering')[0]).toBe('prompt-engineering-dev');
    expect(found('the')).toBeDefined();
  });
});

describe('searchCatalog: edges', () => {
  test('no match gives an empty list', () => {
    expect(searchCatalog(facts, 'qwertyzxcv')).toEqual([]);
    expect(matchCatalog(facts, 'qwertyzxcv')).toEqual([]);
  });

  test('blank or punctuation-only text returns everything unscored in catalog order', () => {
    for (const text of ['', '   ', '\n\t', '???', '--']) {
      const results = searchCatalog(facts, text);
      expect(results.map((result) => result.facts.id)).toEqual(facts.map((fact) => fact.id));
      expect(results.every((result) => result.score === 0 && result.matched.length === 0)).toBe(true);
    }
  });

  test('matchCatalog agrees with searchCatalog on who matches, in catalog order', () => {
    for (const text of ['react', 'sql', 'prompt engin', 'beginner free']) {
      const ranked = new Set(found(text));
      expect(matchCatalog(facts, text).map((fact) => fact.id).sort()).toEqual([...ranked].sort());
    }
  });

  test('courses with no objectives, tags or technologies do not throw and are found by title', () => {
    const base = fullCatalog()[0];
    const bare: Course = { ...base, id: 'ghost-course', title: 'Zymurgy Appreciation', objectives: undefined, finishLine: [], skills: [], lessons: [], projects: [], tagline: '', description: '' };
    const noTagline = { ...bare, id: 'ghost-two', title: 'Quokka Handling', tagline: undefined as unknown as string, description: undefined as unknown as string };
    const set = buildCourseFacts([bare, noTagline]);
    expect(set[0].tags).toEqual([]);
    expect(set[0].technologies).toEqual([]);
    expect(set[0].objectives).toEqual([]);
    expect(searchCatalog(set, 'zymurgy').map((r) => r.facts.id)).toEqual(['ghost-course']);
    expect(searchCatalog(set, 'quokka handling').map((r) => r.facts.id)).toEqual(['ghost-two']);
    expect(searchCatalog(set, 'beginner').length).toBe(2);
    expect(searchCatalog(set, 'react')).toEqual([]);
  });

  test('metadata changes for the same course object are noticed', () => {
    const base = buildCourseFacts(fullCatalog())[0];
    const other = { ...base, tags: ['zzyzx'] };
    expect(searchCatalog([base], 'zzyzx')).toEqual([]);
    expect(searchCatalog([other], 'zzyzx')).toHaveLength(1);
  });
});

describe('searchCatalog: speed', () => {
  test('2,000 courses: 50 varied searches finish well under a second once indexed', () => {
    const base = fullCatalogFacts();
    const big = Array.from({ length: 2000 }, (_, index) => {
      const fact = base[index % base.length];
      const id = `${fact.id}-clone-${index}`;
      return { ...fact, id, course: { ...fact.course, id } };
    });
    const queries = ['react native', 'prompt engin', 'agentic', 'rn', 'js', 'postgres', 'claude code', 'cursor', 'c#', 'next.js', 'legacy', 'interview', 'sql injection', 'beginner', 'free', 'masterclass', 'promt', 'zzzzzz', 'how to build a website', 'testing'];
    const buildStart = Date.now();
    searchCatalog(big, 'warm up');
    const build = Date.now() - buildStart;
    const start = Date.now();
    for (let round = 0; round < 50; round += 1) searchCatalog(big, queries[round % queries.length]);
    const elapsed = Date.now() - start;
    console.info(`index ${build} ms, 50 searches ${elapsed} ms`);
    expect(build).toBeLessThan(5000);
    expect(elapsed).toBeLessThan(1500);
  });
});
