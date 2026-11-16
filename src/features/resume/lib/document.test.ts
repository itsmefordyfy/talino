import { describe, expect, test } from '@jest/globals';

import { contentIsEmpty, DOC_SECTIONS, emptyContent, formatRange, parseContent, textLines } from './document';

describe('parseContent', () => {
  test('anything that is not an object becomes an empty résumé', () => {
    for (const value of [null, undefined, 'x', 4, [], '{"a":1}']) expect(parseContent(value)).toEqual(emptyContent());
  });

  test('keeps good fields, trims, and drops what has the wrong type', () => {
    const content = parseContent({
      name: '  Ana   Cruz ',
      email: 7,
      summary: 'Builds apps.',
      skills: ['React', ' react ', '', 5, 'SQL'],
      experience: [{ id: 'a', title: 'Developer', organization: 'Acme', start: 'Mar 2021', current: true, bullets: ['Built X', '', 3] }, 'nope', { organization: 'No title' }],
    });
    expect(content.name).toBe('Ana Cruz');
    expect(content.email).toBe('');
    expect(content.skills).toEqual(['React', 'SQL']);
    expect(content.experience).toHaveLength(1);
    expect(content.experience[0]).toMatchObject({ id: 'a', title: 'Developer', organization: 'Acme', current: true, bullets: ['Built X'] });
  });

  test('gives entries without an id a unique one and keeps ids that exist', () => {
    const content = parseContent({ projects: [{ title: 'One' }, { title: 'Two' }, { id: 'keep', title: 'Three' }] });
    const ids = content.projects.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids[2]).toBe('keep');
  });

  test('caps lengths and counts so one bad value cannot flood a résumé', () => {
    const content = parseContent({ summary: 'x'.repeat(5000), skills: Array.from({ length: 200 }, (_, n) => `skill ${n}`), experience: [{ title: 'T', bullets: Array.from({ length: 40 }, (_, n) => `b${n}`) }] });
    expect(content.summary.length).toBeLessThanOrEqual(1200);
    expect(content.skills.length).toBeLessThanOrEqual(60);
    expect(content.experience[0].bullets.length).toBeLessThanOrEqual(12);
  });

  test('is stable: parsing a parsed résumé changes nothing', () => {
    const once = parseContent({ name: 'A', experience: [{ title: 'T', bullets: ['b'] }], achievements: ['Won a hackathon'] });
    expect(parseContent(once)).toEqual(once);
  });
});

describe('formatRange', () => {
  test('range, present, single date and nothing', () => {
    expect(formatRange({ start: 'Mar 2021', end: 'Jun 2023', current: false })).toBe('Mar 2021 – Jun 2023');
    expect(formatRange({ start: 'Mar 2021', end: '', current: true })).toBe('Mar 2021 – Present');
    expect(formatRange({ start: '', end: '2024', current: false })).toBe('2024');
    expect(formatRange({ start: '2020', end: '2020', current: false })).toBe('2020');
    expect(formatRange({ start: '', end: '', current: false })).toBeNull();
  });

  test('shows ISO dates from the master profile as month and year', () => {
    expect(formatRange({ start: '2021-03-01', end: '2023-06-15', current: false })).toBe('Mar 2021 – Jun 2023');
  });
});

describe('helpers', () => {
  test('textLines splits a description into trimmed non-empty lines and strips list markers', () => {
    expect(textLines('- Built X\n• Fixed Y\n\n  Shipped Z  ')).toEqual(['Built X', 'Fixed Y', 'Shipped Z']);
    expect(textLines(null)).toEqual([]);
  });

  test('contentIsEmpty ignores whitespace, sections are the seven standard ones', () => {
    expect(contentIsEmpty(emptyContent())).toBe(true);
    expect(contentIsEmpty(parseContent({ summary: 'Hi' }))).toBe(false);
    expect(DOC_SECTIONS).toHaveLength(7);
  });
});
