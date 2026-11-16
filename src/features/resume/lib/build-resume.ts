import type { Achievements, ResumeGoal, ResumeItem, ResumeProfile, ResumeVersion } from '../types';
import { uniqueText } from './achievements';

export type ResumeEntry = {
  title: string;
  organization: string | null;
  dates: string | null;
  description: string | null;
  link: string | null;
};

/** One résumé version, ready to preview, print or send to the coach. */
export type ResumeData = {
  goal: ResumeGoal;
  name: string;
  jobTitle: string;
  /** Email, phone, location and links, in that order, only those filled in. */
  contact: string[];
  summary: string;
  highlights: string[];
  skills: string[];
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  education: ResumeEntry[];
  certifications: ResumeEntry[];
  /** Talino badges worth an employer's attention, listed under Certifications. */
  badges: string[];
  /** The goal's version was saved from tailoring to a job post. */
  tailored: boolean;
};

export type ResumeInput = {
  goal: ResumeGoal;
  name: string;
  profile: ResumeProfile | null;
  items: readonly ResumeItem[];
  achievements: Achievements;
  version: ResumeVersion | null;
};

/**
 * Résumé text stays English (the documents employers read; the interface may be translated later).
 * Each goal's default title and the sentence that points the summary at that goal.
 */
export const GOAL_DEFAULTS: Record<ResumeGoal, { jobTitle: string; focus: string; intro: string }> = {
  developer: {
    jobTitle: 'Software Developer',
    intro: 'Developer who builds and ships working software with AI tools.',
    focus: 'Looking for a developer role on a team that ships with AI.',
  },
  freelance: {
    jobTitle: 'Freelance Tech Specialist',
    intro: 'Freelancer who delivers web, automation and support work with AI tools.',
    focus: 'Available for freelance and remote projects, with clear updates and on-time delivery.',
  },
  'ai-engineer': {
    jobTitle: 'AI Engineer',
    intro: 'Developer who builds features that call AI models.',
    focus: 'Focused on AI features end to end: prompts, retrieval, evaluation and testing.',
  },
};

/** Streaks and quiz scores show effort, not work an employer can check: kept off the résumé. */
export const MINOR_BADGES = new Set(['first-lesson', 'streak-7', 'streak-30', 'perfect-quiz']);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Mar 2024" from `YYYY-MM-DD` (fixed English, independent of the phone's locale). */
export function monthYear(iso: string | null): string | null {
  const match = /^(\d{4})-(\d{2})/.exec(iso ?? '');
  if (!match) return null;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : null;
}

function dateRange(start: string | null, end: string | null): string | null {
  const from = monthYear(start);
  const to = monthYear(end);
  if (from && to) return from === to ? from : `${from} – ${to}`;
  if (from) return `${from} – Present`;
  return to;
}

const text = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
};

/** Newest first; something still going on (no end) before anything finished. */
function byRecency(a: ResumeItem, b: ResumeItem): number {
  const endA = a.end_on ?? '9999';
  const endB = b.end_on ?? '9999';
  if (endA !== endB) return endB.localeCompare(endA);
  return (b.start_on ?? '').localeCompare(a.start_on ?? '') || a.sort - b.sort;
}

function itemEntry(item: ResumeItem, singleDate = false): ResumeEntry {
  return {
    title: item.title.trim(),
    organization: text(item.organization),
    dates: singleDate ? monthYear(item.end_on ?? item.start_on) : dateRange(item.start_on, item.end_on),
    description: text(item.description),
    link: null,
  };
}

/** "A, B and C". */
export function joinList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? '';
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

/** The goal's default summary: the learner's own summary pointed at the goal, or an opening built from their skills. */
export function defaultSummary(goal: ResumeGoal, profileSummary: string | null, skills: readonly string[]): string {
  const defaults = GOAL_DEFAULTS[goal];
  const own = text(profileSummary);
  if (own) return `${own}${/[.!?]$/.test(own) ? '' : '.'} ${defaults.focus}`;
  // Skill names are titles ("Prompting"); mid-sentence they read lower-case, except acronyms ("AI in daily work").
  const inSentence = (skill: string) => (/^[A-Z][a-z]/.test(skill) ? skill[0].toLowerCase() + skill.slice(1) : skill);
  const skilled = skills.length > 0 ? ` Skilled in ${joinList(skills.slice(0, 4).map(inSentence))}.` : '';
  return `${defaults.intro}${skilled} ${defaults.focus}`;
}

/**
 * A résumé built from what the learner has done, so nobody starts from a blank page: their profile
 * and own items, then Talino's passed projects and certificates (first under Projects and
 * Certifications), learned skills and badges. A saved version for the goal wins for its title,
 * summary, highlights and keywords.
 */
export function buildResume(input: ResumeInput): ResumeData {
  const { goal, profile, achievements, version } = input;
  const items = [...input.items].sort(byRecency);
  const ofKind = (kind: ResumeItem['kind']) => items.filter((item) => item.kind === kind && item.title.trim() !== '');

  const ownSkills = ofKind('skill').map((item) => item.title);
  const skills = uniqueText([...ownSkills, ...(version?.keywords ?? []), ...achievements.skills]);

  const contact = [profile?.email, profile?.phone, profile?.location, profile?.website, profile?.linkedin, profile?.github].map(text).filter((value): value is string => value !== null);

  const talinoProjects: ResumeEntry[] = achievements.projects.map((project) => ({
    title: project.title,
    organization: `Talino · ${project.course}`,
    dates: null,
    description: text(project.summary),
    link: project.link,
  }));
  const talinoCertificates: ResumeEntry[] = achievements.certificates.map((certificate) => ({
    title: certificate.title,
    organization: 'Talino',
    dates: monthYear(certificate.issued),
    description: null,
    link: certificate.url,
  }));

  return {
    goal,
    name: input.name.trim(),
    jobTitle: text(version?.jobTitle) ?? GOAL_DEFAULTS[goal].jobTitle,
    contact,
    summary: text(version?.summary) ?? defaultSummary(goal, profile?.summary ?? null, skills),
    highlights: (version?.highlights ?? []).map((line) => line.trim()).filter(Boolean),
    skills,
    experience: ofKind('experience').map((item) => itemEntry(item)),
    projects: [...talinoProjects, ...ofKind('project').map((item) => itemEntry(item))],
    education: ofKind('education').map((item) => itemEntry(item)),
    certifications: [...talinoCertificates, ...ofKind('certification').map((item) => itemEntry(item, true))],
    badges: achievements.badges.filter((badge) => !MINOR_BADGES.has(badge.id)).map((badge) => badge.title),
    tailored: !!version && (text(version.summary) !== null || version.highlights.length > 0),
  };
}
