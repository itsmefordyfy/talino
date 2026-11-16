import { describe, expect, test } from '@jest/globals';

import { catalogFacts } from '../catalog-facts';
import { starterSuggestions, searchSuggestions } from './suggest';

const facts = catalogFacts();
const labels = (text: string) => searchSuggestions(facts, text).map((suggestion) => `${suggestion.kind}:${suggestion.label}`);

describe('search suggestions', () => {
  test('nothing typed, nothing suggested; a word nothing contains, nothing either', () => {
    expect(searchSuggestions(facts, '')).toEqual([]);
    expect(searchSuggestions(facts, '   ')).toEqual([]);
    expect(searchSuggestions(facts, 'qwertyzx')).toEqual([]);
  });

  test('a partial tool name suggests the AI tools first', () => {
    const found = labels('cla');
    expect(found.slice(0, 2)).toEqual(expect.arrayContaining(['tool:Claude', 'tool:Claude Code']));
  });

  test('another name for a tool finds it ("lovable" is an app builder)', () => {
    expect(labels('lovable')).toContain('tool:Vibe coding app builders');
  });

  test('categories, levels and course titles are suggested from the real catalog', () => {
    expect(labels('vibe')).toContain('category:Vibe Coding and App Building');
    expect(labels('exp')).toContain('level:Expert');
    expect(labels('website').some((label) => label.startsWith('course:'))).toBe(true);
  });

  test('each suggestion says how many courses it leads to, and none leads to nothing', () => {
    for (const text of ['cla', 'vibe', 'begin', 'deploy', 'mobile']) {
      for (const suggestion of searchSuggestions(facts, text)) {
        if (suggestion.kind !== 'course') expect(suggestion.count).toBeGreaterThan(0);
      }
    }
  });

  test('at most six, at most three of them courses, no duplicates', () => {
    for (const text of ['a', 'ai', 'build', 'app']) {
      const list = searchSuggestions(facts, text);
      expect(list.length).toBeLessThanOrEqual(6);
      expect(list.filter((suggestion) => suggestion.kind === 'course').length).toBeLessThanOrEqual(3);
      expect(new Set(list.map((suggestion) => `${suggestion.kind}:${suggestion.id}`)).size).toBe(list.length);
    }
  });

  test('starter suggestions are the most-taught AI tools and the Beginner level, all real', () => {
    const starters = starterSuggestions(facts);
    expect(starters.length).toBeGreaterThanOrEqual(4);
    expect(starters.some((suggestion) => suggestion.kind === 'level' && suggestion.id === 'beginner')).toBe(true);
    expect(starters.every((suggestion) => suggestion.kind === 'course' || suggestion.count > 0)).toBe(true);
  });
});
