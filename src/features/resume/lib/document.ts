/**
 * A résumé as the learner sees and edits it: plain text fields in one validated shape. It is stored as JSON in
 * `resume_documents.content`, built by the AI route from the learner's own entries, and read back through
 * `parseContent`, which accepts anything and returns something safe. No native imports: the server route uses it too.
 */

/** The standard headings, in ATS-friendly English; each template reorders them. */
export const DOC_SECTIONS = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements'] as const;
export type DocSection = (typeof DOC_SECTIONS)[number];

/** Sections made of entries (a job, a project, a degree, a certificate); the others are text or lists. */
export const ENTRY_SECTIONS = ['experience', 'projects', 'education', 'certifications'] as const;
export type EntrySection = (typeof ENTRY_SECTIONS)[number];

export function isEntrySection(value: unknown): value is EntrySection {
  return (ENTRY_SECTIONS as readonly unknown[]).includes(value);
}

/**
 * One job, project, degree or certificate. Dates are the words the learner would write ("Mar 2021", "2019"), so an
 * imported résumé never fails on a date it can't parse. For a certificate, `end` is the date it was earned and
 * `organization` the issuer.
 */
export type DocEntry = {
  id: string;
  title: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  link: string;
  bullets: string[];
};

export type ResumeContent = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  experience: DocEntry[];
  projects: DocEntry[];
  education: DocEntry[];
  certifications: DocEntry[];
  achievements: string[];
  /** The profile picture as base64 JPEG text, copied in when the résumé was made so a later change to the profile never alters it. Printed only when the style asks. */
  photo?: string;
};

/** Bounds on what a résumé may hold: a model or an imported file can't make one the app can't print. */
export const LIMITS = { short: 200, summary: 1200, bullet: 400, bullets: 12, entries: 20, skills: 60, achievements: 12, link: 300, photo: 120_000 } as const;

/** A picture kept only when it is a JPEG as base64 text of a size the profile holds. */
export const validPhoto = (value: unknown): string => (typeof value === 'string' && value.startsWith('/9j/') && value.length <= LIMITS.photo && /^[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : '');

export function emptyContent(): ResumeContent {
  return { name: '', headline: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '', skills: [], experience: [], projects: [], education: [], certifications: [], achievements: [] };
}

/** One line of text: whitespace collapsed, trimmed, cut to `max`. Anything that isn't a string is empty. */
export function oneLine(value: unknown, max: number = LIMITS.short): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

/** A list of one-line texts without blanks or case-insensitive repeats (first spelling wins). */
export function lineList(value: unknown, maxItems: number, maxLength: number = LIMITS.short): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of Array.isArray(value) ? value : []) {
    const line = oneLine(item, maxLength);
    const key = line.toLowerCase();
    if (!line || seen.has(key)) continue;
    seen.add(key);
    result.push(line);
    if (result.length >= maxItems) break;
  }
  return result;
}

let counter = 0;
/** An id that is unique within one résumé; the database id of a whole résumé is made with `newId`. */
export function entryId(): string {
  counter += 1;
  return `e${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function parseEntry(value: unknown, makeId: () => string = entryId): DocEntry | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const title = oneLine(raw.title);
  if (!title) return null;
  const id = oneLine(raw.id, 64);
  return {
    id: id || makeId(),
    title,
    organization: oneLine(raw.organization),
    location: oneLine(raw.location),
    start: oneLine(raw.start, 40),
    end: oneLine(raw.end, 40),
    current: raw.current === true,
    link: oneLine(raw.link, LIMITS.link),
    // Bullets keep their words but not stray line breaks.
    bullets: lineList(raw.bullets, LIMITS.bullets, LIMITS.bullet),
  };
}

function entries(value: unknown, makeId: () => string): DocEntry[] {
  const result: DocEntry[] = [];
  const seen = new Set<string>();
  for (const item of Array.isArray(value) ? value : []) {
    const entry = parseEntry(item, makeId);
    if (!entry) continue;
    // Two entries must never share an id: suggestions and the AI address entries by it.
    if (seen.has(entry.id)) entry.id = makeId();
    seen.add(entry.id);
    result.push(entry);
    if (result.length >= LIMITS.entries) break;
  }
  return result;
}

/** Accepts anything (stored JSON, a model's answer, a parsed file) and returns a valid résumé; unknown fields are dropped. */
export function parseContent(value: unknown, makeId: () => string = entryId): ResumeContent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return emptyContent();
  const raw = value as Record<string, unknown>;
  return {
    name: oneLine(raw.name),
    headline: oneLine(raw.headline),
    email: oneLine(raw.email),
    phone: oneLine(raw.phone, 40),
    location: oneLine(raw.location),
    website: oneLine(raw.website, LIMITS.link),
    linkedin: oneLine(raw.linkedin, LIMITS.link),
    github: oneLine(raw.github, LIMITS.link),
    summary: oneLine(raw.summary, LIMITS.summary),
    skills: lineList(raw.skills, LIMITS.skills, 60),
    experience: entries(raw.experience, makeId),
    projects: entries(raw.projects, makeId),
    education: entries(raw.education, makeId),
    certifications: entries(raw.certifications, makeId),
    achievements: lineList(raw.achievements, LIMITS.achievements, LIMITS.bullet),
    ...(validPhoto(raw.photo) ? { photo: validPhoto(raw.photo) } : {}),
  };
}

export function parseContentJson(text: string | null): ResumeContent {
  try {
    return parseContent(JSON.parse(text ?? 'null'));
  } catch {
    return emptyContent();
  }
}

export function contentIsEmpty(content: ResumeContent): boolean {
  return JSON.stringify(content) === JSON.stringify(emptyContent());
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A date as printed: an ISO date from the master profile becomes "Mar 2021"; any other words are kept as written. */
export function displayDate(value: string): string {
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value.trim());
  if (!match) return value.trim();
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : match[1];
}

/** "Mar 2021 – Jun 2023", "Mar 2021 – Present", a single date, or null when there is no date at all. */
export function formatRange(entry: Pick<DocEntry, 'start' | 'end' | 'current'>): string | null {
  const from = displayDate(entry.start);
  const to = entry.current ? 'Present' : displayDate(entry.end);
  if (from && to) return from === to ? from : `${from} – ${to}`;
  return from || to || null;
}

/** A description's lines as bullets: trimmed, blanks dropped, a leading "-", "•" or "*" removed. */
export function textLines(value: string | null | undefined): string[] {
  return (value ?? '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*–]\s*/, '').trim())
    .filter(Boolean);
}
