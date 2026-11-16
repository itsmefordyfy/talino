import { escapeHtml } from '@/lib/html';

import type { ResumeData, ResumeEntry } from './build-resume';

/**
 * The standard headings, in the order applicant tracking systems expect. Plain English words on
 * purpose: ATS software matches these exact headings.
 */
export const RESUME_SECTIONS = ['Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications'] as const;
export type ResumeSection = (typeof RESUME_SECTIONS)[number];

export type ResumeBlock = { heading: ResumeSection; lines: string[]; bullets: string[]; entries: ResumeEntry[] };

/** The résumé's non-empty sections in order: one source for the preview, the PDF and the plain text. */
export function resumeBlocks(data: ResumeData): ResumeBlock[] {
  const blocks: ResumeBlock[] = [
    { heading: 'Summary', lines: [data.summary].filter((line) => line.trim() !== ''), bullets: data.highlights, entries: [] },
    { heading: 'Skills', lines: data.skills.length ? [data.skills.join(', ')] : [], bullets: [], entries: [] },
    { heading: 'Experience', lines: [], bullets: [], entries: data.experience },
    { heading: 'Projects', lines: [], bullets: [], entries: data.projects },
    { heading: 'Education', lines: [], bullets: [], entries: data.education },
    { heading: 'Certifications', lines: data.badges.length ? [`Talino badges: ${data.badges.join(', ')}`] : [], bullets: [], entries: data.certifications },
  ];
  return blocks.filter((block) => block.lines.length > 0 || block.bullets.length > 0 || block.entries.length > 0);
}

/** "Title, Organization" then the dates, as one heading line. */
export function entryHeading(entry: ResumeEntry): string {
  return [entry.title, entry.organization].filter(Boolean).join(', ');
}

function entryHtml(entry: ResumeEntry): string {
  const dates = entry.dates ? `<span class="dates">${escapeHtml(entry.dates)}</span>` : '';
  const description = entry.description ? `<p>${escapeHtml(entry.description)}</p>` : '';
  // Links are printed as text: ATS software reads the words on the page, not the link targets.
  const link = entry.link ? `<p class="link">${escapeHtml(entry.link)}</p>` : '';
  return `<div class="entry"><p class="entry-title"><strong>${escapeHtml(entryHeading(entry))}</strong>${dates ? ` · ${dates}` : ''}</p>${description}${link}</div>`;
}

/**
 * The résumé as a printable page that ATS software can read: one column, standard headings, system
 * fonts, plain paragraphs and lists. No tables, columns, images or icons, which parsers misread.
 */
export function resumeHtml(data: ResumeData): string {
  const sections = resumeBlocks(data)
    .map((block) =>
      [
        `<h2>${escapeHtml(block.heading)}</h2>`,
        ...block.lines.map((line) => `<p>${escapeHtml(line)}</p>`),
        block.bullets.length ? `<ul>${block.bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '',
        ...block.entries.map(entryHtml),
      ].join(''),
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(data.name)} - Résumé</title>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10.5pt; line-height: 1.4; color: #111; margin: 0; }
  h1 { font-size: 20pt; margin: 0; }
  .role { font-size: 12pt; margin: 2pt 0 4pt; }
  .contact { font-size: 9.5pt; color: #333; margin: 0 0 6pt; }
  h2 { font-size: 11.5pt; text-transform: uppercase; letter-spacing: 0.5pt; border-bottom: 1px solid #999; padding-bottom: 2pt; margin: 12pt 0 4pt; }
  p { margin: 2pt 0; }
  ul { margin: 2pt 0 0 14pt; padding: 0; }
  li { margin: 1pt 0; }
  .entry { margin: 0 0 6pt; page-break-inside: avoid; }
  .dates { color: #333; }
  .link { font-size: 9.5pt; color: #333; }
</style>
</head>
<body>
<h1>${escapeHtml(data.name)}</h1>
<p class="role">${escapeHtml(data.jobTitle)}</p>
${data.contact.length ? `<p class="contact">${data.contact.map(escapeHtml).join(' | ')}</p>` : ''}
${sections}
</body>
</html>`;
}

/** The same résumé as plain text, for the coach to tailor. */
export function resumePlainText(data: ResumeData): string {
  const head = [data.name, data.jobTitle, data.contact.join(' | ')].filter(Boolean);
  const body = resumeBlocks(data).map((block) => {
    const entries = block.entries.map((entry) => [`- ${entryHeading(entry)}${entry.dates ? ` (${entry.dates})` : ''}`, entry.description ? `  ${entry.description}` : null, entry.link ? `  ${entry.link}` : null].filter(Boolean).join('\n'));
    return [block.heading.toUpperCase(), ...block.lines, ...block.bullets.map((line) => `- ${line}`), ...entries].join('\n');
  });
  return [...head, '', ...body.flatMap((section) => [section, ''])].join('\n').trim();
}
