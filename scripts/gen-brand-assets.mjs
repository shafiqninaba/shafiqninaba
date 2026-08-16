#!/usr/bin/env node
/**
 * One-shot generator for the static brand assets in public/ — §A.3 / §E.16 of the build spec:
 *
 *   public/og.png             1200x630, <= 200 kB   (D7: hand-made, no satori / edge route)
 *   public/icon.svg           monochrome mark, any size
 *   public/apple-touch-icon.png  180x180
 *   public/favicon.ico        32x32 + 16x16 frames
 *
 *   node scripts/gen-brand-assets.mjs      (or: pnpm gen:brand)
 *
 * Everything is composed as one SVG and rasterised with `sharp`. ImageMagick is not used
 * (not installed) and neither is any headless browser.
 *
 * TEXT IS CONVERTED TO OUTLINES. The card is set in Geist — the same family the site loads —
 * whose TTFs are pulled from Google Fonts and turned into `<path>` data by opentype.js. That
 * keeps rendering deterministic (no fontconfig, no system-font substitution) and lets
 * icon.svg ship a real glyph outline instead of a `<text>` element no favicon renderer would
 * resolve.
 *
 * Requires network access on the (rare) occasions it is re-run. The outputs are committed.
 */

import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

/* ── palette (src/styles/tokens.css) ─────────────────────────────────────────────────── */
const PAGE = '#1A160D'; // --page-background
const WHITE = '#FFFFFF'; // --neutral-on-background-strong
const MUTED = '#B7B2A4'; // --neutral-on-background-weak
const FAINT = '#797465'; // --neutral-solid-strong
const GREEN = '#01CF38'; // --brand-on-background-weak  role line / list markers
const HAIRLINE = 'rgba(153,148,134,0.302)'; // --neutral-alpha-medium

/* ── Geist, straight from the Google Fonts CSS API ───────────────────────────────────── */
const GEIST_CSS = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;600';

async function loadGeist() {
  const css = await (await fetch(GEIST_CSS, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
  const blocks = css.split('@font-face').slice(1);
  const dir = await mkdtemp(join(tmpdir(), 'geist-'));
  /** @type {Record<number, import('opentype.js').Font>} */
  const fonts = {};

  for (const block of blocks) {
    const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1]);
    const url = block.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!weight || !url) continue;
    const ttf = await (await fetch(url)).arrayBuffer();
    await writeFile(join(dir, `geist-${weight}.ttf`), Buffer.from(ttf));
    fonts[weight] = opentype.parse(ttf);
  }

  for (const w of [300, 400, 600]) {
    if (!fonts[w]) throw new Error(`Google Fonts did not return Geist ${w}`);
  }
  return fonts;
}

const GEIST = await loadGeist();

/**
 * Set a string as outlines.
 * @param {string} text
 * @param {{ weight?: 300|400|600, size: number, x: number, y: number,
 *           fill?: string, tracking?: number, anchor?: 'start'|'middle' }} o
 * @returns {{ d: string, width: number }} `d` is already positioned; `width` is the advance.
 */
function outline(text, o) {
  const font = GEIST[o.weight ?? 400];
  const tracking = o.tracking ?? 0; // extra letter-spacing, in px
  const scale = o.size / font.unitsPerEm;

  // opentype.js 2.x emits a literal "NaN" into the path data when a coordinate carries
  // binary-float noise (628.2400000000001 breaks; 628.24 is fine), which silently truncates
  // the glyph run at render time. Keep every pen position to 3 decimals.
  const round = (n) => Math.round(n * 1e3) / 1e3;

  // Measure first so 'middle' can be honoured, then lay the glyphs out one at a time so the
  // tracking is applied between them (opentype.js has no letter-spacing option).
  const glyphs = font.stringToGlyphs(text);
  const step = (i) =>
    glyphs[i].advanceWidth * scale +
    (i < glyphs.length - 1 ? font.getKerningValue(glyphs[i], glyphs[i + 1]) * scale + tracking : 0);

  // Measure first so 'middle' can be honoured.
  const advance = round(glyphs.reduce((sum, _, i) => sum + step(i), 0));

  let pen = round(o.anchor === 'middle' ? o.x - advance / 2 : o.x);
  const parts = glyphs.map((g, i) => {
    const d = g.getPath(pen, round(o.y), o.size).toPathData(3);
    pen = round(pen + step(i));
    return d;
  });

  return { d: `<path d="${parts.join('')}" fill="${o.fill ?? WHITE}"/>`, width: advance };
}

/* ── the mark: a rounded tile carrying a Geist 600 "S" ───────────────────────────────── */

/**
 * @param {number} size box size
 * @param {{ tile: string, glyph: string }} colors
 */
function mark(size, colors) {
  const r = size * 0.225; // squircle-ish corner, matches --radius-l at this scale
  const glyphSize = size * 0.62;
  // Optical centring: cap-height is ~0.7em in Geist, so the baseline sits below the middle.
  const baseline = size / 2 + glyphSize * 0.355;
  const s = outline('S', {
    weight: 600,
    size: glyphSize,
    x: size / 2,
    y: baseline,
    anchor: 'middle',
    fill: colors.glyph,
  });
  return `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${colors.tile}"/>${s.d}`;
}

