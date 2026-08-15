# shafiqninaba.com

Personal site of **Shafiq Ninaba**, AI Engineer in Singapore.

A single static page built with [Astro](https://astro.build) 7, deployed on Vercel.
Dark theme only. Total client-side JavaScript is one inlined module (~430 B gzip)
covering the table-of-contents scroll-spy and the image lightbox — everything else
(marquee, background, fades, hover states) is pure CSS.

## Stack

| Concern | Choice |
|---|---|
| Framework | `astro@7` — `output: 'static'`, no adapter, no UI framework integrations |
| Styling | Hand-written CSS custom properties in `src/styles/`, dark palette only |
| Fonts | Astro Fonts API, Geist 300/400/600 via the Google provider, `display: swap` |
| Images | Build-time `sharp` (`_astro/` hashed output). Vercel Image Optimization is **off**. |
| Icons | 17 tech logos inlined as `<path d>` data, generated from `simple-icons` |
| Sitemap | Hand-rolled `src/pages/sitemap.xml.ts` (keeps the `/sitemap.xml` URL) |
| Redirects/headers | `vercel.json` only — never `astro.config.mjs` (it emits meta-refresh, not 301) |

## Requirements

Node 22.12+ (see `.nvmrc`), pnpm.

## Commands

```bash
pnpm install
pnpm dev              # local dev server at http://localhost:4321
pnpm build            # static build to dist/
pnpm preview          # serve dist/
pnpm check            # astro check (TypeScript + template diagnostics)
pnpm verify:nojs      # count JS files emitted into dist/ — expected: 0
```

## One-shot maintenance scripts

These are not part of the build. They were run once and their output is committed.

```bash
pnpm gen:logos        # scripts/gen-logo-paths.mjs  -> src/data/logo-paths.ts
pnpm opt:images       # scripts/optimize-source-images.mjs (public/images -> src/assets)
pnpm gen:brand        # scripts/gen-brand-assets.mjs -> public/{og.png,icon.svg,apple-touch-icon.png,favicon.ico}
```

## Layout

```
public/          # copied verbatim, never passed through sharp
src/assets/      # image sources, optimized at build time by <Image />
src/data/        # site constants, page content, generated logo paths
src/styles/      # tokens.css, base.css, layout.css
src/components/  # .astro components
src/layouts/     # BaseLayout.astro
src/pages/       # index.astro, sitemap.xml.ts
scripts/         # one-shot generators (see above)
```

## Deployment

Vercel, framework preset **Astro**, build `astro build`, output `dist`. The apex
`shafiqninaba.com` is canonical; `www` 308-redirects to it. Do not enable Vercel
Image Optimization — all image work happens at build time.

## Licence

[MIT](./LICENSE)
