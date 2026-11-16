import { describe, expect, test } from '@jest/globals';

import { contentFromMaster, mergeImported, parseLooseDate, versionToContent } from './master';
import { parseContent } from './document';
import type { Achievements, ResumeItem, ResumeProfile } from '../types';

const profile: ResumeProfile = { headline: 'Junior developer', email: 'ana@example.com', phone: null, location: 'Naga City', website: null, linkedin: null, github: null, summary: 'Builds apps.', career_goal: null, level: 'graduate' };
const item = (extra: Partial<ResumeItem> & Pick<ResumeItem, 'id' | 'kind' | 'title'>): ResumeItem => ({ organization: null, start_on: null, end_on: null, description: null, sort: 0, location: null, link: null, dates_text: null, ...extra });
const achievements: Achievements = {
  projects: [{ title: 'Habit tracker', course: 'Build an app', summary: 'A working habit tracker.', link: 'https://example.com/h' }],
  certificates: [{ title: 'Builder certificate', issued: '2026-10-02', url: 'https://example.com/c' }],
  skills: ['Prompting', 'react'],
  badges: [{ id: 'first-lesson', title: 'First lesson' }, { id: 'builder', title: 'Builder' }],
  currentCourse: null,
};

describe('contentFromMaster', () => {
  const items = [
    item({ id: 'old', kind: 'experience', title: 'Cashier', organization: 'Shop', start_on: '2018-01-01', end_on: '2019-06-01', description: '- Served customers\n- Counted cash' }),
    item({ id: 'now', kind: 'experience', title: 'Developer', organization: 'Acme', location: 'Remote', start_on: '2021-03-01', description: 'Built the app' }),
    item({ id: 'edu', kind: 'education', title: 'BS Computer Science', organization: 'Bicol University', start_on: '2016-06-01', end_on: '2020-04-01' }),
    item({ id: 'cert', kind: 'certification', title: 'AWS Cloud Practitioner', organization: 'AWS', end_on: '2024-02-10' }),
    item({ id: 'sk', kind: 'skill', title: 'React' }),
    item({ id: 'win', kind: 'achievement', title: 'Hackathon finalist', description: 'Top 10 of 120 teams' }),
    item({ id: 'text', kind: 'project', title: 'Old project', dates_text: '2019 – 2020' }),
  ];
  const content = contentFromMaster({ name: 'Ana Cruz', profile, items, achievements });

  test('carries the profile and the learner\'s name', () => {
    expect(content).toMatchObject({ name: 'Ana Cruz', headline: 'Junior developer', email: 'ana@example.com', location: 'Naga City', summary: 'Builds apps.' });
  });

  test('keeps entry ids, newest first, and an unfinished role is current', () => {
    expect(content.experience.map((entry) => entry.id)).toEqual(['now', 'old']);
    expect(content.experience[0]).toMatchObject({ current: true, location: 'Remote', start: '2021-03-01', bullets: ['Built the app'] });
    expect(content.experience[1].bullets).toEqual(['Served customers', 'Counted cash']);
  });

  test('Talino projects and certificates come first; the learner\'s own follow', () => {
    expect(content.projects[0]).toMatchObject({ title: 'Habit tracker', organization: 'Talino · Build an app', link: 'https://example.com/h', bullets: ['A working habit tracker.'] });
    expect(content.certifications.map((entry) => entry.title)).toEqual(['Builder certificate', 'AWS Cloud Practitioner']);
    expect(content.certifications[1]).toMatchObject({ organization: 'AWS', end: '2024-02-10' });
  });

  test('dates written on an import stand in for missing precise dates', () => {
    expect(content.projects.find((entry) => entry.title === 'Old project')).toMatchObject({ start: '2019 – 2020', end: '', current: false });
  });

  test('skills are the learner\'s plus what Talino saw, without repeats; badges worth showing become one achievement line', () => {
    expect(content.skills).toEqual(['React', 'Prompting']);
    expect(content.achievements).toEqual(['Hackathon finalist – Top 10 of 120 teams', 'Talino badges: Builder']);
  });

  test('works with nothing at all', () => {
    expect(contentFromMaster({ name: '', profile: null, items: [], achievements: null })).toEqual(parseContent({}));
  });
});

