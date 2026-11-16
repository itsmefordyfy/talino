/**
 * Server-only: reads a learner's submitted link (a GitHub repo, a live site, a profile) so Tali can
 * review what is really there. Public https pages only: no IP addresses, no localhost or private
 * names, a short time-out and a size cap; a GitHub repo is read through its README. The text goes
 * to the model and is never stored.
 */

const MAX_BYTES = 200_000;
const MAX_TEXT = 6000;
const TIMEOUT_MS = 6000;

/** A public https URL we are willing to fetch, or null. */
export function safeUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host.endsWith('.local') || host.endsWith('.internal') || host === 'localhost') return null;
  // Literal addresses (IPv4 or IPv6) are refused: only names that resolve publicly.
  if (/^\d+(\.\d+){3}$/.test(host) || host.startsWith('[') || host.includes(':')) return null;
  return url;
}

/** For a github.com repo link, the raw README; otherwise the page itself. */
export function readableUrl(url: URL): string {
  const parts = url.pathname.split('/').filter(Boolean);
  if (url.hostname === 'github.com' && parts.length >= 2 && (parts.length === 2 || parts[2] === 'tree')) {
    const branch = parts[2] === 'tree' && parts[3] ? parts[3] : 'HEAD';
    return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${branch}/README.md`;
  }
  return url.toString();
}

/** Visible text of an HTML page, roughly: scripts and styles dropped, tags removed, spaces collapsed. */
export function pageText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export type FetchedPage = { ok: true; text: string; source: string } | { ok: false; reason: 'invalid' | 'unreachable' | 'status' | 'empty' };

export async function fetchSubmissionPage(link: string, fetchImpl: typeof fetch = fetch): Promise<FetchedPage> {
  const url = safeUrl(link);
  if (!url) return { ok: false, reason: 'invalid' };
  const target = readableUrl(url);
  try {
    const response = await fetchImpl(target, { redirect: 'follow', headers: { 'user-agent': 'TalinoReviewBot/1.0', accept: 'text/html,text/plain,text/markdown' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) return { ok: false, reason: 'status' };
    const raw = (await response.text()).slice(0, MAX_BYTES);
    const text = (/<html|<body|<div/i.test(raw) ? pageText(raw) : raw.trim()).slice(0, MAX_TEXT);
    return text ? { ok: true, text, source: target } : { ok: false, reason: 'empty' };
  } catch {
    return { ok: false, reason: 'unreachable' };
  }
}