/* ── public/icon.svg — monochrome, scalable ──────────────────────────────────────────── */

const ICON_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Shafiq Ninaba">` +
  `<title>Shafiq Ninaba</title>` +
  mark(64, { tile: GREEN, glyph: PAGE }) +
  `</svg>\n`;

await writeFile(join(PUBLIC, 'icon.svg'), ICON_SVG);
console.log('icon.svg              64x64 vector');

/* ── public/apple-touch-icon.png — 180x180, opaque, no transparency ──────────────────── */

// iOS masks the corners itself, so the tile bleeds to the edges and the glyph is inset.
const TOUCH = 180;
const touchSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${TOUCH}" height="${TOUCH}" viewBox="0 0 ${TOUCH} ${TOUCH}">` +
  `<rect width="${TOUCH}" height="${TOUCH}" fill="${GREEN}"/>` +
  outline('S', {
    weight: 600,
    size: TOUCH * 0.6,
    x: TOUCH / 2,
    y: TOUCH / 2 + TOUCH * 0.6 * 0.355,
    anchor: 'middle',
    fill: PAGE,
  }).d +
  `</svg>`;

// iOS renders an alpha channel as black, so ship it opaque.
const touchPng = await sharp(Buffer.from(touchSvg))
  .flatten({ background: GREEN })
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(join(PUBLIC, 'apple-touch-icon.png'), touchPng);
console.log(`apple-touch-icon.png  ${TOUCH}x${TOUCH}  ${(touchPng.length / 1024).toFixed(1)} kB`);

/* ── public/favicon.ico — 32x32 primary + 16x16 frame, both PNG-compressed ───────────── */

const icoFrames = await Promise.all(
  [32, 16].map(async (size) => ({
    size,
    png: await sharp(Buffer.from(ICON_SVG)).resize(size, size).png({ compressionLevel: 9 }).toBuffer(),
  }))
);

/**
 * Minimal ICO container. Each frame is stored as a whole PNG, which every browser in use
 * since IE11 accepts and which keeps a 32x32 icon under 1 kB.
 */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const entries = frames.map((f) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(f.size === 256 ? 0 : f.size, 0); // width  (0 means 256)
    e.writeUInt8(f.size === 256 ? 0 : f.size, 1); // height
    e.writeUInt8(0, 2); // palette size — 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(f.png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += f.png.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...frames.map((f) => f.png)]);
}

const ico = buildIco(icoFrames);
await writeFile(join(PUBLIC, 'favicon.ico'), ico);
console.log(`favicon.ico           32x32 + 16x16  ${(ico.length / 1024).toFixed(1)} kB`);

/* ── public/og.png — 1200x630 ────────────────────────────────────────────────────────── */

const W = 1200;
const H = 630;
const PAD = 96;

const eyebrow = outline('SHAFIQNINABA.COM', {
  weight: 600,
  size: 22,
  x: PAD + 92,
  y: 148,
  tracking: 3.4,
  fill: FAINT,
});

const name = outline('Shafiq Ninaba', { weight: 600, size: 112, x: PAD, y: 380, tracking: -2.4 });
const role = outline('AI Engineer', { weight: 300, size: 52, x: PAD, y: 462, fill: GREEN });
const place = outline('Singapore', { weight: 400, size: 28, x: PAD, y: 534, fill: MUTED });

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.12" cy="0.06" r="0.85">
      <stop offset="0%"  stop-color="#01CF38" stop-opacity="0.20"/>
      <stop offset="45%" stop-color="#01CF38" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#01CF38" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#01CF38" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#01CF38" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${PAGE}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- top hairline + brand accent, echoing the site header border -->
  <rect x="0" y="0" width="${W}" height="4" fill="${PAGE}"/>
  <rect x="0" y="0" width="${W}" height="4" fill="url(#rule)"/>

  <!-- mark + wordmark, top-left -->
  <g transform="translate(${PAD}, ${104})">${mark(64, { tile: GREEN, glyph: PAGE })}</g>
  ${eyebrow.d}

  <!-- name / role -->
  ${name.d}
  ${role.d}

  <!-- footer rule + locality -->
  <rect x="${PAD}" y="${498}" width="${W - PAD * 2}" height="1" fill="${HAIRLINE}"/>
  ${place.d}
</svg>`;

// 8-bit palette quantisation leaves visible concentric banding in the radial glow, and the
// budget is nowhere near tight (~30 kB of 200 kB), so keep full truecolour.
const og = await sharp(Buffer.from(ogSvg))
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

await writeFile(join(PUBLIC, 'og.png'), og);
const ogKb = og.length / 1024;
console.log(`og.png                ${W}x${H}  ${ogKb.toFixed(1)} kB`);
if (ogKb > 200) throw new Error(`og.png is ${ogKb.toFixed(1)} kB — the budget is 200 kB`);

/* ── sanity: every file exists and is non-empty ──────────────────────────────────────── */
for (const f of ['og.png', 'icon.svg', 'apple-touch-icon.png', 'favicon.ico']) {
  const bytes = (await readFile(join(PUBLIC, f))).length;
  if (!bytes) throw new Error(`public/${f} is empty`);
}
console.log('\nAll brand assets written to public/.');
