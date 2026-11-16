import type { Achievements, ResumeProfile } from '@/features/resume';

import { isShowable, type PortfolioProject } from './projects';

/** One project as the page shows it (the server's `cleanPortfolio` shape): details and base64 JPEG screenshots for the learner's own, the course and a summary for a passed Talino project. */
export type PayloadProject = { title: string; course: string; summary: string; description: string; role: string; tech: string[]; url: string; repoUrl: string; images: string[] };

/** Exactly what `/api/portfolio` stores and `/p/<slug>` shows (its `cleanPortfolio` shape and caps). */
export type PortfolioPayload = {
  name: string;
  /** The profile picture (base64 JPEG), only when the learner chose to show it; empty otherwise. */
  photo: string;
  headline: string;
  about: string;
  location: string;
  links: { label: string; url: string }[];
  projects: PayloadProject[];
  certificates: { title: string; url: string; issued: string }[];
  badges: string[];
  skills: string[];
};

export type LinkKind = 'website' | 'linkedin' | 'github';

/** The public page's own words for the links (it is English, like the page). */
const LINK_LABELS: Record<LinkKind, string> = { website: 'Website', linkedin: 'LinkedIn', github: 'GitHub' };

/** The server keeps only full https addresses; anything else would silently vanish from the page. */
export function httpsUrl(value: string | null | undefined): string | null {
  try {
    const url = new URL((value ?? '').trim());
    return url.protocol === 'https:' && url.hostname.includes('.') ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * A profile link as people type it ("linkedin.com/in/ana", "@ana" for GitHub, "http://site.ph")
 * turned into the https address the page can link to; null when it can't be one.
 */
export function profileLink(value: string | null | undefined, kind: LinkKind): string | null {
  let text = (value ?? '').trim();
  if (text === '') return null;
  if (/^http:\/\//i.test(text)) text = `https://${text.slice(7)}`;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) {
    const handle = text.replace(/^@/, '');
    const bare = !handle.includes('.') && !handle.includes('/');
    if (bare && kind === 'linkedin') text = `https://www.linkedin.com/in/${handle}`;
    else if (bare && kind === 'github') text = `https://github.com/${handle}`;
    else text = `https://${text}`;
  }
  return httpsUrl(text);
}

const cut = (value: string | null | undefined, max: number) => (value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export type PortfolioInput = {
  name: string;
  profile: ResumeProfile | null;
  achievements: Achievements;
  /** Skills the learner added to their résumé themselves. */
  ownSkills: readonly string[];
  /** The projects the learner added themselves, in the order they chose; they come first on the page. */
  customProjects?: readonly PortfolioProject[];
  /** The profile picture to show on the page, or null / undefined to show none (the learner's choice). */
  photo?: string | null;
  /** "Nov 2026" from a stored date (the résumé's formatter). */
  formatIssued: (iso: string) => string;
};

const ownProject = (project: PortfolioProject): PayloadProject => ({
  title: cut(project.title, 100),
  course: '',
  summary: cut(project.summary, 300),
  description: project.description.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 1500),
  role: cut(project.role, 80),
  tech: project.tech.slice(0, 12),
  url: httpsUrl(project.url) ?? '',
  repoUrl: httpsUrl(project.repoUrl) ?? '',
  images: project.images.slice(0, 4),
});

const courseProject = (project: Achievements['projects'][number]): PayloadProject => ({
  title: cut(project.title, 100),
  course: cut(project.course, 100),
  summary: cut(project.summary, 300),
  description: '',
  role: '',
  tech: [],
  url: httpsUrl(project.link) ?? '',
  repoUrl: '',
  images: [],
});

/**
 * The public portfolio: the learner's name, headline and summary, their links, passed projects (with
 * live links), every certificate (linked when an older one has a verification page), badges and skills.
 * Capped like the server, so the preview is exactly what goes public.
 */
export function buildPortfolio(input: PortfolioInput): PortfolioPayload {
  const { profile, achievements } = input;
  const links = (['website', 'linkedin', 'github'] as const).flatMap((kind) => {
    const url = profileLink(profile?.[kind], kind);
    return url ? [{ label: LINK_LABELS[kind], url }] : [];
  });
  const seen = new Set<string>();
  const skills = [...input.ownSkills, ...achievements.skills]
    .map((skill) => cut(skill, 40))
    .filter((skill) => {
      const key = skill.toLowerCase();
      if (!skill || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return {
    name: cut(input.name, 60),
    photo: input.photo ?? '',
    headline: cut(profile?.headline, 120),
    about: (profile?.summary ?? '').trim().slice(0, 1200),
    location: cut(profile?.location, 80),
    links,
    projects: [...(input.customProjects ?? []).filter(isShowable).map(ownProject), ...achievements.projects.map(courseProject)].slice(0, 20),
    // Every earned certificate (certificates have no verification page since 2026-11-15; an older one that has one keeps its link).
    certificates: achievements.certificates
      .map((certificate) => ({ title: cut(certificate.title, 100), url: httpsUrl(certificate.url) ?? '', issued: cut(input.formatIssued(certificate.issued), 20) }))
      .slice(0, 12),
    badges: achievements.badges.map((badge) => cut(badge.title, 40)).slice(0, 40),
    skills: skills.slice(0, 30),
  };
}

/** Something beyond a name to show: publishing an empty page helps nobody. */
export function hasPortfolioContent(portfolio: PortfolioPayload): boolean {
  return portfolio.headline !== '' || portfolio.about !== '' || portfolio.projects.length > 0 || portfolio.certificates.length > 0;
}
