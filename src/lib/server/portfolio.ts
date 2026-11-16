/** Server-only: the public portfolio's shape, cleaning and page body. */

import { escapeHtml } from './table';

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');
/** Longer writing keeps its paragraphs: single line breaks are kept, runs of blank lines collapse to one. */
const block = (value: unknown, max: number) => (typeof value === 'string' ? value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max) : '');
const url = (value: unknown) => {
  const candidate = text(value, 300);
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
};

/** Screenshots are JPEGs the phone already shrank (about 1200 px wide); anything else, or anything bigger, is dropped. */
export const MAX_IMAGE_CHARS = 260_000;
export const MAX_IMAGES_PER_PROJECT = 4;
export const MAX_IMAGES_TOTAL = 24;
const JPEG_BASE64 = /^\/9j\/[A-Za-z0-9+/]+={0,2}$/;
/** The profile picture: a 480 px square JPEG, at most this many base64 characters (the same cap the phone keeps). */
export const MAX_PHOTO_CHARS = 120_000;
const isPhoto = (value: unknown): value is string => typeof value === 'string' && value.length > 200 && value.length <= MAX_PHOTO_CHARS && JPEG_BASE64.test(value);
const isJpeg = (value: unknown): value is string => typeof value === 'string' && value.length > 200 && value.length <= MAX_IMAGE_CHARS && JPEG_BASE64.test(value);

export type PortfolioProject = {
  title: string;
  /** The course a Talino project came from, empty for one the learner added. */
  course: string;
  /** One or two lines for the card. */
  summary: string;
  /** What it is, who it is for and what the learner did, as paragraphs. */
  description: string;
  role: string;
  tech: string[];
  url: string;
  repoUrl: string;
  /** Base64 JPEGs, shown in order; the first is the cover. */
  images: string[];
};

export type Portfolio = {
  name: string;
  /** The profile picture as base64 JPEG text, or empty when the learner chose not to show one. */
  photo: string;
  headline: string;
  about: string;
  location: string;
  links: { label: string; url: string }[];
  projects: PortfolioProject[];
  certificates: { title: string; url: string; issued: string }[];
  badges: string[];
  skills: string[];
};

/** Only the fields the page shows, cleaned and capped; anything else is dropped. */
export function cleanPortfolio(value: unknown): Portfolio {
  const raw = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>;
  const list = (items: unknown, max: number) => (Array.isArray(items) ? items.slice(0, max) : []);
  let imagesLeft = MAX_IMAGES_TOTAL;
  return {
    name: text(raw.name, 60),
    photo: isPhoto(raw.photo) ? raw.photo : '',
    headline: text(raw.headline, 120),
    about: typeof raw.about === 'string' ? raw.about.trim().slice(0, 1200) : '',
    location: text(raw.location, 80),
    links: list(raw.links, 6)
      .map((link) => ({ label: text((link as Record<string, unknown>)?.label, 40), url: url((link as Record<string, unknown>)?.url) }))
      .filter((link) => link.label && link.url),
    projects: list(raw.projects, 20)
      .map((project) => {
        const item = (project ?? {}) as Record<string, unknown>;
        const images = list(item.images, MAX_IMAGES_PER_PROJECT).filter(isJpeg).slice(0, imagesLeft);
        imagesLeft -= images.length;
        return {
          title: text(item.title, 100),
          course: text(item.course, 100),
          summary: text(item.summary, 300),
          description: block(item.description, 1500),
          role: text(item.role, 80),
          tech: list(item.tech, 12)
            .map((tag) => text(tag, 30))
            .filter(Boolean),
          url: url(item.url),
          repoUrl: url(item.repoUrl),
          images,
        };
      })
      .filter((project) => project.title),
    certificates: list(raw.certificates, 12)
      .map((certificate) => {
        const item = (certificate ?? {}) as Record<string, unknown>;
        return { title: text(item.title, 100), url: url(item.url), issued: text(item.issued, 20) };
      })
      .filter((certificate) => certificate.title),
    badges: list(raw.badges, 40)
      .map((badge) => text(badge, 40))
      .filter(Boolean),
    skills: list(raw.skills, 30)
      .map((skill) => text(skill, 40))
      .filter(Boolean),
  };
}

