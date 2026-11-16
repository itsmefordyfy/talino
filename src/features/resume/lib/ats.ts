import type { DocSection, ResumeContent } from './document';
import { contactLine, docBlocks } from './render';
import type { Density, ResumeStyle } from './templates';

/**
 * The rules a hiring system (ATS) cares about that the phone can check without AI: contact details, standard sections,
 * dates, bullets, length. The templates are already one column with standard headings, so those can't fail.
 */
export type AtsIssueId =
  | 'no_name'
  | 'no_email'
  | 'no_phone'
  | 'no_work'
  | 'no_education'
  | 'no_skills'
  | 'no_summary'
  | 'summary_long'
  | 'entry_no_bullets'
  | 'entry_no_dates'
  | 'bullet_long'
  | 'too_long'
  | 'too_many_skills'
  | 'keywords_missing';

export type AtsSeverity = 'high' | 'medium' | 'low';

export type AtsIssue = { id: AtsIssueId; severity: AtsSeverity; section?: DocSection; /** The entry or figure the issue is about. */ detail?: string };

export type AtsReport = {
  /** 0 to 100: 100 minus 20 per high, 10 per medium and 4 per low issue. */
  score: number;
  issues: AtsIssue[];
  pages: number;
  /** Terms from a job post and whether the résumé has them; null without a job post. */
  keywords: { found: string[]; missing: string[] } | null;
};

const PENALTY: Record<AtsSeverity, number> = { high: 20, medium: 10, low: 4 };
const ORDER: Record<AtsSeverity, number> = { high: 0, medium: 1, low: 2 };

/** How many printed lines fit on a page by density (type size and spacing differ). */
const LINES_PER_PAGE: Record<Density, number> = { compact: 62, comfortable: 52, relaxed: 44 };
/** Characters per printed line, roughly, for the usual page width and type. */
const CHARS_PER_LINE = 92;

const wrapped = (text: string, width: number = CHARS_PER_LINE) => Math.max(1, Math.ceil(text.length / width));

/** A rough page count of the printed résumé (a line count, not a layout run). */
export function estimatePages(content: ResumeContent, style: ResumeStyle): number {
  let lines = 3 + (contactLine(content).length > 0 ? 1 : 0);
  for (const block of docBlocks(content, style)) {
    lines += 2;
    for (const paragraph of block.paragraphs) lines += wrapped(paragraph);
    for (const bullet of block.bullets) lines += wrapped(bullet, CHARS_PER_LINE - 3);
    for (const entry of block.entries) {
      lines += 1 + (entry.subtitle ? 1 : 0) + (entry.link ? 1 : 0) + 0.5;
      for (const bullet of entry.bullets) lines += wrapped(bullet, CHARS_PER_LINE - 3);
    }
  }
  return Math.max(1, Math.ceil(lines / LINES_PER_PAGE[style.density]));
}

const hasTerm = (haystack: string, term: string) => haystack.includes(term.toLowerCase());

export function checkAts(content: ResumeContent, style: ResumeStyle, keywords: readonly string[] = []): AtsReport {
  const issues: AtsIssue[] = [];
  const add = (id: AtsIssueId, severity: AtsSeverity, extra: Partial<AtsIssue> = {}) => issues.push({ id, severity, ...extra });
  const shown = docBlocks(content, style);
  const has = (section: DocSection) => shown.some((block) => block.section === section);

  if (!content.name) add('no_name', 'high');
  if (!content.email) add('no_email', 'high');
  if (!content.phone) add('no_phone', 'medium');
  if (!has('experience') && !has('projects')) add('no_work', 'high', { section: 'experience' });
  if (!has('education')) add('no_education', 'low', { section: 'education' });
  if (!has('skills')) add('no_skills', 'medium', { section: 'skills' });
  if (!has('summary')) add('no_summary', 'low', { section: 'summary' });
  else if (content.summary.length > 600) add('summary_long', 'low', { section: 'summary' });
  if (has('skills') && content.skills.length > 30) add('too_many_skills', 'low', { section: 'skills' });

  for (const section of ['experience', 'projects'] as const) {
    if (!has(section)) continue;
    for (const entry of content[section].filter((candidate) => candidate.bullets.length === 0).slice(0, 3)) add('entry_no_bullets', 'medium', { section, detail: entry.title });
  }
  if (has('experience')) {
    for (const entry of content.experience.filter((candidate) => candidate.start === '' && candidate.end === '' && !candidate.current).slice(0, 3)) add('entry_no_dates', 'medium', { section: 'experience', detail: entry.title });
  }
  const longBullet = [...content.experience, ...content.projects].flatMap((entry) => entry.bullets).find((bullet) => bullet.length > 250);
  if (longBullet) add('bullet_long', 'low', { detail: longBullet.slice(0, 40) });

  const pages = estimatePages(content, style);
  if (pages > 2) add('too_long', 'medium', { detail: String(pages) });

  let found: string[] = [];
  let missing: string[] = [];
  if (keywords.length > 0) {
    const text = [content.headline, content.summary, ...content.skills, ...[...content.experience, ...content.projects, ...content.education, ...content.certifications].flatMap((entry) => [entry.title, entry.organization, ...entry.bullets]), ...content.achievements].join(' ').toLowerCase();
    found = keywords.filter((term) => hasTerm(text, term));
    missing = keywords.filter((term) => !hasTerm(text, term));
    if (keywords.length >= 3 && missing.length > found.length) add('keywords_missing', 'medium', { detail: missing.slice(0, 5).join(', ') });
  }

  issues.sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  const score = Math.max(0, 100 - issues.reduce((sum, issue) => sum + PENALTY[issue.severity], 0));
  return { score, issues, pages, keywords: keywords.length > 0 ? { found, missing } : null };
}
