import { CertificateSwatches as C } from '@/constants/theme';

import { cornerSvg, sealSvg } from './certificate-art';
import { SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from './signature';

/**
 * The certificate as a printable page (A4 landscape) for expo-print, in the same design as the app card (owner's request
 * 2026-11-15: a classic certificate of completion): two-tone corners, "Certificate of completion", the learner's name over
 * a rule, the course, then the date, the seal and the founder's signature on one line. No verification link or QR code
 * (owner, 2026-11-15). A print WebView has no app fonts, so it uses the system's.
 */
export function certificateHtml(input: { learnerName: string; courseTitle: string; issued: string; master: boolean }): string {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, "Helvetica Neue", Roboto, Arial, sans-serif; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 297mm; height: 210mm; overflow: hidden; background: ${C.paper}; text-align: center; }
.frame { position: absolute; inset: 9mm; border: .5mm solid ${C.rule}; }
.frame.inner { inset: 11mm; border-width: .25mm; }
.corner { position: absolute; width: 60mm; height: 60mm; }
.corner svg { display: block; width: 100%; height: 100%; }
.corner.tl { left: 0; top: 0; }
.corner.br { right: 0; bottom: 0; transform: rotate(180deg); }
.content { position: absolute; left: 50mm; right: 50mm; top: 21mm; }
.brand { font-size: 12pt; font-weight: 800; letter-spacing: .04em; } .brand span { color: ${C.amber}; }
.title { margin-top: 7mm; font-size: 46pt; line-height: 1; font-weight: 800; letter-spacing: .14em; color: ${C.violet}; }
.subtitle { margin-top: 3mm; font-size: 14pt; font-weight: 700; letter-spacing: .32em; }
.lead { margin-top: 9mm; font-size: 13pt; color: ${C.inkSoft}; }
.name { margin: 3mm auto 0; font-size: 38pt; line-height: 1.15; font-weight: 700; overflow-wrap: anywhere; }
.name.long { font-size: 30pt; }
.rule { width: 120mm; height: .6mm; margin: 3mm auto 0; background: linear-gradient(90deg, ${C.violetLight}, ${C.indigo}); }
.course { margin-top: 2mm; font-size: 20pt; line-height: 1.25; font-weight: 800; }
.detail { margin-top: 2mm; font-size: 11pt; color: ${C.inkSoft}; }
/* Top-aligned, so the date's line and the signature's line sit at the same height whatever is written under them. */
.sign-row { position: absolute; left: 40mm; right: 52mm; bottom: 17mm; display: flex; align-items: flex-start; justify-content: space-between; }
.column { width: 70mm; }
.value { font-size: 13pt; font-weight: 600; height: 16mm; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.5mm; }
.value img { height: 17mm; }
.line { border-top: .3mm solid ${C.inkSoft}; padding-top: 1.8mm; }
.who { font-size: 11pt; font-weight: 700; } .role { font-size: 9pt; color: ${C.inkSoft}; }
.seal { width: 30mm; height: 35mm; } .seal svg { display: block; width: 100%; height: 100%; }
</style></head><body><div class="page">
<div class="frame"></div><div class="frame inner"></div>
<div class="corner tl">${cornerSvg('tl')}</div><div class="corner br">${cornerSvg('br')}</div>
<div class="content">
<div class="brand"><span>✦</span> Talino</div>
<div class="title">CERTIFICATE</div>
<div class="subtitle">OF COMPLETION</div>
<div class="lead">This is to certify that</div>
<div class="name${input.learnerName.length > 24 ? ' long' : ''}">${escape(input.learnerName)}</div>
<div class="rule"></div>
<div class="lead">${input.master ? 'completed every Talino career course and earned' : 'has successfully completed'}</div>
<div class="course">${escape(input.courseTitle)}</div>
<div class="detail">with every lesson, quiz and project review done</div>
</div>
<div class="sign-row">
<div class="column"><div class="value">${escape(input.issued)}</div><div class="line"><div class="who">Date issued</div></div></div>
<div class="seal">${sealSvg('seal')}</div>
<div class="column"><div class="value"><img src="${SIGNATURE_DATA_URI}" alt=""></div><div class="line"><div class="who">${SIGNER_NAME}</div><div class="role">${SIGNER_TITLE}</div></div></div>
</div>
</div></body></html>`;
}
