import { describe, expect, test } from '@jest/globals';

import type { ResumeData } from './build-resume';
import { RESUME_SECTIONS, resumeBlocks, resumeHtml, resumePlainText } from './resume-html';

const entry = (title: string) => ({ title, organization: 'Org', dates: 'Jan 2026', description: null, link: null });

const data: ResumeData = {
  goal: 'developer',
  name: 'Ana <script>alert(1)</script> Cruz',
  jobTitle: 'Developer & "Builder"',
  contact: ['ana@example.com', 'Manila'],
  summary: 'Builds <things>.',
  highlights: ['Shipped A & B'],
  skills: ['React', 'SQL'],
  experience: [entry('Job')],
  projects: [{ ...entry('App'), link: 'https://app.example.com/?a=1&b=2' }],
  education: [entry('Degree')],
  certifications: [entry('Cert')],
  badges: ['First AI app'],
  tailored: false,
};

describe('resumeHtml', () => {
  test('escapes everything the learner typed', () => {
    const html = resumeHtml(data);
    expect(html).not.toContain('<script>');
    expect(html).toContain('Ana &lt;script&gt;alert(1)&lt;/script&gt; Cruz');
    expect(html).toContain('Developer &amp; &quot;Builder&quot;');
    expect(html).toContain('Builds &lt;things&gt;.');
    expect(html).toContain('https://app.example.com/?a=1&amp;b=2');
  });

  test('standard headings in ATS order, no tables or images', () => {
    const html = resumeHtml(data);
    const positions = RESUME_SECTIONS.map((heading) => html.indexOf(`<h2>${heading}</h2>`));
    expect(positions.every((position) => position > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).not.toMatch(/<table|<img|<svg/i);
  });

  test('empty sections are left out', () => {
    const blocks = resumeBlocks({ ...data, experience: [], education: [], badges: [], certifications: [] });
    expect(blocks.map((block) => block.heading)).toEqual(['Summary', 'Skills', 'Projects']);
  });
});

describe('resumePlainText', () => {
  test('the same sections in the same order, as text', () => {
    const text = resumePlainText(data);
    const positions = RESUME_SECTIONS.map((heading) => text.indexOf(heading.toUpperCase()));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(text).toContain('- Shipped A & B');
    expect(text).toContain('- App, Org (Jan 2026)');
    expect(text.startsWith('Ana <script>')).toBe(true);
  });
});
