import type { TemplateValues } from '@/features/templates';

import { KIT_FORMATS, type KitKind, type KitStyle, type KitTemplate } from '../content';

/** What the AI is asked to write, section by section, for each kind of template: in the order the file has them. */
const SECTIONS: Record<KitKind, readonly string[]> = {
  resume: [
    'Professional summary: 3 lines, who I am, what I build, what I am looking for.',
    'Skills: grouped as Languages, Frameworks, Tools and AI tools.',
    'Projects: 2 entries, each with a name, ONE line on the problem and the result, and a link.',
    'Experience: up to 2 roles, each with 2 or 3 bullets that start with a strong verb. Only things I tell you.',
    'Education and certificates: one line each.',
  ],
  portfolio: [
    'About: 2 or 3 sentences about me and the kind of work I want, written about the people I help.',
    'Selected projects: 3 entries, each with a name, the problem it solves in one line, what I built (the stack) and one honest result.',
    'Skills: one line.',
    'Contact: one line, and whether I am available for new work.',
  ],
  'case-study': [
    'Slide 1, title: the project name and one line on what it does and who it is for.',
    'Slide 2, the problem: who has it, what they do today instead, what it costs them.',
    'Slide 3, what I built: three short points.',
    'Slide 4, how it works: three steps, one or two lines each.',
    'Slide 5, the result: three numbers or outcomes, each with one line on what it means.',
    'Slide 6, what I learned and what is next: three short points.',
  ],
  proposal: [
    'The problem, in the client’s own words.',
    'What I will deliver (3 bullets) and what is NOT included (2 bullets).',
    'A timeline with 3 milestones.',
    'How we will work: revisions, how fast I reply, how payment is split.',
    'Investment: ask me for the price. Never choose one for me.',
  ],
  invoice: [
    'The “Bill to” details and the invoice number and dates.',
    'The line items: a clear description, quantity, rate and amount for each, in Philippine pesos (₱).',
    'The subtotal, any tax and the total, added up correctly.',
    'My payment details and one line of payment terms.',
  ],
};

/** Where the AI should be careful: what only I can supply. */
const ASK_ME: Record<KitKind, string> = {
  resume: 'my employers, dates, school and certificates',
  portfolio: 'the links to my projects and what each one achieved',
  'case-study': 'the real numbers and what the project achieved',
  proposal: 'the client, their problem, the scope, the price and the dates',
  invoice: 'the client, what I did, the rates, the amounts and my payment details',
};


/** How each look is laid out and coloured, in words, so an AI that has not seen the template can build the same design. Keyed by `<template id>/<look id>`. */
const LOOKS: Record<string, string> = {
  'developer-resume/sidebar': 'a dark navy (#1E2A5A) left column about a third of the page wide with a photo placeholder, name, contact, skills and languages in white and mint text; the wide right column holds the summary, projects, experience, education and certificates under violet (#7957F5) headings',
  'developer-resume/header': 'a full-width violet (#7957F5) band across the top with the name, headline and contact line in white and a photo placeholder at its right; below it one clean column with violet headings, and skills at the end',
  'developer-resume/minimal': 'a plain white page with dark ink text: the name large at the top left, a small photo placeholder at the top right, a thin rule, then one clean column with dark headings. No colour fills',
  'portfolio-sheet/spotlight': 'a violet (#7957F5) band with a large headline ("I build useful things with code and AI"), then About, three project entries, skills and contact',
  'portfolio-sheet/grid': 'the name and a short About at the top, then a 2x2 grid of project cards (screenshot placeholder, name, problem, stack, result) with forest-green (#1F4D3A) accents, then skills and contact',
  'portfolio-sheet/story': 'two columns: on the left the name, About, a short "How I got here" timeline and skills; on the right a navy (#1E2A5A) column with a photo placeholder, three selected projects and contact details',
  'case-study-deck/bold': 'violet (#7957F5) and amber (#FBBF24) colour blocks, very large headings and high contrast; content slides have a violet header band',
  'case-study-deck/clean': 'a white background, dark ink text, one slate (#64748B) accent, lots of space and small labels',
  'case-study-deck/dark': 'a deep ink (#1F2430) background, white text, and violet (#7957F5) and mint (#5EEAD4) accents',
  'client-proposal/tiers': 'a violet (#7957F5) header band with the project title, then the sections, then the price as three cards side by side (Starter, Standard highlighted in violet and marked Recommended, Premium)',
  'client-proposal/one-page': 'everything on one A4 page: a navy (#1E2A5A) header band with "Prepared for" and "Prepared by" on the right, and a two-column body whose light-lavender right column holds the timeline, the investment and the next step',
  'client-proposal/letter': 'a formal letter: sender block, date, client address, a subject line, then the sections as short headed paragraphs, little colour (forest-green #1F4D3A headings) and a signature',
  'freelance-invoice/classic': 'a navy (#1E2A5A) header band with the business name and the INVOICE number and dates, a Bill to block, a bordered items table with a navy header row, totals ending in a navy "Total due" bar, then payment details',
  'freelance-invoice/modern': 'a violet (#7957F5) left sidebar with INVOICE, the number, dates, Bill to and payment details; on the right the business name, the items table, the totals and the payment terms',
  'freelance-invoice/compact': 'minimal and tight: dark ink text on white, thin lines and a small items table with room for 8 rows',
};

