import { describe, expect, test } from '@jest/globals';

import { DOC_SECTIONS } from './document';
import { defaultStyle, moveSection, parseStyle, recommendTemplate, RESUME_LEVELS, switchTemplate, TEMPLATE_IDS, TEMPLATES, toggleSection } from './templates';

describe('templates', () => {
  test('every template orders all seven sections exactly once and covers its audience', () => {
    for (const id of TEMPLATE_IDS) expect([...TEMPLATES[id].order].sort()).toEqual([...DOC_SECTIONS].sort());
  });

  test('every situation has a template made for it', () => {
    for (const level of RESUME_LEVELS) expect(TEMPLATES[recommendTemplate(level)].audience).toContain(level);
    expect(recommendTemplate(null)).toBe('modern');
  });

  test('students and graduates lead with education, developers with skills and projects', () => {
    expect(TEMPLATES.graduate.order.slice(0, 3)).toEqual(['summary', 'education', 'projects']);
    expect(TEMPLATES.developer.order.slice(0, 3)).toEqual(['summary', 'skills', 'projects']);
  });
});

describe('parseStyle', () => {
  test('anything unreadable becomes the modern default', () => {
    expect(parseStyle(null)).toEqual(defaultStyle('modern'));
    expect(parseStyle('x')).toEqual(defaultStyle('modern'));
  });

  test('unknown values fall back to the template, known ones are kept', () => {
    const style = parseStyle({ template: 'graduate', accent: 'neon', font: 'serif', density: 'compact', paper: 'a4' });
    expect(style).toMatchObject({ template: 'graduate', accent: 'teal', font: 'serif', density: 'compact', paper: 'a4' });
  });

  test('the order is repaired: duplicates and unknown names go, missing sections are added at the end', () => {
    const style = parseStyle({ template: 'modern', order: ['education', 'education', 'nonsense', 'summary'], hidden: ['skills', 'skills', 'x'] });
    expect(style.order.slice(0, 2)).toEqual(['education', 'summary']);
    expect([...style.order].sort()).toEqual([...DOC_SECTIONS].sort());
    expect(style.hidden).toEqual(['skills']);
  });
});

describe('editing a style', () => {
  test('moving a section swaps it with its neighbour and stops at the ends', () => {
    const style = defaultStyle('modern');
    const first = style.order[0];
    expect(moveSection(style, first, -1)).toBe(style);
    const moved = moveSection(style, first, 1);
    expect(moved.order[1]).toBe(first);
    expect(style.order[0]).toBe(first);
    const last = style.order[style.order.length - 1];
    expect(moveSection(style, last, 1)).toBe(style);
  });

  test('hiding toggles', () => {
    const hidden = toggleSection(defaultStyle(), 'achievements');
    expect(hidden.hidden).toEqual(['achievements']);
    expect(toggleSection(hidden, 'achievements').hidden).toEqual([]);
  });

  test('switching template restyles but keeps paper, density and hidden sections', () => {
    const style = { ...defaultStyle('modern'), paper: 'a4' as const, density: 'compact' as const, hidden: ['projects' as const], accent: 'rose' as const };
    const next = switchTemplate(style, 'graduate');
    expect(next).toMatchObject({ template: 'graduate', accent: 'teal', paper: 'a4', density: 'compact', hidden: ['projects'] });
    expect(next.order).toEqual([...TEMPLATES.graduate.order]);
  });
});
