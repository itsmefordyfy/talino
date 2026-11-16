import { describe, expect, test } from '@jest/globals';

import { parseContent } from './document';
import { contactLine, docBlocks, docHtml, docPlainText, SECTION_HEADINGS } from './render';
import { defaultStyle, toggleSection } from './templates';

const content = parseContent({
  name: 'Ana <Cruz>',
  headline: 'Junior developer',
  email: 'ana@example.com',
  phone: '+63 912 345 6789',
  location: 'Naga City',
  summary: 'Builds apps with AI & ships them.',
  skills: ['React', 'SQL'],
  experience: [{ id: 'e1', title: 'Developer', organization: 'Acme', location: 'Remote', start: 'Mar 2021', current: true, bullets: ['Built the app', 'Fixed 12 bugs'] }],
  education: [{ id: 'e2', title: 'BS Computer Science', organization: 'Bicol University', end: '2020' }],
  achievements: ['Hackathon finalist'],
});

describe('docBlocks', () => {
  test('follows the style order, skips empty and hidden sections', () => {
    const style = defaultStyle('graduate');
    const headings = docBlocks(content, style).map((block) => block.heading);
    expect(headings).toEqual(['Summary', 'Education', 'Skills', 'Experience', 'Achievements']);
    const hidden = docBlocks(content, toggleSection(style, 'education')).map((block) => block.section);
    expect(hidden).not.toContain('education');
  });

  test('entries carry their dates and place; skills are one comma list; achievements are bullets', () => {
    const blocks = docBlocks(content, defaultStyle('modern'));
    const experience = blocks.find((block) => block.section === 'experience');
    expect(experience?.entries[0]).toMatchObject({ title: 'Developer', subtitle: 'Acme · Remote', dates: 'Mar 2021 – Present', bullets: ['Built the app', 'Fixed 12 bugs'] });
    expect(blocks.find((block) => block.section === 'skills')?.paragraphs).toEqual(['React, SQL']);
    expect(blocks.find((block) => block.section === 'achievements')?.bullets).toEqual(['Hackathon finalist']);
  });

  test('uses the standard headings', () => {
    expect(Object.values(SECTION_HEADINGS)).toEqual(['Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications', 'Achievements']);
  });
});

describe('contactLine', () => {
  test('email, phone, location and links, only those filled in', () => {
    expect(contactLine(content)).toEqual(['ana@example.com', '+63 912 345 6789', 'Naga City']);
  });
});

describe('docHtml', () => {
  const html = docHtml(content, defaultStyle('professional'));

  test('escapes everything the learner or the model wrote', () => {
    expect(html).toContain('Ana &lt;Cruz&gt;');
    expect(html).toContain('AI &amp; ships');
    expect(html).not.toContain('<Cruz>');
  });

  test('is one column of plain text: no tables, images, scripts or links', () => {
    for (const tag of ['<table', '<img', '<script', '<a ', '<svg']) expect(html).not.toContain(tag);
  });

  test('prints at the chosen paper size, in the chosen font and accent', () => {
    const a4 = docHtml(content, { ...defaultStyle('modern'), paper: 'a4', font: 'serif', accent: 'rose' });
    expect(a4).toContain('size: A4');
    expect(a4).toContain('Georgia');
    expect(a4).toContain('#9F1239');
    expect(html).toContain('size: Letter');
  });

  test('keeps an entry together across pages and lists bullets', () => {
    expect(html).toContain('page-break-inside: avoid');
    expect(html).toContain('<li>Built the app</li>');
  });
});

describe('docPlainText', () => {
  test('is the whole résumé as text for the AI, with the same headings', () => {
    const text = docPlainText(content);
    expect(text).toContain('Ana <Cruz>');
    expect(text).toContain('EXPERIENCE');
    expect(text).toContain('- Built the app');
    expect(text.indexOf('SUMMARY')).toBeLessThan(text.indexOf('EXPERIENCE'));
  });
});
