/*
 * Builders for the Talino store artwork. Every size is in rem (1% of the canvas width). Screens are
 * real simulator captures (read from `captures/<set>/<id>.png`, or the folder in the `cap` query
 * parameter), drawn inside a CSS device frame at their own aspect ratio: never redrawn, never
 * stretched. A missing capture makes `device()` resolve to null so a layout can omit it.
 */
const PARAMS = new URLSearchParams(location.search);
const CAP = PARAMS.get('cap') ?? '../captures';

function el(tag, className, style = {}, html = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.assign(node.style, style);
  if (html) node.innerHTML = html;
  document.body.appendChild(node);
  return node;
}

const capUrl = (set, id) => `${CAP}/${set}/${id}.png`;

/** The pixel size of an image, or null when it can't be loaded. */
function imageSize(url) {
  return new Promise((done) => {
    const img = new Image();
    img.onload = () => done({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => done(null);
    img.src = url;
  });
}

/**
 * Frame proportions as fractions of the device's outer SHORT side: bezel, outer corner radius and
 * screen corner radius. Phone: Dynamic Island iPhone (the island is drawn). iPad: thin even bezel,
 * no island. Duo: the inner display, slim bezel, no island.
 */
const FRAMES = {
  phone: { pad: 0.033, outerR: 0.155, screenR: 0.125, island: true },
  ipad: { pad: 0.026, outerR: 0.062, screenR: 0.036 },
  duo: { pad: 0.018, outerR: 0.07, screenR: 0.052 },
};

/**
 * A device showing a capture, fitted inside the box (x, y, w, h) rem and centered horizontally in
 * it; `valign` is 'top' | 'center' | 'bottom'. Portrait or landscape follows the capture's own
 * size. Resolves to { node, left, top, w, h } (rem), or null when the capture is missing.
 */
async function device(kind, url, { x, y, w, h, valign = 'center', rotate = 0, z = 1 }) {
  const size = await imageSize(url);
  if (!size) return null;
  const frame = FRAMES[kind];
  const ar = size.w / size.h;
  const p = frame.pad;
  const wf = ar < 1 ? 1 : (1 - 2 * p) * ar + 2 * p; // outer width over the short side
  const hf = ar < 1 ? (1 - 2 * p) / ar + 2 * p : 1; // outer height over the short side
  const ds = Math.min(w / wf, h / hf);
  const ow = ds * wf;
  const oh = ds * hf;
  const left = x + (w - ow) / 2;
  const top = valign === 'top' ? y : valign === 'bottom' ? y + h - oh : y + (h - oh) / 2;
  const node = el('div', 'device', { left: `${left}rem`, top: `${top}rem`, width: `${ow}rem`, height: `${oh}rem`, borderRadius: `${ds * frame.outerR}rem`, zIndex: z, transform: rotate ? `rotate(${rotate}deg)` : '' });
  node.style.setProperty('--ds', `${ds}rem`);
  const screen = document.createElement('div');
  screen.className = 'screen';
  Object.assign(screen.style, { left: `${p * ds}rem`, top: `${p * ds}rem`, width: `${ow - 2 * p * ds}rem`, height: `${oh - 2 * p * ds}rem`, borderRadius: `${ds * frame.screenR}rem` });
  screen.innerHTML = `<img src="${url}" alt="">`;
  node.appendChild(screen);
  if (frame.island && ar < 1) {
    const island = document.createElement('div');
    island.className = 'island';
    Object.assign(island.style, { top: `${ds * 0.058}rem`, width: `${ds * 0.27}rem`, height: `${ds * 0.08}rem` });
    node.appendChild(island);
  }
  return { node, left, top, w: ow, h: oh };
}

// Tali's drawings (../art), cropped to the figure: pixel size of each. Never drawn larger than 1×.
const TALI_PX = { happy: [819, 646], explaining: [855, 589], celebrating: [790, 566], thinking: [806, 640], coding: [827, 588], confident: [838, 589], learning: [813, 588], proud: [816, 583] };

/**
 * Tali, `height` rem tall at most (capped at the art's own pixel height on this canvas), with the
 * bottom edge at `bottom` rem and the left edge at `x` (or centered on `cx`). Returns { left, top, w, h }.
 */
function tali(pose, { x, cx, bottom, height, flip = false, z = 6 }) {
  const [pw, ph] = TALI_PX[pose];
  const h = Math.min(height, (ph * 100) / window.innerWidth);
  const w = (h * pw) / ph;
  const left = cx !== undefined ? cx - w / 2 : x;
  const node = el('img', 'tali', { left: `${left}rem`, top: `${bottom - h}rem`, height: `${h}rem`, width: `${w}rem`, zIndex: z, transform: flip ? 'scaleX(-1)' : '' });
  node.src = `../art/tali-${pose}.webp`;
  return { left, top: bottom - h, w, h };
}

/** The app icon and the name beside it, in a row `width` rem wide starting at x (left) or centered. */
function brand({ x, y, width, align = 'center', size, wordSize, z = 6 }) {
  const row = el('div', 'abs', { left: `${x}rem`, top: `${y}rem`, width: `${width}rem`, display: 'flex', alignItems: 'center', gap: `${size * 0.28}rem`, justifyContent: align === 'center' ? 'center' : 'flex-start', zIndex: z });
  row.innerHTML = `<img src="../art/talino-icon.png" alt="" style="width:${size}rem;height:${size}rem;border-radius:22.37%;box-shadow:0 0 0 ${size * 0.02}rem rgba(255,255,255,.4),0 ${size * 0.08}rem ${size * 0.22}rem rgba(28,14,110,.4)"><span style="font-weight:800;letter-spacing:-0.02em;font-size:${wordSize}rem;line-height:1">Talino</span>`;
  return row;
}

function glow(x, y, size, mint = false) {
  return el('div', mint ? 'glow mint' : 'glow', { left: `${x - size / 2}rem`, top: `${y - size / 2}rem`, width: `${size}rem`, height: `${size}rem` });
}

const SPARK_COLORS = ['var(--amber)', '#ffffff', 'var(--mint)', 'var(--amber)'];
/** Sparks as [x, y, size, rotation]: the four-point star of the icon, in amber, white and mint. */
function sparks(pieces, opacity = 0.9) {
  pieces.forEach(([x, y, size, rot], index) => {
    el('div', 'spark', { left: `${x}rem`, top: `${y}rem`, width: `${size}rem`, height: `${size}rem`, background: SPARK_COLORS[index % SPARK_COLORS.length], transform: `rotate(${rot}deg)`, opacity, zIndex: 0 });
  });
}

/** A block of text: headline, then a supporting line, left- or center-aligned. */
function text({ x, y, width, align = 'center', headline, headlineSize, support, supportSize, gap = 2, z = 4 }) {
  const node = el('div', 'abs', { left: `${x}rem`, top: `${y}rem`, width: `${width}rem`, textAlign: align, zIndex: z });
  node.innerHTML =
    `<h1 class="headline" style="font-size:${headlineSize}rem">${headline}</h1>` +
    (support ? `<p class="support" style="font-size:${supportSize}rem;margin-top:${gap}rem">${support}</p>` : '');
  return node;
}

/** Where a node's bottom edge is, in rem. */
const bottomOf = (node) => node.getBoundingClientRect().bottom / (window.innerWidth / 100);

/** The canvas height in rem, from the window's aspect ratio. */
function canvasHeight() {
  return (window.innerHeight / window.innerWidth) * 100;
}

/** Loads the bundled weights before anything is measured. */
const loadFonts = () => Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 20px "Plus Jakarta Sans"`)));

/** Marks the page ready for the renderer once fonts and images have loaded. */
function ready() {
  const images = [...document.images].map((img) => (img.complete ? Promise.resolve() : new Promise((done) => { img.onload = done; img.onerror = done; })));
  return Promise.all([document.fonts.ready, ...images]).then(() => document.body.setAttribute('data-ready', '1'));
}
