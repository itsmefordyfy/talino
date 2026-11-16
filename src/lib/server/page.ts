import { escapeHtml } from './table';

/**
 * The public pages' frame (certificate, portfolio, teacher and talent views): Talino's colours, the
 * system font (a server page has no app fonts), light and dark, readable on a phone. Content is
 * escaped by the callers with `escapeHtml`.
 */
export function htmlPage(title: string, body: string, options: { noindex?: boolean; description?: string; /** More styles for one page (a portfolio's own look). */ css?: string; /** A wider column than the 760 px default. */ maxWidth?: number } = {}): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
${options.description ? `<meta name="description" content="${escapeHtml(options.description)}">` : ''}
${options.noindex ? '<meta name="robots" content="noindex">' : ''}
<style>
:root { --bg:#F7F7FB; --card:#FFFFFF; --text:#16162A; --muted:#5B5B72; --border:#E6E6EF; --primary:#4F46E5; --violet:#7C3AED; --spark:#FBBF24; --ok:#15803D; }
@media (prefers-color-scheme: dark) { :root { --bg:#000000; --card:#15151F; --text:#F1F1F7; --muted:#A9A9BE; --border:#2A2A3A; --primary:#A5B4FC; --ok:#86EFAC; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--text); font:16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
main { max-width: ${options.maxWidth ?? 760}px; margin: 0 auto; padding: 24px 16px 48px; }
.brand { display:flex; align-items:center; gap:8px; font-weight:800; font-size:18px; margin-bottom:20px; }
.brand span { color: var(--primary); }
.hero { background: linear-gradient(135deg, #4F46E5, #7C3AED); color:#fff; border-radius:20px; padding:28px 24px; }
.hero h1 { margin: 6px 0 4px; font-size: 28px; line-height: 1.2; }
.hero p { margin: 0; color: rgba(255,255,255,.85); }
.eyebrow { text-transform: uppercase; letter-spacing: .08em; font-size: 12px; font-weight: 600; color: rgba(255,255,255,.8); }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-top: 16px; }
.card h2 { margin: 0 0 8px; font-size: 18px; }
.muted { color: var(--muted); }
.ok { color: var(--ok); font-weight: 600; }
ul { padding-left: 20px; margin: 8px 0 0; }
li { margin: 4px 0; }
a { color: var(--primary); }
.chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.chip { border:1px solid var(--border); border-radius:999px; padding:4px 12px; font-size:14px; }
table { width:100%; border-collapse: collapse; font-size: 14px; }
th, td { text-align:left; padding: 8px 6px; border-bottom: 1px solid var(--border); vertical-align: top; }
.signed { margin-top: 18px; }
.signed img { display:block; height:64px; width:auto; margin-bottom:2px; }
@media (prefers-color-scheme: dark) { .signed img { filter: invert(1); } }
.signed .who { font-weight:700; } .signed .role { font-size:14px; color: var(--muted); }
footer { margin-top: 32px; font-size: 13px; color: var(--muted); text-align: center; }
${options.css ?? ''}
</style>
</head>
<body><main>
<div class="brand">✦ Talino</div>
${body}
<footer>Made with Talino, the AI career coach for tech.</footer>
</main></body></html>`;
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}

export function notFoundPage(message: string): Response {
  const response = htmlPage('Not found · Talino', `<div class="card"><h2>Not found</h2><p class="muted">${escapeHtml(message)}</p></div>`, { noindex: true });
  return new Response(response.body, { status: 404, headers: response.headers });
}
