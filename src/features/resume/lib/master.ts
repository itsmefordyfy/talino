import { displayDate, lineList, LIMITS, parseContent, textLines, type DocEntry, type ResumeContent } from './document';
import { MINOR_BADGES } from './build-resume';
import { uniqueText } from './achievements';
import type { Achievements, ItemInput, ResumeItem, ResumeProfile, ResumeVersion } from '../types';

/** Newest first; something still going on (no end) before anything finished. */
function byRecency(a: ResumeItem, b: ResumeItem): number {
  const endA = a.end_on ?? '9999';
  const endB = b.end_on ?? '9999';
  if (endA !== endB) return endB.localeCompare(endA);
  return (b.start_on ?? '').localeCompare(a.start_on ?? '') || a.sort - b.sort;
}

function entryFromItem(item: ResumeItem): DocEntry {
  const precise = !!item.start_on || !!item.end_on;
  const asWritten = !precise && item.dates_text ? item.dates_text : '';
  return {
    id: item.id,
    title: item.title.trim(),
    organization: item.organization?.trim() ?? '',
    location: item.location?.trim() ?? '',
    start: item.kind === 'certification' ? '' : (item.start_on ?? asWritten),
    end: item.end_on ?? (item.kind === 'certification' ? asWritten : ''),
    // A role with a start and no end is still going on (the way the old résumé printed it).
    current: item.kind !== 'certification' && !!item.start_on && !item.end_on,
    link: item.link?.trim() ?? '',
    bullets: textLines(item.description),
  };
}

export type MasterInput = { name: string; profile: ResumeProfile | null; items: readonly ResumeItem[]; achievements: Achievements | null };

const text = (value: string | null | undefined) => value?.trim() ?? '';

/**
 * The master career profile as a résumé: the learner's profile and entries, then what Talino knows (passed projects and
 * certificates first under Projects and Certifications, skills learned, badges). Entry ids are the items' own, so what the
 * AI says about an entry can be matched back to it.
 */
export function contentFromMaster({ name, profile, items, achievements }: MasterInput): ResumeContent {
  const sorted = [...items].sort(byRecency).filter((item) => item.title.trim() !== '');
  const ofKind = (kind: ResumeItem['kind']) => sorted.filter((item) => item.kind === kind);

  const talinoProjects: DocEntry[] = (achievements?.projects ?? []).map((project, index) => ({
    id: `talino-p${index}`,
    title: project.title,
    organization: `Talino · ${project.course}`,
    location: '',
    start: '',
    end: '',
    current: false,
    link: project.link ?? '',
    bullets: project.summary.trim() ? [project.summary.trim()] : [],
  }));
  const talinoCertificates: DocEntry[] = (achievements?.certificates ?? []).map((certificate, index) => ({
    id: `talino-c${index}`,
    title: certificate.title,
    organization: 'Talino',
    location: '',
    start: '',
    end: certificate.issued,
    current: false,
    link: certificate.url ?? '',
    bullets: [],
  }));

  const wins = ofKind('achievement').map((item) => {
    const detail = textLines(item.description)[0];
    return detail ? `${item.title.trim()} – ${detail}` : item.title.trim();
  });
  const badges = (achievements?.badges ?? []).filter((badge) => !MINOR_BADGES.has(badge.id)).map((badge) => badge.title);

  return parseContent(
    {
      name: name.trim(),
      headline: text(profile?.headline),
      email: text(profile?.email),
      phone: text(profile?.phone),
      location: text(profile?.location),
      website: text(profile?.website),
      linkedin: text(profile?.linkedin),
      github: text(profile?.github),
      summary: text(profile?.summary),
      skills: uniqueText([...ofKind('skill').map((item) => item.title), ...(achievements?.skills ?? [])]),
      experience: ofKind('experience').map(entryFromItem),
      projects: [...talinoProjects, ...ofKind('project').map(entryFromItem)],
      education: ofKind('education').map(entryFromItem),
      certifications: [...talinoCertificates, ...ofKind('certification').map(entryFromItem)],
      achievements: [...wins, ...(badges.length > 0 ? [`Talino badges: ${badges.join(', ')}`] : [])],
    },
    // Ids already exist on every entry; the fallback only matters for an item with a blank id.
    () => `m${Math.random().toString(36).slice(2, 10)}`,
  );
}

const MONTH_NUMBER: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const pad = (value: number) => String(value).padStart(2, '0');

/** A month-precise date as `YYYY-MM-DD` (the first of the month when only month and year are given); null for anything vaguer ("2021", "Spring 2021"): a day or month is never made up. */
export function parseLooseDate(value: string): string | null {
  const raw = value.trim();
  let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (match) return Number(match[2]) >= 1 && Number(match[2]) <= 12 ? raw : null;
  match = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (match) return Number(match[2]) >= 1 && Number(match[2]) <= 12 ? `${match[1]}-${pad(Number(match[2]))}-01` : null;
  match = /^(\d{1,2})\/(\d{4})$/.exec(raw);
  if (match) return Number(match[1]) >= 1 && Number(match[1]) <= 12 ? `${match[2]}-${pad(Number(match[1]))}-01` : null;
  match = /^([A-Za-z]{3,9})\.?,?\s+(\d{4})$/.exec(raw);
  const month = match ? MONTH_NUMBER[match[1].slice(0, 3).toLowerCase()] : undefined;
  return match && month ? `${match[2]}-${pad(month)}-01` : null;
}

