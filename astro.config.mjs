// @ts-check
import { defineConfig, fontProviders, sharpImageService } from 'astro/config';

export default defineConfig({
  // Required for rel=canonical, og:url, the sitemap endpoint and absolute JSON-LD IRIs.
  // APEX, no www, no trailing slash. This is the single source of truth for the host.
  site: 'https://shafiqninaba.com',

  output: 'static',        // default in v7; 'hybrid' was REMOVED and now throws
  base: '/',
  trailingSlash: 'never',  // paired with vercel.json { "trailingSlash": false }
  compressHTML: 'jsx',     // v7 default (changed from `true` in v6)

  // 'where' => :where(.astro-XXXX) => ZERO added specificity, so tokens.css / base.css
  // are never accidentally out-specified by a component's scoped <style>.
  scopedStyleStrategy: 'where',

  build: {
    format: 'directory',        // dist/index.html — the only page
    assets: '_astro',           // Vercel's Astro preset hard-codes immutable caching for this path
    inlineStylesheets: 'always' // single page: inline ALL CSS, zero render-blocking CSS requests
  },

  // prefetch intentionally UNSET. `prefetch: true` injects ~2.3 kB gzip on every page and,
  // without <ClientRouter/>, only acts on links carrying data-astro-prefetch. Dead weight.

  devToolbar: { enabled: false },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      // 300 = role subtitle (display-default-xs)
      // 400 = all body / heading-default
      // 600 = h1, h2, heading-strong-l
      weights: [300, 400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      optimizedFallbacks: true // metric-matched @font-face => no swap-induced CLS
    }
  ],

  image: {
    service: sharpImageService({
      jpeg: { quality: 82, mozjpeg: true },
      png: { compressionLevel: 9 },
      webp: { effort: 5 },
      avif: { effort: 5 }
    }),
    layout: 'constrained',
    objectFit: 'cover',
    objectPosition: 'center',
    // MUST be true — with layout alone Astro emits srcset/sizes but injects NO sizing CSS.
    responsiveStyles: true
  },

  vite: {
    build: {
      assetsInlineLimit: 4096,
      cssMinify: 'lightningcss'
    }
  }
});
