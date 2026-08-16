/**
 * Generates src/data/logo-paths.ts — one 24x24 monochrome `d` per technical-skill
 * pill. Run with `pnpm gen:logos`. Build-time only; simple-icons never ships to
 * the browser.
 *
 * Marks simple-icons no longer ships: Amazon's, Microsoft's and OpenAI's brand
 * assets were all removed after trademark requests (verified absent in both v15
 * and the current latest — they are not coming back). Rather than invent
 * geometry, Azure and AWS are lifted verbatim from Material Design Icons
 * (`mdi:microsoft-azure`, `mdi:aws`), already authored on the same 24x24 grid.
 * MDI is under the Pictogrammers Free License (Apache-2.0 compatible).
 *
 * Langfuse has no simple-icons entry either; its mark comes from `thesvg:langfuse`
 * (MIT, via Iconify). Every pill now has a real mark — nothing is hand-traced.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as si from 'simple-icons';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'data', 'logo-paths.ts');

const FALLBACK_PATHS = {
  siMicrosoftazure:
    'M13.05 4.24L6.56 18.05L2 18l5.09-8.76zm.7 1.09L22 19.76H6.74l9.3-1.66l-4.87-5.79z',
  siAmazonwebservices:
    'M7.64 10.38c0 .25.02.45.07.62c.05.12.12.28.21.46c.04.04.05.1.05.15c0 .07-.04.13-.13.2l-.42.28c-.06.04-.12.06-.17.06c-.07 0-.13-.04-.2-.1c-.09-.1-.17-.2-.24-.31c-.06-.11-.13-.24-.2-.39c-.52.61-1.17.92-1.96.92c-.56 0-1-.16-1.33-.48c-.32-.32-.49-.75-.49-1.29c0-.55.2-1 .6-1.36c.41-.34.95-.52 1.63-.52c.23 0 .44.02.71.06c.23.03.5.08.76.14v-.48c0-.51-.1-.84-.31-1.07c-.22-.21-.57-.3-1.08-.3c-.24 0-.48.03-.72.08c-.25.06-.49.13-.72.23c-.11.04-.2.07-.23.08c-.05.02-.08.02-.11.02c-.09 0-.14-.06-.14-.2v-.33c0-.1.01-.18.05-.23q.045-.075.18-.12c.24-.14.51-.24.84-.32a4 4 0 0 1 1.04-.13q1.185 0 1.74.54c.37.36.55.91.55 1.64v2.15zm-2.7 1.02c.22 0 .44-.04.68-.12s.45-.23.63-.43c.11-.13.19-.27.25-.43c0-.16.05-.35.05-.58v-.27c-.2-.07-.4-.07-.62-.12a7 7 0 0 0-.62-.04c-.45 0-.77.09-.99.27s-.32.43-.32.76c0 .32.07.56.24.71c.16.17.39.25.7.25m5.34.71a.6.6 0 0 1-.28-.06c-.03-.05-.08-.14-.12-.26L8.32 6.65c-.04-.15-.06-.22-.06-.27c0-.11.05-.17.16-.17h.65c.13 0 .22.02.26.07c.06.04.1.13.14.26l1.11 4.4l1.04-4.4c.03-.13.07-.22.13-.26c.05-.04.14-.07.25-.07h.55c.12 0 .21.02.26.07c.05.04.1.13.13.26L14 11l1.14-4.46c.04-.13.09-.22.13-.26c.06-.04.14-.07.26-.07h.62c.11 0 .17.06.17.17c0 .03-.01.07-.02.12c0 0-.02.08-.04.15l-1.61 5.14c-.04.14-.08.21-.15.26c-.04.04-.13.07-.24.07h-.57c-.13 0-.19-.02-.27-.07a.45.45 0 0 1-.12-.26L12.27 7.5l-1.03 4.28q-.045.195-.12.27a.5.5 0 0 1-.27.06zm8.55.18c-.33 0-.7-.04-1.03-.12s-.59-.17-.76-.26a.5.5 0 0 1-.21-.19a.4.4 0 0 1-.04-.18v-.34c0-.14.05-.2.15-.2h.12c.04 0 .1.05.17.08c.22.1.47.18.73.23c.27.05.54.08.79.08c.42 0 .75-.07.97-.22c.23-.17.35-.36.35-.63c0-.19-.07-.34-.18-.47c-.12-.12-.35-.24-.67-.34l-.97-.3c-.48-.16-.84-.38-1.06-.68a1.58 1.58 0 0 1-.33-.97c0-.28.06-.52.18-.73c.12-.22.28-.4.46-.55c.22-.15.44-.26.71-.34q.39-.12.84-.12q.21 0 .45.03c.14.02.28.05.42.07c.14.04.26.07.38.11s.2.08.28.12c.09.05.16.1.2.16s.06.13.06.22v.32q0 .21-.15.21c-.05 0-.14-.03-.26-.08c-.37-.17-.8-.26-1.27-.26c-.38 0-.66.06-.89.19c-.2.12-.31.32-.31.59c0 .19.07.35.2.47c.13.13.38.25.73.37l.95.3c.48.14.82.36 1.03.64q.3.405.3.93c0 .28-.06.54-.17.77c-.12.22-.28.42-.5.58c-.19.17-.44.29-.72.38s-.62.13-.95.13m1.25 3.24C17.89 17.14 14.71 18 12 18c-3.85 0-7.3-1.42-9.91-3.77c-.21-.19-.02-.44.23-.29c2.82 1.63 6.29 2.62 9.89 2.62c2.43 0 5.1-.5 7.55-1.56c.37-.15.68.26.32.53M21 14.5c-.29-.37-1.86-.18-2.57-.1c-.21.03-.24-.16-.05-.3c1.25-.87 3.31-.6 3.54-.33c.24.3-.06 2.36-1.23 3.34c-.19.15-.36.07-.28-.11c.27-.68.86-2.16.59-2.5',
};

/**
 * Langfuse ships no simple-icons entry. This is `thesvg:langfuse` (MIT, via Iconify),
 * already monochrome on the same 24x24 grid. It is two subpaths under a wrapper with
 * `fill-rule="evenodd"`; merged into one `d` here, so that rule has to travel with it or
 * the counters fill in solid.
 */
