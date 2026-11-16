import { escapeHtml } from '@/lib/html';

import { formatRange, type DocEntry, type DocSection, type ResumeContent } from './document';
import { ACCENT_HEX, FONT_STACKS, PAPER_INK, TEMPLATES, type Density, type ResumeStyle } from './templates';

/** Plain English words on purpose: hiring software matches these exact headings. */
export const SECTION_HEADINGS: Record<DocSection, string> = {
  summary: 'Summary',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  achievements: 'Achievements',
};

export type BlockEntry = {
  id: string;
  title: string;
  /** Organization and place, "Acme · Remote". */
  subtitle: string;
  dates: string | null;
  link: string;
  bullets: string[];
};

export type Block = { section: DocSection; heading: string; paragraphs: string[]; bullets: string[]; entries: BlockEntry[] };

function blockEntry(entry: DocEntry): BlockEntry {
  return { id: entry.id, title: entry.title, subtitle: [entry.organization, entry.location].filter(Boolean).join(' · '), dates: formatRange(entry), link: entry.link, bullets: entry.bullets };
}

/** Email, phone, location and links, in that order, only those filled in. */
export function contactLine(content: ResumeContent): string[] {
  return [content.email, content.phone, content.location, content.website, content.linkedin, content.github].filter((value) => value !== '');
}

/**
 * The résumé's sections in the style's order, without hidden or empty ones. The preview, the PDF, the Word file and the
 * plain text all read this one list, so what is previewed is what is exported.
 */
export function docBlocks(content: ResumeContent, style: ResumeStyle): Block[] {
  const make = (section: DocSection): Block => {
    const block: Block = { section, heading: SECTION_HEADINGS[section], paragraphs: [], bullets: [], entries: [] };
    if (section === 'summary') block.paragraphs = content.summary ? [content.summary] : [];
    else if (section === 'skills') block.paragraphs = content.skills.length > 0 ? [content.skills.join(', ')] : [];
    else if (section === 'achievements') block.bullets = content.achievements;
    else block.entries = content[section].filter((entry) => entry.title !== '').map(blockEntry);
    return block;
  };
  return style.order
    .filter((section) => !style.hidden.includes(section))
    .map(make)
    .filter((block) => block.paragraphs.length > 0 || block.bullets.length > 0 || block.entries.length > 0);
}

type Spacing = { body: number; line: number; section: number; entry: number; margin: { vertical: number; horizontal: number } };

/** Type size, line height, gaps and page margins by density, in points. */
export const SPACING: Record<Density, Spacing> = {
  compact: { body: 9.5, line: 1.3, section: 9, entry: 4, margin: { vertical: 40, horizontal: 40 } },
  comfortable: { body: 10.5, line: 1.4, section: 12, entry: 6, margin: { vertical: 51, horizontal: 45 } },
  relaxed: { body: 11, line: 1.5, section: 15, entry: 9, margin: { vertical: 57, horizontal: 51 } },
};

/** The picture to print: only when the style asks for it and the résumé holds one. */
export const photoOf = (content: ResumeContent, style: ResumeStyle): string => (style.photo === true && content.photo ? content.photo : '');

function headingCss(style: ResumeStyle): string {
  const accent = ACCENT_HEX[style.accent];
  const common = `font-size: 11.5pt; margin: ${SPACING[style.density].section}pt 0 4pt; padding-bottom: 2pt;`;
  switch (TEMPLATES[style.template].heading) {
    case 'bar':
      return `h2 { ${common} color: ${accent}; border-bottom: 2px solid ${accent}; text-transform: uppercase; letter-spacing: 0.5pt; }`;
    case 'caps':
      return `h2 { ${common} color: ${accent}; text-transform: uppercase; letter-spacing: 1.2pt; font-size: 10.5pt; border-bottom: 1px solid #bbb; }`;
    case 'plain':
      return `h2 { ${common} color: ${accent}; font-size: 12.5pt; }`;
    default:
      return `h2 { ${common} text-transform: uppercase; letter-spacing: 0.5pt; border-bottom: 1px solid #999; }`;
  }
}

function entryHtml(entry: BlockEntry): string {
  const dates = entry.dates ? `<span class="dates">${escapeHtml(entry.dates)}</span>` : '';
  const sub = entry.subtitle ? `<p class="sub">${escapeHtml(entry.subtitle)}</p>` : '';
  const bullets = entry.bullets.length > 0 ? `<ul>${entry.bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '';
  // Links are printed as text: hiring software reads the words on the page, not the link targets.
  const link = entry.link ? `<p class="link">${escapeHtml(entry.link)}</p>` : '';
  // Title on the left and the dates on the right, in reading order: the same line Word's right tab stop makes.
  return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(entry.title)}</strong>${dates}</div>${sub}${bullets}${link}</div>`;
}

