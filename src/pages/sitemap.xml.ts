import type { APIRoute } from 'astro';
// @ts-ignore - `@types/node` is not a dependency of this project; this module is
// resolved by Vite at build time only (the route is prerendered, never shipped).
// Safe to delete this directive if `@types/node` is ever added to devDependencies.
import { execSync } from 'node:child_process';

// Emitted as a static dist/sitemap.xml — the exact URL already in Search Console.
export const prerender = true;

const SITE = 'https://shafiqninaba.com';
const PUBLIC_PAGES = ['/'];

function lastCommitISO(): string {
  try {
    return execSync('git log -1 --format=%cI', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString(); // shallow clone / no git — degrade gracefully
  }
}

const LASTMOD = lastCommitISO();

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_PAGES.map(
  (path) => `  <url>
    <loc>${SITE}${path === '/' ? '/' : path}</loc>
    <lastmod>${LASTMOD}</lastmod>
  </url>`
).join('\n')}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