const LANGFUSE_PATH =
  "M6.666 13.224c1.982.013 3.143.159 4.014.551a6 6 0 0 1 1.298.79l.425.36c1.002.819 2.202 1.276 3.52 1.027q.315-.06.613-.16a6.2 6.2 0 0 1 2.483.163l.317.094c.517.167.978.389 1.396.651l.234.155l-.155.187c-1.012 1.157-2.411 1.882-3.93 2l-.168.01c-1.42.072-2.677-.344-3.828-1.128l.02-.017l-.308-.223a9 9 0 0 1-.357-.274l-.191-.159l-.343-.178c-1.24-.623-2.3-.943-3.105-1.15l-.794-.194l-.223-.058l-.018.048l.016-.049l-.01-.003l-.016.053l.013-.053a3.7 3.7 0 0 1-.749-.302l-.262-.144l-.261-.163a2.4 2.4 0 0 1-.622-.578l-.11-.173l-.097-.188a2.4 2.4 0 0 1-.213-.74l-.009-.1l.22-.021l.187-.014c.156-.01.313-.016.49-.019h.523zm-5.438 1.27q.122.491.27.915l.09.25q.249.659.62 1.248l-1.53 1.007c-.03.022-.07 0-.07-.047V14.8l.004-.023l.015-.022l.6-.26zm21.07-4.012l.05.195l.039.174l.015.108q.04.394.047.803l-.002.399q-.016.595-.103 1.168l-.06.344a9.8 9.8 0 0 0-2.983-1.045l.03-.13q.07-.361.08-.734a2.4 2.4 0 0 0-.02-.418l-.006-.033a11.5 11.5 0 0 0 2.562-.7l.35-.13zM12.13 6.022c1.17-.927 2.718-1.558 4.585-1.391a6.3 6.3 0 0 1 2.65.856l.22.14c.364.244.71.556 1.041.926l.183.221l-.233.095l-.212.122a7 7 0 0 1-.654.314q-.22.083-.46.157a6.3 6.3 0 0 1-2.78.22c-.941-.238-1.958-.085-2.852.396c-.406.21-.785.487-1.121.822l-.332.35l-.182.18l-.384.351a6 6 0 0 1-1.052.675c-.828.41-1.986.517-4.017.43l-.636-.032l-.248-.017l-.098-.01l.112-.23q.203-.382.522-.74c.259-.288.537-.514.827-.69l.19-.101l.128-.064l.118-.053l.209-.082a12 12 0 0 0 1.587-.762c1.105-.612 2.1-1.35 2.751-1.97zm-11.473.29l.023.01l.27.229q.415.34.89.642l.352.212l-.145.215a6 6 0 0 0-.455.86l-.11.272a6 6 0 0 0-.175.54l-.056.223l-.628-.612a.06.06 0 0 1-.015-.039V6.366c0-.036.025-.057.05-.055z M7.62 5.05a6.3 6.3 0 0 1 3.226.898l.235.146l-.199.163a14.7 14.7 0 0 1-2.64 1.684l-.131.061l-.306.136l-.306.125a4.4 4.4 0 0 0-.65.294l-.127.069a4.26 4.26 0 0 0-2.149 3.406l-.01.21v.257l.027.541c0 .278.041.794.319 1.352l.09.168q.124.21.259.377c.196.257.423.466.667.636l.247.16c.409.26.912.495 1.42.625l.765.184c.348.085.647.165.958.26c.822.251 1.62.576 2.452 1.021l.162.136l-.156.12c-.677.503-2.277 1.475-4.438 1.282a6.3 6.3 0 0 1-2.654-.861a5.8 5.8 0 0 1-1.653-1.478l-.131-.202a7.6 7.6 0 0 1-1.124-2.815l-.07-.377l-.031.015a9.4 9.4 0 0 1-.03-2.903l.025.026l.096-.696q.045-.205.096-.4l.076-.27a6.2 6.2 0 0 1 .88-1.82l.286-.376C4.103 5.99 5.548 5.192 7.158 5.07l.167-.011l.296-.008zm7.85 8.03c.682-.044 1.446-.029 2.275.012l.42.022a9 9 0 0 1 .73.071a13 13 0 0 1 3.036 1.023l.444.222c.304.184.56.362.764.515l.237.184l.013.016l.005.022v2.491l-.003.017l-.004.01l-.021.018l-.027.005l-.01-.003l-.015-.01l-.148-.127a9 9 0 0 0-1.431-.987l-.236-.126l-.104-.077a7 7 0 0 0-2.269-1.074l-.25-.062a7 7 0 0 0-2.395-.118l-.157.021l-.2.062l-.178.045l-.183.04c-1.274.238-2.348-.363-2.988-.869l-.298-.248l.216-.165q.387-.281.813-.495c.506-.252 1.166-.384 1.964-.435m7.846-7.004a.05.05 0 0 1 .07.013l.008.027v3.057l-.006.024l-.017.018a11 11 0 0 1-1.864.912c-.262.09-.479.157-.733.223c-.514.135-1.058.258-1.526.347l-.317.057q-.427.051-.885.066l-.338.006c-1.792.002-3.149-.083-4.145-.462l-.208-.085a6 6 0 0 1-.726-.384l-.14-.09q.183-.177.36-.37l.157-.163q.242-.237.512-.425c.843-.566 1.851-.77 2.778-.535l.312.04a7 7 0 0 0 2.51-.202l.256-.074q.292-.091.556-.2l.487-.209q.34-.155.63-.326l.087-.035a10.8 10.8 0 0 0 2.182-1.23";

