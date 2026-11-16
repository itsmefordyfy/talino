import { describe, expect, test } from '@jest/globals';

import { checkAts, estimatePages } from './ats';
import { parseContent } from './document';
import { defaultStyle, toggleSection } from './templates';

const good = parseContent({
  name: 'Ana Cruz',
  headline: 'Developer',
  email: 'ana@example.com',
  phone: '+63 900 000 0000',
  summary: 'Developer who builds apps with React and ships them.',
  skills: ['React', 'SQL', 'Figma'],
  experience: [{ title: 'Developer', organization: 'Acme', start: 'Mar 2021', current: true, bullets: ['Built the booking app', 'Fixed bugs'] }],
  education: [{ title: 'BS CS', organization: 'BU', end: '2020' }],
});
const style = defaultStyle('modern');
const ids = (report: ReturnType<typeof checkAts>) => report.issues.map((issue) => issue.id);

describe('checkAts', () => {
  test('a complete résumé has no issues and a full score', () => {
    const report = checkAts(good, style);
    expect(report.issues).toEqual([]);
    expect(report.score).toBe(100);
  });

  test('an empty résumé fails on the basics, high severity first', () => {
    const report = checkAts(parseContent({}), style);
    expect(ids(report)).toEqual(expect.arrayContaining(['no_name', 'no_email', 'no_work', 'no_skills']));
    expect(report.issues[0].severity).toBe('high');
    expect(report.score).toBeLessThan(50);
  });

  test('entries without bullets or dates are named', () => {
    const content = parseContent({ ...good, experience: [{ title: 'Clerk', organization: 'Shop' }] });
    const report = checkAts(content, style);
    expect(report.issues.filter((issue) => issue.id === 'entry_no_bullets')).toMatchObject([{ detail: 'Clerk' }]);
    expect(ids(report)).toContain('entry_no_dates');
  });

  test('a section the learner hid counts as missing, because it is not on the page', () => {
    expect(ids(checkAts(good, toggleSection(style, 'skills')))).toContain('no_skills');
  });

  test('long summaries and very long bullets are flagged', () => {
    const content = parseContent({ ...good, summary: 'word '.repeat(150), experience: [{ title: 'Dev', start: '2020', bullets: ['x'.repeat(300)] }] });
    expect(ids(checkAts(content, style))).toEqual(expect.arrayContaining(['summary_long', 'bullet_long']));
  });

  test('keywords from a job post: found, missing, and an issue only when most are missing', () => {
    const some = checkAts(good, style, ['React', 'Kubernetes', 'SQL']);
    expect(some.keywords).toEqual({ found: ['React', 'SQL'], missing: ['Kubernetes'] });
    expect(ids(some)).not.toContain('keywords_missing');
    const few = checkAts(good, style, ['Go', 'Rust', 'Kafka', 'React']);
    expect(ids(few)).toContain('keywords_missing');
    expect(checkAts(good, style).keywords).toBeNull();
  });
});

describe('estimatePages', () => {
  test('a short résumé is one page, a very long one runs over', () => {
    expect(estimatePages(good, style)).toBe(1);
    const long = parseContent({ ...good, experience: Array.from({ length: 20 }, (_, n) => ({ title: `Job ${n}`, organization: 'Org', start: '2010', end: '2012', bullets: ['A fairly long bullet that describes the work done in some detail for the team and the customers', 'Another similarly long bullet that takes more than one line when printed on a page', 'A third'] })) });
    expect(estimatePages(long, style)).toBeGreaterThan(2);
    expect(ids(checkAts(long, style))).toContain('too_long');
  });
});