describe('parseLooseDate', () => {
  test('month and year become a first-of-month date; anything vaguer is not guessed', () => {
    expect(parseLooseDate('Mar 2021')).toBe('2021-03-01');
    expect(parseLooseDate('March 2021')).toBe('2021-03-01');
    expect(parseLooseDate('03/2021')).toBe('2021-03-01');
    expect(parseLooseDate('2021-03')).toBe('2021-03-01');
    expect(parseLooseDate('2021-03-15')).toBe('2021-03-15');
    expect(parseLooseDate('2021')).toBeNull();
    expect(parseLooseDate('Spring 2021')).toBeNull();
    expect(parseLooseDate('')).toBeNull();
  });
});

describe('mergeImported', () => {
  const existing = { profile, items: [item({ id: 'a', kind: 'skill', title: 'React' }), item({ id: 'b', kind: 'experience', title: 'Developer', organization: 'Acme' })] };
  const imported = parseContent({
    name: 'Ana Cruz',
    headline: 'Something else',
    phone: '+63 900 000 0000',
    summary: 'Imported summary',
    skills: ['react', 'Python'],
    experience: [
      { title: 'developer', organization: 'ACME', start: 'Mar 2021', current: true },
      { title: 'Intern', organization: 'Globe', start: 'Jun 2019', end: 'Aug 2019', bullets: ['Wrote tests', 'Fixed bugs'] },
      { title: 'Helper', organization: 'Shop', start: '2017', end: '2018' },
    ],
    education: [{ title: 'BS IT', organization: 'BU', end: '2020' }],
    certifications: [{ title: 'TESDA NC II', organization: 'TESDA', end: 'Mar 2022' }],
    projects: [{ title: 'Site', link: 'https://x.test', bullets: ['Made a site'] }],
    achievements: ['Dean\'s lister'],
  });
  let n = 0;
  const merged = mergeImported(existing, imported, () => `new-${(n += 1)}`);

  test('fills only the blanks of the profile; what the learner has is never replaced', () => {
    expect(merged.profile).toEqual({ phone: '+63 900 000 0000' });
  });

  test('adds what is new and skips what is already there, ignoring case', () => {
    const titles = merged.items.map((entry) => `${entry.kind}:${entry.title}`);
    expect(titles).toEqual(expect.arrayContaining(['skill:Python', 'experience:Intern', 'experience:Helper', 'education:BS IT', 'certification:TESDA NC II', 'project:Site', "achievement:Dean's lister"]));
    expect(titles).not.toContain('skill:react');
    expect(titles).not.toContain('experience:developer');
  });

  test('month-precise dates become real dates, vaguer ones are kept as written', () => {
    const intern = merged.items.find((entry) => entry.title === 'Intern');
    expect(intern).toMatchObject({ startOn: '2019-06-01', endOn: '2019-08-01', datesText: null, description: 'Wrote tests\nFixed bugs' });
    const helper = merged.items.find((entry) => entry.title === 'Helper');
    expect(helper).toMatchObject({ startOn: null, endOn: null, datesText: '2017 – 2018' });
    expect(merged.items.find((entry) => entry.title === 'TESDA NC II')).toMatchObject({ endOn: '2022-03-01' });
  });

  test('every new item has its own id and a counted summary', () => {
    expect(new Set(merged.items.map((entry) => entry.id)).size).toBe(merged.items.length);
    expect(merged.counts).toMatchObject({ experience: 2, education: 1, projects: 1, certifications: 1, skills: 1, achievements: 1 });
  });
});

describe('versionToContent (the old three-version résumé becoming a document)', () => {
  test('keeps the tailored title, summary and highlights, and adds its keywords to the skills', () => {
    const base = contentFromMaster({ name: 'Ana', profile, items: [item({ id: 'sk', kind: 'skill', title: 'React' })], achievements: null });
    const content = versionToContent(base, { goal: 'developer', jobTitle: 'Frontend Developer', summary: 'Tailored summary.', highlights: ['Built X', 'Shipped Y'], keywords: ['react', 'TypeScript'] });
    expect(content.headline).toBe('Frontend Developer');
    expect(content.summary).toBe('Tailored summary.');
    expect(content.achievements).toEqual(['Built X', 'Shipped Y']);
    expect(content.skills).toEqual(['React', 'TypeScript']);
  });
});