/**
 * [simple-icons export, pill label, vendor URL].
 * ORDER IS LOAD-BEARING — it is the render order of the pill list, grouped by
 * theme (language, ML, LLM tooling, serving, containers/IaC, cloud, CI, data).
 * It must stay in sync with SKILLS in src/data/content.ts.
 */
const LOGOS = [
  ['siPython', 'Python', 'https://www.python.org/'],
  ['siLinux', 'Linux', 'https://www.linux.org/'],
  ['siMlflow', 'MLflow', 'https://mlflow.org/'],
  ['siKedro', 'Kedro', 'https://kedro.org/'],
  ['siLangchain', 'LangChain', 'https://www.langchain.com/'],
  ['siLanggraph', 'LangGraph', 'https://www.langchain.com/langgraph'],
  [LANGFUSE_PATH, 'Langfuse', 'https://langfuse.com/', 'evenodd'],
  ['siPydantic', 'Pydantic', 'https://docs.pydantic.dev/'],
  ['siFastapi', 'FastAPI', 'https://fastapi.tiangolo.com/'],
  ['siReact', 'React', 'https://react.dev/'],
  ['siNextdotjs', 'Next.js', 'https://nextjs.org/'],
  ['siDocker', 'Docker', 'https://www.docker.com/'],
  ['siKubernetes', 'Kubernetes', 'https://kubernetes.io/'],
  ['siHelm', 'Helm', 'https://helm.sh/'],
  ['siArgo', 'ArgoCD', 'https://argo-cd.readthedocs.io/'],
  ['siTerraform', 'Terraform', 'https://www.terraform.io/'],
  ['siMicrosoftazure', 'Azure', 'https://azure.microsoft.com/'],
  ['siAmazonwebservices', 'AWS', 'https://aws.amazon.com/'],
  ['siGooglecloud', 'Google Cloud', 'https://cloud.google.com/'],
  ['siRailway', 'Railway', 'https://railway.com/'],
  ['siGitlab', 'GitLab CI/CD', 'https://docs.gitlab.com/ci/'],
  ['siGithubactions', 'GitHub Actions', 'https://github.com/features/actions'],
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/**
 * First tuple element is either a simple-icons export name (starts with "si") or a
 * literal `d` string for a mark no icon set ships.
 */
const rows = LOGOS.map(([keyOrPath, title, href, fillRule]) => {
  const isKey = typeof keyOrPath === 'string' && /^si[A-Z]/.test(keyOrPath);
  const path = isKey ? (si[keyOrPath]?.path ?? FALLBACK_PATHS[keyOrPath]) : keyOrPath;
  if (!path) throw new Error(`No path for "${keyOrPath}" (${title}) — add one to FALLBACK_PATHS`);

  const note = isKey && !si[keyOrPath] ? '  // MDI fallback — see FALLBACK_PATHS' : '';
  const rule = fillRule ? ` fillRule: "${esc(fillRule)}",` : '';
  return `  { title: "${esc(title)}", href: "${esc(href)}",${rule} path: "${esc(path)}" },${note}`;
});

writeFileSync(
  OUT,
  '// GENERATED by scripts/gen-logo-paths.mjs. Do not edit by hand — run `pnpm gen:logos`.\n' +
    '//\n' +
    '// Marks come from simple-icons, except:\n' +
    '//   Azure, AWS  — removed from simple-icons after trademark requests; taken verbatim\n' +
    '//                 from Material Design Icons (mdi:microsoft-azure, mdi:aws).\n' +
    '//   Langfuse    — never in simple-icons; `thesvg:langfuse` (MIT, via Iconify). Two\n' +
    '//                 subpaths merged into one `d`, which is why it carries fillRule.\n' +
    '// All three are already authored on the same 24x24 grid, so nothing is rescaled.\n' +
    '//\n' +
    '// Each `path` is the sole `d` of a `<path>` inside `viewBox="0 0 24 24"` with\n' +
    '// `fill: currentColor`. Order is the pill render order and is load-bearing.\n\n' +
    'export interface Logo {\n' +
    '  /** Visible pill label, also the link text. */\n' +
    '  title: string;\n' +
    '  /** Vendor homepage. */\n' +
    '  href: string;\n' +
    '  /** `d` for a 24x24 viewBox, single path, currentColor. */\n' +
    '  path: string;\n' +
    "  /** Only set where merged subpaths need it — omitted means the default 'nonzero'. */\n" +
    "  fillRule?: 'evenodd';\n" +
    '}\n\n' +
    'export const LOGOS: Logo[] = [\n' +
    rows.join('\n') +
    '\n];\n',
  'utf8'
);

console.log(`Wrote ${OUT} — ${LOGOS.length} pills, all with marks.`);
