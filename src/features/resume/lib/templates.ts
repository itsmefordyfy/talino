import { DOC_SECTIONS, type DocSection } from './document';

/**
 * The learner's situation, which picks the template to start from. Stored on the profile (`resume_profile.level`).
 */
export const RESUME_LEVELS = ['student', 'graduate', 'experienced', 'shifter', 'freelancer', 'developer'] as const;
export type ResumeLevel = (typeof RESUME_LEVELS)[number];

export function isResumeLevel(value: unknown): value is ResumeLevel {
  return (RESUME_LEVELS as readonly unknown[]).includes(value);
}

export const TEMPLATE_IDS = ['professional', 'modern', 'graduate', 'career-shift', 'freelancer', 'developer'] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: unknown): value is TemplateId {
  return (TEMPLATE_IDS as readonly unknown[]).includes(value);
}

/** How a section heading is drawn. Every template is one column with standard headings: hiring software misreads anything else. */
export const HEADING_STYLES = ['rule', 'caps', 'bar', 'plain'] as const;
export type HeadingStyle = (typeof HEADING_STYLES)[number];

export const ACCENT_IDS = ['indigo', 'teal', 'slate', 'rose', 'amber', 'black'] as const;
export type AccentId = (typeof ACCENT_IDS)[number];

/** Paper and ink as they print: the preview shows a sheet of paper, so these don't follow the app's light and dark theme. */
export const PAPER_INK = { page: '#FFFFFF', ink: '#111111', muted: '#333333', rule: '#999999' } as const;

/** Dark enough to print and to read on screen; paper stays white. */
export const ACCENT_HEX: Record<AccentId, string> = { indigo: '#3730A3', teal: '#0F766E', slate: '#334155', rose: '#9F1239', amber: '#92400E', black: '#111111' };

export const FONT_IDS = ['sans', 'serif', 'mono'] as const;
export type FontId = (typeof FONT_IDS)[number];

/** System fonts only: a print WebView and Word have none of the app's fonts. */
export const FONT_STACKS: Record<FontId, string> = {
  sans: "-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "'SF Mono', Menlo, Consolas, 'Courier New', monospace",
};

/** The same three, as Word has them. */
export const WORD_FONTS: Record<FontId, string> = { sans: 'Arial', serif: 'Georgia', mono: 'Courier New' };

export const DENSITIES = ['compact', 'comfortable', 'relaxed'] as const;
export type Density = (typeof DENSITIES)[number];

/** Letter is the Philippine "short bond" and the US standard. */
export const PAPERS = ['letter', 'a4'] as const;
export type Paper = (typeof PAPERS)[number];
/** In points (1/72 inch), the unit the print module takes. */
export const PAPER_POINTS: Record<Paper, { width: number; height: number }> = { letter: { width: 612, height: 792 }, a4: { width: 595, height: 842 } };
/** The same pages in twips (1/20 point), exactly as Word defines them. */
export const PAPER_TWIPS: Record<Paper, { width: number; height: number }> = { letter: { width: 12240, height: 15840 }, a4: { width: 11906, height: 16838 } };

export type Template = {
  id: TemplateId;
  /** Who it is made for; the first is its main audience. */
  audience: readonly ResumeLevel[];
  order: readonly DocSection[];
  accent: AccentId;
  font: FontId;
  heading: HeadingStyle;
  /** The name centred over the page, instead of left. */
  centered: boolean;
};

const order = (...first: DocSection[]): DocSection[] => [...first, ...DOC_SECTIONS.filter((section) => !first.includes(section))];