const PROFILE_FIELDS = ['headline', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'summary'] as const;
type ProfileField = (typeof PROFILE_FIELDS)[number];

export type MergeCounts = { experience: number; education: number; projects: number; certifications: number; skills: number; achievements: number };

export type Merge = {
  /** The profile fields that were blank and are now filled; nothing the learner wrote is ever replaced. */
  profile: Partial<Record<ProfileField, string>>;
  /** The imported résumé's name (the caller sets it only when the learner has none). */
  name: string;
  items: ItemInput[];
  counts: MergeCounts;
};

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Dates of an imported entry: real dates when month-precise, otherwise exactly as written so no month or year is invented. */
function importedDates(entry: DocEntry, kind: ItemInput['kind']): Pick<ItemInput, 'startOn' | 'endOn' | 'datesText'> {
  const none = { startOn: null, endOn: null, datesText: null };
  if (kind === 'certification') {
    const iso = parseLooseDate(entry.end);
    return entry.end === '' ? none : iso ? { ...none, endOn: iso } : { ...none, datesText: entry.end };
  }
  const start = parseLooseDate(entry.start);
  const end = parseLooseDate(entry.end);
  const startFine = entry.start === '' || start !== null;
  const endFine = entry.current || entry.end === '' || end !== null;
  // A start with no end that isn't ongoing is one date, not a range that runs to today.
  if (startFine && endFine && (entry.current || entry.end !== '' || entry.start === '')) return { startOn: start, endOn: entry.current ? null : end, datesText: null };
  const written = displayDate(entry.start) && (entry.current || entry.end) ? `${entry.start} – ${entry.current ? 'Present' : entry.end}` : entry.start || entry.end;
  return written ? { ...none, datesText: written } : none;
}

/**
 * What an imported résumé adds to the master profile: blank profile fields filled, and the entries, skills and achievements
 * the learner doesn't already have (same kind, title and organization, ignoring case).
 */
export function mergeImported(existing: { profile: ResumeProfile | null; items: readonly ResumeItem[] }, imported: ResumeContent, makeId: () => string): Merge {
  const profile: Merge['profile'] = {};
  for (const field of PROFILE_FIELDS) if (text(existing.profile?.[field]) === '' && imported[field] !== '') profile[field] = imported[field];

  const have = (kind: ItemInput['kind'], title: string, organization: string) => existing.items.some((item) => item.kind === kind && same(item.title, title) && same(item.organization ?? '', organization));
  const items: ItemInput[] = [];
  const counts: MergeCounts = { experience: 0, education: 0, projects: 0, certifications: 0, skills: 0, achievements: 0 };
  const add = (kind: ItemInput['kind'], title: string, rest: Partial<ItemInput> = {}) => {
    const organization = rest.organization ?? '';
    if (have(kind, title, organization) || items.some((item) => item.kind === kind && same(item.title, title) && same(item.organization, organization))) return false;
    items.push({ id: makeId(), kind, title, organization, startOn: null, endOn: null, description: '', location: '', link: '', datesText: null, ...rest });
    return true;
  };

  const fromEntries = (entries: readonly DocEntry[], kind: ItemInput['kind'], count: keyof MergeCounts) => {
    for (const entry of entries) {
      const added = add(kind, entry.title, { organization: entry.organization, location: entry.location, link: entry.link, description: entry.bullets.join('\n'), ...importedDates(entry, kind) });
      if (added) counts[count] += 1;
    }
  };
  fromEntries(imported.experience, 'experience', 'experience');
  fromEntries(imported.education, 'education', 'education');
  fromEntries(imported.projects, 'project', 'projects');
  fromEntries(imported.certifications, 'certification', 'certifications');
  for (const skill of imported.skills) if (add('skill', skill)) counts.skills += 1;
  for (const line of imported.achievements) if (add('achievement', line)) counts.achievements += 1;
  return { profile, name: imported.name, items, counts };
}

/** An old goal version (a tailored title, summary, highlights and keywords) as a whole document built on the master profile. */
export function versionToContent(base: ResumeContent, version: Omit<ResumeVersion, 'goal'> & { goal?: string }): ResumeContent {
  return {
    ...base,
    headline: text(version.jobTitle) || base.headline,
    summary: text(version.summary) || base.summary,
    skills: lineList([...base.skills, ...version.keywords], LIMITS.skills, 60),
    achievements: lineList([...version.highlights, ...base.achievements], LIMITS.achievements, LIMITS.bullet),
  };
}
