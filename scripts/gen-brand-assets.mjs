#!/usr/bin/env node
/**
 * One-shot generator for the static brand assets in public/ — §A.3 / §E.16 of the build spec:
 *
 *   public/og.png             1200x630, <= 200 kB   (D7: hand-made, no satori / edge route)
 *   public/apple-touch-icon.png  180x180, opaque
 *   public/icon-192.png / icon-512.png  manifest icons
 *   (public/favicon.ico is NOT generated — it is committed verbatim from the old site)
 *
 *   node scripts/gen-brand-assets.mjs      (or: pnpm gen:brand)
 *
 * Everything is composed as one SVG and rasterised with `sharp`. ImageMagick is not used
 * (not installed) and neither is any headless browser.
 *
 * TEXT IS CONVERTED TO OUTLINES. The card is set in Geist — the same family the site loads —
 * whose TTFs are pulled from Google Fonts and turned into `<path>` data by opentype.js. That
 * keeps
 * the OG card render deterministically (no fontconfig, no system-font substitution).
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
const WHITE = '#FFFFFF'; // the avatar ring, which is pure white on the site too
const INK = '#F7F4EC'; // --neutral-on-background-strong (softened off pure white)
const FAINT = '#797465'; // --neutral-solid-strong
const GREEN = '#01CF38'; // --brand-on-background-weak  role line / list markers

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

  return { d: `<path d="${parts.join('')}" fill="${o.fill ?? INK}"/>`, width: advance };
}

/* ── the mark: a rounded tile carrying a Geist 600 "S" ───────────────────────────────── */

/* ── the site icon is the AVATAR, not a monogram ─────────────────────────────────────────
 *
 * The pre-Astro site's favicon was a circular crop of the avatar with a white ring, and
 * that is the mark people recognise in a tab strip. An earlier pass replaced it with a
 * generated "S" tile purely because the original .ico held a single 16x16 frame — that
 * fixed the resolution and broke the identity. This restores the original mark and gives
 * it the resolutions it was missing, generated from the 800x800 source rather than
 * upscaled from 16px.
 *
 * No icon.svg: the mark is a photograph, so there is no honest vector form of it. The
 * <link rel="icon" type="image/svg+xml"> and the manifest's svg entry are dropped in
 * favour of real PNG sizes.
 */
const AVATAR = join(ROOT, 'src', 'assets', 'avatar.jpg');

/**
 * The icons crop tighter than the sidebar portrait does. At 16px the full frame
 * is mostly foliage and the face is a few pixels wide; 0.66 of the source, biased
 * up toward the head, is the tightest crop that still clears the hair. The page
 * avatar is unaffected — this crop exists only for the icons.
 */
const ICON_CROP = 0.66;
const ICON_BIAS = 0.3;

/** @returns {import('sharp').Sharp} the cropped source, ready to resize */
function avatarSource() {
  const SRC = 800; // avatar.jpg is 800x800
  const side = Math.round(SRC * ICON_CROP);
  return sharp(AVATAR).extract({
    left: Math.round((SRC - side) / 2),
    top: Math.round((SRC - side) * ICON_BIAS),
    width: side,
    height: side,
  });
}

/**
 * Circular avatar with a white ring, on transparency.
 * @param {number} size
 */