/**
 * The résumé as a printable page that hiring software can read: one column, standard headings, system fonts, plain
 * paragraphs and lists. No tables, columns, images or icons, which parsers misread.
 */
export function docHtml(content: ResumeContent, style: ResumeStyle): string {
  const template = TEMPLATES[style.template];
  const space = SPACING[style.density];
  const accent = ACCENT_HEX[style.accent];
  const sections = docBlocks(content, style)
    .map((block) =>
      [
        `<h2>${escapeHtml(block.heading)}</h2>`,
        ...block.paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`),
        block.bullets.length > 0 ? `<ul>${block.bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '',
        ...block.entries.map(entryHtml),
      ].join(''),
    )
    .join('\n');
  const contact = contactLine(content);
  const align = template.centered ? 'center' : 'left';
  const photo = photoOf(content, style);
  // The picture is drawn from the text the profile holds; there is no address to fetch, so a print WebView needs nothing else.
  const photoImg = photo ? `<img class="photo" alt="" src="data:image/jpeg;base64,${photo}">` : '';
  // A rule under the name closes the header: black and slightly thinner on the classic template, the accent on the others.
  const headerRule = template.heading === 'rule' ? `1.5px solid ${PAPER_INK.ink}` : `2px solid ${accent}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(content.name || 'Résumé')} - Résumé</title>
<style>
  @page { size: ${style.paper === 'a4' ? 'A4' : 'Letter'}; margin: ${space.margin.vertical}pt ${space.margin.horizontal}pt; }
  body { font-family: ${FONT_STACKS[style.font]}; font-size: ${space.body}pt; line-height: ${space.line}; color: #111; margin: 0; }
  header { text-align: ${align}; border-bottom: ${headerRule}; padding-bottom: ${space.entry + 3}pt; }
  h1 { font-size: 23pt; line-height: 1.15; letter-spacing: -0.2pt; margin: 0; color: ${accent}; }
  header.with-photo { display: flex; align-items: center; justify-content: space-between; gap: 16pt; }
  .photo { width: 72pt; height: 72pt; border-radius: 50%; object-fit: cover; flex: none; }
  header:not(.with-photo) .photo { display: block; margin: 0 auto 8pt; }
  .role { font-size: 12.5pt; font-weight: 600; margin: 3pt 0 4pt; }
  .contact { font-size: ${space.body - 1}pt; color: #333; margin: 0; }
  ${headingCss(style)}
  p { margin: 2pt 0; }
  ul { margin: 2pt 0 0 14pt; padding: 0; }
  li { margin: 1.5pt 0; }
  .entry { margin: 0 0 ${space.entry + 2}pt; page-break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  .sub { color: #333; font-style: italic; }
  .dates { color: #333; white-space: nowrap; font-size: ${space.body - 0.5}pt; }
  .link { font-size: ${space.body - 1}pt; color: #333; }
</style>
</head>
<body>
<header${photo && !template.centered ? ' class="with-photo"' : ''}>
${photo && template.centered ? photoImg : ''}${photo && !template.centered ? '<div>' : ''}<h1>${escapeHtml(content.name)}</h1>
${content.headline ? `<p class="role">${escapeHtml(content.headline)}</p>` : ''}
${contact.length > 0 ? `<p class="contact">${contact.map(escapeHtml).join(' | ')}</p>` : ''}${photo && !template.centered ? `</div>${photoImg}` : ''}
</header>
${sections}
</body>
</html>`;
}

/** The whole résumé as plain text, in the style's order: what the AI reads, and what a paste into an application form would carry. */
export function docPlainText(content: ResumeContent, style?: ResumeStyle): string {
  const order = style ? docBlocks(content, style) : null;
  const blocks = order ?? docBlocks(content, { template: 'professional', accent: 'black', font: 'sans', density: 'comfortable', paper: 'letter', order: Object.keys(SECTION_HEADINGS) as DocSection[], hidden: [] });
  const head = [content.name, content.headline, contactLine(content).join(' | ')].filter(Boolean);
  const body = blocks.map((block) => {
    const entries = block.entries.map((entry) => [`- ${entry.title}${entry.subtitle ? `, ${entry.subtitle}` : ''}${entry.dates ? ` (${entry.dates})` : ''}`, ...entry.bullets.map((line) => `    - ${line}`), entry.link ? `    ${entry.link}` : null].filter(Boolean).join('\n'));
    return [block.heading.toUpperCase(), ...block.paragraphs, ...block.bullets.map((line) => `- ${line}`), ...entries].join('\n');
  });
  return [...head, '', ...body.flatMap((section) => [section, ''])].join('\n').trim();
}