export const TEMPLATES: Record<TemplateId, Template> = {
  professional: { id: 'professional', audience: ['experienced'], order: order('summary', 'experience', 'skills', 'projects', 'education'), accent: 'black', font: 'serif', heading: 'rule', centered: true },
  modern: { id: 'modern', audience: ['experienced', 'developer'], order: order('summary', 'skills', 'experience', 'projects', 'education'), accent: 'indigo', font: 'sans', heading: 'bar', centered: false },
  graduate: { id: 'graduate', audience: ['graduate', 'student'], order: order('summary', 'education', 'projects', 'skills', 'experience'), accent: 'teal', font: 'sans', heading: 'rule', centered: false },
  'career-shift': { id: 'career-shift', audience: ['shifter'], order: order('summary', 'skills', 'projects', 'experience', 'education'), accent: 'slate', font: 'sans', heading: 'caps', centered: false },
  freelancer: { id: 'freelancer', audience: ['freelancer'], order: order('summary', 'skills', 'projects', 'experience', 'certifications'), accent: 'amber', font: 'sans', heading: 'plain', centered: false },
  developer: { id: 'developer', audience: ['developer'], order: order('summary', 'skills', 'projects', 'experience', 'education'), accent: 'teal', font: 'mono', heading: 'caps', centered: false },
};

/** The template that fits a situation best (the learner can switch any time). */
export function recommendTemplate(level: ResumeLevel | null): TemplateId {
  if (!level) return 'modern';
  return TEMPLATE_IDS.find((id) => TEMPLATES[id].audience[0] === level) ?? TEMPLATE_IDS.find((id) => TEMPLATES[id].audience.includes(level)) ?? 'modern';
}

/** What the learner can change on top of a template. */
export type ResumeStyle = {
  template: TemplateId;
  accent: AccentId;
  font: FontId;
  density: Density;
  paper: Paper;
  order: DocSection[];
  hidden: DocSection[];
  /** Print the profile picture in the header. Off unless the learner turns it on: many hiring systems ignore photos. */
  photo?: boolean;
};

export function defaultStyle(template: TemplateId = 'modern'): ResumeStyle {
  const base = TEMPLATES[template];
  return { template, accent: base.accent, font: base.font, density: 'comfortable', paper: 'letter', order: [...base.order], hidden: [], photo: false };
}

const pick = <T extends string>(ids: readonly T[], value: unknown, fallback: T): T => (ids.includes(value as T) ? (value as T) : fallback);

/** A stored style, checked: unknown values fall back to the template's, and the order always names every section once. */
export function parseStyle(value: unknown, templateHint?: unknown): ResumeStyle {
  const raw = typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const template = pick(TEMPLATE_IDS, templateHint ?? raw.template, 'modern');
  const base = defaultStyle(template);
  const listed = (Array.isArray(raw.order) ? raw.order : []).filter((item): item is DocSection => (DOC_SECTIONS as readonly unknown[]).includes(item));
  const unique = [...new Set(listed)];
  const hidden = [...new Set((Array.isArray(raw.hidden) ? raw.hidden : []).filter((item): item is DocSection => (DOC_SECTIONS as readonly unknown[]).includes(item)))];
  return {
    template,
    accent: pick(ACCENT_IDS, raw.accent, base.accent),
    font: pick(FONT_IDS, raw.font, base.font),
    density: pick(DENSITIES, raw.density, base.density),
    paper: pick(PAPERS, raw.paper, base.paper),
    order: [...unique, ...base.order.filter((section) => !unique.includes(section))],
    hidden,
    photo: raw.photo === true,
  };
}

/** Moves a section one place up or down in a style's order; a move past either end changes nothing. */
export function moveSection(style: ResumeStyle, section: DocSection, direction: -1 | 1): ResumeStyle {
  const from = style.order.indexOf(section);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= style.order.length) return style;
  const next = [...style.order];
  [next[from], next[to]] = [next[to], next[from]];
  return { ...style, order: next };
}

export function toggleSection(style: ResumeStyle, section: DocSection): ResumeStyle {
  return { ...style, hidden: style.hidden.includes(section) ? style.hidden.filter((item) => item !== section) : [...style.hidden, section] };
}

/** Picking another template keeps what the learner chose that isn't part of the template (paper, density) and resets the rest to the template's look. */
export function switchTemplate(style: ResumeStyle, template: TemplateId): ResumeStyle {
  return { ...defaultStyle(template), paper: style.paper, density: style.density, hidden: style.hidden, photo: style.photo === true };
}
