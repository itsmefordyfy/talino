/** Profile and project links: kept apart from `build-portfolio` and `projects`, which both need them, so those two never import each other. */

export type LinkKind = 'website' | 'linkedin' | 'github';

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