async function avatarIcon(size) {
  // 6% ring reads at 16px without swallowing the face, and matches the original.
  const ring = Math.max(1, Math.round(size * 0.06));
  const r = size / 2 - ring / 2;
  const circle = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`;
  const stroke = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${WHITE}" stroke-width="${ring}"/></svg>`;
  return avatarSource()
    .resize(size, size, { fit: 'cover' })
    .composite([
      { input: Buffer.from(circle), blend: 'dest-in' }, // knock out the corners
      { input: Buffer.from(stroke), blend: 'over' }, // then draw the ring on top
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

/* ── public/apple-touch-icon.png — 180x180, opaque, no transparency ──────────────────── */

// iOS masks the corners itself and renders an alpha channel as BLACK, so this one is a
// full-bleed square crop flattened onto the page colour — no circle, no transparency.
const TOUCH = 180;
const touchPng = await avatarSource()
  .resize(TOUCH, TOUCH, { fit: 'cover' })
  .flatten({ background: PAGE })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
await writeFile(join(PUBLIC, 'apple-touch-icon.png'), touchPng);
console.log(`apple-touch-icon.png  ${TOUCH}x${TOUCH}  ${(touchPng.length / 1024).toFixed(1)} kB`);

/* ── public/icon-192.png, icon-512.png — manifest / Android ──────────────────────────── */

for (const size of [192, 512]) {
  const png = await avatarIcon(size);
  await writeFile(join(PUBLIC, `icon-${size}.png`), png);
  console.log(`icon-${size}.png${' '.repeat(9 - String(size).length)}  ${size}x${size}  ${(png.length / 1024).toFixed(1)} kB`);
}

/* ── public/favicon.ico — NOT GENERATED ──────────────────────────────────────────────
 *
 * favicon.ico is committed verbatim from the pre-Astro site (main:src/app/favicon.ico),
 * byte-identical to what https://www.shafiqninaba.com/favicon.ico still serves. It is a
 * single 16x16 frame of a tight portrait crop with a thick white ring.
 *
 * It is deliberately NOT regenerated here. A grid search over crop / vertical bias / ring
 * width could not get closer than a mean error of 32/255 per channel against the real
 * frame, which means it is not a crop of avatar.jpg at all — it comes from a different,
 * tighter source photo that was never in this repo. Regenerating it would silently
 * substitute a different image, which is exactly the bug this replaced.
 *
 * If a high-resolution version of that original photo turns up, add it to src/assets and
 * this file can start emitting 32 and 48 frames too.
 */

/* ── public/og.png — 1200x630 ────────────────────────────────────────────────────────
 *
 * Matches the live page rather than inventing a card: the same #1A160D ground, the same
 * flickering dot-grid strip fading down from the top edge, the same Geist setting, the
 * same circular avatar. The old card's green radial wash is gone for the same reason it
 * is gone from the site.
 */

const W = 1200;
const H = 630;
const PAD = 96;

/* The dot grid, built as raw pixels rather than ~15 000 <rect>s. Deterministic: a seeded
   PRNG, so re-running the generator produces a byte-identical card. */
function gridPng(width, height) {
  const SQ = 2;
  const STEP = 4; // 2px square + 2px gap, exactly as Background.astro
  const MAX_ALPHA = 0.3;
  let seed = 0x5eed1e; // any fixed value; only needs to be stable
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  const buf = Buffer.alloc(width * height * 4, 0);
  for (let y = 0; y < height; y += STEP) {
    // Linear fade to transparent at the bottom edge — the CSS mask, in pixels.
    const fade = 1 - y / height;
    for (let x = 0; x < width; x += STEP) {
      const a = Math.round(rand() * MAX_ALPHA * fade * 255);
      if (!a) continue;
      for (let dy = 0; dy < SQ; dy++) {
        for (let dx = 0; dx < SQ; dx++) {
          const i = ((y + dy) * width + x + dx) * 4;
          buf[i] = 255;
          buf[i + 1] = 255;
          buf[i + 2] = 255;
          buf[i + 3] = a;
        }
      }
    }
  }
  return sharp(buf, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

const GRID_H = 220;
const gridBuf = await gridPng(W, GRID_H);

const eyebrow = outline('SHAFIQNINABA.COM', {
  weight: 600,
  size: 22,
  x: PAD + 92,
  y: 148,
  tracking: 3.4,
  fill: FAINT,
});

const name = outline('Shafiq Ninaba', { weight: 600, size: 112, x: PAD, y: 400, tracking: -2.4 });
const role = outline('AI Engineer', { weight: 300, size: 52, x: PAD, y: 476, fill: GREEN });

const AVATAR_DATA_URI =
  'data:image/jpeg;base64,' +
  (await avatarSource().resize(128, 128, { fit: 'cover' }).jpeg({ quality: 88 }).toBuffer()).toString(
    'base64'
  );

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="avatarClip">
      <circle cx="${PAD + 32}" cy="${104 + 32}" r="32"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="${PAGE}"/>

  <!-- avatar + wordmark, top-left. The avatar is embedded as a data: URI because
       librsvg (sharp's SVG backend) will not fetch external hrefs. -->
  <image x="${PAD}" y="${104}" width="64" height="64" href="${AVATAR_DATA_URI}"
         clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${PAD + 32}" cy="${104 + 32}" r="31" fill="none" stroke="${WHITE}" stroke-width="2"/>
  ${eyebrow.d}

  <!-- name / role -->
  ${name.d}
  ${role.d}
</svg>`;

// 8-bit palette quantisation leaves visible banding in the dot grid, and the budget is
// nowhere near tight, so keep full truecolour.
const og = await sharp(Buffer.from(ogSvg))
  .composite([{ input: gridBuf, top: 0, left: 0 }])
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
await writeFile(join(PUBLIC, 'og.png'), og);
const ogKb = og.length / 1024;
console.log(`og.png                ${W}x${H}  ${ogKb.toFixed(1)} kB`);
if (ogKb > 200) throw new Error(`og.png is ${ogKb.toFixed(1)} kB — the budget is 200 kB`);

/* ── sanity: every file exists and is non-empty ──────────────────────────────────────── */
for (const f of [
  'og.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'favicon.ico',
]) {
  const bytes = (await readFile(join(PUBLIC, f))).length;
  if (!bytes) throw new Error(`public/${f} is empty`);
}
console.log('\nAll brand assets written to public/.');
