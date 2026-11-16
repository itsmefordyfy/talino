import { describe, expect, test } from '@jest/globals';

import type { Achievements } from '@/features/resume';

import { buildPortfolio, hasPortfolioContent, httpsUrl, profileLink, type PortfolioInput } from './build-portfolio';
import type { PortfolioProject } from './projects';

const achievements: Achievements = {
  projects: [
    { title: 'AI app', course: 'AI Developer', summary: 'Calls a model.', link: 'https://app.example.com' },
    { title: 'Proposal', course: 'Freelancer & VA', summary: 'A client proposal.', link: null },
  ],
  certificates: [
    { title: 'AI Basics for Tech', issued: '2026-11-02', url: 'https://talino.example/c/abc' },
    { title: 'AI Developer', issued: '2026-11-10', url: null },
  ],
  skills: ['Prompting', 'APIs'],
  badges: [{ id: 'first-project', title: 'First project shipped' }],
  currentCourse: null,
};

function input(overrides: Partial<PortfolioInput> = {}): PortfolioInput {
  return {
    name: '  Ana   Cruz ',
    profile: { headline: 'Junior developer', email: 'ana@example.com', phone: '0917', location: 'Manila', website: 'ana.dev', linkedin: 'ana-cruz', github: '@anacruz', summary: 'I build apps.', career_goal: null, level: null },
    achievements,
    ownSkills: ['prompting', 'SQL'],
    formatIssued: (iso) => `issued ${iso}`,
    ...overrides,
  };
}

const own = (overrides: Partial<PortfolioProject> = {}): PortfolioProject => ({
  id: 'p1',
  title: 'Queue app',
  summary: 'Take a number.',
  description: 'Residents take a number.\n\n\n\nBuilt alone.',
  role: 'Solo developer',
  tech: ['Expo', 'Supabase'],
  url: 'https://queue.example.com/',
  repoUrl: 'https://github.com/ana/queue',
  images: ['/9j/aaa'],
  sort: 0,
  created_at: '2026-11-01T00:00:00.000Z',
  updated_at: '2026-11-01T00:00:00.000Z',
  ...overrides,
});

describe('the profile picture', () => {
  test('is on the page only when the learner chose to show it', () => {
    expect(buildPortfolio(input()).photo).toBe('');
    expect(buildPortfolio(input({ photo: null })).photo).toBe('');
    expect(buildPortfolio(input({ photo: '/9j/abc' })).photo).toBe('/9j/abc');
  });
});

describe('the learner’s own projects', () => {
  test('come first, with their details and pictures, ahead of the passed course projects', () => {
    const portfolio = buildPortfolio(input({ customProjects: [own()] }));
    expect(portfolio.projects.map((project) => project.title)).toEqual(['Queue app', 'AI app', 'Proposal']);
    expect(portfolio.projects[0]).toMatchObject({ course: '', role: 'Solo developer', tech: ['Expo', 'Supabase'], repoUrl: 'https://github.com/ana/queue', images: ['/9j/aaa'] });
    // Paragraphs survive, long runs of blank lines collapse.
    expect(portfolio.projects[0].description).toBe('Residents take a number.\n\nBuilt alone.');
  });

  test('a project with a name and nothing else is left off the page', () => {
    const empty = own({ id: 'p2', title: 'Idea', summary: '', description: '', images: [], url: null, repoUrl: null });
    expect(buildPortfolio(input({ customProjects: [empty] })).projects.map((project) => project.title)).toEqual(['AI app', 'Proposal']);
  });

  test('at most 20 projects in all', () => {
    const many = Array.from({ length: 12 }, (_, index) => own({ id: `p${index}`, title: `Mine ${index}` }));
    expect(buildPortfolio(input({ customProjects: many })).projects.length).toBeLessThanOrEqual(20);
  });
});

describe('buildPortfolio', () => {
  test('only what the page shows: no email or phone', () => {
    const portfolio = buildPortfolio(input());
    expect(JSON.stringify(portfolio)).not.toContain('ana@example.com');
    expect(JSON.stringify(portfolio)).not.toContain('0917');
    expect(portfolio).toMatchObject({ name: 'Ana Cruz', headline: 'Junior developer', about: 'I build apps.', location: 'Manila' });
  });

  test('links from the profile, as https addresses', () => {
    expect(buildPortfolio(input()).links).toEqual([
      { label: 'Website', url: 'https://ana.dev/' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ana-cruz' },
      { label: 'GitHub', url: 'https://github.com/anacruz' },
    ]);
  });

  test('every passed project; every certificate, linked only when it has a page', () => {
    const portfolio = buildPortfolio(input());
    expect(portfolio.projects).toEqual([
      { title: 'AI app', course: 'AI Developer', summary: 'Calls a model.', description: '', role: '', tech: [], url: 'https://app.example.com/', repoUrl: '', images: [] },
      { title: 'Proposal', course: 'Freelancer & VA', summary: 'A client proposal.', description: '', role: '', tech: [], url: '', repoUrl: '', images: [] },
    ]);
    expect(portfolio.certificates).toEqual([
      { title: 'AI Basics for Tech', url: 'https://talino.example/c/abc', issued: 'issued 2026-11-02' },
      { title: 'AI Developer', url: '', issued: 'issued 2026-11-10' },
    ]);
  });

  test('skills once each, the learner’s own first; badges by title', () => {
    const portfolio = buildPortfolio(input());
    expect(portfolio.skills).toEqual(['prompting', 'SQL', 'APIs']);
    expect(portfolio.badges).toEqual(['First project shipped']);
  });

  test('a name alone is not worth publishing', () => {
    const empty = buildPortfolio(input({ profile: null, achievements: { ...achievements, projects: [], certificates: [] } }));
    expect(hasPortfolioContent(empty)).toBe(false);
    expect(hasPortfolioContent(buildPortfolio(input()))).toBe(true);
  });
});

describe('profileLink', () => {
  test('typed forms become https links', () => {
    expect(profileLink('http://ana.dev/work', 'website')).toBe('https://ana.dev/work');
    expect(profileLink('linkedin.com/in/ana', 'linkedin')).toBe('https://linkedin.com/in/ana');
    expect(profileLink('https://github.com/ana', 'github')).toBe('https://github.com/ana');
  });

  test('what can’t be a link is left out', () => {
    expect(profileLink('', 'website')).toBeNull();
    expect(profileLink('my site', 'website')).toBeNull();
    expect(profileLink('ftp://ana.dev', 'website')).toBeNull();
    expect(httpsUrl('http://ana.dev')).toBeNull();
  });
});
