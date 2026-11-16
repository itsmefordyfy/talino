import { profileLink } from './build-portfolio';

/** What the public page and its server accept (`lib/server/portfolio`): screenshots are small JPEGs held as base64 text. */
export const MAX_PROJECT_IMAGES = 4;
export const MAX_PROJECTS = 12;
export const MAX_TECH = 12;
/** A screenshot is shrunk to this width and compressed before it is kept, so a project stays a few hundred kilobytes. */
export const IMAGE_WIDTH = 1200;
export const IMAGE_QUALITY = 0.6;
/** The server drops anything longer than this (base64 characters); a picture that still comes out bigger is shrunk again. */
export const MAX_IMAGE_CHARS = 260_000;

export type PortfolioProject = {
  id: string;
  title: string;
  /** One or two lines for the card on the page. */
  summary: string;
  /** What it is, who it is for, what the learner did. */
  description: string;
  role: string;
  tech: string[];
  url: string | null;
  repoUrl: string | null;
  /** Base64 JPEGs in the order shown; the first is the cover. */
  images: string[];
  sort: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = {
  id: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  tech: string[];
  url: string;
  repoUrl: string;
  images: string[];
};

const oneLine = (value: string, max: number) => value.replace(/\s+/g, ' ').trim().slice(0, max);

/** "React, Expo and Supabase" typed any way ("React, Expo\nSupabase"): the tags, trimmed, without repeats. */
export function parseTech(value: string): string[] {
  const seen = new Set<string>();
  return value
    .split(/[,;\n]+/)
    .map((tag) => oneLine(tag, 30))
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_TECH);
}

export const techText = (tech: readonly string[]) => tech.join(', ');

/** A stored list of pictures, checked: only strings that are JPEG base64 of a size the server keeps, at most four. */
export function parseImages(value: unknown): string[] {
  const list = typeof value === 'string' ? safeJson(value) : value;
  return (Array.isArray(list) ? list : []).filter((item): item is string => typeof item === 'string' && item.startsWith('/9j/') && item.length <= MAX_IMAGE_CHARS).slice(0, MAX_PROJECT_IMAGES);
}

export function parseTags(value: unknown): string[] {
  const list = typeof value === 'string' ? safeJson(value) : value;
  return (Array.isArray(list) ? list : []).filter((item): item is string => typeof item === 'string').map((tag) => oneLine(tag, 30)).filter(Boolean).slice(0, MAX_TECH);
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** A link as typed ("mysite.com") made into the https address the page links to, or null. */
export const projectLink = (value: string) => profileLink(value, 'website');

/** A project is worth showing with a title and something to say or show. */
export function isShowable(project: Pick<PortfolioProject, 'title' | 'summary' | 'description' | 'images' | 'url' | 'repoUrl'>): boolean {
  return project.title.trim() !== '' && (project.summary !== '' || project.description !== '' || project.images.length > 0 || Boolean(project.url) || Boolean(project.repoUrl));
}
