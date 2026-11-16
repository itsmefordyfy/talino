import { MasteryCertificateSwatches as M } from '@/constants/theme';

import { masterySealSvg } from './certificate-art';
import { JOURNEY_CERTIFICATE_LEVELS, JOURNEY_CERTIFICATE_PROGRAM, JOURNEY_LEVEL_NAMES } from './journey-certificate';
import { SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from './signature';

/**
 * The AI Expert certificate as a printable page (A4 landscape) for expo-print, in the same design as its app card: night indigo
 * with a gold double frame, "CERTIFICATE OF MASTERY / AI EXPERT", the name over a gold rule, the journey, the four levels as gold
 * medallions, then the date, the gold seal and the founder's signature (inverted to ivory). A print WebView has no app fonts.
 */
export function journeyCertificateHtml(input: { learnerName: string; issued: string }): string {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const medals = JOURNEY_CERTIFICATE_LEVELS.map((level) => `<div class="level"><div class="medal">✓</div><div class="level-name">${JOURNEY_LEVEL_NAMES[level]}</div></div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, "Helvetica Neue", Roboto, Arial, sans-serif; color: ${M.ivory}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 297mm; height: 210mm; overflow: hidden; background: radial-gradient(ellipse at 50% 35%, ${M.night} 0%, ${M.nightDeep} 75%); text-align: center; }
.frame { position: absolute; inset: 9mm; border: .7mm solid ${M.gold}; }
.frame.inner { inset: 11.5mm; border-width: .25mm; border-color: ${M.goldLight}; }
.star { position: absolute; color: ${M.gold}; font-size: 14pt; }
.star.tl { left: 15mm; top: 14mm; } .star.tr { right: 15mm; top: 14mm; } .star.bl { left: 15mm; bottom: 14mm; } .star.br { right: 15mm; bottom: 14mm; }
.content { position: absolute; left: 40mm; right: 40mm; top: 17mm; }
.brand { font-size: 12pt; font-weight: 800; letter-spacing: .04em; } .brand span { color: ${M.gold}; }
.eyebrow { margin-top: 5mm; font-size: 12pt; font-weight: 700; letter-spacing: .4em; color: ${M.gold}; }
.title { margin-top: 2mm; font-size: 48pt; line-height: 1; font-weight: 800; letter-spacing: .16em; color: ${M.ivory}; }
.lead { margin-top: 6mm; font-size: 12pt; color: ${M.ivorySoft}; }
.name { margin: 2mm auto 0; font-size: 34pt; line-height: 1.15; font-weight: 700; overflow-wrap: anywhere; }
.name.long { font-size: 27pt; }
.rule { width: 120mm; height: .6mm; margin: 3mm auto 0; background: linear-gradient(90deg, ${M.goldDeep}, ${M.goldLight}, ${M.goldDeep}); }
.program { margin-top: 1mm; font-size: 19pt; font-weight: 800; color: ${M.gold}; }
.levels { display: flex; justify-content: center; gap: 14mm; margin-top: 5mm; }
.level { width: 26mm; } .medal { width: 10mm; height: 10mm; margin: 0 auto; border-radius: 50%; background: ${M.gold}; border: .6mm solid ${M.goldLight}; color: ${M.nightDeep}; font-weight: 800; font-size: 13pt; line-height: 8.8mm; }
.level-name { margin-top: 1.5mm; font-size: 10pt; font-weight: 700; }
.detail { margin-top: 3mm; font-size: 10pt; color: ${M.ivorySoft}; }
/* Top-aligned, so the date's line and the signature's line sit at the same height whatever is written under them. */
.sign-row { position: absolute; left: 40mm; right: 40mm; bottom: 16mm; display: flex; align-items: flex-start; justify-content: space-between; }
.column { width: 70mm; }
.value { font-size: 13pt; font-weight: 600; height: 16mm; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.5mm; }
.value img { height: 17mm; filter: brightness(0) invert(1); }
.line { border-top: .3mm solid ${M.gold}; padding-top: 1.8mm; }
.who { font-size: 11pt; font-weight: 700; } .role { font-size: 9pt; color: ${M.ivorySoft}; }
.seal { width: 34mm; height: 39mm; } .seal svg { display: block; width: 100%; height: 100%; }
</style></head><body><div class="page">
<div class="frame"></div><div class="frame inner"></div>
<div class="star tl">✦</div><div class="star tr">✦</div><div class="star bl">✦</div><div class="star br">✦</div>
<div class="content">
<div class="brand"><span>✦</span> Talino</div>
<div class="eyebrow">CERTIFICATE OF MASTERY</div>
<div class="title">AI EXPERT</div>
<div class="lead">This is to certify that</div>
<div class="name${input.learnerName.length > 24 ? ' long' : ''}">${escape(input.learnerName)}</div>
<div class="rule"></div>
<div class="lead">has completed every level of the</div>
<div class="program">${JOURNEY_CERTIFICATE_PROGRAM}</div>
<div class="levels">${medals}</div>
<div class="detail">Beginner to Expert: every course, quiz and hands-on project</div>
</div>
<div class="sign-row">
<div class="column"><div class="value">${escape(input.issued)}</div><div class="line"><div class="who">Date issued</div></div></div>
<div class="seal">${masterySealSvg('seal')}</div>
<div class="column"><div class="value"><img src="${SIGNATURE_DATA_URI}" alt=""></div><div class="line"><div class="who">${SIGNER_NAME}</div><div class="role">${SIGNER_TITLE}</div></div></div>
</div>
</div></body></html>`;
}
