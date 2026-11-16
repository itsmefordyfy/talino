import { CertificateSwatches as C, MasteryCertificateSwatches } from '@/constants/theme';

/**
 * The certificate's drawn art, as SVG markup: the seal (a scalloped rosette carrying the app icon's two sparks, with
 * ribbons) and the two-tone corner. One source for the app card (react-native-svg's `SvgXml`) and the PDF (inline SVG in
 * the print WebView), so the two always look the same. `id` prefixes every gradient id, because two copies on one HTML
 * page would otherwise share them.
 */

const round = (value: number) => Math.round(value * 100) / 100;
const point = (cx: number, cy: number, radius: number, angle: number) => `${round(cx + radius * Math.cos(angle))},${round(cy + radius * Math.sin(angle))}`;

/** A closed scalloped circle: `bumps` petals whose edge swings `depth` either side of `radius`. */
export function rosettePath(cx: number, cy: number, radius: number, bumps: number, depth: number): string {
  const step = (Math.PI * 2) / bumps;
  const start = -Math.PI / 2;
  let path = `M${point(cx, cy, radius - depth, start)}`;
  for (let i = 0; i < bumps; i++) {
    const from = start + i * step;
    path += ` Q${point(cx, cy, radius + depth, from + step / 2)} ${point(cx, cy, radius - depth, from + step)}`;
  }
  return `${path} Z`;
}

/** A four-point spark centred on (cx, cy), the shape in the app icon. */
function sparkPath(cx: number, cy: number, radius: number): string {
  const waist = radius * 0.22;
  const points = [
    [cx, cy - radius],
    [cx + waist, cy - waist],
    [cx + radius, cy],
    [cx + waist, cy + waist],
    [cx, cy + radius],
    [cx - waist, cy + waist],
    [cx - radius, cy],
    [cx - waist, cy - waist],
  ];
  return `M${points.map(([x, y]) => `${round(x)},${round(y)}`).join(' L')} Z`;
}

/** The seal, 120 x 140: ribbons behind a violet rosette with a white ring and the amber sparks. */
export function sealSvg(id: string): string {
  const fill = `${id}-seal`;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">',
    `<defs><linearGradient id="${fill}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.violetLight}"/><stop offset="1" stop-color="${C.indigo}"/></linearGradient></defs>`,
    `<path d="M47 84 L30 134 L41 127 L49 138 L63 92 Z" fill="${C.deep}"/>`,
    `<path d="M73 84 L90 134 L79 127 L71 138 L57 92 Z" fill="${C.violet}"/>`,
    `<path d="${rosettePath(60, 58, 46, 22, 3.6)}" fill="url(#${fill})"/>`,
    `<circle cx="60" cy="58" r="35" fill="none" stroke="${C.paper}" stroke-width="1.6" stroke-opacity="0.9"/>`,
    `<circle cx="60" cy="58" r="31" fill="none" stroke="${C.paper}" stroke-width="0.8" stroke-opacity="0.5"/>`,
    `<path d="${sparkPath(56, 61, 17)}" fill="${C.amber}"/>`,
    `<path d="${sparkPath(73, 44, 6.5)}" fill="${C.amber}"/>`,
    '</svg>',
  ].join('');
}

/** The top-left corner, 100 x 100: a violet-to-indigo triangle on a deep band, with a thin amber line. Rotate it for the others. */
export function cornerSvg(id: string): string {
  const fill = `${id}-corner`;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">',
    `<defs><linearGradient id="${fill}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.violetLight}"/><stop offset="1" stop-color="${C.indigo}"/></linearGradient></defs>`,
    `<path d="M0 0 H92 L0 92 Z" fill="${C.deep}"/>`,
    `<path d="M0 0 H84 L0 84 Z" fill="url(#${fill})"/>`,
    `<path d="M98 0 L0 98" stroke="${C.amber}" stroke-width="1.4"/>`,
    '</svg>',
  ].join('');
}

/**
 * The AI Expert seal, 140 x 160: gold ribbons behind a gold rosette, a night-indigo medallion with a gold ring, the app's spark,
 * and four small stars around it for the four levels (Beginner to Expert). Shared by the app card and the PDF, like `sealSvg`.
 */
export function masterySealSvg(id: string): string {
  const M = MasteryCertificateSwatches;
  const gold = `${id}-gold`;
  const night = `${id}-night`;
  const stars = [-135, -45, 45, 135].map((degrees) => {
    const angle = (degrees * Math.PI) / 180;
    return `<path d="${sparkPath(70 + 25 * Math.cos(angle), 66 + 25 * Math.sin(angle), 4.2)}" fill="${M.goldLight}"/>`;
  });
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160">',
    `<defs><linearGradient id="${gold}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${M.goldLight}"/><stop offset="0.55" stop-color="${M.gold}"/><stop offset="1" stop-color="${M.goldDeep}"/></linearGradient>`,
    `<radialGradient id="${night}" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stop-color="${M.violet}"/><stop offset="1" stop-color="${M.nightDeep}"/></radialGradient></defs>`,
    `<path d="M54 98 L34 154 L47 146 L56 159 L73 106 Z" fill="${M.goldDeep}"/>`,
    `<path d="M86 98 L106 154 L93 146 L84 159 L67 106 Z" fill="${M.gold}"/>`,
    `<path d="${rosettePath(70, 66, 54, 28, 3.4)}" fill="url(#${gold})"/>`,
    `<circle cx="70" cy="66" r="43" fill="url(#${night})"/>`,
    `<circle cx="70" cy="66" r="43" fill="none" stroke="${M.goldLight}" stroke-width="2"/>`,
    `<circle cx="70" cy="66" r="38" fill="none" stroke="${M.gold}" stroke-width="0.8" stroke-opacity="0.7"/>`,
    ...stars,
    `<path d="${sparkPath(70, 66, 15)}" fill="${M.goldLight}"/>`,
    '</svg>',
  ].join('');
}
