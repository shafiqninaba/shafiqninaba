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
 * Langfuse and OpenAI have no mark in either set. They deliberately generate
 * `path: null` and render as label-only pills — a wrong or hand-traced brand
 * mark is worse than none.
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

/** Marks that exist in no icon set. Rendered label-only, on purpose. */
const NO_MARK = new Set(['OpenAI API', 'Langfuse']);

/**
 * [simple-icons export, pill label, vendor URL].
 * ORDER IS LOAD-BEARING — it is the render order of the pill list, grouped by
 * theme (language, ML, LLM tooling, serving, containers/IaC, cloud, CI, data).
 * It must stay in sync with SKILLS in src/data/content.ts.
 */
const LOGOS = [
  ['siPython', 'Python', 'https://www.python.org/'],
  ['siLinux', 'Linux', 'https://www.linux.org/'],
  ['siPytorch', 'PyTorch', 'https://pytorch.org/'],
  ['siTensorflow', 'TensorFlow', 'https://www.tensorflow.org/'],
  ['siScikitlearn', 'scikit-learn', 'https://scikit-learn.org/'],
  ['siMlflow', 'MLflow', 'https://mlflow.org/'],
  ['siKedro', 'Kedro', 'https://kedro.org/'],
  ['siLangchain', 'LangChain', 'https://www.langchain.com/'],
  ['siLanggraph', 'LangGraph', 'https://www.langchain.com/langgraph'],
  [null, 'Langfuse', 'https://langfuse.com/'],
  ['siPydantic', 'Pydantic', 'https://docs.pydantic.dev/'],
  [null, 'OpenAI API', 'https://platform.openai.com/'],
  ['siFastapi', 'FastAPI', 'https://fastapi.tiangolo.com/'],
  ['siFlask', 'Flask', 'https://flask.palletsprojects.com/'],
  ['siStreamlit', 'Streamlit', 'https://streamlit.io/'],
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
  ['siApachehive', 'Apache Hive', 'https://hive.apache.org/'],
  ['siPlotly', 'Plotly', 'https://plotly.com/'],
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const rows = LOGOS.map(([key, title, href]) => {
  if (key === null) {
    if (!NO_MARK.has(title)) throw new Error(`"${title}" has no key but is not in NO_MARK`);
    return `  { title: "${esc(title)}", href: "${esc(href)}", path: null },`;
  }
  const path = si[key]?.path ?? FALLBACK_PATHS[key];
  if (!path) throw new Error(`No path for "${key}" (${title}) — add one to FALLBACK_PATHS`);
  const note = si[key] ? '' : ' // not in simple-icons — see FALLBACK_PATHS in scripts/gen-logo-paths.mjs';
  return `  { title: "${esc(title)}", href: "${esc(href)}", path: "${esc(path)}" },${note}`;
});

const withMark = LOGOS.filter(([k]) => k !== null).length;

writeFileSync(
  OUT,
  '// GENERATED by scripts/gen-logo-paths.mjs. Do not edit by hand — run `pnpm gen:logos`.\n' +
    '// Marks come from simple-icons, except Azure and AWS, which simple-icons no longer\n' +
    '// ships; those two are taken verbatim from Material Design Icons (mdi:microsoft-azure,\n' +
    '// mdi:aws), already authored on the same 24x24 grid.\n' +
    '//\n' +
    '// `path: null` means no icon set ships that mark (OpenAI, Langfuse). Those pills\n' +
    '// render label-only rather than with an invented mark.\n' +
    '//\n' +
    '// Each `path` is the sole `d` of a `<path>` inside `viewBox="0 0 24 24"` with\n' +
    '// `fill: currentColor`. Order is the pill render order and is load-bearing.\n\n' +
    'export interface Logo {\n' +
    '  /** Visible pill label, also the link text. */\n' +
    '  title: string;\n' +
    '  /** Vendor homepage. */\n' +
    '  href: string;\n' +
    '  /** `d` for a 24x24 viewBox, single path, currentColor. null = no mark exists. */\n' +
    '  path: string | null;\n' +
    '}\n\n' +
    'export const LOGOS: Logo[] = [\n' +
    rows.join('\n') +
    '\n];\n',
  'utf8'
);

console.log(`Wrote ${OUT} — ${LOGOS.length} pills, ${withMark} with marks, ${LOGOS.length - withMark} label-only.`);