export type KitPromptInput = {
  template: KitTemplate;
  style: KitStyle;
  /** The template's title as the learner reads it ("Developer résumé"). */
  title: string;
  /** What Talino knows about the learner; null before it has loaded (the prompt then just asks). */
  values: TemplateValues | null;
};

const line = (label: string, value: string | null | undefined) => (value && value.trim() ? `- ${label}: ${value.trim()}` : `- ${label}: [not given yet]`);

/**
 * A prompt the learner copies into ChatGPT, Claude, Gemini or any AI chat. It asks the AI to MAKE the file (a real .docx or .pptx to download,
 * which ChatGPT and Claude can do), not just write text: it describes the template's layout and colours so the AI can build the same design,
 * and says to fill the attached template instead when the learner attaches the one they downloaded. It carries what Talino already knows
 * about them (name, headline, skills, best project, links) and is written so the AI does not invent employers, numbers or clients: it asks for
 * what is missing instead. If the chat cannot make files, it falls back to text to paste. Pure, English (the documents are English).
 */
export function buildKitPrompt({ template, style, title, values }: KitPromptInput): string {
  const format = KIT_FORMATS[template.format];
  const ext = `.${format.extension}`;
  const slides = template.format === 'pptx';
  const about = [
    line('Name', values?.name),
    line('Headline', values?.headline),
    line('Top skills', values?.skills),
    line('Best project', values?.topProject),
    line('Project link', values?.topProjectLink),
    line('Portfolio link', values?.portfolioLink),
    line('Talino course I am taking', values?.course),
  ];
  return [
    `Create a "${title}" for me as a downloadable ${format.label} file (${ext}), the ${style.name} look. Please make the actual file for me to download, not just text in the chat.`,
    '',
    'About me',
    ...about,
    '',
    `The ${slides ? 'deck' : 'document'} has these parts, in this order`,
    ...SECTIONS[template.kind].map((section, index) => `${index + 1}. ${section}`),
    '',
    'Design',
    `- If I have attached a template file, fill that one in: keep its design, fonts and layout exactly, and only replace the placeholder text.`,
    `- If not, build it from scratch as a ${slides ? '16:9 PowerPoint deck of 6 slides' : 'one-page-style A4 Word document'} with this look: ${LOOKS[`${template.id}/${style.id}`] ?? 'a clean, modern layout'}.`,
    '- Use Arial so it opens the same in Word, Pages, Google Docs and Canva. Every piece of text must be real, editable text (no text inside images, no screenshots of text).',
    '- Use simple tables and normal paragraphs only. Leave a clearly marked placeholder where a photo or screenshot goes.',
    '',
    'Rules',
    '- Use only what I have told you. Never invent employers, dates, clients, prices, numbers or links.',
    `- If something is missing, leave it in [brackets] in the file and, in the chat, ask me for it in one short question each. You will need ${ASK_ME[template.kind]}.`,
    '- Write plainly and specifically, in short sentences. Start bullets with a verb. No buzzwords, no filler.',
    `- Keep it short enough to fit: ${slides ? 'six slides' : 'one to two pages'}.`,
    '- Write in English.',
    '',
    `If you cannot create files in this chat, give me each part under its own heading as plain text I can paste into the ${slides ? 'slides' : 'document'}.`,
    'If you need more from me before you start, ask up to 5 quick questions first.',
  ].join('\n');
}
