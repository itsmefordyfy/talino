import { describe, expect, test } from '@jest/globals';

import type { Achievements, ResumeItem } from '../types';
import { buildResume, defaultSummary, GOAL_DEFAULTS, monthYear, type ResumeInput } from './build-resume';

const achievements: Achievements = {
  projects: [{ title: 'AI app', course: 'AI Developer', summary: 'An app that calls a model.', link: 'https://app.example.com' }],
  certificates: [{ title: 'AI Basics for Tech', issued: '2026-11-02', url: 'https://talino.example/c/1' }],
  skills: ['Prompting', 'APIs'],
  badges: [
    { id: 'first-lesson', title: 'First lesson' },
    { id: 'first-ai-app', title: 'First AI app' },
  ],
  currentCourse: 'AI Developer',
};

const item = (overrides: Partial<ResumeItem> & Pick<ResumeItem, 'id' | 'kind' | 'title'>): ResumeItem => ({ organization: null, start_on: null, end_on: null, description: null, sort: 0, location: null, link: null, dates_text: null, ...overrides });

const items: ResumeItem[] = [
  item({ id: 'e1', kind: 'experience', title: 'Support agent', organization: 'Acme', start_on: '2022-01-10', end_on: '2023-06-01' }),
  item({ id: 'e2', kind: 'experience', title: 'Junior developer', organization: 'Beta', start_on: '2023-07-01' }),
  item({ id: 'p1', kind: 'project', title: 'Own site', description: 'Portfolio site.' }),
  item({ id: 's1', kind: 'skill', title: 'apis' }),
  item({ id: 'c1', kind: 'certification', title: 'Cloud Practitioner', organization: 'AWS', end_on: '2025-03-15' }),
  item({ id: 'ed', kind: 'education', title: 'BS Computer Science', organization: 'State University', start_on: '2018-06-01', end_on: '2022-04-01' }),
];

function input(overrides: Partial<ResumeInput> = {}): ResumeInput {
  return {
    goal: 'developer',
    name: ' Ana Cruz ',
    profile: { headline: 'Developer', email: 'ana@example.com', phone: null, location: 'Manila', website: '', linkedin: 'linkedin.com/in/ana', github: null, summary: 'I build web apps', career_goal: null, level: null },
    items,
    achievements,
    version: null,
    ...overrides,
  };
}

describe('buildResume', () => {
  test('Talino projects and certificates come first; the learner’s own follow', () => {
    const resume = buildResume(input());
    expect(resume.projects.map((entry) => entry.title)).toEqual(['AI app', 'Own site']);
    expect(resume.projects[0]).toMatchObject({ organization: 'Talino · AI Developer', link: 'https://app.example.com' });
    expect(resume.certifications.map((entry) => entry.title)).toEqual(['AI Basics for Tech', 'Cloud Practitioner']);
    expect(resume.certifications[0]).toMatchObject({ organization: 'Talino', dates: 'Nov 2026', link: 'https://talino.example/c/1' });
    expect(resume.certifications[1].dates).toBe('Mar 2025');
  });

  test('experience newest first, a current job reads Present', () => {
    const resume = buildResume(input());
    expect(resume.experience.map((entry) => [entry.title, entry.dates])).toEqual([
      ['Junior developer', 'Jul 2023 – Present'],
      ['Support agent', 'Jan 2022 – Jun 2023'],
    ]);
    expect(resume.education[0].dates).toBe('Jun 2018 – Apr 2022');
  });

  test('skills: own first, then learned, each once; contact only what is filled in', () => {
    const resume = buildResume(input());
    expect(resume.skills).toEqual(['apis', 'Prompting']);
    expect(resume.contact).toEqual(['ana@example.com', 'Manila', 'linkedin.com/in/ana']);
    expect(resume.name).toBe('Ana Cruz');
  });

  test('without a saved version: the goal’s title and a summary from the profile', () => {
    const resume = buildResume(input({ goal: 'freelance' }));
    expect(resume.jobTitle).toBe(GOAL_DEFAULTS.freelance.jobTitle);
    expect(resume.summary).toBe(`I build web apps. ${GOAL_DEFAULTS.freelance.focus}`);
    expect(resume.highlights).toEqual([]);
    expect(resume.tailored).toBe(false);
  });

  test('a saved version wins and its keywords join the skills', () => {
    const resume = buildResume(input({ goal: 'ai-engineer', version: { goal: 'ai-engineer', jobTitle: 'AI Engineer (LLM)', summary: 'Tailored summary.', highlights: ['Built X', ' '], keywords: ['RAG', 'Prompting'] } }));
    expect(resume.jobTitle).toBe('AI Engineer (LLM)');
    expect(resume.summary).toBe('Tailored summary.');
    expect(resume.highlights).toEqual(['Built X']);
    expect(resume.skills).toEqual(['apis', 'RAG', 'Prompting']);
    expect(resume.tailored).toBe(true);
  });

  test('effort badges stay off; work badges are listed', () => {
    expect(buildResume(input()).badges).toEqual(['First AI app']);
  });
});

describe('defaultSummary', () => {
  test('with no profile summary it opens from the skills', () => {
    expect(defaultSummary('developer', null, ['A', 'B', 'C'])).toBe(`${GOAL_DEFAULTS.developer.intro} Skilled in A, B and C. ${GOAL_DEFAULTS.developer.focus}`);
    expect(defaultSummary('developer', null, ['How AI works', 'AI in daily work'])).toContain('Skilled in how AI works and AI in daily work.');
    expect(defaultSummary('developer', '  ', [])).toBe(`${GOAL_DEFAULTS.developer.intro} ${GOAL_DEFAULTS.developer.focus}`);
  });
});

describe('monthYear', () => {
  test('reads a stored date or timestamp, nothing else', () => {
    expect(monthYear('2026-01-05')).toBe('Jan 2026');
    expect(monthYear('2026-12-31T10:00:00Z')).toBe('Dec 2026');
    expect(monthYear(null)).toBeNull();
    expect(monthYear('soon')).toBeNull();
  });
});