/** The profile picture's bytes, or null when the page has none. */
export function portfolioPhoto(data: Portfolio): Uint8Array<ArrayBuffer> | null {
  if (!isPhoto(data.photo)) return null;
  const binary = atob(data.photo);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

/** The bytes of one screenshot, or null when the project or picture doesn't exist. */
export function portfolioImage(data: Portfolio, projectIndex: number, imageIndex: number): Uint8Array<ArrayBuffer> | null {
  const encoded = data.projects?.[projectIndex]?.images?.[imageIndex];
  if (!isJpeg(encoded)) return null;
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || '·';

const link = (address: string, label: string, className = '') => `<a${className ? ` class="${className}"` : ''} href="${escapeHtml(address)}" rel="noopener nofollow">${escapeHtml(label)}</a>`;

/** The whole page's styles: its own document, not the shared card frame. Light and dark follow the visitor's setting. */
export const PORTFOLIO_CSS = `
:root { --bg:#fafafc; --surface:#ffffff; --ink:#0e1020; --muted:#5a5f78; --line:#e6e8f0; --accent:#4f46e5; --accent-ink:#ffffff; --soft:#eef0ff; --shadow:0 1px 2px rgba(16,24,40,.06),0 12px 32px rgba(16,24,40,.08); color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root { --bg:#07080d; --surface:#11131c; --ink:#f2f3fa; --muted:#a2a6bd; --line:#22253a; --accent:#8c8ffb; --accent-ink:#0a0b14; --soft:#1a1d36; --shadow:0 1px 2px rgba(0,0,0,.5),0 16px 40px rgba(0,0,0,.45); } }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.65 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
a { color:inherit; }
img { display:block; max-width:100%; }
.wrap { width:100%; max-width:1120px; margin:0 auto; padding-left:24px; padding-right:24px; }
.nav { position:sticky; top:0; z-index:10; background:color-mix(in srgb,var(--bg) 82%,transparent); backdrop-filter:saturate(1.4) blur(14px); -webkit-backdrop-filter:saturate(1.4) blur(14px); border-bottom:1px solid var(--line); }
.nav-in { display:flex; align-items:center; justify-content:space-between; gap:16px; height:64px; }
.nav-name { font-weight:800; letter-spacing:-.01em; text-decoration:none; font-size:17px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.nav-links { display:flex; gap:4px; }
.nav-links a { text-decoration:none; font-size:14px; font-weight:600; color:var(--muted); padding:8px 12px; border-radius:999px; }
.nav-links a:hover { color:var(--ink); background:var(--soft); }
.hero { position:relative; display:grid; grid-template-columns:1fr auto; align-items:center; gap:40px; padding-top:72px; padding-bottom:72px; }
.hero::before { content:""; position:absolute; inset:-120px -10% auto -10%; height:520px; z-index:-1; background:radial-gradient(60% 60% at 20% 20%,color-mix(in srgb,var(--accent) 22%,transparent),transparent 70%),radial-gradient(40% 50% at 85% 30%,color-mix(in srgb,#ec4899 14%,transparent),transparent 70%); pointer-events:none; }
.where { display:inline-flex; align-items:center; gap:6px; margin:0 0 18px; padding:6px 14px; border:1px solid var(--line); background:var(--surface); border-radius:999px; font-size:14px; font-weight:600; color:var(--muted); }
.where svg { width:15px; height:15px; }
h1 { margin:0; font-size:clamp(42px,7vw,72px); line-height:1.04; letter-spacing:-.035em; font-weight:800; overflow-wrap:anywhere; }
.lead { margin:18px 0 0; max-width:640px; font-size:clamp(18px,2.4vw,23px); line-height:1.5; color:var(--muted); font-weight:500; }
.cta { display:flex; flex-wrap:wrap; gap:10px; margin-top:32px; }
.btn { display:inline-flex; align-items:center; gap:8px; text-decoration:none; font-weight:700; font-size:15px; padding:12px 20px; border-radius:12px; border:1px solid var(--line); background:var(--surface); color:var(--ink); transition:transform .15s ease,box-shadow .15s ease; }
.btn:hover { transform:translateY(-1px); box-shadow:var(--shadow); }
.btn.primary { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
.avatar.has-photo { background:none; overflow:hidden; border:3px solid var(--surface); }
.avatar img { width:100%; height:100%; object-fit:cover; }
.avatar { width:168px; height:168px; border-radius:50%; display:grid; place-items:center; font-size:56px; font-weight:800; letter-spacing:.02em; color:var(--accent-ink); background:linear-gradient(135deg,var(--accent),#c026d3); box-shadow:var(--shadow); }
.sec { padding-top:56px; padding-bottom:56px; border-top:1px solid var(--line); }
.sec > h2, .split > h2 { margin:0 0 28px; font-size:13px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:800; }
.split { display:grid; grid-template-columns:200px 1fr; gap:24px; }
.split > h2 { margin:6px 0 0; }
.prose { margin:0; font-size:clamp(18px,2.2vw,21px); line-height:1.7; white-space:pre-line; max-width:760px; }
.projects { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:28px; }
.proj { background:var(--surface); border:1px solid var(--line); border-radius:22px; overflow:hidden; box-shadow:var(--shadow); display:flex; flex-direction:column; }
.proj.feature { grid-column:1 / -1; display:grid; grid-template-columns:1.25fr 1fr; }
.proj-media { padding:20px; background:linear-gradient(135deg,var(--soft),transparent); }
.frame { border:1px solid var(--line); border-radius:12px; overflow:hidden; background:var(--surface); box-shadow:0 10px 30px rgba(16,24,40,.14); }
.bar { display:flex; gap:6px; padding:9px 12px; border-bottom:1px solid var(--line); background:var(--bg); }
.bar i { width:9px; height:9px; border-radius:50%; background:var(--line); }
.main, .ph { width:100%; aspect-ratio:16/10; object-fit:cover; object-position:top; background:var(--soft); }
.ph { display:grid; place-items:center; font-size:48px; font-weight:800; color:var(--accent); }
.thumbs { display:flex; gap:8px; margin-top:12px; }
.thumbs a { flex:1 1 0; max-width:96px; border-radius:8px; overflow:hidden; border:2px solid transparent; opacity:.65; transition:opacity .15s; }
.thumbs a.on, .thumbs a:hover { opacity:1; border-color:var(--accent); }
.thumbs img { width:100%; aspect-ratio:16/10; object-fit:cover; object-position:top; }
.proj-body { padding:26px 28px 28px; display:flex; flex-direction:column; gap:12px; }
.proj-body h3 { margin:0; font-size:24px; line-height:1.2; letter-spacing:-.02em; }
.role { margin:0; font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); }
.desc { margin:0; color:var(--muted); white-space:pre-line; }
.tags { display:flex; flex-wrap:wrap; gap:8px; }
.tag { font-size:13px; font-weight:600; padding:4px 12px; border-radius:999px; background:var(--soft); color:var(--accent); }
.actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:auto; padding-top:8px; }
.chips { display:flex; flex-wrap:wrap; gap:10px; }
.chip { font-weight:600; font-size:15px; padding:8px 16px; border-radius:999px; background:var(--surface); border:1px solid var(--line); }
.certs { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.certs li { background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:14px 18px; font-weight:600; }
.certs span { display:block; font-weight:500; font-size:14px; color:var(--muted); }
.foot { padding:36px 24px 56px; text-align:center; font-size:14px; color:var(--muted); border-top:1px solid var(--line); }
.foot a { font-weight:700; text-decoration:none; color:var(--ink); }
@media (max-width:860px) { .hero { grid-template-columns:1fr; padding-top:44px; padding-bottom:48px; } .avatar { order:-1; width:96px; height:96px; font-size:34px; } .split { grid-template-columns:1fr; gap:8px; } .projects { grid-template-columns:1fr; } .proj.feature { grid-template-columns:1fr; } .certs { grid-template-columns:1fr; } .nav-links a:nth-child(n+4) { display:none; } }
@media (max-width:520px) { .wrap { padding-left:18px; padding-right:18px; } .nav-links { display:none; } .proj-body { padding:20px; } }
@media print { .nav { display:none; } .proj, .btn { box-shadow:none; } }
`;

const GALLERY_SCRIPT = `document.querySelectorAll('[data-g]').forEach(function(g){var m=g.querySelector('.main');g.querySelectorAll('.thumbs a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();m.src=a.href;g.querySelectorAll('.thumbs a').forEach(function(x){x.classList.toggle('on',x===a)})})})});`;

const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

function projectHtml(project: PortfolioProject, index: number, slug: string, version: string): string {
  const shots = project.images.length;
  const source = (shot: number) => `/p/${encodeURIComponent(slug)}/img/${index}-${shot}.jpg?v=${encodeURIComponent(version)}`;
  const alt = (shot: number) => escapeHtml(`${project.title}, screenshot ${shot + 1} of ${shots}`);
  const media =
    shots > 0
      ? `<div data-g><div class="frame"><div class="bar"><i></i><i></i><i></i></div><img class="main" src="${source(0)}" alt="${alt(0)}" decoding="async"${index === 0 ? '' : ' loading="lazy"'}></div>${
          shots > 1 ? `<div class="thumbs">${project.images.map((_, shot) => `<a href="${source(shot)}"${shot === 0 ? ' class="on"' : ''} aria-label="${alt(shot)}"><img src="${source(shot)}" alt="" loading="lazy" decoding="async"></a>`).join('')}</div>` : ''
        }</div>`
      : `<div class="frame"><div class="bar"><i></i><i></i><i></i></div><div class="ph" aria-hidden="true">${escapeHtml(initials(project.title))}</div></div>`;
  const role = [project.role, project.course].filter(Boolean).join(' · ');
  // The long description replaces the short summary when there is one; the summary is the fallback.
  const body = project.description || project.summary;
  const actions = [project.url ? link(project.url, 'Live demo ↗', 'btn primary') : '', project.repoUrl ? link(project.repoUrl, 'Source code', 'btn') : ''].join('');
  return `<article class="proj${index === 0 ? ' feature' : ''}"><div class="proj-media">${media}</div><div class="proj-body">${role ? `<p class="role">${escapeHtml(role)}</p>` : ''}<h3>${escapeHtml(project.title)}</h3>${body ? `<p class="desc">${escapeHtml(body)}</p>` : ''}${project.tech.length ? `<div class="tags">${project.tech.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div></article>`;
}

/**
 * The learner's portfolio as a whole website page: a sticky bar, a large hero, About, Projects (the first one featured, with a
 * screenshot gallery), Skills, Certificates and Badges. `version` busts the screenshot cache when the portfolio is updated.
 */
export function portfolioDocument(data: Portfolio, slug = '', version = ''): string {
  const title = `${data.name}${data.headline ? ` · ${data.headline}` : ' · Portfolio'}`;
  const description = (data.headline ? `${data.headline}. ` : '') + data.about.replace(/\s+/g, ' ').slice(0, 150);
  const sections = [
    data.about ? ['about', 'About'] : null,
    data.projects.length ? ['projects', 'Work'] : null,
    data.skills.length ? ['skills', 'Skills'] : null,
    data.certificates.length ? ['certificates', 'Certificates'] : null,
  ].filter((item): item is string[] => item !== null);
  const social = data.links.map((item) => link(item.url, item.label, 'btn')).join('');
  const body = [
    `<header class="nav"><div class="wrap nav-in"><a class="nav-name" href="#top">${escapeHtml(data.name)}</a><nav class="nav-links" aria-label="Sections">${sections.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav></div></header>`,
    `<main id="top"><section class="wrap hero"><div>${data.location ? `<p class="where">${PIN}${escapeHtml(data.location)}</p>` : ''}<h1>${escapeHtml(data.name)}</h1>${data.headline ? `<p class="lead">${escapeHtml(data.headline)}</p>` : ''}<div class="cta">${data.projects.length ? '<a class="btn primary" href="#projects">View my work</a>' : ''}${social}</div></div>${data.photo ? `<div class="avatar has-photo"><img src="/p/${encodeURIComponent(slug)}/img/photo.jpg?v=${encodeURIComponent(version)}" alt="${escapeHtml(`Photo of ${data.name}`)}" decoding="async"></div>` : `<div class="avatar" aria-hidden="true">${escapeHtml(initials(data.name))}</div>`}</section>`,
    data.about ? `<section id="about" class="wrap sec split"><h2>About</h2><p class="prose">${escapeHtml(data.about)}</p></section>` : '',
    data.projects.length ? `<section id="projects" class="wrap sec"><h2>Selected work</h2><div class="projects">${data.projects.map((project, index) => projectHtml(project, index, slug, version)).join('')}</div></section>` : '',
    data.skills.length ? `<section id="skills" class="wrap sec split"><h2>Skills</h2><div class="chips">${data.skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join('')}</div></section>` : '',
    data.certificates.length
      ? `<section id="certificates" class="wrap sec split"><h2>Certificates</h2><ul class="certs">${data.certificates.map((item) => `<li>${item.url ? link(item.url, item.title) : escapeHtml(item.title)}${item.issued ? `<span>${escapeHtml(item.issued)}</span>` : ''}</li>`).join('')}</ul></section>` : '',
    data.badges.length ? `<section class="wrap sec split"><h2>Badges</h2><div class="chips">${data.badges.map((badge) => `<span class="chip">★ ${escapeHtml(badge)}</span>`).join('')}</div></section>` : '',
    '</main>',
    `<footer class="foot">Portfolio built with <a href="https://talino.fordytechsolutions.com" rel="noopener">Talino</a>, the AI career coach for tech.</footer>`,
  ].join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta name="twitter:card" content="summary">
<style>${PORTFOLIO_CSS}</style>
</head>
<body>
${body}
<script>${GALLERY_SCRIPT}</script>
</body>
</html>`;
}
