#!/usr/bin/env node
/**
 * One-shot source-image preparation — §I.4 of the build spec.
 *
 * Astro's <Image /> pipeline cannot rescue a 23.8 MB source: it still has to decode it on
 * every cold build. Re-encode ONCE here, commit the results to src/assets/, then delete
 * public/images/ (files in public/ bypass sharp entirely).
 *
 * The spec originally called for ImageMagick 7 (`magick`). ImageMagick is not installed in
 * this environment, so this is the same operation expressed with the `sharp` npm package,
 * which is already a dependency (Astro's image service uses it).
 *
 * These are SOURCES, not deliverables — Astro re-encodes them into responsive
 * webp/avif/jpeg at build time. Encode at quality 90 so that re-encode starts from a clean
 * image; do NOT over-compress here.
 *
 *   node scripts/optimize-source-images.mjs        (or: pnpm opt:images)
 *
 * Notable source facts, verified with file(1):
 *   avatar.jpg            is actually PNG,      800x800    1,485,882 B
 *   transend-portrait.jpg is actually PNG RGBA, 4552x2561 23,809,956 B
 *   transend-climb.jpg    JPEG,                 6554x3687  1,897,226 B
 *   aiap_3.jpg            JPEG with EXIF orientation,      4032x3024
 *   aiap_2.jpg            JPEG with EXIF,       1572x1184
 *   aiap_1.jpg            JPEG,                 1280x853
 *   aiap_cert.png         PNG RGBA,             1486x1048
 */

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'images');
const OUT = join(ROOT, 'src', 'assets');

/** Page background — used to flatten the RGBA PNG that is really an opaque photo. */
const PAGE_BACKGROUND = '#0D0A00';

/** High-quality intermediate. Astro does the real compression at build time. */
const JPEG = { quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' };
const PNG = { compressionLevel: 9, effort: 10 };

/** @type {{from: string, to: string, max: number, format: 'jpeg'|'png', flatten?: boolean}[]} */
const JOBS = [
  // Avatar: already 800x800; just re-encode the mislabelled PNG as a real JPEG.
  { from: 'avatar.jpg', to: 'avatar.jpg', max: 800, format: 'jpeg' },

  // AIAP: cap at 1600 px on the long edge.
  { from: 'projects/aiap/aiap_1.jpg', to: 'aiap/aiap-1.jpg', max: 1600, format: 'jpeg' },
  { from: 'projects/aiap/aiap_2.jpg', to: 'aiap/aiap-2.jpg', max: 1600, format: 'jpeg' },
  { from: 'projects/aiap/aiap_3.jpg', to: 'aiap/aiap-3.jpg', max: 1600, format: 'jpeg' },
  // The certificate is line-art-ish with transparency — keep it PNG.
  { from: 'projects/aiap/aiap_cert.png', to: 'aiap/aiap-cert.png', max: 1600, format: 'png' },

  // Hobbies: cap at 1600 px on the long edge; the "portrait" file is a 23.8 MB RGBA PNG.
  { from: 'hobbies/transend-climb.jpg', to: 'hobbies/transend-climb.jpg', max: 1600, format: 'jpeg' },
  { from: 'hobbies/transend-portrait.jpg', to: 'hobbies/transend-portrait.jpg', max: 1600, format: 'jpeg', flatten: true },
];

async function dirSize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(full) : (await stat(full)).size;
  }
  return total;
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

const before = await dirSize(SRC);
console.log(`public/images  ->  ${mb(before)}\n`);

for (const job of JOBS) {
  const from = join(SRC, job.from);
  const to = join(OUT, job.to);
  await mkdir(dirname(to), { recursive: true });

  // .rotate() with no argument applies the EXIF orientation and then strips it, which is
  // what `magick -auto-orient` does. Metadata is dropped by default (sharp keeps none
  // unless asked), matching `-strip`.
  let pipeline = sharp(from, { failOn: 'error' })
    .rotate()
    .resize({ width: job.max, height: job.max, fit: 'inside', withoutEnlargement: true });

  if (job.flatten) pipeline = pipeline.flatten({ background: PAGE_BACKGROUND });

  const { data, info } = await (job.format === 'png' ? pipeline.png(PNG) : pipeline.jpeg(JPEG))
    .toBuffer({ resolveWithObject: true });

  await writeFile(to, data);

  const inBytes = (await stat(from)).size;
  console.log(
    `${job.from.padEnd(38)} ${kb(inBytes).padStart(9)}  ->  ` +
      `${job.to.padEnd(30)} ${String(info.width).padStart(5)}x${String(info.height).padEnd(5)} ${kb(data.length).padStart(9)}`
  );
}

const after = await dirSize(OUT);
console.log(`\nsrc/assets     ->  ${mb(after)}`);
console.log(`saved              ${mb(before - after)}  (${((1 - after / before) * 100).toFixed(1)}% smaller)`);
console.log('\nNext: delete public/images/ — files under public/ bypass sharp entirely.');
